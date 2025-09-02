const Milestone = require("../Model/Milestone");
const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

const getMilestonesByProject = async (req, res) => {
  try {
    console.log("=== GET MILESTONES DEBUG ===");
    console.log("User from req.user:", req.user);
    console.log("Project ID from params:", req.params.projectId);

    const { projectId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    const project = await Project.findById(projectId);
    console.log("Project found:", project ? "YES" : "NO");
    if (project) {
      console.log("Project learner ID:", project.learnerId);
      console.log("Project mentor ID:", project.mentorId);
      console.log("Project status:", project.status);
    }

    let accessProject = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      console.log("Learner profile found:", learnerProfile ? "YES" : "NO");
      if (learnerProfile) {
        console.log("Learner profile ID:", learnerProfile._id);
        accessProject = await Project.findOne({
          _id: projectId,
          learnerId: learnerProfile._id,
        });
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");
      if (mentorProfile) {
        console.log("Mentor profile ID:", mentorProfile._id);
        accessProject = await Project.findOne({
          _id: projectId,
          mentorId: mentorProfile._id,
        });
      }
    }

    console.log("Access project found:", accessProject ? "YES" : "NO");

    if (!accessProject) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this project",
        debug: {
          userId,
          projectId,
          userRole,
          projectExists: !!project,
        },
      });
    }

    const milestones = await Milestone.find({ projectId })
      .sort({ order: 1, createdAt: 1 })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("Milestones found:", milestones.length);

    res.json({
      success: true,
      milestones,
      debug: {
        userId,
        projectId,
        milestonesCount: milestones.length,
      },
    });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestones",
      error: error.message,
    });
  }
};

const createMilestone = async (req, res) => {
  try {
    console.log("=== CREATE MILESTONE DEBUG ===");
    console.log("User from req.user:", req.user);
    console.log("Request body:", req.body);

    const { projectId, title, description, dueDate, order } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("Project ID from body:", projectId);
    console.log("User role:", userRole);

    let project = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      console.log("Learner profile found:", learnerProfile ? "YES" : "NO");
      if (learnerProfile) {
        console.log("Learner profile ID:", learnerProfile._id);
        project = await Project.findOne({
          _id: projectId,
          learnerId: learnerProfile._id,
          status: "In Progress",
        });
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");
      if (mentorProfile) {
        console.log("Mentor profile ID:", mentorProfile._id);
        project = await Project.findOne({
          _id: projectId,
          mentorId: mentorProfile._id,
          status: "In Progress",
        });
      }
    }

    console.log("Project found for creation:", project ? "YES" : "NO");
    if (project) {
      console.log("Project details:", {
        name: project.name,
        status: project.status,
        learnerId: project.learnerId,
        mentorId: project.mentorId,
      });
    }

    if (!project) {
      const anyProject = await Project.findById(projectId);
      return res.status(403).json({
        success: false,
        message: "Access denied or project not in progress",
        debug: {
          userId,
          projectId,
          userRole,
          projectExists: !!anyProject,
          projectStatus: anyProject?.status,
        },
      });
    }

    const existingMilestones = await Milestone.countDocuments({ projectId });
    console.log("Existing milestones count:", existingMilestones);

    if (existingMilestones >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 milestones allowed per project",
      });
    }

    const milestone = new Milestone({
      title: title.trim(),
      description: description || `Milestone: ${title.trim()}`,
      projectId,
      learnerId: project.learnerId,
      mentorId: project.mentorId,
      dueDate:
        dueDate ||
        project.expectedEndDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      order: order || existingMilestones + 1,
      status: "Not Started",
    });

    console.log("Milestone to be created:", {
      title: milestone.title,
      projectId: milestone.projectId,
      learnerId: milestone.learnerId,
      mentorId: milestone.mentorId,
    });

    await milestone.save();

    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("Milestone created successfully");

    res.status(201).json({
      success: true,
      milestone: populatedMilestone,
      message: "Milestone created successfully",
    });
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create milestone",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getActiveProjectWithMentor = async (req, res) => {
  try {
    console.log("=== GET ACTIVE PROJECT DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;
    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    let project = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        project = await Project.findOne({
          learnerId: learnerProfile._id,
          status: "In Progress",
        })
          .populate("learnerId", "name email avatar")
          .populate("mentorId", "name email avatar")
          .lean();
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        project = await Project.findOne({
          mentorId: mentorProfile._id,
          status: "In Progress",
        })
          .populate("learnerId", "name email avatar")
          .populate("mentorId", "name email avatar")
          .lean();
      }
    }

    console.log("Active project found:", project ? "YES" : "NO");

    if (!project) {
      return res.json({
        success: true,
        project: null,
        message: "No active project found",
        debug: {
          userId,
          userRole,
        },
      });
    }

    const existingMilestones = await Milestone.find({ projectId: project._id });
    console.log("Existing milestones for project:", existingMilestones.length);

    if (existingMilestones.length === 0) {
      console.log("Creating initial milestone...");

      await createInitialMilestone(
        project._id,
        project.learnerId._id || project.learnerId,
        project.mentorId._id || project.mentorId
      );
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error fetching active project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project data",
      error: error.message,
    });
  }
};

