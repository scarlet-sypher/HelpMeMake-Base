const express = require('express');
const { requireUser } = require('../middleware/roleAuth');
const { getUserData } = require('../controller/userController');
const router = express.Router();

// All routes in this file require 'user' role
router.use(requireUser);

// Get current user's full profile data
router.get('/data', getUserData);

// User Dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to User Dashboard!',
    user: {
      id: req.user.id,
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
    const { name } = req.body;
    const User = require('../Model/User');
   
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, select: '-password' }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
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