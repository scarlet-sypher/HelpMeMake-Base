const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Project = require("../Model/Project");
const Session = require("../Model/Session");
const mongoose = require("mongoose");

const getLearnerDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Processing dashboard for userId:", userId);

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
      learner = new Learner({ userId });
      await learner.save();
      console.log("Created new learner profile");
    }

    const previousValues = {
      userActiveProjects: learner.userActiveProjects || 0,
      userSessionsScheduled: learner.userSessionsScheduled || 0,
      userTotalProjects: learner.userTotalProjects || 0,
      userCompletionRate: learner.userCompletionRate || 0,
    };
    console.log("Previous values:", previousValues);

    const stats = await calculateLearnerStats(userId);
    console.log("Calculated stats:", stats);

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

    const updateData = {
      completedSessions: stats.completedSessions,
      rating: stats.rating,
      userActiveProjects: stats.userActiveProjects,
      userSessionsScheduled: stats.userSessionsScheduled,
      userTotalProjects: stats.userTotalProjects,
      userCompletionRate: stats.userCompletionRate,

      userActiveProjectsChange: changes.userActiveProjectsChange,
      userSessionsScheduledChange: changes.userSessionsScheduledChange,
      userTotalProjectsChange: changes.userTotalProjectsChange,
      userCompletionRateChange: changes.userCompletionRateChange,

      updatedAt: new Date(),
    };

    console.log("Update data being saved:", updateData);

    const updatedLearner = await Learner.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      {
        new: true,
        upsert: false,
        runValidators: true,
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

    const streakUpdated = updatedLearner.updateDailyStreak();
    if (streakUpdated) {
      await updatedLearner.save();
      console.log("Updated daily streak");
    }

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

    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const learner = await Learner.findOne({ userId: userObjectId });
    const learnerId = learner ? learner._id : null;

    console.log("Found learner profile:", !!learner);
    console.log("Learner ID:", learnerId);

    let completedSessions = 0;
    try {
      const sessionsWithUserId = await Session.countDocuments({
        userId: userObjectId,
        status: "completed",
      });

      const sessionsWithLearnerId = learnerId
        ? await Session.countDocuments({
            learnerId: learnerId,
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

    let rating = 0;
    try {
      const projectsWithUserId = await Project.find({
        userId: userObjectId,
        status: "Completed",
        "mentorReview.rating": { $exists: true },
      });

      const projectsWithLearnerId = learnerId
        ? await Project.find({
            learnerId: learnerId,
            status: "Completed",
            "mentorReview.rating": { $exists: true },
          })
        : [];

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
