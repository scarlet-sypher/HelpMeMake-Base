const express = require("express");
const router = express.Router();
const {
  requireUser,
  requireMentor,
  requireUserOrMentor,
} = require("../middleware/roleAuth");

// Import request controller
const {
  sendRequest,
  getProjectRequests,
  getLearnerRequests,
  getMentorRequests,
  respondToRequest,
} = require("../controller/requestController");

// Learner routes (require user authentication with learner role)
router.post("/send", requireUser, sendRequest);
router.get("/project/:projectId", requireUser, getProjectRequests);
router.get("/learner", requireUser, getLearnerRequests);

//  Mentor routes (require mentor authentication)
router.get("/mentor", requireMentor, getMentorRequests);
router.patch("/:requestId/respond", requireMentor, respondToRequest);

module.exports = router;
