const User = require("../Model/User");
const Mentor = require("../Model/Mentor");
const Project = require("../Model/Project");
const Session = require("../Model/Session");
const mongoose = require("mongoose");

const getMentorDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Processing mentor dashboard for userId:", userId);

    // Find the user and their mentor profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let mentor = await Mentor.findOne({ userId });
    console.log("Found mentor:", mentor ? "Yes" : "No");

    if (!mentor) {
      // Create mentor profile if it doesn't exist
      mentor = new Mentor({ userId });
      await mentor.save();
      console.log("Created new mentor profile");
    }

    // Store previous values for change calculation
    const previousValues = {
      mentorActiveStudents: mentor.mentorActiveStudents || 0,
      mentorSessionsCompleted: mentor.mentorSessionsCompleted || 0,
      mentorTotalEarnings: mentor.mentorTotalEarnings || 0,
      mentorSatisfactionRate: mentor.mentorSatisfactionRate || 0,
      mentorSessionsScheduled: mentor.mentorSessionsScheduled || 0,
    };
    console.log("Previous values:", previousValues);

    // Calculate REAL stats using USER ID (not mentor ID)
    const stats = await calculateMentorStats(userId); // Using userId consistently
    console.log("Calculated stats:", stats);

    // Calculate changes
    const changes = {
      mentorActiveStudentsChange:
        stats.mentorActiveStudents - previousValues.mentorActiveStudents,
      mentorSessionsCompletedChange:
        stats.mentorSessionsCompleted - previousValues.mentorSessionsCompleted,
      mentorTotalEarningsChange:
        Math.round(
          (stats.mentorTotalEarnings - previousValues.mentorTotalEarnings) * 100
        ) / 100,
      mentorSatisfactionRateChange:
        Math.round(
          (stats.mentorSatisfactionRate -
            previousValues.mentorSatisfactionRate) *
            100
        ) / 100,
    };
    console.log("Calculated changes:", changes);

    // Prepare update data - only include fields that exist in Mentor schema
    const updateData = {
      // Core stats
      mentorActiveStudents: stats.mentorActiveStudents,
      mentorSessionsCompleted: stats.mentorSessionsCompleted,
      mentorTotalEarnings: stats.mentorTotalEarnings,
      mentorSatisfactionRate: stats.mentorSatisfactionRate,
      mentorSessionsScheduled: stats.mentorSessionsScheduled,
      responseTime: stats.responseTime,
      totalStudents: stats.totalStudents,
      completedSessions: stats.completedSessions,
      rating: stats.rating,

      // Changes
      mentorActiveStudentsChange: changes.mentorActiveStudentsChange,
      mentorSessionsCompletedChange: changes.mentorSessionsCompletedChange,
      mentorTotalEarningsChange: changes.mentorTotalEarningsChange,
      mentorSatisfactionRateChange: changes.mentorSatisfactionRateChange,

      // Update timestamp
      updatedAt: new Date(),
    };

    console.log("Update data being saved:", updateData);

    // Update mentor profile with explicit error handling
    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: userId }, // Use userId to find the mentor
      { $set: updateData }, // Use $set operator explicitly
      {
        new: true,
        upsert: false, // Don't create new, we already have one
        runValidators: true, // Run schema validations
      }
    );

    if (!updatedMentor) {
      console.error("Failed to update mentor profile");
      return res.status(500).json({
        success: false,
        message: "Failed to update mentor profile",
      });
    }

    console.log("Successfully updated mentor profile");
    console.log("Updated mentor stats:", {
      mentorActiveStudents: updatedMentor.mentorActiveStudents,
      mentorSessionsCompleted: updatedMentor.mentorSessionsCompleted,
      mentorTotalEarnings: updatedMentor.mentorTotalEarnings,
      mentorSatisfactionRate: updatedMentor.mentorSatisfactionRate,
    });

    // Calculate and update profile completeness
    const profileCompleteness = updatedMentor.calculateProfileCompleteness();
    if (profileCompleteness !== updatedMentor.profileCompleteness) {
      updatedMentor.profileCompleteness = profileCompleteness;
      await updatedMentor.save();
      console.log("Updated profile completeness:", profileCompleteness);
    }

    // Prepare response data
    const responseData = {
      ...user.toObject(),
      ...updatedMentor.toObject(),
    };

    res.status(200).json({
      success: true,
      message: "Mentor dashboard data retrieved successfully",
      user: responseData,
    });
  } catch (error) {
    console.error("Error fetching mentor dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const calculateMentorStats = async (userId) => {
  try {
    console.log("Calculating mentor stats for userId:", userId);

    // Convert userId to ObjectId if it's a string
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // First, get the mentor profile to get the mentorId
    const mentor = await Mentor.findOne({ userId: userObjectId });
    const mentorId = mentor ? mentor._id : null;

    console.log("Found mentor profile:", !!mentor);
    console.log("Mentor ID:", mentorId);

    // 1. mentorActiveStudents: Count active projects
    let mentorActiveStudents = 0;
    try {
      // Try both userId and mentorId to see which one works
      const activeWithUserId = await Project.countDocuments({
        mentorId: userObjectId, // If Project model uses userId as mentorId
        status: { $in: ["In Progress", "Open"] },
      });

      const activeWithMentorProfileId = mentorId
        ? await Project.countDocuments({
            mentorId: mentorId, // If Project model references Mentor profile
            status: { $in: ["In Progress", "Open"] },
          })
        : 0;

      mentorActiveStudents = Math.max(
        activeWithUserId,
        activeWithMentorProfileId
      );
      console.log("Active students with userId:", activeWithUserId);
      console.log("Active students with mentorId:", activeWithMentorProfileId);
      console.log("Using active students:", mentorActiveStudents);
    } catch (error) {
      console.error("Error counting active students:", error);
      mentorActiveStudents = 0;
    }

    // 2. mentorSessionsCompleted: Count completed sessions
    let mentorSessionsCompleted = 0;
    try {
      const completedWithUserId = await Session.countDocuments({
        mentorId: userObjectId,
        status: "completed",
      });

      const completedWithMentorProfileId = mentorId
        ? await Session.countDocuments({
            mentorId: mentorId,
            status: "completed",
          })
        : 0;

      mentorSessionsCompleted = Math.max(
        completedWithUserId,
        completedWithMentorProfileId
      );
      console.log("Completed sessions with userId:", completedWithUserId);
      console.log(
        "Completed sessions with mentorId:",
        completedWithMentorProfileId
      );
      console.log("Using completed sessions:", mentorSessionsCompleted);
    } catch (error) {
      console.error("Error counting completed sessions:", error);
      mentorSessionsCompleted = 0;
    }

    // 3. mentorTotalEarnings: Sum of closingPrice of completed projects
    let mentorTotalEarnings = 0;
    try {
      // Try both approaches
      const earningsWithUserId = await Project.find({
        mentorId: userObjectId,
        status: "Completed",
        closingPrice: { $exists: true, $ne: null },
      });

      const earningsWithMentorProfileId = mentorId
        ? await Project.find({
            mentorId: mentorId,
            status: "Completed",
            closingPrice: { $exists: true, $ne: null },
          })
        : [];

      // Use whichever gives more results
      const completedProjectsWithEarnings =
        earningsWithUserId.length > 0
          ? earningsWithUserId
          : earningsWithMentorProfileId;

      mentorTotalEarnings = completedProjectsWithEarnings.reduce(
        (total, project) => {
          return total + (project.closingPrice || 0);
        },
        0
      );

      console.log(
        "Projects with earnings:",
        completedProjectsWithEarnings.length
      );
      console.log("Total earnings:", mentorTotalEarnings);
    } catch (error) {
      console.error("Error calculating total earnings:", error);
      mentorTotalEarnings = 0;
    }

    // 4. mentorSatisfactionRate: Convert average rating (out of 5) → percentage
    let mentorSatisfactionRate = 0;
    let rating = 0;
    try {
      // Try both approaches for completed projects with ratings
      const ratedWithUserId = await Project.find({
        mentorId: userObjectId,
        status: "Completed",
        "learnerReview.rating": { $exists: true },
      });

      const ratedWithMentorProfileId = mentorId
        ? await Project.find({
            mentorId: mentorId,
            status: "Completed",
            "learnerReview.rating": { $exists: true },
          })
        : [];

      // Use whichever gives more results
      const completedProjectsWithRating =
        ratedWithUserId.length > 0 ? ratedWithUserId : ratedWithMentorProfileId;

      let totalRating = 0;
      let ratingCount = 0;

      completedProjectsWithRating.forEach((project) => {
        if (project.learnerReview && project.learnerReview.rating) {
          totalRating += project.learnerReview.rating;
          ratingCount++;
        }
      });

      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
      mentorSatisfactionRate =
        Math.round((averageRating / 5) * 100 * 100) / 100;
      rating = ratingCount > 0 ? Math.round(averageRating * 100) / 100 : 0;

      console.log("Projects with ratings:", ratingCount);
      console.log("Average rating:", averageRating);
      console.log("Satisfaction rate:", mentorSatisfactionRate);
    } catch (error) {
      console.error("Error calculating satisfaction rate:", error);
      mentorSatisfactionRate = 0;
      rating = 0;
    }

    // 5. mentorSessionsScheduled: Count scheduled sessions
    let mentorSessionsScheduled = 0;
    try {
      const scheduledWithUserId = await Session.countDocuments({
        mentorId: userObjectId,
        status: "scheduled",
      });

      const scheduledWithMentorProfileId = mentorId
        ? await Session.countDocuments({
            mentorId: mentorId,
            status: "scheduled",
          })
        : 0;

      mentorSessionsScheduled = Math.max(
        scheduledWithUserId,
        scheduledWithMentorProfileId
      );
      console.log("Scheduled sessions with userId:", scheduledWithUserId);
      console.log(
        "Scheduled sessions with mentorId:",
        scheduledWithMentorProfileId
      );
      console.log("Using scheduled sessions:", mentorSessionsScheduled);
    } catch (error) {
      console.error("Error counting scheduled sessions:", error);
      mentorSessionsScheduled = 0;
    }

    // 6. responseTime: Calculate average response time
    let responseTime = 30; // Default 30 minutes
    try {
      // Try both approaches
      const projectsWithUserId = await Project.find({
        mentorId: userObjectId,
        createdAt: { $exists: true },
        startDate: { $exists: true },
      })
        .sort({ startDate: -1 })
        .limit(10);

      const projectsWithMentorProfileId = mentorId
        ? await Project.find({
            mentorId: mentorId,
            createdAt: { $exists: true },
            startDate: { $exists: true },
          })
            .sort({ startDate: -1 })
            .limit(10)
        : [];

      // Use whichever gives more results
      const allProjects =
        projectsWithUserId.length > 0
          ? projectsWithUserId
          : projectsWithMentorProfileId;

      let totalResponseTime = 0;
      let responseCount = 0;

      allProjects.forEach((project) => {
        if (project.createdAt && project.startDate) {
          const responseTimeHours =
            Math.abs(
              new Date(project.startDate) - new Date(project.createdAt)
            ) /
            (1000 * 60 * 60);
          if (responseTimeHours < 168) {
            // Only count if less than a week
            totalResponseTime += responseTimeHours;
            responseCount++;
          }
        }
      });

      responseTime =
        responseCount > 0
          ? Math.round((totalResponseTime / responseCount) * 60) // Convert to minutes
          : 30; // Default 30 minutes

      responseTime = Math.max(responseTime, 1); // Minimum 1 minute
      console.log("Average response time (minutes):", responseTime);
    } catch (error) {
      console.error("Error calculating response time:", error);
      responseTime = 30;
    }

    // 7. totalStudents: Count unique learners in mentor's projects
    let totalStudents = 0;
    try {
      // Try both approaches
      const studentsWithUserId = await Project.aggregate([
        { $match: { mentorId: userObjectId } },
        { $group: { _id: "$learnerId" } },
        { $count: "totalStudents" },
      ]);

      let studentsWithMentorProfileId = [];
      if (mentorId) {
        studentsWithMentorProfileId = await Project.aggregate([
          { $match: { mentorId: mentorId } },
          { $group: { _id: "$learnerId" } },
          { $count: "totalStudents" },
        ]);
      }

      const userIdCount =
        studentsWithUserId.length > 0 ? studentsWithUserId[0].totalStudents : 0;
      const mentorIdCount =
        studentsWithMentorProfileId.length > 0
          ? studentsWithMentorProfileId[0].totalStudents
          : 0;

      totalStudents = Math.max(userIdCount, mentorIdCount);
      console.log("Total unique students with userId:", userIdCount);
      console.log("Total unique students with mentorId:", mentorIdCount);
      console.log("Using total students:", totalStudents);
    } catch (error) {
      console.error("Error counting total students:", error);
      totalStudents = 0;
    }

    // 8. completedSessions: Same as mentorSessionsCompleted
    const completedSessions = mentorSessionsCompleted;

    const finalStats = {
      mentorActiveStudents,
      mentorSessionsCompleted,
      mentorTotalEarnings: Math.round(mentorTotalEarnings * 100) / 100,
      mentorSatisfactionRate,
      mentorSessionsScheduled,
      responseTime,
      totalStudents,
      completedSessions,
      rating,
    };

    console.log("Final calculated mentor stats:", finalStats);

    return finalStats;
  } catch (error) {
    console.error("Error calculating mentor stats:", error);
    // Return default values instead of throwing
    return {
      mentorActiveStudents: 0,
      mentorSessionsCompleted: 0,
      mentorTotalEarnings: 0,
      mentorSatisfactionRate: 0,
      mentorSessionsScheduled: 0,
      responseTime: 30,
      totalStudents: 0,
      completedSessions: 0,
      rating: 0,
    };
  }
};

module.exports = {
  getMentorDashboardData,
  calculateMentorStats,
};
