const express = require("express");
const { requireUserOrMentor } = require("../middleware/roleAuth");
const {
  getMentorDetails,
  getMentorProjects,
  getLearnerDetails,
  getMentorAnalytics,
} = require("../controller/mentorDetailsController");

const router = express.Router();

router.get("/:mentorId", requireUserOrMentor, getMentorDetails);

router.get("/:mentorId/projects", requireUserOrMentor, getMentorProjects);

router.get("/:mentorId/analytics", requireUserOrMentor, getMentorAnalytics);

router.get("/learner/:learnerId", requireUserOrMentor, getLearnerDetails);

module.exports = router;
