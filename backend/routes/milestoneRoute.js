const express = require("express");
const router = express.Router();
const milestoneController = require("../controller/milestoneController");
const {
  authenticateJWT,
  requireUserOrMentor,
} = require("../middleware/roleAuth");

// Note: The /active-with-mentor route is handled in projectRoute.js for frontend compatibility

// Milestone CRUD operations
router.get(
  "/project/:projectId",
  requireUserOrMentor,
  milestoneController.getMilestonesByProject
);
router.post(
  "/create",
  requireUserOrMentor,
  milestoneController.createMilestone
);
router.get(
  "/:milestoneId",
  authenticateJWT,
  milestoneController.getMilestoneById
);
router.put(
  "/:milestoneId",
  authenticateJWT,
  milestoneController.updateMilestone
);
router.delete(
  "/:milestoneId",
  authenticateJWT,
  milestoneController.deleteMilestone
);

// Verification routes
router.patch(
  "/:milestoneId/learner-verify",
  authenticateJWT,
  milestoneController.learnerVerifyMilestone
);
router.patch(
  "/:milestoneId/learner-unverify",
  authenticateJWT,
  milestoneController.learnerUnverifyMilestone
);
router.patch(
  "/:milestoneId/mentor-verify",
  authenticateJWT,
  milestoneController.mentorVerifyMilestone
);

module.exports = router;
