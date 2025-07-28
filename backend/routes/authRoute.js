const express = require('express');
const passport = require('../config/passport');
const authController = require('../controller/authController');

const router = express.Router();

// JWT Authentication Middleware
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Google OAuth Routes
router.get('/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.UI_URL}/login?error=google_auth_failed`
  }),
  authController.googleCallback
);

// Regular Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

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