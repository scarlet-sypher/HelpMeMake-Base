const MentorTimeline = require("../Model/MentorTimeline");
const Project = require("../Model/Project");
const Milestone = require("../Model/Milestone");
const Session = require("../Model/Session");
const Mentor = require("../Model/Mentor");

const getMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;
    //debug - Print mentorId being fetched

    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);

    //debug - Print current timeline events count

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

const updateMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;
    //debug - Print mentorId being updated

    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);

    const newCounts = await getCurrentMentorCounts(mentorId);

    //debug - Print old and new counts

    await timeline.updateAndDetectChanges(newCounts);

    //debug - Print created timeline events

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

const refreshMentorTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const mentorId = mentor._id;

    //debug - Print refresh operation

    await MentorTimeline.deleteOne({ mentorId });

    const timeline = await MentorTimeline.findOrCreateByMentor(mentorId);
    const currentCounts = await getCurrentMentorCounts(mentorId);

    timeline.latestCounts = currentCounts;
    timeline.lastUpdated = new Date();
    await timeline.save();

    //debug - Print refresh completion

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

const getCurrentMentorCounts = async (mentorId) => {
  try {
    //debug - Print mentorId for count calculation

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

      if (statusKey === "inprogress") statusKey = "inProgress";

      if (projects.hasOwnProperty(statusKey)) {
        projects[statusKey] = item.count;
      }
      projects.total += item.count;
    });

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

      if (statusKey === "notstarted") statusKey = "notStarted";
      if (statusKey === "inprogress") statusKey = "inProgress";
      if (statusKey === "pendingreview") statusKey = "pendingReview";

      if (milestones.hasOwnProperty(statusKey)) {
        milestones[statusKey] = item.count;
      }
      milestones.total += item.count;
    });

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
