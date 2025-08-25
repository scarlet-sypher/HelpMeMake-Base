const Project = require("../../Model/Project");
const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const Mentor = require("../../Model/Mentor");
const cloudinary = require("../../utils/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }
  },
}).single("thumbnail");

// Get all projects with mentor and learner details
const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { projectId: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Add status filter if provided
    if (status) {
      searchQuery.status = status;
    }

    // Get projects with pagination
    const projects = await Project.find(searchQuery)
      .populate({
        path: "learnerId",
        select: "name email avatar",
      })
      .populate({
        path: "mentorId",
        select: "name email avatar",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalProjects = await Project.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProjects / limit);

    // Format the response data
    const formattedProjects = projects.map((project) => ({
      ...project,
      learner: project.learnerId
        ? {
            _id: project.learnerId._id,
            name: project.learnerId.name,
            email: project.learnerId.email,
            avatar: project.learnerId.avatar,
          }
        : null,
      mentor: project.mentorId
        ? {
            _id: project.mentorId._id,
            name: project.mentorId.name,
            email: project.mentorId.email,
            avatar: project.mentorId.avatar,
          }
        : null,
    }));

    res.json({
      success: true,
      message: "Projects retrieved successfully",
      data: {
        projects: formattedProjects,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProjects,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve projects",
    });
  }
};

// Get project by ID with full details
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate({
        path: "learnerId",
        select: "name email avatar",
      })
      .populate({
        path: "mentorId",
        select: "name email avatar",
      })
      .populate({
        path: "milestones",
        select: "title description status dueDate progress",
      })
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Format the response data
    const formattedProject = {
      ...project,
      learner: project.learnerId
        ? {
            _id: project.learnerId._id,
            name: project.learnerId.name,
            email: project.learnerId.email,
            avatar: project.learnerId.avatar,
          }
        : null,
      mentor: project.mentorId
        ? {
            _id: project.mentorId._id,
            name: project.mentorId.name,
            email: project.mentorId.email,
            avatar: project.mentorId.avatar,
          }
        : null,
    };

    res.json({
      success: true,
      message: "Project retrieved successfully",
      data: formattedProject,
    });
  } catch (error) {
    console.error("Get project by ID error:", error);

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

// Update project
const updateProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    try {
      const { projectId } = req.params;
      const updateData = { ...req.body };

      // Find the project first
      const existingProject = await Project.findById(projectId);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Handle thumbnail upload if provided
      if (req.file) {
        try {
          // Upload new thumbnail to Cloudinary
          const streamUpload = () => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                {
                  folder: "project-thumbnails",
                  public_id: `project-${projectId}-${Date.now()}`,
                  overwrite: true,
                },
                (error, result) => {
                  if (result) resolve(result);
                  else reject(error);
                }
              );
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
          };

          const result = await streamUpload();
          updateData.thumbnail = result.secure_url;

          // Optionally delete old thumbnail from Cloudinary
          if (
            existingProject.thumbnail &&
            !existingProject.thumbnail.includes("default-project")
          ) {
            // Extract public_id from URL and delete
            // This is optional - you might want to keep old images
          }
        } catch (uploadError) {
          console.error("Thumbnail upload error:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Failed to upload thumbnail",
          });
        }
      }

      // Handle array fields properly
      if (updateData.techStack && typeof updateData.techStack === "string") {
        updateData.techStack = updateData.techStack
          .split(",")
          .map((tech) => tech.trim());
      }

      if (updateData.tags && typeof updateData.tags === "string") {
        updateData.tags = updateData.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase());
      }

      if (
        updateData.prerequisites &&
        typeof updateData.prerequisites === "string"
      ) {
        updateData.prerequisites = updateData.prerequisites
          .split(",")
          .map((prereq) => prereq.trim());
      }

      // Parse references if provided as JSON string
      if (updateData.references && typeof updateData.references === "string") {
        try {
          updateData.references = JSON.parse(updateData.references);
        } catch (parseError) {
          // If parsing fails, keep original or set empty array
          console.warn("Failed to parse references:", parseError);
        }
      }

      // Update the project
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate({
          path: "learnerId",
          select: "name email avatar",
        })
        .populate({
          path: "mentorId",
          select: "name email avatar",
        });

      // Format response
      const formattedProject = {
        ...updatedProject.toObject(),
        learner: updatedProject.learnerId
          ? {
              _id: updatedProject.learnerId._id,
              name: updatedProject.learnerId.name,
              email: updatedProject.learnerId.email,
              avatar: updatedProject.learnerId.avatar,
            }
          : null,
        mentor: updatedProject.mentorId
          ? {
              _id: updatedProject.mentorId._id,
              name: updatedProject.mentorId.name,
              email: updatedProject.mentorId.email,
              avatar: updatedProject.mentorId.avatar,
            }
          : null,
      };

      res.json({
        success: true,
        message: "Project updated successfully",
        data: formattedProject,
      });
    } catch (error) {
      console.error("Update project error:", error);

      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors,
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
        message: "Failed to update project",
      });
    }
  });
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project first
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete related milestones
    const Milestone = require("../../Model/Milestone");
    await Milestone.deleteMany({ projectId });

    // Delete related message rooms
    const MessageRoom = require("../../Model/MessageRoom");
    await MessageRoom.deleteMany({ projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    // Optionally delete thumbnail from Cloudinary
    if (project.thumbnail && !project.thumbnail.includes("default-project")) {
      try {
        // Extract public_id from URL and delete from Cloudinary
        // This is optional based on your storage strategy
      } catch (cloudinaryError) {
        console.warn(
          "Failed to delete thumbnail from Cloudinary:",
          cloudinaryError
        );
        // Don't fail the deletion if Cloudinary cleanup fails
      }
    }

    res.json({
      success: true,
      message: "Project and related data deleted successfully",
      data: {
        deletedProjectId: projectId,
        deletedProjectName: project.name,
      },
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
      message: "Failed to delete project",
    });
  }
};

// Get project statistics for admin dashboard
const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({
      status: "In Progress",
    });
    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });
    const openProjects = await Project.countDocuments({ status: "Open" });
    const cancelledProjects = await Project.countDocuments({
      status: "Cancelled",
    });

    // Get projects by category
    const projectsByCategory = await Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get average project price
    const avgProjectPrice = await Project.aggregate([
      {
        $group: {
          _id: null,
          avgOpening: { $avg: "$openingPrice" },
          avgNegotiated: { $avg: "$negotiatedPrice" },
          avgClosing: { $avg: "$closingPrice" },
        },
      },
    ]);

    res.json({
      success: true,
      message: "Project statistics retrieved successfully",
      data: {
        totals: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          open: openProjects,
          cancelled: cancelledProjects,
        },
        categoryBreakdown: projectsByCategory,
        pricing: avgProjectPrice[0] || {
          avgOpening: 0,
          avgNegotiated: 0,
          avgClosing: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get project stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve project statistics",
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
};
