const express = require("express");
const router = express.Router();
const {
  requireMentor,
  requireUser,
  requireUserOrMentor,
} = require("../middleware/roleAuth");

// Import session controller
const {
  createSession,
  getMentorSessions,
  updateSession,
  deleteSession,
  markAttendance,
  rescheduleSession,
  updateSessionStatus,
  getUserSessions,
  markUserAttendance,
  submitLearnerReason,
  submitMentorReason,
  updateRecordingLink,
} = require("../controller/sessionController");

// Mentor routes (require mentor authentication)
router.post("/mentor", requireMentor, createSession);
router.get("/mentor", requireMentor, getMentorSessions);
router.patch("/mentor/:sessionId", requireMentor, updateSession);
router.delete("/mentor/:sessionId", requireMentor, deleteSession);
router.patch("/mentor/:sessionId/attendance", requireMentor, markAttendance);
router.patch("/mentor/:sessionId/reschedule", requireMentor, rescheduleSession);
router.patch("/mentor/:sessionId/status", requireMentor, updateSessionStatus);
router.patch("/mentor/:sessionId/reason", requireMentor, submitMentorReason);
router.patch(
  "/mentor/:sessionId/recording",
  requireMentor,
  updateRecordingLink
);

// User routes (require user authentication)
router.get("/user", requireUser, getUserSessions);
router.patch("/:sessionId/user-attendance", requireUser, markUserAttendance);
router.patch("/:sessionId/user-reason", requireUser, submitLearnerReason);

module.exports = router;
