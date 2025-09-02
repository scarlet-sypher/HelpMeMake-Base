const express = require("express");
const router = express.Router();
const { requireMentor } = require("../middleware/roleAuth");

const {
  getMentorGoalAndReviews,
  setMentorGoal,
  getMentorReviews,
  getRecentMentorReviews,
} = require("../controller/goalController");

router.get("/mentor/goal-reviews", requireMentor, getMentorGoalAndReviews);

router.post("/mentor/goal", requireMentor, setMentorGoal);
router.put("/mentor/goal", requireMentor, setMentorGoal);

router.get("/mentor/reviews", requireMentor, getMentorReviews);

router.get("/mentor/recent-reviews", requireMentor, getRecentMentorReviews);

module.exports = router;
