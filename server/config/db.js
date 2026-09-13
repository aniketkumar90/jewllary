const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vanya_jewels';
  
  // Detect if user left Atlas placeholder unchanged
  const hasPlaceholder = primaryUri.includes('<db_password>') || primaryUri.includes('<password>');

  if (!hasPlaceholder) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB Connected]: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`[MongoDB Atlas Error]: ${error.message}`);
    }
  } else {
    console.warn('[MongoDB Alert]: MONGO_URI contains "<db_password>" placeholder. Please replace it with your actual MongoDB Atlas database password.');
  }

  // Graceful fallback to local MongoDB instance
  try {
    console.log('[MongoDB] Connecting to local MongoDB fallback (mongodb://127.0.0.1:27017/vanya_jewels)...');
    const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/vanya_jewels', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected to Local Database]: ${localConn.connection.host}`);
  } catch (fallbackError) {
    console.error(`[MongoDB Connection Failed]: ${fallbackError.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
