const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    styleBrief: {
      type: Object,
      default: null,
    },
    chips: {
      type: [String],
      default: [],
    },
    recommendedItems: {
      type: [Object],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ConsultationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionTitle: {
      type: String,
      default: 'New Style Consultation',
    },
    messages: [MessageSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Consultation', ConsultationSchema);
