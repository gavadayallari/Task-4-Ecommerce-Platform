const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard metrics & statistical analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });
    const outOfStockCount = await Product.countDocuments({ stock: { $eq: 0 } });

    // Calculate total revenue from non-cancelled orders
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? Math.round(revenueData[0].total * 100) / 100 : 0;

    // Status breakdown
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Category breakdown
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Payment methods breakdown
    const paymentStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalPrice' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        lowStockCount,
        outOfStockCount,
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        categoryStats,
        paymentStats,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory list with low stock tracking
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'out_of_stock') {
      query.stock = 0;
    } else if (status === 'low_stock') {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (status === 'in_stock') {
      query.stock = { $gt: 5 };
    }

    const products = await Product.find(query).sort({ stock: 1, name: 1 });

    const allProducts = await Product.find();
    let totalStock = 0;
    let inventoryValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    allProducts.forEach(p => {
      totalStock += p.stock;
      inventoryValuation += (p.price * p.stock);
      if (p.stock === 0) outOfStockCount++;
      else if (p.stock <= 5) lowStockCount++;
    });

    res.status(200).json({
      success: true,
      inventorySummary: {
        totalItems: allProducts.length,
        totalUnits: totalStock,
        totalValuation: Math.round(inventoryValuation * 100) / 100,
        lowStockCount,
        outOfStockCount
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales reports and revenue analytics
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res, next) => {
  try {
    // 1. Overall Non-Cancelled Metrics
    const nonCancelled = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalTax: { $sum: '$taxPrice' },
          totalShipping: { $sum: '$shippingPrice' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    const summary = nonCancelled[0] || {
      totalRevenue: 0,
      totalTax: 0,
      totalShipping: 0,
      totalOrders: 0,
      avgOrderValue: 0
    };

    // 2. Category Performance
    const ordersWithItems = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const categoryRevenueMap = {};

    for (const order of ordersWithItems) {
      for (const item of order.orderItems) {
        const prod = await Product.findById(item.product);
        const cat = prod ? prod.category : 'General';
        const lineTotal = item.price * item.quantity;
        categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + lineTotal;
      }
    }

    const categoryBreakdown = Object.entries(categoryRevenueMap).map(([category, revenue]) => ({
      category,
      revenue: Math.round(revenue * 100) / 100
    })).sort((a, b) => b.revenue - a.revenue);

    // 3. Payment Method Distribution
    const paymentBreakdown = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // 4. Order Status Distribution
    const orderStatuses = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      reports: {
        summary: {
          totalRevenue: Math.round(summary.totalRevenue * 100) / 100,
          totalTax: Math.round(summary.totalTax * 100) / 100,
          totalShipping: Math.round(summary.totalShipping * 100) / 100,
          totalOrders: summary.totalOrders,
          avgOrderValue: Math.round(summary.avgOrderValue * 100) / 100
        },
        categoryBreakdown,
        paymentBreakdown,
        orderStatuses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with optional status filter & pagination
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.orderStatus = req.query.status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
      // If delivered on COD, mark paid
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to "${orderStatus}"`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with customer stats
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const userOrdersCounts = await Order.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 }, totalSpent: { $sum: '$totalPrice' } } }
    ]);

    const orderMap = {};
    userOrdersCounts.forEach(item => {
      if (item._id) {
        orderMap[item._id.toString()] = { count: item.count, spent: item.totalSpent };
      }
    });

    const enrichedUsers = users.map(u => ({
      ...u.toObject(),
      orderCount: orderMap[u._id.toString()]?.count || 0,
      totalSpent: Math.round((orderMap[u._id.toString()]?.spent || 0) * 100) / 100
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      users: enrichedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User account removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getInventory,
  getReports,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser
};
