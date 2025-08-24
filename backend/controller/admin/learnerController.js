const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const upload = multer({
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
}).single("avatar");

// Get all learners with their user details
const getAllLearners = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Build search query
    let userSearchQuery = {};
    if (search) {
      userSearchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // First get users with learner role
    const users = await User.find({
      role: "user",
      ...userSearchQuery,
    }).select("-password -otp -otpExpires -profileOTP -profileOTPExpires");

    if (!users.length) {
      return res.json({
        success: true,
        message: "No learners found",
        data: {
          learners: [],
          pagination: {
            total: 0,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: 0,
          },
        },
      });
    }

    // Get learner data for these users
    const userIds = users.map((user) => user._id);
    const learners = await Learner.find({ userId: { $in: userIds } });

    // Create a map for quick lookup
    const learnerMap = new Map();
    learners.forEach((learner) => {
      learnerMap.set(learner.userId.toString(), learner);
    });

    // Combine user and learner data
    const combinedData = users.map((user) => {
      const learnerData = learnerMap.get(user._id.toString());
      return {
        ...user.toObject(),
        learnerDetails: learnerData || null,
      };
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = combinedData.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: "Learners retrieved successfully",
      data: {
        learners: paginatedData,
        pagination: {
          total: combinedData.length,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(combinedData.length / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all learners error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve learners",
    });
  }
};

// Get single learner by ID
const getLearnerById = async (req, res) => {
  try {
    const { learnerId } = req.params;

    // Get user data
    const user = await User.findById(learnerId).select(
      "-password -otp -otpExpires -profileOTP -profileOTPExpires"
    );

    if (!user || user.role !== "user") {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Get learner data
    let learnerData = await Learner.findOne({ userId: user._id });

    // Create default learner data if doesn't exist
    if (!learnerData) {
      learnerData = new Learner({
        userId: user._id,
      });
      await learnerData.save();
    }

    const combinedData = {
      ...user.toObject(),
      learnerDetails: learnerData,
    };

    res.json({
      success: true,
      message: "Learner retrieved successfully",
      data: combinedData,
    });
  } catch (error) {
    console.error("Get learner by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid learner ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve learner",
    });
  }
};

// Update learner data
const updateLearner = async (req, res) => {
  try {
    const { learnerId } = req.params;
    const {
      name,
      email,
      title,
      description,
      location,
      socialLinks,
      level,
      xp,
      isOnline,
    } = req.body;

    // Verify user exists and is a learner
    const user = await User.findById(learnerId);
    if (!user || user.role !== "user") {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      learnerId,
      {
        ...(name && { name }),
        ...(email && { email }),
      },
      {
        new: true,
        select: "-password -otp -otpExpires -profileOTP -profileOTPExpires",
      }
    );

    // Update learner data
    const learnerUpdateData = {};
    if (title !== undefined) learnerUpdateData.title = title;
    if (description !== undefined) learnerUpdateData.description = description;
    if (location !== undefined) learnerUpdateData.location = location;
    if (socialLinks !== undefined) learnerUpdateData.socialLinks = socialLinks;
    if (level !== undefined) learnerUpdateData.level = level;
    if (xp !== undefined) learnerUpdateData.xp = xp;
    if (isOnline !== undefined) learnerUpdateData.isOnline = isOnline;

    const updatedLearner = await Learner.findOneAndUpdate(
      { userId: learnerId },
      learnerUpdateData,
      { new: true, upsert: true }
    );

    const combinedData = {
      ...updatedUser.toObject(),
      learnerDetails: updatedLearner,
    };

    res.json({
      success: true,
      message: "Learner updated successfully",
      data: combinedData,
    });
  } catch (error) {
    console.error("Update learner error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update learner",
    });
  }
};

// Update learner avatar
const updateLearnerAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
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

    try {
      const { learnerId } = req.params;

      // Verify user exists and is a learner
      const user = await User.findById(learnerId);
      if (!user || user.role !== "user") {
        return res.status(404).json({
          success: false,
          message: "Learner not found",
        });
      }

      // Upload to Cloudinary
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              public_id: `learner-avatar-${learnerId}`,
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

      const result = await streamUpload(req);
      const avatarUrl = result.secure_url;

      // Update user avatar
      const updatedUser = await User.findByIdAndUpdate(
        learnerId,
        { avatar: avatarUrl },
        {
          new: true,
          select: "-password -otp -otpExpires -profileOTP -profileOTPExpires",
        }
      );

      res.json({
        success: true,
        message: "Learner avatar updated successfully",
        data: {
          avatar: avatarUrl,
          user: updatedUser,
        },
      });
    } catch (error) {
      console.error("Update learner avatar error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update learner avatar",
      });
    }
  });
};

// Delete learner (soft delete by deactivating account)
const deleteLearner = async (req, res) => {
  try {
    const { learnerId } = req.params;
    const { confirmationText } = req.body;

    // Get user data first to validate confirmation
    const user = await User.findById(learnerId);
    if (!user || user.role !== "user") {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Validate confirmation text
    const expectedText = `I want to delete ${user.name || user.email}`;
    if (confirmationText !== expectedText) {
      return res.status(400).json({
        success: false,
        message:
          "Confirmation text does not match. Please type exactly: " +
          expectedText,
      });
    }

    // Delete learner data
    await Learner.findOneAndDelete({ userId: learnerId });

    // Delete user account
    await User.findByIdAndDelete(learnerId);

    res.json({
      success: true,
      message: "Learner deleted successfully",
    });
  } catch (error) {
    console.error("Delete learner error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete learner",
    });
  }
};

// Get learner statistics
const getLearnerStats = async (req, res) => {
  try {
    const totalLearners = await User.countDocuments({ role: "user" });
    const activeLearners = await User.aggregate([
      { $match: { role: "user" } },
      {
        $lookup: {
          from: "learners",
          localField: "_id",
          foreignField: "userId",
          as: "learnerData",
        },
      },
      {
        $match: {
          "learnerData.isOnline": true,
        },
      },
      { $count: "count" },
    ]);

    const newLearnersThisMonth = await User.countDocuments({
      role: "user",
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    res.json({
      success: true,
      data: {
        total: totalLearners,
        active: activeLearners[0]?.count || 0,
        newThisMonth: newLearnersThisMonth,
      },
    });
  } catch (error) {
    console.error("Get learner stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get learner statistics",
    });
  }
};

module.exports = {
  getAllLearners,
  getLearnerById,
  updateLearner,
  updateLearnerAvatar,
  deleteLearner,
  getLearnerStats,
};
