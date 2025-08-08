const Project = require("../Model/Project");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

// Create New Project
const createProject = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      fullDescription,
      techStack,
      category,
      difficultyLevel,
      duration,
      status,
      thumbnail,
      tags,
      openingPrice,
      currency,
      projectOutcome,
      motivation,
      prerequisites,
      knowledgeLevel,
      references,
    } = req.body;

    // Validation
    if (
      !name ||
      !shortDescription ||
      !fullDescription ||
      !techStack ||
      techStack.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: name, shortDescription, fullDescription, and at least one technology",
      });
    }

    if (!category || !difficultyLevel || !duration || !openingPrice) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: category, difficultyLevel, duration, and openingPrice",
      });
    }

    if (!projectOutcome || !motivation || !knowledgeLevel) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: projectOutcome, motivation, and knowledgeLevel",
      });
    }

    // Validate price
    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Opening price must be a valid positive number",
      });
    }

    // Get learner ID from authenticated user
    const learnerId = req.user._id;

    // Verify user is a learner
    const learner = await Learner.findOne({ userId: learnerId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can create projects",
      });
    }

    // Create project
    const projectData = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      techStack: techStack
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0),
      category,
      difficultyLevel,
      duration: duration.trim(),
      status: status || "Open",
      thumbnail: thumbnail || "/uploads/public/default-project.jpg",
      tags: tags
        ? tags
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : [],
      openingPrice: price,
      currency: currency || "INR",
      projectOutcome: projectOutcome.trim(),
      motivation: motivation.trim(),
      prerequisites: prerequisites
        ? prerequisites
            .map((prereq) => prereq.trim())
            .filter((prereq) => prereq.length > 0)
        : [],
      knowledgeLevel,
      references: references || [],
      learnerId: learner._id, // Use learner's ObjectId, not user's
      isVisible: true,
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    // Update learner's project count
    await Learner.findByIdAndUpdate(learner._id, {
      $inc: {
        userTotalProjects: 1,
        userActiveProjects: savedProject.status === "Open" ? 1 : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A project with this information already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create project. Please try again.",
    });
  }
};

// Get Project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(id)
      .populate({
        path: "learnerId",
        select:
          "userId title description location level rating completedSessions",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        select: "userId title description location",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "applications.mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has permission to view this project
    const userLearner = await Learner.findOne({ userId: req.user._id });
    const userMentor = await Mentor.findOne({ userId: req.user._id });

    // Allow access if:
    // 1. User is the project owner
    // 2. Project is visible and open
    // 3. User is the assigned mentor
    // 4. User is a mentor (can view open projects)
    const isOwner =
      userLearner &&
      project.learnerId._id.toString() === userLearner._id.toString();
    const isAssignedMentor =
      project.mentorId &&
      project.mentorId._id.toString() === req.user._id.toString();
    const isPubliclyVisible = project.isVisible && project.status === "Open";
    const isMentor = userMentor !== null;

    if (!isOwner && !isAssignedMentor && !isPubliclyVisible && !isMentor) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this project",
      });
    }

    // Increment view count if not the owner
    if (!isOwner) {
      await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    // Format the response to match frontend expectations
    const formattedProject = {
      ...project.toObject(),
      learner: project.learnerId, // Alias for easier access
    };

    res.json({
      success: true,
      message: "Project retrieved successfully",
      project: formattedProject,
    });
  } catch (error) {
    console.error("Get project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve project",
    });
  }
};

