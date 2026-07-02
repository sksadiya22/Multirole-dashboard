const { validationResult } = require('express-validator');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please ensure MongoDB is running or configure a cloud database connection.',
        hint: 'This is a demo system. In production, you would have a persistent database connection.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Log activity
    try {
      await Activity.logActivity(
        user._id,
        'register',
        `User ${user.name} registered successfully`,
        { email: user.email },
        req
      );
    } catch (activityError) {
      console.warn('Failed to log activity:', activityError.message);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePic: user.profilePic,
        bio: user.bio,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.',
        hint: 'For demo purposes, you can use MongoDB Atlas (cloud) or install MongoDB locally.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please ensure MongoDB is running or configure a cloud database connection.',
        hint: 'This is a demo system. In production, you would have a persistent database connection.'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    try {
      await Activity.logActivity(
        user._id,
        'login',
        `User ${user.name} logged in successfully`,
        { email: user.email },
        req
      );
    } catch (activityError) {
      console.warn('Failed to log activity:', activityError.message);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePic: user.profilePic,
        bio: user.bio,
        preferences: user.preferences,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.',
        hint: 'For demo purposes, you can use MongoDB Atlas (cloud) or install MongoDB locally.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const getMe = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection unavailable. Please ensure MongoDB is running or configure a cloud database connection.'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePic: user.profilePic,
        bio: user.bio,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const logout = async (req, res) => {
  try {
    // Log activity (optional, don't fail if database is unavailable)
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        await Activity.logActivity(
          req.user.userId,
          'logout',
          'User logged out successfully',
          {},
          req
        );
      }
    } catch (activityError) {
      console.warn('Failed to log logout activity:', activityError.message);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};