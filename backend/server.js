require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const db = require("./connection/conn");
const userRoutes = require('./routes/userRoute');
const mentorRoutes = require('./routes/mentorRoute');
const path = require('path');
const authRoutes = require('./routes/authRoute');
const metaRoutes = require('./routes/metaRoute');
const projectRoutes = require('./routes/projectRoute');
const aiRoutes = require('./routes/aiRoute');
const milestoneRoutes = require('./routes/milestoneRoute');
const achievementRoutes = require('./routes/achievementRoute');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.UI_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

// CORS middleware (should be first)
app.use(cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.UI_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
 
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport
app.use(passport.initialize());

// Routes - FIXED THE PROJECT ROUTE MOUNTING
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/mentor', mentorRoutes);
app.use('/mentors', mentorRoutes);
app.use('/meta', metaRoutes);
app.use('/projects', projectRoutes); // Keep this for backward compatibility
app.use('/api/project', projectRoutes); 
app.use('/api/ai', aiRoutes);
app.use('/api/milestone', milestoneRoutes);
app.use('/api/achievements', achievementRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HelpMeMake Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Global Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 UI URL: ${process.env.UI_URL}`);
  console.log(`🌐 Server URL: ${process.env.SERVER_URL}`);
  console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
});