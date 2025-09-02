const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "Not mentioned",
      required: true,
    },
    description: {
      type: String,
      default: "To Lazy to type",
      required: true,
    },
    location: {
      type: String,
      default: "Home",
      required: true,
    },
    isProfileUpdated: {
      type: Boolean,
      default: false,
      required: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
      required: true,
    },
    xp: {
      type: Number,
      default: 0,
      required: true,
    },
    nextLevelXp: {
      type: Number,
      default: 1000,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    socialLinks: {
      linkedin: { type: String, required: true, default: "#" },
      github: { type: String, required: true, default: "#" },
      twitter: { type: String, required: true, default: "#" },
    },

    completedSessions: {
      type: Number,
      default: 0,
      required: true,
    },
    streakDays: {
      type: Number,
      default: 0,
      required: true,
    },
    maxStreak: {
      type: Number,
      default: 0,
      required: true,
    },
    totalLogins: {
      type: Number,
      default: 0,
      required: true,
    },
    lastLoginDate: {
      type: Date,
      default: null,
    },
    totalAchievement: {
      type: Number,
      default: 0,
      required: true,
    },
    joinDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    userActiveProjects: {
      type: Number,
      default: 0,
      required: true,
    },
    userActiveProjectsChange: {
      type: Number,
      default: 0,
      required: true,
    },
    userSessionsScheduled: {
      type: Number,
      default: 0,
      required: true,
    },
    userSessionsScheduledChange: {
      type: Number,
      default: 0,
      required: true,
    },
    userTotalProjects: {
      type: Number,
      default: 0,
      required: true,
    },
    userTotalProjectsChange: {
      type: Number,
      default: 0,
      required: true,
    },
    userCompletionRate: {
      type: Number,
      default: 0,
      required: true,
    },
    userCompletionRateChange: {
      type: Number,
      default: 0,
      required: true,
    },
    averageProjectRating: {
      type: Number,
      default: 0,
      required: true,
    },

    totalProjectsPosted: {
      type: Number,
      default: 0,
      required: true,
    },

    totalProjectsBudget: {
      type: Number,
      default: 0,
      required: true,
    },

    learningGoals: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredTopics: [
      {
        type: String,
        trim: true,
      },
    ],
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    sessionHistory: [
      {
        mentorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sessionDate: Date,
        topic: String,
        rating: Number,
        feedback: String,
      },
    ],

    favoriteTopics: [
      {
        type: String,
      },
    ],
    bookmarkedMentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sessionReminders: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

learnerSchema.index({ level: 1 });
learnerSchema.index({ rating: -1 });
learnerSchema.index({ joinDate: -1 });
learnerSchema.index({ xp: -1 });
learnerSchema.index({ streakDays: -1 });
learnerSchema.index({ lastLoginDate: -1 });

learnerSchema.virtual("progressPercentage").get(function () {
  if (this.nextLevelXp === 0) return 100;
  const currentLevelXP = this.xp % 1000;
  return Math.floor((currentLevelXP / 1000) * 100);
});

learnerSchema.virtual("totalSessions").get(function () {
  return this.completedSessions + this.userSessionsScheduled;
});

learnerSchema.methods.updateDailyStreak = function () {
  const now = new Date();

  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const today = istNow.toDateString();

  const lastLoginIST = this.lastLoginDate
    ? new Date(new Date(this.lastLoginDate).getTime() + istOffset)
    : null;
  const lastLoginDate = lastLoginIST ? lastLoginIST.toDateString() : null;

  if (lastLoginDate !== today) {
    const yesterday = new Date(istNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastLoginDate === yesterdayStr) {
      this.streakDays = (this.streakDays || 0) + 1;
    } else if (lastLoginDate !== today) {
      this.streakDays = 1;
    }

    this.maxStreak = Math.max(this.maxStreak || 0, this.streakDays);
    this.totalLogins = (this.totalLogins || 0) + 1;
    this.lastLoginDate = now;

    return true;
  }

  return false;
};

learnerSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Learner", learnerSchema);
