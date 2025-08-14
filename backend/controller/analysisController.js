const mongoose = require("mongoose");
const Project = require("../Model/Project");
const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const Session = require("../Model/Session");
const Milestone = require("../Model/Milestone");
const Learner = require("../Model/Learner");

// Get comprehensive analytics for the logged-in mentor
const getMentorAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // First, get the mentor profile to get mentorId
    const mentor = await Mentor.findOne({ userId }).populate(
      "userId",
      "name email avatar"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;
    const userInfo = mentor.userId;

    // Get all projects assigned to this mentor
    const allProjects = await Project.find({ mentorId })
      .populate("learnerId", "userId")
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      });

    // Project statistics
    const totalProjects = allProjects.length;
    const completedProjects = allProjects.filter(
      (p) => p.status === "Completed"
    ).length;
    const ongoingProjects = allProjects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const cancelledProjects = allProjects.filter(
      (p) => p.status === "Cancelled"
    ).length;
    const openProjects = allProjects.filter((p) => p.status === "Open").length;

    // Earnings calculation
    const totalEarnings = allProjects.reduce((sum, project) => {
      const price =
        project.closingPrice ||
        project.negotiatedPrice ||
        project.openingPrice ||
        0;
      return sum + price;
    }, 0);

    const completedProjectsEarnings = allProjects
      .filter((p) => p.status === "Completed")
      .reduce((sum, project) => {
        const price =
          project.closingPrice ||
          project.negotiatedPrice ||
          project.openingPrice ||
          0;
        return sum + price;
      }, 0);

    // Average completion time calculation
    const completedProjectsWithDates = allProjects.filter(
      (p) => p.status === "Completed" && p.startDate && p.actualEndDate
    );

    let averageCompletionDays = 0;
    if (completedProjectsWithDates.length > 0) {
      const totalDays = completedProjectsWithDates.reduce((sum, project) => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.actualEndDate);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      averageCompletionDays = Math.round(
        totalDays / completedProjectsWithDates.length
      );
    }

    // Top learners by project count
    const learnerProjectCounts = {};
    allProjects.forEach((project) => {
      if (project.learnerId && project.learnerId.userId) {
        const learnerId = project.learnerId.userId._id.toString();
        const learnerInfo = project.learnerId.userId;

        if (!learnerProjectCounts[learnerId]) {
          learnerProjectCounts[learnerId] = {
            learner: learnerInfo,
            totalProjects: 0,
            completedProjects: 0,
          };
        }

        learnerProjectCounts[learnerId].totalProjects++;
        if (project.status === "Completed") {
          learnerProjectCounts[learnerId].completedProjects++;
        }
      }
    });

    const topLearners = Object.values(learnerProjectCounts)
      .sort((a, b) => b.totalProjects - a.totalProjects)
      .slice(0, 5); // Top 5 learners

    // Session statistics
    const allSessions = await Session.find({ mentorId });
    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(
      (s) => s.status === "completed"
    ).length;
    const upcomingSessions = allSessions.filter(
      (s) => s.status === "scheduled" && new Date(s.scheduledAt) > new Date()
    ).length;

    // Milestone statistics
    const allMilestones = await Milestone.find({ mentorId });
    const totalMilestones = allMilestones.length;
    const completedMilestones = allMilestones.filter(
      (m) => m.isFullyCompleted
    ).length;
    const pendingMilestones = allMilestones.filter(
      (m) =>
        m.learnerVerification.isVerified && !m.mentorVerification.isVerified
    ).length;

    // Monthly project completion trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthlyCompleted = allProjects.filter(
        (p) =>
          p.status === "Completed" &&
          p.actualEndDate &&
          new Date(p.actualEndDate) >= monthStart &&
          new Date(p.actualEndDate) <= monthEnd
      ).length;

      monthlyTrend.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        completed: monthlyCompleted,
      });
    }

    // Rating statistics
    const projectsWithRatings = allProjects.filter(
      (p) => p.learnerReview && p.learnerReview.rating
    );
    const averageRating =
      projectsWithRatings.length > 0
        ? projectsWithRatings.reduce(
            (sum, p) => sum + p.learnerReview.rating,
            0
          ) / projectsWithRatings.length
        : mentor.rating || 0;

    // Success rate (completed vs total projects)
    const successRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Response time (from mentor profile)
    const responseTime = mentor.responseTime || 30;

    // Project distribution for charts
    const projectDistribution = {
      completed: completedProjects,
      ongoing: ongoingProjects,
      cancelled: cancelledProjects,
      open: openProjects,
    };

    // Recent activity (last 10 projects)
    const recentProjects = allProjects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map((project) => ({
        id: project._id,
        name: project.name,
        status: project.status,
        learnerName: project.learnerId?.userId?.name || "Unknown",
        updatedAt: project.updatedAt,
        progressPercentage: project.progressPercentage || 0,
      }));

    res.json({
      success: true,
      data: {
        mentor: {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.avatar,
          title: mentor.title,
          rating: averageRating.toFixed(1),
          totalReviews: mentor.totalReviews,
          joinDate: mentor.joinDate,
        },
        overview: {
          totalProjects,
          completedProjects,
          ongoingProjects,
          cancelledProjects,
          openProjects,
          totalEarnings,
          completedProjectsEarnings,
          averageCompletionDays,
          successRate,
          averageRating: averageRating.toFixed(1),
          responseTime,
        },
        sessions: {
          totalSessions,
          completedSessions,
          upcomingSessions,
        },
        milestones: {
          totalMilestones,
          completedMilestones,
          pendingMilestones,
        },
        topLearners,
        projectDistribution,
        monthlyTrend,
        recentProjects,
      },
    });
  } catch (error) {
    console.error("Error fetching mentor analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get detailed project analytics
const getProjectAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;

    // Get projects with detailed analytics
    const projects = await Project.find({ mentorId })
      .populate("learnerId", "userId")
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ updatedAt: -1 });

    const projectAnalytics = projects.map((project) => {
      const milestoneCount = project.milestones ? project.milestones.length : 0;
      const earnings =
        project.closingPrice ||
        project.negotiatedPrice ||
        project.openingPrice ||
        0;

      let duration = null;
      if (project.startDate && project.actualEndDate) {
        const diffTime = Math.abs(
          new Date(project.actualEndDate) - new Date(project.startDate)
        );
        duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        id: project._id,
        name: project.name,
        status: project.status,
        category: project.category,
        difficultyLevel: project.difficultyLevel,
        progressPercentage: project.progressPercentage || 0,
        learner: {
          name: project.learnerId?.userId?.name || "Unknown",
          avatar:
            project.learnerId?.userId?.avatar || "/uploads/public/default.jpg",
        },
        milestoneCount,
        earnings,
        duration,
        startDate: project.startDate,
        expectedEndDate: project.expectedEndDate,
        actualEndDate: project.actualEndDate,
        rating: project.learnerReview?.rating || null,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });

    res.json({
      success: true,
      data: projectAnalytics,
    });
  } catch (error) {
    console.error("Error fetching project analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project analytics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get comprehensive analytics for the logged-in learner
const getLearnerAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // First, get the learner profile to get learnerId
    const learner = await Learner.findOne({ userId }).populate(
      "userId",
      "name email avatar"
    );

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;
    const userInfo = learner.userId;

    // Get all projects for this learner
    const allProjects = await Project.find({ learnerId })
      .populate("mentorId", "userId")
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      });

    // Project statistics
    const totalProjects = allProjects.length;
    const completedProjects = allProjects.filter(
      (p) => p.status === "Completed"
    ).length;
    const ongoingProjects = allProjects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const cancelledProjects = allProjects.filter(
      (p) => p.status === "Cancelled"
    ).length;
    const openProjects = allProjects.filter((p) => p.status === "Open").length;

    // Average rating calculation from mentor reviews
    const projectsWithRatings = allProjects.filter(
      (p) => p.mentorReview && p.mentorReview.rating
    );
    const averageRating =
      projectsWithRatings.length > 0
        ? projectsWithRatings.reduce(
            (sum, p) => sum + p.mentorReview.rating,
            0
          ) / projectsWithRatings.length
        : learner.rating || 0;

    // Calculate success rate
    const successRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Most frequent mentor calculation
    const mentorProjectCounts = {};
    allProjects.forEach((project) => {
      if (
        project.mentorId &&
        project.mentorId.userId &&
        project.status === "Completed"
      ) {
        const mentorUserId = project.mentorId.userId._id.toString();
        const mentorInfo = project.mentorId.userId;

        if (!mentorProjectCounts[mentorUserId]) {
          mentorProjectCounts[mentorUserId] = {
            mentor: mentorInfo,
            completedProjects: 0,
            totalProjects: 0,
          };
        }

        mentorProjectCounts[mentorUserId].completedProjects++;
        mentorProjectCounts[mentorUserId].totalProjects++;
      }
    });

    // Add ongoing projects to mentor counts
    allProjects.forEach((project) => {
      if (
        project.mentorId &&
        project.mentorId.userId &&
        project.status !== "Completed"
      ) {
        const mentorUserId = project.mentorId.userId._id.toString();
        const mentorInfo = project.mentorId.userId;

        if (!mentorProjectCounts[mentorUserId]) {
          mentorProjectCounts[mentorUserId] = {
            mentor: mentorInfo,
            completedProjects: 0,
            totalProjects: 0,
          };
        }

        mentorProjectCounts[mentorUserId].totalProjects++;
      }
    });

    const topMentors = Object.values(mentorProjectCounts)
      .sort((a, b) => b.completedProjects - a.completedProjects)
      .slice(0, 5); // Top 5 mentors

    // Session statistics
    const allSessions = await Session.find({ learnerId });
    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(
      (s) => s.status === "completed"
    ).length;
    const upcomingSessions = allSessions.filter(
      (s) => s.status === "scheduled" && new Date(s.scheduledAt) > new Date()
    ).length;

    // Milestone statistics
    const allMilestones = await Milestone.find({ learnerId });
    const totalMilestones = allMilestones.length;
    const completedMilestones = allMilestones.filter(
      (m) => m.isFullyCompleted
    ).length;
    const pendingMilestones = allMilestones.filter(
      (m) =>
        m.learnerVerification.isVerified && !m.mentorVerification.isVerified
    ).length;

    // Monthly project completion trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthlyCompleted = allProjects.filter(
        (p) =>
          p.status === "Completed" &&
          p.actualEndDate &&
          new Date(p.actualEndDate) >= monthStart &&
          new Date(p.actualEndDate) <= monthEnd
      ).length;

      monthlyTrend.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        completed: monthlyCompleted,
      });
    }

    // Project distribution for charts
    const projectDistribution = {
      completed: completedProjects,
      ongoing: ongoingProjects,
      cancelled: cancelledProjects,
      open: openProjects,
    };

    // Recent activity (last 10 projects)
    const recentProjects = allProjects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map((project) => ({
        id: project._id,
        name: project.name,
        status: project.status,
        mentorName: project.mentorId?.userId?.name || "No Mentor Assigned",
        updatedAt: project.updatedAt,
        progressPercentage: project.progressPercentage || 0,
      }));

    // Learning progress and achievements
    const learningStats = {
      currentLevel: learner.level,
      currentXp: learner.xp,
      nextLevelXp: learner.nextLevelXp,
      progressPercentage: Math.floor((learner.xp / learner.nextLevelXp) * 100),
      streakDays: learner.streakDays,
      totalAchievements: learner.totalAchievement,
    };

    // Category-wise project distribution
    const categoryDistribution = {};
    allProjects.forEach((project) => {
      const category = project.category || "Other";
      categoryDistribution[category] =
        (categoryDistribution[category] || 0) + 1;
    });

    // Difficulty level distribution
    const difficultyDistribution = {};
    allProjects.forEach((project) => {
      const difficulty = project.difficultyLevel || "Beginner";
      difficultyDistribution[difficulty] =
        (difficultyDistribution[difficulty] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        learner: {
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.avatar,
          title: learner.title,
          description: learner.description,
          location: learner.location,
          rating: averageRating.toFixed(1),
          joinDate: learner.joinDate,
          level: learner.level,
          xp: learner.xp,
          nextLevelXp: learner.nextLevelXp,
        },
        overview: {
          totalProjects,
          completedProjects,
          ongoingProjects,
          cancelledProjects,
          openProjects,
          averageRating: averageRating.toFixed(1),
          successRate,
        },
        sessions: {
          totalSessions,
          completedSessions,
          upcomingSessions,
        },
        milestones: {
          totalMilestones,
          completedMilestones,
          pendingMilestones,
        },
        topMentors,
        projectDistribution,
        categoryDistribution,
        difficultyDistribution,
        monthlyTrend,
        recentProjects,
        learningStats,
      },
    });
  } catch (error) {
    console.error("Error fetching learner analysis:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getMentorAnalysis,
  getProjectAnalytics,
  getLearnerAnalysis,
};
