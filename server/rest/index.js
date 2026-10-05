const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const config = require('../config');

const JSON_COLUMNS = {
  profiles: ['style_preferences'],
  color_analyses: ['best_colors', 'neutral_colors', 'avoid_colors', 'palette', 'wardrobe_matches', 'photo_urls'],
  style_profiles: ['conversation', 'style_keywords'],
  outfit_analyses: ['detected_items', 'matched_items', 'missing_items'],
  users: ['raw_user_meta_data', 'raw_app_meta_data'],
  analytics_events: ['payload']
};

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice(7);
    return jwt.verify(token, config.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function parseRow(table, row) {
  if (!row) return row;
  const jsonCols = JSON_COLUMNS[table] || [];
  const parsed = { ...row };
  for (const col of jsonCols) {
    if (parsed[col] !== undefined && typeof parsed[col] === 'string') {
      try {
        parsed[col] = JSON.parse(parsed[col]);
      } catch (e) {
        // keep as is
      }
    }
  }
  // Convert 0/1 integers to boolean for boolean columns
  const boolCols = ['color_labels_enabled', 'use_selfie', 'subscribed', 'manual_override', 'cancel_at_period_end'];
  for (const b of boolCols) {
    if (parsed[b] !== undefined && typeof parsed[b] === 'number') {
      parsed[b] = parsed[b] === 1;
    }
  }
  return parsed;
}

function parseFilter(col, rawVal) {
  // e.g. eq.123, neq.abc, gt.10, gte.2026-01-01, in.(a,b), is.null, not.in.(a,b)
  if (typeof rawVal !== 'string') return { clause: `"${col}" = ?`, params: [rawVal] };

  if (rawVal.startsWith('eq.')) {
    const val = rawVal.slice(3);
    return { clause: `"${col}" = ?`, params: [val] };
  }
  if (rawVal.startsWith('neq.')) {
    const val = rawVal.slice(4);
    return { clause: `"${col}" != ?`, params: [val] };
  }
  if (rawVal.startsWith('gt.')) {
    const val = rawVal.slice(3);
    return { clause: `"${col}" > ?`, params: [val] };
  }
  if (rawVal.startsWith('gte.')) {
    const val = rawVal.slice(4);
    return { clause: `"${col}" >= ?`, params: [val] };
  }
  if (rawVal.startsWith('lt.')) {
    const val = rawVal.slice(3);
    return { clause: `"${col}" < ?`, params: [val] };
  }
  if (rawVal.startsWith('lte.')) {
    const val = rawVal.slice(4);
    return { clause: `"${col}" <= ?`, params: [val] };
  }
  if (rawVal.startsWith('is.')) {
    const val = rawVal.slice(3);
    if (val === 'null') return { clause: `"${col}" IS NULL`, params: [] };
    if (val === 'not.null') return { clause: `"${col}" IS NOT NULL`, params: [] };
    return { clause: `"${col}" IS ?`, params: [val] };
  }
  if (rawVal.startsWith('in.')) {
    const inner = rawVal.slice(4, -1); // remove in.( and )
    const parts = inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    const placeholders = parts.map(() => '?').join(',');
    return { clause: `"${col}" IN (${placeholders})`, params: parts };
  }
  if (rawVal.startsWith('not.in.')) {
    const inner = rawVal.slice(8, -1);
    const parts = inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    const placeholders = parts.map(() => '?').join(',');
    return { clause: `"${col}" NOT IN (${placeholders})`, params: parts };
  }
  if (rawVal.startsWith('not.eq.')) {
    const val = rawVal.slice(7);
    return { clause: `"${col}" != ?`, params: [val] };
  }

  return { clause: `"${col}" = ?`, params: [rawVal] };
}

function parseOrClause(rawOr) {
  // e.g. or=(board_name.is.null,board_name.not.in.("Chat Uploads","AI Stylist Picks","Styled Looks"))
  if (!rawOr) return null;
  const inner = rawOr.replace(/^\(|\)$/g, '');
  // split on comma not inside quotes or parentheses
  const parts = [];
  let cur = '';
  let inParen = 0;
  let inQuote = false;

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (char === '"' || char === "'") inQuote = !inQuote;
    else if (char === '(' && !inQuote) inParen++;
    else if (char === ')' && !inQuote) inParen--;
    else if (char === ',' && !inQuote && inParen === 0) {
      parts.push(cur.trim());
      cur = '';
      continue;
    }
    cur += char;
  }
  if (cur.trim()) parts.push(cur.trim());

  const subClauses = [];
  const subParams = [];

  for (const part of parts) {
    const firstDot = part.indexOf('.');
    if (firstDot === -1) continue;
    const col = part.slice(0, firstDot);
    const opVal = part.slice(firstDot + 1);
    const parsed = parseFilter(col, opVal);
    subClauses.push(parsed.clause);
    subParams.push(...parsed.params);
  }

  if (subClauses.length === 0) return null;
  return { clause: `(${subClauses.join(' OR ')})`, params: subParams };
}

