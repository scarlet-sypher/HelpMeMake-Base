const mongoose = require("mongoose");

const achievementLevelSchema = new mongoose.Schema(
  {
    basic: { type: Number, default: 1 }, // Count needed for basic badge
    common: { type: Number, default: 5 }, // Count needed for common badge
    rare: { type: Number, default: 15 }, // Count needed for rare badge
    epic: { type: Number, default: 25 }, // Count needed for epic badge
    legendary: { type: Number, default: 40 }, // Count needed for legendary badge
    currentCount: { type: Number, default: 0 }, // Current progress count
    earnedBadges: { type: [String], default: [] }, // List of badges earned ['basic', 'common', etc.]
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
      unique: true, // One achievement record per learner
    },

    // XP & Level specific to achievements
    xp: { type: Number, default: 0, required: true },
    level: { type: Number, default: 0, required: true },
    nextLevelXp: { type: Number, default: 1000, required: true },

    // Achievement Categories
    project: {
      completedProjects: achievementLevelSchema,
      projectsAdded: achievementLevelSchema,
    },

    social: {
      completedSessions: achievementLevelSchema,
      successfulSessions: achievementLevelSchema,
    },

    learnerStats: {
      firstLogin: { type: Boolean, default: false }, // One-time achievement
      streakDays: achievementLevelSchema,
      totalLogins: achievementLevelSchema,
    },

    milestone: {
      completedMilestones: achievementLevelSchema,
    },

    // Store all unlocked achievements with details
    unlocked: [
      {
        name: { type: String, required: true }, // e.g. "completedProjects - basic"
        category: {
          type: String,
          enum: ["project", "social", "learnerStats", "milestone"],
          required: true,
        },
        level: {
          type: String,
          enum: ["basic", "common", "rare", "epic", "legendary", "special"],
          required: true,
        },
        dateUnlocked: { type: Date, default: Date.now },
      },
    ],

    totalBadges: { type: Number, default: 0 },
    totalAchievements: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for better performance
achievementSchema.index({ learner: 1 });
achievementSchema.index({ level: 1 });
achievementSchema.index({ xp: -1 });
achievementSchema.index({ "unlocked.category": 1 });
achievementSchema.index({ "unlocked.level": 1 });
achievementSchema.index({ "unlocked.dateUnlocked": -1 });

// Virtual for progress percentage to next level
achievementSchema.virtual("progressPercentage").get(function () {
  if (this.level >= 10) return 100; // Max level
  const currentLevelXP = this.xp % 1000;
  return Math.floor((currentLevelXP / 1000) * 100);
});

// Static method to find or create achievement record
achievementSchema.statics.findOrCreateByLearner = async function (learnerId) {
  let achievement = await this.findOne({ learner: learnerId });

  if (!achievement) {
    achievement = new this({
      learner: learnerId,
      project: {
        completedProjects: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
        projectsAdded: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      social: {
        completedSessions: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
        successfulSessions: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      learnerStats: {
        firstLogin: false,
        streakDays: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
        totalLogins: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      milestone: {
        completedMilestones: {
          basic: 1,
          common: 5,
          rare: 15,
          epic: 25,
          legendary: 40,
          currentCount: 0,
          earnedBadges: [],
        },
      },
    });

    await achievement.save();
  }

  return achievement;
};

// Instance method to add new unlocked achievement
achievementSchema.methods.addUnlockedAchievement = function (
  name,
  category,
  level
) {
  const exists = this.unlocked.find(
    (u) => u.name === name && u.category === category && u.level === level
  );

  if (!exists) {
    this.unlocked.push({
      name,
      category,
      level,
      dateUnlocked: new Date(),
    });
    this.totalBadges = this.unlocked.length;
    this.totalAchievements = this.unlocked.length;
  }

  return !exists; // Returns true if new achievement was added
};

// Instance method to calculate total XP
achievementSchema.methods.calculateTotalXP = function (completedProjects = 0) {
  const badgeXP = {
    basic: 100,
    common: 200,
    rare: 350,
    epic: 500,
    legendary: 1000,
  };

  let totalXP = 0;

  // Add XP for completed projects
  totalXP += completedProjects * 250;

  // Add XP for badges
  this.unlocked.forEach((achievement) => {
    if (badgeXP[achievement.level]) {
      totalXP += badgeXP[achievement.level];
    }
  });

  return Math.min(totalXP, 10000); // Cap at 10,000 XP
};

// Configure JSON output
achievementSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Achievement", achievementSchema);
