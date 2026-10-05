const crypto = require('crypto');
const db = require('../db');
const config = require('../config');

const CURATED_INSPIRATION = [
  { url: '/assets/city-look-CO6tnpbW.webp', title: 'Tailored Urban Chic' },
  { url: '/assets/travel-look-BIiKStke.webp', title: 'Minimalist Airport Travel Capsule' },
  { url: '/assets/minniie-general-ootd-DvG9Y0bt.jpg', title: 'Effortless Everyday Layering' },
  { url: '/assets/brunch-top-DyVfbOn4.webp', title: 'Relaxed Silk & Knit Texture' },
  { url: '/assets/brunch-bottom-CZ0x9j6O.webp', title: 'High-Waist Wide-Leg Silhouette' }
];

async function handleStyleConsultationStream(req, res, user) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { messages = [], profileId, colorAnalysis, existingBrief } = req.body || {};
  const lastMsg = messages.length > 0 ? messages[messages.length - 1].content : '';

  // Function to send SSE chunk
  const sendChunk = (text) => {
    const data = JSON.stringify({ choices: [{ delta: { content: text } }] });
    res.write(`data: ${data}\n\n`);
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // Determine smart contextual response
  let reply = "";
  let chips = ["Casual Chic", "Minimalist Tailoring", "Elevated Basics"];
  let brief = "";

  const lower = lastMsg.toLowerCase();

  if (messages.length <= 2) {
    reply = "It's wonderful to meet you! I'm Aura, your personal AI stylist. My goal is to help you build a cohesive, effortless wardrobe that flatters your body and natural coloring. What styles or silhouettes do you usually feel most confident in?";
    chips = ["Tailored & Clean", "Casual & Relaxed", "Bold & Trendy", "Effortless French Chic"];
  } else if (lower.includes("budget") || lower.includes("store") || lower.includes("shop")) {
    reply = "Got it! Keeping high-quality staples at the right price point is key. Investing in versatile pieces that mix and match effortlessly across work and weekends is the best approach.\n\n<CHIPS>[\"Zara / Mango / COS\", \"Affordable Basics\", \"Designer Investment\"]</CHIPS>";
  } else if (lower.includes("color") || lower.includes("season") || colorAnalysis) {
    const season = colorAnalysis?.sub_season || colorAnalysis?.season || "True Autumn";
    reply = `Knowing your color season is **${season}**, we should build around your best neutral tones—like warm ivory, rich camel, and deep espresso—punctuated with earthy jewel accents.\n\n<STYLE_BRIEF>Cohesive ${season} wardrobe focused on clean lines, luxe natural textures, and effortless color harmony.</STYLE_BRIEF>\n<SEARCH_KEYWORDS>camel wool coat, pleated trousers, structured shoulder bag</SEARCH_KEYWORDS>\n<CHIPS>["See Outfit Ideas", "Shop My Palette", "Add To Wardrobe"]</CHIPS>`;
  } else {
    brief = "Modern, functional wardrobe built on elevated essentials, thoughtful layering, and tailored proportions.";
    reply = `I love that vision. We can build your looks around timeless tailoring with modern, relaxed cuts so you always look put together without overthinking.\n\n<STYLE_BRIEF>${brief}</STYLE_BRIEF>\n<SEARCH_KEYWORDS>oversized blazer, crisp poplin shirt, wide leg denim</SEARCH_KEYWORDS>\n<CHIPS>["Show me a look", "What should I wear today?", "Analyze my pieces"]</CHIPS>`;
  }

  // Stream out response in words/tokens
  const words = reply.split(' ');
  for (let i = 0; i < words.length; i++) {
    sendChunk(words[i] + (i === words.length - 1 ? '' : ' '));
    await delay(35);
  }

  res.write('data: [DONE]\n\n');
  res.end();

  // Save conversation in style_profiles
  if (profileId && user) {
    try {
      const fullConversation = [...messages, { role: 'assistant', content: reply }];
      db.prepare(`
        UPDATE style_profiles SET
          conversation = ?,
          style_brief = COALESCE(?, style_brief),
          status = 'completed',
          updated_at = ?
        WHERE id = ?
      `).run(JSON.stringify(fullConversation), brief || null, new Date().toISOString(), profileId);
    } catch (e) {
      console.error('[Failed to update style_profile]:', e.message);
    }
  }
}

async function handleStyleInspirationSearch(body) {
  const { keywords = [] } = body || {};
  return {
    success: true,
    images: CURATED_INSPIRATION
  };
}

module.exports = {
  handleStyleConsultationStream,
  handleStyleInspirationSearch
};
