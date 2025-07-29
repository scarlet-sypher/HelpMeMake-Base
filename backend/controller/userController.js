const User = require('../Model/User');

// Get current user's full profile data
const getUserData = async (req, res) => {
  try {
    // Fetch the full user details from MongoDB using their ID
    const user = await User.findById(req.user._id).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User data retrieved successfully',
      user: user
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