const mongoose = require("mongoose");
const Milestone = require("./Milestone");
const MessageRoom = require("./MessageRoom");

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

    // Enhanced Review System
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
      breakdown: {
        technicalSkills: {
          type: Number,
          min: 1,
          max: 5,
        },
        communication: {
          type: Number,
          min: 1,
          max: 5,
        },
        helpfulness: {
          type: Number,
          min: 1,
          max: 5,
        },
        professionalism: {
          type: Number,
          min: 1,
          max: 5,
        },
        overallExperience: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
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
      breakdown: {
        communication: {
          type: Number,
          min: 1,
          max: 5,
        },
        commitment: {
          type: Number,
          min: 1,
          max: 5,
        },
        learningAttitude: {
          type: Number,
          min: 1,
          max: 5,
        },
        responsiveness: {
          type: Number,
          min: 1,
          max: 5,
        },
        overallExperience: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    },

    // Additional Project Tracking

    nextMilestoneDate: {
      type: Date,
      default: null,
    },
    // isOverdue: {
    //   type: Boolean,
    //   default: false,
    // },
    overduedays: {
      type: Number,
      default: 0,
    },

    // Applications from mentors
    applications: [
      {
        mentorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mentor",
          required: true,
        },
        proposedPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        coverLetter: {
          type: String,
          trim: true,
          maxlength: 2000,
        },
        estimatedDuration: {
          type: String,
          trim: true,
        },
        applicationStatus: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected", "Withdrawn"],
          default: "Pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalPitchesReceived: {
      type: Number,
      default: 0,
      required: true,
    },

    averagePitchPrice: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// Indexes for better query performance
projectSchema.index({ learnerId: 1 });
projectSchema.index({ mentorId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ difficultyLevel: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ "applications.mentorId": 1 });
projectSchema.index({ "pitches.mentor": 1 });
projectSchema.index({ hasUnreadPitch: 1 });
// projectSchema.index({ projectId: 1 });

// Compound indexes for common queries
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ learnerId: 1, status: 1 });
projectSchema.index({ mentorId: 1, status: 1 });

// Indexes for better performance
projectSchema.index({ "completionRequest.status": 1 });
projectSchema.index({ tempExpectedEndDate: 1 });
projectSchema.index({ lastProgressUpdate: -1 });
projectSchema.index({ isOverdue: 1 });
projectSchema.index({ "progressHistory.date": -1 });

// Virtual for calculating project age
projectSchema.virtual("projectAge").get(function () {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
});

// Virtual for checking if project is overdue
projectSchema.virtual("isOverdue").get(function () {
  if (!this.expectedEndDate || this.status === "Completed") return false;
  return new Date() > this.expectedEndDate;
});

// Virtual for active price (returns the most relevant price)
projectSchema.virtual("activePrice").get(function () {
  if (this.closedPrice !== null) return this.closedPrice;
  if (this.negotiatedPrice !== null) return this.negotiatedPrice;
  return this.openingPrice;
});

// Pre-save middleware to update applicationsCount
projectSchema.pre("save", function (next) {
  if (this.isModified("applications")) {
    this.applicationsCount = this.applications.length;
  }
  next();
});

// Pre-save middleware to set project status based on mentor assignment
projectSchema.pre("save", function (next) {
  if (this.isModified("mentorId")) {
    if (this.mentorId && this.status === "Idea") {
      this.status = "In Progress";
      this.startDate = new Date();
    }
  }
  next();
});

// 4. Add a virtual to count pitches:
projectSchema.virtual("pitchCount").get(function () {
  return this.pitches ? this.pitches.length : 0;
});

// 5. Pre-save middleware to update pitch count:
projectSchema.pre("save", function (next) {
  if (this.isModified("pitches")) {
    // You can add any logic here when pitches are modified
    console.log(`Project ${this.name} now has ${this.pitches.length} pitches`);
  }
  next();
});

// 6. Static method to find projects with unread pitches:
projectSchema.statics.findProjectsWithUnreadPitches = function (learnerId) {
  return this.find({
    learnerId: learnerId,
    hasUnreadPitch: true,
  }).populate("pitches.mentor", "name email avatar");
};

// 7. Instance method to get latest pitch:
projectSchema.methods.getLatestPitch = function () {
  if (!this.pitches || this.pitches.length === 0) return null;
  return this.pitches.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  )[0];
};

// 8. Instance method to get pitch by mentor:
projectSchema.methods.getPitchByMentor = function (mentorUserId) {
  if (!this.pitches || this.pitches.length === 0) return null;
  return this.pitches.find(
    (pitch) => pitch.mentor.toString() === mentorUserId.toString()
  );
};

