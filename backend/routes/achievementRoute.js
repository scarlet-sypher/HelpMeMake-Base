const express = require("express");
const router = express.Router();
const { requireUser, requireUserOrMentor } = require("../middleware/roleAuth");

const {
  recalculateAchievements,
  getAchievementSummary,
  updateTestValues,
  getBadgesData,
  getUserBadgesData,
} = require("../controller/achievementController");

// Get achievement summary for the logged-in learner
router.get("/", requireUser, getAchievementSummary);

// Recalculate all achievements (force update)
router.post("/recalculate", requireUser, recalculateAchievements);

// Test endpoint for debugging (development only)
router.post("/test-update", requireUser, updateTestValues);

router.get("/badges", requireUser, getBadgesData);

router.get("/user/:userId/badges", requireUserOrMentor, getUserBadgesData);

module.exports = router;
