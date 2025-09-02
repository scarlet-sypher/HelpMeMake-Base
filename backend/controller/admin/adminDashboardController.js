const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const Mentor = require("../../Model/Mentor");
const Project = require("../../Model/Project");
const Session = require("../../Model/Session");
const MessageRoom = require("../../Model/MessageRoom");

const adminDashboardController = {
  // dashboard statistics
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalUsers,
        totalLearners,
        totalMentors,
        totalProjects,
        totalSessions,
        totalMessageRooms,
        activeProjects,
        completedProjects,
        scheduledSessions,
        completedSessions,
        openMessageRooms,
      ] = await Promise.all([
        User.countDocuments(),
        Learner.countDocuments(),
        Mentor.countDocuments(),
        Project.countDocuments(),
        Session.countDocuments(),
        MessageRoom.countDocuments(),
        Project.countDocuments({ status: "In Progress" }),
        Project.countDocuments({ status: "Completed" }),
        Session.countDocuments({ status: "scheduled" }),
        Session.countDocuments({ status: "completed" }),
        MessageRoom.countDocuments({ status: "open" }),
      ]);

      const totalEarnings = await Project.aggregate([
        { $match: { closingPrice: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$closingPrice" } } },
      ]);

      const avgProjectRating = await Project.aggregate([
        { $match: { "learnerReview.rating": { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: "$learnerReview.rating" } } },
      ]);

      res.json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            learners: totalLearners,
            mentors: totalMentors,
          },
          projects: {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects,
          },
          sessions: {
            total: totalSessions,
            scheduled: scheduledSessions,
            completed: completedSessions,
          },
          messageRooms: {
            total: totalMessageRooms,
            open: openMessageRooms,
          },
          financials: {
            totalEarnings: totalEarnings[0]?.total || 0,
            avgProjectRating: avgProjectRating[0]?.avgRating || 0,
          },
        },
      });
    } catch (error) {
      console.error("Admin dashboard stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
      });
    }
  },

  //all users with basic info
  getAllUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select("name email role authProvider isAccountActive createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments();

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  },

  //all learners with detailed info
  getAllLearners: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const learners = await Learner.find()
        .populate("userId", "name email avatar isAccountActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Learner.countDocuments();

      res.json({
        success: true,
        data: {
          learners,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all learners error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch learners",
      });
    }
  },

  //all mentors with detailed info
  getAllMentors: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const mentors = await Mentor.find()
        .populate("userId", "name email avatar isAccountActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Mentor.countDocuments();

      res.json({
        success: true,
        data: {
          mentors,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all mentors error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch mentors",
      });
    }
  },

  //projects with basic info
  getAllProjects: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const projects = await Project.find()
        .populate("learnerId", "userId")
        .populate("mentorId", "userId")
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Project.countDocuments();

      res.json({
        success: true,
        data: {
          projects,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all projects error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
      });
    }
  },

  //all sessions with basic info
  getAllSessions: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const sessions = await Session.find()
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .populate("projectId", "name status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Session.countDocuments();

      res.json({
        success: true,
        data: {
          sessions,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all sessions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sessions",
      });
    }
  },

  //all message rooms with basic info
  getAllMessageRooms: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const messageRooms = await MessageRoom.find()
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "name email",
          },
        })
        .populate("projectId", "name status")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await MessageRoom.countDocuments();

      res.json({
        success: true,
        data: {
          messageRooms,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (error) {
      console.error("Get all message rooms error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch message rooms",
      });
    }
  },
};

module.exports = adminDashboardController;
