const express = require("express");
const adminDashboardController = require("../../controller/admin/adminDashboardController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Dashboard statistics route
router.get("/stats", adminDashboardController.getDashboardStats);

// Entity management routes
router.get("/users", adminDashboardController.getAllUsers);
router.get("/learners", adminDashboardController.getAllLearners);
router.get("/mentors", adminDashboardController.getAllMentors);
router.get("/projects", adminDashboardController.getAllProjects);
router.get("/sessions", adminDashboardController.getAllSessions);
router.get("/message-rooms", adminDashboardController.getAllMessageRooms);

module.exports = router;
