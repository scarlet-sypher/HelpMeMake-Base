const express = require("express");
const router = express.Router();
const { requireAuth, requireMentor } = require("../middleware/roleAuth");

// Import mentor timeline controller
const {
  getMentorTimeline,
  updateMentorTimeline,
  refreshMentorTimeline,
} = require("../controller/mentorTimelineController");

// GET /api/mentor-timeline - Get mentor's timeline events
router.get("/", requireMentor, getMentorTimeline);

// POST /api/mentor-timeline/update - Update timeline by checking for changes
router.post("/update", requireMentor, updateMentorTimeline);

// POST /api/mentor-timeline/refresh - Force refresh timeline (clears and rebuilds)
router.post("/refresh", requireMentor, refreshMentorTimeline);

module.exports = router;
