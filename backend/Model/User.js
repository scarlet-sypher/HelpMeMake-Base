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
  },
  isPasswordUpdated: {
    type: Boolean,
    default: false  // New field for tracking password updates
  },

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