const User = require('../Model/User');
const Learner = require('../Model/Learner');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Get current user's full profile data
const getUserData = async (req, res) => {
  try {
    // Fetch the base user details
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch learner-specific data
    let learnerData = await Learner.findOne({ userId: user._id });
    
    if (!learnerData) {
      learnerData = new Learner({
        userId: user._id
      });
      await learnerData.save();
    }

    // Calculate profile completion score
    const profileScore = calculateProfileScore(user, learnerData);

    const combinedData = {
      ...user.toObject(),
      ...learnerData.toObject(),
      userId: learnerData.userId, // Keep reference
      profileScore: profileScore
    };

    res.json({
      success: true,
      message: 'User data retrieved successfully',
      user: combinedData
    });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data'
    });
  }
};


// Helper function to calculate profile completion score
const calculateProfileScore = (user, learner) => {
  let score = 0;
  const totalFields = 8; // Total number of profile fields
  
  // Check User fields (25 points each for name, email)
  if (user.name && user.name.trim()) score += 12.5;
  if (user.email && user.email.trim()) score += 12.5;
  if (user.avatar && user.avatar !== '/uploads/public/default.jpg') score += 12.5;
  
  // Check Learner fields (25 points each for title, description, location)
  if (learner.title && learner.title.trim() && learner.title !== "Not mentioned") score += 12.5;
  if (learner.description && learner.description.trim() && learner.description !== "To Lazy to type") score += 12.5;
  if (learner.location && learner.location.trim() && learner.location !== "Home") score += 12.5;
  
  // Check Social Links (25 points total, distributed)
  const socialLinks = learner.socialLinks || {};
  let socialScore = 0;
  if (socialLinks.github && socialLinks.github !== '#') socialScore += 4.17;
  if (socialLinks.linkedin && socialLinks.linkedin !== '#') socialScore += 4.17;
  if (socialLinks.twitter && socialLinks.twitter !== '#') socialScore += 4.16;
  score += socialScore;
  
  return Math.round(score);
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/userUploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
}).single('avatar');

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, title, description, location, email } = req.body;
    const User = require('../Model/User');
    
    // Update base user info
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, select: '-password' }
    );

    let profileScore = 0;
    let updatedLearner = null;

    // Update role-specific data
    if (req.user.role === 'user') {
      const Learner = require('../Model/Learner');
      
      // Get current learner data to check if this is first update
      const currentLearner = await Learner.findOne({ userId: req.user._id });
      const isFirstUpdate = currentLearner && !currentLearner.isProfileUpdated;
      
      updatedLearner = await Learner.findOneAndUpdate(
        { userId: req.user._id },
        { 
          title, 
          description, 
          location,
          // Set to true only on first update
          ...(isFirstUpdate && { isProfileUpdated: true })
        },
        { new: true, upsert: true }
      );

      // Calculate profile completion score
      profileScore = calculateProfileScore(updatedUser, updatedLearner);
      
    } else if (req.user.role === 'mentor') {
      const Mentor = require('../Model/Mentor');
      await Mentor.findOneAndUpdate(
        { userId: req.user._id },
        { title, description, location },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profileScore: profileScore,
      isProfileUpdated: updatedLearner?.isProfileUpdated || false
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};



// Update Social Links
const updateSocialLinks = async (req, res) => {
  try {
    const { github, linkedin, twitter } = req.body;
    const socialLinksData = { github, linkedin, twitter };

    if (req.user.role === 'user') {
      const Learner = require('../Model/Learner');
      await Learner.findOneAndUpdate(
        { userId: req.user._id },
        { socialLinks: socialLinksData },
        { new: true, upsert: true }
      );
    } else if (req.user.role === 'mentor') {
      const Mentor = require('../Model/Mentor');
      await Mentor.findOneAndUpdate(
        { userId: req.user._id },
        { socialLinks: socialLinksData },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Social links updated successfully'
    });
  } catch (error) {
    console.error('Update social links error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update social links'
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const User = require('../Model/User');

    const user = await User.findById(req.user._id);
    
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `Cannot change password for ${user.authProvider} accounts`
      });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};

// Upload Avatar
const uploadAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    try {
      const User = require('../Model/User');
      const Learner = require('../Model/Learner');
      const avatarPath = `/uploads/userUploads/${req.file.filename}`;

      // Delete old avatar if it exists and isn't default
      const user = await User.findById(req.user._id);
      if (user.avatar && user.avatar !== '/uploads/public/default.jpg') {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Update user avatar
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, 
        { avatar: avatarPath },
        { new: true, select: '-password' }
      );

      // Calculate updated profile score
      let profileScore = 0;
      if (req.user.role === 'user') {
        const learnerData = await Learner.findOne({ userId: req.user._id });
        if (learnerData) {
          profileScore = calculateProfileScore(updatedUser, learnerData);
        }
      }

      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        avatar: avatarPath,
        profileScore: profileScore
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile picture'
      });
    }
  });
};

module.exports = {
  getUserData ,
  updateProfile,
  updateSocialLinks,
  changePassword,
  uploadAvatar
};