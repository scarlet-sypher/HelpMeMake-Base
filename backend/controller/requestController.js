const Request = require("../Model/Request");
const Project = require("../Model/Project");
const Mentor = require("../Model/Mentor");
const Learner = require("../Model/Learner");

// Send Request (Learner → Mentor)
const sendRequest = async (req, res) => {
  try {
    const { projectId, mentorId, message } = req.body;

    // Validation
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

    // Get the authenticated user
    const userId = req.user._id;

    // Find the learner profile for this user
    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can send mentor requests",
      });
    }

    // Check if project exists and is open
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

    // Verify the learner owns this project
    if (project.learnerId.toString() !== learner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only send requests for your own projects",
      });
    }

    // Check if mentor exists and is available
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

    // Check if request already exists
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

    // Create new request
    const newRequest = new Request({
      projectId,
      mentorId,
      learnerId: learner._id,
      message: message.trim(),
    });

    await newRequest.save();

    // Populate the saved request for response
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

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already sent a request to this mentor for this project",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: errorMessages.join(", "),
      });
    }

    // Handle cast errors (invalid ObjectId)
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

// Get Requests for Project (used to check what requests learner has already sent)
const getProjectRequests = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Validation
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find the learner profile for this user
    const learner = await Learner.findOne({ userId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can view project requests",
      });
    }

    // Check if project exists and learner owns it
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

    // Get all requests for this project by this learner
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

    // Create a simple map for frontend to check which mentors have been requested
    const requestedMentorIds = requests.map((req) => req.mentorId.toString());

    res.json({
      success: true,
      requests,
      requestedMentorIds, // Array of mentor IDs that have been requested
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

// Get all requests sent by a learner (optional - for learner dashboard)
const getLearnerRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the learner profile for this user
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

module.exports = {
  sendRequest,
  getProjectRequests,
  getLearnerRequests,
};
