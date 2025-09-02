const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const Project = require("../Model/Project");
const Learner = require("../Model/Learner");

const getMentorDetails = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId).populate({
      path: "userId",
      select: "name email avatar authProvider isEmailVerified",
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const mentorWithMetrics = {
      ...mentor.toObject(),
      successRate: mentor.successRate,
      averageRating: mentor.averageRating,
      primaryExpertise: mentor.primaryExpertise,
    };

    res.json({
      success: true,
      message: "Mentor details retrieved successfully",
      mentor: mentorWithMetrics,
    });
  } catch (error) {
    console.error("Get mentor details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor details",
      error: error.message,
    });
  }
};

const getMentorProjects = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const projects = await Project.find({
      mentorId: mentorId,
      status: { $in: ["Completed", "Cancelled"] },
    })
      .populate({
        path: "learnerId",
        select: "userId title rating location",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ actualEndDate: -1, updatedAt: -1 });

    res.json({
      success: true,
      message: "Mentor projects retrieved successfully",
      projects: projects,
      totalProjects: projects.length,
    });
  } catch (error) {
    console.error("Get mentor projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor projects",
      error: error.message,
    });
  }
};

const getLearnerDetails = async (req, res) => {
  try {
    const { learnerId } = req.params;

    const learner = await Learner.findById(learnerId).populate({
      path: "userId",
      select: "name email avatar",
    });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    res.json({
      success: true,
      message: "Learner details retrieved successfully",
      learner: learner,
    });
  } catch (error) {
    console.error("Get learner details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve learner details",
      error: error.message,
    });
  }
};

const getMentorAnalytics = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const projectStats = await Project.aggregate([
      { $match: { mentorId: mongoose.Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalEarnings: { $sum: "$closingPrice" },
          avgRating: { $avg: "$mentorReview.rating" },
        },
      },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Project.aggregate([
      {
        $match: {
          mentorId: mongoose.Types.ObjectId(mentorId),
          status: "Completed",
          actualEndDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$actualEndDate" },
            month: { $month: "$actualEndDate" },
          },
          count: { $sum: 1 },
          earnings: { $sum: "$closingPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      message: "Mentor analytics retrieved successfully",
      analytics: {
        projectStats,
        monthlyTrend,
        totalEarnings: mentor.mentorTotalEarnings || 0,
        satisfactionRate: mentor.mentorSatisfactionRate || 0,
      },
    });
  } catch (error) {
    console.error("Get mentor analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getMentorDetails,
  getMentorProjects,
  getLearnerDetails,
  getMentorAnalytics,
};
