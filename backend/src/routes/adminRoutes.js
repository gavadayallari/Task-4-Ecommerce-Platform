const express = require('express');
const router = express.Router();

const {
  getAdminStats,
  getInventory,
  getReports,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  deleteUser
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/auth');

// All routes in this router require JWT auth + Admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/inventory', getInventory);
router.get('/reports', getReports);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
