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
  getRecentMessages,
} = require("../controller/messageController");

router.get("/messages/recent", requireUserOrMentor, getRecentMessages);

router.get("/rooms/my-active", requireUserOrMentor, getUserActiveRooms);

router.get("/rooms/:roomId/details", requireUserOrMentor, getRoomDetails);

router.get("/messages/:roomId", requireUserOrMentor, fetchMessages);

router.post("/messages/:roomId", requireUserOrMentor, sendMessage);

router.get("/messages/:roomId/check", requireUserOrMentor, checkNewMessages);

router.patch("/rooms/:roomId/wallpaper", requireUserOrMentor, updateWallpaper);

router.delete("/messages/:messageId", requireUserOrMentor, deleteMessage);

router.get("/mentor/:mentorId/rooms", requireMentor, fetchMentorRooms);

router.get("/learner/:learnerId/rooms", requireUser, fetchLearnerRooms);

router.post("/wallpaper/upload", requireUserOrMentor, uploadWallpaper);

router.post("/images/upload", requireUserOrMentor, uploadMessageImage);

router.post("/messages/:roomId/image", requireUserOrMentor, sendImageMessage);

module.exports = router;
