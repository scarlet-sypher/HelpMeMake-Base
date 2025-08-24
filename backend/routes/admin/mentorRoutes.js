const express = require("express");
const adminMentorController = require("../../controller/admin/mentorController");
const { authenticateAdmin } = require("../../middleware/adminAuth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
});

// All routes require admin authentication
router.use(authenticateAdmin);

// GET /admin/mentors - Get all mentors with optional search
router.get("/", adminMentorController.getAllMentors);

// GET /admin/mentors/stats - Get mentor statistics
router.get("/stats", adminMentorController.getMentorStats);

// GET /admin/mentors/:mentorId - Get single mentor by ID
router.get("/:mentorId", adminMentorController.getMentorById);

// PUT /admin/mentors/:mentorId - Update mentor profile
router.put("/:mentorId", adminMentorController.updateMentor);

// PUT /admin/mentors/:mentorId/avatar - Update mentor profile picture
router.put(
  "/:mentorId/avatar",
  upload.single("avatar"),
  adminMentorController.updateMentorAvatar
);

// DELETE /admin/mentors/:mentorId - Delete mentor
router.delete("/:mentorId", adminMentorController.deleteMentor);

module.exports = router;
