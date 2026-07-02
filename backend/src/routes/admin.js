const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getSystemStats,
  getAllActivities
} = require('../controllers/adminController');
const { validateRegister, validateUserUpdate } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/users/:id', getUserById);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/users', validateRegister, createUser);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', validateUserUpdate, updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', deleteUser);

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Private (Admin only)
router.get('/stats', getSystemStats);

// @route   GET /api/admin/activities
// @desc    Get all system activities
// @access  Private (Admin only)
router.get('/activities', getAllActivities);

module.exports = router;