// Apply to Project (Mentor Application)
const applyToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedPrice, coverLetter, estimatedDuration } = req.body;

    // Validation
    if (!proposedPrice || !coverLetter || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: proposedPrice, coverLetter, estimatedDuration",
      });
    }

    // Validate price
    const price = parseFloat(proposedPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Proposed price must be a valid positive number",
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if project is open for applications
    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting applications",
      });
    }

    // Check if project already has a mentor
    if (project.mentorId) {
      return res.status(400).json({
        success: false,
        message: "This project already has an assigned mentor",
      });
    }

    // Verify user is a mentor
    const mentor = await Mentor.findOne({ userId: req.user._id });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can apply to projects",
      });
    }

    // Check if mentor already applied
    const existingApplication = project.applications.find(
      (app) => app.mentorId.toString() === mentor._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project",
      });
    }

    // Create application
    const newApplication = {
      mentorId: mentor._id,
      proposedPrice: price,
      coverLetter: coverLetter.trim(),
      estimatedDuration: estimatedDuration.trim(),
      applicationStatus: "Pending",
      appliedAt: new Date(),
    };

    // Add application to project
    project.applications.push(newApplication);
    project.applicationsCount = project.applications.length;

    await project.save();

    // Populate the new application for response
    const updatedProject = await Project.findById(id).populate({
      path: "applications.mentorId",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    });

    const addedApplication =
      updatedProject.applications[updatedProject.applications.length - 1];

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: addedApplication,
    });
  } catch (error) {
    console.error("Apply to project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit application. Please try again.",
    });
  }
};

// Accept Mentor Application (for learners)
const acceptMentorApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Verify user is the project owner
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (
      !userLearner ||
      project.learnerId.toString() !== userLearner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can accept applications",
      });
    }

    // Find the application
    const application = project.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if application is pending
    if (application.applicationStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This application has already been processed",
      });
    }

    // Accept the application
    application.applicationStatus = "Accepted";
    project.mentorId = application.mentorId;
    project.negotiatedPrice = application.proposedPrice;
    project.status = "In Progress";
    project.startDate = new Date();

    // Reject all other pending applications
    project.applications.forEach((app) => {
      if (
        app._id.toString() !== applicationId &&
        app.applicationStatus === "Pending"
      ) {
        app.applicationStatus = "Rejected";
      }
    });

    await project.save();

    // Update learner stats
    await Learner.findByIdAndUpdate(userLearner._id, {
      $inc: {
        userActiveProjects: -1, // Move from open to in progress
        userSessionsScheduled: 1,
      },
    });

    // Update mentor stats
    await Mentor.findByIdAndUpdate(application.mentorId, {
      $inc: {
        mentorActiveStudents: 1,
        totalStudents: 1,
      },
    });

    res.json({
      success: true,
      message: "Application accepted successfully!",
      project,
    });
  } catch (error) {
    console.error("Accept application error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to accept application. Please try again.",
    });
  }
};

// Update Existing Project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      shortDescription,
      fullDescription,
      techStack,
      category,
      difficultyLevel,
      duration,
      status,
      thumbnail,
      tags,
      openingPrice,
      currency,
      projectOutcome,
      motivation,
      prerequisites,
      knowledgeLevel,
      references,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns this project
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (
      !userLearner ||
      project.learnerId.toString() !== userLearner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own projects",
      });
    }

    // Validation for required fields
    if (
      !name ||
      !shortDescription ||
      !fullDescription ||
      !techStack ||
      techStack.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: name, shortDescription, fullDescription, and at least one technology",
      });
    }

    if (!category || !difficultyLevel || !duration || !openingPrice) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: category, difficultyLevel, duration, and openingPrice",
      });
    }

    if (!projectOutcome || !motivation || !knowledgeLevel) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields: projectOutcome, motivation, and knowledgeLevel",
      });
    }

    // Validate price
    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Opening price must be a valid positive number",
      });
    }

    // Check if project can be edited (not in certain states)
    if (project.status === "Completed" || project.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit completed or cancelled projects",
      });
    }

    // Track status change for learner stats
    const oldStatus = project.status;
    const newStatus = status || project.status;

    // Prepare update data
    const updateData = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      techStack: techStack
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0),
      category,
      difficultyLevel,
      duration: duration.trim(),
      status: newStatus,
      thumbnail: thumbnail || project.thumbnail,
      tags: tags
        ? tags
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : [],
      openingPrice: price,
      currency: currency || "INR",
      projectOutcome: projectOutcome.trim(),
      motivation: motivation.trim(),
      prerequisites: prerequisites
        ? prerequisites
            .map((prereq) => prereq.trim())
            .filter((prereq) => prereq.length > 0)
        : [],
      knowledgeLevel,
      references: references || [],
    };

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location");

    // Update learner stats if status changed
    if (oldStatus !== newStatus) {
      const statusChanges = {};

      // Handle active projects count
      if (oldStatus === "Open" && newStatus !== "Open") {
        statusChanges.userActiveProjects = -1;
      } else if (oldStatus !== "Open" && newStatus === "Open") {
        statusChanges.userActiveProjects = 1;
      }

      if (Object.keys(statusChanges).length > 0) {
        await Learner.findByIdAndUpdate(userLearner._id, {
          $inc: statusChanges,
        });
      }
    }

    res.json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update project. Please try again.",
    });
  }
};

