const express = require("express");
const router = express.Router();
const { requireUser, requireMentor } = require("../middleware/roleAuth");
const {
  getLearnerDashboardData,
} = require("../controller/learnerDashboardController");
const {
  getMentorDashboardData,
} = require("../controller/mentorDashboardController");

router.get("/user/data", requireUser, getLearnerDashboardData);

router.get("/mentor/data", requireMentor, getMentorDashboardData);

module.exports = router;
