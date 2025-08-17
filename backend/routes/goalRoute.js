const express = require("express");
const router = express.Router();
const { requireMentor } = require("../middleware/roleAuth");

const {
  getMentorGoalAndReviews,
  setMentorGoal,
  getMentorReviews,
} = require("../controller/goalController");

// Get mentor goal and reviews
router.get("/mentor/goal-reviews", requireMentor, getMentorGoalAndReviews);

// Set or update mentor goal
router.post("/mentor/goal", requireMentor, setMentorGoal);
router.put("/mentor/goal", requireMentor, setMentorGoal);

// Get mentor reviews only
router.get("/mentor/reviews", requireMentor, getMentorReviews);

module.exports = router;