// 9. Make sure toJSON includes pitchCount virtual:
projectSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// 10. Add validation for pitch data:
projectSchema.path("pitches").validate(function (pitches) {
  // Ensure no duplicate pitches from the same mentor
  const mentorIds = pitches.map((pitch) => pitch.mentor.toString());
  const uniqueMentorIds = [...new Set(mentorIds)];
  return mentorIds.length === uniqueMentorIds.length;
}, "Duplicate pitches from the same mentor are not allowed");
// Static method to find projects by learner
projectSchema.statics.findByLearner = function (learnerId, status = null) {
  const query = { learnerId };
  if (status) query.status = status;
  return this.find(query).populate("learnerId mentorId");
};

// Static method to find projects by mentor
projectSchema.statics.findByMentor = function (mentorId, status = null) {
  const query = { mentorId };
  if (status) query.status = status;
  return this.find(query).populate("learnerId mentorId");
};

// Static method to find available projects (no mentor assigned)
projectSchema.statics.findAvailableProjects = function (filters = {}) {
  const query = {
    mentorId: null,
    status: { $in: ["Idea", "Open"] },
    isVisible: true,
    ...filters,
  };
  return this.find(query).populate("learnerId");
};

// Instance method to add application
projectSchema.methods.addApplication = function (
  mentorId,
  proposedPrice,
  coverLetter,
  estimatedDuration
) {
  // Check if mentor already applied
  const existingApplication = this.applications.find(
    (app) => app.mentorId.toString() === mentorId.toString()
  );

  if (existingApplication) {
    throw new Error("Mentor has already applied to this project");
  }

  this.applications.push({
    mentorId,
    proposedPrice,
    coverLetter,
    estimatedDuration,
  });

  return this.save();
};

// Instance method to accept application
projectSchema.methods.acceptApplication = function (applicationId) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error("Application not found");
  }

  // Set mentor and negotiated price
  this.mentorId = application.mentorId;
  this.negotiatedPrice = application.proposedPrice;
  this.status = "In Progress";
  this.startDate = new Date();

  // Update application status
  application.applicationStatus = "Accepted";

  // Reject all other applications
  this.applications.forEach((app) => {
    if (
      app._id.toString() !== applicationId.toString() &&
      app.applicationStatus === "Pending"
    ) {
      app.applicationStatus = "Rejected";
    }
  });

  return this.save();
};

projectSchema.virtual("learner", {
  ref: "User",
  localField: "learnerId",
  foreignField: "_id",
  justOne: true,
});

// Make sure virtual fields are included in JSON
projectSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

