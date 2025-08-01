const express = require('express');
const router = express.Router();
const milestoneController = require('../controller/milestoneController');
const { authenticateJWT } = require('../middleware/roleAuth'); // Changed from authenticateToken

// Get milestones for a specific project
router.get('/project/:projectId', authenticateJWT, milestoneController.getMilestonesByProject);

// Create a new milestone
router.post('/create', authenticateJWT, milestoneController.createMilestone);

// Update milestone (learner verification)
router.patch('/:milestoneId/learner-verify', authenticateJWT, milestoneController.learnerVerifyMilestone);

router.patch('/:milestoneId/learner-unverify', authenticateJWT, milestoneController.learnerUnverifyMilestone);

// Update milestone (mentor verification)
router.patch('/:milestoneId/mentor-verify', authenticateJWT, milestoneController.mentorVerifyMilestone);

// Delete milestone
router.delete('/:milestoneId', authenticateJWT, milestoneController.deleteMilestone);

// Get milestone details
router.get('/:milestoneId', authenticateJWT, milestoneController.getMilestoneById);

module.exports = router;