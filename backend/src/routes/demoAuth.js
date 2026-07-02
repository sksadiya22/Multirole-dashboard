const express = require('express');
const { register, login, getMe, logout } = require('../controllers/demoAuthController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (Demo Mode)
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user (Demo Mode)
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user (Demo Mode)
// @access  Private
router.get('/me', authenticate, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user (Demo Mode)
// @access  Private
router.post('/logout', authenticate, logout);

module.exports = router;