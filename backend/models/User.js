// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  college: String,
  degree: String,
  yearOrExperience: String,
  primarySkills: {
    type: [String],
    default: [],
  },
  lookingForHelp: String,
  canOfferHelp: String,
  linkedinUrl: String,
  githubUrl: String,
  personalWebsite: String,
  aboutMe: String,
  location: String,
  preferredCommunication: String,
  agreeToTerms: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
