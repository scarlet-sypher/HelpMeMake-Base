//===================================================================
//=====================This is mentor myApprenticeController============
//===================================================================

const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");
const { finalizeProjectCompletion } = require("./completionController");

const getApprenticeProjectData = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      mentorId: mentor._id,
      status: "In Progress",
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ updatedAt: -1 })
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No active project with apprentice found",
      });
    }

    const learnerData = {
      ...project.learnerId.userId,
      ...project.learnerId,
    };

    res.json({
      success: true,
      project: project,
      apprentice: learnerData,
    });
  } catch (error) {
    console.error("Error fetching apprentice project data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch apprentice project data",
    });
  }
};

const setTempExpectedEndDate = async (req, res) => {
  try {
    const { projectId, date } = req.body;
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id,
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    if (project.expectedEndDate && project.isTempEndDateConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Expected end date is already set and confirmed",
      });
    }

    const tempDate = new Date(date);
    if (tempDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "End date must be in the future",
      });
    }

    project.tempExpectedEndDate = tempDate;
    project.isTempEndDateConfirmed = false;

    await project.save();

    res.json({
      success: true,
      message: "Temporary end date set. Waiting for apprentice confirmation.",
      project: project,
    });
  } catch (error) {
    console.error("Error setting temp end date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to set expected end date",
    });
  }
};

const updateProjectProgress = async (req, res) => {
  try {
    const { projectId, percentage, note } = req.body;
    const userId = req.user._id;

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        message: "Progress percentage must be between 0 and 100",
      });
    }

    if (!note || note.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Progress note is required",
      });
    }

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id,
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    if (percentage < project.trackerPercentage) {
      return res.status(400).json({
        success: false,
        message: "Progress can only be increased, not decreased",
      });
    }

    const trackerUpdate = {
      percentage: percentage,
      note: note.trim(),
      date: new Date(),
      updatedBy: userId,
    };

    project.trackerHistory.push(trackerUpdate);
    project.trackerPercentage = percentage;
    project.lastTrackerUpdate = new Date();

    await project.save();

    res.json({
      success: true,
      message: "Progress updated successfully",
      project: project,
      trackerUpdate: trackerUpdate,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

const sendCompletionRequest = async (req, res) => {
  try {
    const { projectId, type } = req.body;
    const userId = req.user._id;

    if (!["complete", "cancel"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request type",
      });
    }

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id,
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    if (project.completionRequest?.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "There is already a pending request for this project",
      });
    }

    project.completionRequest = {
      from: "mentor",
      type: type,
      status: "pending",
      requestedAt: new Date(),
      requestedBy: userId,
    };

    await project.save();

    res.json({
      success: true,
      message: `${
        type === "complete" ? "Completion" : "Cancellation"
      } request sent to apprentice`,
      project: project,
    });
  } catch (error) {
    console.error("Error sending completion request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send completion request",
    });
  }
};

const submitApprenticeReview = async (req, res) => {
  try {
    const { projectId, reviewData } = req.body;
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id,
      $or: [
        { status: "Completed" },
        { "completionRequest.status": "approved" },
      ],
    }).populate("learnerId");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or not ready for review",
      });
    }

    if (project.mentorReview && project.mentorReview.rating) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted",
      });
    }

    const {
      communication,
      commitment,
      learningAttitude,
      responsiveness,
      overallExperience,
    } = reviewData;
    const averageRating =
      (communication +
        commitment +
        learningAttitude +
        responsiveness +
        overallExperience) /
      5;

    project.mentorReview = {
      rating: parseFloat(averageRating.toFixed(1)),
      comment: reviewData.comment || "",
      reviewDate: new Date(),
      breakdown: {
        communication,
        commitment,
        learningAttitude,
        responsiveness,
        overallExperience,
      },
    };

    await project.save();

    const learnerProfile = await Learner.findOne({
      _id: project.learnerId,
    });

    if (learnerProfile) {
      const allProjects = await Project.find({
        learnerId: project.learnerId,
        "mentorReview.rating": { $exists: true },
      });

      if (allProjects.length > 0) {
        const totalRating = allProjects.reduce(
          (sum, p) => sum + p.mentorReview.rating,
          0
        );
        const newAverageRating = totalRating / allProjects.length;

        learnerProfile.rating = parseFloat(newAverageRating.toFixed(1));
        await learnerProfile.save();
      }
    }

    if (project.status === "Completed") {
      await Learner.findByIdAndUpdate(project.learnerId, {
        $inc: {
          userTotalProjects: 1,
          userTotalProjectsChange: 1,
          userActiveProjects: -1,
          userActiveProjectsChange: -1,
        },
      });

      const closingPrice =
        project.closingPrice ||
        project.negotiatedPrice ||
        project.openingPrice ||
        0;
      await Mentor.findByIdAndUpdate(mentor._id, {
        $inc: {
          mentorTotalEarnings: closingPrice,
          mentorTotalEarningsChange: closingPrice,
          mentorActiveStudents: -1,
          mentorActiveStudentsChange: -1,
          totalStudents: 1,
        },
      });
    }

    await finalizeProjectCompletion(projectId);

    res.json({
      success: true,
      message: "Apprentice review submitted successfully",
      averageRating: parseFloat(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Error submitting apprentice review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

const getProgressHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const trackerHistory = project.trackerHistory || [];

    res.json({
      success: true,
      trackerHistory: trackerHistory.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
    });
  } catch (error) {
    console.error("Error fetching progress history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress history",
    });
  }
};

const getCompletionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const projects = await Project.find({
      mentorId: mentor._id,
      "completionRequest.status": { $in: ["pending", "approved", "rejected"] },
    })
      .populate("learnerId", "name email avatar")
      .sort({ "completionRequest.requestedAt": -1 });

    const requests = projects.map((project) => ({
      projectId: project._id,
      projectName: project.name,
      apprentice: project.learnerId,
      request: project.completionRequest,
      projectStatus: project.status,
    }));

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching completion requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completion requests",
    });
  }
};

module.exports = {
  getApprenticeProjectData,
  setTempExpectedEndDate,
  updateProjectProgress,
  sendCompletionRequest,
  submitApprenticeReview,
  getProgressHistory,
  getCompletionRequests,
};
