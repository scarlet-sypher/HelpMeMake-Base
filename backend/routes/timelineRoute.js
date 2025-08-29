const express = require("express");
const router = express.Router();
const { requireAuth, requireUser } = require("../middleware/roleAuth");

// Import timeline controller
const {
  getLearnerTimeline,
  updateLearnerTimeline,
  refreshLearnerTimeline,
} = require("../controller/timelineController");

// GET /api/timeline - Get learner's timeline events
router.get("/", requireUser, getLearnerTimeline);

// POST /api/timeline/update - Update timeline by checking for changes
router.post("/update", requireUser, updateLearnerTimeline);

// POST /api/timeline/refresh - Force refresh timeline (clears and rebuilds)
router.post("/refresh", requireUser, refreshLearnerTimeline);

module.exports = router;
