const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');

const CATEGORY_IMAGES = {
  'Mobiles': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
  'Home & Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
  'Home & Office': 'https://images.unsplash.com/photo-1580481077197-2a677943c5b8?w=800&auto=format&fit=crop&q=80',
  'Appliances': 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&auto=format&fit=crop&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
  'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
  'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
};

const SPECIFIC_PRODUCT_IMAGES = {
  'herman miller': 'https://images.unsplash.com/photo-1580481077197-2a677943c5b8?w=800&auto=format&fit=crop&q=80',
  'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  'iphone': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
  'sony': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  'samsung': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
  'chair': 'https://images.unsplash.com/photo-1580481077197-2a677943c5b8?w=800&auto=format&fit=crop&q=80'
};

async function fixAllImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[FixImages] Connected to MongoDB...');

    const products = await Product.find();
    let updated = 0;

    for (const prod of products) {
      let newImage = null;
      const lowerName = prod.name.toLowerCase();

      for (const [key, img] of Object.entries(SPECIFIC_PRODUCT_IMAGES)) {
        if (lowerName.includes(key)) {
          newImage = img;
          break;
        }
      }

      if (!newImage) {
        newImage = CATEGORY_IMAGES[prod.category] || CATEGORY_IMAGES['Electronics'];
      }

      // If the current image is missing, contains broken link or we have a better specific match
      if (!prod.image || prod.image.length < 10 || lowerName.includes('herman miller')) {
        prod.image = newImage;
        await prod.save();
        updated++;
        console.log(`Updated image for: ${prod.name}`);
      }
    }

    console.log(`[FixImages] Finished! Updated ${updated} product image(s).`);
    process.exit(0);
  } catch (err) {
    console.error('[FixImages Error]:', err);
    process.exit(1);
  }
}

fixAllImages();

