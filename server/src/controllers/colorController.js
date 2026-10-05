const ColorAnalysis = require('../models/ColorAnalysis');
const WardrobeItem = require('../models/WardrobeItem');
const User = require('../models/User');
const { SEASON_PALETTES, analyzeSeasonalFeatures, calculatePaletteMatch } = require('../services/colorAnalysisEngine');

// @desc    Get user's current color analysis
// @route   GET /api/color-analysis
// @access  Private
exports.getAnalysis = async (req, res, next) => {
  try {
    let analysis = await ColorAnalysis.findOne({
      user: req.user.id,
      isCurrent: true,
    }).sort({ createdAt: -1 });

    // If none exists, create default Deep Autumn
    if (!analysis) {
      const palette = SEASON_PALETTES['Deep Autumn'];
      analysis = await ColorAnalysis.create({
        user: req.user.id,
        season: 'Deep Autumn',
        ...palette,
        isCurrent: true,
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Run or re-evaluate 12-season color analysis
// @route   POST /api/color-analysis
// @access  Private
exports.runAnalysis = async (req, res, next) => {
  try {
    let { undertone, contrast, eyeColor, hairColor, seasonOverride } = req.body;
    let selfieUrl = '';

    if (req.file) {
      selfieUrl = `/uploads/${req.file.filename}`;
    }

    let seasonData;
    if (seasonOverride && SEASON_PALETTES[seasonOverride]) {
      seasonData = {
        season: seasonOverride,
        ...SEASON_PALETTES[seasonOverride]
      };
    } else {
      seasonData = analyzeSeasonalFeatures({
        undertone: undertone || 'warm',
        contrastPreference: contrast || 'high',
        eyeColor,
        hairColor,
      });
    }

    // Set previous analyses to isCurrent: false
    await ColorAnalysis.updateMany({ user: req.user.id }, { isCurrent: false });

    // Create new analysis record
    const analysis = await ColorAnalysis.create({
      user: req.user.id,
      season: seasonData.season,
      undertone: seasonData.undertone,
      contrast: seasonData.contrast,
      paletteHexes: seasonData.paletteHexes,
      avoidHexes: seasonData.avoidHexes,
      neutralHexes: seasonData.neutralHexes,
      bestMetals: seasonData.bestMetals,
      description: seasonData.description,
      stylingAdvice: seasonData.stylingAdvice,
      selfieUrl,
      isCurrent: true,
    });

    // Update user profile
    await User.findByIdAndUpdate(req.user.id, {
      activeColorSeason: seasonData.season,
    });

    // Update wardrobe items match scores
    const items = await WardrobeItem.find({ user: req.user.id });
    for (const item of items) {
      const match = calculatePaletteMatch(item.colorHex, seasonData.season);
      item.colorMatchScore = match.score;
      await item.save();
    }

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all 12 season palettes reference
// @route   GET /api/color-analysis/palettes
// @access  Public
exports.getAllPalettes = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: SEASON_PALETTES,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Match wardrobe items against active season
// @route   GET /api/color-analysis/match-wardrobe
// @access  Private
exports.getWardrobeMatch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const season = user ? user.activeColorSeason : 'Deep Autumn';
    const items = await WardrobeItem.find({ user: req.user.id });

    const evaluated = items.map((item) => {
      const evaluation = calculatePaletteMatch(item.colorHex, season);
      return {
        item,
        evaluation,
      };
    });

    const matchingCount = evaluated.filter((e) => e.evaluation.isMatch).length;
    const overallHarmony = items.length > 0
      ? Math.round((matchingCount / items.length) * 100)
      : 100;

    res.status(200).json({
      success: true,
      season,
      overallHarmony,
      totalItems: items.length,
      matchingItemsCount: matchingCount,
      evaluations: evaluated,
    });
  } catch (err) {
    next(err);
  }
};
