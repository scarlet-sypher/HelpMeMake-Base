const LearnerTimeline = require("../Model/LearnerTimeline");
const Project = require("../Model/Project");
const Achievement = require("../Model/Achievement");
const Milestone = require("../Model/Milestone");
const Session = require("../Model/Session");
const Learner = require("../Model/Learner");

// Get timeline data for learner
const getLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID
    console.log("//debug - Logged in userId:", userId);

    // Find learner by userId
    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;
    //debug - Print learnerId being fetched
    console.log("//debug - LearnerId being fetched:", learnerId);

    // Find or create timeline
    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);

    //debug - Print current timeline events count
    console.log(
      "//debug - Current timeline events count:",
      timeline.events.length
    );

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

    // //debug - Print selected timeline events
    // console.log("//debug - Selected timeline events:", recentEvents.length);
    // recentEvents.slice(0, 5).forEach((event, index) => {
    //   console.log(`//debug - Recent event ${index + 1}:`, event.message);
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
    console.error("Error fetching learner timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch timeline data",
      error: error.message,
    });
  }
};

// Update timeline by checking all schemas for changes
const updateLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID
    // console.log("//debug - Update timeline for userId:", userId);

    // Find learner by userId
    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;
    //debug - Print learnerId being updated
    // console.log("//debug - LearnerId being updated:", learnerId);

    // Find or create timeline
    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);

    // Get current counts from all schemas
    const newCounts = await getCurrentCounts(learnerId);

    //debug - Print old and new counts
    // console.log(
    //   "//debug - Old counts from timeline:",
    //   JSON.stringify(timeline.latestCounts, null, 2)
    // );
    // console.log(
    //   "//debug - New counts calculated:",
    //   JSON.stringify(newCounts, null, 2)
    // );

    // Update timeline and detect changes
    await timeline.updateAndDetectChanges(newCounts);

    //debug - Print created timeline events
    // console.log("//debug - Timeline updated successfully");

    return res.status(200).json({
      success: true,
      message: "Timeline updated successfully",
      data: {
        eventsCount: timeline.events.length,
        latestCounts: timeline.latestCounts,
      },
    });
  } catch (error) {
    console.error("Error updating learner timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update timeline",
      error: error.message,
    });
  }
};

// Helper function to get current counts from all schemas
const getCurrentCounts = async (learnerId) => {
  try {
    //debug - Print learnerId for count calculation
    // console.log("//debug - Calculating counts for learnerId:", learnerId);

    // Get project counts
    const projectCounts = await Project.aggregate([
      { $match: { learnerId } },
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
      projects[status.toLowerCase().replace(" ", "")] = item.count;
      projects.total += item.count;
    });

    // Handle "Open" status mapping
    if (projects.open === undefined) projects.open = 0;
    if (projects.inprogress !== undefined) {
      projects.inProgress = projects.inprogress;
      delete projects.inprogress;
    }

    // Get achievement data
    const achievement = await Achievement.findOne({ learner: learnerId });
    const achievements = {
      total: achievement ? achievement.totalAchievements : 0,
      level: achievement ? achievement.level : 0,
      xp: achievement ? achievement.xp : 0,
    };

    // Get milestone counts
    const milestoneCounts = await Milestone.aggregate([
      { $match: { learnerId } },
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
      { $match: { learnerId } },
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
      achievements,
      milestones,
      sessions,
    };

    //debug - Print calculated counts
    // console.log("//debug - Calculated project counts:", projects);
    // console.log("//debug - Calculated achievement counts:", achievements);
    // console.log("//debug - Calculated milestone counts:", milestones);
    // console.log("//debug - Calculated session counts:", sessions);

    return result;
  } catch (error) {
    console.error("Error getting current counts:", error);
    throw error;
  }
};

// Force refresh timeline - recalculates everything from scratch
const refreshLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find learner by userId
    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;

    //debug - Print refresh operation
    // console.log(
    //   "//debug - Force refreshing timeline for learnerId:",
    //   learnerId
    // );

    // Delete existing timeline to start fresh
    await LearnerTimeline.deleteOne({ learnerId });

    // Create new timeline with current counts
    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);
    const currentCounts = await getCurrentCounts(learnerId);

    // Update counts without creating events (since this is initial setup)
    timeline.latestCounts = currentCounts;
    timeline.lastUpdated = new Date();
    await timeline.save();

    //debug - Print refresh completion
    // console.log("//debug - Timeline refreshed successfully");

    return res.status(200).json({
      success: true,
      message: "Timeline refreshed successfully",
      data: {
        latestCounts: timeline.latestCounts,
        eventsCount: timeline.events.length,
      },
    });
  } catch (error) {
    console.error("Error refreshing learner timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh timeline",
      error: error.message,
    });
  }
};

module.exports = {
  getLearnerTimeline,
  updateLearnerTimeline,
  refreshLearnerTimeline,
};
