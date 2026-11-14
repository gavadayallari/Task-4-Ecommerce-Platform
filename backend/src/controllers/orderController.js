const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order with dynamic pricing and stock decrement
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentResult } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is incomplete. Full name and city are required.'
      });
    }

    const pin = shippingAddress.pinCode || shippingAddress.postalCode;
    if (!pin || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit Indian PIN Code.'
      });
    }

    // Verify stock availability and collect actual product data
    const verifiedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stock} available.`
        });
      }

      // Deduct product stock
      product.stock -= item.quantity;
      await product.save();

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += price * item.quantity;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price,
        image: product.image
      });
    }

    // Calculate tax & shipping (5% GST, Free shipping over ₹500, otherwise ₹49)
    const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
    const shippingPrice = itemsPrice >= 500 ? 0 : 49;
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const isOnlinePay = ['UPI', 'Credit/Debit Card', 'Debit Card', 'Credit Card', 'Net Banking'].includes(paymentMethod);

    const generatedPayResult = paymentResult || (isOnlinePay ? {
      id: `SN-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
      upiId: paymentResult?.upiId || '',
      bankName: paymentResult?.bankName || '',
      cardLast4: paymentResult?.cardLast4 || ''
    } : {
      id: `COD-${Date.now()}`,
      status: 'PENDING_DELIVERY',
      update_time: new Date().toISOString()
    });

    const streetAddress = shippingAddress.address ||
      `${shippingAddress.houseFlat || ''}, ${shippingAddress.street || ''}${shippingAddress.landmark ? ', Near ' + shippingAddress.landmark : ''}`.trim();

    const order = await Order.create({
      user: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone || req.user.phone || '',
        houseFlat: shippingAddress.houseFlat || '',
        street: shippingAddress.street || '',
        landmark: shippingAddress.landmark || '',
        address: streetAddress || 'Address on file',
        city: shippingAddress.city,
        state: shippingAddress.state || 'Karnataka',
        pinCode: pin,
        postalCode: pin,
        country: 'India'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentResult: generatedPayResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: isOnlinePay,
      paidAt: isOnlinePay ? new Date() : null,
      orderStatus: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Security check: users can only see their own orders unless admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid (simulated test gateway verification)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `SN-TEST-PAY-${Date.now()}`,
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email,
      upiId: req.body.upiId || '',
      bankName: req.body.bankName || '',
      cardLast4: req.body.cardLast4 || ''
    };

    if (order.orderStatus === 'Pending') {
      order.orderStatus = 'Processing';
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid
};
