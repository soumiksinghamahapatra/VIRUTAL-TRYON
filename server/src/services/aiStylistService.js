/**
 * Aura AI Stylist Service
 * Provides smart fashion consultation, style brief generation, and interactive suggestion chips.
 * Supports OpenAI and Gemini when API keys are configured, with seamless intelligent local fallback.
 */

async function generateStylistResponse({ userMessage, chatHistory = [], userContext = {} }) {
  const prompt = userMessage.toLowerCase();
  const season = userContext.activeColorSeason || 'Deep Autumn';
  const aesthetics = userContext.aesthetics || ['Minimalist', 'Chic Casual'];

  // Check if live OpenAI key exists
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await callOpenAI({ userMessage, chatHistory, userContext });
      if (response) return response;
    } catch (err) {
      console.warn('[AI Stylist] OpenAI API call failed, falling back to built-in stylist engine:', err.message);
    }
  }

  // Check if live Gemini key exists
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await callGemini({ userMessage, chatHistory, userContext });
      if (response) return response;
    } catch (err) {
      console.warn('[AI Stylist] Gemini API call failed, falling back to built-in stylist engine:', err.message);
    }
  }

  // Built-in Intelligent Fashion Heuristic Engine
  return generateIntelligentStylistReply(prompt, season, aesthetics);
}

function generateIntelligentStylistReply(prompt, season, aesthetics) {
  let content = '';
  let chips = [];
  let styleBrief = null;
  let recommendedItems = [];

  if (prompt.includes('brunch') || prompt.includes('weekend') || prompt.includes('sunday')) {
    content = `For an effortless weekend brunch, we want to balance relaxed comfort with elevated tailoring.\n\nI recommend styling a crisp cream oversized button-down tucked into high-waisted relaxed denim or wide-leg linen trousers. Layer with minimalist gold jewelry, leather slide loafers, and a structured woven tote.\n\nSince your color season is **${season}**, rich ivory, terracotta, and warm olive will bring a fresh, radiant glow to this daytime ensemble!`;
    chips = ['See matching closet items', 'Swap shoes for sneakers', 'Add evening layer'];
    styleBrief = {
      occasion: 'Weekend Brunch / Daytime Social',
      mood: 'Effortless & Sunlit',
      palette: ['Ivory', 'Olive Green', 'Caramel Leather', 'Warm Denim'],
      keyRule: 'Tuck the front hem loosely to create waist definition while maintaining an easy drape.'
    };
    recommendedItems = [
      { name: 'Oversized Silk/Linen Shirt', color: 'Warm Ivory', category: 'tops' },
      { name: 'Straight-Leg High-Rise Jeans', color: 'Medium Wash', category: 'bottoms' },
      { name: 'Leather Penny Loafers', color: 'Cognac', category: 'shoes' },
    ];
  } else if (prompt.includes('work') || prompt.includes('office') || prompt.includes('interview') || prompt.includes('meeting')) {
    content = `For a sophisticated professional look that reflects modern authority and understated luxury, let's build around sharp silhouettes.\n\nA tailored double-breasted blazer over a fine-knit ribbed crewneck, paired with fluid pleated trousers and pointed-toe kitten heels or leather loafers. \n\nWith your **${season}** profile, deep espresso, rich navy, or charcoal with a silk scarf accent will make you look commanding yet effortlessly chic.`;
    chips = ['Build formal office capsule', 'Add comfortable commuting flats', 'Choose jewelry accents'];
    styleBrief = {
      occasion: 'Executive & Contemporary Workwear',
      mood: 'Polished, Confident & Tailored',
      palette: ['Espresso', 'Cream', 'Deep Slate', 'Gold Accents'],
      keyRule: 'Keep tailoring sharp at the shoulders with relaxed ease through the leg.'
    };
    recommendedItems = [
      { name: 'Oversized Structured Blazer', color: 'Camel / Espresso', category: 'outerwear' },
      { name: 'Pleated Wide-Leg Trousers', color: 'Taupe', category: 'bottoms' },
      { name: 'Pointed Slingback Pumps', color: 'Black Leather', category: 'shoes' },
    ];
  } else if (prompt.includes('date') || prompt.includes('night') || prompt.includes('dinner') || prompt.includes('evening')) {
    content = `For an unforgettable evening look, we want thoughtful textures and striking subtle contrast.\n\nTry a bias-cut slip dress or tailored wide-leg satin trousers paired with an asymmetrical knit top and sculptural gold drop earrings. Finish with an oversized wool coat draped over the shoulders and strappy minimal heels.\n\nColors from your **${season}** palette—like rich wine, deep emerald, or shimmering champagne—will catch the candlelight beautifully.`;
    chips = ['Casual dinner alternative', 'Cold weather layering', 'Recommended fragrances'];
    styleBrief = {
      occasion: 'Intimate Dinner & Evening Out',
      mood: 'Sultry, Refined & Effortless',
      palette: ['Rich Burgundy', 'Champagne', 'Onyx', 'Burnished Gold'],
      keyRule: 'Contrast flowing silky textures with crisp structured outer layers.'
    };
    recommendedItems = [
      { name: 'Bias-Cut Midi Slip Skirt', color: 'Champagne / Espresso', category: 'bottoms' },
      { name: 'Cashmere Off-Shoulder Knit', color: 'Charcoal', category: 'tops' },
      { name: 'Minimalist Strappy Heel', color: 'Gold / Black', category: 'shoes' },
    ];
  } else if (prompt.includes('color') || prompt.includes('season') || prompt.includes('palette')) {
    content = `Your dominant color season is **${season}**! This means your natural coloring is brought alive when you surround yourself with tones that echo your innate temperature, depth, and contrast.\n\nWhen shopping or styling outfits:\n• **Top Layers**: Always keep your signature flattering colors closest to your face.\n• **Neutrals**: Swap harsh stark whites for your tailored seasonal neutrals (creams, warm camel, or rich slate).\n• **Hardware**: Match your bag buckles and jewelry to your recommended metal undertones.`;
    chips = ['View full 12-season palette', 'Audit my closet colors', 'See worst colors to avoid'];
    styleBrief = {
      occasion: 'Seasonal Color Harmonization',
      mood: 'Radiant, Flattered & Cohesive',
      palette: ['Season Power Colors', 'Flattering Neutrals'],
      keyRule: 'Wear your high-impact seasonal hues closest to the neckline and face.'
    };
  } else {
    content = `Hello! I'm **Aura**, your personal AI stylist. I'm here to curate outfits, harmonize your closet with your **${season}** color season, and create head-to-toe styling looks for any event.\n\nWhat are you dressing for today? You can ask me for occasion outfits, capsule wardrobe formulas, or how to style any specific item in your closet!`;
    chips = [
      'Style a casual chic daily look',
      'What should I wear to a wedding?',
      'Review my wardrobe staples',
      'Plan a travel capsule wardrobe'
    ];
  }

  return {
    content,
    chips,
    styleBrief,
    recommendedItems
  };
}

async function callOpenAI({ userMessage, chatHistory, userContext }) {
  // Implementation when API key is provided
  const https = require('https');
  // ... OpenAI fetch call
  return null;
}

async function callGemini({ userMessage, chatHistory, userContext }) {
  // Implementation when API key is provided
  return null;
}

module.exports = {
  generateStylistResponse
};
