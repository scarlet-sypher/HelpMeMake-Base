const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: null,
    
  },
  googleId: {
    type: String,
    sparse: true
  },
  githubId: {
    type: String,
    sparse: true
  },
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: '/uploads/public/default.jpg',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'mentor'],
    default: null ,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  isAccountActive: {
    type: Boolean,
    default: false  // Only true after OTP verification
  } ,

  // Additional fields from userData
  title: {
    type: String,
    default: "Not mentioned", //job role like student , sde etc....
    required: true
  },
  description: {
    type: String,
    default: "To Lazy to type",
    required: true
  },

  isOnline: {
    type: Boolean,
    default: false,
    required: true
  },
  level: {
    type: Number,
    default: 0,
    required: true
  },
  xp: {
    type: Number,
    default: 0,
    required: true
  },
  nextLevelXp: {
    type: Number,
    default: 10000,
    immutable: true,
    required: true
  },
  location: {
    type: String,
    default: "Home",
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    required: true
  },
  socialLinks: {
    linkedin: { type: String, required: true, default: '#' },
    github: { type: String, required: true, default: '#' },
    twitter: { type: String, required: true, default: '#' }
  },
  completedSessions: {
    type: Number,
    default: 0 ,
    required: true
  },
  streakDays: {
    type: Number,
    default: 0 ,
    required: true
  },
  totalAchievement : {
    type: Number ,
    default: 0 ,
    required: true
  },

  //userStats
  userActiveProjects: {
    type: Number,
    default: 0,
    required: true
  },
  userActiveProjectsChange: {
    type: Number,
    default: 0,
    required: true
  },
  userSessionsScheduled: {
    type: Number,
    default: 0,
    required: true
  },
  userSessionsScheduledChange: {
    type: Number,
    default: 0,
    required: true
  },
  userTotalEarnings: {
    type: Number,
    default: 0,
    required: true
  },
  userTotalEarningsChange: {
    type: Number,
    default: 0,
    required: true
  },
  userCompletionRate: {
    type: Number,
    default: 0,
    required: true
  },
  userCompletionRateChange: {
    type: Number,
    default: 0,
    required: true
  }

}, {
  timestamps: true
});


userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ githubId: 1 });



userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});



userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);