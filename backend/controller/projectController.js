const Project = require("../Model/Project");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

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

    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Opening price must be a valid positive number",
      });
    }

    const learnerId = req.user._id;

    const learner = await Learner.findOne({ userId: learnerId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can create projects",
      });
    }

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
      learnerId: learner._id,
      isVisible: true,

      tempExpectedEndDate: null,
      isTempEndDateConfirmed: false,

      progressHistory: [],

      completionRequest: {
        from: null,
        type: null,
        status: null,
        requestedAt: null,
        requestedBy: null,
        approvedAt: null,
        rejectedAt: null,
        mentorNotes: null,
        learnerNotes: null,
      },

      learnerReview: undefined,
      mentorReview: undefined,

      lastProgressUpdate: null,
      nextMilestoneDate: null,
      isOverdue: false,
      overduedays: 0,

      progressPercentage: 0,
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    await Learner.findByIdAndUpdate(learner._id, {
      $inc: {
        userTotalProjects: 1,
        userActiveProjects: savedProject.status === "In Progress" ? 1 : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

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

    const userLearner = await Learner.findOne({ userId: req.user._id });
    const userMentor = await Mentor.findOne({ userId: req.user._id });

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

    if (!isOwner) {
      await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    const formattedProject = {
      ...project.toObject(),
      learner: project.learnerId,
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

const applyToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedPrice, coverLetter, estimatedDuration } = req.body;

    if (!proposedPrice || !coverLetter || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: proposedPrice, coverLetter, estimatedDuration",
      });
    }

    const price = parseFloat(proposedPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Proposed price must be a valid positive number",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting applications",
      });
    }

    if (project.mentorId) {
      return res.status(400).json({
        success: false,
        message: "This project already has an assigned mentor",
      });
    }

    const mentor = await Mentor.findOne({ userId: req.user._id });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can apply to projects",
      });
    }

    const existingApplication = project.applications.find(
      (app) => app.mentorId.toString() === mentor._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this project",
      });
    }

    const newApplication = {
      mentorId: mentor._id,
      proposedPrice: price,
      coverLetter: coverLetter.trim(),
      estimatedDuration: estimatedDuration.trim(),
      applicationStatus: "Pending",
      appliedAt: new Date(),
    };

    project.applications.push(newApplication);
    project.applicationsCount = project.applications.length;

    await project.save();

    await Mentor.findByIdAndUpdate(mentor._id, {
      $inc: {
        totalApplications: 1,
      },
    });

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

const acceptMentorApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

    const application = project.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.applicationStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This application has already been processed",
      });
    }

    application.applicationStatus = "Accepted";
    project.mentorId = application.mentorId;
    project.negotiatedPrice = application.proposedPrice;
    project.status = "In Progress";
    project.startDate = new Date();

    project.applications.forEach((app) => {
      if (
        app._id.toString() !== applicationId &&
        app.applicationStatus === "Pending"
      ) {
        app.applicationStatus = "Rejected";
      }
    });

    await project.save();

    await Learner.findByIdAndUpdate(userLearner._id, {
      $inc: {
        userActiveProjects: -1,
        userSessionsScheduled: 1,
      },
    });

    const mentorUser = await User.findById(application.mentorId);
    await Mentor.findByIdAndUpdate(application.mentorId, {
      $inc: {
        mentorActiveStudents: 1,
        totalStudents: 1,
        mentorSessionsScheduled: 1,
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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Opening price must be a valid positive number",
      });
    }

    if (project.status === "Completed" || project.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit completed or cancelled projects",
      });
    }

    const oldStatus = project.status;
    const newStatus = status || project.status;

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

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location");

    if (oldStatus !== newStatus) {
      const statusChanges = {};

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

      if (newStatus === "Completed" && oldStatus !== "Completed") {
        await Learner.findByIdAndUpdate(userLearner._id, {
          $inc: {
            completedSessions: 1,
            userCompletionRate: 1,
          },
        });
      } else if (newStatus === "Cancelled" && oldStatus !== "Cancelled") {
      }
    }

    res.json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);

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