const createInitialMilestone = async (projectId, learnerId, mentorId) => {
  try {
    console.log("Creating initial milestone with:", {
      projectId,
      learnerId,
      mentorId,
    });

    const initialMilestone = new Milestone({
      title: "Project Setup & Planning",
      description: "Initial project setup and planning phase",
      projectId,
      learnerId,
      mentorId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      order: 1,
      status: "Not Started",
    });

    await initialMilestone.save();
    console.log("Initial milestone created successfully");
    return initialMilestone;
  } catch (error) {
    console.error("Error creating initial milestone:", error);
    throw error;
  }
};

const learnerVerifyMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { verificationNotes, submissionUrl } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          learnerId: learnerProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    milestone.learnerVerification.isVerified = true;
    milestone.learnerVerification.verifiedAt = new Date();
    milestone.learnerVerification.verificationNotes =
      verificationNotes || "Marked as done by learner";
    milestone.learnerVerification.submissionUrl = submissionUrl || "";

    if (milestone.mentorVerification.isVerified) {
      milestone.status = "Completed";
      milestone.completedDate = new Date();
    } else {
      milestone.status = "Pending Review";
    }

    await milestone.save();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Milestone marked as completed by learner",
    });
  } catch (error) {
    console.error("Error verifying milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify milestone",
      error: error.message,
    });
  }
};

const learnerUnverifyMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          learnerId: learnerProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    if (milestone.mentorVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Cannot undo milestone that has been approved by mentor",
      });
    }

    milestone.learnerVerification.isVerified = false;
    milestone.learnerVerification.verifiedAt = null;
    milestone.learnerVerification.verificationNotes = "";
    milestone.learnerVerification.submissionUrl = "";
    milestone.status = "Not Started";
    milestone.completedDate = null;

    await milestone.save();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Milestone verification undone",
    });
  } catch (error) {
    console.error("Error undoing milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to undo milestone",
      error: error.message,
    });
  }
};

const mentorVerifyMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { verificationNotes, rating, feedback } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          mentorId: mentorProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    if (!milestone.learnerVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Learner must verify milestone first",
      });
    }

    milestone.mentorVerification.isVerified = true;
    milestone.mentorVerification.verifiedAt = new Date();
    milestone.mentorVerification.verificationNotes =
      verificationNotes || "Approved by mentor";
    milestone.mentorVerification.rating = rating || 5;
    milestone.mentorVerification.feedback = feedback || "";

    milestone.status = "Completed";
    milestone.completedDate = new Date();

    await milestone.save();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Milestone approved by mentor",
    });
  } catch (error) {
    console.error("Error mentor verifying milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify milestone",
      error: error.message,
    });
  }
};

const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          learnerId: learnerProfile._id,
        });
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          mentorId: mentorProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    if (
      milestone.learnerVerification.isVerified &&
      milestone.mentorVerification.isVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Milestone is complete and cannot be modified.",
      });
    }

    if (
      milestone.learnerVerification.isVerified ||
      milestone.mentorVerification.isVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete milestone with existing verifications",
      });
    }

    await Milestone.findByIdAndDelete(milestoneId);

    const remainingMilestones = await Milestone.find({
      projectId: milestone.projectId,
    }).sort({ order: 1 });

    for (let i = 0; i < remainingMilestones.length; i++) {
      remainingMilestones[i].order = i + 1;
      await remainingMilestones[i].save();
    }

    res.json({
      success: true,
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete milestone",
      error: error.message,
    });
  }
};

