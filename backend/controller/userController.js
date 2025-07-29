const User = require('../Model/User');
const Learner = require('../Model/Learner');

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

    const combinedData = {
      ...user.toObject(),
      ...learnerData.toObject(),
      userId: learnerData.userId // Keep reference
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

module.exports = {
  getUserData
};