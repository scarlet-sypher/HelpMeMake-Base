const express = require("express");
const adminMentorController = require("../../controller/admin/mentorController");
const { authenticateAdmin } = require("../../middleware/adminAuth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

router.use(authenticateAdmin);

router.get("/", adminMentorController.getAllMentors);

router.get("/stats", adminMentorController.getMentorStats);

router.get("/:mentorId", adminMentorController.getMentorById);

router.put("/:mentorId", adminMentorController.updateMentor);

router.put(
  "/:mentorId/avatar",
  upload.single("avatar"),
  adminMentorController.updateMentorAvatar
);

router.delete("/:mentorId", adminMentorController.deleteMentor);

module.exports = router;
