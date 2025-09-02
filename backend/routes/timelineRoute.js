const express = require("express");
const router = express.Router();
const { requireAuth, requireUser } = require("../middleware/roleAuth");

const {
  getLearnerTimeline,
  updateLearnerTimeline,
  refreshLearnerTimeline,
} = require("../controller/timelineController");

router.get("/", requireUser, getLearnerTimeline);

router.post("/update", requireUser, updateLearnerTimeline);

router.post("/refresh", requireUser, refreshLearnerTimeline);

module.exports = router;
