const express = require("express");
const {
  getAllLearners,
  getLearnerById,
  updateLearner,
  updateLearnerAvatar,
  deleteLearner,
  getLearnerStats,
} = require("../../controller/admin/learnerController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Get all learners with search and pagination
router.get("/", getAllLearners);

// Get learner statistics
router.get("/stats", getLearnerStats);

// Get single learner by ID
router.get("/:learnerId", getLearnerById);

// Update learner data
router.put("/:learnerId", updateLearner);

// Update learner avatar
router.put("/:learnerId/avatar", updateLearnerAvatar);

// Delete learner
router.delete("/:learnerId", deleteLearner);

module.exports = router;
