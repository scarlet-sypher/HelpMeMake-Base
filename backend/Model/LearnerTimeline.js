const mongoose = require("mongoose");

const learnerTimelineSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
      unique: true,
    },

    // Latest counts for tracking changes
    latestCounts: {
      // Project counts by status
      projects: {
        total: { type: Number, default: 0 },
        open: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        cancelled: { type: Number, default: 0 },
      },

      // Achievement counts
      achievements: {
        total: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
      },

      // Milestone counts by status
      milestones: {
        total: { type: Number, default: 0 },
        notStarted: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        pendingReview: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        blocked: { type: Number, default: 0 },
      },

      // Session counts by status
      sessions: {
        total: { type: Number, default: 0 },
        scheduled: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        ongoing: { type: Number, default: 0 },
        cancelled: { type: Number, default: 0 },
        rescheduled: { type: Number, default: 0 },
        expired: { type: Number, default: 0 },
      },
    },

    // Timeline events
    events: [
      {
        type: {
          type: String,
          enum: [
            "project_added",
            "project_deleted",
            "project_status_changed",
            "milestone_added",
            "milestone_deleted",
            "milestone_status_changed",
            "achievement_level_increased",
            "achievement_added",
            "session_added",
            "session_deleted",
            "session_status_changed",
          ],
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        icon: {
          type: String,
          required: true,
          enum: [
            "Folder",
            "FolderPlus",
            "FolderMinus",
            "CheckCircle",
            "Target",
            "TargetIcon",
            "Trash2",
            "Award",
            "Trophy",
            "Calendar",
            "CalendarPlus",
            "CalendarX",
            "Clock",
            "PlayCircle",
            "XCircle",
          ],
        },
        color: {
          type: String,
          required: true,
          enum: [
            "text-blue-400",
            "text-green-400",
            "text-yellow-400",
            "text-purple-400",
            "text-red-400",
            "text-orange-400",
            "text-pink-400",
            "text-cyan-400",
            "text-emerald-400",
          ],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        relatedEntityId: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
        },
        relatedEntityType: {
          type: String,
          enum: ["Project", "Milestone", "Achievement", "Session"],
          default: null,
        },
        metadata: {
          previousStatus: String,
          newStatus: String,
          previousLevel: Number,
          newLevel: Number,
          entityName: String,
        },
      },
    ],

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
learnerTimelineSchema.index({ learnerId: 1 });
learnerTimelineSchema.index({ "events.createdAt": -1 });
learnerTimelineSchema.index({ "events.type": 1 });
learnerTimelineSchema.index({ lastUpdated: -1 });

// Static method to find or create timeline record
learnerTimelineSchema.statics.findOrCreateByLearner = async function (
  learnerId
) {
  let timeline = await this.findOne({ learnerId });

  if (!timeline) {
    timeline = new this({
      learnerId,
      latestCounts: {
        projects: {
          total: 0,
          open: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
        },
        achievements: { total: 0, level: 0, xp: 0 },
        milestones: {
          total: 0,
          notStarted: 0,
          inProgress: 0,
          pendingReview: 0,
          completed: 0,
          blocked: 0,
        },
        sessions: {
          total: 0,
          scheduled: 0,
          completed: 0,
          ongoing: 0,
          cancelled: 0,
          rescheduled: 0,
          expired: 0,
        },
      },
      events: [],
    });

    await timeline.save();
  }

  return timeline;
};

// Instance method to add timeline event
learnerTimelineSchema.methods.addEvent = function (
  type,
  message,
  icon,
  color,
  relatedEntityId = null,
  relatedEntityType = null,
  metadata = {}
) {
  this.events.unshift({
    type,
    message,
    icon,
    color,
    relatedEntityId,
    relatedEntityType,
    metadata,
    createdAt: new Date(),
  });

  // Keep only last 100 events to prevent unlimited growth
  if (this.events.length > 100) {
    this.events = this.events.slice(0, 100);
  }

  this.lastUpdated = new Date();
  return this.save();
};

// Instance method to update counts and detect changes
learnerTimelineSchema.methods.updateAndDetectChanges = async function (
  newCounts
) {
  const oldCounts = this.latestCounts;
  const events = [];

  //debug - Print counts being compared
  //   console.log("//debug - Old counts:", JSON.stringify(oldCounts, null, 2));
  //   console.log("//debug - New counts:", JSON.stringify(newCounts, null, 2));

  // Check project changes
  if (newCounts.projects) {
    // Total projects
    if (newCounts.projects.total > oldCounts.projects.total) {
      events.push({
        type: "project_added",
        message: "A new project was added",
        icon: "FolderPlus",
        color: "text-blue-400",
      });
    } else if (newCounts.projects.total < oldCounts.projects.total) {
      events.push({
        type: "project_deleted",
        message: "A project was deleted",
        icon: "FolderMinus",
        color: "text-red-400",
      });
    }

    // Project status changes
    if (newCounts.projects.completed > oldCounts.projects.completed) {
      events.push({
        type: "project_status_changed",
        message: "Congratulations! A project was completed",
        icon: "CheckCircle",
        color: "text-green-400",
      });
    }

    if (newCounts.projects.inProgress > oldCounts.projects.inProgress) {
      events.push({
        type: "project_status_changed",
        message: "A project is now in progress",
        icon: "PlayCircle",
        color: "text-yellow-400",
      });
    }

    if (newCounts.projects.cancelled > oldCounts.projects.cancelled) {
      events.push({
        type: "project_status_changed",
        message: "A project was cancelled",
        icon: "XCircle",
        color: "text-red-400",
      });
    }
  }

  // Check achievement changes
  if (newCounts.achievements) {
    if (newCounts.achievements.level > oldCounts.achievements.level) {
      events.push({
        type: "achievement_level_increased",
        message: `Congratulations! Achievement level increased to ${newCounts.achievements.level}`,
        icon: "Trophy",
        color: "text-yellow-400",
      });
    }

    if (newCounts.achievements.total > oldCounts.achievements.total) {
      events.push({
        type: "achievement_added",
        message: "A new achievement was unlocked",
        icon: "Award",
        color: "text-purple-400",
      });
    }
  }

  // Check milestone changes
  if (newCounts.milestones) {
    if (newCounts.milestones.total > oldCounts.milestones.total) {
      events.push({
        type: "milestone_added",
        message: "A new milestone was added",
        icon: "TargetIcon",
        color: "text-cyan-400",
      });
    } else if (newCounts.milestones.total < oldCounts.milestones.total) {
      events.push({
        type: "milestone_deleted",
        message: "A milestone was deleted",
        icon: "Trash2",
        color: "text-red-400",
      });
    }

    if (newCounts.milestones.completed > oldCounts.milestones.completed) {
      events.push({
        type: "milestone_status_changed",
        message: "Congratulations! A milestone was completed",
        icon: "Target",
        color: "text-green-400",
      });
    }
  }

  // Check session changes
  if (newCounts.sessions) {
    if (newCounts.sessions.total > oldCounts.sessions.total) {
      events.push({
        type: "session_added",
        message: "A new session was scheduled",
        icon: "CalendarPlus",
        color: "text-blue-400",
      });
    } else if (newCounts.sessions.total < oldCounts.sessions.total) {
      events.push({
        type: "session_deleted",
        message: "A session was deleted",
        icon: "CalendarX",
        color: "text-red-400",
      });
    }

    if (newCounts.sessions.completed > oldCounts.sessions.completed) {
      events.push({
        type: "session_status_changed",
        message: "Congratulations! A session was completed",
        icon: "CheckCircle",
        color: "text-green-400",
      });
    }

    if (newCounts.sessions.cancelled > oldCounts.sessions.cancelled) {
      events.push({
        type: "session_status_changed",
        message: "A session was cancelled",
        icon: "CalendarX",
        color: "text-red-400",
      });
    }
  }

  //   //debug - Print detected events
  //   console.log("//debug - Detected timeline events:", events.length);
  //   events.forEach((event, index) => {
  //     console.log(`//debug - Event ${index + 1}:`, event.message);
  //   });

  // Add all detected events
  for (const event of events) {
    await this.addEvent(event.type, event.message, event.icon, event.color);
  }

  // Update counts
  this.latestCounts = newCounts;
  this.lastUpdated = new Date();

  return this.save();
};

// Configure JSON output
learnerTimelineSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("LearnerTimeline", learnerTimelineSchema);
