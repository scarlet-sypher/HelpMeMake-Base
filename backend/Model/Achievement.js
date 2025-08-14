const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    // Unique Achievement Identifier
    achievementId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return (
          "ACH-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        );
      },
    },

    // Core Achievement Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      required: true,
      trim: true, // emoji or icon identifier
    },

    // Achievement Classification
    category: {
      type: String,
      required: true,
      enum: ["projects", "milestones", "social", "learning"],
    },
    rarity: {
      type: String,
      required: true,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    // Unlock Conditions
    unlockCondition: {
      metric: {
        type: String,
        required: true,
        enum: [
          "projects_completed",
          "milestones_achieved",
          "mentor_connections",
          "sessions_attended",
          "streak_days",
          "profile_completion",
        ],
      },
      requiredCount: {
        type: Number,
        required: true,
        min: 1,
      },
      currentProgress: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // XP & Rewards System
    xpReward: {
      type: Number,
      required: true,
      default: function () {
        const xpValues = {
          common: 100,
          rare: 150,
          epic: 200,
          legendary: 1000,
        };
        return xpValues[this.rarity] || 100;
      },
    },

    // User Association
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["Learner", "Mentor"],
    },

    // Achievement Status
    isAchieved: {
      type: Boolean,
      default: false,
    },
    achievedAt: {
      type: Date,
      default: null,
    },

    // Progress Tracking
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Animation & UI
    animationPlayed: {
      type: Boolean,
      default: false,
    },

    // Display Properties
    displayOrder: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ userId: 1, isAchieved: 1 });
achievementSchema.index({ category: 1, rarity: 1 });

// Virtual for checking if achievement is in progress
achievementSchema.virtual("isInProgress").get(function () {
  return !this.isAchieved && this.unlockCondition.currentProgress > 0;
});

// Pre-save middleware to calculate progress and handle unlocks
achievementSchema.pre("save", function (next) {
  if (
    this.isModified("unlockCondition.currentProgress") ||
    this.isModified("unlockCondition.requiredCount")
  ) {
    this.progressPercentage = Math.min(
      Math.floor(
        (this.unlockCondition.currentProgress /
          this.unlockCondition.requiredCount) *
          100
      ),
      100
    );

    // Check if achievement should be unlocked
    if (
      this.unlockCondition.currentProgress >=
        this.unlockCondition.requiredCount &&
      !this.isAchieved
    ) {
      this.isAchieved = true;
      this.achievedAt = new Date();
    }
  }
  next();
});

