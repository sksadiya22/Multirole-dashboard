const express = require('express');
const { getUserActivities } = require('../controllers/demoAuthController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/activities
// @desc    Get user activities (Demo Mode)
// @access  Private
router.get('/activities', authenticate, getUserActivities);

// @route   PUT /api/users/profile
// @desc    Update user profile (Demo Mode)
// @access  Private
router.put('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Profile update feature available in full database mode'
  });
});

// @route   PUT /api/users/change-password
// @desc    Change user password (Demo Mode)
// @access  Private
router.put('/change-password', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Password change feature available in full database mode'
  });
});

module.exports = router;