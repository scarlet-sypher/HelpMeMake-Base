const express = require("express");
const router = express.Router();
const {
  requireAuth,
  requireUser,
  requireMentor,
} = require("../middleware/roleAuth");
const {
  handleCompletionRequestResponse,
} = require("../controller/completionController");
// Import controllers
const {
  getMentorProjectData,
  confirmExpectedEndDate,
  getProgressHistory,
  sendCompletionRequest,
  submitMentorReview,
  getCompletionRequests,
} = require("../controller/myMentorController");

const {
  getApprenticeProjectData,
  setTempExpectedEndDate,
  updateProjectProgress,
  sendCompletionRequest: mentorSendCompletionRequest,
  submitApprenticeReview,
  getProgressHistory: mentorGetProgressHistory,
  getCompletionRequests: mentorGetCompletionRequests,
} = require("../controller/myApprenticeController");

// User (Learner) routes for My Mentor page
router.get("/mentor-project-data", requireUser, getMentorProjectData);
router.post("/confirm-expected-end-date", requireUser, confirmExpectedEndDate);
router.get("/progress-history/:projectId", requireUser, getProgressHistory);
router.post("/completion-request", requireUser, sendCompletionRequest);
router.post("/submit-review", requireUser, submitMentorReview);
router.get("/completion-requests", requireUser, getCompletionRequests);

// Mentor routes for My Apprentice page
router.get("/apprentice-project-data", requireMentor, getApprenticeProjectData);
router.post("/set-expected-end-date", requireMentor, setTempExpectedEndDate);
router.post("/update-progress", requireMentor, updateProjectProgress);
router.post("/submit-apprentice-review", requireMentor, submitApprenticeReview);

router.get(
  "/mentor-progress-history/:projectId",
  requireMentor,
  mentorGetProgressHistory
);
router.post(
  "/mentor-completion-request",
  requireMentor,
  mentorSendCompletionRequest
);
router.get(
  "/mentor-completion-requests",
  requireMentor,
  mentorGetCompletionRequests
);

router.post(
  "/handle-completion-request",
  requireAuth,
  handleCompletionRequestResponse
);

module.exports = router;
