const MessageRoom = require("../Model/MessageRoom");
const MessageChat = require("../Model/MessageChat");
const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

// Debug helper function
const debugLog = (message, data = null) => {
  console.log(
    `[MESSAGE_DEBUG] ${message}`,
    data ? JSON.stringify(data, null, 2) : ""
  );
};

// Helper function to get user details from learner/mentor ID
const getUserDetailsFromProfile = async (profileId, role) => {
  debugLog(`Getting user details for ${role}`, { profileId });

  let profile;
  if (role === "learner") {
    profile = await Learner.findById(profileId).populate(
      "userId",
      "name avatar email"
    );
  } else if (role === "mentor") {
    profile = await Mentor.findById(profileId).populate(
      "userId",
      "name avatar email"
    );
  }

  if (!profile || !profile.userId) {
    debugLog(`Profile or userId not found for ${role}`, { profileId });
    return null;
  }

  debugLog(`Found user details for ${role}`, {
    userId: profile.userId._id,
    name: profile.userId.name,
    avatar: profile.userId.avatar,
  });

  return profile.userId;
};

// Helper function to determine user role and get profile ID
const getUserRoleAndProfileId = async (userId) => {
  debugLog("Determining user role and profile ID", { userId });

  // Check if user is a learner
  const learner = await Learner.findOne({ userId });
  if (learner) {
    debugLog("User is a learner", { learnerId: learner._id });
    return { role: "learner", profileId: learner._id };
  }

  // Check if user is a mentor
  const mentor = await Mentor.findOne({ userId });
  if (mentor) {
    debugLog("User is a mentor", { mentorId: mentor._id });
    return { role: "mentor", profileId: mentor._id };
  }

  debugLog("User role not found", { userId });
  return null;
};

