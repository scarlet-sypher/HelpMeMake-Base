const express = require('express');
const { requireMentor, requireUserOrMentor } = require('../middleware/roleAuth');
const {
    getAllMentors,
    getMentorById,
    searchMentors,
    getMentorStats,
    updateSocialLinks,      
    changePassword,         
    updatePersonalDetails,  
    updateProfile,
    sendProfileOTP,
    verifyProfileUpdate, 
    uploadAvatar          
} = require('../controller/mentorController');
const {
  getMentorApplicationStats
} = require('../controller/projectController');
const User = require('../Model/User');
const Mentor = require('../Model/Mentor');
const { getMentorWithAIReason } = require('../controller/mentorController');
const router = express.Router();

// ========================================
// PUBLIC MENTOR ROUTES (Browse/Search)
// ========================================

// Get all available mentors - accessible by both users and mentors
router.get('/all', requireUserOrMentor, getAllMentors);

// Search mentors by skills/categories - accessible by both users and mentors
router.get('/search', requireUserOrMentor, searchMentors);

// Get mentor statistics - for admin/analytics
router.get('/stats/overview', getMentorStats);



// ========================================
// MENTOR DASHBOARD/PROFILE ROUTES
// ========================================

// Mentor Dashboard - only for mentors
router.get('/dashboard', requireMentor, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Mentor Dashboard!',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Get mentor-specific data - only for mentors
router.get('/data', requireMentor, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch mentor-specific data
    let mentorData = await Mentor.findOne({ userId: user._id });
    
    // If no mentor profile exists, create one with defaults
    if (!mentorData) {
      mentorData = new Mentor({
        userId: user._id
      });
      await mentorData.save();
    }

    // Combine user and mentor data
    const combinedData = {
      ...user.toObject(),
      ...mentorData.toObject()
    };

    res.json({
      success: true,
      message: 'Mentor data retrieved successfully',
      user: combinedData
    });
  } catch (error) {
    console.error('Get mentor data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentor data'
    });
  }
});

// Mentor Profile - only for mentors
router.get('/profile', requireMentor, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Update Mentor Profile - only for mentors
router.patch('/profile', requireMentor, async (req, res) => {
  try {
    const { name, title, description, bio, location, expertise, socialLinks, pricing } = req.body;
    
    // Update user basic info
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, select: '-password' }
    );

    // Update mentor-specific info
    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: req.user._id },
      { title, description, bio, location, expertise, socialLinks, pricing },
      { new: true, upsert: true } // upsert creates if doesn't exist
    );
    
    // Recalculate profile completeness
    if (updatedMentor.calculateProfileCompleteness) {
      updatedMentor.calculateProfileCompleteness();
      await updatedMentor.save();
    }
    
    // Combine data
    const combinedData = {
      ...updatedUser.toObject(),
      ...updatedMentor.toObject()
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

// ========================================
// PUBLIC MENTOR VIEW (Keep at bottom to avoid route conflicts)
// ========================================

router.get('/application-stats', requireMentor, getMentorApplicationStats);

router.get('/ai-reason/:id', requireUserOrMentor, getMentorWithAIReason);
// Get mentor by ID - accessible by both users and mentors
router.get('/:id', requireUserOrMentor, getMentorById);

router.patch('/social-links', requireMentor, updateSocialLinks);


router.patch('/change-password', requireMentor, changePassword);

router.patch('/update-personal', requireMentor, updatePersonalDetails);

router.patch('/update-profile', requireMentor, updateProfile);

// Send OTP for profile verification - only for mentors
router.post('/send-profile-otp', requireMentor, sendProfileOTP);

// Verify OTP and update profile - only for mentors  
router.patch('/verify-profile-update', requireMentor, verifyProfileUpdate);

// Upload avatar - only for mentors
router.patch('/upload-avatar', requireMentor, uploadAvatar);


module.exports = router;