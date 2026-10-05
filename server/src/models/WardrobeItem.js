const mongoose = require('mongoose');

const WardrobeItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['tops', 'bottoms', 'shoes', 'outerwear', 'dresses', 'accessories', 'bags'],
      index: true,
    },
    subCategory: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: 'Neutral',
    },
    colorHex: {
      type: String,
      default: '#333333',
    },
    seasons: {
      type: [String],
      enum: ['spring', 'summer', 'autumn', 'winter', 'all-season'],
      default: ['all-season'],
    },
    occasions: {
      type: [String],
      default: ['Casual'],
    },
    aesthetic: {
      type: String,
      default: 'Modern Casual',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL or photo'],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    colorMatchScore: {
      type: Number,
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WardrobeItem', WardrobeItemSchema);
