const Project = require("../../Model/Project");
const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const Mentor = require("../../Model/Mentor");
const cloudinary = require("../../utils/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const skip = (page - 1) * limit;

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

    if (status) {
      searchQuery.status = status;
    }

    const projects = await Project.find(searchQuery)
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
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalProjects = await Project.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalProjects / limit);

    const formattedProjects = projects.map((project) => ({
      ...project,
      learner:
        project.learnerId && project.learnerId.userId
          ? {
              _id: project.learnerId.userId._id,
              name: project.learnerId.userId.name,
              email: project.learnerId.userId.email,
              avatar: project.learnerId.userId.avatar,
            }
          : null,
      mentor:
        project.mentorId && project.mentorId.userId
          ? {
              _id: project.mentorId.userId._id,
              name: project.mentorId.userId.name,
              email: project.mentorId.userId.email,
              avatar: project.mentorId.userId.avatar,
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

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || projectId === "undefined" || projectId === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid project ID is required",
      });
    }

    const project = await Project.findById(projectId)
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

    const formattedProject = {
      ...project,
      learner:
        project.learnerId && project.learnerId.userId
          ? {
              _id: project.learnerId.userId._id,
              name: project.learnerId.userId.name,
              email: project.learnerId.userId.email,
              avatar: project.learnerId.userId.avatar,
            }
          : null,
      mentor:
        project.mentorId && project.mentorId.userId
          ? {
              _id: project.mentorId.userId._id,
              name: project.mentorId.userId.name,
              email: project.mentorId.userId.email,
              avatar: project.mentorId.userId.avatar,
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

      const existingProject = await Project.findById(projectId);
      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      if (req.file) {
        try {
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

          if (
            existingProject.thumbnail &&
            !existingProject.thumbnail.includes("default-project")
          ) {
          }
        } catch (uploadError) {
          console.error("Thumbnail upload error:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Failed to upload thumbnail",
          });
        }
      }

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

      if (updateData.references && typeof updateData.references === "string") {
        try {
          updateData.references = JSON.parse(updateData.references);
        } catch (parseError) {
          console.warn("Failed to parse references:", parseError);
        }
      }

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

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const Milestone = require("../../Model/Milestone");
    await Milestone.deleteMany({ projectId });

    const MessageRoom = require("../../Model/MessageRoom");
    await MessageRoom.deleteMany({ projectId });

    await Project.findByIdAndDelete(projectId);

    if (project.thumbnail && !project.thumbnail.includes("default-project")) {
      try {
      } catch (cloudinaryError) {
        console.warn(
          "Failed to delete thumbnail from Cloudinary:",
          cloudinaryError
        );
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

    const projectsByCategory = await Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

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

const batchDeleteProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Project IDs array is required",
      });
    }

    // Find projects before deletion
    const projects = await Project.find({ _id: { $in: projectIds } });

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found to delete",
      });
    }

    // Delete related data
    const Milestone = require("../../Model/Milestone");
    await Milestone.deleteMany({ projectId: { $in: projectIds } });

    const MessageRoom = require("../../Model/MessageRoom");
    await MessageRoom.deleteMany({ projectId: { $in: projectIds } });

    // Delete projects
    const result = await Project.deleteMany({ _id: { $in: projectIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} projects deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
        requestedCount: projectIds.length,
      },
    });
  } catch (error) {
    console.error("Batch delete projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete projects",
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
  batchDeleteProjects,
};
