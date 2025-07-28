const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Model/User');


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

      const dashboardUrl = user.role === 'mentor' 
        ? `${process.env.UI_URL}/mentor/dashboard`
        : `${process.env.UI_URL}/user/dashboard`;
      
      return res.redirect(dashboardUrl);

    } catch (error) {
      console.error('Google callback error:', error);
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
        redirectUrl: role === 'mentor' ? '/mentor/dashboard' : '/user/dashboard'
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
      const { email, password } = req.body;


      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }


      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);


      const newUser = new User({
        email,
        password: hashedPassword,
        authProvider: 'local',
        role: 'user' 
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: 'Account created successfully'
      });

    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create account'
      });
    }
  },


  login: async (req, res) => {
    try {
      const { email, password } = req.body;


      const user = await User.findOne({ email });
      if (!user || user.authProvider !== 'local') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }


      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }


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
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }
};

module.exports = authController;