const express = require("express");
const roomController = require("../../controller/admin/roomController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// GET /admin/rooms - Get all chat rooms
router.get("/", roomController.getAllRooms);

// GET /admin/rooms/stats - Get room statistics
router.get("/stats", roomController.getRoomStats);

// GET /admin/rooms/:roomId/chats - Get all chats for a specific room
router.get("/:roomId/chats", roomController.getRoomChats);

module.exports = router;
