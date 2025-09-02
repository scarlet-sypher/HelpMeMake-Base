const mongoose = require("mongoose");

const achievementLevelSchema = new mongoose.Schema(
  {
    basic: { type: Number, default: 1 },
    common: { type: Number, default: 5 },
    rare: { type: Number, default: 15 },
    epic: { type: Number, default: 25 },
    legendary: { type: Number, default: 40 },
    currentCount: { type: Number, default: 0 },
    earnedBadges: { type: [String], default: [] },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
      unique: true,
    },

    xp: { type: Number, default: 0, required: true },
    level: { type: Number, default: 0, required: true },
    nextLevelXp: { type: Number, default: 1000, required: true },

    project: {
      completedProjects: achievementLevelSchema,
      projectsAdded: achievementLevelSchema,
    },

    social: {
      completedSessions: achievementLevelSchema,
      successfulSessions: achievementLevelSchema,
    },

    learnerStats: {
      firstLogin: { type: Boolean, default: false },
      streakDays: achievementLevelSchema,
      totalLogins: achievementLevelSchema,
    },

    milestone: {
      completedMilestones: achievementLevelSchema,
    },

    unlocked: [
      {
        name: { type: String, required: true },
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

achievementSchema.index({ level: 1 });
achievementSchema.index({ xp: -1 });
achievementSchema.index({ "unlocked.category": 1 });
achievementSchema.index({ "unlocked.level": 1 });
achievementSchema.index({ "unlocked.dateUnlocked": -1 });

achievementSchema.virtual("progressPercentage").get(function () {
  if (this.level >= 10) return 100;
  const currentLevelXP = this.xp % 1000;
  return Math.floor((currentLevelXP / 1000) * 100);
});

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

  return !exists;
};

achievementSchema.methods.calculateTotalXP = function (completedProjects = 0) {
  const badgeXP = {
    basic: 100,
    common: 200,
    rare: 350,
    epic: 500,
    legendary: 1000,
  };

  let totalXP = 0;

  totalXP += completedProjects * 250;

  this.unlocked.forEach((achievement) => {
    if (badgeXP[achievement.level]) {
      totalXP += badgeXP[achievement.level];
    }
  });

  return Math.min(totalXP, 10000);
};

achievementSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Achievement", achievementSchema);
