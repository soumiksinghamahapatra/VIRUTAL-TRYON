const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas or local instance
 */
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maison_fashion';

    // If URI is an Atlas cluster without db name, append maison_fashion
    if (mongoUri.includes('.mongodb.net') && !mongoUri.includes('.mongodb.net/')) {
      mongoUri = mongoUri.replace('.mongodb.net', '.mongodb.net/maison_fashion?retryWrites=true&w=majority');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`[MongoDB] ✅ Successfully connected to host: ${conn.connection.host}`);
    console.log(`[MongoDB] 🗄️  Active Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] ⚠️ Connection error: ${error.message}`);
    console.warn(`[MongoDB] Server will operate in resilient demo session mode if database is offline.`);
  }
};

module.exports = connectDB;
