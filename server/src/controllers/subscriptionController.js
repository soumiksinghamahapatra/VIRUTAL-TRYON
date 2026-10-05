const User = require('../models/User');

const PLANS = {
  free: {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    billingPeriod: 'forever',
    limits: {
      wardrobeItems: 25,
      colorAnalyses: 1,
      consultationsPerDay: 5,
      collages: 3,
    },
    features: [
      'Digital Closet: Up to 25 items',
      '1x Seasonal Color Analysis',
      '5 Daily AI Stylist chat questions',
      'Basic Mix-and-Match outfit canvas',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Aura Pro',
    price: 19,
    billingPeriod: 'month',
    limits: {
      wardrobeItems: 500,
      colorAnalyses: 999,
      consultationsPerDay: 100,
      collages: 100,
    },
    features: [
      'Unlimited Digital Closet uploads',
      'Full 12-Season Color Analysis & Swatches',
      'Unlimited 24/7 AI Stylist consultations',
      'Pinterest & Street Style Inspo Breakdown',
      'Occasion Packing & Travel Capsule Generator',
      'Priority AI streaming speed',
    ],
  },
  studio: {
    id: 'studio',
    name: 'Aura Studio',
    price: 39,
    billingPeriod: 'month',
    limits: {
      wardrobeItems: 9999,
      colorAnalyses: 9999,
      consultationsPerDay: 9999,
      collages: 9999,
    },
    features: [
      'Everything in Aura Pro',
      'Multi-client stylist profiles for professionals',
      'High-resolution PDF client style briefs & lookbooks',
      'Custom color harmony calibration',
      'Dedicated personal concierge styling',
    ],
  },
};

// @desc    Get all subscription plans
// @route   GET /api/subscription/plans
// @access  Public
exports.getPlans = (req, res) => {
  res.status(200).json({
    success: true,
    data: Object.values(PLANS),
  });
};

// @desc    Upgrade or change user plan
// @route   POST /api/subscription/upgrade
// @access  Private
exports.upgradePlan = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected. Choose free, pro, or studio.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan, planStatus: 'active' },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Successfully upgraded to ${PLANS[plan].name}!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
    });
  } catch (err) {
    next(err);
  }
};
