const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route files
const authRoutes = require('./src/routes/authRoutes');
const wardrobeRoutes = require('./src/routes/wardrobeRoutes');
const colorRoutes = require('./src/routes/colorRoutes');
const consultationRoutes = require('./src/routes/consultationRoutes');
const outfitRoutes = require('./src/routes/outfitRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve assets folder for sample images
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Aura AI Fashion Stylist API',
    timestamp: new Date().toISOString(),
  });
});

const tryOnRoutes = require('./src/routes/tryOnRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

// Mount Routers
app.use('/api', tryOnRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/color-analysis', colorRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Serve client dist if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/assets')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`  ✨ Aura Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  🚀 API Listening on http://localhost:${PORT}`);
  console.log(`  📂 Uploads directory: ${path.join(__dirname, 'uploads')}`);
  console.log(`========================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

module.exports = app;
