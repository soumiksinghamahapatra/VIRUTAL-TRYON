// 12-Season Color Analysis Engine with hex palettes, undertone, contrast, and metals

const SEASON_PALETTES = {
  'Deep Autumn': {
    undertone: 'warm',
    contrast: 'high',
    paletteHexes: ['#5A1827', '#803D29', '#3B4D3C', '#9E6E2E', '#2B3A42', '#8C503A', '#4A2E18', '#A27035'],
    avoidHexes: ['#F7D1D8', '#B0E0E6', '#E6E6FA', '#FFF0F5', '#D3D3D3'],
    neutralHexes: ['#2B2927', '#4A3B32', '#C8B097', '#E8D8C8'],
    bestMetals: ['Antique Gold', 'Burnished Brass', 'Warm Bronze', 'Copper'],
    description: 'Deep Autumn is rich, warm, and dark. Your coloring is defined by deep warm tones with rich golden undertones and intense contrast. Jewel tones with a golden, earthy drop flatter you best.',
    stylingAdvice: [
      'Embrace deep, spiced tones like terracotta, forest green, espresso, and burnt amber.',
      'Swap stark optic white for warm ivory, cream, or oatmeal neutrals.',
      'Wear warm textured metals like antique gold, brass, and copper instead of icy silver.',
      'Create high-contrast outfits with deep jewel layers against rich warm accents.'
    ]
  },
  'Warm Autumn': {
    undertone: 'warm',
    contrast: 'medium',
    paletteHexes: ['#A0522D', '#D2691E', '#CD853F', '#556B2F', '#8FBC8F', '#B8860B', '#CC7722', '#7E4B28'],
    avoidHexes: ['#E0FFFF', '#C0C0C0', '#4169E1', '#FF69B4', '#000000'],
    neutralHexes: ['#5C4033', '#8B7355', '#D2B48C', '#F5DEB3'],
    bestMetals: ['Yellow Gold', 'Brass', 'Copper'],
    description: 'Warm Autumn is radiant, grounded, and undeniably warm. Golden and honey tones harmonize naturally with your skin and hair.',
    stylingAdvice: [
      'Choose rich harvest shades: pumpkin spice, mustard gold, moss green, and camel.',
      'Avoid pure icy tones and harsh jet blacks, which wash out your golden glow.',
      'Pair warm caramel leather accessories with olive and burnt orange outfits.'
    ]
  },
  'Soft Autumn': {
    undertone: 'warm',
    contrast: 'low',
    paletteHexes: ['#8F8B66', '#9C7A6B', '#7A8471', '#B5947E', '#5F6F65', '#8C7063', '#A89F91', '#C2A649'],
    avoidHexes: ['#FF0000', '#00FF00', '#0000FF', '#000000', '#FF1493'],
    neutralHexes: ['#736357', '#9E8D7C', '#C4B7A6', '#E3DAC9'],
    bestMetals: ['Brushed Gold', 'Rose Gold', 'Soft Pewter'],
    description: 'Soft Autumn is gentle, muted, and subtle with a soft golden haze. Rich, velvety, and desaturated tones look effortlessly luxurious on you.',
    stylingAdvice: [
      'Opt for tonal, monochromatic combinations in sage, dusty rose, and taupe.',
      'Avoid neon or intensely saturated hues that overpower your soft features.',
      'Brushed or satin finishes in metals look significantly better than high-shine polished chrome.'
    ]
  },
  'Deep Winter': {
    undertone: 'cool',
    contrast: 'high',
    paletteHexes: ['#000000', '#002D62', '#4B0082', '#800020', '#0A5C36', '#311432', '#1B1B1B', '#58111A'],
    avoidHexes: ['#F5DEB3', '#D2B48C', '#DAA520', '#FF7F50', '#808000'],
    neutralHexes: ['#000000', '#FFFFFF', '#1A1A24', '#708090'],
    bestMetals: ['Platinum', 'Polished Silver', 'White Gold', 'Blackened Titanium'],
    description: 'Deep Winter is striking, cool, and vividly high-contrast. Bold, saturated, and icy tones frame your face with dramatic elegance.',
    stylingAdvice: [
      'You are one of the few seasons that looks magnificent in true, jet black and stark crisp white.',
      'Lean into ruby red, sapphire blue, royal emerald, and deep plum.',
      'Select shiny, reflective cool metals like polished silver and white gold.'
    ]
  },
  'Cool Winter': {
    undertone: 'cool',
    contrast: 'high',
    paletteHexes: ['#001F3F', '#4169E1', '#8A2BE2', '#C71585', '#008080', '#1C39BB', '#7B1113', '#4682B4'],
    avoidHexes: ['#D2691E', '#FF8C00', '#B8860B', '#556B2F', '#A0522D'],
    neutralHexes: ['#0A0A0A', '#FFFFFF', '#36454F', '#A9A9A9'],
    bestMetals: ['High-Shine Silver', 'Platinum', 'White Gold'],
    description: 'Cool Winter radiates pure, frosty brilliance without a single trace of warm or golden undertones.',
    stylingAdvice: [
      'High-contrast outfits (black blazer over crisp white shirt) make you look instantly polished.',
      'Avoid warm mustard, olive, and terracotta shades.',
      'Choose jewel tones and cool berry lip colors.'
    ]
  },
  'Clear Winter': {
    undertone: 'cool',
    contrast: 'high',
    paletteHexes: ['#FF007F', '#0000FF', '#00FFCD', '#800080', '#1E90FF', '#DC143C', '#000080', '#E0115F'],
    avoidHexes: ['#808080', '#A9A9A9', '#BC8F8F', '#8B7D6B', '#D2B48C'],
    neutralHexes: ['#000000', '#FFFFFF', '#2F4F4F', '#DCDCDC'],
    bestMetals: ['Bright Silver', 'Platinum'],
    description: 'Clear Winter has piercing clarity and vivid brightness with cool undertones.',
    stylingAdvice: [
      'Vivid, saturated jewel tones and electric blues accentuate your clarity.',
      'Avoid muddy, dusty, or overly greyed-out neutrals.',
      'High-contrast pairings bring your features to life.'
    ]
  },
  'Light Spring': {
    undertone: 'warm',
    contrast: 'low',
    paletteHexes: ['#FFB6C1', '#FFE4B5', '#98FB98', '#AFEEEE', '#FFD700', '#FF7F50', '#E0EEE0', '#FFC0CB'],
    avoidHexes: ['#000000', '#1C1C1C', '#800020', '#4B0082', '#2F4F4F'],
    neutralHexes: ['#FFF8DC', '#F5F5DC', '#D8BC9D', '#C0A080'],
    bestMetals: ['Light Yellow Gold', 'Rose Gold'],
    description: 'Light Spring is sunny, fresh, and luminous with delicate warm undertones.',
    stylingAdvice: [
      'Peach, buttery yellow, coral, and soft mint bring warmth to your skin.',
      'Avoid heavy black or dark charcoal; replace them with warm camel and light ivory.',
      'Lightweight, fluid fabrics complement your airy aesthetic.'
    ]
  },
  'Warm Spring': {
    undertone: 'warm',
    contrast: 'medium',
    paletteHexes: ['#FF4500', '#FF8C00', '#32CD32', '#00CED1', '#FF6347', '#FFD700', '#20B2AA', '#E97451'],
    avoidHexes: ['#4B0082', '#000080', '#708090', '#C0C0C0', '#4A0404'],
    neutralHexes: ['#8B5A2B', '#CDAA7D', '#FAF0E6', '#F5DEB3'],
    bestMetals: ['Bright Yellow Gold', 'Warm Brass'],
    description: 'Warm Spring is energetic, glowing, and vibrant with clear golden warmth.',
    stylingAdvice: [
      'Fiery corals, poppy reds, bright turquoise, and warm greens make you radiate.',
      'Opt for bright, cheerful hues over muted earth tones.'
    ]
  },
  'Clear Spring': {
    undertone: 'warm',
    contrast: 'high',
    paletteHexes: ['#FF1493', '#00FA9A', '#00BFFF', '#FF4500', '#FFD700', '#7B68EE', '#39FF14', '#FF385C'],
    avoidHexes: ['#696969', '#808080', '#556B2F', '#8B4513', '#708090'],
    neutralHexes: ['#1C1C1C', '#FFFFF0', '#4682B4', '#F5F5F5'],
    bestMetals: ['Bright Yellow Gold', 'Polished Platinum'],
    description: 'Clear Spring is sparkling and intense with warm undertones and high vitality.',
    stylingAdvice: [
      'Bold, luminous colors like watermelon pink and electric turquoise highlight your features.',
      'Avoid muted, washed-out grays and drab pastels.'
    ]
  },
  'Light Summer': {
    undertone: 'cool',
    contrast: 'low',
    paletteHexes: ['#B0C4DE', '#DDA0DD', '#ADD8E6', '#F08080', '#E6E6FA', '#98D8C8', '#C3B1E1', '#F4C2C2'],
    avoidHexes: ['#000000', '#8B4513', '#FF4500', '#DAA520', '#4A0404'],
    neutralHexes: ['#778899', '#B0BEC5', '#E0E0E0', '#F8F9FA'],
    bestMetals: ['Soft Silver', 'Rose Gold', 'White Gold'],
    description: 'Light Summer is breezy, delicate, and cool. Soft pastels and sea-foam tints illuminate your natural beauty.',
    stylingAdvice: [
      'Powder blue, lavender, soft rose, and pale mint are your absolute staples.',
      'Replace black with slate blue or soft heather gray.'
    ]
  },
  'Cool Summer': {
    undertone: 'cool',
    contrast: 'medium',
    paletteHexes: ['#4682B4', '#6A5ACD', '#C71585', '#2E8B57', '#6495ED', '#9370DB', '#DB7093', '#4169E1'],
    avoidHexes: ['#FF8C00', '#B8860B', '#8B4513', '#D2691E', '#CD853F'],
    neutralHexes: ['#2F4F4F', '#708090', '#C0C0C0', '#ECEFF1'],
    bestMetals: ['Brushed Silver', 'White Gold', 'Platinum'],
    description: 'Cool Summer is serene, sophisticated, and gracefully cool with a refined silver undertone.',
    stylingAdvice: [
      'Slate blue, raspberry, French navy, and cool mauve look effortlessly expensive.',
      'Avoid golden yellows, orange, and mustard tones.'
    ]
  },
  'Soft Summer': {
    undertone: 'cool',
    contrast: 'low',
    paletteHexes: ['#708090', '#BC8F8F', '#8FBC8F', '#9370DB', '#778899', '#B3848F', '#6E8B7E', '#8E7CC3'],
    avoidHexes: ['#FF0000', '#FFFF00', '#00FF00', '#FF00FF', '#000000'],
    neutralHexes: ['#4A5568', '#718096', '#CBD5E0', '#EDF2F7'],
    bestMetals: ['Antique Silver', 'Pewter', 'Brushed White Gold'],
    description: 'Soft Summer is smoky, velvety, and calm with a gentle cool-neutral balance.',
    stylingAdvice: [
      'Smoky lavender, muted sage, dusty rose, and dove grey create timeless ensembles.',
      'Avoid ultra-harsh contrast or electric neon colors.'
    ]
  }
};

