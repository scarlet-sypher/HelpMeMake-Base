const Session = require("../Model/Session");
const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

// Create a new session
const createSession = async (req, res) => {
  try {
    console.log("=== CREATE SESSION DEBUG ===");
    console.log("User from req.user:", req.user);
    console.log("Request body:", req.body);

    const {
      title,
      topic,
      description,
      sessionType,
      scheduledAt,
      prerequisites,
      meetingLink,
    } = req.body;

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can create sessions",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find active project for this mentor
    const activeProject = await Project.findOne({
      mentorId: mentorProfile._id,
      status: "In Progress",
    }).populate("learnerId");

    if (!activeProject) {
      return res.status(404).json({
        success: false,
        message: "No active project found to schedule session for",
      });
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session must be scheduled for a future date and time",
      });
    }

    // Create session
    const session = new Session({
      title: title.trim(),
      topic: topic.trim(),
      description: description || "",
      sessionType: sessionType || "one-on-one",
      scheduledAt: scheduledDate,
      prerequisites: prerequisites || "",
      meetingLink: meetingLink || "",
      status: "scheduled",
      learnerId: activeProject.learnerId._id,
      mentorId: mentorProfile._id,
      projectId: activeProject._id,
    });

    await session.save();

    // Populate session with required data
    const populatedSession = await Session.findById(session._id)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    console.log("Session created successfully");

    res.status(201).json({
      success: true,
      session: populatedSession,
      message: "Session scheduled successfully",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
};

// Get all sessions for a mentor
const getMentorSessions = async (req, res) => {
  try {
    console.log("=== GET MENTOR SESSIONS DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Mentor role required.",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Get active project
    const activeProject = await Project.findOne({
      mentorId: mentorProfile._id,
      status: "In Progress",
    }).populate({
      path: "learnerId",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    });

    // Get all sessions for this mentor
    const sessions = await Session.find({
      mentorId: mentorProfile._id,
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription status")
      .sort({ scheduledAt: -1 })
      .lean();

    // Check for expired sessions and update them
    const now = new Date();
    const expiredSessions = sessions.filter((session) => {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);
      return (
        now > tenMinutesAfter &&
        session.status === "scheduled" &&
        (!session.isLearnerPresent || !session.isMentorPresent)
      );
    });

    // Update expired sessions
    for (let expiredSession of expiredSessions) {
      await Session.findByIdAndUpdate(expiredSession._id, {
        status: "expired",
      });
      expiredSession.status = "expired";
    }

    console.log("Active project found:", activeProject ? "YES" : "NO");
    console.log("Sessions found:", sessions.length);

    res.json({
      success: true,
      activeProject,
      sessions,
      hasActiveProject: !!activeProject,
      totalSessions: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching mentor sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can update sessions",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find and update session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Don't allow updating completed or cancelled sessions
    if (session.status === "completed" || session.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${session.status} sessions`,
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "topic",
      "description",
      "sessionType",
      "prerequisites",
      "meetingLink",
    ];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        session[field] = updates[field];
      }
    });

    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update session",
      error: error.message,
    });
  }
};

// Delete session
const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can delete sessions",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Only allow deletion of cancelled sessions
    if (session.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled sessions can be deleted",
      });
    }

    await Session.findByIdAndDelete(sessionId);

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error: error.message,
    });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can mark attendance",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Mark mentor as present
    session.isMentorPresent = true;

    // If both are present, mark as completed
    if (session.isLearnerPresent && session.isMentorPresent) {
      session.status = "completed";
    }

    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Reschedule session
const rescheduleSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { scheduledAt } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can reschedule sessions",
      });
    }

    // Validate new scheduled time
    const newScheduledDate = new Date(scheduledAt);
    if (newScheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session must be rescheduled for a future date and time",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Update session
    session.scheduledAt = newScheduledDate;
    session.status = "rescheduled";
    session.isMentorPresent = false;
    session.isLearnerPresent = false;

    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Session rescheduled successfully",
    });
  } catch (error) {
    console.error("Error rescheduling session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reschedule session",
      error: error.message,
    });
  }
};

// Update session status
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, reason } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can update session status",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Update status
    session.status = status;

    if (status === "cancelled" && reason) {
      session.mentorReason = reason;
    }

    if (status === "expired" && reason) {
      session.expireReason = reason;
    }

    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: `Session ${status} successfully`,
    });
  } catch (error) {
    console.error("Error updating session status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update session status",
      error: error.message,
    });
  }
};

const getUserSessions = async (req, res) => {
  try {
    console.log("=== GET USER SESSIONS DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User role required.",
      });
    }

    // Find learner profile
    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // Get all sessions for this learner grouped by project
    const sessions = await Session.find({
      learnerId: learnerProfile._id,
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate(
        "projectId",
        "name shortDescription status startDate expectedEndDate"
      )
      .sort({ scheduledAt: -1 })
      .lean();

    // Check for expired sessions and update them
    const now = new Date();
    const expiredSessions = sessions.filter((session) => {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);
      return (
        now > tenMinutesAfter &&
        session.status === "scheduled" &&
        (!session.isLearnerPresent || !session.isMentorPresent)
      );
    });

    // Update expired sessions
    for (let expiredSession of expiredSessions) {
      await Session.findByIdAndUpdate(expiredSession._id, {
        status: "expired",
      });
      expiredSession.status = "expired";
    }

    // Group sessions by project
    const sessionsByProject = sessions.reduce((acc, session) => {
      const projectId = session.projectId._id.toString();
      if (!acc[projectId]) {
        acc[projectId] = {
          project: session.projectId,
          mentor: session.mentorId,
          sessions: [],
        };
      }
      acc[projectId].sessions.push(session);
      return acc;
    }, {});

    // Sort sessions within each project by scheduled date
    Object.values(sessionsByProject).forEach((projectData) => {
      projectData.sessions.sort(
        (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
      );
    });

    console.log("Sessions found:", sessions.length);
    console.log(
      "Projects with sessions:",
      Object.keys(sessionsByProject).length
    );

    res.json({
      success: true,
      sessionsByProject,
      totalSessions: sessions.length,
      hasActiveSessions: sessions.some((s) => s.status === "scheduled"),
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

// Mark user attendance for a session
const markUserAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can mark their attendance",
      });
    }

    // Find learner profile
    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      learnerId: learnerProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Check if session is scheduled and not expired
    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

    if (now > tenMinutesAfter) {
      return res.status(400).json({
        success: false,
        message: "Session has expired. Cannot mark attendance.",
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Can only join scheduled sessions",
      });
    }

    // Mark learner as present
    session.isLearnerPresent = true;
    session.learnerAttendedAt = now;

    // If both are present, mark as completed
    if (session.isLearnerPresent && session.isMentorPresent) {
      session.status = "completed";
    }

    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Error marking user attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Submit learner absence reason
const submitLearnerReason = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can submit absence reasons",
      });
    }

    // Find learner profile
    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      learnerId: learnerProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Only allow reason submission for expired sessions
    if (session.status !== "expired") {
      return res.status(400).json({
        success: false,
        message: "Can only submit reasons for expired sessions",
      });
    }

    // Update learner reason
    session.learnerReason = reason;
    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Absence reason submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting learner reason:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit reason",
      error: error.message,
    });
  }
};

// Submit mentor absence reason
const submitMentorReason = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can submit absence reasons",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Only allow reason submission for expired sessions
    if (session.status !== "expired") {
      return res.status(400).json({
        success: false,
        message: "Can only submit reasons for expired sessions",
      });
    }

    // Update mentor reason
    session.mentorReason = reason;
    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Absence reason submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting mentor reason:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit reason",
      error: error.message,
    });
  }
};

// Update recording link
const updateRecordingLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { recordingLink } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can update recording links",
      });
    }

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Find session
    const session = await Session.findOne({
      _id: sessionId,
      mentorId: mentorProfile._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or access denied",
      });
    }

    // Only allow updating for completed sessions
    if (session.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only update recording links for completed sessions",
      });
    }

    // Update recording link
    session.recordingLink = recordingLink;
    await session.save();

    const updatedSession = await Session.findById(sessionId)
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      session: updatedSession,
      message: "Recording link updated successfully",
    });
  } catch (error) {
    console.error("Error updating recording link:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update recording link",
      error: error.message,
    });
  }
};

// Background job to update session statuses
const updateSessionStatuses = async () => {
  try {
    const now = new Date();

    // Find sessions that should be marked as ongoing
    const scheduledSessions = await Session.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    // Update scheduled sessions to ongoing
    for (let session of scheduledSessions) {
      session.status = "ongoing";
      await session.save();
      console.log(`Session ${session._id} marked as ongoing`);
    }

    // Find ongoing sessions that should be expired (10 minutes after scheduled time)
    const ongoingSessions = await Session.find({
      status: "ongoing",
    });

    for (let session of ongoingSessions) {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

      if (now > tenMinutesAfter) {
        // Check if both participants joined
        if (session.isLearnerPresent && session.isMentorPresent) {
          session.status = "completed";
          console.log(`Session ${session._id} marked as completed`);
        } else {
          session.status = "expired";
          console.log(`Session ${session._id} marked as expired`);
        }
        await session.save();
      }
    }
  } catch (error) {
    console.error("Error updating session statuses:", error);
  }
};

module.exports = {
  createSession,
  getMentorSessions,
  updateSession,
  deleteSession,
  markAttendance,
  rescheduleSession,
  updateSessionStatus,
  getUserSessions,
  markUserAttendance,
  submitLearnerReason,
  submitMentorReason,
  updateRecordingLink,
  updateSessionStatuses,
};
