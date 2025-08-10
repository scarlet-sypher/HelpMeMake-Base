//===================================================================
//=====================This is mentor myApprenticeController============
//===================================================================

const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");
const { finalizeProjectCompletion } = require("./completionController");

// Get apprentice project data for mentor
// 1. Fixed getApprenticeProjectData
const getApprenticeProjectData = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Find the mentor profile for this user
    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // ✅ Find project where this mentor is assigned (using mentor profile ID)
    const project = await Project.findOne({
      mentorId: mentor._id, // ✅ CORRECT - using mentor profile ID
      status: { $in: ["In Progress", "Completed", "Cancelled"] },
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

    // ✅ Combine learner data (user info + profile info)
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

// 2. Fixed setTempExpectedEndDate
const setTempExpectedEndDate = async (req, res) => {
  try {
    const { projectId, date } = req.body;
    const userId = req.user._id;

    // ✅ Find mentor profile first
    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id, // ✅ CORRECT - using mentor profile ID
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    // Check if expected end date is already set permanently
    if (project.expectedEndDate && project.isTempEndDateConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Expected end date is already set and confirmed",
      });
    }

    // Validate date
    const tempDate = new Date(date);
    if (tempDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "End date must be in the future",
      });
    }

    // Set temporary end date
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

// 3. Fixed updateProjectProgress
const updateProjectProgress = async (req, res) => {
  try {
    const { projectId, percentage, note } = req.body;
    const userId = req.user._id;

    // Validation
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

    // ✅ Find mentor profile first
    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id, // ✅ CORRECT - using mentor profile ID
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    // Check if new percentage is higher than current
    if (percentage < project.progressPercentage) {
      return res.status(400).json({
        success: false,
        message: "Progress can only be increased, not decreased",
      });
    }

    // Add progress update to history
    const progressUpdate = {
      percentage: percentage,
      note: note.trim(),
      date: new Date(),
      updatedBy: userId,
    };

    project.progressHistory.push(progressUpdate);
    project.progressPercentage = percentage;
    project.lastProgressUpdate = new Date();

    await project.save();

    res.json({
      success: true,
      message: "Progress updated successfully",
      project: project,
      progressUpdate: progressUpdate,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

// 4. Fixed sendCompletionRequest
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

    // Check if there's already a pending request
    if (project.completionRequest?.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "There is already a pending request for this project",
      });
    }

    // ✅ Set completion request with all required fields
    project.completionRequest = {
      from: "mentor", // ✅ Now provided
      type: type, // ✅ Now provided
      status: "pending",
      requestedAt: new Date(),
      requestedBy: userId, // ✅ Now provided
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

// 6. Fixed submitApprenticeReview
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

    // Calculate average rating
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

    // Save mentor's review of apprentice
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

    // Update apprentice's overall rating in learner profile
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

    // Try to finalize project completion
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

// 7. Fixed getProgressHistory
const getProgressHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // ✅ Find mentor profile first
    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      mentorId: mentor._id, // ✅ CORRECT - using mentor profile ID
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const progressHistory = project.progressHistory || [];

    res.json({
      success: true,
      progressHistory: progressHistory.sort(
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

// 8. Fixed getCompletionRequests
const getCompletionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Find mentor profile first
    const mentor = await Mentor.findOne({ userId: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const projects = await Project.find({
      mentorId: mentor._id, // ✅ CORRECT - using mentor profile ID
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
