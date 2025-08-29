const MentorTimeline = require("../Model/MentorTimeline");
const Project = require("../Model/Project");
const Milestone = require("../Model/Milestone");
const Session = require("../Model/Session");
const Mentor = require("../Model/Mentor");

// Get timeline data for mentor
const getMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID
    // console.log("//debug - Mentor Logged in userId:", userId);

    // Find mentor by userId
    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;
    //debug - Print mentorId being fetched
    // console.log("//debug - MentorId being fetched:", mentorId);

    // Find or create timeline
    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);

    //debug - Print current timeline events count
    // console.log(
    //   "//debug - Mentor Current timeline events count:",
    //   timeline.events.length
    // );

    // Get recent events (last 50)
    const recentEvents = timeline.events.slice(0, 50).map((event) => ({
      id: event._id,
      type: event.type,
      message: event.message,
      icon: event.icon,
      color: event.color,
      createdAt: event.createdAt,
      relatedEntityId: event.relatedEntityId,
      relatedEntityType: event.relatedEntityType,
      metadata: event.metadata,
    }));

    //debug - Print selected timeline events
    // console.log(
    //   "//debug - Mentor Selected timeline events:",
    //   recentEvents.length
    // );
    // recentEvents.slice(0, 5).forEach((event, index) => {
    //   console.log(`//debug - Mentor Recent event ${index + 1}:`, event.message);
    // });

    return res.status(200).json({
      success: true,
      data: {
        events: recentEvents,
        totalEvents: timeline.events.length,
        lastUpdated: timeline.lastUpdated,
        latestCounts: timeline.latestCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching mentor timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timeline data",
      error: error.message,
    });
  }
};

// Update timeline by checking all schemas for changes
const updateMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID
    // console.log("//debug - Mentor Update timeline for userId:", userId);

    // Find mentor by userId
    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;
    //debug - Print mentorId being updated
    // console.log("//debug - MentorId being updated:", mentorId);

    // Find or create timeline
    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);

    // Get current counts from all schemas
    const newCounts = await getCurrentMentorCounts(mentorId);

    //debug - Print old and new counts
    // console.log(
    //   "//debug - Mentor Old counts from timeline:",
    //   JSON.stringify(timeline.latestCounts, null, 2)
    // );
    // console.log(
    //   "//debug - Mentor New counts calculated:",
    //   JSON.stringify(newCounts, null, 2)
    // );

    // Update timeline and detect changes
    await timeline.updateAndDetectChanges(newCounts);

    //debug - Print created timeline events
    // console.log("//debug - Mentor Timeline updated successfully");

    return res.status(200).json({
      success: true,
      message: "Timeline updated successfully",
      data: {
        eventsCount: timeline.events.length,
        latestCounts: timeline.latestCounts,
      },
    });
  } catch (error) {
    console.error("Error updating mentor timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update timeline",
      error: error.message,
    });
  }
};

// Force refresh timeline - recalculates everything from scratch
const refreshMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find mentor by userId
    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;

    //debug - Print refresh operation
    // console.log(
    //   "//debug - Mentor Force refreshing timeline for mentorId:",
    //   mentorId
    // );

    // Delete existing timeline to start fresh
    await MentorTimeline.deleteOne({ mentorId });

    // Create new timeline with current counts
    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);
    const currentCounts = await getCurrentMentorCounts(mentorId);

    // Update counts without creating events (since this is initial setup)
    timeline.latestCounts = currentCounts;
    timeline.lastUpdated = new Date();
    await timeline.save();

    //debug - Print refresh completion
    // console.log("//debug - Mentor Timeline refreshed successfully");

    return res.status(200).json({
      success: true,
      message: "Timeline refreshed successfully",
      data: {
        latestCounts: timeline.latestCounts,
        eventsCount: timeline.events.length,
      },
    });
  } catch (error) {
    console.error("Error refreshing mentor timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh timeline",
      error: error.message,
    });
  }
};

// Helper function to get current counts from all schemas
const getCurrentMentorCounts = async (mentorId) => {
  try {
    //debug - Print mentorId for count calculation
    // console.log("//debug - Mentor Calculating counts for mentorId:", mentorId);

    // Get project counts
    const projectCounts = await Project.aggregate([
      { $match: { mentorId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const projects = {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    projectCounts.forEach((item) => {
      const status = item._id;
      let statusKey = status.toLowerCase().replace(/\s+/g, "");

      // Map status names to our schema keys
      if (statusKey === "inprogress") statusKey = "inProgress";

      if (projects.hasOwnProperty(statusKey)) {
        projects[statusKey] = item.count;
      }
      projects.total += item.count;
    });

    // Get milestone counts
    const milestoneCounts = await Milestone.aggregate([
      { $match: { mentorId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const milestones = {
      total: 0,
      notStarted: 0,
      inProgress: 0,
      pendingReview: 0,
      completed: 0,
      blocked: 0,
    };

    milestoneCounts.forEach((item) => {
      const status = item._id;
      let statusKey = status.toLowerCase().replace(/\s+/g, "");

      // Map status names to our schema keys
      if (statusKey === "notstarted") statusKey = "notStarted";
      if (statusKey === "inprogress") statusKey = "inProgress";
      if (statusKey === "pendingreview") statusKey = "pendingReview";

      if (milestones.hasOwnProperty(statusKey)) {
        milestones[statusKey] = item.count;
      }
      milestones.total += item.count;
    });

    // Get session counts
    const sessionCounts = await Session.aggregate([
      { $match: { mentorId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const sessions = {
      total: 0,
      scheduled: 0,
      completed: 0,
      ongoing: 0,
      cancelled: 0,
      rescheduled: 0,
      expired: 0,
    };

    sessionCounts.forEach((item) => {
      const status = item._id;
      const statusKey = status.toLowerCase();
      if (sessions.hasOwnProperty(statusKey)) {
        sessions[statusKey] = item.count;
      }
      sessions.total += item.count;
    });

    const result = {
      projects,
      milestones,
      sessions,
    };

    //debug - Print calculated counts
    // console.log("//debug - Mentor Calculated project counts:", projects);
    // console.log("//debug - Mentor Calculated milestone counts:", milestones);
    // console.log("//debug - Mentor Calculated session counts:", sessions);

    return result;
  } catch (error) {
    console.error("Error getting mentor current counts:", error);
    throw error;
  }
};

module.exports = {
  getMentorTimeline,
  updateMentorTimeline,
  refreshMentorTimeline,
};
