const express = require("express");
const router = express.Router();
const {
  requireUser,
  requireMentor,
  requireUserOrMentor,
} = require("../middleware/roleAuth");

const {
  sendRequest,
  getProjectRequests,
  getLearnerRequests,
  getMentorRequests,
  respondToRequest,
} = require("../controller/requestController");

router.post("/send", requireUser, sendRequest);
router.get("/project/:projectId", requireUser, getProjectRequests);
router.get("/learner", requireUser, getLearnerRequests);

router.get("/mentor", requireMentor, getMentorRequests);
router.patch("/:requestId/respond", requireMentor, respondToRequest);

module.exports = router;