// Static method to create category-based achievements for a user
achievementSchema.statics.createCategoryAchievements = async function (
  userId,
  userType
) {
  const achievementTemplates = {
    projects: [
      {
        rarity: "common",
        requiredCount: 5,
        title: "Project Starter",
        description: "Complete your first 5 projects",
        icon: "🚀",
      },
      {
        rarity: "rare",
        requiredCount: 10,
        title: "Project Enthusiast",
        description: "Complete 10 projects and show your dedication",
        icon: "⭐",
      },
      {
        rarity: "epic",
        requiredCount: 20,
        title: "Project Expert",
        description: "Complete 20 projects like a pro",
        icon: "🏆",
      },
      {
        rarity: "legendary",
        requiredCount: 50,
        title: "Project Legend",
        description: "Complete 50 projects and become legendary",
        icon: "👑",
      },
    ],
    milestones: [
      {
        rarity: "common",
        requiredCount: 10,
        title: "Milestone Achiever",
        description: "Reach your first 10 milestones",
        icon: "🎯",
      },
      {
        rarity: "rare",
        requiredCount: 25,
        title: "Milestone Master",
        description: "Achieve 25 milestones consistently",
        icon: "🌟",
      },
      {
        rarity: "epic",
        requiredCount: 50,
        title: "Milestone Champion",
        description: "Reach 50 milestones with excellence",
        icon: "🏅",
      },
      {
        rarity: "legendary",
        requiredCount: 100,
        title: "Milestone Legend",
        description: "Achieve 100 milestones and inspire others",
        icon: "💎",
      },
    ],
    social: [
      {
        rarity: "common",
        requiredCount: 3,
        title: "Social Starter",
        description: "Connect with your first 3 mentors",
        icon: "🤝",
      },
      {
        rarity: "rare",
        requiredCount: 7,
        title: "Network Builder",
        description: "Build connections with 7 mentors",
        icon: "🌐",
      },
      {
        rarity: "epic",
        requiredCount: 15,
        title: "Community Champion",
        description: "Connect with 15 mentors in your network",
        icon: "👥",
      },
      {
        rarity: "legendary",
        requiredCount: 30,
        title: "Network Legend",
        description: "Build an amazing network of 30 mentors",
        icon: "🌈",
      },
    ],
    learning: [
      {
        rarity: "common",
        requiredCount: 5,
        title: "Learning Beginner",
        description: "Attend your first 5 learning sessions",
        icon: "📚",
      },
      {
        rarity: "rare",
        requiredCount: 15,
        title: "Dedicated Learner",
        description: "Attend 15 sessions and show commitment",
        icon: "🎓",
      },
      {
        rarity: "epic",
        requiredCount: 30,
        title: "Learning Expert",
        description: "Complete 30 learning sessions expertly",
        icon: "🧠",
      },
      {
        rarity: "legendary",
        requiredCount: 75,
        title: "Learning Legend",
        description: "Attend 75 sessions and master learning",
        icon: "🔥",
      },
    ],
  };

  const achievements = [];
  let displayOrder = 1;

  for (const [category, templates] of Object.entries(achievementTemplates)) {
    for (const template of templates) {
      const achievement = {
        title: template.title,
        description: template.description,
        icon: template.icon,
        category,
        rarity: template.rarity,
        unlockCondition: {
          metric: `${
            category === "projects"
              ? "projects_completed"
              : category === "milestones"
              ? "milestones_achieved"
              : category === "social"
              ? "mentor_connections"
              : "sessions_attended"
          }`,
          requiredCount: template.requiredCount,
          currentProgress: 0,
        },
        xpReward: {
          common: 100,
          rare: 150,
          epic: 200,
          legendary: 1000,
        }[template.rarity],
        userId,
        userType,
        displayOrder: displayOrder++,
      };
      achievements.push(achievement);
    }
  }

  try {
    return await this.insertMany(achievements);
  } catch (error) {
    throw new Error(`Failed to create category achievements: ${error.message}`);
  }
};

// Static method to update user achievements with batch unlock detection
achievementSchema.statics.updateUserProgress = async function (
  userId,
  progressData
) {
  try {
    const achievements = await this.find({ userId, isAchieved: false });
    const unlockedAchievements = [];
    let highestRarityUnlocked = null;

    for (const achievement of achievements) {
      let newProgress = achievement.unlockCondition.currentProgress;

      // Map progress data to achievement metrics
      switch (achievement.unlockCondition.metric) {
        case "projects_completed":
          newProgress = progressData.completedProjects || 0;
          break;
        case "milestones_achieved":
          newProgress = progressData.milestonesAchieved || 0;
          break;
        case "mentor_connections":
          newProgress = progressData.mentorConnections || 0;
          break;
        case "sessions_attended":
          newProgress = progressData.sessionsAttended || 0;
          break;
        case "streak_days":
          newProgress = progressData.streakDays || 0;
          break;
      }

      if (newProgress > achievement.unlockCondition.currentProgress) {
        achievement.unlockCondition.currentProgress = newProgress;

        // Check if this unlocks the achievement
        if (
          newProgress >= achievement.unlockCondition.requiredCount &&
          !achievement.isAchieved
        ) {
          unlockedAchievements.push(achievement);

          // Track highest rarity for animation
          if (
            !highestRarityUnlocked ||
            getRarityPriority(achievement.rarity) >
              getRarityPriority(highestRarityUnlocked)
          ) {
            highestRarityUnlocked = achievement.rarity;
          }
        }

        await achievement.save();
      }
    }

    return {
      unlockedAchievements,
      highestRarityUnlocked,
      totalXpGained: unlockedAchievements.reduce(
        (sum, a) => sum + a.xpReward,
        0
      ),
    };
  } catch (error) {
    throw new Error(`Failed to update user progress: ${error.message}`);
  }
};

// Helper function for rarity priority
function getRarityPriority(rarity) {
  const priorities = { common: 1, rare: 2, epic: 3, legendary: 4 };
  return priorities[rarity] || 1;
}

// Instance method to get suggested next achievements
achievementSchema.statics.getSuggestedNext = async function (
  userId,
  limit = 3
) {
  return await this.find({
    userId,
    isAchieved: false,
    "unlockCondition.currentProgress": { $gt: 0 },
  })
    .sort({ progressPercentage: -1 })
    .limit(limit);
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
