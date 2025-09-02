const Session = require("../Model/Session");
const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session must be scheduled for a future date and time",
      });
    }

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

    await Mentor.findByIdAndUpdate(mentorProfile._id, {
      $inc: {
        userSessionsScheduled: 1,
        userSessionsScheduledChange: 1,
      },
    });

    await Learner.findByIdAndUpdate(activeProject.learnerId._id, {
      $inc: {
        userSessionsScheduled: 1,
        userSessionsScheduledChange: 1,
      },
    });

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

const getLearnerSessions = async (req, res) => {
  try {
    console.log("=== GET LEARNER SESSIONS DEBUG ===");
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

    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const activeProject = await Project.findOne({
      learnerId: learnerProfile._id,
      status: "In Progress",
    }).populate({
      path: "mentorId",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    });

    if (!activeProject) {
      return res.json({
        success: true,
        sessions: [],
        hasActiveProject: false,
        totalSessions: 0,
      });
    }

    const now = new Date();

    const allSessions = await Session.find({
      learnerId: learnerProfile._id,
      projectId: activeProject._id,
    })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("projectId", "name shortDescription status")
      .sort({ scheduledAt: 1 })
      .lean();

    const upcomingSessions = allSessions.filter((session) => {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

      if (
        now > tenMinutesAfter &&
        session.status === "scheduled" &&
        (!session.isLearnerPresent || !session.isMentorPresent)
      ) {
        session.status = "expired";
        return false;
      }

      return (
        sessionTime >= now &&
        ["scheduled", "rescheduled", "ongoing"].includes(session.status)
      );
    });

    const sessions = upcomingSessions.slice(0, 3);

    const expiredSessions = allSessions.filter((session) => {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);
      return (
        now > tenMinutesAfter &&
        session.status === "scheduled" &&
        (!session.isLearnerPresent || !session.isMentorPresent)
      );
    });

    for (let expiredSession of expiredSessions) {
      await Session.findByIdAndUpdate(expiredSession._id, {
        status: "expired",
      });
    }

    console.log("Active project found:", activeProject ? "YES" : "NO");
    console.log("Total sessions found:", allSessions.length);
    console.log("Upcoming sessions after filtering:", sessions.length);

    res.json({
      success: true,
      sessions,
      hasActiveProject: true,
      totalSessions: sessions.length,
      activeProject,
    });
  } catch (error) {
    console.error("Error fetching learner sessions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    if (session.status === "completed" || session.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${session.status} sessions`,
      });
    }

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    if (session.status !== "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled sessions can be deleted",
      });
    }

    await Session.findByIdAndDelete(sessionId);

    await Mentor.findByIdAndUpdate(mentorProfile._id, {
      $inc: {
        userSessionsScheduled: -1,
        userSessionsScheduledChange: -1,
      },
    });

    await Learner.findByIdAndUpdate(session.learnerId, {
      $inc: {
        userSessionsScheduled: -1,
        userSessionsScheduledChange: -1,
      },
    });

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    session.isMentorPresent = true;

    if (session.isLearnerPresent && session.isMentorPresent) {
      session.status = "completed";

      await Mentor.findByIdAndUpdate(mentorProfile._id, {
        $inc: {
          completedSessions: 1,
          mentorSessionsCompleted: 1,
          mentorSessionsCompletedChange: 1,
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });

      await Learner.findByIdAndUpdate(session.learnerId, {
        $inc: {
          completedSessions: 1,
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });
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

    const newScheduledDate = new Date(scheduledAt);
    if (newScheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session must be rescheduled for a future date and time",
      });
    }

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    session.status = status;

    if (status === "cancelled" && reason) {
      session.mentorReason = reason;
      await Mentor.findByIdAndUpdate(mentorProfile._id, {
        $inc: {
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });

      await Learner.findByIdAndUpdate(session.learnerId, {
        $inc: {
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });
    }

    if (status === "expired" && reason) {
      session.expireReason = reason;

      await Mentor.findByIdAndUpdate(mentorProfile._id, {
        $inc: {
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });

      await Learner.findByIdAndUpdate(session.learnerId, {
        $inc: {
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });
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

    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

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

    for (let expiredSession of expiredSessions) {
      await Session.findByIdAndUpdate(expiredSession._id, {
        status: "expired",
      });
      expiredSession.status = "expired";
    }

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

    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

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

    session.isLearnerPresent = true;
    session.learnerAttendedAt = now;

    if (session.isLearnerPresent && session.isMentorPresent) {
      session.status = "completed";

      await Mentor.findByIdAndUpdate(session.mentorId, {
        $inc: {
          completedSessions: 1,
          mentorSessionsCompleted: 1,
          mentorSessionsCompletedChange: 1,
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });

      await Learner.findByIdAndUpdate(learnerProfile._id, {
        $inc: {
          completedSessions: 1,
          userSessionsScheduled: -1,
          userSessionsScheduledChange: -1,
        },
      });
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

    const learnerProfile = await Learner.findOne({ userId });
    if (!learnerProfile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

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

    if (session.status !== "expired") {
      return res.status(400).json({
        success: false,
        message: "Can only submit reasons for expired sessions",
      });
    }

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    if (session.status !== "expired") {
      return res.status(400).json({
        success: false,
        message: "Can only submit reasons for expired sessions",
      });
    }

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

    const mentorProfile = await Mentor.findOne({ userId });
    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

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

    if (session.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only update recording links for completed sessions",
      });
    }

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

const updateSessionStatuses = async () => {
  try {
    const now = new Date();

    const scheduledSessions = await Session.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    for (let session of scheduledSessions) {
      session.status = "ongoing";
      await session.save();
      console.log(`Session ${session._id} marked as ongoing`);
    }

    const ongoingSessions = await Session.find({
      status: "ongoing",
    });

    for (let session of ongoingSessions) {
      const sessionTime = new Date(session.scheduledAt);
      const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

      if (now > tenMinutesAfter) {
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
  getLearnerSessions,
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