const getMilestoneById = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          learnerId: learnerProfile._id,
        })
          .populate("learnerId", "name email avatar")
          .populate("mentorId", "name email avatar")
          .populate("projectId", "name shortDescription")
          .lean();
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          mentorId: mentorProfile._id,
        })
          .populate("learnerId", "name email avatar")
          .populate("mentorId", "name email avatar")
          .populate("projectId", "name shortDescription")
          .lean();
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    res.json({
      success: true,
      milestone,
    });
  } catch (error) {
    console.error("Error fetching milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestone",
      error: error.message,
    });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      if (learnerProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          learnerId: learnerProfile._id,
        });
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          mentorId: mentorProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    if (
      milestone.learnerVerification.isVerified &&
      milestone.mentorVerification.isVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Milestone is complete and cannot be modified.",
      });
    }

    if (title) milestone.title = title.trim();
    if (description) milestone.description = description;
    if (dueDate) milestone.dueDate = dueDate;

    await milestone.save();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Milestone updated successfully",
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update milestone",
      error: error.message,
    });
  }
};

const getMentorMilestones = async (req, res) => {
  try {
    console.log("=== GET MENTOR MILESTONES DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Mentor role required.",
      });
    }

    const mentorProfile = await Mentor.findOne({ userId });
    console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const projects = await Project.find({
      mentorId: mentorProfile._id,
      status: "In Progress",
    })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("In-progress projects found:", projects.length);

    const projectIds = projects.map((p) => p._id);
    const milestones = await Milestone.find({
      projectId: { $in: projectIds },
    })
      .sort({ projectId: 1, order: 1, createdAt: 1 })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .populate(
        "projectId",
        "name shortDescription thumbnail skills closingPrice"
      )
      .lean();

    const projectsWithMilestones = projects.map((project) => ({
      ...project,
      milestones: milestones.filter(
        (m) => m.projectId._id.toString() === project._id.toString()
      ),
    }));

    console.log("Projects with milestones:", projectsWithMilestones.length);

    res.json({
      success: true,
      projects: projectsWithMilestones,
      totalProjects: projects.length,
      totalMilestones: milestones.length,
    });
  } catch (error) {
    console.error("Error fetching mentor milestones:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor milestones",
      error: error.message,
    });
  }
};

const addReviewNote = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { note } = req.body;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can add review notes",
      });
    }

    let milestone = null;
    const mentorProfile = await Mentor.findOne({ userId });

    if (mentorProfile) {
      milestone = await Milestone.findOne({
        _id: milestoneId,
        mentorId: mentorProfile._id,
      });
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    await milestone.addReviewNote(userId, note);

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Review note added successfully",
    });
  } catch (error) {
    console.error("Error adding review note:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review note",
      error: error.message,
    });
  }
};

const markReviewAsRead = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    if (userRole !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only learners can mark reviews as read",
      });
    }

    let milestone = null;
    const learnerProfile = await Learner.findOne({ userId });

    if (learnerProfile) {
      milestone = await Milestone.findOne({
        _id: milestoneId,
        learnerId: learnerProfile._id,
      });
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    await milestone.markReviewAsRead();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .populate("projectId", "name shortDescription")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Review marked as read",
    });
  } catch (error) {
    console.error("Error marking review as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark review as read",
      error: error.message,
    });
  }
};

const mentorUnverifyMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let milestone = null;

    if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      if (mentorProfile) {
        milestone = await Milestone.findOne({
          _id: milestoneId,
          mentorId: mentorProfile._id,
        });
      }
    }

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found or access denied",
      });
    }

    if (!milestone.learnerVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Cannot undo verification when learner hasn't verified yet",
      });
    }

    milestone.mentorVerification.isVerified = false;
    milestone.mentorVerification.verifiedAt = null;
    milestone.mentorVerification.verificationNotes = "";
    milestone.mentorVerification.rating = null;
    milestone.mentorVerification.feedback = "";
    milestone.status = "Pending Review";
    milestone.completedDate = null;

    await milestone.save();

    const updatedMilestone = await Milestone.findById(milestoneId)
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    res.json({
      success: true,
      milestone: updatedMilestone,
      message: "Mentor verification undone",
    });
  } catch (error) {
    console.error("Error undoing mentor verification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to undo mentor verification",
      error: error.message,
    });
  }
};

