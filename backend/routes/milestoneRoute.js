const express = require("express");
const router = express.Router();
const milestoneController = require("../controller/milestoneController");
const {
  authenticateJWT,
  requireUserOrMentor,
  requireMentor,
  requireUser,
} = require("../middleware/roleAuth");

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

router.get(
  "/mentor/projects",
  requireMentor,
  milestoneController.getMentorMilestones
);

router.get(
  "/mentor/active-project-progress",
  requireMentor,
  milestoneController.getMentorActiveProjectProgress
);

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

router.patch(
  "/:milestoneId/learner-verify",
  requireUser,
  milestoneController.learnerVerifyMilestone
);

router.patch(
  "/:milestoneId/learner-unverify",
  requireUser,
  milestoneController.learnerUnverifyMilestone
);

router.patch(
  "/:milestoneId/mentor-verify",
  requireMentor,
  milestoneController.mentorVerifyMilestone
);

router.patch(
  "/:milestoneId/mentor-unverify",
  requireMentor,
  milestoneController.mentorUnverifyMilestone
);

router.put(
  "/:milestoneId/review",
  requireMentor,
  milestoneController.addReviewNote
);

router.put(
  "/:milestoneId/review-read",
  requireUser,
  milestoneController.markReviewAsRead
);
router.get(
  "/project/:projectId/with-user-data",
  requireUserOrMentor,
  milestoneController.getMilestonesByProjectWithUserData
);
router.get(
  "/mentor/active-project-progress-with-avatars",
  requireMentor,
  milestoneController.getMentorActiveProjectProgressWithAvatars
);

module.exports = router;
