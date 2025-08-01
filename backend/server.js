require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoute');
const mentorRoutes = require('./routes/mentorRoute');
const authRoutes = require('./routes/authRoute');
const metaRoutes = require('./routes/metaRoute');
const projectRoutes = require('./routes/projectRoute');
const aiRoutes = require('./routes/aiRoute');
const milestoneRoutes = require('./routes/milestoneRoute');
const achievementRoutes = require('./routes/achievementRoute');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection Function
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 2000, // Send heartbeat every 2s
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔄 Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// CORS Configuration
const corsOptions = {
  origin: process.env.UI_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

// Middleware
app.use(cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.UI_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
 
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport initialization
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/mentor', mentorRoutes);
app.use('/mentors', mentorRoutes);
app.use('/meta', metaRoutes);
app.use('/projects', projectRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/milestone', milestoneRoutes);
app.use('/api/achievements', achievementRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HelpMeMake Backend is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
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

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  try {
    await mongoose.connection.close();
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  try {
    await mongoose.connection.close();
    console.log('📊 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server after database connection
const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Then start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 UI URL: ${process.env.UI_URL}`);
    console.log(`🌐 Server URL: ${process.env.SERVER_URL}`);
    console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Start the application
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});