const getMentorActiveProjectProgress = async (req, res) => {
  try {
    console.log("=== GET MENTOR ACTIVE PROJECT PROGRESS DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Mentor role required.",
      });
    }

    const mentorProfile = await Mentor.findOne({ userId });
    console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const activeProject = await Project.findOne({
      mentorId: mentorProfile._id,
      status: "In Progress",
    })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("Active project found:", activeProject ? "YES" : "NO");

    if (!activeProject) {
      return res.json({
        success: true,
        project: null,
        learner: null,
        milestones: [],
        message: "No active project found",
        debug: {
          userId,
          userRole,
        },
      });
    }

    const milestones = await Milestone.find({ projectId: activeProject._id })
      .sort({ order: 1, createdAt: 1 })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("Milestones found:", milestones.length);

    const transformedMilestones = milestones.slice(0, 5).map((milestone) => ({
      id: milestone._id,
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      status: milestone.status,
      order: milestone.order,
      userVerified: milestone.learnerVerification?.isVerified || false,
      mentorVerified: milestone.mentorVerification?.isVerified || false,
      learnerVerification: milestone.learnerVerification,
      mentorVerification: milestone.mentorVerification,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
    }));

    const completedMilestones = transformedMilestones.filter(
      (m) => m.userVerified && m.mentorVerified
    );
    const inProgressMilestones = transformedMilestones.filter(
      (m) =>
        (m.userVerified || m.mentorVerified) &&
        !(m.userVerified && m.mentorVerified)
    );
    const pendingMilestones = transformedMilestones.filter(
      (m) => !m.userVerified && !m.mentorVerified
    );

    const progressPercentage =
      transformedMilestones.length > 0
        ? Math.round(
            (completedMilestones.length / transformedMilestones.length) * 100
          )
        : 0;

    const learnerDetails = {
      id: activeProject.learnerId._id,
      name: activeProject.learnerId.name,
      email: activeProject.learnerId.email,
      avatar: activeProject.learnerId.avatar,
    };

    const projectDetails = {
      id: activeProject._id,
      name: activeProject.name,
      shortDescription: activeProject.shortDescription,
      status: activeProject.status,
      startDate: activeProject.startDate,
      expectedEndDate: activeProject.expectedEndDate,
      progressPercentage:
        activeProject.progressPercentage || progressPercentage,
      totalMilestones: transformedMilestones.length,
      completedMilestones: completedMilestones.length,
    };

    res.json({
      success: true,
      project: projectDetails,
      learner: learnerDetails,
      milestones: transformedMilestones,
      statistics: {
        total: transformedMilestones.length,
        completed: completedMilestones.length,
        inProgress: inProgressMilestones.length,
        pending: pendingMilestones.length,
        progressPercentage: progressPercentage,
      },
      message: "Mentor active project progress fetched successfully",
      debug: {
        userId,
        projectId: activeProject._id,
        milestonesCount: milestones.length,
        mentorProfileId: mentorProfile._id,
      },
    });
  } catch (error) {
    console.error("Error fetching mentor active project progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor active project progress",
      error: error.message,
    });
  }
};

const getMilestonesByProjectWithUserData = async (req, res) => {
  try {
    console.log("=== GET MILESTONES WITH USER DATA DEBUG ===");
    console.log("User from req.user:", req.user);
    console.log("Project ID from params:", req.params.projectId);

    const { projectId } = req.params;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    const project = await Project.findById(projectId);
    console.log("Project found:", project ? "YES" : "NO");
    if (project) {
      console.log("Project learner ID:", project.learnerId);
      console.log("Project mentor ID:", project.mentorId);
      console.log("Project status:", project.status);
    }

    let accessProject = null;

    if (userRole === "user") {
      const learnerProfile = await Learner.findOne({ userId });
      console.log("Learner profile found:", learnerProfile ? "YES" : "NO");
      if (learnerProfile) {
        console.log("Learner profile ID:", learnerProfile._id);
        accessProject = await Project.findOne({
          _id: projectId,
          learnerId: learnerProfile._id,
        });
      }
    } else if (userRole === "mentor") {
      const mentorProfile = await Mentor.findOne({ userId });
      console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");
      if (mentorProfile) {
        console.log("Mentor profile ID:", mentorProfile._id);
        accessProject = await Project.findOne({
          _id: projectId,
          mentorId: mentorProfile._id,
        });
      }
    }

    console.log("Access project found:", accessProject ? "YES" : "NO");

    if (!accessProject) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this project",
        debug: {
          userId,
          projectId,
          userRole,
          projectExists: !!project,
        },
      });
    }

    const milestones = await Milestone.find({ projectId })
      .sort({ order: 1, createdAt: 1 })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .lean();

    console.log("Milestones found:", milestones.length);

    const transformedMilestones = milestones.map((milestone) => {
      return {
        ...milestone,
        learnerId: milestone.learnerId?.userId || milestone.learnerId,
        mentorId: milestone.mentorId?.userId || milestone.mentorId,
      };
    });

    res.json({
      success: true,
      milestones: transformedMilestones,
      debug: {
        userId,
        projectId,
        milestonesCount: transformedMilestones.length,
      },
    });
  } catch (error) {
    console.error("Error fetching milestones with user data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch milestones",
      error: error.message,
    });
  }
};