// Get all projects for authenticated user (Dashboard)
const getProjectsForUser = async (req, res) => {
  try {
    // Get learner profile for the authenticated user
    const userLearner = await Learner.findOne({ userId: req.user._id });

    if (!userLearner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can access this endpoint",
      });
    }

    // Find all projects belonging to this learner
    const projects = await Project.find({ learnerId: userLearner._id })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location")
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate some basic stats
    const stats = {
      total: projects.length,
      open: projects.filter((p) => p.status === "Open").length,
      inProgress: projects.filter((p) => p.status === "In Progress").length,
      completed: projects.filter((p) => p.status === "Completed").length,
      cancelled: projects.filter((p) => p.status === "Cancelled").length,
    };

    res.json({
      success: true,
      message: "Projects retrieved successfully",
      projects,
      stats,
    });
  } catch (error) {
    console.error("Get user projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
};

// Delete project by ID (only if user owns it)
const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find the project first
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user owns this project
    const userLearner = await Learner.findOne({ userId: req.user._id });

    if (!userLearner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can delete projects",
      });
    }

    if (project.learnerId.toString() !== userLearner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own projects",
      });
    }

    // Check if project can be deleted (business logic)
    if (project.status === "In Progress" && project.mentorId) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete projects that are in progress with an assigned mentor",
      });
    }

    // Store project status for stats update
    const projectStatus = project.status;

    // Delete the project
    await Project.findByIdAndDelete(id);

    // Update learner's project count
    const statsUpdate = { userTotalProjects: -1 };

    if (projectStatus === "Open") {
      statsUpdate.userActiveProjects = -1;
    }

    await Learner.findByIdAndUpdate(userLearner._id, { $inc: statsUpdate });

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete project. Please try again.",
    });
  }
};

