const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');
const User = require('../models/User');

const allCategoryProducts = [
  // ==========================================
  // 1. HOME & FURNITURE (10 Products)
  // ==========================================
  {
    name: 'Wakefit Orthopedic Memory Foam Mattress (King Size, 78x72x8 inch)',
    brand: 'Wakefit',
    category: 'Home & Furniture',
    price: 18499,
    discountPrice: 14799,
    stock: 20,
    rating: 4.8,
    numReviews: 42,
    featured: true,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
    description: 'Customized support for back pain relief with high-density pressure-relieving memory foam. 10 years manufacturer warranty across India.'
  },
  {
    name: 'Godrej Interio Recliner Chair with High Density Foam (Single Seater, Brown)',
    brand: 'Godrej Interio',
    category: 'Home & Furniture',
    price: 26999,
    discountPrice: 21999,
    stock: 14,
    rating: 4.7,
    numReviews: 28,
    featured: true,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    description: '3-stage smooth reclining mechanism with plush leatherette upholstery. Lumbar support designed for long reading and relaxation hours.'
  },
  {
    name: 'Green Soul Monster Ultimate Ergonomic Gaming & Work Chair (Black & Red)',
    brand: 'Green Soul',
    category: 'Home & Furniture',
    price: 22990,
    discountPrice: 17990,
    stock: 18,
    rating: 4.6,
    numReviews: 35,
    featured: false,
    image: 'https://images.unsplash.com/photo-1580481077197-2a677943c5b8?w=800&auto=format&fit=crop&q=80',
    description: 'Breathable spandex & PU leather, magnetic memory foam head pillow, 4D adjustable armrests, and heavy-duty metal base with 135-degree recline.'
  },
  {
    name: 'Sheesham Wood 6-Seater Dining Table Set with Cushioned Chairs',
    brand: 'Solimo',
    category: 'Home & Furniture',
    price: 42999,
    discountPrice: 32999,
    stock: 8,
    rating: 4.7,
    numReviews: 19,
    featured: true,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&auto=format&fit=crop&q=80',
    description: 'Handcrafted from 100% genuine solid Sheesham wood with walnut finish. Termite-resistant and built for generations of Indian family dining.'
  },
  {
    name: 'Urban Ladder Engineered Wood Computer & Study Desk with Storage Drawer',
    brand: 'Urban Ladder',
    category: 'Home & Furniture',
    price: 11999,
    discountPrice: 8499,
    stock: 22,
    rating: 4.5,
    numReviews: 24,
    featured: false,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
    description: 'Contemporary minimalist study desk with cable organizer grommet and smooth telescopic drawer for stationery and work laptops.'
  },
  {
    name: 'Sleepwell Dual Pro Profiled Foam Reversible Mattress (Queen Size, 78x60)',
    brand: 'Sleepwell',
    category: 'Home & Furniture',
    price: 15499,
    discountPrice: 12999,
    stock: 16,
    rating: 4.6,
    numReviews: 31,
    featured: false,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=80',
    description: 'Dual-feel mattress with one soft side and one firm side for personalized spine alignment. Treated with Neem Fresche anti-microbial technology.'
  },
  {
    name: 'DeckUp Siena Engineered Wood 3-Door Wardrobe with Mirror (Dark Wenge)',
    brand: 'DeckUp',
    category: 'Home & Furniture',
    price: 18999,
    discountPrice: 13499,
    stock: 11,
    rating: 4.4,
    numReviews: 17,
    featured: false,
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?w=800&auto=format&fit=crop&q=80',
    description: 'Spacious 3-door wardrobe with hanging rods, 5 organizer shelves, integrated full-length dressing mirror, and lockable security drawer.'
  },
  {
    name: 'Story@Home Pure Cotton 300 TC Double Bedsheet with 2 Pillow Covers',
    brand: 'Story@Home',
    category: 'Home & Furniture',
    price: 1999,
    discountPrice: 999,
    stock: 50,
    rating: 4.5,
    numReviews: 64,
    featured: false,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    description: '100% combed cotton with 300 thread count sateen weave. Breathable, hypoallergenic, color-fast, and luxuriously soft for Indian climates.'
  },
  {
    name: 'Kurl-on Foam & Coir Ortho Balance Firm Mattress (Single, 72x36)',
    brand: 'Kurl-on',
    category: 'Home & Furniture',
    price: 8999,
    discountPrice: 6999,
    stock: 25,
    rating: 4.5,
    numReviews: 22,
    featured: false,
    image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&auto=format&fit=crop&q=80',
    description: 'Rubberised natural coir core blended with supportive bonded foam. Excellent air circulation and firm posture support.'
  },
  {
    name: 'Nilkamal Freedom Mini Medium Plastic Cabinet with Shelves (Weather Brown)',
    brand: 'Nilkamal',
    category: 'Home & Furniture',
    price: 4999,
    discountPrice: 3499,
    stock: 30,
    rating: 4.3,
    numReviews: 40,
    featured: false,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
    description: 'Lightweight, rust-free, water-resistant multi-purpose storage organizer cupboard. Easy DIY assembly with heavy-duty virgin polymer.'
  },

  // ==========================================
  // 2. APPLIANCES (10 Products)
  // ==========================================
  {
    name: 'LG 55-inch 4K Ultra HD Smart OLED TV (OLED55C3PSA) with Dolby Vision',
    brand: 'LG',
    category: 'Appliances',
    price: 149990,
    discountPrice: 124990,
    stock: 12,
    rating: 4.9,
    numReviews: 38,
    featured: true,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    description: 'Self-lit OLED pixels with infinite contrast and 100% color fidelity. α9 AI 4K Gen6 Processor, 120Hz refresh rate, Dolby Atmos 40W sound, and webOS 23.'
  },
  {
    name: 'Samsung 653 L Convertible 5-in-1 Side by Side Refrigerator with AI Eco',
    brand: 'Samsung',
    category: 'Appliances',
    price: 104990,
    discountPrice: 84990,
    stock: 10,
    rating: 4.8,
    numReviews: 29,
    featured: true,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
    description: 'SpaceMax technology offers more interior room without increasing exterior dimensions. SmartThings AI Energy mode saves up to 10% electricity.'
  },
  {
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC with PM 2.5 Filter',
    brand: 'Daikin',
    category: 'Appliances',
    price: 58900,
    discountPrice: 45490,
    stock: 15,
    rating: 4.7,
    numReviews: 54,
    featured: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    description: 'Cools effectively even at 54°C ambient temperature. Triple display, dew clean technology, 100% copper condenser coil with anti-corrosion treatment.'
  },
  {
    name: 'Bosch 8 kg 5 Star Inverter Fully Automatic Front Loading Washing Machine',
    brand: 'Bosch',
    category: 'Appliances',
    price: 48990,
    discountPrice: 38490,
    stock: 16,
    rating: 4.8,
    numReviews: 44,
    featured: false,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80',
    description: 'EcoSilence Drive brushless motor with anti-vibration side panels. ActiveWater Plus optimizes water consumption according to fabric and wash load.'
  },
  {
    name: 'Philips Digital Air Fryer with Rapid Air Technology (4.1 L, 1400W)',
    brand: 'Philips',
    category: 'Appliances',
    price: 11995,
    discountPrice: 7999,
    stock: 35,
    rating: 4.6,
    numReviews: 62,
    featured: true,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    description: 'Cook delicious fries, samosas, and roasted vegetables with up to 90% less oil. Touch screen with 7 presets and keep warm function.'
  },
  {
    name: 'IFB 30 L Convection Microwave Oven with 101 Auto-Cook Menus (30FRC2)',
    brand: 'IFB',
    category: 'Appliances',
    price: 17490,
    discountPrice: 13990,
    stock: 18,
    rating: 4.5,
    numReviews: 26,
    featured: false,
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80',
    description: 'Fermentation, baking, grilling, and defrosting capabilities. Stainless steel cavity, deodorize feature, and child lock protection.'
  },
  {
    name: 'Havells Stealth Air BLDC Ceiling Fan with Remote (1200mm, Low Noise)',
    brand: 'Havells',
    category: 'Appliances',
    price: 8990,
    discountPrice: 5999,
    stock: 28,
    rating: 4.6,
    numReviews: 33,
    featured: false,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    description: 'Eco-friendly BLDC motor saves up to 60% electricity. Aerodynamic ABS blades deliver 280 m³/min air delivery in near silence.'
  },
  {
    name: 'Prestige Iris 750W Mixer Grinder with 3 Stainless Steel Jars + Juicer',
    brand: 'Prestige',
    category: 'Appliances',
    price: 4995,
    discountPrice: 2999,
    stock: 45,
    rating: 4.4,
    numReviews: 70,
    featured: false,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80',
    description: 'Powerful 750-watt heavy duty motor handles tough Indian spices, idli batter, and chutneys. Overload protection and ergonomic sturdy handles.'
  },
  {
    name: 'Kent Grand Plus RO + UV + UF Water Purifier with TDS Controller (9 L)',
    brand: 'Kent',
    category: 'Appliances',
    price: 20000,
    discountPrice: 14999,
    stock: 20,
    rating: 4.7,
    numReviews: 48,
    featured: false,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&auto=format&fit=crop&q=80',
    description: 'Multi-stage purification removes dissolved impurities like arsenic and heavy metals while retaining essential natural minerals.'
  },
  {
    name: 'Bajaj New Shakti 15 Litre Vertical Storage Water Heater Geyser (2000W)',
    brand: 'Bajaj',
    category: 'Appliances',
    price: 9999,
    discountPrice: 6299,
    stock: 24,
    rating: 4.5,
    numReviews: 39,
    featured: false,
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    description: 'Titanium Armour Technology for longer tank life. 8 bar pressure rating suitable for Indian high-rise apartments with swirl flow water distribution.'
  },

  // ==========================================
  // 3. BEAUTY (10 Products)
  // ==========================================
  {
    name: 'Forest Essentials Ayurvedic Soundarya Radiance Cream with 24K Gold & SPF 25 (50g)',
    brand: 'Forest Essentials',
    category: 'Beauty',
    price: 6275,
    discountPrice: 5899,
    stock: 25,
    rating: 4.9,
    numReviews: 32,
    featured: true,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    description: 'Infused with pure 24 Karat gold bhasma, saffron, and cold-pressed organic oils. Restores firmness and imparts a luminous youthful glow.'
  },
  {
    name: 'Kama Ayurveda Pure Rose Water Face Mist (200ml - Steam Distilled)',
    brand: 'Kama Ayurveda',
    category: 'Beauty',
    price: 1795,
    discountPrice: 1599,
    stock: 30,
    rating: 4.8,
    numReviews: 41,
    featured: true,
    image: 'https://images.unsplash.com/photo-1608248597359-598d1a123f1f?w=800&auto=format&fit=crop&q=80',
    description: 'Made from the legendary roses of Kannauj, Uttar Pradesh. Steam distilled to perfection to tone, refresh, and balance skin pH naturally.'
  },
  {
    name: 'The Derma Co 10% Niacinamide Face Serum with Zinc for Acne Marks (30ml)',
    brand: 'The Derma Co',
    category: 'Beauty',
    price: 599,
    discountPrice: 479,
    stock: 45,
    rating: 4.5,
    numReviews: 55,
    featured: false,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    description: 'Dermatologist-formulated daily serum that fades dark spots, regulates sebum production, and strengthens the skin protective moisture barrier.'
  },
  {
    name: 'Mamaearth Onion Hair Oil with Redensyl for Hair Fall Control (250ml)',
    brand: 'Mamaearth',
    category: 'Beauty',
    price: 599,
    discountPrice: 499,
    stock: 50,
    rating: 4.4,
    numReviews: 68,
    featured: false,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80',
    description: 'Enriched with sulphur-rich onion seed oil and Redensyl. Nourishes scalp, stimulates hair follicles, and reduces hair fall naturally.'
  },
  {
    name: 'Lakme Absolute Skin Gloss Gel Creme Ultra Hydration Moisturizer (50g)',
    brand: 'Lakme',
    category: 'Beauty',
    price: 699,
    discountPrice: 489,
    stock: 40,
    rating: 4.6,
    numReviews: 37,
    featured: false,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    description: 'Mineral-laden water gel formulation that absorbs instantly. Gives skin a glossy, supple, mirror-like hydration finish throughout the day.'
  },
  {
    name: 'Maybelline New York Super Stay Matte Ink Liquid Lipstick (Fighter, 5ml)',
    brand: 'Maybelline',
    category: 'Beauty',
    price: 699,
    discountPrice: 499,
    stock: 35,
    rating: 4.6,
    numReviews: 52,
    featured: false,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80',
    description: 'Up to 16 hours of transfer-proof, smudge-resistant saturated matte color. Unique arrow precision applicator glides effortlessly.'
  },
  {
    name: 'Biotique Bio Kelp Protein Shampoo for Falling Hair Intensive Therapy (650ml)',
    brand: 'Biotique',
    category: 'Beauty',
    price: 540,
    discountPrice: 389,
    stock: 42,
    rating: 4.5,
    numReviews: 46,
    featured: false,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
    description: '100% botanical Ayurvedic recipe with sea kelp, natural protein, peppermint oil, and bhringraj extract for thicker, healthier hair growth.'
  },
  {
    name: 'Plum Green Tea Alcohol-Free Toner with Glycolic Acid (200ml)',
    brand: 'Plum',
    category: 'Beauty',
    price: 390,
    discountPrice: 299,
    stock: 38,
    rating: 4.7,
    numReviews: 49,
    featured: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    description: 'Clarifies enlarged pores, tightens skin, and fights acne without drying. 100% vegan, cruelty-free, and alcohol-free.'
  },
  {
    name: 'Minimalist Sunscreen SPF 50 PA++++ with Niacinamide (50g)',
    brand: 'Minimalist',
    category: 'Beauty',
    price: 399,
    discountPrice: 359,
    stock: 60,
    rating: 4.8,
    numReviews: 75,
    featured: true,
    image: 'https://images.unsplash.com/photo-1556228722-d0b719468925?w=800&auto=format&fit=crop&q=80',
    description: 'Lightweight broad-spectrum photostable sunscreen with 4 effective UV filters. Leaves zero white cast and no greasy residue on Indian skin.'
  },
  {
    name: 'WOW Skin Science Apple Cider Vinegar Foaming Face Wash with Brush (150ml)',
    brand: 'WOW Skin Science',
    category: 'Beauty',
    price: 399,
    discountPrice: 299,
    stock: 48,
    rating: 4.4,
    numReviews: 58,
    featured: false,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    description: 'Built-in soft silicone bristles gently unclog pores, cleanse dead skin cells, and control excess oil with organic Himalayan apple cider vinegar.'
  },

  // ==========================================
  // 4. GROCERY (10 Products)
  // ==========================================
  {
    name: 'India Gate Basmati Rice Classic Premium Aged Long Grain (5 kg Bag)',
    brand: 'India Gate',
    category: 'Grocery',
    price: 1199,
    discountPrice: 949,
    stock: 50,
    rating: 4.9,
    numReviews: 82,
    featured: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    description: 'Aged for 2 years to deliver unmatched aroma, slender grains, and royal fluffy texture for authentic Indian biryanis and pulao.'
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Cooking Oil (5 Litre Can)',
    brand: 'Fortune',
    category: 'Grocery',
    price: 850,
    discountPrice: 699,
    stock: 40,
    rating: 4.7,
    numReviews: 65,
    featured: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    description: 'Light and healthy cooking oil enriched with vitamins A, D, and E. Low absorb technology keeps food crispy without excess oiliness.'
  },
  {
    name: 'Aashirvaad Shudh Chakki Atta 100% Whole Wheat Grain (10 kg Bag)',
    brand: 'Aashirvaad',
    category: 'Grocery',
    price: 499,
    discountPrice: 429,
    stock: 60,
    rating: 4.8,
    numReviews: 94,
    featured: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    description: 'Ground from heavy and golden grains with traditional stone chakki process. Retains 100% dietary fiber for soft and fluffy rotis.'
  },
  {
    name: 'Tata Tea Gold Assam Long Leaf Rich & Aromatic Black Tea (1 kg)',
    brand: 'Tata Tea',
    category: 'Grocery',
    price: 620,
    discountPrice: 499,
    stock: 45,
    rating: 4.7,
    numReviews: 53,
    featured: false,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    description: 'Exquisite blend of fine Assam CTC tea with 15% gently rolled long leaves for rich taste and irresistible aroma in every cup.'
  },
  {
    name: 'Dabur 100% Pure Honey with Sundarbans Nectar (1 kg with Free 250g)',
    brand: 'Dabur',
    category: 'Grocery',
    price: 490,
    discountPrice: 389,
    stock: 35,
    rating: 4.6,
    numReviews: 48,
    featured: false,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    description: '100% pure NMR tested honey sourced from pristine Sundarbans forests. Natural immunity booster and healthy replacement for refined sugar.'
  },
  {
    name: 'Tata Sampann Unpolished Toor Dal High Protein Pulses (1 kg)',
    brand: 'Tata Sampann',
    category: 'Grocery',
    price: 215,
    discountPrice: 179,
    stock: 55,
    rating: 4.8,
    numReviews: 40,
    featured: false,
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80',
    description: 'Unpolished pigeon peas that do not undergo artificial polishing with water or oil. Retains natural wholesome goodness, taste, and high protein.'
  },
  {
    name: 'Nutraj California Premium Almonds Badam Giri (1 kg Value Pack)',
    brand: 'Nutraj',
    category: 'Grocery',
    price: 1099,
    discountPrice: 799,
    stock: 30,
    rating: 4.7,
    numReviews: 37,
    featured: false,
    image: 'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=800&auto=format&fit=crop&q=80',
    description: 'Crunchy California almonds packed with plant-based protein, dietary fiber, vitamin E, and heart-healthy antioxidants.'
  },
  {
    name: 'Catch Kashmiri Mirch Powder Natural Red Color Spices (200g)',
    brand: 'Catch',
    category: 'Grocery',
    price: 165,
    discountPrice: 135,
    stock: 70,
    rating: 4.6,
    numReviews: 44,
    featured: false,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    description: 'Low-temperature ground spice with intense vibrant red color and mild piquant flavor. Adds restaurant-style color to gravies and tandoori dishes.'
  },
  {
    name: 'Nescafe Classic 100% Pure Instant Coffee Jar (200g)',
    brand: 'Nescafe',
    category: 'Grocery',
    price: 680,
    discountPrice: 569,
    stock: 38,
    rating: 4.8,
    numReviews: 59,
    featured: false,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    description: 'Made from hand-picked robusta coffee beans, slow-roasted to perfection. Signature rich coffee aroma and bold uplifting flavor.'
  },
  {
    name: 'Amul Pure Cow Ghee Traditional Aroma Tin (1 Litre)',
    brand: 'Amul',
    category: 'Grocery',
    price: 690,
    discountPrice: 599,
    stock: 45,
    rating: 4.9,
    numReviews: 88,
    featured: true,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&auto=format&fit=crop&q=80',
    description: 'Prepared using traditional bilona-style churned cow milk fat. Rich golden granular texture, divine aroma, and high smoke point for Indian sweets & cooking.'
  },

  // ==========================================
  // 5. ACCESSORIES (10 Products)
  // ==========================================
  {
    name: 'boAt Nirvana Ion ANC True Wireless Earbuds with 120H Playtime (Charcoal Black)',
    brand: 'boAt',
    category: 'Accessories',
    price: 7990,
    discountPrice: 2499,
    stock: 50,
    rating: 4.6,
    numReviews: 61,
    featured: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description: 'Active Noise Cancellation up to 32dB, HiFi DSP audio, dual EQ modes, 4-mic ENx call noise reduction, and jaw-dropping 120-hour battery life.'
  },
  {
    name: 'Noise ColorFit Ultra 3 Smartwatch with 1.96-inch AMOLED Display & Bluetooth Calling',
    brand: 'Noise',
    category: 'Accessories',
    price: 7999,
    discountPrice: 2999,
    stock: 35,
    rating: 4.5,
    numReviews: 47,
    featured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description: 'Largest 1.96" AMOLED screen with Always-On display, premium metallic finish, TruSync Bluetooth calling, and 100+ sports modes with health suite.'
  },
  {
    name: 'Anker 65W GaN Fast Charger 3-Port Type-C Adapter for Mac, iPhone & Android',
    brand: 'Anker',
    category: 'Accessories',
    price: 3999,
    discountPrice: 2799,
    stock: 25,
    rating: 4.8,
    numReviews: 33,
    featured: false,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    description: 'GaN II semiconductor technology delivers blazing 65W power in an ultra-compact body. Fast-charge 3 devices simultaneously with dynamic power distribution.'
  },
  {
    name: 'Mi 20000mAh 18W Fast Charge Power Bank 3i (Triple Output, Sandstone Black)',
    brand: 'Xiaomi',
    category: 'Accessories',
    price: 2199,
    discountPrice: 1799,
    stock: 40,
    rating: 4.7,
    numReviews: 54,
    featured: true,
    image: 'https://images.unsplash.com/photo-1609592424364-42fcf55ee5a3?w=800&auto=format&fit=crop&q=80',
    description: 'High-density lithium polymer battery with 12-layer advanced circuit protection. Two-way 18W fast charging and smart power management.'
  },
  {
    name: 'Wildcraft 45 L Ergonomic Rucksack Hiking & Laptop Backpack (Navy Blue)',
    brand: 'Wildcraft',
    category: 'Accessories',
    price: 3499,
    discountPrice: 2299,
    stock: 28,
    rating: 4.6,
    numReviews: 39,
    featured: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    description: 'Engineered with abrasion-resistant ripstop polyester, padded airflow back panel, Sternum chest strap, and dedicated 15.6" laptop sleeve.'
  },
  {
    name: "Titan Neo Analog Black Dial Men's Stainless Steel Watch (NL1733KM01)",
    brand: 'Titan',
    category: 'Accessories',
    price: 5995,
    discountPrice: 4495,
    stock: 22,
    rating: 4.7,
    numReviews: 45,
    featured: false,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    description: 'Classic minimalist dress watch with mineral glass, surgical grade stainless steel strap, quartz movement accuracy, and 50m water resistance.'
  },
  {
    name: 'JBL Flip 6 Wireless Portable Bluetooth Speaker with Deep Bass (Waterproof IP67)',
    brand: 'JBL',
    category: 'Accessories',
    price: 13999,
    discountPrice: 9999,
    stock: 20,
    rating: 4.8,
    numReviews: 50,
    featured: true,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
    description: '2-way speaker system with racetrack-shaped woofer and separate tweeter. PartyBoost pairing, IP67 dust/water resistance, and 12h battery.'
  },
  {
    name: 'Spigen Ultra Hybrid Back Case for iPhone / Galaxy (Anti-Yellowing Clear)',
    brand: 'Spigen',
    category: 'Accessories',
    price: 1999,
    discountPrice: 1299,
    stock: 45,
    rating: 4.7,
    numReviews: 38,
    featured: false,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    description: 'Air Cushion technology with raised camera bezels and crystal-clear polycarbonate back panel infused with blue resin to prevent yellowing.'
  },
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse with 8K DPI Sensor',
    brand: 'Logitech',
    category: 'Accessories',
    price: 10995,
    discountPrice: 8995,
    stock: 18,
    rating: 4.9,
    numReviews: 42,
    featured: true,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    description: 'Quiet Click switches with MagSpeed electromagnetic wheel scrolling 1,000 lines a second. Tracks on any surface, even glass.'
  },
  {
    name: "Urban Tribe Men's RFID Protected Genuine Leather Bifold Wallet (Tan Brown)",
    brand: 'Urban Tribe',
    category: 'Accessories',
    price: 1499,
    discountPrice: 799,
    stock: 35,
    rating: 4.5,
    numReviews: 29,
    featured: false,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    description: 'Crafted from 100% genuine top-grain cowhide leather with integrated military-grade RFID blocking liner to protect bank cards from skimming.'
  }
];

async function populateAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Populate] Connected to MongoDB...');

    const anyUser = await User.findOne();
    const userId = anyUser ? anyUser._id : new mongoose.Types.ObjectId();
    const userName = anyUser ? anyUser.name : 'Verified Customer';

    let added = 0;
    let updated = 0;

    for (const item of allCategoryProducts) {
      const existing = await Product.findOne({ name: item.name });

      const payload = {
        ...item,
        reviews: [
          {
            user: userId,
            name: userName,
            rating: 5,
            comment: '100% genuine product, fast delivery and excellent packaging. Highly recommended on ShopNova!',
            createdAt: new Date()
          }
        ]
      };

      if (existing) {
        Object.assign(existing, payload);
        await existing.save();
        updated++;
      } else {
        await Product.create(payload);
        added++;
      }
    }

    console.log(`[Populate] Finished! Added ${added} new products, updated ${updated} existing products.`);
    process.exit(0);
  } catch (err) {
    console.error('[Populate Error]:', err);
    process.exit(1);
  }
}

populateAll();

