const express = require("express");
const { requireUserOrMentor } = require("../middleware/roleAuth");
const {
  getMentorDetails,
  getMentorProjects,
  getLearnerDetails,
  getMentorAnalytics,
} = require("../controller/mentorDetailsController");

const router = express.Router();

// Get mentor details by mentorId - accessible by both users and mentors
router.get("/:mentorId", requireUserOrMentor, getMentorDetails);

// Get mentor's completed/cancelled projects - accessible by both users and mentors
router.get("/:mentorId/projects", requireUserOrMentor, getMentorProjects);

// Get mentor analytics - accessible by both users and mentors
router.get("/:mentorId/analytics", requireUserOrMentor, getMentorAnalytics);

// Get learner details by learnerId - accessible by both users and mentors
// This is used by ProjectCard component to fetch learner info
router.get("/learner/:learnerId", requireUserOrMentor, getLearnerDetails);

module.exports = router;
