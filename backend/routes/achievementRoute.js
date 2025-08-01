const express = require('express');
const router = express.Router();
const achievementController = require('../controller/achievementController');
const { authenticateJWT, requireRoleSelection } = require('../middleware/roleAuth');

// Get all achievements for the current user
router.get('/', authenticateJWT, requireRoleSelection, achievementController.getUserAchievements);

// Get specific achievement details
router.get('/:achievementId', authenticateJWT, requireRoleSelection, achievementController.getAchievementById);

// Update achievement progress (manual trigger)
router.patch('/update-progress', authenticateJWT, requireRoleSelection, achievementController.updateAchievementProgress);

// Get achievement statistics
router.get('/stats/summary', authenticateJWT, requireRoleSelection, achievementController.getAchievementStats);

// Initialize achievements for new users (called after role selection)
router.post('/initialize', authenticateJWT, requireRoleSelection, achievementController.initializeUserAchievements);

module.exports = router;