async function getProjects(req, res) {
  try {
    const projects = await Project.find().populate("learner").exec();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

projectSchema.methods.addOrUpdatePitch = function (mentorUserId, price, note) {
  // Check if mentor already pitched (use mentor's User ID, not Mentor profile ID)
  const existingPitchIndex = this.pitches.findIndex(
    (pitch) => pitch.mentor.toString() === mentorUserId.toString()
  );

  if (existingPitchIndex >= 0) {
    // Update existing pitch
    this.pitches[existingPitchIndex].price = price;
    this.pitches[existingPitchIndex].note = note;
    this.pitches[existingPitchIndex].timestamp = new Date();
  } else {
    // Add new pitch
    this.pitches.push({
      mentor: mentorUserId, // Store the User ID, not Mentor profile ID
      price,
      note,
      timestamp: new Date(),
    });
  }

  // Set unread flag
  this.hasUnreadPitch = true;
  return this.save();
};

// Instance method to set closing price from pitch
projectSchema.methods.setClosingPriceFromPitch = function (mentorId) {
  const pitch = this.pitches.find(
    (p) => p.mentor.toString() === mentorId.toString()
  );

  if (!pitch) {
    throw new Error("Pitch not found from this mentor");
  }

  this.closingPrice = pitch.price;
  return this.save();
};

// Configure JSON output
projectSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Method to add progress update
projectSchema.methods.addProgressUpdate = function (
  percentage,
  note,
  updatedBy
) {
  this.progressHistory.push({
    percentage,
    note,
    date: new Date(),
    updatedBy,
  });

  this.progressPercentage = percentage;
  this.lastProgressUpdate = new Date();

  return this.save();
};

projectSchema.methods.addTrackerUpdate = function (
  percentage,
  note,
  updatedBy
) {
  this.trackerHistory.push({
    percentage,
    note,
    date: new Date(),
    updatedBy,
  });

  this.trackerPercentage = percentage;
  this.lastTrackerUpdate = new Date();

  return this.save();
};

// Method to check if project is overdue
projectSchema.methods.checkOverdue = function () {
  if (this.expectedEndDate && this.status === "In Progress") {
    const now = new Date();
    if (now > this.expectedEndDate) {
      this.isOverdue = true;
      this.overduedays = Math.ceil(
        (now - this.expectedEndDate) / (1000 * 60 * 60 * 24)
      );
    } else {
      this.isOverdue = false;
      this.overduedays = 0;
    }
  }
  return this.isOverdue;
};

// Static method to get overdue projects
projectSchema.statics.getOverdueProjects = function () {
  return this.find({
    status: "In Progress",
    expectedEndDate: { $lt: new Date() },
  }).populate("learnerId mentorId");
};

// Virtual for days until deadline
projectSchema.virtual("daysUntilDeadline").get(function () {
  if (!this.expectedEndDate || this.status !== "In Progress") return null;

  const now = new Date();
  const deadline = new Date(this.expectedEndDate);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
});

// Pre-save middleware to check overdue status
projectSchema.pre("save", function (next) {
  if (this.isModified("expectedEndDate") || this.isNew) {
    this.checkOverdue();
  }
  next();
});

projectSchema.post("save", async function (doc, next) {
  try {
    console.log(`[MESSAGE_DEBUG] Post-save triggered for project: ${doc.name}`);
    console.log(`[MESSAGE_DEBUG] Project status: ${doc.status}`);
    console.log(`[MESSAGE_DEBUG] Modified paths:`, this.modifiedPaths());

    // ✅ If project status changed to "In Progress"
    if (doc.status === "In Progress" && doc.mentorId && doc.learnerId) {
      console.log(`[MESSAGE_DEBUG] Project meets criteria for room creation`);
      console.log(
        `[MESSAGE_DEBUG] LearnerId: ${doc.learnerId}, MentorId: ${doc.mentorId}`
      );

      // 🔹 Check if message room already exists
      const MessageRoom = require("./MessageRoom");
      const existingRoom = await MessageRoom.findOne({ projectId: doc._id });

      if (existingRoom) {
        console.log(
          `[MESSAGE_DEBUG] Room already exists: ${existingRoom.roomId}`
        );
      } else {
        console.log(
          `[MESSAGE_DEBUG] No existing room found, creating new room`
        );

        try {
          // 🔹 Create message room directly here instead of calling controller
          const newRoom = new MessageRoom({
            learnerId: doc.learnerId,
            mentorId: doc.mentorId,
            projectId: doc._id,
            roomName: `Chat - ${doc.name}`,
            status: "open",
          });

          const savedRoom = await newRoom.save();
          console.log(
            `[MESSAGE_DEBUG] ✅ Message room created successfully: ${savedRoom.roomId}`
          );
          console.log(`[MESSAGE_DEBUG] Room details:`, {
            roomId: savedRoom._id,
            learnerId: savedRoom.learnerId,
            mentorId: savedRoom.mentorId,
            projectId: savedRoom.projectId,
            status: savedRoom.status,
          });
        } catch (roomError) {
          console.error(
            `[MESSAGE_DEBUG] ❌ Failed to create message room:`,
            roomError
          );
        }
      }

      // 🔹 Create initial milestone if none exist
      const Milestone = require("./Milestone");
      const existingMilestones = await Milestone.countDocuments({
        projectId: doc._id,
      });

      if (existingMilestones === 0) {
        const initialMilestone = new Milestone({
          title: "Project Kickoff & Setup",
          description:
            "Initial project setup, requirements discussion, and planning phase",
          projectId: doc._id,
          learnerId: doc.learnerId,
          mentorId: doc.mentorId,
          dueDate:
            doc.expectedEndDate ||
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          order: 1,
          status: "Not Started",
          priority: "High",
        });

        await initialMilestone.save();
        console.log(
          `[MESSAGE_DEBUG] ✅ Initial milestone created for project: ${doc.name}`
        );
      }
    } else {
      console.log(
        `[MESSAGE_DEBUG] Project doesn't meet room creation criteria:`
      );
      console.log(
        `[MESSAGE_DEBUG] Status: ${doc.status} (needs: "In Progress")`
      );
      console.log(`[MESSAGE_DEBUG] Has mentorId: ${!!doc.mentorId}`);
      console.log(`[MESSAGE_DEBUG] Has learnerId: ${!!doc.learnerId}`);
    }

    // -------------------------------
    // 2. When status = "Completed" or "Cancelled"
    // -------------------------------
    if (doc.status === "Completed" || doc.status === "Cancelled") {
      console.log(
        `[MESSAGE_DEBUG] Closing room for project status: ${doc.status}`
      );
      try {
        const MessageRoom = require("./MessageRoom");
        const room = await MessageRoom.findOne({ projectId: doc._id });

        if (room && room.status === "open") {
          room.status = "close";
          await room.save();
          console.log(`[MESSAGE_DEBUG] ✅ Message room closed: ${room.roomId}`);
        } else if (room) {
          console.log(`[MESSAGE_DEBUG] Room already closed: ${room.roomId}`);
        } else {
          console.log(`[MESSAGE_DEBUG] No room found for project: ${doc.name}`);
        }
      } catch (roomError) {
        console.error(
          `[MESSAGE_DEBUG] ❌ Failed to close message room:`,
          roomError
        );
      }
    }

    next();
  } catch (error) {
    console.error(
      "[MESSAGE_DEBUG] ❌ Error in project post-save middleware:",
      error
    );
    next(error);
  }
});
// Also add this pre-save middleware to update milestone project references if needed
projectSchema.pre("save", function (next) {
  // Update lastUpdated timestamp
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
