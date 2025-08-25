// routes/admin/sessionsRoutes.js
const express = require("express");
const { authenticateAdmin } = require("../../middleware/adminAuth");
const adminSessionsController = require("../../controller/admin/sessionsController");

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Get all sessions with filtering and pagination
router.get("/", adminSessionsController.getAllSessions);

// Get session statistics
router.get("/stats", adminSessionsController.getSessionStats);

// Delete a specific session
router.delete("/:sessionId", adminSessionsController.deleteSession);

module.exports = router;
