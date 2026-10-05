require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const WardrobeItem = require('./models/WardrobeItem');
const ColorAnalysis = require('./models/ColorAnalysis');
const Outfit = require('./models/Outfit');
const { SEASON_PALETTES } = require('./services/colorAnalysisEngine');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aura_fashion';
    console.log(`Connecting to MongoDB at: ${mongoUri} ...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing demo data...');
    await User.deleteMany({ email: 'demo@aura.com' });

    console.log('Creating demo user (demo@aura.com / Password123!)...');
    const demoUser = await User.create({
      name: 'Sophia Laurent',
      email: 'demo@aura.com',
      password: 'Password123!',
      plan: 'pro',
      planStatus: 'active',
      activeColorSeason: 'Deep Autumn',
      stylePreferences: {
        aesthetics: ['Minimalist Luxury', 'Casual Chic'],
        bodyType: 'Hourglass',
        favoriteColors: ['Espresso', 'Terracotta', 'Olive'],
        avoidColors: ['Pastel Pink', 'Icy Blue'],
        budgetTier: 'luxury',
      },
    });

    console.log('Seeding seasonal color analysis...');
    const palette = SEASON_PALETTES['Deep Autumn'];
    await ColorAnalysis.create({
      user: demoUser._id,
      season: 'Deep Autumn',
      undertone: palette.undertone,
      contrast: palette.contrast,
      paletteHexes: palette.paletteHexes,
      avoidHexes: palette.avoidHexes,
      neutralHexes: palette.neutralHexes,
      bestMetals: palette.bestMetals,
      description: palette.description,
      stylingAdvice: palette.stylingAdvice,
      isCurrent: true,
    });

    console.log('Seeding wardrobe items...');
    const items = await WardrobeItem.create([
      {
        user: demoUser._id,
        name: 'Oversized Ivory Silk Button-Down',
        category: 'tops',
        subCategory: 'Shirt',
        primaryColor: 'Ivory',
        colorHex: '#FFFFF0',
        seasons: ['all-season'],
        occasions: ['Work', 'Brunch'],
        aesthetic: 'Quiet Luxury',
        imageUrl: '/assets/brunch-top-DyVfbOn4.webp',
        colorMatchScore: 98,
        isFavorite: true,
      },
      {
        user: demoUser._id,
        name: 'Tailored Wide-Leg Pleated Trousers',
        category: 'bottoms',
        subCategory: 'Trousers',
        primaryColor: 'Espresso',
        colorHex: '#3D2817',
        seasons: ['autumn', 'winter', 'spring'],
        occasions: ['Work', 'Dinner'],
        aesthetic: 'Tailored Minimalist',
        imageUrl: '/assets/brunch-bottom-CZ0x9j6O.webp',
        colorMatchScore: 95,
        isFavorite: true,
      },
      {
        user: demoUser._id,
        name: 'Italian Leather Penny Loafers',
        category: 'shoes',
        subCategory: 'Loafers',
        primaryColor: 'Cognac',
        colorHex: '#8C503A',
        seasons: ['all-season'],
        occasions: ['Casual', 'Work'],
        aesthetic: 'Classic Modern',
        imageUrl: '/assets/brunch-shoes-Cu3OZLQ_.webp',
        colorMatchScore: 94,
        isFavorite: false,
      },
      {
        user: demoUser._id,
        name: 'Wool-Cashmere Double-Breasted Trench',
        category: 'outerwear',
        subCategory: 'Coat',
        primaryColor: 'Warm Camel',
        colorHex: '#A27035',
        seasons: ['autumn', 'winter'],
        occasions: ['Travel', 'City'],
        aesthetic: 'Quiet Luxury',
        imageUrl: '/assets/city-look-CO6tnpbW.webp',
        colorMatchScore: 99,
        isFavorite: true,
      },
      {
        user: demoUser._id,
        name: 'Sculptural Heavy Gold Huggie Earrings',
        category: 'accessories',
        subCategory: 'Jewelry',
        primaryColor: 'Warm Gold',
        colorHex: '#D4AF37',
        seasons: ['all-season'],
        occasions: ['Everyday', 'Party'],
        aesthetic: 'Minimalist Jewelry',
        imageUrl: '/assets/sparkles-z8wHcths.js',
        colorMatchScore: 100,
        isFavorite: true,
      },
    ]);

    console.log('Seeding curated outfit...');
    await Outfit.create({
      user: demoUser._id,
      name: 'Autumn Sunday Gallery & Brunch',
      occasion: 'Weekend Brunch',
      aesthetic: 'Quiet Luxury',
      items: [items[0]._id, items[1]._id, items[2]._id, items[3]._id],
      aiRating: 9.6,
      notes: 'An impeccable warm tonal look pairing creamy fluid silk with rich espresso tailoring.',
    });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
