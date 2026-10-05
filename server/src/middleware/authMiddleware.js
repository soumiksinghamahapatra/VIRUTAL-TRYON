const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, token missing',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_key_2026_dev'
    );
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'aura_super_secure_jwt_secret_key_2026_dev'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // ignore error for optional
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
