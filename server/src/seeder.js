require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const WardrobeItem = require('./models/WardrobeItem');
const ColorAnalysis = require('./models/ColorAnalysis');
const Outfit = require('./models/Outfit');
const { SEASON_PALETTES } = require('./services/colorAnalysisEngine');

const seedData = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maison_fashion';
    if (mongoUri.includes('.mongodb.net') && !mongoUri.includes('.mongodb.net/')) {
      mongoUri = mongoUri.replace('.mongodb.net', '.mongodb.net/maison_fashion?retryWrites=true&w=majority');
    }

    console.log(`[Seeder] Connecting to MongoDB at ${mongoUri.replace(/:[^:]*@/, ':****@')} ...`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Cleaning existing demo accounts...');
    await User.deleteMany({ email: { $in: ['demo@maison.com', 'stylist@maison.com', 'demo@aura.com'] } });

    console.log('[Seeder] Creating MAISON VIP Client (demo@maison.com / Password123!)...');
    const vipUser = await User.create({
      name: 'Eleanor Vance',
      email: 'demo@maison.com',
      password: 'Password123!',
      plan: 'pro',
      planStatus: 'active',
      activeColorSeason: 'Deep Autumn',
      stylePreferences: {
        aesthetics: ['Minimalist Luxury', 'Quiet Luxury', 'Architectural Tailoring'],
        bodyType: 'Hourglass',
        favoriteColors: ['Pitch Black', 'Champagne Ivory', 'Warm Camel', 'Espresso'],
        avoidColors: ['Neon Yellow', 'Pastel Pink'],
        budgetTier: 'luxury',
      },
    });

    console.log('[Seeder] Creating MAISON Private Stylist (stylist@maison.com / Password123!)...');
    const stylistUser = await User.create({
      name: 'Julian St. Clair',
      email: 'stylist@maison.com',
      password: 'Password123!',
      plan: 'studio',
      planStatus: 'active',
      activeColorSeason: 'True Winter',
      stylePreferences: {
        aesthetics: ['Haute Couture', 'Tailored', 'Avant-Garde'],
        bodyType: 'Athletic',
        favoriteColors: ['Pure Black', 'Optic White', 'Royal Sapphire', 'Emerald'],
        avoidColors: ['Muted Beige', 'Dusty Peach'],
        budgetTier: 'luxury',
      },
    });

    console.log('[Seeder] Seeding 12-Season color analysis...');
    const palette = SEASON_PALETTES['Deep Autumn'];
    await ColorAnalysis.create({
      user: vipUser._id,
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

    console.log('[Seeder] Seeding luxury wardrobe items for VIP client...');
    const items = await WardrobeItem.create([
      {
        user: vipUser._id,
        name: 'Oversized Poplin French Cuff Shirt',
        category: 'tops',
        subCategory: 'Shirt',
        primaryColor: 'Optic White',
        colorHex: '#FFFFFF',
        seasons: ['all-season'],
        occasions: ['Work', 'Brunch', 'Evening'],
        aesthetic: 'Quiet Luxury',
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
        colorMatchScore: 98,
        isFavorite: true,
      },
      {
        user: vipUser._id,
        name: 'Pleated Wide-Leg Wool Trousers',
        category: 'bottoms',
        subCategory: 'Trousers',
        primaryColor: 'Charcoal Grey',
        colorHex: '#262626',
        seasons: ['autumn', 'winter', 'spring'],
        occasions: ['Work', 'Dinner', 'Gallery'],
        aesthetic: 'Tailored Minimalist',
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
        colorMatchScore: 95,
        isFavorite: true,
      },
      {
        user: vipUser._id,
        name: 'Tailored Double-Breasted Wool Blazer',
        category: 'outerwear',
        subCategory: 'Blazer',
        primaryColor: 'Pitch Black',
        colorHex: '#000000',
        seasons: ['autumn', 'winter'],
        occasions: ['Executive', 'Dinner'],
        aesthetic: 'Haute Couture',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
        colorMatchScore: 100,
        isFavorite: true,
      },
      {
        user: vipUser._id,
        name: 'Bias-Cut Silk Charmeuse Gown',
        category: 'dresses',
        subCategory: 'Evening Gown',
        primaryColor: 'Champagne Ivory',
        colorHex: '#F7F3EB',
        seasons: ['all-season'],
        occasions: ['Gala', 'Dinner'],
        aesthetic: 'Haute Couture',
        imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
        colorMatchScore: 99,
        isFavorite: true,
      },
    ]);

    console.log('[Seeder] Seeding curated atelier outfit...');
    await Outfit.create({
      user: vipUser._id,
      name: 'Place Vendôme Executive Monolith',
      occasion: 'Executive Meeting',
      aesthetic: 'Quiet Luxury',
      items: [items[0]._id, items[1]._id, items[2]._id],
      aiRating: 9.8,
      notes: 'An architectural silhouette pairing sharp double-breasted shoulders with relaxed fluid wool pleats.',
    });

    console.log('✅ [Seeder] MongoDB Database seeded with real accounts, wardrobe items, and palettes successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seeder Error]:', err);
    process.exit(1);
  }
};

seedData();
