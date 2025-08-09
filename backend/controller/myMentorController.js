const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

// Get mentor project data for user
const getMentorProjectData = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ First find the learner profile for this user
    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    // ✅ Updated query with lean() for better performance
    const project = await Project.findOne({
      learnerId: learner._id,
      mentorId: { $exists: true, $ne: null },
      status: { $in: ["In Progress", "Completed", "Cancelled"] },
    })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar role")
      .sort({ updatedAt: -1 })
      .lean(); // ✅ This returns plain JS objects, no .toObject() needed

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "No active project with mentor found",
      });
    }

    // Get mentor profile data
    const mentorProfile = await Mentor.findOne({
      userId: project.mentorId._id,
    }).lean(); // ✅ Also use lean here

    // ✅ Simple object spreading since everything is plain JS objects now
    const mentorData = {
      ...project.mentorId,
      ...mentorProfile,
    };

    res.json({
      success: true,
      project: project,
      mentor: mentorData,
    });
  } catch (error) {
    console.error("Error fetching mentor project data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor project data",
    });
  }
};

// Confirm expected end date from mentor's temp date
const confirmExpectedEndDate = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      learnerId: learner._id, // ✅ Correct
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!project.tempExpectedEndDate) {
      return res.status(400).json({
        success: false,
        message: "No temporary end date to confirm",
      });
    }

    // Move temp date to expected date and clear temp
    project.expectedEndDate = project.tempExpectedEndDate;
    project.tempExpectedEndDate = null;
    project.isTempEndDateConfirmed = true;

    await project.save();

    res.json({
      success: true,
      message: "Expected end date confirmed",
      project: project,
    });
  } catch (error) {
    console.error("Error confirming end date:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm end date",
    });
  }
};

// Get progress history for a project
const getProgressHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      learnerId: learner._id, // ✅ Correct
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

// Send completion/cancellation request
const sendCompletionRequest = async (req, res) => {
  try {
    const { projectId, type } = req.body; // type: 'complete' or 'cancel'
    const userId = req.user._id;

    if (!["complete", "cancel"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request type",
      });
    }

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      learnerId: learner._id, // ✅ Correct
      status: "In Progress",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active project not found",
      });
    }

    // Check if there's already a pending request
    if (
      project.completionRequest &&
      project.completionRequest.status === "pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "There is already a pending request for this project",
      });
    }

    // Set completion request
    project.completionRequest = {
      from: "learner",
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
      } request sent to mentor`,
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

// Submit mentor review after project completion
const submitMentorReview = async (req, res) => {
  try {
    const { projectId, reviewData } = req.body;
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      learnerId: learner._id, // ✅ Correct
      status: "Completed",
    }).populate("mentorId");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Completed project not found",
      });
    }

    if (project.learnerReview && project.learnerReview.rating) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted",
      });
    }

    // Calculate average rating
    const {
      technicalSkills,
      communication,
      helpfulness,
      professionalism,
      overallExperience,
    } = reviewData;
    const averageRating =
      (technicalSkills +
        communication +
        helpfulness +
        professionalism +
        overallExperience) /
      5;

    // Save learner's review
    project.learnerReview = {
      rating: parseFloat(averageRating.toFixed(1)),
      comment: reviewData.comment || "",
      reviewDate: new Date(),
      breakdown: {
        technicalSkills,
        communication,
        helpfulness,
        professionalism,
        overallExperience,
      },
    };

    await project.save();

    // Update mentor's overall rating
    const mentorProfile = await Mentor.findOne({
      userId: project.mentorId._id,
    });
    if (mentorProfile) {
      // Calculate new rating (simple average for now)
      const allProjects = await Project.find({
        mentorId: project.mentorId._id,
        "learnerReview.rating": { $exists: true },
      });

      if (allProjects.length > 0) {
        const totalRating = allProjects.reduce(
          (sum, p) => sum + p.learnerReview.rating,
          0
        );
        const newAverageRating = totalRating / allProjects.length;

        mentorProfile.rating = parseFloat(newAverageRating.toFixed(1));
        mentorProfile.totalReviews = allProjects.length;
        await mentorProfile.save();
      }
    }

    res.json({
      success: true,
      message: "Review submitted successfully",
      averageRating: parseFloat(averageRating.toFixed(1)),
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

// Get completion requests for user (to handle mentor responses)
const getCompletionRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const projects = await Project.find({
      learnerId: learner._id, // ✅ Correct
      "completionRequest.status": { $in: ["pending", "approved", "rejected"] },
    })
      .populate("mentorId", "name email avatar")
      .sort({ "completionRequest.requestedAt": -1 });

    const requests = projects.map((project) => ({
      projectId: project._id,
      projectName: project.name,
      mentor: project.mentorId,
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

// Handle mentor's response to completion request (for notifications)
const handleMentorResponse = async (req, res) => {
  try {
    const { requestId, response, mentorNotes } = req.body; // response: 'approve' or 'reject'
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId: userId });
    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
      });
    }

    const project = await Project.findOne({
      _id: requestId,
      learnerId: learner._id, // ✅ Correct
      "completionRequest.status": "pending",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Pending request not found",
      });
    }

    if (response === "approve") {
      // Update project status based on request type
      if (project.completionRequest.type === "complete") {
        project.status = "Completed";
        project.actualEndDate = new Date();
      } else if (project.completionRequest.type === "cancel") {
        project.status = "Cancelled";
        project.actualEndDate = new Date();
      }

      project.completionRequest.status = "approved";
      project.completionRequest.approvedAt = new Date();
      project.completionRequest.mentorNotes = mentorNotes;
    } else {
      project.completionRequest.status = "rejected";
      project.completionRequest.rejectedAt = new Date();
      project.completionRequest.mentorNotes = mentorNotes;
    }

    await project.save();

    res.json({
      success: true,
      message: `Request ${response}d successfully`,
      project: project,
    });
  } catch (error) {
    console.error("Error handling mentor response:", error);
    res.status(500).json({
      success: false,
      message: "Failed to handle mentor response",
    });
  }
};

module.exports = {
  getMentorProjectData,
  confirmExpectedEndDate,
  getProgressHistory,
  sendCompletionRequest,
  submitMentorReview,
  getCompletionRequests,
  handleMentorResponse,
};
