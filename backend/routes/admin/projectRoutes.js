const express = require("express");
const {
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
} = require("../../controller/admin/projectController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// GET /admin/projects/stats - Get project statistics
router.get("/stats", getProjectStats);

// GET /admin/projects - Get all projects with pagination and search
router.get("/", getAllProjects);

// GET /admin/projects/:projectId - Get specific project by ID
router.get("/:projectId", getProjectById);

// PUT /admin/projects/:projectId - Update project (with file upload support)
router.put("/:projectId", updateProject);

// DELETE /admin/projects/:projectId - Delete project
router.delete("/:projectId", deleteProject);

module.exports = router;
