const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');
const { generateOTP, sendOTPEmail } = require('../config/emailService');


const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } 
    
  );
};


const setTokenCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
};

const authController = {
 
    googleCallback: async (req, res) => {
      try {
        const user = req.user;
        
        if (!user) {
          return res.redirect(`${process.env.UI_URL}/login?error=authentication_failed`);
        }
        
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        if (!user.role) {
          return res.redirect(`${process.env.UI_URL}/select-role`);
        }

        const dashboardMap = {
          admin: '/admindashboard',
          mentor: '/mentordashboard', 
          user: '/userdashboard'
        };

        const dashboardUrl = `${process.env.UI_URL}${dashboardMap[user.role] || '/userdashboard'}`;
        return res.redirect(dashboardUrl);

      } catch (error) {
        console.error('Google callback error:', error);
        
        // Check if it's a USER_EXISTS error
        if (error.message === 'USER_EXISTS') {
          return res.redirect(`${process.env.UI_URL}/user-exists`);
        }
        
        return res.redirect(`${process.env.UI_URL}/login?error=server_error`);
      }
    },

    // Update githubCallback method
    githubCallback: async (req, res) => {
      try {
        const user = req.user;
        
        if (!user) {
          return res.redirect(`${process.env.UI_URL}/login?error=authentication_failed`);
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        if (!user.role) {
          return res.redirect(`${process.env.UI_URL}/select-role`);
        }

        const dashboardMap = {
          admin: '/admindashboard',
          mentor: '/mentordashboard',
          user: '/userdashboard'
        };

        const dashboardUrl = `${process.env.UI_URL}${dashboardMap[user.role] || '/userdashboard'}`;
        return res.redirect(dashboardUrl);

      } catch (error) {
        console.error('GitHub callback error:', error);
        
        // Check if it's a USER_EXISTS error
        if (error.message === 'USER_EXISTS') {
          return res.redirect(`${process.env.UI_URL}/user-exists`);
        }
        
        return res.redirect(`${process.env.UI_URL}/login?error=server_error`);
      }
    },

 
  getUser: async (req, res) => {
    try {
     
      const user = req.user;
      
      res.json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user information'
      });
    }
  },

  
  setRole: async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.user._id;

 
      if (!role || !['user', 'mentor'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be either "user" or "mentor"'
        });
      }


      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Role updated successfully',
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          authProvider: user.authProvider
        },
        redirectUrl: role === 'mentor' ? '/mentordashboard' : '/userdashboard'
      });

    } catch (error) {
      console.error('Set role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update role'
      });
    }
  },


  signup: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isAccountActive) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000);

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (existingUser && !existingUser.isAccountActive) {
        // Update existing inactive user
        existingUser.password = hashedPassword;
        existingUser.name = name || existingUser.name;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
      } else {
        // Create new user (inactive until OTP verification)
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          authProvider: 'local',
          role: null, // Will be set after selecting role
          isAccountActive: false,
          isEmailVerified: false,
          otp,
          otpExpires
        });
        await newUser.save();
      }

      // Send OTP email
      await sendOTPEmail(email, otp, name);

      res.status(201).json({
        success: true,
        message: 'Account created successfully. Please check your email for the verification code.',
        requiresVerification: true
      });

    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.message === 'Failed to send verification email') {
        return res.status(500).json({
          success: false,
          message: 'Account created but failed to send verification email. Please try again.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create account'
      });
    }
  },

  // Verify OTP
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Email and OTP are required'
        });
      }

      // Find user with matching email and OTP
      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
        isAccountActive: false
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Activate account and clear OTP
      user.isAccountActive = true;
      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: 'Email verified successfully! Account is now active.',
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        requiresRoleSelection: user.role === null
      });

    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP'
      });
    }
  },

  // Resend OTP
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Find inactive user
      const user = await User.findOne({
        email,
        isAccountActive: false
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No pending verification found for this email'
        });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000);

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send new OTP email
      await sendOTPEmail(email, otp, user.name);

      res.json({
        success: true,
        message: 'New verification code sent to your email.'
      });

    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend verification code'
      });
    }
  },


  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user || user.authProvider !== 'local') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is active (OTP verified)
      if (!user.isAccountActive) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email first. Check your inbox for the verification code.',
          requiresVerification: true
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        requiresRoleSelection: user.role === null
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  },


  logout: (req, res) => {
    try {
    
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Find user by email
      const user = await User.findOne({ 
        email, 
        isAccountActive: true 
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }

      // Only allow password reset for local auth users
      if (user.authProvider !== 'local') {
        return res.status(400).json({
          success: false,
          message: `This account was created using ${user.authProvider}. Please use ${user.authProvider} to sign in.`
        });
      }

      // Generate OTP for password reset
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000);

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send OTP email
      await sendOTPEmail(email, otp, user.name, 'reset');

      res.json({
        success: true,
        message: 'Password reset code sent to your email.'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send password reset code'
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Email, OTP, and new password are required'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }

      // Find user with matching email and OTP
      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
        isAccountActive: true,
        authProvider: 'local'
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear OTP
      user.password = hashedPassword;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully! You can now login with your new password.'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password'
      });
    }
  }
};

module.exports = authController;