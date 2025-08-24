require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const path = require("path");
const db = require("./connection/conn");
const { startSessionStatusJob } = require("./jobs/sessionStatusJob");

// Import routes
const userRoutes = require("./routes/userRoute");
const mentorRoutes = require("./routes/mentorRoute");
const authRoutes = require("./routes/authRoute");
const metaRoutes = require("./routes/metaRoute");
const projectRoutes = require("./routes/projectRoute");
const aiRoutes = require("./routes/aiRoute");
const milestoneRoutes = require("./routes/milestoneRoute");
const achievementRoutes = require("./routes/achievementRoute");
const syncRoutes = require("./routes/syncRoute");
const sessionRoutes = require("./routes/sessionRoute");
const analysisRoutes = require("./routes/analysisRoute");
const dashboardRoutes = require("./routes/dashboardRoutes");
const goalRoutes = require("./routes/goalRoute");
const requestRoutes = require("./routes/requestRoute");
const mentorDetailsRoutes = require("./routes/mentorDetailsRoute");
const messageRoutes = require("./routes/messageRoute");
const adminLoginRoutes = require("./routes/adminAuthRoute");
const adminDashbaordRoutes = require("./routes/admin/adminDashboardRoutes");
const adminUserRoutes = require("./routes/admin/userRoutes");
const adminLearnerRoutes = require("./routes/admin/learnerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
startSessionStatusJob();
// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://help-me-make.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.UI_URL || "http://localhost:5173"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Passport initialization
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/users", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/mentors", mentorRoutes);
app.use("/meta", metaRoutes);
app.use("/projects", projectRoutes);

// IMPORTANT: Order matters! Put milestone routes BEFORE project routes
// to catch /api/project/active-with-mentor
app.use("/api/project", projectRoutes);
app.use("/api/milestone", milestoneRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/goals", goalRoutes);
app.use("/requests", requestRoutes);
app.use("/api/mentor-details", mentorDetailsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/admin", adminLoginRoutes);
app.use("/admin/dashboard", adminDashbaordRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/learners", adminLearnerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "HelpMeMake Backend is running!",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("Global Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Graceful shutdown...");
  try {
    await mongoose.connection.close();
    console.log("📊 MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Graceful shutdown...");
  try {
    await mongoose.connection.close();
    console.log("📊 MongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server after database connection
const startServer = async () => {
  // Then start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 UI URL: ${process.env.UI_URL}`);
    console.log(`🌐 Server URL: ${process.env.SERVER_URL}`);
    console.log(`🔑 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

// Start the application
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
