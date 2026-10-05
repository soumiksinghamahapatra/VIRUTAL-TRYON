const path = require('path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'minniie-super-secret-jwt-key-change-in-production-2026',
  JWT_EXPIRES_IN: '7d',
  DB_PATH: process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite'),
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads'),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000'
};
