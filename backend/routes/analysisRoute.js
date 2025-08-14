const express = require("express");
const { requireMentor, requireUser } = require("../middleware/roleAuth");
const {
  getMentorAnalysis,
  getProjectAnalytics,
  getLearnerAnalysis,
} = require("../controller/analysisController");

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`ANALYSIS ROUTE: ${req.method} ${req.originalUrl}`);
  next();
});

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Analysis routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Get comprehensive mentor analytics
router.get("/mentor", requireMentor, getMentorAnalysis);

// Get detailed project analytics
router.get("/projects", requireMentor, getProjectAnalytics);

// Get comprehensive learner analytics
router.get("/learner", requireUser, getLearnerAnalysis);

module.exports = router;
