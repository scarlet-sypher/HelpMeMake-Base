const express = require('express');
const { requireMentor } = require('../middleware/roleAuth');
const router = express.Router();

// All routes in this file require 'mentor' role
router.use(requireMentor);

// Mentor Dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Mentor Dashboard!',
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Mentor Profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Update Mentor Profile
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