// Get Projects by User ID (for frontend dashboard)
const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the learner profile for this user ID
    const learner = await Learner.findOne({ userId: userId });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found for this user",
      });
    }

    // Find all projects belonging to this learner
    const projects = await Project.find({ learnerId: learner._id })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location")
      .sort({ createdAt: -1 }); // Sort by newest first

    // Map projects to match frontend expectations
    const mappedProjects = projects.map((project) => ({
      _id: project._id,
      projectId: project.projectId,
      title: project.name, // Map 'name' to 'title' for frontend
      description: project.shortDescription, // Use shortDescription for card preview
      fullDescription: project.fullDescription,
      status: project.status.toLowerCase().replace(" ", "-"), // Format status for frontend
      skills: project.techStack, // Map 'techStack' to 'skills' for frontend
      category: project.category,
      difficultyLevel: project.difficultyLevel,
      duration: project.duration,
      thumbnail: project.thumbnail,
      tags: project.tags,
      openingPrice: project.openingPrice,
      negotiatedPrice: project.negotiatedPrice,
      closedPrice: project.closedPrice,
      currency: project.currency,
      startDate: project.startDate,
      expectedEndDate: project.expectedEndDate,
      actualEndDate: project.actualEndDate,
      progressPercentage: project.progressPercentage,
      viewCount: project.viewCount,
      applicationsCount: project.applicationsCount,
      projectOutcome: project.projectOutcome,
      motivation: project.motivation,
      prerequisites: project.prerequisites,
      knowledgeLevel: project.knowledgeLevel,
      references: project.references,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Include learner and mentor info if populated
      learner: project.learnerId,
      mentor: project.mentorId,
      // Virtual fields
      projectAge: project.projectAge,
      isOverdue: project.isOverdue,
      activePrice: project.activePrice,
    }));

    // Calculate some stats for the frontend
    const stats = {
      total: projects.length,
      open: projects.filter((p) => p.status === "Open").length,
      inProgress: projects.filter((p) => p.status === "In Progress").length,
      completed: projects.filter((p) => p.status === "Completed").length,
      cancelled: projects.filter((p) => p.status === "Cancelled").length,
    };

    res.json({
      success: true,
      message: "Projects retrieved successfully",
      projects: mappedProjects,
      stats,
    });
  } catch (error) {
    console.error("Get user projects error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
};

const getActiveProjectWithMentor = async (req, res) => {
  try {
    console.log("=== GET ACTIVE PROJECT DEBUG ===");
    console.log("req.user:", req.user);

    // Fix: Use _id from req.user, not userId
    const userId = req.user._id || req.user.userId;

    if (!userId) {
      console.log("ERROR: No userId in req.user");
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
        debug: {
          reqUser: req.user,
          availableFields: Object.keys(req.user || {}),
        },
      });
    }

    console.log("Looking for learner with userId:", userId);

    // Search using the actual user _id from the token
    const learner = await Learner.findOne({ userId: userId });
    console.log("Learner found:", learner ? "YES" : "NO");

    if (learner) {
      console.log("Learner _id:", learner._id);
      console.log("Learner userId:", learner.userId);
    }

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found",
        debug: {
          searchedUserId: userId,
          userFromToken: req.user,
          userIdField: req.user._id,
          userIdFieldAlt: req.user.userId,
        },
      });
    }

    console.log("Searching for projects with learnerId:", learner._id);

    // Find most recent project (with or without mentor for testing)
    const project = await Project.findOne({
      learnerId: learner._id,
      status: { $in: ["In Progress", "Open", "Active"] }, // Include multiple statuses
    })
      .populate("mentorId", "userId")
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 }); // Get most recent project

    console.log("Project found:", project ? "YES" : "NO");

    if (project) {
      console.log("Project ID:", project._id);
      console.log("Project name:", project.name);
      console.log("Project status:", project.status);
      console.log("Project learnerId:", project.learnerId);
      console.log("Project mentorId:", project.mentorId);
    }

    if (!project) {
      // Let's also check if there are ANY projects for this learner
      const anyProjects = await Project.find({ learnerId: learner._id });
      console.log("Total projects for learner:", anyProjects.length);

      if (anyProjects.length > 0) {
        console.log("Available projects:");
        anyProjects.forEach((p, index) => {
          console.log(
            `  ${index + 1}. ${p.name} - Status: ${p.status} - Mentor: ${
              p.mentorId || "None"
            }`
          );
        });
      }

      return res.json({
        success: true,
        project: null,
        message: "No active project found",
        debug: {
          learnerId: learner._id,
          totalProjects: anyProjects.length,
          searchCriteria: {
            learnerId: learner._id,
            status: { $in: ["In Progress", "Open", "Active"] },
          },
        },
      });
    }

    // Format project for frontend
    const formattedProject = {
      ...project.toObject(),
      mentorId: project.mentorId
        ? {
            _id: project.mentorId._id,
            name: project.mentorId.userId?.name || "Unknown Mentor",
            email: project.mentorId.userId?.email,
            title: project.mentorId.title || "Mentor",
          }
        : {
            name: "No Mentor Assigned",
            title: "Pending Assignment",
          },
    };

    console.log("Returning formatted project");
    console.log("=== END DEBUG ===");

    res.json({
      success: true,
      project: formattedProject,
    });
  } catch (error) {
    console.error("Error in getActiveProjectWithMentor:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const thumbnailUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
}).single("thumbnail");

