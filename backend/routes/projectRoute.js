const express = require("express");
const {
  requireUser,
  requireUserOrMentor,
  requireMentor,
  authenticateJWT,
} = require("../middleware/roleAuth");
const milestoneController = require("../controller/milestoneController");
const {
  createProject,
  getProjectById,
  updateProject,
  getProjectsForUser,
  deleteProjectById,
  applyToProject,
  acceptMentorApplication,
  getUserProjects,
  getActiveProjectWithMentor,
  uploadProjectThumbnail,
  getAvailableProjectsForMentors,
  getMentorApplicationStats,
  takeProject,
  setClosingPrice,
  addPitch,
  getProjectPitches,
  markPitchesAsRead,
} = require("../controller/projectController");

const {
  checkMentorPitch,
  getProjectAvgPitch,
} = require("../controller/projectPitchingController");

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`PROJECT ROUTE: ${req.method} ${req.originalUrl}`);
  next();
});

router.get("/test", (req, res) => {
  console.log("Test route hit successfully!");
  res.json({
    success: true,
    message: "Project routes are working!",
    timestamp: new Date().toISOString(),
  });
});

router.get("/active-with-mentor", authenticateJWT, getActiveProjectWithMentor);

router.post("/upload-thumbnail", requireUser, uploadProjectThumbnail);

router.post("/create", requireUser, createProject);

router.get("/user", requireUser, getProjectsForUser);

router.get("/mentor/available", requireMentor, getAvailableProjectsForMentors);

router.get("/:id/avg-pitch", requireUserOrMentor, getProjectAvgPitch);

router.get("/user/:userId", requireUserOrMentor, getUserProjects);

router.patch("/:id/set-closing-price", requireUser, setClosingPrice);

router.post("/:id/pitch", requireMentor, addPitch);

router.get("/:id/pitches/mine", requireMentor, checkMentorPitch);

router.get("/:id/pitches", requireUser, getProjectPitches);

router.patch("/:id/pitches/mark-read", requireUser, markPitchesAsRead);

router.post("/:id/apply", requireMentor, applyToProject);

router.patch(
  "/:id/applications/:applicationId/accept",
  requireUser,
  acceptMentorApplication
);

router.patch("/:id", requireUser, updateProject);

router.delete("/:id", requireUser, deleteProjectById);

router.get("/:id", requireUserOrMentor, getProjectById);

router.patch("/take/:id", requireMentor, takeProject);

module.exports = router;
