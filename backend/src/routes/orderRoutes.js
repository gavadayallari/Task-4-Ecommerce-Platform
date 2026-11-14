const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid
} = require('../controllers/orderController');

const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const orderRules = [
  check('orderItems', 'Order items cannot be empty').isArray({ min: 1 }),
  check('shippingAddress.fullName', 'Recipient name is required').trim().notEmpty(),
  check('shippingAddress.city', 'City is required').trim().notEmpty(),
  check('shippingAddress.phone', 'Phone number is required').trim().notEmpty()
];

router.post('/', protect, orderRules, validate, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;
