const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'register',
      'profile_update',
      'password_change',
      'user_created',
      'user_updated',
      'user_deleted',
      'role_changed',
      'status_changed'
    ]
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ action: 1, timestamp: -1 });

// Static method to log activity
activitySchema.statics.logActivity = async function(userId, action, description, metadata = {}, req = null) {
  try {
    const activity = new this({
      userId,
      action,
      description,
      metadata,
      ipAddress: req ? req.ip || req.connection.remoteAddress : '',
      userAgent: req ? req.get('User-Agent') : ''
    });
    
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = mongoose.model('Activity', activitySchema);