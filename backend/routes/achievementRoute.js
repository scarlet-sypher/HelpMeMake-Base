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

router.get("/", requireUser, getAchievementSummary);

router.post("/recalculate", requireUser, recalculateAchievements);

router.post("/test-update", requireUser, updateTestValues);

router.get("/badges", requireUser, getBadgesData);

router.get("/user/:userId/badges", requireUserOrMentor, getUserBadgesData);

module.exports = router;
