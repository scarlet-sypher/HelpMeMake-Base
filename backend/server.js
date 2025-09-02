require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const path = require("path");
const db = require("./connection/conn");
const { startSessionStatusJob } = require("./jobs/sessionStatusJob");

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
const adminMentorRoutes = require("./routes/admin/mentorRoutes");
const adminRoomRoutes = require("./routes/admin/roomRoutes");
const adminProjectRoutes = require("./routes/admin/projectRoutes");
const adminSessionsRoutes = require("./routes/admin/sessionsRoutes");
const quickActionRoutes = require("./routes/quickActionRoute");
const timelineRoutes = require("./routes/timelineRoute");
const mentorTimelineRoutes = require("./routes/mentorTimelineRoute");

const app = express();
const PORT = process.env.PORT || 5000;
startSessionStatusJob();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://help-me-make.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

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

app.use(cors(corsOptions));

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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/users", userRoutes);
app.use("/mentor", mentorRoutes);
app.use("/mentors", mentorRoutes);
app.use("/meta", metaRoutes);
app.use("/projects", projectRoutes);

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
app.use("/admin/mentors", adminMentorRoutes);
app.use("/admin/rooms", adminRoomRoutes);
app.use("/admin/projects", adminProjectRoutes);
app.use("/admin/sessions", adminSessionsRoutes);
app.use("/api/quick-actions", quickActionRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/mentor-timeline", mentorTimelineRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "HelpMeMake Backend is running!",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Global Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

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

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 UI URL: ${process.env.UI_URL}`);
    console.log(`🌐 Server URL: ${process.env.SERVER_URL}`);
    console.log(`🔑 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
