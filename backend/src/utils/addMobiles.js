const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');
const User = require('../models/User');

const mobileProducts = [
  {
    name: 'Apple iPhone 15 (128 GB) - Blue',
    brand: 'Apple',
    category: 'Mobiles',
    price: 79900,
    discountPrice: 69999,
    stock: 25,
    rating: 4.8,
    numReviews: 24,
    featured: true,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto for breathtaking detail. A16 Bionic chip powers computational photography and graphics-intensive gaming. USB-C convenience.'
  },
  {
    name: 'Samsung Galaxy S24 5G (8GB RAM, 256GB - Onyx Black)',
    brand: 'Samsung',
    category: 'Mobiles',
    price: 79999,
    discountPrice: 74999,
    stock: 18,
    rating: 4.7,
    numReviews: 18,
    featured: true,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Galaxy AI is here. Search like never before with Circle to Search, get quick language translation on calls with Live Translate, and organize your thoughts with Note Assist. 50MP triple camera and Armor Aluminum frame.'
  },
  {
    name: 'OnePlus 12R 5G (16GB RAM, 256GB - Cool Blue)',
    brand: 'OnePlus',
    category: 'Mobiles',
    price: 45999,
    discountPrice: 42999,
    stock: 30,
    rating: 4.6,
    numReviews: 32,
    featured: true,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Flagship performance unleashed with Snapdragon 8 Gen 2 processor, 1.5K 120Hz ProXDR 4th Gen LTPO display, and huge 5500 mAh battery with 100W SUPERVOOC fast charging in the box.'
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro+ 5G (8GB RAM, 256GB - Fusion Purple)',
    brand: 'Xiaomi',
    category: 'Mobiles',
    price: 31999,
    discountPrice: 27999,
    stock: 40,
    rating: 4.5,
    numReviews: 45,
    featured: false,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    description: '200MP OIS camera with 4X in-sensor lossless zoom. 3D Curved 1.5K 120Hz AMOLED display with Gorilla Glass Victus, IP68 water & dust resistance, and 120W HyperCharge powering 100% in 19 mins.'
  },
  {
    name: 'Realme 12 Pro+ 5G (12GB RAM, 256GB - Submarine Blue)',
    brand: 'Realme',
    category: 'Mobiles',
    price: 34999,
    discountPrice: 29999,
    stock: 22,
    rating: 4.4,
    numReviews: 19,
    featured: false,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Luxury watch design mastercrafted by Ollivier Saveo. Flagship 64MP Periscope Telephoto camera with 120X SuperZoom, Sony IMX890 OIS camera, and curved 120Hz OLED vision display.'
  },
  {
    name: 'Vivo V30 Pro 5G (12GB RAM, 512GB - Andaman Blue)',
    brand: 'Vivo',
    category: 'Mobiles',
    price: 46999,
    discountPrice: 41999,
    stock: 15,
    rating: 4.6,
    numReviews: 14,
    featured: false,
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Co-engineered with ZEISS professional portrait camera system. 50MP VCS True Color main camera + 50MP Professional Portrait camera. Smart Studio Aura Light portrait for studio-quality photography.'
  },
  {
    name: 'Nothing Phone (2) 5G (12GB RAM, 256GB - Dark Grey)',
    brand: 'Nothing',
    category: 'Mobiles',
    price: 49999,
    discountPrice: 36999,
    stock: 19,
    rating: 4.5,
    numReviews: 28,
    featured: true,
    image: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105854-c8674faddf79?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Iconic transparent design with customizable Glyph Interface LED lighting. Nothing OS 2.5 on Snapdragon 8+ Gen 1, dual 50MP Sony sensors with Advanced HDR, and LTPO OLED 120Hz display.'
  },
  {
    name: 'Motorola Edge 50 Pro 5G (12GB RAM, 256GB - Luxe Lavender)',
    brand: 'Motorola',
    category: 'Mobiles',
    price: 35999,
    discountPrice: 31999,
    stock: 16,
    rating: 4.6,
    numReviews: 22,
    featured: false,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'World 1st Pantone validated true-color display and camera. 50MP main camera with OIS + 3X telephoto, 144Hz 1.5K pOLED curved screen, vegan leather back, IP68 water protection, and 125W TurboPower charging.'
  },
  {
    name: 'Google Pixel 8 5G (8GB RAM, 128GB - Hazel)',
    brand: 'Google',
    category: 'Mobiles',
    price: 75999,
    discountPrice: 62999,
    stock: 12,
    rating: 4.7,
    numReviews: 36,
    featured: true,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered with Google Tensor G3 chip for leading-edge photo and video capabilities. Best Take, Magic Audio Eraser, Real Tone, and 7 years of promised OS and security updates.'
  },
  {
    name: 'iQOO Neo 9 Pro 5G (8GB RAM, 256GB - Fiery Red)',
    brand: 'iQOO',
    category: 'Mobiles',
    price: 39999,
    discountPrice: 34999,
    stock: 28,
    rating: 4.6,
    numReviews: 25,
    featured: false,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dual-chip power with Snapdragon 8 Gen 2 and dedicated Supercomputing Q1 chip. 50MP Sony IMX920 Night Vision camera, 144Hz 1.5K LTPO AMOLED display, and 120W FlashCharge with dual-tone vegan leather finish.'
  }
];

async function addMobiles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[AddMobiles] Connected to MongoDB...');

    // Find any existing user for reviews if needed
    const anyUser = await User.findOne();
    const userId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
    const userName = anyUser ? anyUser.name : 'Verified Customer';

    let addedCount = 0;
    let updatedCount = 0;

    for (const mob of mobileProducts) {
      // Check if product with same name already exists
      const existing = await Product.findOne({ name: mob.name });

      const productPayload = {
        ...mob,
        reviews: [
          {
            user: userId,
            name: userName,
            rating: 5,
            comment: 'Delivered fast with genuine brand warranty. Performance and camera are top notch!',
            createdAt: new Date()
          }
        ]
      };

      if (existing) {
        Object.assign(existing, productPayload);
        await existing.save();
        updatedCount++;
        console.log(`Updated mobile: ${mob.name}`);
      } else {
        await Product.create(productPayload);
        addedCount++;
        console.log(`Added new mobile: ${mob.name}`);
      }
    }

    console.log(`[AddMobiles] Successfully processed 10 Mobiles! (Added: ${addedCount}, Updated: ${updatedCount})`);
    process.exit(0);
  } catch (err) {
    console.error('[AddMobiles Error]:', err);
    process.exit(1);
  }
}

addMobiles();

