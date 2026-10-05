const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'studio'],
      default: 'free',
    },
    planStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due'],
      default: 'active',
    },
    stylePreferences: {
      aesthetics: {
        type: [String],
        default: ['Casual Chic', 'Minimalist'],
      },
      bodyType: {
        type: String,
        default: 'Hourglass',
      },
      favoriteColors: {
        type: [String],
        default: [],
      },
      avoidColors: {
        type: [String],
        default: [],
      },
      budgetTier: {
        type: String,
        enum: ['budget', 'mid-range', 'luxury'],
        default: 'mid-range',
      },
    },
    activeColorSeason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT Token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, plan: this.plan },
    process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_key_2026_dev',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