const getMentorActiveProjectProgressWithAvatars = async (req, res) => {
  try {
    console.log(
      "=== GET MENTOR ACTIVE PROJECT PROGRESS WITH AVATARS DEBUG ==="
    );
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    if (userRole !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Mentor role required.",
      });
    }

    const mentorProfile = await Mentor.findOne({ userId });
    console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    const activeProject = await Project.findOne({
      mentorId: mentorProfile._id,
      status: "In Progress",
    })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .lean();

    console.log("Active project found:", activeProject ? "YES" : "NO");

    if (!activeProject) {
      return res.json({
        success: true,
        project: null,
        learner: null,
        milestones: [],
        message: "No active project found",
        debug: {
          userId,
          userRole,
        },
      });
    }

    const milestones = await Milestone.find({ projectId: activeProject._id })
      .sort({ order: 1, createdAt: 1 })
      .populate({
        path: "learnerId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .populate({
        path: "mentorId",
        populate: {
          path: "userId",
          select: "name email avatar",
        },
      })
      .lean();

    console.log("Milestones found:", milestones.length);

    const transformedMilestones = milestones.slice(0, 5).map((milestone) => ({
      id: milestone._id,
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      status: milestone.status,
      order: milestone.order,
      userVerified: milestone.learnerVerification?.isVerified || false,
      mentorVerified: milestone.mentorVerification?.isVerified || false,
      learnerVerification: milestone.learnerVerification,
      mentorVerification: milestone.mentorVerification,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,

      learnerUser: milestone.learnerId?.userId || null,
      mentorUser: milestone.mentorId?.userId || null,
    }));

    const completedMilestones = transformedMilestones.filter(
      (m) => m.userVerified && m.mentorVerified
    );
    const inProgressMilestones = transformedMilestones.filter(
      (m) =>
        (m.userVerified || m.mentorVerified) &&
        !(m.userVerified && m.mentorVerified)
    );
    const pendingMilestones = transformedMilestones.filter(
      (m) => !m.userVerified && !m.mentorVerified
    );

    const progressPercentage =
      transformedMilestones.length > 0
        ? Math.round(
            (completedMilestones.length / transformedMilestones.length) * 100
          )
        : 0;

    const learnerDetails = {
      id: activeProject.learnerId._id,
      name: activeProject.learnerId.userId?.name || "Unknown Learner",
      email: activeProject.learnerId.userId?.email || "",
      avatar:
        activeProject.learnerId.userId?.avatar || "/uploads/public/default.jpg",

      title: activeProject.learnerId.title || "Not mentioned",
      description: activeProject.learnerId.description || "To Lazy to type",
      location: activeProject.learnerId.location || "Home",
      level: activeProject.learnerId.level || 0,
      xp: activeProject.learnerId.xp || 0,
      rating: activeProject.learnerId.rating || 0,
    };

    const projectDetails = {
      id: activeProject._id,
      name: activeProject.name,
      shortDescription: activeProject.shortDescription,
      status: activeProject.status,
      startDate: activeProject.startDate,
      expectedEndDate: activeProject.expectedEndDate,
      progressPercentage:
        activeProject.progressPercentage || progressPercentage,
      totalMilestones: transformedMilestones.length,
      completedMilestones: completedMilestones.length,
    };

    res.json({
      success: true,
      project: projectDetails,
      learner: learnerDetails,
      milestones: transformedMilestones,
      statistics: {
        total: transformedMilestones.length,
        completed: completedMilestones.length,
        inProgress: inProgressMilestones.length,
        pending: pendingMilestones.length,
        progressPercentage: progressPercentage,
      },
      message:
        "Mentor active project progress with avatars fetched successfully",
      debug: {
        userId,
        projectId: activeProject._id,
        milestonesCount: milestones.length,
        mentorProfileId: mentorProfile._id,
        learnerAvatarFound: !!activeProject.learnerId.userId?.avatar,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching mentor active project progress with avatars:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor active project progress with avatars",
      error: error.message,
    });
  }
};

module.exports = {
  getActiveProjectWithMentor,
  getMilestonesByProject,
  getMentorMilestones,
  getMentorActiveProjectProgress,
  createMilestone,
  learnerVerifyMilestone,
  learnerUnverifyMilestone,
  mentorVerifyMilestone,
  mentorUnverifyMilestone,
  deleteMilestone,
  getMilestoneById,
  updateMilestone,
  addReviewNote,
  markReviewAsRead,
  getMilestonesByProjectWithUserData,
  getMentorActiveProjectProgressWithAvatars,
};
