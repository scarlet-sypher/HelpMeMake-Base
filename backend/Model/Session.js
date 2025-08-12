const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Session Details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    sessionType: {
      type: String,
      enum: ["one-on-one", "group", "code-review", "workshop"],
      default: "one-on-one",
    },
    scheduledAt: {
      // contains both date & time
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "ongoing",
        "cancelled",
        "rescheduled",
        "expired",
      ],
      default: "scheduled",
    },

    expireReason: {
      type: String,
      default: null,
    },

    learnerReason: {
      type: String,
    },

    mentorReason: {
      type: String,
    },

    // Meeting Info
    meetingLink: {
      type: String,
      trim: true,
    },
    recordingLink: {
      type: String,
      trim: true,
    },
    prerequisites: {
      // notes, required readings, links, etc.
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // Attendance Tracking
    isLearnerPresent: {
      type: Boolean,
      default: false,
    },
    isMentorPresent: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number, // in minutes
      default: 60,
    },

    learnerAttendedAt: {
      type: Date,
      default: null,
    },
    mentorAttendedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
sessionSchema.index({ learnerId: 1 });
sessionSchema.index({ mentorId: 1 });
sessionSchema.index({ projectId: 1 });
sessionSchema.index({ scheduledDate: 1 });
sessionSchema.index({ status: 1 });

module.exports = mongoose.model("Session", sessionSchema);
