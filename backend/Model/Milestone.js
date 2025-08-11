const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    // Unique Milestone Identifier
    milestoneId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return (
          "MLS-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        );
      },
    },

    // Core Milestone Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // References to related entities
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
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

    // Milestone Status & Progress
    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Pending Review",
        "Completed",
        "Blocked",
      ],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    // Verification System - Both parties must verify for completion
    learnerVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      verificationNotes: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      submissionUrl: {
        type: String,
        trim: true, // Link to GitHub, demo, etc.
      },
      submissionFiles: [
        {
          filename: String,
          url: String,
          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    mentorVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: {
        type: Date,
        default: null,
      },
      verificationNotes: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },

    // Timeline & Deadlines
    startDate: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    estimatedHours: {
      type: Number,
      min: 0,
      default: 0,
    },
    actualHours: {
      type: Number,
      min: 0,
      default: 0,
    },

    // Technical Requirements
    acceptanceCriteria: [
      {
        criterion: {
          type: String,
          required: true,
          trim: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: String,
          enum: ["learner", "mentor", "both"],
          default: null,
        },
        completedAt: Date,
        notes: String,
      },
    ],

    deliverables: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: String,
        type: {
          type: String,
          enum: ["Code", "Documentation", "Design", "Test", "Demo", "Other"],
          default: "Other",
        },
        isRequired: {
          type: Boolean,
          default: true,
        },
        isSubmitted: {
          type: Boolean,
          default: false,
        },
        submissionUrl: String,
        submittedAt: Date,
      },
    ],

    // Resources & References
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: [
            "Documentation",
            "Tutorial",
            "Video",
            "Article",
            "GitHub",
            "Tool",
            "Other",
          ],
          default: "Other",
        },
        isRequired: {
          type: Boolean,
          default: false,
        },
      },
    ],

    reviewNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
    reviewReadByLearner: {
      type: Boolean,
      default: true, // true = read, false = unread (blinking)
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Communication & Updates
    comments: [
      {
        authorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        authorType: {
          type: String,
          enum: ["learner", "mentor"],
          required: true,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
        attachments: [
          {
            filename: String,
            url: String,
            type: String,
          },
        ],
      },
    ],

    // Progress Tracking
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Gamification & Rewards
    xpReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficultyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Special Properties
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockingReason: {
      type: String,
      trim: true,
    },
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Milestone",
      },
    ],
    isOptional: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 5,
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
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
milestoneSchema.index({ projectId: 1 });
milestoneSchema.index({ learnerId: 1 });
milestoneSchema.index({ mentorId: 1 });
milestoneSchema.index({ status: 1 });
milestoneSchema.index({ dueDate: 1 });
milestoneSchema.index({ order: 1 });
milestoneSchema.index({ "learnerVerification.isVerified": 1 });
milestoneSchema.index({ "mentorVerification.isVerified": 1 });
// milestoneSchema.index({ milestoneId: 1 });
milestoneSchema.index({ createdAt: -1 });

// Compound indexes for common queries
milestoneSchema.index({ projectId: 1, order: 1 });
milestoneSchema.index({ projectId: 1, status: 1 });
milestoneSchema.index({ learnerId: 1, status: 1 });
milestoneSchema.index({ mentorId: 1, status: 1 });

// Virtual for checking if milestone is fully completed (both verified)
milestoneSchema.virtual("isFullyCompleted").get(function () {
  return (
    this.learnerVerification.isVerified && this.mentorVerification.isVerified
  );
});

// Virtual for checking if milestone is partially completed (one verified)
milestoneSchema.virtual("isPartiallyCompleted").get(function () {
  return (
    (this.learnerVerification.isVerified ||
      this.mentorVerification.isVerified) &&
    !(this.learnerVerification.isVerified && this.mentorVerification.isVerified)
  );
});

