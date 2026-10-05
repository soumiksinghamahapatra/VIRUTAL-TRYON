const mongoose = require('mongoose');

const OutfitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an outfit title'],
      trim: true,
    },
    occasion: {
      type: String,
      default: 'Casual Chic',
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WardrobeItem',
      },
    ],
    collageImageUrl: {
      type: String,
      default: '',
    },
    aesthetic: {
      type: String,
      default: 'Quiet Luxury',
    },
    season: {
      type: String,
      default: 'all-season',
    },
    aiRating: {
      type: Number,
      default: 9.4,
    },
    notes: {
      type: String,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Outfit', OutfitSchema);
