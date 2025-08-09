const express = require("express");
const router = express.Router();
const {
  requireAuth,
  requireUser,
  requireMentor,
} = require("../middleware/roleAuth");

// Import controllers
const {
  getMentorProjectData,
  confirmExpectedEndDate,
  getProgressHistory,
  sendCompletionRequest,
  submitMentorReview,
  getCompletionRequests,
  handleMentorResponse,
} = require("../controller/myMentorController");

// User (Learner) routes for My Mentor page
router.get("/mentor-project-data", requireUser, getMentorProjectData);
router.post("/confirm-expected-end-date", requireUser, confirmExpectedEndDate);
router.get("/progress-history/:projectId", requireUser, getProgressHistory);
router.post("/completion-request", requireUser, sendCompletionRequest);
router.post("/submit-review", requireUser, submitMentorReview);
router.get("/completion-requests", requireUser, getCompletionRequests);
router.post("/mentor-response", requireUser, handleMentorResponse);

// TODO: Mentor routes for My Apprentice page will be added here
// These will be implemented in the next phase:
// router.get('/apprentice-project-data', requireMentor, getApprenticeProjectData);
// router.post('/set-expected-end-date', requireMentor, setExpectedEndDate);
// router.post('/update-progress', requireMentor, updateProjectProgress);
// router.post('/handle-completion-request', requireMentor, handleCompletionRequest);
// router.post('/submit-apprentice-review', requireMentor, submitApprenticeReview);

module.exports = router;
