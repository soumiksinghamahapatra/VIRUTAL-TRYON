const mongoose = require('mongoose');

const ColorAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    season: {
      type: String,
      required: true,
      enum: [
        'Light Spring', 'Warm Spring', 'Clear Spring',
        'Light Summer', 'Cool Summer', 'Soft Summer',
        'Deep Autumn', 'Warm Autumn', 'Soft Autumn',
        'Deep Winter', 'Cool Winter', 'Clear Winter'
      ],
    },
    undertone: {
      type: String,
      enum: ['warm', 'cool', 'neutral'],
      default: 'warm',
    },
    contrast: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high',
    },
    paletteHexes: {
      type: [String],
      default: [],
    },
    avoidHexes: {
      type: [String],
      default: [],
    },
    neutralHexes: {
      type: [String],
      default: [],
    },
    bestMetals: {
      type: [String],
      default: ['Yellow Gold', 'Rose Gold'],
    },
    selfieUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    stylingAdvice: {
      type: [String],
      default: [],
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ColorAnalysis', ColorAnalysisSchema);