// Virtual for checking if milestone is overdue
milestoneSchema.virtual("isOverdue").get(function () {
  if (this.isFullyCompleted || !this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due
milestoneSchema.virtual("daysUntilDue").get(function () {
  if (!this.dueDate) return null;
  const diffTime = this.dueDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for completion percentage based on acceptance criteria
milestoneSchema.virtual("criteriaCompletionPercentage").get(function () {
  if (this.acceptanceCriteria.length === 0) return 0;
  const completedCriteria = this.acceptanceCriteria.filter(
    (c) => c.isCompleted
  ).length;
  return Math.round((completedCriteria / this.acceptanceCriteria.length) * 100);
});

// Pre-save middleware to update completion status
milestoneSchema.pre("save", function (next) {
  // Update status based on verification
  if (this.isFullyCompleted) {
    this.status = "Completed";
    if (!this.completedDate) {
      this.completedDate = new Date();
    }
    this.progressPercentage = 100;
  } else if (this.isPartiallyCompleted) {
    if (this.status === "Not Started") {
      this.status = "Pending Review";
    }
  }

  // Update progress percentage based on criteria
  if (this.acceptanceCriteria.length > 0) {
    const completedCriteria = this.acceptanceCriteria.filter(
      (c) => c.isCompleted
    ).length;
    const baseProgress = Math.round(
      (completedCriteria / this.acceptanceCriteria.length) * 80
    ); // 80% from criteria

    // Add verification bonus
    let verificationBonus = 0;
    if (this.learnerVerification.isVerified) verificationBonus += 10;
    if (this.mentorVerification.isVerified) verificationBonus += 10;

    this.progressPercentage = Math.min(baseProgress + verificationBonus, 100);
  }

  // Update lastUpdated
  this.lastUpdated = new Date();

  next();
});

// Post-save middleware to update project progress
milestoneSchema.post("save", async function (doc) {
  try {
    const Project = mongoose.model("Project");
    const project = await Project.findById(doc.projectId);

    if (project) {
      // Recalculate project progress based on milestone completion
      const allMilestones = await mongoose
        .model("Milestone")
        .find({ projectId: doc.projectId });
      const completedMilestones = allMilestones.filter(
        (m) => m.isFullyCompleted
      ).length;
      const projectProgress =
        allMilestones.length > 0
          ? Math.round((completedMilestones / allMilestones.length) * 100)
          : 0;

      await Project.findByIdAndUpdate(doc.projectId, {
        progressPercentage: projectProgress,
      });
    }
  } catch (error) {
    console.error("Error updating project progress:", error);
  }
});

// Static method to find milestones by project
milestoneSchema.statics.findByProject = function (
  projectId,
  populateRefs = true
) {
  const query = this.find({ projectId }).sort({ order: 1 });
  if (populateRefs) {
    return query.populate("learnerId mentorId projectId");
  }
  return query;
};

// Static method to find pending milestones for learner
milestoneSchema.statics.findPendingForLearner = function (learnerId) {
  return this.find({
    learnerId,
    "learnerVerification.isVerified": false,
    status: { $in: ["In Progress", "Pending Review"] },
  }).populate("projectId");
};

// Static method to find pending milestones for mentor
milestoneSchema.statics.findPendingForMentor = function (mentorId) {
  return this.find({
    mentorId,
    "mentorVerification.isVerified": false,
    "learnerVerification.isVerified": true,
    status: "Pending Review",
  }).populate("projectId learnerId");
};

// Instance method to mark as learner verified
milestoneSchema.methods.markLearnerVerified = function (
  notes,
  submissionUrl,
  files = []
) {
  this.learnerVerification.isVerified = true;
  this.learnerVerification.verifiedAt = new Date();
  this.learnerVerification.verificationNotes = notes;
  this.learnerVerification.submissionUrl = submissionUrl;
  this.learnerVerification.submissionFiles = files;

  if (this.status === "Not Started") {
    this.status = "Pending Review";
  }

  return this.save();
};

// Instance method to mark as mentor verified
milestoneSchema.methods.markMentorVerified = function (
  notes,
  rating,
  feedback
) {
  this.mentorVerification.isVerified = true;
  this.mentorVerification.verifiedAt = new Date();
  this.mentorVerification.verificationNotes = notes;
  this.mentorVerification.rating = rating;
  this.mentorVerification.feedback = feedback;

  return this.save();
};

// Instance method to add comment
milestoneSchema.methods.addComment = function (
  authorId,
  authorType,
  comment,
  attachments = []
) {
  this.comments.push({
    authorId,
    authorType,
    comment,
    attachments,
  });

  return this.save();
};

// Instance method to check dependencies
milestoneSchema.methods.areDependenciesMet = async function () {
  if (this.dependencies.length === 0) return true;

  const dependencies = await mongoose.model("Milestone").find({
    _id: { $in: this.dependencies },
  });

  return dependencies.every((dep) => dep.isFullyCompleted);
};

milestoneSchema.methods.addReviewNote = function (mentorId, note) {
  this.reviewNote = note;
  this.reviewReadByLearner = false; // Mark as unread for blinking
  this.reviewedAt = new Date();
  this.reviewedBy = mentorId;
  return this.save();
};

milestoneSchema.methods.markReviewAsRead = function () {
  this.reviewReadByLearner = true;
  return this.save();
};

// Add this virtual for checking if milestone can be edited
milestoneSchema.virtual("canBeEdited").get(function () {
  return !(
    this.learnerVerification.isVerified && this.mentorVerification.isVerified
  );
});

// Update the pre-save middleware to handle review notifications
milestoneSchema.pre("save", function (next) {
  // Existing pre-save logic...

  // Update status based on verification
  if (this.isFullyCompleted) {
    this.status = "Completed";
    if (!this.completedDate) {
      this.completedDate = new Date();
    }
    this.progressPercentage = 100;
  } else if (this.isPartiallyCompleted) {
    if (this.status === "Not Started") {
      this.status = "Pending Review";
    }
  }

  // Update progress percentage based on criteria
  if (this.acceptanceCriteria.length > 0) {
    const completedCriteria = this.acceptanceCriteria.filter(
      (c) => c.isCompleted
    ).length;
    const baseProgress = Math.round(
      (completedCriteria / this.acceptanceCriteria.length) * 80
    ); // 80% from criteria

    // Add verification bonus
    let verificationBonus = 0;
    if (this.learnerVerification.isVerified) verificationBonus += 10;
    if (this.mentorVerification.isVerified) verificationBonus += 10;

    this.progressPercentage = Math.min(baseProgress + verificationBonus, 100);
  }

  // Update lastUpdated
  this.lastUpdated = new Date();

  next();
});

// Configure JSON output
milestoneSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Milestone", milestoneSchema);
