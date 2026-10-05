const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');
const config = require('../config');

function formatUser(row) {
  let userMeta = {};
  let appMeta = { provider: 'email', providers: ['email'] };
  try { userMeta = JSON.parse(row.raw_user_meta_data || '{}'); } catch(e) {}
  try { appMeta = JSON.parse(row.raw_app_meta_data || '{}'); } catch(e) {}

  return {
    id: row.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: row.email || `guest_${row.id.slice(0, 8)}@minniie.internal`,
    email_confirmed_at: row.created_at,
    phone: '',
    confirmed_at: row.created_at,
    last_sign_in_at: new Date().toISOString(),
    app_metadata: appMeta,
    user_metadata: userMeta,
    identities: [],
    created_at: row.created_at,
    updated_at: row.updated_at,
    is_anonymous: row.is_anonymous === 1
  };
}

function generateTokens(user) {
  const payload = {
    aud: 'authenticated',
    sub: user.id,
    email: user.email,
    role: 'authenticated',
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata
  };

  const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, config.JWT_SECRET, { expiresIn: '30d' });

  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 604800,
    expires_at: Math.floor(Date.now() / 1000) + 604800,
    refresh_token: refreshToken,
    user: user
  };
}

// POST /auth/v1/signup
router.post('/signup', (req, res) => {
  try {
    const { email, password, data } = req.body || {};
    const now = new Date().toISOString();

    // Anonymous sign in (e.g. guest try-on)
    if (!email) {
      const guestId = crypto.randomUUID();
      const guestEmail = `guest_${guestId.slice(0, 8)}@minniie.internal`;
      db.prepare(`
        INSERT INTO users (id, email, raw_user_meta_data, is_anonymous, created_at, updated_at)
        VALUES (?, ?, ?, 1, ?, ?)
      `).run(guestId, guestEmail, JSON.stringify(data || {}), now, now);

      db.prepare(`
        INSERT INTO profiles (id, user_id, email, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(crypto.randomUUID(), guestId, guestEmail, now, now);

      db.prepare(`
        INSERT INTO subscribers (id, user_id, tier, subscribed, created_at)
        VALUES (?, ?, 'free', 0, ?)
      `).run(crypto.randomUUID(), guestId, now);

      const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(guestId);
      const user = formatUser(userRow);
      return res.status(200).json(generateTokens(user));
    }

    // Email / Password signup
    const normalizedEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({
        error: 'User already registered',
        message: 'User already registered',
        status: 400
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password || 'guest123', salt);
    const userId = crypto.randomUUID();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, raw_user_meta_data, is_anonymous, created_at, updated_at)
      VALUES (?, ?, ?, ?, 0, ?, ?)
    `).run(userId, normalizedEmail, passwordHash, JSON.stringify(data || {}), now, now);

    // Create profile
    db.prepare(`
      INSERT INTO profiles (id, user_id, email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), userId, normalizedEmail, now, now);

    // Create subscriber
    db.prepare(`
      INSERT INTO subscribers (id, user_id, tier, subscribed, created_at)
      VALUES (?, ?, 'free', 0, ?)
    `).run(crypto.randomUUID(), userId, now);

    // Create user role
    db.prepare(`
      INSERT INTO user_roles (id, user_id, role, created_at)
      VALUES (?, ?, 'user', ?)
    `).run(crypto.randomUUID(), userId, now);

    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    const user = formatUser(userRow);
    return res.status(200).json(generateTokens(user));
  } catch (err) {
    console.error('[Auth signup error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /auth/v1/token
router.post('/token', (req, res) => {
  try {
    const grantType = req.query.grant_type || req.body?.grant_type || 'password';

    if (grantType === 'password') {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
      if (!userRow || !userRow.password_hash) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }

      const valid = bcrypt.compareSync(password, userRow.password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }

      const user = formatUser(userRow);
      return res.status(200).json(generateTokens(user));
    }

    if (grantType === 'refresh_token') {
      const refreshToken = req.body?.refresh_token;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Missing refresh token' });
      }

      try {
        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
        const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.sub);
        if (!userRow) {
          return res.status(401).json({ error: 'User not found' });
        }
        const user = formatUser(userRow);
        return res.status(200).json(generateTokens(user));
      } catch (e) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
    }

    return res.status(400).json({ error: `Unsupported grant_type: ${grantType}` });
  } catch (err) {
    console.error('[Auth token error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /auth/v1/user
router.get('/user', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userRow = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.sub);
    if (!userRow) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json(formatUser(userRow));
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /auth/v1/logout
router.post('/logout', (req, res) => {
  return res.status(200).json({});
});

// POST /auth/v1/recover
router.post('/recover', (req, res) => {
  console.log('[Auth recovery requested for]:', req.body?.email);
  return res.status(200).json({});
});

module.exports = router;
