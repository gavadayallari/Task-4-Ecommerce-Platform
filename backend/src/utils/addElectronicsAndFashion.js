const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');
const User = require('../models/User');

const extraProducts = [
  // ==========================================
  // ELECTRONICS (7 more to make 10+)
  // ==========================================
  {
    name: 'Apple iPad Air 11-inch (M2 Chip, 128GB Wi-Fi - Starlight)',
    brand: 'Apple',
    category: 'Electronics',
    price: 59900,
    discountPrice: 55900,
    stock: 20,
    rating: 4.8,
    numReviews: 29,
    featured: true,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    description: 'Breakthrough performance with Apple M2 silicon, Liquid Retina display, landscape 12MP front camera with Center Stage, and Wi-Fi 6E.'
  },
  {
    name: 'ASUS ROG Zephyrus G16 Gaming Laptop (Intel Ultra 9, RTX 4070, 32GB/1TB)',
    brand: 'ASUS',
    category: 'Electronics',
    price: 219990,
    discountPrice: 199990,
    stock: 12,
    rating: 4.9,
    numReviews: 18,
    featured: true,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
    description: 'Ultra-thin CNC aluminum chassis with 2.5K 240Hz OLED ROG Nebula display, slash lighting, and vapor chamber cooling.'
  },
  {
    name: 'Samsung T7 Shield 2TB Portable Rugged External Solid State Drive',
    brand: 'Samsung',
    category: 'Electronics',
    price: 19999,
    discountPrice: 14999,
    stock: 35,
    rating: 4.8,
    numReviews: 44,
    featured: false,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    description: 'Read speeds up to 1,050 MB/s. IP65 water and dust resistance with rubber elastomer exterior drop-resistant up to 3 meters.'
  },
  {
    name: 'Logitech MX Keys S Advanced Wireless Illuminated Keyboard',
    brand: 'Logitech',
    category: 'Electronics',
    price: 12995,
    discountPrice: 9995,
    stock: 25,
    rating: 4.7,
    numReviews: 38,
    featured: false,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description: 'Spherically-dished keys crafted for fingertips, smart illumination with hand proximity sensors, and multi-OS Bluetooth switching.'
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm IS STM Lens',
    brand: 'Canon',
    category: 'Electronics',
    price: 65995,
    discountPrice: 56990,
    stock: 14,
    rating: 4.7,
    numReviews: 22,
    featured: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    description: '24.2 MP APS-C CMOS sensor with Dual Pixel CMOS AF II. Uncropped 4K 30p video oversampled from 6K, compact lightweight travel body.'
  },
  {
    name: 'Sony SRS-XV800 High Power Wireless Party Speaker with Omnidirectional Sound',
    brand: 'Sony',
    category: 'Electronics',
    price: 49990,
    discountPrice: 41990,
    stock: 10,
    rating: 4.8,
    numReviews: 19,
    featured: false,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    description: 'X-Balanced Speaker Units, omnidirectional party sound and party lights, 25 hours of battery life with carry handle & wheels.'
  },
  {
    name: 'BenQ EW3270U 32-inch 4K HDR Eye Care Monitor with USB-C and B.I.+',
    brand: 'BenQ',
    category: 'Electronics',
    price: 36990,
    discountPrice: 28990,
    stock: 18,
    rating: 4.6,
    numReviews: 27,
    featured: false,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    description: 'VA panel with 3000:1 contrast ratio, 95% DCI-P3 wide color gamut, Brightness Intelligence Plus sensor, and USB-C connectivity.'
  },

  // ==========================================
  // FASHION (8 more to make 10+)
  // ==========================================
  {
    name: 'FabIndia Pure Chanderi Silk Zari Woven Saree with Blouse Piece (Emerald Green)',
    brand: 'FabIndia',
    category: 'Fashion',
    price: 9990,
    discountPrice: 7499,
    stock: 20,
    rating: 4.9,
    numReviews: 31,
    featured: true,
    image: 'https://images.unsplash.com/photo-1610030469668-932ec596e761?w=800&auto=format&fit=crop&q=80',
    description: 'Pure handwoven Chanderi silk with intricate traditional zari border. Perfect for festive weddings and celebratory ceremonies.'
  },
  {
    name: "Levi's 511 Slim Fit Stretchable Denim Jeans (Dark Indigo Blue)",
    brand: "Levi's",
    category: 'Fashion',
    price: 4199,
    discountPrice: 2899,
    stock: 35,
    rating: 4.6,
    numReviews: 54,
    featured: true,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    description: 'Modern slim fit with room to move. Premium stretch cotton denim with authentic arcuate stitching on back pockets.'
  },
  {
    name: 'Puma Smash v2 Leather Unisex Casual Sneakers (Puma White & Navy)',
    brand: 'Puma',
    category: 'Fashion',
    price: 4499,
    discountPrice: 2499,
    stock: 40,
    rating: 4.5,
    numReviews: 62,
    featured: false,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    description: 'Soft genuine leather upper with classic tennis silhouette. Cushioned SoftFoam+ sockliner for all-day street comfort.'
  },
  {
    name: "Allen Solly Men's Regular Fit Solid Pure Cotton Formal Shirt (Light Blue)",
    brand: 'Allen Solly',
    category: 'Fashion',
    price: 2199,
    discountPrice: 1399,
    stock: 45,
    rating: 4.4,
    numReviews: 43,
    featured: false,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    description: '100% premium breathable cotton with spread collar and single cuff. Crisp wrinkle-resistant finish for professional office wear.'
  },
  {
    name: "BIBA Women's Anarkali Kurta with Dupatta Set (Floral Printed Mustard Yellow)",
    brand: 'BIBA',
    category: 'Fashion',
    price: 5995,
    discountPrice: 3899,
    stock: 25,
    rating: 4.7,
    numReviews: 36,
    featured: true,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    description: 'Flared Anarkali silhouette with golden foil prints, round neck with gotta patti detailing, and matching lightweight chiffon dupatta.'
  },
  {
    name: 'Nike Air Max SC Running & Athletic Shoes (Triple Black)',
    brand: 'Nike',
    category: 'Fashion',
    price: 6795,
    discountPrice: 5299,
    stock: 30,
    rating: 4.8,
    numReviews: 48,
    featured: false,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    description: 'Classic heritage track look with visible Air cushioning. Leather, textile, and mesh combination upper for durability and ventilation.'
  },
  {
    name: 'Ray-Ban Classic Aviator Sunglasses (Polarized Green Classic G-15 Lens)',
    brand: 'Ray-Ban',
    category: 'Fashion',
    price: 11290,
    discountPrice: 8990,
    stock: 18,
    rating: 4.8,
    numReviews: 50,
    featured: true,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    description: 'Originally designed for US aviators in 1937. Crystal polarized lenses eliminate glare with 100% UV400 protection and gold metal frame.'
  },
  {
    name: "Red Tape Classic Leather Formal Oxford Shoes for Men (Rich Dark Brown)",
    brand: 'Red Tape',
    category: 'Fashion',
    price: 5299,
    discountPrice: 2199,
    stock: 32,
    rating: 4.6,
    numReviews: 41,
    featured: false,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80',
    description: 'Handcrafted genuine leather with cap-toe detailing. Cushioned memory foam footbed and durable slip-resistant TPR sole.'
  }
];

async function addExtra() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const anyUser = await User.findOne();
    const userId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
    const userName = anyUser ? anyUser.name : 'Verified Customer';

    for (const item of extraProducts) {
      const existing = await Product.findOne({ name: item.name });
      const payload = {
        ...item,
        reviews: [
          {
            user: userId,
            name: userName,
            rating: 5,
            comment: 'Excellent quality and fast delivery. Exactly as described!',
            createdAt: new Date()
          }
        ]
      };
      if (existing) {
        Object.assign(existing, payload);
        await existing.save();
      } else {
        await Product.create(payload);
      }
    }
    console.log('[Extra] Added Electronics & Fashion items to guarantee 10+ in each category.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addExtra();