function buildQuery(table, req) {
  const query = req.query;
  const whereClauses = [];
  const params = [];

  for (const [key, val] of Object.entries(query)) {
    if (['select', 'order', 'limit', 'offset', 'apikey'].includes(key)) continue;

    if (key === 'or') {
      const orParsed = parseOrClause(val);
      if (orParsed) {
        whereClauses.push(orParsed.clause);
        params.push(...orParsed.params);
      }
      continue;
    }

    // regular column filter
    const parsed = parseFilter(key, val);
    whereClauses.push(parsed.clause);
    params.push(...parsed.params);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Order
  let orderSQL = '';
  if (query.order) {
    const parts = query.order.split(',').map(p => {
      const segs = p.trim().split('.');
      const col = segs[0];
      const dir = segs[1] && segs[1].toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      return `"${col}" ${dir}`;
    });
    orderSQL = `ORDER BY ${parts.join(', ')}`;
  }

  // Limit / Offset
  let limitSQL = '';
  if (query.limit) {
    const l = parseInt(query.limit, 10);
    if (!isNaN(l)) {
      limitSQL = `LIMIT ${l}`;
      if (query.offset) {
        const o = parseInt(query.offset, 10);
        if (!isNaN(o)) limitSQL += ` OFFSET ${o}`;
      }
    }
  }

  return { whereSQL, orderSQL, limitSQL, params };
}

// Check table exists in SQLite
function checkTable(table) {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?").get(table);
  return !!row;
}

// GET /rest/v1/:table
router.get('/:table', (req, res) => {
  try {
    const table = req.params.table;
    if (!checkTable(table)) {
      return res.status(404).json({ error: `Table "${table}" not found` });
    }

    const { whereSQL, orderSQL, limitSQL, params } = buildQuery(table, req);

    // Check count preference
    const prefer = req.headers.prefer || '';
    const wantsExactCount = prefer.includes('count=exact') || req.query.select?.includes('count:');

    let totalCount = 0;
    if (wantsExactCount) {
      const countRow = db.prepare(`SELECT COUNT(*) as total FROM "${table}" ${whereSQL}`).get(...params);
      totalCount = countRow ? countRow.total : 0;
      res.setHeader('x-total-count', totalCount);
    }

    // If head request only (e.g. select id with head: true)
    if (req.method === 'HEAD' || req.query.head === 'true') {
      res.setHeader('Content-Range', `0-0/${totalCount}`);
      return res.status(200).end();
    }

    const selectFields = req.query.select || '*';
    let sql = `SELECT * FROM "${table}" ${whereSQL} ${orderSQL} ${limitSQL}`;
    const rows = db.prepare(sql).all(...params).map(r => parseRow(table, r));

    // Handle column selection if not '*'
    let results = rows;
    if (selectFields !== '*' && !selectFields.includes('count')) {
      const cols = selectFields.split(',').map(c => c.trim()).filter(Boolean);
      results = rows.map(row => {
        const picked = {};
        for (const col of cols) {
          if (row[col] !== undefined) picked[col] = row[col];
        }
        return picked;
      });
    }

    // Range header
    if (wantsExactCount) {
      const start = req.query.offset ? parseInt(req.query.offset, 10) : 0;
      const end = results.length > 0 ? start + results.length - 1 : 0;
      res.setHeader('Content-Range', `${start}-${end}/${totalCount}`);
    }

    // PostgREST single object accept header
    const accept = req.headers.accept || '';
    if (accept.includes('application/vnd.pgrst.object+json')) {
      if (results.length === 0) {
        return res.status(406).json({ message: 'JSON object requested, multiple (or no) rows returned', details: 'The result contains 0 rows' });
      }
      return res.status(200).json(results[0]);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(`[REST GET /${req.params.table} error]:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /rest/v1/:table
router.post('/:table', (req, res) => {
  try {
    const table = req.params.table;
    if (!checkTable(table)) {
      return res.status(404).json({ error: `Table "${table}" not found` });
    }

    const user = getAuthUser(req);
    const now = new Date().toISOString();
    const body = Array.isArray(req.body) ? req.body : [req.body || {}];
    const insertedRows = [];

    const jsonCols = JSON_COLUMNS[table] || [];

    for (const item of body) {
      const data = { ...item };
      if (!data.id) data.id = crypto.randomUUID();
      if (!data.created_at) data.created_at = now;
      if (user && !data.user_id && table !== 'plan_limits') {
        data.user_id = user.sub;
      }

      // Stringify JSON columns
      for (const col of jsonCols) {
        if (data[col] !== undefined && typeof data[col] !== 'string') {
          data[col] = JSON.stringify(data[col]);
        }
      }

      // Convert boolean to 0/1
      for (const [k, v] of Object.entries(data)) {
        if (typeof v === 'boolean') data[k] = v ? 1 : 0;
      }

      const keys = Object.keys(data);
      const placeholders = keys.map(() => '?').join(', ');
      const cols = keys.map(k => `"${k}"`).join(', ');
      const vals = Object.values(data);

      const sql = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders})`;
      db.prepare(sql).run(...vals);

      const inserted = db.prepare(`SELECT * FROM "${table}" WHERE id = ?`).get(data.id);
      insertedRows.push(parseRow(table, inserted));
    }

    const accept = req.headers.accept || '';
    if (accept.includes('application/vnd.pgrst.object+json') || (!Array.isArray(req.body) && req.headers.prefer?.includes('return=representation'))) {
      return res.status(201).json(insertedRows[0]);
    }

    return res.status(201).json(insertedRows);
  } catch (err) {
    console.error(`[REST POST /${req.params.table} error]:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /rest/v1/:table
router.patch('/:table', (req, res) => {
  try {
    const table = req.params.table;
    if (!checkTable(table)) {
      return res.status(404).json({ error: `Table "${table}" not found` });
    }

    const { whereSQL, params } = buildQuery(table, req);
    if (!whereSQL) {
      return res.status(400).json({ error: 'Filter required for update' });
    }

    const jsonCols = JSON_COLUMNS[table] || [];
    const updateData = { ...req.body };
    updateData.updated_at = new Date().toISOString();

    // Stringify JSON columns
    for (const col of jsonCols) {
      if (updateData[col] !== undefined && typeof updateData[col] !== 'string') {
        updateData[col] = JSON.stringify(updateData[col]);
      }
    }

    // Convert booleans
    for (const [k, v] of Object.entries(updateData)) {
      if (typeof v === 'boolean') updateData[k] = v ? 1 : 0;
    }

    const setClauses = [];
    const setParams = [];
    for (const [k, v] of Object.entries(updateData)) {
      setClauses.push(`"${k}" = ?`);
      setParams.push(v);
    }

    const sql = `UPDATE "${table}" SET ${setClauses.join(', ')} ${whereSQL}`;
    db.prepare(sql).run(...setParams, ...params);

    // Return updated records
    const updatedRows = db.prepare(`SELECT * FROM "${table}" ${whereSQL}`).all(...params).map(r => parseRow(table, r));

    const accept = req.headers.accept || '';
    if (accept.includes('application/vnd.pgrst.object+json')) {
      return res.status(200).json(updatedRows[0] || null);
    }

    return res.status(200).json(updatedRows);
  } catch (err) {
    console.error(`[REST PATCH /${req.params.table} error]:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /rest/v1/:table
router.delete('/:table', (req, res) => {
  try {
    const table = req.params.table;
    if (!checkTable(table)) {
      return res.status(404).json({ error: `Table "${table}" not found` });
    }

    const { whereSQL, params } = buildQuery(table, req);
    if (!whereSQL) {
      return res.status(400).json({ error: 'Filter required for delete' });
    }

    db.prepare(`DELETE FROM "${table}" ${whereSQL}`).run(...params);
    return res.status(204).end();
  } catch (err) {
    console.error(`[REST DELETE /${req.params.table} error]:`, err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
