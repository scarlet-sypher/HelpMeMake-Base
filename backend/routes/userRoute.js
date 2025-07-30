const express = require('express');
const { requireUser } = require('../middleware/roleAuth');
const { getUserData , updateProfile, updateSocialLinks, changePassword, uploadAvatar } = require('../controller/userController');
const router = express.Router();

// All routes in this file require 'user' role
router.use(requireUser);

// Get current user's full profile data
router.get('/data', getUserData);
router.patch('/update-profile', updateProfile);
router.patch('/social-links', updateSocialLinks);
router.patch('/change-password', changePassword);
router.patch('/upload-avatar', uploadAvatar);

// User Dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to User Dashboard!',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// User Profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Update User Profile
router.patch('/profile', async (req, res) => {
  try {
    const { name, title, description, location, socialLinks } = req.body;
    const User = require('../Model/User');
    const Learner = require('../Model/Learner');
    
    // Update user basic info
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, select: '-password' }
    );

    // Update learner-specific info
    const updatedLearner = await Learner.findOneAndUpdate(
      { userId: req.user._id },
      { title, description, location, socialLinks },
      { new: true, upsert: true } // upsert creates if doesn't exist
    );
    
    // Combine data
    const combinedData = {
      ...updatedUser.toObject(),
      ...updatedLearner.toObject()
    };
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: combinedData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;