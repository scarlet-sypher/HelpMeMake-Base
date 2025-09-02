const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

const handleCompletionRequestResponse = async (req, res) => {
  try {
    const { requestId, response, notes } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const project = await Project.findOne({
      _id: requestId,
      "completionRequest.status": "pending",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Pending request not found",
      });
    }

    const shouldMentorRespond = project.completionRequest.from === "learner";
    const shouldLearnerRespond = project.completionRequest.from === "mentor";

    if (
      (shouldMentorRespond && userRole !== "mentor") ||
      (shouldLearnerRespond && userRole !== "user")
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to respond to this request",
      });
    }

    if (response === "approve") {
      project.completionRequest.status = "approved";
      project.completionRequest.approvedAt = new Date();

      if (userRole === "mentor") {
        project.completionRequest.mentorNotes = notes;
      } else {
        project.completionRequest.learnerNotes = notes;
      }
    } else {
      project.completionRequest.status = "rejected";
      project.completionRequest.rejectedAt = new Date();

      if (userRole === "mentor") {
        project.completionRequest.mentorNotes = notes;
      } else {
        project.completionRequest.learnerNotes = notes;
      }

      setTimeout(async () => {
        const proj = await Project.findById(requestId);
        if (proj && proj.completionRequest?.status === "rejected") {
          proj.completionRequest = null;
          await proj.save();
        }
      }, 5000);
    }

    await project.save();

    res.json({
      success: true,
      message: `Request ${response}d successfully`,
      project: project,
    });
  } catch (error) {
    console.error("Error handling completion request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to handle completion request",
    });
  }
};

const finalizeProjectCompletion = async (projectId) => {
  try {
    const project = await Project.findById(projectId);

    if (!project || project.completionRequest?.status !== "approved") {
      return;
    }

    const hasLearnerReview = project.learnerReview?.rating;
    const hasMentorReview = project.mentorReview?.rating;

    if (hasLearnerReview && hasMentorReview) {
      if (project.completionRequest.type === "complete") {
        project.status = "Completed";
      } else if (project.completionRequest.type === "cancel") {
        project.status = "Cancelled";
      }

      project.actualEndDate = new Date();
      project.completionRequest = null;
      await project.save();
    }
  } catch (error) {
    console.error("Error finalizing project completion:", error);
  }
};

module.exports = {
  handleCompletionRequestResponse,
  finalizeProjectCompletion,
};
