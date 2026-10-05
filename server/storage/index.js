const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config');

// Ensure upload bucket directories exist
const BUCKETS = ['avatars', 'wardrobe-images', 'collage-assets', 'marketing-public'];
for (const b of BUCKETS) {
  const p = path.join(config.UPLOADS_DIR, b);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
}

const upload = multer({ storage: multer.memoryStorage() });

// Helper to determine content-type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    case '.gif': return 'image/gif';
    default: return 'application/octet-stream';
  }
}

// POST /storage/v1/object/:bucket/*
// Supports raw binary stream and multipart/form-data uploads
router.post('/object/:bucket/*', (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('file')(req, res, next);
  }
  next();
}, (req, res) => {
  try {
    const bucket = req.params.bucket;
    const objectPath = req.params[0];
    if (!objectPath) {
      return res.status(400).json({ error: 'Missing object path' });
    }

    const targetDir = path.join(config.UPLOADS_DIR, bucket);
    const fullPath = path.join(targetDir, objectPath);
    const parentDir = path.dirname(fullPath);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // If uploaded via multipart/form-data
    if (req.file && req.file.buffer) {
      fs.writeFileSync(fullPath, req.file.buffer);
      return res.status(200).json({
        Key: `${bucket}/${objectPath}`,
        Id: objectPath
      });
    }

    // If streamed raw binary
    const writeStream = fs.createWriteStream(fullPath);
    req.pipe(writeStream);

    writeStream.on('finish', () => {
      return res.status(200).json({
        Key: `${bucket}/${objectPath}`,
        Id: objectPath
      });
    });

    writeStream.on('error', (err) => {
      console.error('[Storage upload write error]:', err);
      return res.status(500).json({ error: err.message });
    });
  } catch (err) {
    console.error('[Storage upload error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /storage/v1/object/public/:bucket/*
router.get('/object/public/:bucket/*', (req, res) => {
  try {
    const bucket = req.params.bucket;
    const objectPath = req.params[0];
    const fullPath = path.join(config.UPLOADS_DIR, bucket, objectPath);

    if (!fs.existsSync(fullPath)) {
      // If it's marketing-public og-image or similar fallback
      if (bucket === 'marketing-public') {
        const logoPath = path.join(__dirname, '..', '..', 'assets', 'minniie-general-ootd-DvG9Y0bt.jpg');
        if (fs.existsSync(logoPath)) {
          return res.sendFile(logoPath);
        }
      }
      return res.status(404).json({ error: 'Object not found' });
    }

    res.setHeader('Content-Type', getContentType(fullPath));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.sendFile(fullPath);
  } catch (err) {
    console.error('[Storage get error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /storage/v1/object/:bucket
router.delete('/object/:bucket', (req, res) => {
  try {
    const bucket = req.params.bucket;
    const { prefixes } = req.body || {};
    const deleted = [];

    if (Array.isArray(prefixes)) {
      for (const p of prefixes) {
        const fullPath = path.join(config.UPLOADS_DIR, bucket, p);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          deleted.push({ name: p });
        }
      }
    }

    return res.status(200).json(deleted);
  } catch (err) {
    console.error('[Storage delete error]:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
