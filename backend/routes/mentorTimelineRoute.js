const express = require("express");
const router = express.Router();
const { requireAuth, requireMentor } = require("../middleware/roleAuth");

const {
  getMentorTimeline,
  updateMentorTimeline,
  refreshMentorTimeline,
} = require("../controller/mentorTimelineController");

router.get("/", requireMentor, getMentorTimeline);

router.post("/update", requireMentor, updateMentorTimeline);

router.post("/refresh", requireMentor, refreshMentorTimeline);

module.exports = router;
