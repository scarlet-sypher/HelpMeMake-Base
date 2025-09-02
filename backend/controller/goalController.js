const mongoose = require("mongoose");
const Goal = require("../Model/Goal");
const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const Project = require("../Model/Project");

const getMentorGoalAndReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId }).populate(
      "userId",
      "name avatar"
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    let currentGoal = await Goal.findOne({
      mentorId: mentor._id,
      month: currentMonth,
      year: currentYear,
    });

    const lastMonthGoal = await Goal.findOne({
      mentorId: mentor._id,
      month: lastMonth,
      year: lastMonthYear,
    });

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const currentMonthProjects = await Project.find({
      mentorId: mentor._id,
      status: "Completed",
      updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const sessionsCompleted = currentMonthProjects.length;
    const currentEarnings = currentMonthProjects.reduce(
      (sum, project) => sum + (project.closingPrice || 0),
      0
    );
    const avgPerSession =
      sessionsCompleted > 0
        ? Math.round(currentEarnings / sessionsCompleted)
        : 0;

    const lastMonthEarnings = lastMonthGoal ? lastMonthGoal.currentEarnings : 0;
    const lastMonthSessions = lastMonthGoal
      ? lastMonthGoal.sessionsCompleted
      : 0;
    const lastMonthAvgPerSession = lastMonthGoal
      ? lastMonthGoal.avgPerSession
      : 0;

    const earningsChange =
      lastMonthEarnings > 0
        ? Math.round(
            ((currentEarnings - lastMonthEarnings) / lastMonthEarnings) * 100
          )
        : currentEarnings > 0
        ? 100
        : 0;

    const sessionsChange =
      lastMonthSessions > 0
        ? Math.round(
            ((sessionsCompleted - lastMonthSessions) / lastMonthSessions) * 100
          )
        : sessionsCompleted > 0
        ? 100
        : 0;

    const avgPerSessionChange =
      lastMonthAvgPerSession > 0
        ? Math.round(
            ((avgPerSession - lastMonthAvgPerSession) /
              lastMonthAvgPerSession) *
              100
          )
        : avgPerSession > 0
        ? 100
        : 0;

    if (!currentGoal) {
      currentGoal = new Goal({
        mentorId: mentor._id,
        monthlyGoal: 2000,
        currentEarnings: currentEarnings,
        sessionsCompleted: sessionsCompleted,
        avgPerSession: avgPerSession,
        month: currentMonth,
        year: currentYear,
        lastMonthEarnings: lastMonthEarnings,
        lastMonthSessions: lastMonthSessions,
      });
      await currentGoal.save();
    } else {
      currentGoal.currentEarnings = currentEarnings;
      currentGoal.sessionsCompleted = sessionsCompleted;
      currentGoal.avgPerSession = avgPerSession;
      currentGoal.lastMonthEarnings = lastMonthEarnings;
      currentGoal.lastMonthSessions = lastMonthSessions;
      await currentGoal.save();
    }

    const completedProjects = await Project.find({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
      "learnerReview.rating": { $exists: true },
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name avatar",
        },
      })
      .populate("completionRequest.requestedBy", "name")
      .select(
        "name closingPrice learnerReview createdAt status completionRequest"
      )
      .sort({ "learnerReview.reviewDate": -1 });

    const allProjects = await Project.find({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
    }).select("status closingPrice");

    const completedProjectsTotal = allProjects
      .filter((project) => project.status === "Completed")
      .reduce((sum, project) => sum + (project.closingPrice || 0), 0);

    const cancelledProjectsTotal = allProjects
      .filter((project) => project.status === "Cancelled")
      .reduce((sum, project) => sum + (project.closingPrice || 0), 0);

    const allProjectsTotal = completedProjectsTotal + cancelledProjectsTotal;

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const currentDay = new Date().getDate();
    const daysLeft = daysInMonth - currentDay;

    const reviews = completedProjects.map((project) => {
      let requestInfo = null;

      if (
        project.completionRequest &&
        project.completionRequest.requestedByType
      ) {
        const requestedBy =
          project.completionRequest.requestedByName ||
          (project.completionRequest.requestedBy
            ? project.completionRequest.requestedBy.name
            : "Unknown");
        const requestType = project.completionRequest.type || "completion";
        const requesterType = project.completionRequest.requestedByType;

        requestInfo = {
          requestedBy: requestedBy,
          requestedByType: requesterType,
          requestType: requestType,
          message: `Request sent by: ${requesterType} for ${requestType}`,
        };
      }

      return {
        projectName: project.name,
        closingPrice: project.closingPrice || 0,
        reviewDate: project.learnerReview.reviewDate || project.createdAt,
        rating: project.learnerReview.rating,
        comment: project.learnerReview.comment,
        status: project.status,
        requestInfo: requestInfo,
        learner: {
          name: project.learnerId.userId.name,
          avatar: project.learnerId.userId.avatar,
        },
      };
    });

    res.json({
      success: true,
      data: {
        mentor: {
          name: mentor.userId.name,
          avatar: mentor.userId.avatar,
          totalEarnings: mentor.mentorTotalEarnings || 0,
        },
        goal: {
          ...currentGoal.toJSON(),

          earningsChange,
          sessionsChange,
          avgPerSessionChange,
          daysLeft,
        },
        reviews,
        totals: {
          completed: completedProjectsTotal,
          cancelled: cancelledProjectsTotal,
          all: allProjectsTotal,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching mentor goal and reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor data",
      error: error.message,
    });
  }
};

const setMentorGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { monthlyGoal } = req.body;

    if (!monthlyGoal || monthlyGoal < 0) {
      return res.status(400).json({
        success: false,
        message: "Monthly goal must be a positive number",
      });
    }

    const mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let goal = await Goal.findOne({
      mentorId: mentor._id,
      month: currentMonth,
      year: currentYear,
    });

    if (goal) {
      goal.monthlyGoal = monthlyGoal;
      goal.currentEarnings = mentor.mentorTotalEarnings || 0;
    } else {
      goal = new Goal({
        mentorId: mentor._id,
        monthlyGoal,
        currentEarnings: mentor.mentorTotalEarnings || 0,
        month: currentMonth,
        year: currentYear,
      });
    }

    await goal.save();

    res.json({
      success: true,
      message: "Goal updated successfully",
      data: goal.toJSON(),
    });
  } catch (error) {
    console.error("Error setting mentor goal:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set goal",
      error: error.message,
    });
  }
};

const getMentorReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const completedProjects = await Project.find({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
      "learnerReview.rating": { $exists: true },
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name avatar",
        },
      })
      .select("name closingPrice learnerReview createdAt")
      .sort({ "learnerReview.reviewDate": -1 });

    const reviews = completedProjects.map((project) => ({
      projectName: project.name,
      closingPrice: project.closingPrice || 0,
      reviewDate: project.learnerReview.reviewDate || project.createdAt,
      rating: project.learnerReview.rating,
      comment: project.learnerReview.comment,
      learner: {
        name: project.learnerId.userId.name,
        avatar: project.learnerId.userId.avatar,
      },
    }));

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching mentor reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

const getRecentMentorReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const completedProjects = await Project.find({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
      "learnerReview.rating": { $exists: true },
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name avatar",
        },
      })
      .select("name closingPrice learnerReview createdAt status")
      .sort({ "learnerReview.reviewDate": -1 })
      .limit(4);

    const totalReviewsCount = await Project.countDocuments({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
      "learnerReview.rating": { $exists: true },
    });

    const allReviewsForStats = await Project.find({
      mentorId: mentor._id,
      status: { $in: ["Completed", "Cancelled"] },
      "learnerReview.rating": { $exists: true },
    }).select("learnerReview");

    let overallStats = {
      averageRating: 0,
      totalReviews: totalReviewsCount,
      fiveStarPercentage: 0,
    };

    if (allReviewsForStats.length > 0) {
      const totalRating = allReviewsForStats.reduce(
        (sum, project) => sum + project.learnerReview.rating,
        0
      );
      const fiveStarCount = allReviewsForStats.filter(
        (project) => project.learnerReview.rating === 5
      ).length;

      overallStats.averageRating = Number(
        (totalRating / allReviewsForStats.length).toFixed(1)
      );
      overallStats.fiveStarPercentage = Math.round(
        (fiveStarCount / allReviewsForStats.length) * 100
      );
    }

    const reviews = completedProjects.map((project) => ({
      name: project.learnerId.userId.name,
      image: project.learnerId.userId.avatar,
      rating: project.learnerReview.rating,
      comment: project.learnerReview.comment || "",
      date: project.learnerReview.reviewDate || project.createdAt,
      projectName: project.name,
      status: project.status,
      closingPrice: project.closingPrice || 0,
    }));

    res.json({
      success: true,
      data: {
        reviews,
        overallStats,
        totalReviews: totalReviewsCount,
        hasMoreReviews: totalReviewsCount > 4,
      },
    });
  } catch (error) {
    console.error("Error fetching recent mentor reviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent reviews",
      error: error.message,
    });
  }
};

module.exports = {
  getMentorGoalAndReviews,
  setMentorGoal,
  getMentorReviews,
  getRecentMentorReviews,
};
