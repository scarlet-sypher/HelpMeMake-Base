const LearnerTimeline = require("../Model/LearnerTimeline");
const Project = require("../Model/Project");
const Achievement = require("../Model/Achievement");
const Milestone = require("../Model/Milestone");
const Session = require("../Model/Session");
const Learner = require("../Model/Learner");

const getLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;
    //debug - Print learnerId being fetched

    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);

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

const updateLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    //debug - Print logged in user ID

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;
    //debug - Print learnerId being updated

    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);

    const newCounts = await getCurrentCounts(learnerId);

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
    console.error("Error updating learner timeline:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update timeline",
      error: error.message,
    });
  }
};

const getCurrentCounts = async (learnerId) => {
  try {
    //debug - Print learnerId for count calculation

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

    if (projects.open === undefined) projects.open = 0;
    if (projects.inprogress !== undefined) {
      projects.inProgress = projects.inprogress;
      delete projects.inprogress;
    }

    const achievement = await Achievement.findOne({ learner: learnerId });
    const achievements = {
      total: achievement ? achievement.totalAchievements : 0,
      level: achievement ? achievement.level : 0,
      xp: achievement ? achievement.xp : 0,
    };

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

      if (statusKey === "notstarted") statusKey = "notStarted";
      if (statusKey === "inprogress") statusKey = "inProgress";
      if (statusKey === "pendingreview") statusKey = "pendingReview";

      if (milestones.hasOwnProperty(statusKey)) {
        milestones[statusKey] = item.count;
      }
      milestones.total += item.count;
    });

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

    return result;
  } catch (error) {
    console.error("Error getting current counts:", error);
    throw error;
  }
};

const refreshLearnerTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const learnerId = learner._id;

    //debug - Print refresh operation

    await LearnerTimeline.deleteOne({ learnerId });

    const timeline = await LearnerTimeline.findOrCreateByLearner(learnerId);
    const currentCounts = await getCurrentCounts(learnerId);

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
