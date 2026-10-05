const User = require('../models/User');
const ColorAnalysis = require('../models/ColorAnalysis');
const { SEASON_PALETTES } = require('../services/colorAnalysisEngine');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, aesthetics, bodyType } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Default season Deep Autumn
    const defaultSeason = 'Deep Autumn';
    const palette = SEASON_PALETTES[defaultSeason];

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      activeColorSeason: defaultSeason,
      stylePreferences: {
        aesthetics: aesthetics || ['Casual Chic', 'Minimalist'],
        bodyType: bodyType || 'Hourglass',
      },
    });

    // Create initial Color Analysis entry
    await ColorAnalysis.create({
      user: user._id,
      season: defaultSeason,
      undertone: palette.undertone,
      contrast: palette.contrast,
      paletteHexes: palette.paletteHexes,
      avoidHexes: palette.avoidHexes,
      neutralHexes: palette.neutralHexes,
      bestMetals: palette.bestMetals,
      description: palette.description,
      stylingAdvice: palette.stylingAdvice,
      isCurrent: true,
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatarUrl: user.avatarUrl,
        activeColorSeason: user.activeColorSeason,
        stylePreferences: user.stylePreferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatarUrl: user.avatarUrl,
        activeColorSeason: user.activeColorSeason,
        stylePreferences: user.stylePreferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatarUrl: user.avatarUrl,
        activeColorSeason: user.activeColorSeason,
        stylePreferences: user.stylePreferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile / preferences
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, stylePreferences, avatarUrl } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (avatarUrl) fieldsToUpdate.avatarUrl = avatarUrl;
    if (stylePreferences) fieldsToUpdate.stylePreferences = stylePreferences;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatarUrl: user.avatarUrl,
        activeColorSeason: user.activeColorSeason,
        stylePreferences: user.stylePreferences,
      },
    });
  } catch (err) {
    next(err);
  }
};
