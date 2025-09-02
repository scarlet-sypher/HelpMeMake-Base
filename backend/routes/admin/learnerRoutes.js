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

router.use(authenticateAdmin);

router.get("/", getAllLearners);

router.get("/stats", getLearnerStats);

router.get("/:learnerId", getLearnerById);

router.put("/:learnerId", updateLearner);

router.put("/:learnerId/avatar", updateLearnerAvatar);

router.delete("/:learnerId", deleteLearner);

module.exports = router;
