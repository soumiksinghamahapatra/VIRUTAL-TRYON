const Consultation = require('../models/Consultation');
const User = require('../models/User');
const { generateStylistResponse } = require('../services/aiStylistService');

// @desc    Get active consultation session
// @route   GET /api/consultation
// @access  Private
exports.getConsultation = async (req, res, next) => {
  try {
    let consultation = await Consultation.findOne({
      user: req.user.id,
      isActive: true,
    }).sort({ updatedAt: -1 });

    const user = await User.findById(req.user.id);
    const season = user ? user.activeColorSeason : 'Deep Autumn';

    if (!consultation) {
      consultation = await Consultation.create({
        user: req.user.id,
        sessionTitle: 'Style Consultation with Aura',
        messages: [
          {
            role: 'assistant',
            content: `Hello ${user ? user.name : 'there'}! I'm **Aura**, your personal AI stylist. I see your active color season is **${season}**.\n\nWhether you're dressing for a big event, trying to curate a capsule wardrobe, or figuring out how to style a tricky piece in your closet, I'm here to help.\n\nWhat outfit or occasion are you styling today?`,
            chips: [
              'Plan a casual chic daily look',
              'What should I wear to a weekend brunch?',
              'Office power dressing formulas',
              'Date night outfit with high-impact color'
            ],
          },
        ],
      });
    }

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message to AI Stylist
// @route   POST /api/consultation/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    let consultation = await Consultation.findOne({
      user: req.user.id,
      isActive: true,
    }).sort({ updatedAt: -1 });

    const user = await User.findById(req.user.id);
    const userContext = {
      name: user ? user.name : 'Client',
      activeColorSeason: user ? user.activeColorSeason : 'Deep Autumn',
      aesthetics: user ? user.stylePreferences?.aesthetics : ['Minimalist'],
      bodyType: user ? user.stylePreferences?.bodyType : 'Hourglass',
    };

    if (!consultation) {
      consultation = await Consultation.create({
        user: req.user.id,
        sessionTitle: 'Style Consultation with Aura',
        messages: [],
      });
    }

    // Add user message
    consultation.messages.push({
      role: 'user',
      content: message,
    });

    // Generate AI response
    const aiResult = await generateStylistResponse({
      userMessage: message,
      chatHistory: consultation.messages,
      userContext,
    });

    // Add assistant message
    const assistantMessage = {
      role: 'assistant',
      content: aiResult.content,
      chips: aiResult.chips || [],
      styleBrief: aiResult.styleBrief || null,
      recommendedItems: aiResult.recommendedItems || [],
    };

    consultation.messages.push(assistantMessage);
    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation,
      latestMessage: assistantMessage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset consultation conversation
// @route   POST /api/consultation/reset
// @access  Private
exports.resetSession = async (req, res, next) => {
  try {
    await Consultation.updateMany(
      { user: req.user.id, isActive: true },
      { isActive: false }
    );

    const user = await User.findById(req.user.id);
    const season = user ? user.activeColorSeason : 'Deep Autumn';

    const newConsultation = await Consultation.create({
      user: req.user.id,
      sessionTitle: 'New Style Consultation',
      messages: [
        {
          role: 'assistant',
          content: `Hi again! A fresh consultation begins. What look or occasion shall we focus on now?`,
          chips: [
            'Create a capsule wardrobe',
            'Dress for a job interview',
            'Weekend getaway looks',
            'Review my color season'
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: newConsultation,
    });
  } catch (err) {
    next(err);
  }
};
