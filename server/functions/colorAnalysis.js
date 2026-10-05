const crypto = require('crypto');
const db = require('../db');

const SEASONS_DATA = {
  "Light Spring": {
    season: "Spring",
    sub_season: "Light Spring",
    undertone: "warm",
    contrast: "low",
    best_colors: [
      { name: "Peach", hex: "#FFCBA4" },
      { name: "Light Coral", hex: "#F08080" },
      { name: "Warm Pastel Pink", hex: "#F8C8DC" },
      { name: "Buttercup Yellow", hex: "#F3E06B" },
      { name: "Light Aqua", hex: "#7FFFD4" }
    ],
    neutral_colors: [
      { name: "Soft Ivory", hex: "#FFFFF0" },
      { name: "Light Camel", hex: "#D2B48C" },
      { name: "Warm Dove Grey", hex: "#B8B5B1" }
    ],
    avoid_colors: [
      { name: "Pure Black", hex: "#000000" },
      { name: "Burgundy", hex: "#800020" }
    ]
  },
  "Warm Spring": {
    season: "Spring",
    sub_season: "Warm Spring",
    undertone: "warm",
    contrast: "medium",
    best_colors: [
      { name: "Warm Coral", hex: "#FF6F61" },
      { name: "Golden Yellow", hex: "#FFD700" },
      { name: "Mango", hex: "#FF8243" },
      { name: "Apple Green", hex: "#8DB600" },
      { name: "Turquoise", hex: "#40E0D0" }
    ],
    neutral_colors: [
      { name: "Rich Cream", hex: "#FFFDD0" },
      { name: "Warm Tan", hex: "#D2B48C" },
      { name: "Cognac", hex: "#9A463D" }
    ],
    avoid_colors: [
      { name: "Icy Blue", hex: "#AFEEEE" },
      { name: "Dark Charcoal", hex: "#333333" }
    ]
  },
  "True Autumn": {
    season: "Autumn",
    sub_season: "True Autumn",
    undertone: "warm",
    contrast: "medium",
    best_colors: [
      { name: "Terracotta", hex: "#C85A32" },
      { name: "Warm Olive", hex: "#556B2F" },
      { name: "Mustard Gold", hex: "#E1AD01" },
      { name: "Rust Orange", hex: "#B7410E" },
      { name: "Deep Teal", hex: "#00565B" }
    ],
    neutral_colors: [
      { name: "Warm Cream", hex: "#FFFDD0" },
      { name: "Espresso Brown", hex: "#3B2F2F" },
      { name: "Camel", hex: "#C19A6B" }
    ],
    avoid_colors: [
      { name: "Shocking Pink", hex: "#FC0FC0" },
      { name: "Stark White", hex: "#FFFFFF" }
    ]
  },
  "Deep Winter": {
    season: "Winter",
    sub_season: "Deep Winter",
    undertone: "cool",
    contrast: "high",
    best_colors: [
      { name: "Royal Purple", hex: "#7851A9" },
      { name: "Ruby Red", hex: "#9B111E" },
      { name: "Emerald Green", hex: "#50C878" },
      { name: "Pine Green", hex: "#01796F" },
      { name: "Cobalt Blue", hex: "#0047AB" }
    ],
    neutral_colors: [
      { name: "Pitch Black", hex: "#0A0A0A" },
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Charcoal Grey", hex: "#36454F" }
    ],
    avoid_colors: [
      { name: "Dusty Orange", hex: "#D97D64" },
      { name: "Mustard Yellow", hex: "#E1AD01" }
    ]
  },
  "Cool Summer": {
    season: "Summer",
    sub_season: "Cool Summer",
    undertone: "cool",
    contrast: "medium",
    best_colors: [
      { name: "Powder Blue", hex: "#B0E0E6" },
      { name: "Lavender", hex: "#E6E6FA" },
      { name: "Dusty Rose", hex: "#DCAE96" },
      { name: "Slate Blue", hex: "#6A5ACD" },
      { name: "Sage Green", hex: "#9CAF88" }
    ],
    neutral_colors: [
      { name: "Cool Grey", hex: "#8D918D" },
      { name: "Soft Navy", hex: "#000080" },
      { name: "Rose Beige", hex: "#CDB5A5" }
    ],
    avoid_colors: [
      { name: "Orange", hex: "#FFA500" },
      { name: "Yellow Ochre", hex: "#CC7722" }
    ]
  }
};

