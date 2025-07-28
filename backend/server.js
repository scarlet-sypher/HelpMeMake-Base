require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const db = require("./connection/conn")


const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: process.env.UI_URL || 'http://localhost:5174',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};


app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 


app.use(passport.initialize());


// Routes
app.use('/auth', authRoutes);



app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HelpMeMake Backend is running!',
    timestamp: new Date().toISOString()
  });
});


app.use((req, res) => {
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