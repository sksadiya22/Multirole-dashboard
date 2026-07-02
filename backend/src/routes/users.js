const express = require('express');
const { updateProfile, getActivities, changePassword } = require('../controllers/userController');
const { validateProfileUpdate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, validateProfileUpdate, updateProfile);

// @route   GET /api/users/activities
// @desc    Get user activities
// @access  Private
router.get('/activities', authenticate, getActivities);

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticate, changePassword);

module.exports = router;