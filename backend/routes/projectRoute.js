const express = require("express");
const {
  requireUser,
  requireUserOrMentor,
  requireMentor,
  authenticateJWT,
} = require("../middleware/roleAuth");
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

// Test route - MUST be first
router.get("/test", (req, res) => {
  console.log("Test route hit successfully!");
  res.json({
    success: true,
    message: "Project routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Get active project with mentor - MUST be before /:id route
router.get("/active-with-mentor", authenticateJWT, getActiveProjectWithMentor);

// ADD THIS LINE - Upload thumbnail route
router.post("/upload-thumbnail", requireUser, uploadProjectThumbnail);

// Create new project
router.post("/create", requireUser, createProject);

// Get all projects for authenticated user
router.get("/user", requireUser, getProjectsForUser);

router.get("/mentor/available", requireMentor, getAvailableProjectsForMentors);

router.get("/:id/avg-pitch", requireUserOrMentor, getProjectAvgPitch);

// Get projects by user ID
router.get("/user/:userId", requireUserOrMentor, getUserProjects);

// Set closing price for a project (User only)
router.patch("/:id/set-closing-price", requireUser, setClosingPrice);

// Add pitch to a project (Mentor only)
router.post("/:id/pitch", requireMentor, addPitch);

router.get("/:id/pitches/mine", requireMentor, checkMentorPitch);

// Get all pitches for a project (User only)
router.get("/:id/pitches", requireUser, getProjectPitches);

// Mark pitches as read for a project (User only)
router.patch("/:id/pitches/mark-read", requireUser, markPitchesAsRead);

// Apply to project
router.post("/:id/apply", requireMentor, applyToProject);

// Accept mentor application
router.patch(
  "/:id/applications/:applicationId/accept",
  requireUser,
  acceptMentorApplication
);

// Update project
router.patch("/:id", requireUser, updateProject);

// Delete project
router.delete("/:id", requireUser, deleteProjectById);

// Get project by ID - MUST be last
router.get("/:id", requireUserOrMentor, getProjectById);

router.patch("/take/:id", requireMentor, takeProject);

module.exports = router;
