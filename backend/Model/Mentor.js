const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Professional Profile
  title: {
    type: String,
    default: "Software Engineer", // Professional title/designation
    required: true
  },
  description: {
    type: String,
    default: "Passionate about helping others learn and grow",
    required: true
  },
  bio: {
    type: String,
    default: "Experienced professional ready to share knowledge",
    maxlength: 1000
  },
  location: {
    type: String,
    default: "Remote",
    required: true
  },
})


module.exports = mongoose.model('Mentor', mentorSchema);