// Upload Project Thumbnail
const uploadProjectThumbnail = async (req, res) => {
  console.log("Upload thumbnail endpoint hit");
  console.log("User from req:", req.user);

  thumbnailUpload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    try {
      // Upload to Cloudinary from buffer
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "project-thumbnails",
              public_id: `thumbnail-${req.user._id}-${Date.now()}`,
              overwrite: true,
              transformation: [
                { width: 800, height: 600, crop: "fill" },
                { quality: "auto", fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (result) {
                console.log("Cloudinary upload successful:", result.secure_url);
                resolve(result);
              } else {
                console.error("Cloudinary upload error:", error);
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);

      res.json({
        success: true,
        message: "Thumbnail uploaded successfully",
        thumbnailUrl: result.secure_url,
      });
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload thumbnail",
      });
    }
  });
};

const getAvailableProjectsForMentors = async (req, res) => {
  try {
    // Verify user is a mentor
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can access this endpoint",
      });
    }

    // Find all learners who have projects in progress
    const learnersWithInProgressProjects = await Project.find({
      status: "In Progress",
    }).distinct("learnerId");

    // Find all open projects excluding those from learners with in-progress projects
    const availableProjects = await Project.find({
      status: "Open",
      isVisible: true,
      learnerId: { $nin: learnersWithInProgressProjects }, // Exclude learners with in-progress projects
      mentorId: null, // Only projects without assigned mentors
    })
      .populate("learnerId", "userId title description location")
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    // Format projects for frontend
    const formattedProjects = availableProjects.map((project) => ({
      _id: project._id,
      projectId: project.projectId,
      name: project.name,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      category: project.category,
      difficultyLevel: project.difficultyLevel,
      duration: project.duration,
      techStack: project.techStack,
      thumbnail: project.thumbnail,
      tags: project.tags,
      openingPrice: project.openingPrice,
      currency: project.currency,
      status: project.status,
      viewCount: project.viewCount,
      applicationsCount: project.applicationsCount,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      // Include learner info
      learner: project.learnerId
        ? {
            _id: project.learnerId._id,
            name: project.learnerId.userId?.name || "Unknown User",
            email: project.learnerId.userId?.email,
            avatar: project.learnerId.userId?.avatar,
            title: project.learnerId.title,
            location: project.learnerId.location,
          }
        : null,
      // Check if current mentor has already applied
      hasApplied:
        project.applications?.some(
          (app) => app.mentorId.toString() === mentor._id.toString()
        ) || false,
    }));

    res.json({
      success: true,
      message: "Available projects retrieved successfully",
      projects: formattedProjects,
      count: formattedProjects.length,
    });
  } catch (error) {
    console.error("Get available projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve available projects",
    });
  }
};

// Get mentor application statistics
const getMentorApplicationStats = async (req, res) => {
  try {
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can access this endpoint",
      });
    }

    // Get all projects where this mentor has applied
    const projectsWithApplications = await Project.find({
      "applications.mentorId": mentor._id,
    });

    // Calculate stats
    const totalApplications = projectsWithApplications.length;
    const acceptedApplications = projectsWithApplications.filter((project) =>
      project.applications.some(
        (app) =>
          app.mentorId.toString() === mentor._id.toString() &&
          app.applicationStatus === "Accepted"
      )
    ).length;

    // Get active projects (where mentor is assigned)
    const activeProjects = await Project.countDocuments({
      mentorId: mentor._id,
      status: "In Progress",
    });

    // Get completed projects
    const completedProjects = await Project.countDocuments({
      mentorId: mentor._id,
      status: "Completed",
    });

    // Calculate success rate
    const successRate =
      totalApplications > 0
        ? Math.round((acceptedApplications / totalApplications) * 100)
        : 0;

    // Calculate total earnings (this would need to be implemented based on your payment system)
    const totalEarnings = 0; // Placeholder - implement based on your payment model

    const stats = {
      totalApplications,
      acceptedApplications,
      activeProjects,
      completedProjects,
      totalEarnings,
      successRate,
    };

    res.json({
      success: true,
      message: "Mentor statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    console.error("Get mentor stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor statistics",
    });
  }
};

const takeProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if closing price is set
    if (!project.closingPrice) {
      return res.status(400).json({
        success: false,
        message: "Price not finalized yet",
      });
    }

    // Check if project is still available
    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Project is no longer available",
      });
    }

    // Verify user is a mentor
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can take projects",
      });
    }

    // Assign mentor and update project status
    project.mentorId = mentor._id;
    project.status = "In Progress";
    project.startDate = new Date();

    await project.save();

    // Update mentor stats
    await Mentor.findByIdAndUpdate(mentor._id, {
      $inc: {
        mentorActiveStudents: 1,
        totalStudents: 1,
      },
    });

    // Update learner stats
    const Learner = require("../Model/Learner");
    await Learner.findByIdAndUpdate(project.learnerId, {
      $inc: {
        userActiveProjects: 1,
        userSessionsScheduled: 1,
      },
    });

    res.json({
      success: true,
      message: "Project accepted successfully!",
      project,
    });
  } catch (error) {
    console.error("Take project error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to accept project. Please try again.",
    });
  }
};

const setClosingPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, mentorId } = req.body; // mentorId is optional - used when setting from a pitch

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Verify user is the project owner
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (
      !userLearner ||
      project.learnerId.toString() !== userLearner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can set closing price",
      });
    }

    // Set the closing price
    project.closingPrice = parseFloat(price);

    // If setting from a specific mentor's pitch, you might want to track that
    if (mentorId) {
      project.acceptedMentorForPrice = mentorId;
    }

    await project.save();

    res.json({
      success: true,
      message: "Closing price set successfully",
      project: {
        _id: project._id,
        closingPrice: project.closingPrice,
      },
    });
  } catch (error) {
    console.error("Set closing price error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to set closing price",
    });
  }
};

// Add pitch to a project (Mentor only)
const addPitch = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, note } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if project is open for pitches
    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting pitches",
      });
    }

    // Verify user is a mentor
    const mentor = await Mentor.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email avatar"
    );
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can pitch to projects",
      });
    }

    // Use the instance method from your schema
    await project.addOrUpdatePitch(
      mentor.userId._id,
      parseFloat(price),
      note || ""
    );

    // Populate the updated project to get the new pitch with mentor details
    const updatedProject = await Project.findById(id).populate({
      path: "pitches.mentor",
      select: "name email avatar",
    });

    // Find the latest pitch (the one we just added/updated)
    const latestPitch =
      updatedProject.pitches[updatedProject.pitches.length - 1];

    res.status(201).json({
      success: true,
      message: "Pitch submitted successfully!",
      pitch: latestPitch,
    });
  } catch (error) {
    console.error("Add pitch error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit pitch. Please try again.",
    });
  }
};

// Get all pitches for a project (User only)
const getProjectPitches = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project
    const project = await Project.findById(id).populate({
      path: "pitches.mentor",
      select: "name email avatar title location",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Verify user is the project owner
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (
      !userLearner ||
      project.learnerId.toString() !== userLearner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can view pitches",
      });
    }

    // Sort pitches by timestamp (newest first)
    const sortedPitches = project.pitches.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({
      success: true,
      message: "Pitches retrieved successfully",
      pitches: sortedPitches,
      count: sortedPitches.length,
    });
  } catch (error) {
    console.error("Get pitches error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve pitches",
    });
  }
};

// Mark pitches as read for a project (User only)
const markPitchesAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Verify user is the project owner
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (
      !userLearner ||
      project.learnerId.toString() !== userLearner._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can mark pitches as read",
      });
    }

    // Mark pitches as read
    project.hasUnreadPitch = false;
    await project.save();

    res.json({
      success: true,
      message: "Pitches marked as read",
    });
  } catch (error) {
    console.error("Mark pitches as read error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to mark pitches as read",
    });
  }
};

