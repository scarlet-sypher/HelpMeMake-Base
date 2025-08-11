const Milestone = require("../Model/Milestone");
const Project = require("../Model/Project");
const User = require("../Model/User");
const Learner = require("../Model/Learner");
const Mentor = require("../Model/Mentor");

// Get milestones for a specific project
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

    // First, let's just find the project without access check to debug
    const project = await Project.findById(projectId);
    console.log("Project found:", project ? "YES" : "NO");
    if (project) {
      console.log("Project learner ID:", project.learnerId);
      console.log("Project mentor ID:", project.mentorId);
      console.log("Project status:", project.status);
    }

    // Verify user has access to this project based on role
    let accessProject = null;

    if (userRole === "user") {
      // For learners, find their learner profile first
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
      // For mentors, find their mentor profile first
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

// Create a new milestone
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

    // Verify user has access to this project based on role
    let project = null;

    if (userRole === "user") {
      // For learners, find their learner profile first
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
      // For mentors, find their mentor profile first
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
      // Let's check if project exists but with different status
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

    // Check if user already has 5 milestones
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

    // Populate the milestone before sending response
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

// Get active project with mentor for the logged-in user
const getActiveProjectWithMentor = async (req, res) => {
  try {
    console.log("=== GET ACTIVE PROJECT DEBUG ===");
    console.log("User from req.user:", req.user);

    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;
    console.log("Extracted userId:", userId);
    console.log("User role:", userRole);

    // Find the user's active project that's "In Progress" based on role
    let project = null;

    if (userRole === "user") {
      // For learners, find their learner profile first
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
      // For mentors, find their mentor profile first
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

    // Auto-create milestone entry if it doesn't exist for this project
    const existingMilestones = await Milestone.find({ projectId: project._id });
    console.log("Existing milestones for project:", existingMilestones.length);

    if (existingMilestones.length === 0) {
      console.log("Creating initial milestone...");
      // Create initial milestone structure for the project
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

// Helper function to create initial milestone entry
const createInitialMilestone = async (projectId, learnerId, mentorId) => {
  try {
    console.log("Creating initial milestone with:", {
      projectId,
      learnerId,
      mentorId,
    });

    // This is just a placeholder milestone that gets created when project starts
    const initialMilestone = new Milestone({
      title: "Project Setup & Planning",
      description: "Initial project setup and planning phase",
      projectId,
      learnerId,
      mentorId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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

// Learner verify milestone
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

    // Update learner verification
    milestone.learnerVerification.isVerified = true;
    milestone.learnerVerification.verifiedAt = new Date();
    milestone.learnerVerification.verificationNotes =
      verificationNotes || "Marked as done by learner";
    milestone.learnerVerification.submissionUrl = submissionUrl || "";

    // Update status based on verification state
    if (milestone.mentorVerification.isVerified) {
      milestone.status = "Completed";
      milestone.completedDate = new Date();
    } else {
      milestone.status = "Pending Review";
    }

    await milestone.save();

    // Populate and return updated milestone
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

// Learner unverify milestone
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

    // Can only undo if mentor hasn't verified yet
    if (milestone.mentorVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Cannot undo milestone that has been approved by mentor",
      });
    }

    // Reset learner verification
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

// Mentor verify milestone
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

    // Mentor can only verify if learner has already verified
    if (!milestone.learnerVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Learner must verify milestone first",
      });
    }

    // Update mentor verification
    milestone.mentorVerification.isVerified = true;
    milestone.mentorVerification.verifiedAt = new Date();
    milestone.mentorVerification.verificationNotes =
      verificationNotes || "Approved by mentor";
    milestone.mentorVerification.rating = rating || 5;
    milestone.mentorVerification.feedback = feedback || "";

    // Both parties verified - mark as completed
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

// Delete milestone
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

    // Check if milestone is completed (both verifications done)
    if (
      milestone.learnerVerification.isVerified &&
      milestone.mentorVerification.isVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Milestone is complete and cannot be modified.",
      });
    }

    // Can't delete if any verification exists
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

    // Reorder remaining milestones
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

// Get milestone by ID
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

// Update milestone (edit functionality)
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

    // Check if milestone is completed (both verifications done)
    if (
      milestone.learnerVerification.isVerified &&
      milestone.mentorVerification.isVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Milestone is complete and cannot be modified.",
      });
    }

    // Update fields
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

    // Find mentor profile
    const mentorProfile = await Mentor.findOne({ userId });
    console.log("Mentor profile found:", mentorProfile ? "YES" : "NO");

    if (!mentorProfile) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found",
      });
    }

    // Get all in-progress projects for this mentor
    const projects = await Project.find({
      mentorId: mentorProfile._id,
      status: "In Progress",
    })
      .populate("learnerId", "name email avatar")
      .populate("mentorId", "name email avatar")
      .lean();

    console.log("In-progress projects found:", projects.length);

    // Get milestones for all projects
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

    // Group milestones by project
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

// Add review note to milestone (Mentor only)
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

    // Add review note using schema method
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

// Mark review as read (Learner only)
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

    // Mark review as read using schema method
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

    // Can only undo if learner has verified (mentor can't undo if learner hasn't verified)
    if (!milestone.learnerVerification.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Cannot undo verification when learner hasn't verified yet",
      });
    }

    // Reset mentor verification
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

module.exports = {
  getActiveProjectWithMentor,
  getMilestonesByProject,
  getMentorMilestones,
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
};
