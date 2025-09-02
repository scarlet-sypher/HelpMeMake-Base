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

router.use(authenticateAdmin);

router.get("/stats", getProjectStats);

router.get("/", getAllProjects);

router.get(
  "/:projectId",
  (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId || projectId === "undefined" || projectId === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required",
      });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    next();
  },
  getProjectById
);

router.put("/:projectId", updateProject);

router.delete("/:projectId", deleteProject);

module.exports = router;