const getMentorActiveProjectStatus = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can check project status",
      });
    }

    // Check for any active project
    const activeProject = await Project.findOne({
      mentorId: mentor._id,
      status: "In Progress",
    });

    res.json({
      success: true,
      hasActiveProject: !!activeProject,
      activeProjectId: activeProject?._id || null,
      message: activeProject
        ? "Mentor has an active project"
        : "Mentor is available for new projects",
    });
  } catch (error) {
    console.error("Error checking mentor status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check mentor status",
    });
  }
};

// Updated getAvailableProjectsForMentors function
const getAvailableProjectsForMentorsUpdated = async (req, res) => {
  try {
    // Verify user is a mentor
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can access this endpoint",
      });
    }

    // Check if mentor has active project
    const hasActiveProject = await Project.findOne({
      mentorId: mentor._id,
      status: "In Progress",
    });

    // Find all learners who have projects in progress
    const learnersWithInProgressProjects = await Project.find({
      status: "In Progress",
    }).distinct("learnerId");

    // Find all open projects excluding those from learners with in-progress projects
    // and excluding projects that are completed, cancelled, or in progress
    const availableProjects = await Project.find({
      status: "Open",
      isVisible: true,
      learnerId: { $nin: learnersWithInProgressProjects },
      mentorId: null,
    })
      .populate("learnerId", "userId title description location")
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "pitches.mentor",
        select: "name email avatar",
      })
      .sort({ createdAt: -1 });

    // Format projects for frontend with negotiated price calculation
    const formattedProjects = availableProjects.map((project) => {
      // Calculate negotiated price (average of all pitches)
      const negotiatedPrice =
        project.pitches && project.pitches.length > 0
          ? Math.round(
              project.pitches.reduce((sum, pitch) => sum + pitch.price, 0) /
                project.pitches.length
            )
          : 0;

      return {
        _id: project._id,
        projectId: project.projectId,
        name: project.name,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        category: project.category,
        difficultyLevel: project.difficultyLevel,
        duration: project.duration,
        techStack: project.techStack,
        thumbnail: project.thumbnail,
        tags: project.tags,
        openingPrice: project.openingPrice,
        negotiatedPrice: negotiatedPrice, // Add calculated negotiated price
        currency: project.currency,
        status: project.status,
        viewCount: project.viewCount,
        applicationsCount: project.applicationsCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        pitches: project.pitches, // Include pitches for frontend
        // Include learner info
        learner: project.learnerId
          ? {
              _id: project.learnerId._id,
              userId: project.learnerId.userId?._id,
              name: project.learnerId.userId?.name || "Unknown User",
              email: project.learnerId.userId?.email,
              avatar: project.learnerId.userId?.avatar,
              title: project.learnerId.title,
              location: project.learnerId.location,
            }
          : null,
        // Check if current mentor has already applied
        hasApplied:
          project.applications?.some(
            (app) => app.mentorId.toString() === mentor._id.toString()
          ) || false,
        // Check if current mentor has already pitched
        hasPitched:
          project.pitches?.some(
            (pitch) => pitch.mentor.toString() === req.user._id.toString()
          ) || false,
      };
    });

    res.json({
      success: true,
      message: "Available projects retrieved successfully",
      projects: formattedProjects,
      count: formattedProjects.length,
      mentorStatus: {
        hasActiveProject: !!hasActiveProject,
        isRestricted: !!hasActiveProject,
        activeProjectId: hasActiveProject?._id || null,
      },
    });
  } catch (error) {
    console.error("Get available projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve available projects",
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
  updateProject,
  getProjectsForUser,
  deleteProjectById,
  applyToProject,
  acceptMentorApplication,
  getUserProjects,
  getActiveProjectWithMentor,
  uploadProjectThumbnail,
  getAvailableProjectsForMentors,
  getMentorApplicationStats,
  takeProject,
  setClosingPrice,
  addPitch,
  getProjectPitches,
  markPitchesAsRead,
  getMentorActiveProjectStatus,
  getAvailableProjectsForMentorsUpdated,
};
