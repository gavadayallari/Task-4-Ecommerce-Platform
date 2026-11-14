const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  createProductReview
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const productRules = [
  check('name', 'Product name is required').trim().notEmpty(),
  check('price', 'Valid price in INR is required').isFloat({ min: 0 }),
  check('description', 'Description is required').trim().notEmpty(),
  check('category', 'Category is required').trim().notEmpty(),
  check('brand', 'Brand is required').trim().notEmpty(),
  check('stock', 'Valid stock count is required').isInt({ min: 0 }),
  check('image', 'Main image URL is required').trim().notEmpty()
];

const reviewRules = [
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').trim().notEmpty()
];

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Authenticated customer reviews
router.post('/:id/reviews', protect, reviewRules, validate, createProductReview);

// Admin-only management
router.post('/', protect, adminOnly, productRules, validate, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
