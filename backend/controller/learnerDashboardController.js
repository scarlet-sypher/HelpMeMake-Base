const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Project = require("../Model/Project");
const Session = require("../Model/Session");
const mongoose = require("mongoose");

const getLearnerDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Processing dashboard for userId:", userId);

    // Find the user and their learner profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let learner = await Learner.findOne({ userId });
    console.log("Found learner:", learner ? "Yes" : "No");

    if (!learner) {
      // Create learner profile if it doesn't exist
      learner = new Learner({ userId });
      await learner.save();
      console.log("Created new learner profile");
    }

    // Store previous values for change calculation
    const previousValues = {
      userActiveProjects: learner.userActiveProjects || 0,
      userSessionsScheduled: learner.userSessionsScheduled || 0,
      userTotalProjects: learner.userTotalProjects || 0,
      userCompletionRate: learner.userCompletionRate || 0,
    };
    console.log("Previous values:", previousValues);

    // Calculate REAL stats using USER ID (not learner ID)
    const stats = await calculateLearnerStats(userId); // Changed from learner._id to userId
    console.log("Calculated stats:", stats);

    // Calculate changes
    const changes = {
      userActiveProjectsChange:
        stats.userActiveProjects - previousValues.userActiveProjects,
      userSessionsScheduledChange:
        stats.userSessionsScheduled - previousValues.userSessionsScheduled,
      userTotalProjectsChange:
        stats.userTotalProjects - previousValues.userTotalProjects,
      userCompletionRateChange:
        Math.round(
          (stats.userCompletionRate - previousValues.userCompletionRate) * 100
        ) / 100,
    };
    console.log("Calculated changes:", changes);

    // Prepare update data - only include fields that exist in Learner schema
    const updateData = {
      // Core stats
      completedSessions: stats.completedSessions,
      rating: stats.rating,
      userActiveProjects: stats.userActiveProjects,
      userSessionsScheduled: stats.userSessionsScheduled,
      userTotalProjects: stats.userTotalProjects,
      userCompletionRate: stats.userCompletionRate,

      // Changes
      userActiveProjectsChange: changes.userActiveProjectsChange,
      userSessionsScheduledChange: changes.userSessionsScheduledChange,
      userTotalProjectsChange: changes.userTotalProjectsChange,
      userCompletionRateChange: changes.userCompletionRateChange,

      // Update timestamp
      updatedAt: new Date(),
    };

    console.log("Update data being saved:", updateData);

    // Update learner profile with explicit error handling
    const updatedLearner = await Learner.findOneAndUpdate(
      { userId: userId }, // Use userId to find the learner
      { $set: updateData }, // Use $set operator explicitly
      {
        new: true,
        upsert: false, // Don't create new, we already have one
        runValidators: true, // Run schema validations
      }
    );

    if (!updatedLearner) {
      console.error("Failed to update learner profile");
      return res.status(500).json({
        success: false,
        message: "Failed to update learner profile",
      });
    }

    console.log("Successfully updated learner profile");
    console.log("Updated learner stats:", {
      userActiveProjects: updatedLearner.userActiveProjects,
      userSessionsScheduled: updatedLearner.userSessionsScheduled,
      userTotalProjects: updatedLearner.userTotalProjects,
      userCompletionRate: updatedLearner.userCompletionRate,
    });

    // Update daily streak
    const streakUpdated = updatedLearner.updateDailyStreak();
    if (streakUpdated) {
      await updatedLearner.save();
      console.log("Updated daily streak");
    }

    // Prepare response data
    const responseData = {
      ...user.toObject(),
      ...updatedLearner.toObject(),
    };

    res.status(200).json({
      success: true,
      message: "Learner dashboard data retrieved successfully",
      user: responseData,
    });
  } catch (error) {
    console.error("Error fetching learner dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const calculateLearnerStats = async (userId) => {
  try {
    console.log("Calculating stats for userId:", userId);

    // Convert userId to ObjectId if it's a string
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // First, get the learner profile to get the learnerId
    const learner = await Learner.findOne({ userId: userObjectId });
    const learnerId = learner ? learner._id : null;

    console.log("Found learner profile:", !!learner);
    console.log("Learner ID:", learnerId);

    // Option 1: If your Project/Session models use userId (User reference)
    // Use this approach if your models reference the User collection

    // 1. completedSessions: Count all completed sessions using User ID
    let completedSessions = 0;
    try {
      // Try both userId and learnerId to see which one works
      const sessionsWithUserId = await Session.countDocuments({
        userId: userObjectId, // If Session model references User
        status: "completed",
      });

      const sessionsWithLearnerId = learnerId
        ? await Session.countDocuments({
            learnerId: learnerId, // If Session model references Learner
            status: "completed",
          })
        : 0;

      completedSessions = Math.max(sessionsWithUserId, sessionsWithLearnerId);
      console.log("Sessions with userId:", sessionsWithUserId);
      console.log("Sessions with learnerId:", sessionsWithLearnerId);
      console.log("Using completed sessions:", completedSessions);
    } catch (error) {
      console.error("Error counting sessions:", error);
      completedSessions = 0;
    }

    // 2. rating: Average rating from completed projects
    let rating = 0;
    try {
      // Try both approaches
      const projectsWithUserId = await Project.find({
        userId: userObjectId, // If Project model references User
        status: "Completed",
        "mentorReview.rating": { $exists: true },
      });

      const projectsWithLearnerId = learnerId
        ? await Project.find({
            learnerId: learnerId, // If Project model references Learner
            status: "Completed",
            "mentorReview.rating": { $exists: true },
          })
        : [];

      // Use whichever gives more results
      const completedProjects =
        projectsWithUserId.length > 0
          ? projectsWithUserId
          : projectsWithLearnerId;

      let totalRating = 0;
      let ratingCount = 0;

      completedProjects.forEach((project) => {
        if (project.mentorReview && project.mentorReview.rating) {
          totalRating += project.mentorReview.rating;
          ratingCount++;
        }
      });

      rating =
        ratingCount > 0
          ? Math.round((totalRating / ratingCount) * 100) / 100
          : 0;
      console.log("Rating calculated from", ratingCount, "projects:", rating);
    } catch (error) {
      console.error("Error calculating rating:", error);
      rating = 0;
    }

    // 3. userActiveProjects: Count open projects
    let userActiveProjects = 0;
    try {
      const activeWithUserId = await Project.countDocuments({
        userId: userObjectId,
        status: { $in: ["Open", "In Progress"] },
      });

      const activeWithLearnerId = learnerId
        ? await Project.countDocuments({
            learnerId: learnerId,
            status: { $in: ["Open", "In Progress"] },
          })
        : 0;

      userActiveProjects = Math.max(activeWithUserId, activeWithLearnerId);
      console.log("Active projects with userId:", activeWithUserId);
      console.log("Active projects with learnerId:", activeWithLearnerId);
      console.log("Using active projects:", userActiveProjects);
    } catch (error) {
      console.error("Error counting active projects:", error);
      userActiveProjects = 0;
    }

    // 4. userSessionsScheduled: Count scheduled sessions
    let userSessionsScheduled = 0;
    try {
      const scheduledWithUserId = await Session.countDocuments({
        userId: userObjectId,
        status: "scheduled",
      });

      const scheduledWithLearnerId = learnerId
        ? await Session.countDocuments({
            learnerId: learnerId,
            status: "scheduled",
          })
        : 0;

      userSessionsScheduled = Math.max(
        scheduledWithUserId,
        scheduledWithLearnerId
      );
      console.log("Scheduled sessions with userId:", scheduledWithUserId);
      console.log("Scheduled sessions with learnerId:", scheduledWithLearnerId);
      console.log("Using scheduled sessions:", userSessionsScheduled);
    } catch (error) {
      console.error("Error counting scheduled sessions:", error);
      userSessionsScheduled = 0;
    }

    // 5. userTotalProjects: Count all projects
    let userTotalProjects = 0;
    try {
      const totalWithUserId = await Project.countDocuments({
        userId: userObjectId,
      });

      const totalWithLearnerId = learnerId
        ? await Project.countDocuments({
            learnerId: learnerId,
          })
        : 0;

      userTotalProjects = Math.max(totalWithUserId, totalWithLearnerId);
      console.log("Total projects with userId:", totalWithUserId);
      console.log("Total projects with learnerId:", totalWithLearnerId);
      console.log("Using total projects:", userTotalProjects);
    } catch (error) {
      console.error("Error counting total projects:", error);
      userTotalProjects = 0;
    }

    // 6. userCompletionRate: (completed projects / total projects) * 100
    let userCompletionRate = 0;
    try {
      const completedWithUserId = await Project.countDocuments({
        userId: userObjectId,
        status: "Completed",
      });

      const completedWithLearnerId = learnerId
        ? await Project.countDocuments({
            learnerId: learnerId,
            status: "Completed",
          })
        : 0;

      const completedProjectsCount = Math.max(
        completedWithUserId,
        completedWithLearnerId
      );

      userCompletionRate =
        userTotalProjects > 0
          ? Math.round(
              (completedProjectsCount / userTotalProjects) * 100 * 100
            ) / 100
          : 0;

      console.log("Completed projects:", completedProjectsCount);
      console.log("Completion rate:", userCompletionRate);
    } catch (error) {
      console.error("Error calculating completion rate:", error);
      userCompletionRate = 0;
    }

    const finalStats = {
      completedSessions,
      rating,
      userActiveProjects,
      userSessionsScheduled,
      userTotalProjects,
      userCompletionRate,
    };

    console.log("Final calculated stats:", finalStats);

    return finalStats;
  } catch (error) {
    console.error("Error calculating learner stats:", error);
    // Return default values instead of throwing
    return {
      completedSessions: 0,
      rating: 0,
      userActiveProjects: 0,
      userSessionsScheduled: 0,
      userTotalProjects: 0,
      userCompletionRate: 0,
    };
  }
};

module.exports = {
  getLearnerDashboardData,
  calculateLearnerStats,
};
