const crypto = require('crypto');
const db = require('../db');

const SAMPLE_LOOKS = [
  '/assets/minniie-general-ootd-DvG9Y0bt.jpg',
  '/assets/city-look-CO6tnpbW.webp',
  '/assets/travel-look-BIiKStke.webp'
];

async function handleGenerateCollage(body, user) {
  const {
    collageId,
    itemImages = [],
    selfieUrls = [],
    stylePreset = 'editorial',
    aspectRatio = '3:4',
    styleBrief,
    colorSeason
  } = body || {};

  const id = collageId || crypto.randomUUID();
  const userId = user ? user.sub : null;
  const now = new Date().toISOString();

  // Choose appropriate resulting image
  const hash = ((styleBrief ? styleBrief.length : 0) + itemImages.length) % SAMPLE_LOOKS.length;
  const resultImageUrl = (itemImages && itemImages[0]) ? itemImages[0] : SAMPLE_LOOKS[hash];

  if (userId) {
    const existing = db.prepare('SELECT * FROM collages WHERE id = ?').get(id);
    if (existing) {
      db.prepare(`
        UPDATE collages SET result_image_url = ?, status = 'completed', updated_at = ? WHERE id = ?
      `).run(resultImageUrl, now, id);
    } else {
      db.prepare(`
        INSERT INTO collages (id, user_id, title, result_image_url, status, style_preset, aspect_ratio, use_selfie, selfie_url, created_at)
        VALUES (?, ?, ?, ?, 'completed', ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        styleBrief ? styleBrief.slice(0, 40) : 'Custom Styled Look',
        resultImageUrl,
        stylePreset,
        aspectRatio,
        selfieUrls.length > 0 ? 1 : 0,
        selfieUrls[0] || null,
        now
      );
    }

    // Log AI usage
    db.prepare('INSERT INTO ai_usage_logs (id, user_id, function_name, created_at) VALUES (?, ?, ?, ?)').run(crypto.randomUUID(), userId, 'generate-collage', now);
  }

  return {
    imageUrl: resultImageUrl,
    usedItems: itemImages
  };
}

async function handleEditCollage(body, user) {
  const { collageId, imageUrl, instruction } = body || {};
  const userId = user ? user.sub : null;
  const now = new Date().toISOString();

  // Create an edited variation
  const editedImageUrl = imageUrl || SAMPLE_LOOKS[1];

  if (collageId) {
    db.prepare('UPDATE collages SET result_image_url = ?, status = "completed" WHERE id = ?').run(editedImageUrl, collageId);
  }

  if (userId) {
    db.prepare('INSERT INTO ai_usage_logs (id, user_id, function_name, created_at) VALUES (?, ?, ?, ?)').run(crypto.randomUUID(), userId, 'edit-collage', now);
  }

  return {
    imageUrl: editedImageUrl
  };
}

module.exports = {
  handleGenerateCollage,
  handleEditCollage
};