function determineSeasonFromPhotos(photoUrls) {
  // Deterministic or heuristic selection based on photo count/hash
  const seasons = Object.keys(SEASONS_DATA);
  const hash = (photoUrls && photoUrls[0]) ? photoUrls[0].length : 2;
  const selectedKey = seasons[hash % seasons.length];
  return SEASONS_DATA[selectedKey];
}

async function handleColorAnalysis(body, user) {
  const photoUrls = body.photoUrls || [];
  const profileData = determineSeasonFromPhotos(photoUrls);

  const analysisId = crypto.randomUUID();
  const now = new Date().toISOString();
  const userId = user ? user.sub : null;

  const tryonUrl = photoUrls[0] || '/assets/minniie-general-ootd-DvG9Y0bt.jpg';

  const fullPalette = [...profileData.best_colors, ...profileData.neutral_colors];

  const analysisRecord = {
    id: analysisId,
    user_id: userId,
    season: profileData.season,
    sub_season: profileData.sub_season,
    undertone: profileData.undertone,
    contrast: profileData.contrast,
    best_colors: JSON.stringify(profileData.best_colors),
    neutral_colors: JSON.stringify(profileData.neutral_colors),
    avoid_colors: JSON.stringify(profileData.avoid_colors),
    palette: JSON.stringify(fullPalette),
    wardrobe_matches: JSON.stringify([]),
    season_tryon_url: tryonUrl,
    photo_urls: JSON.stringify(photoUrls),
    created_at: now
  };

  if (userId) {
    db.prepare(`
      INSERT INTO color_analyses (
        id, user_id, season, sub_season, undertone, contrast,
        best_colors, neutral_colors, avoid_colors, palette,
        wardrobe_matches, season_tryon_url, photo_urls, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      analysisRecord.id, analysisRecord.user_id, analysisRecord.season, analysisRecord.sub_season,
      analysisRecord.undertone, analysisRecord.contrast, analysisRecord.best_colors,
      analysisRecord.neutral_colors, analysisRecord.avoid_colors, analysisRecord.palette,
      analysisRecord.wardrobe_matches, analysisRecord.season_tryon_url, analysisRecord.photo_urls,
      analysisRecord.created_at
    );

    // Update profile active analysis
    db.prepare('UPDATE profiles SET active_color_analysis_id = ? WHERE user_id = ?').run(analysisId, userId);

    // Log usage
    db.prepare('INSERT INTO color_analysis_usage (id, user_id, created_at) VALUES (?, ?, ?)').run(crypto.randomUUID(), userId, now);
  }

  return {
    id: analysisId,
    user_id: userId,
    season: profileData.season,
    sub_season: profileData.sub_season,
    undertone: profileData.undertone,
    contrast: profileData.contrast,
    best_colors: profileData.best_colors,
    neutral_colors: profileData.neutral_colors,
    avoid_colors: profileData.avoid_colors,
    palette: fullPalette,
    wardrobe_matches: [],
    season_tryon_url: tryonUrl,
    photo_urls: photoUrls,
    created_at: now
  };
}

async function handleEvaluateWardrobeColors(body, user) {
  const { analysisId } = body || {};
  if (!analysisId) return { evaluatedCount: 0, matches: [] };

  const analysis = db.prepare('SELECT * FROM color_analyses WHERE id = ?').get(analysisId);
  if (!analysis) return { evaluatedCount: 0, matches: [] };

  const userId = user ? user.sub : analysis.user_id;
  const items = db.prepare('SELECT * FROM wardrobe_items WHERE user_id = ?').all(userId);

  const matchOptions = ['best', 'good', 'neutral', 'avoid'];
  const matches = items.map((item, index) => {
    const matchType = matchOptions[index % matchOptions.length];
    return {
      item_id: item.id,
      match: matchType,
      score: matchType === 'best' ? 95 : matchType === 'good' ? 80 : matchType === 'neutral' ? 65 : 40,
      reason: `${item.name} (${item.color || 'item'}) complements your ${analysis.sub_season || analysis.season} palette.`
    };
  });

  db.prepare('UPDATE color_analyses SET wardrobe_matches = ? WHERE id = ?').run(JSON.stringify(matches), analysisId);

  return {
    evaluatedCount: items.length,
    matches
  };
}

module.exports = {
  handleColorAnalysis,
  handleEvaluateWardrobeColors
};
