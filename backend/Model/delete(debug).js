const mongoose = require("mongoose");
const Milestone = require("./Milestone");

const projectSchema = new mongoose.Schema(
  {
    // Unique Project Identifier
    projectId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return (
          "PRJ-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        );
      },
    },

    // Core Project Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    fullDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    // Technical Details
    techStack: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "AI/Machine Learning",
        "Data Science",
        "DevOps",
        "Blockchain",
        "IoT",
        "Game Development",
        "Desktop Applications",
        "API Development",
        "Database Design",
        "UI/UX Design",
        "Cybersecurity",
        "Cloud Computing",
        "Other",
      ],
    },
    difficultyLevel: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    // Project Metadata
    duration: {
      type: String,
      required: true,
      trim: true, // e.g., "2 weeks", "1 month", "3-4 days"
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Cancelled"],
      default: "Open",
    },
    thumbnail: {
      type: String,
      default: "/uploads/public/default-project.jpg",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Project Goals & Context
    projectOutcome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    motivation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    prerequisites: [
      {
        type: String,
        trim: true,
      },
    ],
    knowledgeLevel: {
      type: String,
      required: true,
      enum: [
        "Complete Beginner",
        "Some Knowledge",
        "Good Understanding",
        "Advanced Knowledge",
      ],
    },
    references: [
      {
        title: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: [
            "Documentation",
            "Tutorial",
            "GitHub Repo",
            "Article",
            "Video",
            "Book",
            "Other",
          ],
          default: "Other",
        },
      },
    ],

    // Relationships
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },

    // Pricing Information
    openingPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return v >= 0;
        },
        message: "Opening price must be a positive number",
      },
    },
    negotiatedPrice: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: function (v) {
          return v === null || v >= 0;
        },
        message: "Negotiated price must be a positive number",
      },
    },
    closingPrice: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: function (v) {
          return v === null || v >= 0;
        },
        message: "Closing price must be a positive number",
      },
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Project Timeline
    startDate: {
      type: Date,
      default: null,
    },
    expectedEndDate: {
      type: Date,
      default: null,
    },
    actualEndDate: {
      type: Date,
      default: null,
    },

    // Project Progress & Milestones
    milestones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
      },
    ],

    totalMilestones: {
      type: Number,
      default: 0,
      max: 5, // Maximum 5 milestones per project
    },

    completedMilestones: {
      type: Number,
      default: 0,
    },

    // Communication & Feedback
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderType: {
          type: String,
          enum: ["Learner", "Mentor"],
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Reviews & Ratings (after completion)
    learnerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      reviewDate: Date,
    },
    mentorReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
      reviewDate: Date,
    },

    // Additional Metadata
    isVisible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },

    aiResponse: {
      suggestions: [
        {
          text: {
            type: String,
            trim: true,
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
        },
      ],
      previousSuggestions: [
        {
          text: String,
          generatedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      lastGenerated: {
        type: Date,
        default: null,
      },
    },

    pitches: [
      {
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Should reference User, not Mentor directly
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        note: {
          type: String,
          trim: true,
          maxlength: 1000,
          default: "",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // NEW: Notification flag for unread pitches
    hasUnreadPitch: {
      type: Boolean,
      default: false,
    },

    // Expected End Date Management
    tempExpectedEndDate: {
      type: Date,
      default: null,
    },
    isTempEndDateConfirmed: {
      type: Boolean,
      default: false,
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lastProgressUpdate: {
      type: Date,
      default: null,
    },

    // Progress History Tracking
    progressHistory: [
      {
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        note: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    trackerPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    trackerHistory: [
      {
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        note: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    lastTrackerUpdate: {
      type: Date,
      default: null,
    },

    // Completion Request Management
    completionRequest: {
      from: {
        type: String,
        enum: ["learner", "mentor"],
        default: null,
      },
      type: {
        type: String,
        enum: ["complete", "cancel"],
        default: null,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: null,
      },
      requestedAt: {
        type: Date,
        default: null,
      },
      requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      approvedAt: {
        type: Date,
        default: null,
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
      mentorNotes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: null,
      },
      learnerNotes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: null,
      },
    },
  },

  {
    timestamps: true,
  }
);
// Also add this pre-save middleware to update milestone project references if needed
projectSchema.pre("save", function (next) {
  // Update lastUpdated timestamp
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
