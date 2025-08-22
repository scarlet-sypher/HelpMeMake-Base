const express = require("express");
const router = express.Router();
const {
  requireMentor,
  requireUser,
  requireUserOrMentor,
} = require("../middleware/roleAuth");
const {
  sendMessage,
  fetchMessages,
  checkNewMessages,
  deleteMessage,
  fetchLearnerRooms,
  fetchMentorRooms,
  getUserActiveRooms,
  getRoomDetails,
  updateWallpaper,
  uploadWallpaper,
  uploadMessageImage,
  sendImageMessage,
} = require("../controller/messageController");

// Get user's active rooms (works for both mentor and learner)
router.get("/rooms/my-active", requireUserOrMentor, getUserActiveRooms);

// Get room details
router.get("/rooms/:roomId/details", requireUserOrMentor, getRoomDetails);

// Get messages for a room
router.get("/messages/:roomId", requireUserOrMentor, fetchMessages);

// Send message to a room
router.post("/messages/:roomId", requireUserOrMentor, sendMessage);

// Check for new messages (polling)
router.get("/messages/:roomId/check", requireUserOrMentor, checkNewMessages);

// Update room wallpaper
router.patch("/rooms/:roomId/wallpaper", requireUserOrMentor, updateWallpaper);

// Delete message (soft delete)
router.delete("/messages/:messageId", requireUserOrMentor, deleteMessage);

// Specific mentor routes
router.get("/mentor/:mentorId/rooms", requireMentor, fetchMentorRooms);

// Specific learner routes
router.get("/learner/:learnerId/rooms", requireUser, fetchLearnerRooms);

router.post("/wallpaper/upload", requireUserOrMentor, uploadWallpaper);

// Upload image for messages
router.post("/images/upload", requireUserOrMentor, uploadMessageImage);

// Send image message to a room
router.post("/messages/:roomId/image", requireUserOrMentor, sendImageMessage);

module.exports = router;