const getProjectsForUser = async (req, res) => {
  try {
    const userLearner = await Learner.findOne({ userId: req.user._id });

    if (!userLearner) {
      return res.status(403).json({
        success: false,
        message: "Only learners can access this endpoint",
      });
    }

    const projects = await Project.find({ learnerId: userLearner._id })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location")
      .sort({ createdAt: -1 });

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

const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

    if (project.status === "In Progress" && project.mentorId) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete projects that are in progress with an assigned mentor",
      });
    }

    const projectStatus = project.status;

    if (project.mentorId) {
      await Mentor.findByIdAndUpdate(project.mentorId, {
        $inc: {
          mentorActiveStudents: project.status === "In Progress" ? -1 : 0,
          mentorSessionsScheduled: project.status === "In Progress" ? -1 : 0,
          totalStudents: -1,
        },
      });
    }

    await Project.findByIdAndDelete(id);

    const statsUpdate = { userTotalProjects: -1 };

    if (projectStatus === "Open") {
      statsUpdate.userActiveProjects = -1;
    } else if (projectStatus === "In Progress") {
      statsUpdate.userSessionsScheduled = -1;
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

const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const learner = await Learner.findOne({ userId: userId });

    if (!learner) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found for this user",
      });
    }

    const projects = await Project.find({ learnerId: learner._id })
      .populate("learnerId", "userId title description location")
      .populate("mentorId", "userId title description location")
      .sort({ createdAt: -1 });

    const mappedProjects = projects.map((project) => ({
      _id: project._id,
      projectId: project.projectId,
      title: project.name,
      description: project.shortDescription,
      fullDescription: project.fullDescription,
      status: project.status.toLowerCase().replace(" ", "-"),
      skills: project.techStack,
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

      learner: project.learnerId,
      mentor: project.mentorId,

      projectAge: project.projectAge,
      isOverdue: project.isOverdue,
      activePrice: project.activePrice,
    }));

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

    const allProjects = await Project.find({ learnerId: learner._id });
    console.log("Total projects for learner:", allProjects.length); // debug

    if (allProjects.length > 0) {
      console.log("All projects status breakdown:"); // debug
      allProjects.forEach((p, index) => {
        console.log(
          `  ${index + 1}. ${p.name} - Status: ${p.status} - Created: ${
            p.createdAt
          }`
        ); // debug
      });
    }

    const inProgressProject = await Project.findOne({
      learnerId: learner._id,
      status: "In Progress",
    })
      .populate({
        path: "mentorId",
        select: "userId title description location",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .sort({ updatedAt: -1, createdAt: -1 });

    console.log("In Progress project found:", inProgressProject ? "YES" : "NO"); // debug

    if (!inProgressProject) {
      return res.json({
        success: true,
        project: null,
        message: "No project with 'In Progress' status found for this learner",
        debug: {
          learnerId: learner._id,
          totalProjects: allProjects.length,
          inProgressProjectExists: false,
        },
      });
    }

    console.log("Found In Progress project details:"); // debug
    console.log("  Project ID:", inProgressProject._id); // debug
    console.log("  Project name:", inProgressProject.name); // debug
    console.log("  Project status:", inProgressProject.status); // debug
    console.log("  Project learnerId:", inProgressProject.learnerId); // debug
    console.log("  Project mentorId:", inProgressProject.mentorId); // debug

    if (inProgressProject.mentorId) {
      console.log("Mentor profile details:"); // debug
      console.log("  Mentor _id:", inProgressProject.mentorId._id); // debug
      console.log("  Mentor title:", inProgressProject.mentorId.title); // debug
      console.log(
        "  Mentor description:",
        inProgressProject.mentorId.description
      ); // debug
      console.log("  Mentor location:", inProgressProject.mentorId.location); // debug

      if (inProgressProject.mentorId.userId) {
        console.log("Mentor user details:"); // debug
        console.log("    User name:", inProgressProject.mentorId.userId.name); // debug
        console.log("    User email:", inProgressProject.mentorId.userId.email); // debug
        console.log(
          "    User avatar:",
          inProgressProject.mentorId.userId.avatar
        ); // debug
      }
    }

    console.log("Project is In Progress - returning project data"); // debug

    const formattedProject = {
      ...inProgressProject.toObject(),
      mentorId: inProgressProject.mentorId
        ? {
            _id: inProgressProject.mentorId._id,
            name: inProgressProject.mentorId.userId?.name || "Unknown Mentor",
            email: inProgressProject.mentorId.userId?.email || "",
            avatar:
              inProgressProject.mentorId.userId?.avatar ||
              "/uploads/public/default.jpg",
            title: inProgressProject.mentorId.title || "Mentor",
            description: inProgressProject.mentorId.description || "",
            location: inProgressProject.mentorId.location || "",
          }
        : {
            name: "No Mentor Assigned",
            title: "Pending Assignment",
            avatar: "/uploads/public/default.jpg",
          },
    };

    console.log("Formatted project mentor data:", formattedProject.mentorId); // debug
    console.log("=== END DEBUG ===");

    return res.json({
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
  limits: { fileSize: 5 * 1024 * 1024 },
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
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can access this endpoint",
      });
    }

    const learnersWithInProgressProjects = await Project.find({
      status: "In Progress",
    }).distinct("learnerId");

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
      .sort({ createdAt: -1 });

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

    const projectsWithApplications = await Project.find({
      "applications.mentorId": mentor._id,
    });

    const totalApplications = projectsWithApplications.length;
    const acceptedApplications = projectsWithApplications.filter((project) =>
      project.applications.some(
        (app) =>
          app.mentorId.toString() === mentor._id.toString() &&
          app.applicationStatus === "Accepted"
      )
    ).length;

    const activeProjects = await Project.countDocuments({
      mentorId: mentor._id,
      status: "In Progress",
    });

    const completedProjects = await Project.countDocuments({
      mentorId: mentor._id,
      status: "Completed",
    });

    const successRate =
      totalApplications > 0
        ? Math.round((acceptedApplications / totalApplications) * 100)
        : 0;

    const totalEarnings = 0;

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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!project.closingPrice) {
      return res.status(400).json({
        success: false,
        message: "Price not finalized yet",
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Project is no longer available",
      });
    }

    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can take projects",
      });
    }

    project.mentorId = mentor._id;
    project.status = "In Progress";
    project.startDate = new Date();

    await project.save();

    await Mentor.findByIdAndUpdate(mentor._id, {
      $inc: {
        mentorActiveStudents: 1,
        totalStudents: 1,
        mentorSessionsScheduled: 1,
      },
    });

    const Learner = require("../Model/Learner");
    await Learner.findByIdAndUpdate(project.learnerId, {
      $inc: {
        userActiveProjects: 1,
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

const completeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, earnings } = req.body;

    const project = await Project.findById(id);
    if (!project || project.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "Invalid project for completion",
      });
    }

    project.status = "Completed";
    project.actualEndDate = new Date();
    await project.save();

    await Mentor.findByIdAndUpdate(project.mentorId, {
      $inc: {
        mentorActiveStudents: -1,
        mentorSessionsCompleted: 1,
        completedSessions: 1,
        mentorTotalEarnings: earnings || 0,
      },
      $push: {
        sessionHistory: {
          learnerId: project.learnerId,
          sessionDate: new Date(),
          topic: project.name,
          duration: 60,
          rating: rating || 0,
          feedback: feedback || "",
          earnings: earnings || 0,
        },
      },
    });

    await Learner.findByIdAndUpdate(project.learnerId, {
      $inc: {
        userSessionsScheduled: -1,
        completedSessions: 1,
        userCompletionRate: 1,
      },
    });

    res.json({
      success: true,
      message: "Project completed successfully",
      project,
    });
  } catch (error) {
    console.error("Complete project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete project",
    });
  }
};

const cancelProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const project = await Project.findById(id);
    if (!project || project.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "Invalid project for cancellation",
      });
    }

    project.status = "Cancelled";
    await project.save();

    if (project.mentorId) {
      await Mentor.findByIdAndUpdate(project.mentorId, {
        $inc: {
          mentorActiveStudents: -1,
          mentorSessionsScheduled: -1,
        },
      });
    }

    await Learner.findByIdAndUpdate(project.learnerId, {
      $inc: {
        userSessionsScheduled: -1,
        userActiveProjects: 1,
      },
    });

    res.json({
      success: true,
      message: "Project cancelled successfully",
      project,
    });
  } catch (error) {
    console.error("Cancel project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel project",
    });
  }
};

const submitProjectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, reviewType } = req.body;

    const project = await Project.findById(id);
    if (!project || project.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Can only review completed projects",
      });
    }

    if (reviewType === "learner") {
      project.learnerReview = {
        rating,
        comment,
        reviewDate: new Date(),
      };

      await Mentor.findByIdAndUpdate(project.mentorId, {
        $inc: {
          totalReviews: 1,
        },
        $push: {
          reviews: {
            learnerId: project.learnerId,
            rating,
            comment,
            createdAt: new Date(),
          },
        },
      });
    } else if (reviewType === "mentor") {
      project.mentorReview = {
        rating,
        comment,
        reviewDate: new Date(),
      };

      await Learner.findByIdAndUpdate(project.learnerId, {
        $inc: {
          rating: rating,
        },
      });
    }

    await project.save();

    res.json({
      success: true,
      message: "Review submitted successfully",
      project,
    });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
};

const updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progressPercentage, note } = req.body;

    const project = await Project.findById(id);
    if (!project || project.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "Can only update progress for active projects",
      });
    }

    await project.addProgressUpdate(progressPercentage, note, req.user._id);

    if (progressPercentage >= 100) {
      await Mentor.findByIdAndUpdate(project.mentorId, {
        $inc: {
          mentorSatisfactionRate: 1,
        },
      });
    }

    res.json({
      success: true,
      message: "Progress updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update progress",
    });
  }
};

const setClosingPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, mentorId } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

    project.closingPrice = parseFloat(price);

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

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This project is not accepting pitches",
      });
    }

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

    await project.addOrUpdatePitch(
      mentor.userId._id,
      parseFloat(price),
      note || ""
    );

    const updatedProject = await Project.findById(id).populate({
      path: "pitches.mentor",
      select: "name email avatar",
    });

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

const getProjectPitches = async (req, res) => {
  try {
    const { id } = req.params;

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

const markPitchesAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

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

const getAvailableProjectsForMentorsUpdated = async (req, res) => {
  try {
    const Mentor = require("../Model/Mentor");
    const mentor = await Mentor.findOne({ userId: req.user._id });

    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: "Only mentors can access this endpoint",
      });
    }

    const hasActiveProject = await Project.findOne({
      mentorId: mentor._id,
      status: "In Progress",
    });

    const learnersWithInProgressProjects = await Project.find({
      status: "In Progress",
    }).distinct("learnerId");

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

    const formattedProjects = availableProjects.map((project) => {
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
        negotiatedPrice: negotiatedPrice,
        currency: project.currency,
        status: project.status,
        viewCount: project.viewCount,
        applicationsCount: project.applicationsCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        pitches: project.pitches,

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

        hasApplied:
          project.applications?.some(
            (app) => app.mentorId.toString() === mentor._id.toString()
          ) || false,

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
  completeProject,
  cancelProject,
  submitProjectReview,
  updateProjectProgress,
};
