const MessageRoom = require("../../Model/MessageRoom");
const MessageChat = require("../../Model/MessageChat");
const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const Mentor = require("../../Model/Mentor");
const Project = require("../../Model/Project");

const roomController = {
  // Get all chat rooms with populated data
  getAllRooms: async (req, res) => {
    try {
      const rooms = await MessageRoom.find()
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email avatar",
          },
        })
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email avatar",
          },
        })
        .populate("projectId", "name thumbnail")
        .sort({ createdAt: -1 });

      // Format the response to include all required fields
      const formattedRooms = rooms.map((room) => ({
        _id: room._id,
        roomId: room.roomId,
        status: room.status,
        roomName: room.roomName,
        learnerWallpaper: room.learnerWallpaper,
        mentorWallpaper: room.mentorWallpaper,
        totalMessages: room.totalMessages,
        learnerUnreadCount: room.learnerUnreadCount,
        mentorUnreadCount: room.mentorUnreadCount,
        isArchived: room.isArchived,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        lastMessage: room.lastMessage,
        learner: {
          _id: room.learnerId?._id,
          userId: room.learnerId?.userId?._id,
          name: room.learnerId?.userId?.name || "Unknown Learner",
          email: room.learnerId?.userId?.email || "No email",
          avatar:
            room.learnerId?.userId?.avatar || "/uploads/public/default.jpg",
        },
        mentor: {
          _id: room.mentorId?._id,
          userId: room.mentorId?.userId?._id,
          name: room.mentorId?.userId?.name || "Unknown Mentor",
          email: room.mentorId?.userId?.email || "No email",
          avatar:
            room.mentorId?.userId?.avatar || "/uploads/public/default.jpg",
        },
        project: {
          _id: room.projectId?._id,
          name: room.projectId?.name || "Unknown Project",
          thumbnail:
            room.projectId?.thumbnail || "/uploads/public/default-project.jpg",
        },
      }));

      res.json({
        success: true,
        message: "Chat rooms fetched successfully",
        data: formattedRooms,
        total: formattedRooms.length,
      });
    } catch (error) {
      console.error("Get all rooms error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch chat rooms",
        error: error.message,
      });
    }
  },

  // Get all chats for a specific room
  getRoomChats: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { page = 1, limit = 100 } = req.query;

      // First verify the room exists and get room details
      const room = await MessageRoom.findById(roomId)
        .populate({
          path: "learnerId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email avatar",
          },
        })
        .populate({
          path: "mentorId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email avatar",
          },
        })
        .populate("projectId", "name thumbnail");

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Chat room not found",
        });
      }

      // Get all chats for this room
      const chats = await MessageChat.find({
        roomId: roomId,
        isDeleted: false,
      })
        .populate("senderId", "name email avatar")
        .populate("receiverId", "name email avatar")
        .sort({ time: 1 }) // Ascending order for chronological display
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Get total count for pagination
      const totalChats = await MessageChat.countDocuments({
        roomId: roomId,
        isDeleted: false,
      });

      // Format chats with sender type identification
      const formattedChats = chats.map((chat) => {
        // Determine if sender is learner or mentor by comparing user IDs
        const isLearner =
          chat.senderId._id.toString() === room.learnerId.userId._id.toString();
        const isMentor =
          chat.senderId._id.toString() === room.mentorId.userId._id.toString();

        return {
          _id: chat._id,
          message: chat.message,
          messageType: chat.messageType,
          imageUrl: chat.imageUrl,
          imageName: chat.imageName,
          time: chat.time,
          isRead: chat.isRead,
          readAt: chat.readAt,
          isDelivered: chat.isDelivered,
          deliveredAt: chat.deliveredAt,
          createdAt: chat.createdAt,
          sender: {
            _id: chat.senderId._id,
            name: chat.senderId.name,
            email: chat.senderId.email,
            avatar: chat.senderId.avatar,
            type: isLearner ? "learner" : isMentor ? "mentor" : "unknown",
          },
          receiver: {
            _id: chat.receiverId._id,
            name: chat.receiverId.name,
            email: chat.receiverId.email,
            avatar: chat.receiverId.avatar,
          },
        };
      });

      // Format room details
      const roomDetails = {
        _id: room._id,
        roomId: room.roomId,
        status: room.status,
        roomName: room.roomName,
        learnerWallpaper: room.learnerWallpaper,
        mentorWallpaper: room.mentorWallpaper,
        totalMessages: room.totalMessages,
        createdAt: room.createdAt,
        learner: {
          _id: room.learnerId._id,
          userId: room.learnerId.userId._id,
          name: room.learnerId.userId.name,
          email: room.learnerId.userId.email,
          avatar: room.learnerId.userId.avatar,
        },
        mentor: {
          _id: room.mentorId._id,
          userId: room.mentorId.userId._id,
          name: room.mentorId.userId.name,
          email: room.mentorId.userId.email,
          avatar: room.mentorId.userId.avatar,
        },
        project: {
          _id: room.projectId._id,
          name: room.projectId.name,
          thumbnail: room.projectId.thumbnail,
        },
      };

      res.json({
        success: true,
        message: "Room chats fetched successfully",
        data: {
          room: roomDetails,
          chats: formattedChats,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalChats / limit),
            totalChats,
            hasMore: page * limit < totalChats,
          },
        },
      });
    } catch (error) {
      console.error("Get room chats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch room chats",
        error: error.message,
      });
    }
  },

  // Get room statistics
  getRoomStats: async (req, res) => {
    try {
      const totalRooms = await MessageRoom.countDocuments();
      const openRooms = await MessageRoom.countDocuments({ status: "open" });
      const closedRooms = await MessageRoom.countDocuments({ status: "close" });
      const archivedRooms = await MessageRoom.countDocuments({
        isArchived: true,
      });

      // Get total messages across all rooms
      const totalMessages = await MessageChat.countDocuments({
        isDeleted: false,
      });

      // Get recent activity (messages in last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentMessages = await MessageChat.countDocuments({
        createdAt: { $gte: yesterday },
        isDeleted: false,
      });

      res.json({
        success: true,
        data: {
          totalRooms,
          openRooms,
          closedRooms,
          archivedRooms,
          totalMessages,
          recentMessages,
        },
      });
    } catch (error) {
      console.error("Get room stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch room statistics",
        error: error.message,
      });
    }
  },
};

module.exports = roomController;
