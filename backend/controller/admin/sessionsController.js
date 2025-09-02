const Session = require("../../Model/Session");
const Mentor = require("../../Model/Mentor");
const Learner = require("../../Model/Learner");
const User = require("../../Model/User");
const Project = require("../../Model/Project");

const adminSessionsController = {
  getAllSessions: async (req, res) => {
    try {
      const { search, status, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};
      if (status) {
        filter.status = status;
      }

      let sessionsQuery = Session.find(filter)
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            select: "name email avatar",
          },
        })
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            select: "name email avatar",
          },
        })
        .populate(
          "projectId",
          "name thumbnail status category difficultyLevel openingPrice"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const sessions = await sessionsQuery;

      let filteredSessions = sessions;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredSessions = sessions.filter((session) => {
          const projectName = session.projectId?.name?.toLowerCase() || "";
          const sessionTitle = session.title?.toLowerCase() || "";
          const mentorName =
            session.mentorId?.userId?.name?.toLowerCase() || "";
          const learnerName =
            session.learnerId?.userId?.name?.toLowerCase() || "";

          return (
            projectName.includes(searchLower) ||
            sessionTitle.includes(searchLower) ||
            mentorName.includes(searchLower) ||
            learnerName.includes(searchLower)
          );
        });
      }

      const totalCount = await Session.countDocuments(filter);

      const transformedSessions = filteredSessions.map((session) => ({
        _id: session._id,
        title: session.title,
        topic: session.topic,
        description: session.description,
        sessionType: session.sessionType,
        scheduledAt: session.scheduledAt,
        status: session.status,
        duration: session.duration,
        meetingLink: session.meetingLink,
        recordingLink: session.recordingLink,
        prerequisites: session.prerequisites,
        expireReason: session.expireReason,
        learnerReason: session.learnerReason,
        mentorReason: session.mentorReason,
        isLearnerPresent: session.isLearnerPresent,
        isMentorPresent: session.isMentorPresent,
        learnerAttendedAt: session.learnerAttendedAt,
        mentorAttendedAt: session.mentorAttendedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,

        mentor: {
          id: session.mentorId?._id,
          userId: session.mentorId?.userId?._id,
          name: session.mentorId?.userId?.name || "Unknown Mentor",
          email: session.mentorId?.userId?.email || "",
          avatar:
            session.mentorId?.userId?.avatar || "/uploads/public/default.jpg",
        },

        learner: {
          id: session.learnerId?._id,
          userId: session.learnerId?.userId?._id,
          name: session.learnerId?.userId?.name || "Unknown Learner",
          email: session.learnerId?.userId?.email || "",
          avatar:
            session.learnerId?.userId?.avatar || "/uploads/public/default.jpg",
        },

        project: {
          id: session.projectId?._id,
          name: session.projectId?.name || "Unknown Project",
          thumbnail:
            session.projectId?.thumbnail ||
            "/uploads/public/default-project.jpg",
          status: session.projectId?.status || "Unknown",
          category: session.projectId?.category || "Unknown",
          difficultyLevel: session.projectId?.difficultyLevel || "Unknown",
          openingPrice: session.projectId?.openingPrice || 0,
        },
      }));

      res.json({
        success: true,
        data: {
          sessions: transformedSessions,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalSessions: totalCount,
            hasNext: skip + filteredSessions.length < totalCount,
            hasPrev: page > 1,
          },
        },
        message: `Found ${filteredSessions.length} sessions`,
      });
    } catch (error) {
      console.error("Get all sessions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sessions",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deleteSession: async (req, res) => {
    try {
      const { sessionId } = req.params;

      const session = await Session.findById(sessionId)
        .populate("projectId", "name")
        .populate({
          path: "mentorId",
          populate: { path: "userId", select: "name" },
        })
        .populate({
          path: "learnerId",
          populate: { path: "userId", select: "name" },
        });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const sessionInfo = {
        title: session.title,
        projectName: session.projectId?.name || "Unknown Project",
        mentorName: session.mentorId?.userId?.name || "Unknown Mentor",
        learnerName: session.learnerId?.userId?.name || "Unknown Learner",
        scheduledAt: session.scheduledAt,
      };

      await Session.findByIdAndDelete(sessionId);

      res.json({
        success: true,
        message: "Session deleted successfully",
        deletedSession: sessionInfo,
      });
    } catch (error) {
      console.error("Delete session error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete session",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getSessionStats: async (req, res) => {
    try {
      const stats = await Promise.all([
        Session.countDocuments(),
        Session.countDocuments({ status: "scheduled" }),
        Session.countDocuments({ status: "completed" }),
        Session.countDocuments({ status: "cancelled" }),
        Session.countDocuments({ status: "ongoing" }),
        Session.countDocuments({ status: "expired" }),
      ]);

      res.json({
        success: true,
        data: {
          total: stats[0],
          scheduled: stats[1],
          completed: stats[2],
          cancelled: stats[3],
          ongoing: stats[4],
          expired: stats[5],
        },
      });
    } catch (error) {
      console.error("Get session stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch session statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
};

module.exports = adminSessionsController;
