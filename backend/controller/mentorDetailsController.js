const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const Project = require("../Model/Project");
const Learner = require("../Model/Learner");

// Get mentor details by mentorId
const getMentorDetails = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Find mentor by _id and populate user details
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

    // Calculate additional metrics if needed
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

// Get mentor's completed/cancelled projects
const getMentorProjects = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Verify mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Find projects where this mentor was assigned and status is completed or cancelled
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
      .sort({ actualEndDate: -1, updatedAt: -1 }); // Sort by completion date, most recent first

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

// Get learner details by learnerId (for ProjectCard component)
const getLearnerDetails = async (req, res) => {
  try {
    const { learnerId } = req.params;

    // Find learner by _id and populate user details
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

// Get mentor's statistics and analytics
const getMentorAnalytics = async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Verify mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Get project statistics
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

    // Get monthly completion trend (last 6 months)
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
