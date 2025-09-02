const express = require("express");
const roomController = require("../../controller/admin/roomController");
const { authenticateAdmin } = require("../../middleware/adminAuth");
const router = express.Router();

router.use(authenticateAdmin);

router.get("/", roomController.getAllRooms);

router.get("/stats", roomController.getRoomStats);

router.get("/:roomId/chats", roomController.getRoomChats);

router.put("/:roomId/status", roomController.updateRoomStatus);

module.exports = router;
