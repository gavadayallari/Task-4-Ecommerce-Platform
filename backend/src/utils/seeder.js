const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seeder] Connected to MongoDB for database seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('[Seeder] Cleared previous Users, Products, and Orders.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Admin ShopNova',
      email: 'admin@shopnova.in',
      password: 'password123',
      role: 'admin',
      phone: '+91 98765 43210',
      address: {
        street: '101 ShopNova Tech Tower, Outer Ring Rd, Bellandur',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India'
      },
      addresses: [
        {
          name: 'Admin Office',
          phone: '+91 98765 43210',
          houseFlat: 'Tower B, 4th Floor',
          street: 'Outer Ring Rd, Bellandur',
          landmark: 'Opposite EcoWorld',
          city: 'Bangalore',
          state: 'Karnataka',
          pinCode: '560103',
          addressType: 'Work',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Yallari Gavada',
      email: 'yallari@example.com',
      password: 'password123',
      role: 'user',
      phone: '+91 91234 56789',
      address: {
        street: 'Flat 402, Green Glen Residency, Magarpatta City',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411028',
        country: 'India'
      },
      addresses: [
        {
          name: 'Yallari Gavada (Home)',
          phone: '+91 91234 56789',
          houseFlat: 'Flat 402, Green Glen Residency',
          street: 'Magarpatta City, Hadapsar',
          landmark: 'Near Cybercity Tower 4',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411028',
          addressType: 'Home',
          isDefault: true
        },
        {
          name: 'Yallari Gavada (Office)',
          phone: '+91 91234 56789',
          houseFlat: 'Auspify Labs, 3rd Floor',
          street: 'Viman Nagar Main Road',
          landmark: 'Behind Phoenix Marketcity',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411014',
          addressType: 'Work',
          isDefault: false
        }
      ]
    });

    const customerUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'password123',
      role: 'user',
      phone: '+91 99887 76655',
      address: {
        street: '15 Horizon View, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      },
      addresses: [
        {
          name: 'Priya Sharma',
          phone: '+91 99887 76655',
          houseFlat: 'Apt 12B, Horizon View',
          street: 'Pali Hill, Bandra West',
          landmark: 'Near Carter Road Promenade',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400050',
          addressType: 'Home',
          isDefault: true
        }
      ]
    });

    console.log('[Seeder] Seeded 3 Indian Users (1 Admin, 2 Verified Customers).');

    // 2. Create Realistic Indian Products Across All 8 Categories
    const productsData = [
      // 1. MOBILES (10 Products)
      {
        name: 'Apple iPhone 15 (128 GB) - Blue',
        description: 'Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto for breathtaking detail. A16 Bionic chip powers computational photography and graphics-intensive gaming. USB-C convenience.',
        price: 79900.00,
        discountPrice: 69999.00,
        category: 'Mobiles',
        brand: 'Apple',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'
        ],
        rating: 4.8,
        numReviews: 24,
        featured: true,
        reviews: [
          {
            user: demoUser._id,
            name: demoUser.name,
            rating: 5,
            comment: 'Battery life is exceptional and the camera captures crisp details even at night. Delivered to Pune in 2 days.',
            createdAt: new Date('2026-10-01')
          }
        ]
      },
      {
        name: 'Samsung Galaxy S24 5G (8GB RAM, 256GB - Onyx Black)',
        description: 'Galaxy AI is here. Search like never before with Circle to Search, get quick language translation on calls with Live Translate, and organize your thoughts with Note Assist. 50MP triple camera and Armor Aluminum frame.',
        price: 79999.00,
        discountPrice: 74999.00,
        category: 'Mobiles',
        brand: 'Samsung',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 18,
        featured: true
      },
      {
        name: 'OnePlus 12R 5G (16GB RAM, 256GB - Cool Blue)',
        description: 'Flagship performance unleashed with Snapdragon 8 Gen 2 processor, 1.5K 120Hz ProXDR 4th Gen LTPO display, and huge 5500 mAh battery with 100W SUPERVOOC fast charging in the box.',
        price: 45999.00,
        discountPrice: 42999.00,
        category: 'Mobiles',
        brand: 'OnePlus',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 32,
        featured: true
      },
      {
        name: 'Xiaomi Redmi Note 13 Pro+ 5G (8GB RAM, 256GB - Fusion Purple)',
        description: '200MP OIS camera with 4X in-sensor lossless zoom. 3D Curved 1.5K 120Hz AMOLED display with Gorilla Glass Victus, IP68 water & dust resistance, and 120W HyperCharge powering 100% in 19 mins.',
        price: 31999.00,
        discountPrice: 27999.00,
        category: 'Mobiles',
        brand: 'Xiaomi',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80',
        rating: 4.5,
        numReviews: 45,
        featured: false
      },
      {
        name: 'Realme 12 Pro+ 5G (12GB RAM, 256GB - Submarine Blue)',
        description: 'Luxury watch design mastercrafted by Ollivier Saveo. Flagship 64MP Periscope Telephoto camera with 120X SuperZoom, Sony IMX890 OIS camera, and curved 120Hz OLED vision display.',
        price: 34999.00,
        discountPrice: 29999.00,
        category: 'Mobiles',
        brand: 'Realme',
        stock: 22,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80',
        rating: 4.4,
        numReviews: 19,
        featured: false
      },
      {
        name: 'Vivo V30 Pro 5G (12GB RAM, 512GB - Andaman Blue)',
        description: 'Co-engineered with ZEISS professional portrait camera system. 50MP VCS True Color main camera + 50MP Professional Portrait camera. Smart Studio Aura Light portrait for studio-quality photography.',
        price: 46999.00,
        discountPrice: 41999.00,
        category: 'Mobiles',
        brand: 'Vivo',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 14,
        featured: false
      },
      {
        name: 'Nothing Phone (2) 5G (12GB RAM, 256GB - Dark Grey)',
        description: 'Iconic transparent design with customizable Glyph Interface LED lighting. Nothing OS 2.5 on Snapdragon 8+ Gen 1, dual 50MP Sony sensors with Advanced HDR, and LTPO OLED 120Hz display.',
        price: 49999.00,
        discountPrice: 36999.00,
        category: 'Mobiles',
        brand: 'Nothing',
        stock: 19,
        image: 'https://images.unsplash.com/photo-1598327105854-c8674faddf79?auto=format&fit=crop&w=1000&q=80',
        rating: 4.5,
        numReviews: 28,
        featured: true
      },
      {
        name: 'Motorola Edge 50 Pro 5G (12GB RAM, 256GB - Luxe Lavender)',
        description: 'World 1st Pantone validated true-color display and camera. 50MP main camera with OIS + 3X telephoto, 144Hz 1.5K pOLED curved screen, vegan leather back, IP68 water protection, and 125W TurboPower charging.',
        price: 35999.00,
        discountPrice: 31999.00,
        category: 'Mobiles',
        brand: 'Motorola',
        stock: 16,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 22,
        featured: false
      },
      {
        name: 'Google Pixel 8 5G (8GB RAM, 128GB - Hazel)',
        description: 'Engineered with Google Tensor G3 chip for leading-edge photo and video capabilities. Best Take, Magic Audio Eraser, Real Tone, and 7 years of promised OS and security updates.',
        price: 75999.00,
        discountPrice: 62999.00,
        category: 'Mobiles',
        brand: 'Google',
        stock: 12,
        rating: 4.7,
        numReviews: 36,
        featured: true
      },
      {
        name: 'iQOO Neo 9 Pro 5G (8GB RAM, 256GB - Fiery Red)',
        description: 'Dual-chip power with Snapdragon 8 Gen 2 and dedicated Supercomputing Q1 chip. 50MP Sony IMX920 Night Vision camera, 144Hz 1.5K LTPO AMOLED display, and 120W FlashCharge with dual-tone vegan leather finish.',
        price: 39999.00,
        discountPrice: 34999.00,
        category: 'Mobiles',
        brand: 'iQOO',
        stock: 28,
        image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 25,
        featured: false
      },

      // 2. ELECTRONICS
      {
        name: 'Apple MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
        description: 'The pinnacle of mobile workstation performance. Built for extreme workflows with Apple M3 Max silicon, Liquid Retina XDR display, up to 22 hours of battery life, and six-speaker sound system.',
        price: 249999.00,
        discountPrice: 229999.00,
        category: 'Electronics',
        brand: 'Apple',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 1,
        featured: true,
        reviews: [
          {
            user: demoUser._id,
            name: demoUser.name,
            rating: 5,
            comment: 'Incredible speed for compilation, 4K rendering, and local LLMs. Battery lasts an entire work day.',
            createdAt: new Date('2026-09-18')
          }
        ]
      },
      {
        name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor (U3223QE)',
        description: 'IPS Black technology with 2000:1 contrast ratio, 98% DCI-P3 color gamut, 90W USB-C Power Delivery, and built-in KVM switch for multi-computer productivity.',
        price: 74999.00,
        discountPrice: 69999.00,
        category: 'Electronics',
        brand: 'Dell',
        stock: 8,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: false
      },
      {
        name: 'ASUS ROG Zephyrus G16 Gaming Laptop (RTX 4070)',
        description: 'Ultra-slim OLED 2.5K 240Hz gaming powerhouse with Intel Core Ultra 9 processor, NVIDIA GeForce RTX 4070 GPU, and CNC aluminum chassis.',
        price: 179990.00,
        discountPrice: 164990.00,
        category: 'Electronics',
        brand: 'ASUS',
        stock: 10,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: true
      },
      {
        name: 'Apple iPad Air 11" M2 Chip (128GB Wi-Fi Space Grey)',
        description: 'Stunning Liquid Retina display with True Tone, Apple M2 chip, 12MP landscape front camera with Center Stage, and superfast Wi-Fi 6E.',
        price: 59900.00,
        discountPrice: 56900.00,
        category: 'Electronics',
        brand: 'Apple',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },

      // 3. FASHION
      {
        name: 'Manyavar Men\'s Royal Silk Kurta Pajama Set with Jacket',
        description: 'Handcrafted jacquard silk festive kurta set featuring intricate golden zari embroidery, mandarin collar, and matching silk pajama pants. Perfect for Indian weddings and festivals.',
        price: 6999.00,
        discountPrice: 4999.00,
        category: 'Fashion',
        brand: 'Manyavar',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 1,
        featured: true,
        reviews: [
          {
            user: demoUser._id,
            name: demoUser.name,
            rating: 5,
            comment: 'Stitching and fabric quality are superb. Got lots of compliments during Diwali!',
            createdAt: new Date('2026-10-20')
          }
        ]
      },
      {
        name: 'FabIndia Women\'s Chanderi Silk Zari Work Festive Saree',
        description: 'Woven with pure Chanderi silk with delicate golden floral zari borders. Comes with an unstitched matching blouse piece. Graceful drape for traditional Indian gatherings.',
        price: 7990.00,
        discountPrice: 5990.00,
        category: 'Fashion',
        brand: 'FabIndia',
        stock: 24,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 1,
        featured: true,
        reviews: [
          {
            user: customerUser2._id,
            name: customerUser2.name,
            rating: 5,
            comment: 'Authentic Indian ethnic craftsmanship. Fabric is lightweight and breathable.',
            createdAt: new Date('2026-10-22')
          }
        ]
      },
      {
        name: 'Woodland Men\'s Handcrafted Leather Adventure Boots',
        description: 'Heavy-duty genuine nubuck leather upper with deep tread rubber outsole for superior grip on rough terrains. Shock-absorbing cushioned footbed.',
        price: 5495.00,
        discountPrice: 3995.00,
        category: 'Fashion',
        brand: 'Woodland',
        stock: 28,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Levi\'s Men\'s 511 Slim Fit Stretchable Denim Jeans',
        description: 'Modern slim cut with room to move. Crafted with premium stretch denim for all-day flexible comfort and timeless five-pocket styling.',
        price: 3599.00,
        discountPrice: 2499.00,
        category: 'Fashion',
        brand: 'Levi\'s',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },

      // 4. HOME & FURNITURE
      {
        name: 'Wakefit Orthopedic Memory Foam King Size Mattress (78x72x8")',
        description: 'Engineered with NextGen memory foam for targeted spinal alignment and zero motion transfer. Breathable fabric cover with 10-year manufacturer warranty across India.',
        price: 18499.00,
        discountPrice: 14299.00,
        category: 'Home & Furniture',
        brand: 'Wakefit',
        stock: 14,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: true
      },
      {
        name: 'Solid Sheesham Wood 6-Seater Dining Table Set',
        description: 'Made from 100% seasoned Sheesham rosewood with walnut finish. Includes spacious dining table and 6 ergonomic cushioned chairs with stain-resistant fabric.',
        price: 34999.00,
        discountPrice: 27499.00,
        category: 'Home & Furniture',
        brand: 'UrbanWood',
        stock: 5, // low stock testing
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 0,
        featured: false
      },
      {
        name: 'SleepyCat Ergonomic High-Back Recliner Study & Office Chair',
        description: 'Designed for long work-from-home hours with adjustable lumbar support, 3D armrests, breathable Korean mesh, and 135° recline with footrest.',
        price: 12999.00,
        discountPrice: 9999.00,
        category: 'Home & Furniture',
        brand: 'SleepyCat',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1580481077195-c3c26027a4d5?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Philips Hue Smart Wi-Fi LED Ambience Ceiling Light with Dimmer',
        description: 'Control over 16 million colors and shades of warm-to-cool white light. Syncs with music and movies, compatible with Alexa and Google Assistant.',
        price: 8999.00,
        discountPrice: 6999.00,
        category: 'Home & Furniture',
        brand: 'Philips',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 0,
        featured: false
      },

      // 5. APPLIANCES
      {
        name: 'LG 55" 4K Ultra HD Smart OLED TV (OLED55C3) with Dolby Vision',
        description: 'Self-lit OLED pixels with α9 AI Processor Gen6, Dolby Vision & Atmos, 120Hz refresh rate, 0.1ms response time, and hands-free voice control.',
        price: 119990.00,
        discountPrice: 99990.00,
        category: 'Appliances',
        brand: 'LG',
        stock: 9,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 0,
        featured: true
      },
      {
        name: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner with Laser Fluffy',
        description: 'Laser reveals invisible micro-dust on hard floors. Piezo sensor continuously sizes and counts dust particles, automatically ramping up suction power when needed.',
        price: 55900.00,
        discountPrice: 47900.00,
        category: 'Appliances',
        brand: 'Dyson',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: false
      },
      {
        name: 'IFB 8.5 kg 5-Star AI Powered Front Load Washing Machine with Steam',
        description: 'Features 3D Warm Soak, Aqua Energie water filter for hard Indian water, 9 Swirl wash options, and steam wash that eliminates 99.9% of bacteria and allergens.',
        price: 38990.00,
        discountPrice: 33490.00,
        category: 'Appliances',
        brand: 'IFB',
        stock: 16,
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Havells 1200mm Stealth Air BLDC Energy Saving Ceiling Fan with Remote',
        description: 'Saves up to 60% electricity with BLDC technology. Ultra-silent aerodynamic ABS blades, point-anywhere RF remote control, and timer modes.',
        price: 6499.00,
        discountPrice: 4899.00,
        category: 'Appliances',
        brand: 'Havells',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 0,
        featured: false
      },

      // 6. BEAUTY
      {
        name: 'Forest Essentials Ayurvedic Soundarya Radiance Cream with 24K Gold',
        description: 'Traditional Ayurvedic preparation using 24 karat gold bhasma, saffron, and pure cold-pressed oils to deeply nourish and restore youthful glow and elasticity.',
        price: 3650.00,
        discountPrice: 3299.00,
        category: 'Beauty',
        brand: 'Forest Essentials',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 1,
        featured: true,
        reviews: [
          {
            user: customerUser2._id,
            name: customerUser2.name,
            rating: 5,
            comment: 'Feels pure luxury on skin. Amazing natural fragrance and leaves a soft radiant glow.',
            createdAt: new Date('2026-10-15')
          }
        ]
      },
      {
        name: 'Kama Ayurveda Pure Rose Water Facial Mist (200ml)',
        description: 'Steam-distilled from the highest quality Kannauj roses in Uttar Pradesh. Acts as a soothing toner that tightens pores, balances skin pH, and cools tired skin.',
        price: 1495.00,
        discountPrice: 1299.00,
        category: 'Beauty',
        brand: 'Kama Ayurveda',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Philips Touchless Hair Dryer & Multi-Styler Prestige Series',
        description: 'SenseIQ technology constantly senses your hair temperature and adapts heat over 12,000 times per session to prevent heat damage and lock in 90% natural moisture.',
        price: 8999.00,
        discountPrice: 6999.00,
        category: 'Beauty',
        brand: 'Philips',
        stock: 22,
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Minimalist 10% Niacinamide & Zinc Face Serum (Pack of 2)',
        description: 'Clinically proven formula with pure Vitamin B3 (Niacinamide) and Zinc PCA to reduce acne blemishes, repair damaged barrier, and regulate sebum production.',
        price: 1198.00,
        discountPrice: 999.00,
        category: 'Beauty',
        brand: 'Minimalist',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      },

      // 7. GROCERY
      {
        name: 'Tata Sampann Organic Royal Aged Basmati Rice (5kg Pack)',
        description: 'Authentic aromatic extra-long grain aged basmati rice sourced from Himalayan foothills. Ideal for royal Indian biryanis and pulao.',
        price: 899.00,
        discountPrice: 699.00,
        category: 'Grocery',
        brand: 'Tata Sampann',
        stock: 75,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Organic India Tulsi Green Tea (100 Bags) & Certified Wild Honey',
        description: 'Antioxidant-rich herbal infusion blend containing Krishna, Rama, and Vana Tulsi paired with raw wild unpasteurized forest honey for immune wellness.',
        price: 750.00,
        discountPrice: 599.00,
        category: 'Grocery',
        brand: 'Organic India',
        stock: 55,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 0,
        featured: true
      },
      {
        name: 'Fortune Sunlite Refined Sunflower Oil with Vitamins A & D (5L Can)',
        description: 'Light, healthy cooking oil with essential polyunsaturated fatty acids and natural Vitamin E. Fortified with Vitamins A and D for healthy heart.',
        price: 820.00,
        discountPrice: 719.00,
        category: 'Grocery',
        brand: 'Fortune',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 0,
        featured: false
      },
      {
        name: 'Nutraj California Premium Almonds & Walnuts Superfood Combo (1kg)',
        description: 'Handpicked jumbo California badam and Chilean walnut kernels packed in nitrogen-flushed pouch for ultimate freshness and crunchy taste.',
        price: 1499.00,
        discountPrice: 1149.00,
        category: 'Grocery',
        brand: 'Nutraj',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 0,
        featured: false
      },

      // 8. ACCESSORIES
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation optimized by dual processors and 8 microphones. Enjoy crystal clear hands-free calling, up to 30 hours of battery life, and ultra-comfortable lightweight design.',
        price: 29990.00,
        discountPrice: 26990.00,
        category: 'Accessories',
        brand: 'Sony',
        stock: 28,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        rating: 4.8,
        numReviews: 1,
        featured: true,
        reviews: [
          {
            user: demoUser._id,
            name: demoUser.name,
            rating: 5,
            comment: 'ANC cuts out all train and traffic noise. Multipoint connection between laptop and phone is seamless.',
            createdAt: new Date('2026-09-20')
          }
        ]
      },
      {
        name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Rugged Titanium',
        description: 'The most rugged and capable Apple Watch. Engineered for endurance athletes, outdoor adventures, and water sports with a lightweight titanium case and up to 72 hours of battery.',
        price: 89900.00,
        discountPrice: 84900.00,
        category: 'Accessories',
        brand: 'Apple',
        stock: 12,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80',
        rating: 4.9,
        numReviews: 0,
        featured: true
      },
      {
        name: 'Bose QuietComfort Ultra Spatial Audio Earbuds',
        description: 'Revolutionary spatial audio for immersive listening, world-class active noise cancellation, CustomTune sound calibration, and all-day comfort with 9 ear tip combinations.',
        price: 25900.00,
        discountPrice: 21900.00,
        category: 'Accessories',
        brand: 'Bose',
        stock: 25,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
        rating: 4.6,
        numReviews: 0,
        featured: false
      },
      {
        name: 'DailyObjects City Compact Waterproof Tech Laptop Backpack (22L)',
        description: 'Weatherproof high-density ballistic nylon with dedicated 16-inch padded laptop sleeve, RFID-blocking passport pocket, and luggage pass-through strap.',
        price: 3499.00,
        discountPrice: 2499.00,
        category: 'Accessories',
        brand: 'DailyObjects',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
        rating: 4.7,
        numReviews: 0,
        featured: false
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seeder] Seeded ${createdProducts.length} Products across all 8 Indian categories.`);

    // 3. Create Sample Orders with Indian Payment Methods (UPI, COD, Card, Net Banking)
    const sampleOrders = [
      {
        user: demoUser._id,
        orderItems: [
          {
            product: createdProducts[24]._id, // Sony Headphones (Accessories)
            name: createdProducts[24].name,
            quantity: 1,
            price: createdProducts[24].discountPrice,
            image: createdProducts[24].image
          },
          {
            product: createdProducts[8]._id, // Manyavar Kurta (Fashion)
            name: createdProducts[8].name,
            quantity: 1,
            price: createdProducts[8].discountPrice,
            image: createdProducts[8].image
          }
        ],
        shippingAddress: {
          fullName: demoUser.name,
          phone: demoUser.phone,
          houseFlat: 'Flat 402, Green Glen Residency',
          street: 'Magarpatta City, Hadapsar',
          landmark: 'Near Cybercity Tower 4',
          address: 'Flat 402, Green Glen Residency, Magarpatta City, Hadapsar',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411028',
          postalCode: '411028',
          country: 'India'
        },
        paymentMethod: 'UPI',
        paymentResult: {
          id: 'UPI-HDFC-9938102391',
          status: 'COMPLETED',
          update_time: new Date('2026-10-18T10:14:00Z').toISOString(),
          email_address: demoUser.email,
          upiId: 'yallari@okhdfcbank'
        },
        itemsPrice: 31989.00,
        taxPrice: 1599.45,
        shippingPrice: 0.00,
        totalPrice: 33588.45,
        isPaid: true,
        paidAt: new Date('2026-10-18T10:15:00Z'),
        orderStatus: 'Delivered',
        deliveredAt: new Date('2026-10-21T16:30:00Z'),
        createdAt: new Date('2026-10-18T10:14:00Z')
      },
      {
        user: customerUser2._id,
        orderItems: [
          {
            product: createdProducts[4]._id, // MacBook Pro (Electronics)
            name: createdProducts[4].name,
            quantity: 1,
            price: createdProducts[4].discountPrice,
            image: createdProducts[4].image
          }
        ],
        shippingAddress: {
          fullName: customerUser2.name,
          phone: customerUser2.phone,
          houseFlat: 'Apt 12B, Horizon View',
          street: 'Pali Hill, Bandra West',
          landmark: 'Near Carter Road Promenade',
          address: 'Apt 12B, Horizon View, Pali Hill, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400050',
          postalCode: '400050',
          country: 'India'
        },
        paymentMethod: 'Credit/Debit Card',
        paymentResult: {
          id: 'CARD-RAZOR-44829103',
          status: 'COMPLETED',
          update_time: new Date('2026-10-22T08:22:00Z').toISOString(),
          email_address: customerUser2.email,
          cardLast4: '4242'
        },
        itemsPrice: 229999.00,
        taxPrice: 11499.95,
        shippingPrice: 0.00,
        totalPrice: 241498.95,
        isPaid: true,
        paidAt: new Date('2026-10-22T08:22:00Z'),
        orderStatus: 'Shipped',
        createdAt: new Date('2026-10-22T08:20:00Z')
      },
      {
        user: demoUser._id,
        orderItems: [
          {
            product: createdProducts[16]._id, // LG OLED TV (Appliances)
            name: createdProducts[16].name,
            quantity: 1,
            price: createdProducts[16].discountPrice,
            image: createdProducts[16].image
          }
        ],
        shippingAddress: {
          fullName: demoUser.name,
          phone: demoUser.phone,
          houseFlat: 'Flat 402, Green Glen Residency',
          street: 'Magarpatta City, Hadapsar',
          landmark: 'Near Cybercity Tower 4',
          address: 'Flat 402, Green Glen Residency, Magarpatta City, Hadapsar',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411028',
          postalCode: '411028',
          country: 'India'
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: 99990.00,
        taxPrice: 4999.50,
        shippingPrice: 0.00,
        totalPrice: 104989.50,
        isPaid: false,
        orderStatus: 'Processing',
        createdAt: new Date('2026-10-24T09:30:00Z')
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('[Seeder] Seeded 3 Sample Orders across UPI, Card, and COD.');

    console.log('\n======================================================');
    console.log('✅ SHOPNOVA DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('------------------------------------------------------');
    console.log('Admin Account:    admin@shopnova.in  / password123');
    console.log('Customer Account: yallari@example.com / password123');
    console.log('Customer Account: priya@example.com   / password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
