const express = require("express");
const router = express.Router();
const { requireUser, requireMentor } = require("../middleware/roleAuth");
const {
  getLearnerDashboardData,
} = require("../controller/learnerDashboardController");
const {
  getMentorDashboardData,
} = require("../controller/mentorDashboardController");

// Route for learner dashboard data
router.get("/user/data", requireUser, getLearnerDashboardData);

// Route for mentor dashboard data
router.get("/mentor/data", requireMentor, getMentorDashboardData);

module.exports = router;
