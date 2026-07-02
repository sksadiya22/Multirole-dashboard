const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Global variable to track database connection
let isDatabaseConnected = false;

// Routes - will be set up after checking database connection
let authRoutes, userRoutes, adminRoutes;

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Multi-Role Dashboard API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: isDatabaseConnected ? 'Connected' : 'Demo Mode (In-Memory)',
    mode: isDatabaseConnected ? 'Production' : 'Demo'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    isDatabaseConnected = true;
    
    // Use MongoDB routes
    authRoutes = require('./routes/auth');
    userRoutes = require('./routes/users');
    adminRoutes = require('./routes/admin');
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.log('🚀 Starting server in DEMO MODE with in-memory data...');
    isDatabaseConnected = false;
    
    // Use demo routes
    authRoutes = require('./routes/demoAuth');
    userRoutes = require('./routes/demoUsers');
    adminRoutes = require('./routes/demoAdmin');
  }
  
  // Set up routes after determining connection type
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    if (!isDatabaseConnected) {
      console.log('');
      console.log('🎯 DEMO MODE ACTIVE:');
      console.log('   📧 Admin: admin@demo.com / password123');
      console.log('   👤 User: user@demo.com / password123');
      console.log('   🔄 Data resets on server restart');
      console.log('');
    }
  });
};

startServer();