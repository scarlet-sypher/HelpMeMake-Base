const express = require('express');
const passport = require('../config/passport');
const authController = require('../controller/authController');
const router = express.Router();

// JWT Authentication Middleware
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Google OAuth Routes
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth flow...');
  
  // Clear any existing cookies before starting OAuth
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    // Force account selection and consent screen
    prompt: 'select_account consent',
    access_type: 'offline'
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('Google OAuth callback received');
  
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.UI_URL}/signup?error=google_auth_failed`
  })(req, res, (err) => {
    if (err) {
      console.error('Google OAuth callback error:', err);
      
      if (err.message === 'USER_EXISTS') {
        return res.redirect(`${process.env.UI_URL}/login?error=account_exists&email=${encodeURIComponent(err.email)}`);
      }
      
      return res.redirect(`${process.env.UI_URL}/signup?error=google_auth_failed`);
    }
    
    // Authentication successful, proceed to controller
    next();
  });
}, authController.googleCallback);

// GitHub OAuth Routes
router.get('/github', (req, res, next) => {
  console.log('Initiating GitHub OAuth flow...');
  
  // Clear any existing cookies before starting OAuth
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false
  })(req, res, next);
});

router.get('/github/callback', (req, res, next) => {
  console.log('GitHub OAuth callback received');
  
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.UI_URL}/signup?error=github_auth_failed`
  })(req, res, (err) => {
    if (err) {
      console.error('GitHub OAuth callback error:', err);
      
      if (err.message === 'USER_EXISTS') {
        return res.redirect(`${process.env.UI_URL}/login?error=account_exists&email=${encodeURIComponent(err.email)}`);
      }
      
      return res.redirect(`${process.env.UI_URL}/signup?error=github_auth_failed`);
    }
    
    // Authentication successful, proceed to controller
    next();
  });
}, authController.githubCallback);

// Regular Authentication Routes
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected Routes (require JWT)
router.get('/user', authenticateJWT, authController.getUser);
router.post('/set-role', authenticateJWT, authController.setRole);
router.post('/logout', authController.logout);

// Test route to check if auth is working
router.get('/test', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    message: 'JWT authentication is working!',
    user: req.user.email
  });
});

module.exports = router;