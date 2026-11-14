const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Product = require('../models/Product');
const Order = require('../models/Order');

// Preset INR price map for seeded catalog products
const inrPriceMap = {
  'Apple MacBook Pro 16"': { price: 249999, discountPrice: 229999 },
  'Sony WH-1000XM5': { price: 29990, discountPrice: 26990 },
  'Samsung Galaxy S24 Ultra': { price: 129999, discountPrice: 119999 },
  'Apple Watch Ultra 2': { price: 89900, discountPrice: 84900 },
  'Dell UltraSharp 32"': { price: 74999, discountPrice: 69999 },
  'Bose QuietComfort Ultra Earbuds': { price: 25900, discountPrice: 21900 },
  'Urban Classic Leather Flight Jacket': { price: 6999, discountPrice: 4999 },
  'Minimalist Premium White Leather Sneaker': { price: 3999, discountPrice: 2999 },
  'Herman Miller Aeron': { price: 125000, discountPrice: 115000 },
  'Breville Barista Touch': { price: 89990, discountPrice: 79990 },
  'Sony PlayStation 5 Slim': { price: 49990, discountPrice: 44990 },
  'Logitech G Pro X Superlight 2': { price: 13995, discountPrice: 11995 }
};

const convertExistingToINR = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Migration] Connected to MongoDB for INR conversion...');

    const products = await Product.find();
    let updatedProductsCount = 0;

    for (const prod of products) {
      let matched = false;
      for (const [key, map] of Object.entries(inrPriceMap)) {
        if (prod.name.toLowerCase().includes(key.toLowerCase())) {
          prod.price = map.price;
          prod.discountPrice = map.discountPrice;
          await prod.save();
          matched = true;
          updatedProductsCount++;
          break;
        }
      }

      // If custom product not in presets and price is still in low USD tier (< 5000)
      if (!matched && prod.price < 5000) {
        prod.price = Math.round(prod.price * 83);
        if (prod.discountPrice && prod.discountPrice > 0) {
          prod.discountPrice = Math.round(prod.discountPrice * 83);
        }
        await prod.save();
        updatedProductsCount++;
      }
    }

    console.log(`[Migration] Successfully updated ${updatedProductsCount} products to Indian Rupees (INR).`);

    // Also update existing orders if needed
    const orders = await Order.find();
    let updatedOrdersCount = 0;

    for (const order of orders) {
      let orderChanged = false;
      let newItemsPrice = 0;

      for (const item of order.orderItems) {
        const prod = await Product.findById(item.product);
        if (prod) {
          const effectivePrice = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
          if (item.price !== effectivePrice) {
            item.price = effectivePrice;
            orderChanged = true;
          }
        }
        newItemsPrice += item.price * item.quantity;
      }

      if (orderChanged || order.itemsPrice < 5000) {
        order.itemsPrice = Math.round(newItemsPrice * 100) / 100;
        order.taxPrice = Math.round(order.itemsPrice * 0.05 * 100) / 100;
        order.shippingPrice = order.itemsPrice >= 500 ? 0 : 49;
        order.totalPrice = Math.round((order.itemsPrice + order.taxPrice + order.shippingPrice) * 100) / 100;
        await order.save();
        updatedOrdersCount++;
      }
    }

    console.log(`[Migration] Successfully updated ${updatedOrdersCount} orders to INR values.`);
    console.log('[Migration] Database migration to Indian Rupees (INR) complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  }
};

convertExistingToINR();

