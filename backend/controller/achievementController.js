const mongoose = require("mongoose");
const Learner = require("../Model/Learner");
const Project = require("../Model/Project");
const Session = require("../Model/Session");
const Milestone = require("../Model/Milestone");
const Achievement = require("../Model/Achievement");

// Calculate XP from different sources
const calculateXp = {
  projectXp: (completedProjects) => completedProjects * 250, // 250 XP per completed project

  basicXp: (basicBadges) => basicBadges * 100, // 100 XP per basic badge

  commonXp: (commonBadges) => commonBadges * 200, // 200 XP per common badge

  rearXp: (rearBadges) => rearBadges * 350, // 350 XP per rare badge

  epicXp: (epicBadges) => epicBadges * 500, // 500 XP per epic badge

  legendaryXp: (legendaryBadges) => legendaryBadges * 1000, // 1000 XP per legendary badge
};

// Achievement thresholds
const THRESHOLDS = {
  basic: 1,
  common: 5,
  rare: 15,
  epic: 25,
  legendary: 40,
};

// XP and Level constants
const MAX_XP = 10000;
const XP_PER_LEVEL = 1000;
const MAX_LEVEL = 10;

// Get or create achievement record for learner
// Fix 1: Update the getOrCreateAchievement function
const getOrCreateAchievement = async (learnerId) => {
  let achievement = await Achievement.findOne({ learner: learnerId });

  if (!achievement) {
    achievement = new Achievement({
      learner: learnerId,
      project: {
        completedProjects: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
        projectsAdded: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      social: {
        completedSessions: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
        successfulSessions: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      learnerStats: {
        firstLogin: false,
        streakDays: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
        totalLogins: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
      },
      milestone: {
        completedMilestones: {
          basic: THRESHOLDS.basic,
          common: THRESHOLDS.common,
          rare: THRESHOLDS.rare,
          epic: THRESHOLDS.epic,
          legendary: THRESHOLDS.legendary,
          currentCount: 0,
          earnedBadges: [],
        },
      },
    });

    await achievement.save();
  }

  return achievement;
};

// Fix 2: Fix the updateBadgeAchievements function order
const updateBadgeAchievements = (achievementCategory, currentCount) => {
  const newBadges = [];

  // Check each threshold in descending order (highest to lowest)
  if (
    currentCount >= THRESHOLDS.legendary &&
    !achievementCategory.earnedBadges.includes("legendary")
  ) {
    newBadges.push("legendary");
    achievementCategory.earnedBadges.push("legendary");
  }
  if (
    currentCount >= THRESHOLDS.epic &&
    !achievementCategory.earnedBadges.includes("epic")
  ) {
    newBadges.push("epic");
    achievementCategory.earnedBadges.push("epic");
  }
  if (
    currentCount >= THRESHOLDS.rare &&
    !achievementCategory.earnedBadges.includes("rare")
  ) {
    newBadges.push("rare");
    achievementCategory.earnedBadges.push("rare");
  }
  if (
    currentCount >= THRESHOLDS.common &&
    !achievementCategory.earnedBadges.includes("common")
  ) {
    newBadges.push("common");
    achievementCategory.earnedBadges.push("common");
  }
  if (
    currentCount >= THRESHOLDS.basic &&
    !achievementCategory.earnedBadges.includes("basic")
  ) {
    newBadges.push("basic");
    achievementCategory.earnedBadges.push("basic");
  }

  achievementCategory.currentCount = currentCount;
  return newBadges;
};

// Calculate and update learner's daily streak (IST timezone)
const updateDailyStreak = async (learnerId) => {
  const learner = await Learner.findById(learnerId);
  if (!learner) return 0;

  const now = new Date();
  // Convert to IST (UTC + 5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);
  const today = istNow.toDateString();

  const lastLoginIST = learner.lastLoginDate
    ? new Date(new Date(learner.lastLoginDate).getTime() + istOffset)
    : null;
  const lastLoginDate = lastLoginIST ? lastLoginIST.toDateString() : null;

  if (lastLoginDate !== today) {
    // Check if yesterday
    const yesterday = new Date(istNow);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastLoginDate === yesterdayStr) {
      // Continue streak
      learner.streakDays = (learner.streakDays || 0) + 1;
    } else if (lastLoginDate !== today) {
      // Reset streak if not yesterday and not today
      learner.streakDays = 1;
    }

    // Update max streak
    learner.maxStreak = Math.max(learner.maxStreak || 0, learner.streakDays);
    learner.totalLogins = (learner.totalLogins || 0) + 1;
    learner.lastLoginDate = now;

    await learner.save();
  }

  return learner.streakDays || 0;
};

// Main function to recalculate all achievements
const recalculateAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get learner profile
    const learner = await Learner.findOne({ userId }).populate(
      "userId",
      "name avatar"
    );
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;

    // Get or create achievement record
    const achievement = await getOrCreateAchievement(learnerId);

    // Calculate all counts
    const completedProjects = await Project.countDocuments({
      learnerId,
      status: "Completed",
    });

    const projectsAdded = await Project.countDocuments({
      learnerId,
    });

    const completedSessions = await Session.countDocuments({
      learnerId,
      status: "completed",
    });

    const successfulSessions = await Session.countDocuments({
      learnerId,
      status: "completed",
      isLearnerPresent: true,
    });

    const completedMilestones = await Milestone.countDocuments({
      learnerId,
      status: "Completed",
    });

    // Update daily streak
    const currentStreak = await updateDailyStreak(learnerId);

    // Update all achievement categories
    const newBadges = [];

    // Project achievements
    const projectCompletedBadges = updateBadgeAchievements(
      achievement.project.completedProjects,
      completedProjects
    );
    const projectAddedBadges = updateBadgeAchievements(
      achievement.project.projectsAdded,
      projectsAdded
    );

    // Social achievements
    const completedSessionBadges = updateBadgeAchievements(
      achievement.social.completedSessions,
      completedSessions
    );
    const successfulSessionBadges = updateBadgeAchievements(
      achievement.social.successfulSessions,
      successfulSessions
    );

    // Learner achievements
    if (!achievement.learnerStats.firstLogin && learner.totalLogins > 0) {
      achievement.learnerStats.firstLogin = true;
      newBadges.push({
        category: "learnerStats", // Change this
        type: "firstLogin",
        level: "special",
      });
    }

    const streakBadges = updateBadgeAchievements(
      achievement.learnerStats.streakDays,
      currentStreak
    );
    const loginBadges = updateBadgeAchievements(
      achievement.learnerStats.totalLogins,
      learner.totalLogins || 0
    );

    // Milestone achievements
    const milestoneBadges = updateBadgeAchievements(
      achievement.milestone.completedMilestones,
      completedMilestones
    );

    // Collect all new badges
    newBadges.push(
      ...projectCompletedBadges.map((level) => ({
        category: "project",
        type: "completedProjects",
        level,
      })),
      ...projectAddedBadges.map((level) => ({
        category: "project",
        type: "projectsAdded",
        level,
      })),
      ...completedSessionBadges.map((level) => ({
        category: "social",
        type: "completedSessions",
        level,
      })),
      ...successfulSessionBadges.map((level) => ({
        category: "social",
        type: "successfulSessions",
        level,
      })),
      ...streakBadges.map((level) => ({
        category: "learnerStats", // Change from "learner" to "learnerStats"
        type: "streakDays",
        level,
      })),
      ...loginBadges.map((level) => ({
        category: "learnerStats", // Change from "learner" to "learnerStats"
        type: "totalLogins",
        level,
      })),
      ...milestoneBadges.map((level) => ({
        category: "milestone",
        type: "completedMilestones",
        level,
      }))
    );

    // Add new achievements to unlocked array
    for (const badge of newBadges) {
      if (badge.category && badge.type && badge.level) {
        const achievementName = `${badge.type} - ${badge.level}`;

        // Check if already exists
        const exists = achievement.unlocked.find(
          (u) => u.name === achievementName && u.category === badge.category
        );

        if (!exists) {
          achievement.unlocked.push({
            name: achievementName,
            category: badge.category,
            level: badge.level,
            dateUnlocked: new Date(),
          });
        }
      }
    }

    // Calculate total XP
    const totalBadgesByLevel = {
      basic: 0,
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    // Count badges by level
    achievement.unlocked.forEach((unlock) => {
      if (totalBadgesByLevel.hasOwnProperty(unlock.level)) {
        totalBadgesByLevel[unlock.level]++;
      }
    });

    // Calculate XP
    const badgeXp =
      calculateXp.basicXp(totalBadgesByLevel.basic) +
      calculateXp.commonXp(totalBadgesByLevel.common) +
      calculateXp.rearXp(totalBadgesByLevel.rare) +
      calculateXp.epicXp(totalBadgesByLevel.epic) +
      calculateXp.legendaryXp(totalBadgesByLevel.legendary);

    const projectXp = calculateXp.projectXp(completedProjects);

    const totalXp = Math.min(badgeXp + projectXp, MAX_XP);
    const level = Math.min(Math.floor(totalXp / XP_PER_LEVEL), MAX_LEVEL);
    const nextLevelXp = (level + 1) * XP_PER_LEVEL;

    // Update achievement record
    achievement.xp = totalXp;
    achievement.level = level;
    achievement.nextLevelXp = Math.min(nextLevelXp, MAX_XP);
    achievement.totalBadges = achievement.unlocked.length;
    achievement.totalAchievements = achievement.unlocked.length;

    // Update learner record
    learner.xp = totalXp;
    learner.level = level;
    learner.nextLevelXp = Math.min(nextLevelXp, MAX_XP);
    learner.totalAchievement = achievement.unlocked.length;

    // Save both records
    await achievement.save();
    await learner.save();

    res.json({
      success: true,
      data: {
        learner: {
          name: learner.userId.name,
          avatar: learner.userId.avatar,
          level: learner.level,
          xp: learner.xp,
          nextLevelXp: learner.nextLevelXp,
          streakDays: learner.streakDays || 0,
          maxStreak: learner.maxStreak || 0,
          totalLogins: learner.totalLogins || 0,
        },
        achievements: achievement,
        newBadges: newBadges,
        stats: {
          completedProjects,
          projectsAdded,
          completedSessions,
          successfulSessions,
          completedMilestones,
          currentStreak,
          totalBadges: achievement.unlocked.length,
        },
      },
    });
  } catch (error) {
    console.error("Error recalculating achievements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to recalculate achievements",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get achievement summary
const getAchievementSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId }).populate(
      "userId",
      "name avatar"
    );
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const achievement = await Achievement.findOne({ learner: learner._id });

    if (!achievement) {
      // Trigger recalculation if no achievement record exists
      return recalculateAchievements(req, res);
    }

    res.json({
      success: true,
      data: {
        learner: {
          name: learner.userId.name,
          avatar: learner.userId.avatar,
          level: learner.level,
          xp: learner.xp,
          nextLevelXp: learner.nextLevelXp,
          streakDays: learner.streakDays || 0,
          maxStreak: learner.maxStreak || 0,
          totalLogins: learner.totalLogins || 0,
        },
        achievements: achievement,
      },
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Test endpoint to manually update values (for debugging)
const updateTestValues = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, value } = req.body;

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // Handle different test operations
    switch (type) {
      case "addProject":
        // Create a test completed project
        const newProject = new Project({
          name: `Test Project ${Date.now()}`,
          shortDescription: "Test project for achievement testing",
          fullDescription:
            "This is a test project created for achievement testing purposes.",
          techStack: ["JavaScript", "React"],
          category: "Web Development",
          difficultyLevel: "Beginner",
          projectOutcome: "Test outcome",
          motivation: "Test motivation",
          knowledgeLevel: "Some Knowledge",
          learnerId: learner._id,
          openingPrice: 1000,
          status: "Completed",
          startDate: new Date(),
          actualEndDate: new Date(),
          duration: 30, // Add this required field (duration in days)
        });
        await newProject.save();
        break;

      case "addSession":
        // Create a test completed session
        const testSession = new Session({
          learnerId: learner._id,
          mentorId: new mongoose.Types.ObjectId(), // Dummy mentor ID
          projectId: new mongoose.Types.ObjectId(), // Dummy project ID
          title: "Test Session",
          topic: "Test Topic",
          scheduledAt: new Date(),
          status: "completed",
          isLearnerPresent: true,
        });
        await testSession.save();
        break;

      case "addMilestone":
        // Create a test completed milestone
        const testMilestone = new Milestone({
          title: "Test Milestone",
          description: "Test milestone for achievement testing",
          projectId: new mongoose.Types.ObjectId(),
          learnerId: learner._id,
          mentorId: new mongoose.Types.ObjectId(),
          status: "Completed",
          dueDate: new Date(),
          completedDate: new Date(),
          order: 1,
        });
        await testMilestone.save();
        break;

      case "updateStreak":
        learner.streakDays = parseInt(value) || 1;
        learner.maxStreak = Math.max(
          learner.maxStreak || 0,
          learner.streakDays
        );
        await learner.save();
        break;

      case "updateLogins":
        learner.totalLogins = parseInt(value) || 1;
        await learner.save();
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid test type",
        });
    }

    // Recalculate achievements after test update
    return recalculateAchievements(req, res);
  } catch (error) {
    console.error("Error updating test values:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update test values",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getBadgesData = async (req, res) => {
  try {
    console.log("=== GET BADGES DATA DEBUG START ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id;
    console.log("Extracted userId:", userId);

    // Fetch learner profile
    const learner = await Learner.findOne({ userId }).populate(
      "userId",
      "name avatar"
    );
    console.log("Learner profile found:", learner ? learner._id : "Not found");

    if (!learner) {
      console.warn("No learner profile for user:", userId);
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // Get or create achievement data
    const achievement = await getOrCreateAchievement(learner._id);
    console.log(
      "Achievement object fetched/created:",
      JSON.stringify(achievement, null, 2)
    );

    // Define badge categories with metadata
    const badgeCategories = [
      {
        id: "completedProjects",
        category: "project",
        title: "Project Master",
        description: "Complete projects to earn badges",
        icon: "🚀",
        data: achievement.project.completedProjects,
      },
      {
        id: "completedSessions",
        category: "social",
        title: "Session Hero",
        description: "Attend sessions to unlock achievements",
        icon: "📚",
        data: achievement.social.completedSessions,
      },
      {
        id: "streakDays",
        category: "learnerStats",
        title: "Streak Master",
        description: "Maintain daily login streaks",
        icon: "🔥",
        data: achievement.learnerStats.streakDays,
      },
      {
        id: "completedMilestones",
        category: "milestone",
        title: "Milestone Champion",
        description: "Complete project milestones",
        icon: "🎯",
        data: achievement.milestone.completedMilestones,
      },
    ];

    console.log(
      "Badge categories prepared:",
      JSON.stringify(badgeCategories, null, 2)
    );

    // Process badges for each category
    const processedBadges = badgeCategories.map((cat) => {
      console.log(`Processing category: ${cat.id}`);
      console.log("Category raw data:", JSON.stringify(cat.data, null, 2));

      const badges = ["basic", "common", "rare", "epic", "legendary"].map(
        (level) => ({
          level,
          required: cat.data[level],
          current: cat.data.currentCount,
          unlocked: cat.data.earnedBadges.includes(level),
          progress: Math.min(
            (cat.data.currentCount / cat.data[level]) * 100,
            100
          ),
        })
      );

      console.log(
        `Processed badges for ${cat.id}:`,
        JSON.stringify(badges, null, 2)
      );

      return {
        ...cat,
        badges,
        totalUnlocked: cat.data.earnedBadges.length,
        currentProgress: cat.data.currentCount,
      };
    });

    console.log(
      "Processed badges data:",
      JSON.stringify(processedBadges, null, 2)
    );

    res.json({
      success: true,
      data: {
        categories: processedBadges,
        totalBadges: achievement.unlocked.length,
        learnerLevel: learner.level,
        learnerXP: learner.xp,
      },
    });

    console.log("=== GET BADGES DATA DEBUG END ===");
  } catch (error) {
    console.error("Error fetching badge data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch badge data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  recalculateAchievements,
  getAchievementSummary,
  updateTestValues,
  getBadgesData,
};
