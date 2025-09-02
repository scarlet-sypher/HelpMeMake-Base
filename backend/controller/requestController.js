const Request = require("../Model/Request");
const Project = require("../Model/Project");
const Mentor = require("../Model/Mentor");
const Learner = require("../Model/Learner");

const sendRequest = async (req, res) => {
  try {
    const { projectId, mentorId, message } = req.body;

    if (!projectId || !mentorId || !message) {
      return res.status(400).json({
        success: false,
        message: "Project ID, Mentor ID, and message are required",
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters long",
      });
    }

    const userId = req.user._id;

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can send mentor requests",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting requests",
      });
    }

    if (project.learnerId.toString() !== learner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only send requests for your own projects",
      });
    }

    const mentor = await Mentor.findById(mentorId).populate(
      "userId",
      "name email avatar"
    );
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (!mentor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This mentor is currently not available",
      });
    }

    const existingRequest = await Request.requestExists(
      projectId,
      mentorId,
      learner._id
    );

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "You have already sent a request to this mentor for this project",
      });
    }

    const newRequest = new Request({
      projectId,
      mentorId,
      learnerId: learner._id,
      message: message.trim(),
      status: "pending",
    });

    await newRequest.save();

    const populatedRequest = await Request.findById(newRequest._id)
      .populate({
        path: "mentorProfile",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "learnerUser",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      });

    res.status(201).json({
      success: true,
      message: `Request sent to ${mentor.userId.name} successfully!`,
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Send request error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already sent a request to this mentor for this project",
      });
    }

    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: errorMessages.join(", "),
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send request. Please try again.",
    });
  }
};

const getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can view project requests",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.learnerId.toString() !== learner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view requests for your own projects",
      });
    }

    const requests = await Request.find({
      projectId,
      learnerId: learner._id,
    })
      .populate({
        path: "mentorProfile",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 });

    const requestedMentorIds = requests.map((req) => req.mentorId.toString());

    res.json({
      success: true,
      requests,
      requestedMentorIds,
      totalRequests: requests.length,
    });
  } catch (error) {
    console.error("Get project requests error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch project requests",
    });
  }
};

const getLearnerRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can view their requests",
      });
    }

    const requests = await Request.find({ learnerId: learner._id })
      .populate({
        path: "mentorProfile",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("project", "name shortDescription status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
      totalRequests: requests.length,
    });
  } catch (error) {
    console.error("Get learner requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your requests",
    });
  }
};

const getMentorRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can view their requests",
      });
    }

    const requests = await Request.find({ mentorId: mentor._id })
      .populate({
        path: "learnerUser",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("project", "name shortDescription status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
      totalRequests: requests.length,
    });
  } catch (error) {
    console.error("Get mentor requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor requests",
    });
  }
};

const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, response } = req.body;
    const userId = req.user._id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'accepted' or 'rejected'",
      });
    }

    const mentor = await Mentor.findOne({ userId });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can respond to requests",
      });
    }

    const request = await Request.findById(requestId)
      .populate({
        path: "learnerUser",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate("project", "name shortDescription status");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.mentorId.toString() !== mentor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only respond to requests sent to you",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`,
      });
    }

    request.status = status;
    request.mentorResponse = response || "";
    request.respondedAt = new Date();

    await request.save();

    res.json({
      success: true,
      message: `Request ${status} successfully!`,
      request,
    });
  } catch (error) {
    console.error("Respond to request error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to respond to request",
    });
  }
};

module.exports = {
  sendRequest,
  getProjectRequests,
  getLearnerRequests,
  getMentorRequests,
  respondToRequest,
};
