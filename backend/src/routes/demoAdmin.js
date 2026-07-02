const express = require('express');
const {
  getAllUsers,
  getSystemStats,
  getAllActivities,
  updateUser
} = require('../controllers/demoAuthController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users (Demo Mode)
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   PUT /api/admin/users/:id
// @desc    Update user (Demo Mode)
// @access  Private (Admin only)
router.put('/users/:id', updateUser);

// @route   GET /api/admin/stats
// @desc    Get system statistics (Demo Mode)
// @access  Private (Admin only)
router.get('/stats', getSystemStats);

// @route   GET /api/admin/activities
// @desc    Get all system activities (Demo Mode)
// @access  Private (Admin only)
router.get('/activities', getAllActivities);

// Demo mode placeholders for other endpoints
router.get('/users/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Individual user details available in full database mode'
  });
});

router.post('/users', (req, res) => {
  res.json({
    success: true,
    message: 'User creation available in full database mode'
  });
});

router.delete('/users/:id', (req, res) => {
  res.json({
    success: true,
    message: 'User deletion available in full database mode'
  });
});

module.exports = router;