// Create message room when project status becomes "In Progress"
const createRoomForProject = async (projectId) => {
  debugLog("Creating room for project", { projectId });

  try {
    // Check if room already exists for this project
    const existingRoom = await MessageRoom.findOne({ projectId });
    if (existingRoom) {
      debugLog("Room already exists for project", {
        roomId: existingRoom.roomId,
        status: existingRoom.status,
      });
      return existingRoom;
    }

    // Get project details with populated references
    const project = await Project.findById(projectId);

    if (!project) {
      debugLog("Project not found", { projectId });
      throw new Error("Project not found");
    }

    debugLog("Project found for room creation", {
      projectId: project._id,
      projectName: project.name,
      status: project.status,
      learnerId: project.learnerId,
      mentorId: project.mentorId,
    });

    if (!project.learnerId || !project.mentorId) {
      debugLog("Project missing learner or mentor", {
        learnerId: project.learnerId,
        mentorId: project.mentorId,
        status: project.status,
      });
      throw new Error("Project must have both learner and mentor assigned");
    }

    // Verify the learner and mentor exist in their respective collections
    const learner = await Learner.findById(project.learnerId);
    const mentor = await Mentor.findById(project.mentorId);

    if (!learner) {
      debugLog("Learner profile not found", { learnerId: project.learnerId });
      throw new Error("Learner profile not found");
    }

    if (!mentor) {
      debugLog("Mentor profile not found", { mentorId: project.mentorId });
      throw new Error("Mentor profile not found");
    }

    debugLog("Learner and Mentor profiles verified", {
      learnerUserId: learner.userId,
      mentorUserId: mentor.userId,
    });

    // Create new room
    const roomName = `Chat - ${project.name}`;
    const newRoom = new MessageRoom({
      learnerId: project.learnerId,
      mentorId: project.mentorId,
      projectId: project._id,
      roomName,
      status: "open",
    });

    debugLog("Attempting to save new room", {
      learnerId: newRoom.learnerId,
      mentorId: newRoom.mentorId,
      projectId: newRoom.projectId,
      roomName: newRoom.roomName,
      status: newRoom.status,
    });

    const savedRoom = await newRoom.save();

    debugLog("Room created successfully", {
      roomId: savedRoom._id,
      roomIdString: savedRoom.roomId,
      learnerId: savedRoom.learnerId,
      mentorId: savedRoom.mentorId,
      projectId: savedRoom.projectId,
    });

    return savedRoom;
  } catch (error) {
    debugLog("Error creating room", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Send message API
const sendMessage = async (req, res) => {
  debugLog("Send message request", {
    roomId: req.params.roomId,
    userId: req.user._id,
    messageLength: req.body.message?.length,
  });

  try {
    const { roomId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    // Validate message
    if (!message || message.trim().length === 0) {
      debugLog("Empty message provided");
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    if (message.trim().length > 2000) {
      debugLog("Message too long", { length: message.length });
      return res.status(400).json({
        success: false,
        message: "Message is too long (max 2000 characters)",
      });
    }

    // Find room
    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Check if room is closed
    if (room.status === "close") {
      debugLog("Attempting to send message to closed room", { roomId });
      return res.status(403).json({
        success: false,
        message: "Cannot send messages to a closed chat room",
      });
    }

    // Determine receiver
    let receiverId;
    let receiverRole;

    if (room.learnerId.userId._id.toString() === senderId.toString()) {
      receiverId = room.mentorId.userId._id;
      receiverRole = "mentor";
      debugLog("Sender is learner, receiver is mentor", { receiverId });
    } else if (room.mentorId.userId._id.toString() === senderId.toString()) {
      receiverId = room.learnerId.userId._id;
      receiverRole = "learner";
      debugLog("Sender is mentor, receiver is learner", { receiverId });
    } else {
      debugLog("User not authorized for this room", {
        senderId,
        learnerUserId: room.learnerId.userId._id,
        mentorUserId: room.mentorId.userId._id,
      });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages in this room",
      });
    }

    // Create and save message
    const newMessage = new MessageChat({
      roomId: room._id,
      senderId,
      receiverId,
      message: message.trim(),
      time: new Date(),
    });

    await newMessage.save();
    debugLog("Message saved", { messageId: newMessage._id });

    // Update room's last message and unread count
    room.lastMessage = {
      content: message.trim(),
      timestamp: newMessage.time,
      senderId,
    };
    room.totalMessages += 1;

    // Increment unread count for receiver
    if (receiverRole === "learner") {
      room.learnerUnreadCount += 1;
    } else {
      room.mentorUnreadCount += 1;
    }

    await room.save();
    debugLog("Room updated with last message and unread count");

    // Populate sender info for response
    await newMessage.populate("senderId", "name avatar email");
    await newMessage.populate("receiverId", "name avatar email");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    debugLog("Error sending message", { error: error.message });
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Fetch messages API
const fetchMessages = async (req, res) => {
  debugLog("Fetch messages request", {
    roomId: req.params.roomId,
    userId: req.user._id,
  });

  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Find and validate room
    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Verify user has access to this room
    const hasAccess =
      room.learnerId.userId._id.toString() === userId.toString() ||
      room.mentorId.userId._id.toString() === userId.toString();

    if (!hasAccess) {
      debugLog("User not authorized to access room", { userId, roomId });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this room",
      });
    }

    // Fetch messages with pagination
    const messages = await MessageChat.getMessagesByRoom(
      room._id,
      parseInt(page),
      parseInt(limit)
    );

    debugLog("Messages fetched", {
      count: messages.length,
      page,
      limit,
    });

    // Mark messages as read for current user
    await MessageChat.markAllAsRead(room._id, userId);

    // Reset unread count for current user in room
    const userRole =
      room.learnerId.userId._id.toString() === userId.toString()
        ? "learner"
        : "mentor";
    await room.resetUnreadCount(userRole);

    debugLog("Messages marked as read and unread count reset");

    res.json({
      success: true,
      data: {
        messages,
        room: {
          roomId: room.roomId,
          roomName: room.roomName,
          status: room.status,
          totalMessages: room.totalMessages,
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalMessages: room.totalMessages,
        },
      },
    });
  } catch (error) {
    debugLog("Error fetching messages", { error: error.message });
    console.error("Fetch messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Check for new messages (polling endpoint)
const checkNewMessages = async (req, res) => {
  debugLog("Check new messages request", {
    roomId: req.params.roomId,
    lastMessageTime: req.query.lastMessageTime,
    userId: req.user._id,
  });

  try {
    const { roomId } = req.params;
    const { lastMessageTime } = req.query;
    const userId = req.user._id;

    if (!lastMessageTime) {
      debugLog("lastMessageTime parameter missing");
      return res.status(400).json({
        success: false,
        message: "lastMessageTime parameter is required",
      });
    }

    // Find and validate room
    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Verify user has access
    const hasAccess =
      room.learnerId.userId._id.toString() === userId.toString() ||
      room.mentorId.userId._id.toString() === userId.toString();

    if (!hasAccess) {
      debugLog("User not authorized to access room", { userId, roomId });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this room",
      });
    }

    // Get new messages
    const newMessages = await MessageChat.getMessagesAfterTime(
      room._id,
      lastMessageTime
    );

    debugLog("New messages found", { count: newMessages.length });

    res.json({
      success: true,
      data: {
        hasNewMessages: newMessages.length > 0,
        newMessages,
        lastCheck: new Date(),
      },
    });
  } catch (error) {
    debugLog("Error checking new messages", { error: error.message });
    console.error("Check new messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check for new messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Fetch rooms for learner
const fetchLearnerRooms = async (req, res) => {
  debugLog("Fetch learner rooms request", {
    learnerId: req.params.learnerId,
    userId: req.user._id,
  });

  try {
    const { learnerId } = req.params;
    const { status } = req.query; // optional filter: 'open' or 'close'

    // Verify user is authorized (user's own rooms or admin access)
    const learnerProfile = await Learner.findById(learnerId);
    if (!learnerProfile) {
      debugLog("Learner not found", { learnerId });
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    if (learnerProfile.userId.toString() !== req.user._id.toString()) {
      debugLog("User not authorized to access learner rooms", {
        requestingUserId: req.user._id,
        learnerUserId: learnerProfile.userId,
      });
      return res.status(403).json({
        success: false,
        message: "You can only access your own chat rooms",
      });
    }

    // Fetch rooms
    const rooms = await MessageRoom.findByLearner(learnerId, status);

    // Populate additional user details
    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const mentorUser = await getUserDetailsFromProfile(
          room.mentorId._id,
          "mentor"
        );

        return {
          ...room.toJSON(),
          mentor: mentorUser,
          unreadCount: room.learnerUnreadCount,
        };
      })
    );

    debugLog("Learner rooms fetched", { count: enrichedRooms.length });

    res.json({
      success: true,
      data: {
        rooms: enrichedRooms,
        totalRooms: enrichedRooms.length,
        openRooms: enrichedRooms.filter((r) => r.status === "open").length,
        closedRooms: enrichedRooms.filter((r) => r.status === "close").length,
      },
    });
  } catch (error) {
    debugLog("Error fetching learner rooms", { error: error.message });
    console.error("Fetch learner rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat rooms",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Fetch rooms for mentor
const fetchMentorRooms = async (req, res) => {
  debugLog("Fetch mentor rooms request", {
    mentorId: req.params.mentorId,
    userId: req.user._id,
  });

  try {
    const { mentorId } = req.params;
    const { status } = req.query; // optional filter: 'open' or 'close'

    // Verify user is authorized
    const mentorProfile = await Mentor.findById(mentorId);
    if (!mentorProfile) {
      debugLog("Mentor not found", { mentorId });
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (mentorProfile.userId.toString() !== req.user._id.toString()) {
      debugLog("User not authorized to access mentor rooms", {
        requestingUserId: req.user._id,
        mentorUserId: mentorProfile.userId,
      });
      return res.status(403).json({
        success: false,
        message: "You can only access your own chat rooms",
      });
    }

    // Fetch rooms
    const rooms = await MessageRoom.findByMentor(mentorId, status);

    // Populate additional user details
    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const learnerUser = await getUserDetailsFromProfile(
          room.learnerId._id,
          "learner"
        );

        return {
          ...room.toJSON(),
          learner: learnerUser,
          unreadCount: room.mentorUnreadCount,
        };
      })
    );

    debugLog("Mentor rooms fetched", { count: enrichedRooms.length });

    res.json({
      success: true,
      data: {
        rooms: enrichedRooms,
        totalRooms: enrichedRooms.length,
        openRooms: enrichedRooms.filter((r) => r.status === "open").length,
        closedRooms: enrichedRooms.filter((r) => r.status === "close").length,
      },
    });
  } catch (error) {
    debugLog("Error fetching mentor rooms", { error: error.message });
    console.error("Fetch mentor rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat rooms",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update wallpaper API
const updateWallpaper = async (req, res) => {
  debugLog("Update wallpaper request", {
    roomId: req.params.roomId,
    userId: req.user._id,
    wallpaperUrl: req.body.wallpaperUrl,
  });

  try {
    const { roomId } = req.params;
    const { wallpaperUrl } = req.body;
    const userId = req.user._id;

    if (!wallpaperUrl || wallpaperUrl.trim().length === 0) {
      debugLog("Wallpaper URL not provided");
      return res.status(400).json({
        success: false,
        message: "Wallpaper URL is required",
      });
    }

    // Find room
    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Determine user role and update appropriate wallpaper
    let updated = false;
    if (room.learnerId.userId._id.toString() === userId.toString()) {
      room.learnerWallpaper = wallpaperUrl.trim();
      updated = true;
      debugLog("Updated learner wallpaper");
    } else if (room.mentorId.userId._id.toString() === userId.toString()) {
      room.mentorWallpaper = wallpaperUrl.trim();
      updated = true;
      debugLog("Updated mentor wallpaper");
    }

    if (!updated) {
      debugLog("User not authorized to update wallpaper", { userId, roomId });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update wallpaper for this room",
      });
    }

    await room.save();
    debugLog("Wallpaper updated successfully");

    res.json({
      success: true,
      message: "Wallpaper updated successfully",
      data: {
        roomId: room.roomId,
        learnerWallpaper: room.learnerWallpaper,
        mentorWallpaper: room.mentorWallpaper,
      },
    });
  } catch (error) {
    debugLog("Error updating wallpaper", { error: error.message });
    console.error("Update wallpaper error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update wallpaper",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Close room when project status changes
const closeRoomForProject = async (projectId) => {
  debugLog("Closing room for project", { projectId });

  try {
    const room = await MessageRoom.findOne({ projectId });

    if (!room) {
      debugLog("No room found for project", { projectId });
      return null;
    }

    if (room.status === "close") {
      debugLog("Room already closed", { roomId: room.roomId });
      return room;
    }

    room.status = "close";
    const savedRoom = await room.save();

    debugLog("Room closed successfully", {
      roomId: savedRoom.roomId,
      projectId: projectId,
    });
    return savedRoom;
  } catch (error) {
    debugLog("Error closing room", { error: error.message });
    console.error("Close room error:", error);
    throw error;
  }
};

// Get room details
const getRoomDetails = async (req, res) => {
  debugLog("Get room details request", {
    roomId: req.params.roomId,
    userId: req.user._id,
  });

  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId")
      .populate("projectId", "name status");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Verify access
    const hasAccess =
      room.learnerId.userId._id.toString() === userId.toString() ||
      room.mentorId.userId._id.toString() === userId.toString();

    if (!hasAccess) {
      debugLog("User not authorized to access room details", {
        userId,
        roomId,
      });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this room",
      });
    }

    // Get user details
    const learnerUser = await getUserDetailsFromProfile(
      room.learnerId._id,
      "learner"
    );
    const mentorUser = await getUserDetailsFromProfile(
      room.mentorId._id,
      "mentor"
    );

    // Determine current user's role and unread count
    const isLearner =
      room.learnerId.userId._id.toString() === userId.toString();
    const unreadCount = isLearner
      ? room.learnerUnreadCount
      : room.mentorUnreadCount;
    const userWallpaper = isLearner
      ? room.learnerWallpaper
      : room.mentorWallpaper;

    debugLog("Room details fetched", {
      roomId: room.roomId,
      unreadCount,
      isLearner,
    });

    res.json({
      success: true,
      data: {
        room: {
          ...room.toJSON(),
          learner: learnerUser,
          mentor: mentorUser,
          currentUserRole: isLearner ? "learner" : "mentor",
          unreadCount,
          userWallpaper,
        },
      },
    });
  } catch (error) {
    debugLog("Error getting room details", { error: error.message });
    console.error("Get room details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get room details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get user's active chat rooms (for both learner and mentor)
// Updated getUserActiveRooms function in messageController.js
const getUserActiveRooms = async (req, res) => {
  debugLog("Get user active rooms request", { userId: req.user._id });

  try {
    const userId = req.user._id;

    // Determine if user is learner or mentor
    const roleInfo = await getUserRoleAndProfileId(userId);

    if (!roleInfo) {
      debugLog("User role not found", { userId });
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please complete your profile setup.",
      });
    }

    debugLog("User role determined", {
      userId,
      role: roleInfo.role,
      profileId: roleInfo.profileId,
    });

    let rooms = [];

    if (roleInfo.role === "mentor") {
      debugLog("Fetching mentor rooms", { mentorId: roleInfo.profileId });

      // Get all rooms for mentor (both open and closed)
      const openRooms = await MessageRoom.findByMentor(
        roleInfo.profileId,
        "open"
      );
      const closedRooms = await MessageRoom.findByMentor(
        roleInfo.profileId,
        "close"
      );
      rooms = [...openRooms, ...closedRooms];

      debugLog("Raw mentor rooms fetched", {
        openCount: openRooms.length,
        closedCount: closedRooms.length,
        totalCount: rooms.length,
      });

      // Check if we need to create rooms for "In Progress" projects without rooms
      const inProgressProjects = await Project.find({
        mentorId: roleInfo.profileId,
        status: "In Progress",
      });

      debugLog("Found in-progress projects for mentor", {
        count: inProgressProjects.length,
        projectIds: inProgressProjects.map((p) => p._id),
      });

      for (const project of inProgressProjects) {
        const existingRoom = rooms.find(
          (room) =>
            room.projectId &&
            room.projectId._id.toString() === project._id.toString()
        );

        if (!existingRoom) {
          debugLog("Creating missing room for in-progress project", {
            projectId: project._id,
            projectName: project.name,
          });

          try {
            const newRoom = await createRoomForProject(project._id);
            if (newRoom) {
              // Re-fetch the room with populated fields
              const populatedRoom = await MessageRoom.findById(newRoom._id)
                .populate("learnerId", "userId")
                .populate("mentorId", "userId")
                .populate("projectId", "name status");

              if (populatedRoom) {
                rooms.push(populatedRoom);
                debugLog("Added newly created room to results", {
                  roomId: populatedRoom.roomId,
                });
              }
            }
          } catch (createError) {
            debugLog("Failed to create room for project", {
              projectId: project._id,
              error: createError.message,
            });
          }
        }
      }

      // Enrich with learner details
      rooms = await Promise.all(
        rooms.map(async (room) => {
          const learnerUser = await getUserDetailsFromProfile(
            room.learnerId._id,
            "learner"
          );
          return {
            ...room.toJSON(),
            learner: learnerUser,
            unreadCount: room.mentorUnreadCount,
            userRole: "mentor",
          };
        })
      );
    } else if (roleInfo.role === "learner") {
      debugLog("Fetching learner rooms", { learnerId: roleInfo.profileId });

      // Get all rooms for learner (both open and closed)
      const openRooms = await MessageRoom.findByLearner(
        roleInfo.profileId,
        "open"
      );
      const closedRooms = await MessageRoom.findByLearner(
        roleInfo.profileId,
        "close"
      );
      rooms = [...openRooms, ...closedRooms];

      debugLog("Raw learner rooms fetched", {
        openCount: openRooms.length,
        closedCount: closedRooms.length,
        totalCount: rooms.length,
      });

      // Check if we need to create rooms for "In Progress" projects without rooms
      const inProgressProjects = await Project.find({
        learnerId: roleInfo.profileId,
        status: "In Progress",
      });

      debugLog("Found in-progress projects for learner", {
        count: inProgressProjects.length,
        projectIds: inProgressProjects.map((p) => p._id),
      });

      for (const project of inProgressProjects) {
        const existingRoom = rooms.find(
          (room) =>
            room.projectId &&
            room.projectId._id.toString() === project._id.toString()
        );

        if (!existingRoom) {
          debugLog("Creating missing room for in-progress project", {
            projectId: project._id,
            projectName: project.name,
          });

          try {
            const newRoom = await createRoomForProject(project._id);
            if (newRoom) {
              // Re-fetch the room with populated fields
              const populatedRoom = await MessageRoom.findById(newRoom._id)
                .populate("learnerId", "userId")
                .populate("mentorId", "userId")
                .populate("projectId", "name status");

              if (populatedRoom) {
                rooms.push(populatedRoom);
                debugLog("Added newly created room to results", {
                  roomId: populatedRoom.roomId,
                });
              }
            }
          } catch (createError) {
            debugLog("Failed to create room for project", {
              projectId: project._id,
              error: createError.message,
            });
          }
        }
      }

      // Enrich with mentor details
      rooms = await Promise.all(
        rooms.map(async (room) => {
          const mentorUser = await getUserDetailsFromProfile(
            room.mentorId._id,
            "mentor"
          );
          return {
            ...room.toJSON(),
            mentor: mentorUser,
            unreadCount: room.learnerUnreadCount,
            userRole: "learner",
          };
        })
      );
    }

    debugLog("User active rooms fetched", {
      count: rooms.length,
      role: roleInfo.role,
      roomIds: rooms.map((r) => r.roomId || "no-roomId"),
    });

    res.json({
      success: true,
      data: {
        rooms,
        totalRooms: rooms.length,
        userRole: roleInfo.role,
        totalUnreadMessages: rooms.reduce(
          (sum, room) => sum + room.unreadCount,
          0
        ),
      },
    });
  } catch (error) {
    debugLog("Error getting user active rooms", { error: error.message });
    console.error("Get user active rooms error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active chat rooms",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// Delete message (soft delete)
const deleteMessage = async (req, res) => {
  debugLog("Delete message request", {
    messageId: req.params.messageId,
    userId: req.user._id,
  });

  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await MessageChat.findById(messageId);

    if (!message) {
      debugLog("Message not found", { messageId });
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId.toString()) {
      debugLog("User not authorized to delete message", {
        userId,
        senderId: message.senderId,
      });
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await message.softDelete(userId);
    debugLog("Message deleted successfully", { messageId });

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    debugLog("Error deleting message", { error: error.message });
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const wallpaperUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for wallpapers
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
}).single("wallpaper");

// Upload custom wallpaper
const uploadWallpaper = async (req, res) => {
  debugLog("Upload wallpaper request", {
    userId: req.user._id,
    hasFile: !!req.file,
  });

  wallpaperUpload(req, res, async (err) => {
    if (err) {
      debugLog("File upload error", { error: err.message });
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No wallpaper file uploaded",
      });
    }

    try {
      debugLog("Uploading wallpaper to Cloudinary", {
        userId: req.user._id,
        fileSize: req.file.size,
      });

      // Upload to Cloudinary from buffer
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "chat-wallpapers",
              public_id: `wallpaper-${req.user._id}-${Date.now()}`,
              overwrite: false,
              resource_type: "auto",
              transformation: [
                { width: 1920, height: 1080, crop: "limit" },
                { quality: "auto:good" },
              ],
            },
            (error, result) => {
              if (result) {
                debugLog("Cloudinary upload successful", {
                  publicId: result.public_id,
                  url: result.secure_url,
                });
                resolve(result);
              } else {
                debugLog("Cloudinary upload failed", { error });
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);
      const wallpaperUrl = result.secure_url;

      debugLog("Wallpaper uploaded successfully", { wallpaperUrl });

      res.json({
        success: true,
        message: "Wallpaper uploaded successfully!",
        wallpaperUrl: wallpaperUrl,
      });
    } catch (error) {
      debugLog("Wallpaper upload error", { error: error.message });
      console.error("Wallpaper upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload wallpaper",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      allowedTypes.test(file.mimetype) || file.mimetype.startsWith("image/");
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
}).single("image");

// Upload image for messages
const uploadMessageImage = async (req, res) => {
  debugLog("Upload message image request", {
    userId: req.user._id,
    hasFile: !!req.file,
  });

  imageUpload(req, res, async (err) => {
    if (err) {
      debugLog("Image upload error", { error: err.message });
      return res.status(400).json({
        success: false,
        message: err.message || "Image upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    try {
      debugLog("Uploading image to Cloudinary", {
        userId: req.user._id,
        fileSize: req.file.size,
        fileName: req.file.originalname,
      });

      // Upload to Cloudinary from buffer
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "chat-images",
              public_id: `message-img-${req.user._id}-${Date.now()}`,
              overwrite: false,
              resource_type: "auto",
              transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto:good" },
              ],
            },
            (error, result) => {
              if (result) {
                debugLog("Cloudinary image upload successful", {
                  publicId: result.public_id,
                  url: result.secure_url,
                });
                resolve(result);
              } else {
                debugLog("Cloudinary image upload failed", { error });
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);

      debugLog("Message image uploaded successfully", {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });

      res.json({
        success: true,
        message: "Image uploaded successfully!",
        data: {
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          imageName: req.file.originalname,
          imageSize: req.file.size,
        },
      });
    } catch (error) {
      debugLog("Message image upload error", { error: error.message });
      console.error("Message image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });
};

// Send image message
const sendImageMessage = async (req, res) => {
  debugLog("Send image message request", {
    roomId: req.params.roomId,
    userId: req.user._id,
  });

  try {
    const { roomId } = req.params;
    const {
      imageUrl,
      imagePublicId,
      imageName,
      imageSize,
      caption = "",
    } = req.body;
    const senderId = req.user._id;

    if (!imageUrl || !imagePublicId) {
      debugLog("Image data not provided");
      return res.status(400).json({
        success: false,
        message: "Image URL and public ID are required",
      });
    }

    // Find room
    const room = await MessageRoom.findById(roomId)
      .populate("learnerId", "userId")
      .populate("mentorId", "userId");

    if (!room) {
      debugLog("Room not found", { roomId });
      return res.status(404).json({
        success: false,
        message: "Chat room not found",
      });
    }

    // Check if room is closed
    if (room.status === "close") {
      debugLog("Attempting to send image to closed room", { roomId });
      return res.status(403).json({
        success: false,
        message: "Cannot send messages to a closed chat room",
      });
    }

    // Determine receiver
    let receiverId;
    let receiverRole;

    if (room.learnerId.userId._id.toString() === senderId.toString()) {
      receiverId = room.mentorId.userId._id;
      receiverRole = "mentor";
      debugLog("Sender is learner, receiver is mentor", { receiverId });
    } else if (room.mentorId.userId._id.toString() === senderId.toString()) {
      receiverId = room.learnerId.userId._id;
      receiverRole = "learner";
      debugLog("Sender is mentor, receiver is learner", { receiverId });
    } else {
      debugLog("User not authorized for this room", {
        senderId,
        learnerUserId: room.learnerId.userId._id,
        mentorUserId: room.mentorId.userId._id,
      });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages in this room",
      });
    }

    // Create and save image message
    const newMessage = new MessageChat({
      roomId: room._id,
      senderId,
      receiverId,
      message: caption.trim(),
      messageType: "image",
      imageUrl,
      imagePublicId,
      imageName,
      imageSize,
      time: new Date(),
    });

    await newMessage.save();
    debugLog("Image message saved", { messageId: newMessage._id });

    // Update room's last message and unread count
    room.lastMessage = {
      content: caption.trim() || "📷 Image",
      timestamp: newMessage.time,
      senderId,
    };
    room.totalMessages += 1;

    // Increment unread count for receiver
    if (receiverRole === "learner") {
      room.learnerUnreadCount += 1;
    } else {
      room.mentorUnreadCount += 1;
    }

    await room.save();
    debugLog("Room updated with last message and unread count");

    // Populate sender info for response
    await newMessage.populate("senderId", "name avatar email");
    await newMessage.populate("receiverId", "name avatar email");

    res.status(201).json({
      success: true,
      message: "Image message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    debugLog("Error sending image message", { error: error.message });
    console.error("Send image message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send image message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getRecentMessages = async (req, res) => {
  debugLog("Get recent messages request", {
    userId: req.user._id,
  });

  try {
    const userId = req.user._id;

    // Get recent 2 messages where current user is the receiver
    const recentMessages = await MessageChat.find({
      receiverId: userId,
      isDeleted: false,
    })
      .populate("senderId", "name avatar email")
      .populate("receiverId", "name avatar email")
      .populate({
        path: "roomId",
        select: "roomName status",
      })
      .sort({ time: -1 })
      .limit(2) // Changed from 3 to 2 as requested
      .lean();

    debugLog("Recent messages fetched", {
      count: recentMessages.length,
      userId,
    });

    // Transform messages to include additional info
    const transformedMessages = recentMessages.map((message) => {
      // Calculate time ago
      const timeAgo = getTimeAgo(message.time);

      // Determine if sender is online (you can implement this logic based on your needs)
      const isOnline = Math.random() > 0.5; // Placeholder logic

      return {
        id: message._id,
        senderName: message.senderId.name,
        senderImage: message.senderId.avatar
          ? message.senderId.avatar.startsWith("/uploads/")
            ? `${process.env.API_BASE_URL || "http://localhost:5000"}${
                message.senderId.avatar
              }`
            : message.senderId.avatar
          : null,
        message:
          message.messageType === "image"
            ? message.message
              ? message.message
              : "📷 Image"
            : message.message,
        timestamp: timeAgo,
        isOnline,
        isUnread: !message.isRead,
        messageType: message.messageType,
        roomName: message.roomId?.roomName,
        time: message.time,
      };
    });

    res.json({
      success: true,
      data: transformedMessages,
      count: transformedMessages.length,
    });
  } catch (error) {
    debugLog("Error fetching recent messages", { error: error.message });
    console.error("Get recent messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const messageTime = new Date(date);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    return messageTime.toLocaleDateString();
  }
};

module.exports = {
  // Room management
  createRoomForProject,
  closeRoomForProject,
  getRoomDetails,
  getRecentMessages,

  // Message operations
  sendMessage,
  fetchMessages,
  checkNewMessages,
  deleteMessage,

  //Image message operation
  uploadMessageImage,
  sendImageMessage,

  // Room fetching
  fetchLearnerRooms,
  fetchMentorRooms,
  getUserActiveRooms,

  // Settings
  updateWallpaper,
  uploadWallpaper,

  // Helper functions (exported for use in other modules)
  getUserDetailsFromProfile,
  getUserRoleAndProfileId,
};