const ALL_SEASONS = Object.keys(SEASON_PALETTES);

/**
 * Evaluates user selfie or features to determine season
 */
function analyzeSeasonalFeatures({ undertone, contrastPreference, eyeColor, hairColor }) {
  let matchedSeason = 'Deep Autumn';

  if (undertone === 'cool') {
    if (contrastPreference === 'high') {
      matchedSeason = 'Deep Winter';
    } else if (contrastPreference === 'low') {
      matchedSeason = 'Light Summer';
    } else {
      matchedSeason = 'Cool Summer';
    }
  } else if (undertone === 'warm') {
    if (contrastPreference === 'high') {
      matchedSeason = 'Deep Autumn';
    } else if (contrastPreference === 'low') {
      matchedSeason = 'Light Spring';
    } else {
      matchedSeason = 'Warm Autumn';
    }
  } else {
    // Neutral
    matchedSeason = contrastPreference === 'high' ? 'Clear Winter' : 'Soft Autumn';
  }

  const paletteData = SEASON_PALETTES[matchedSeason];
  return {
    season: matchedSeason,
    ...paletteData
  };
}

/**
 * Evaluates wardrobe items against the active season palette
 */
function calculatePaletteMatch(itemHex, seasonName) {
  const palette = SEASON_PALETTES[seasonName];
  if (!palette) return { score: 80, isMatch: true };

  // Calculate hex proximity or match against palette
  const hex = (itemHex || '#333333').toUpperCase();
  const isAvoid = palette.avoidHexes.some(h => h.toUpperCase() === hex);
  if (isAvoid) {
    return { score: 45, isMatch: false, reason: 'Color clashes with your natural season contrast' };
  }

  const isBest = palette.paletteHexes.some(h => h.toUpperCase() === hex);
  if (isBest) {
    return { score: 98, isMatch: true, reason: 'Signature power color for your season' };
  }

  const isNeutral = palette.neutralHexes.some(h => h.toUpperCase() === hex);
  if (isNeutral) {
    return { score: 92, isMatch: true, reason: 'Essential flattering neutral staple' };
  }

  return { score: 85, isMatch: true, reason: 'Harmonious complementary tone' };
}

module.exports = {
  SEASON_PALETTES,
  ALL_SEASONS,
  analyzeSeasonalFeatures,
  calculatePaletteMatch
};
