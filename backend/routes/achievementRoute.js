const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/roleAuth");

const {
  recalculateAchievements,
  getAchievementSummary,
  updateTestValues,
  getBadgesData,
} = require("../controller/achievementController");

// Get achievement summary for the logged-in learner
router.get("/", requireUser, getAchievementSummary);

// Recalculate all achievements (force update)
router.post("/recalculate", requireUser, recalculateAchievements);

// Test endpoint for debugging (development only)
router.post("/test-update", requireUser, updateTestValues);

router.get("/badges", requireUser, getBadgesData);

module.exports = router;
