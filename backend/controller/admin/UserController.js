const User = require("../../Model/User");
const Learner = require("../../Model/Learner");
const Mentor = require("../../Model/Mentor");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");
const path = require("path");

// Configure multer for memory storage
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

const adminUserController = {
  // Get all users with their role-specific data
  getAllUsers: async (req, res) => {
    try {
      const { search, role, page = 1, limit = 20 } = req.query;

      // Build query object
      let query = {};

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : null },
        ].filter(Boolean);
      }

      // Role filter
      if (role && role !== "all") {
        query.role = role;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get users with pagination
      const users = await User.find(query)
        .select("-password -otp -otpExpires -profileOTP -profileOTPExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await User.countDocuments(query);

      // Enrich users with role-specific data
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          let roleSpecificData = {};

          if (user.role === "user") {
            const learnerData = await Learner.findOne({ userId: user._id });
            if (learnerData) {
              roleSpecificData = {
                title: learnerData.title,
                description: learnerData.description,
                location: learnerData.location,
                socialLinks: learnerData.socialLinks,
                isProfileUpdated: learnerData.isProfileUpdated,
              };
            }
          } else if (user.role === "mentor") {
            const mentorData = await Mentor.findOne({ userId: user._id });
            if (mentorData) {
              roleSpecificData = {
                title: mentorData.title,
                description: mentorData.description,
                location: mentorData.location,
                socialLinks: mentorData.socialLinks,
                expertise: mentorData.expertise,
                experience: mentorData.experience,
                hourlyRate: mentorData.hourlyRate,
                availability: mentorData.availability,
              };
            }
          }

          return {
            ...user.toObject(),
            ...roleSpecificData,
          };
        })
      );

      res.json({
        success: true,
        message: "Users retrieved successfully",
        data: {
          users: enrichedUsers,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / parseInt(limit)),
            totalUsers,
            hasNextPage: skip + enrichedUsers.length < totalUsers,
            hasPrevPage: parseInt(page) > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
      });
    }
  },

  // Get single user by ID
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      const user = await User.findById(userId).select(
        "-password -otp -otpExpires -profileOTP -profileOTPExpires"
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      let roleSpecificData = {};

      if (user.role === "user") {
        const learnerData = await Learner.findOne({ userId: user._id });
        if (learnerData) {
          roleSpecificData = learnerData.toObject();
        }
      } else if (user.role === "mentor") {
        const mentorData = await Mentor.findOne({ userId: user._id });
        if (mentorData) {
          roleSpecificData = mentorData.toObject();
        }
      }

      const enrichedUser = {
        ...user.toObject(),
        ...roleSpecificData,
      };

      res.json({
        success: true,
        message: "User retrieved successfully",
        data: enrichedUser,
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user",
      });
    }
  },

  // Update user data
  updateUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Extract base user fields
      const {
        name,
        email,
        role,
        isEmailVerified,
        isAccountActive,
        authProvider,
        password,
        // Role-specific fields
        title,
        description,
        location,
        socialLinks,
        expertise,
        experience,
        hourlyRate,
        availability,
        ...otherFields
      } = updateData;

      // Update base user data
      const userUpdateData = {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(isEmailVerified !== undefined && { isEmailVerified }),
        ...(isAccountActive !== undefined && { isAccountActive }),
        ...(authProvider !== undefined && { authProvider }),
      };

      // Handle password update
      if (password && password.trim()) {
        const saltRounds = 12;
        userUpdateData.password = await bcrypt.hash(password, saltRounds);
        userUpdateData.isPasswordUpdated = true;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, userUpdateData, {
        new: true,
        runValidators: true,
      }).select("-password -otp -otpExpires -profileOTP -profileOTPExpires");

      // Update role-specific data
      let roleSpecificUpdate = null;

      if (updatedUser.role === "user") {
        const learnerUpdateData = {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(location !== undefined && { location }),
          ...(socialLinks !== undefined && { socialLinks }),
        };

        if (Object.keys(learnerUpdateData).length > 0) {
          roleSpecificUpdate = await Learner.findOneAndUpdate(
            { userId: updatedUser._id },
            learnerUpdateData,
            { new: true, upsert: true }
          );
        }
      } else if (updatedUser.role === "mentor") {
        const mentorUpdateData = {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(location !== undefined && { location }),
          ...(socialLinks !== undefined && { socialLinks }),
          ...(expertise !== undefined && { expertise }),
          ...(experience !== undefined && { experience }),
          ...(hourlyRate !== undefined && { hourlyRate }),
          ...(availability !== undefined && { availability }),
        };

        if (Object.keys(mentorUpdateData).length > 0) {
          roleSpecificUpdate = await Mentor.findOneAndUpdate(
            { userId: updatedUser._id },
            mentorUpdateData,
            { new: true, upsert: true }
          );
        }
      }

      const responseData = {
        ...updatedUser.toObject(),
        ...(roleSpecificUpdate && roleSpecificUpdate.toObject()),
      };

      res.json({
        success: true,
        message: "User updated successfully",
        data: responseData,
      });
    } catch (error) {
      console.error("Update user error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  },

  // Update user avatar
  updateUserAvatar: async (req, res) => {
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
        const { userId } = req.params;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({
            success: false,
            message: "Invalid user ID format",
          });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        // Upload to Cloudinary
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "avatars",
                public_id: `avatar-${userId}`,
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
          userId,
          { avatar: avatarUrl },
          { new: true }
        ).select("-password -otp -otpExpires -profileOTP -profileOTPExpires");

        res.json({
          success: true,
          message: "Avatar updated successfully",
          data: {
            avatar: avatarUrl,
            user: updatedUser,
          },
        });
      } catch (error) {
        console.error("Update avatar error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to update avatar",
        });
      }
    });
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete role-specific data
      if (user.role === "user") {
        await Learner.findOneAndDelete({ userId: user._id });
      } else if (user.role === "mentor") {
        await Mentor.findOneAndDelete({ userId: user._id });
      }

      // Delete the user
      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: "User deleted successfully",
        data: { deletedUserId: userId },
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
      });
    }
  },

  // Get user statistics
  getUserStats: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalLearners = await User.countDocuments({ role: "user" });
      const totalMentors = await User.countDocuments({ role: "mentor" });
      const verifiedUsers = await User.countDocuments({
        isEmailVerified: true,
      });
      const activeUsers = await User.countDocuments({ isAccountActive: true });
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });

      // Get users by auth provider
      const authProviders = await User.aggregate([
        {
          $group: {
            _id: "$authProvider",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({
        success: true,
        message: "User statistics retrieved successfully",
        data: {
          totalUsers,
          totalLearners,
          totalMentors,
          verifiedUsers,
          activeUsers,
          recentUsers,
          authProviders: authProviders.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve user statistics",
      });
    }
  },
};

module.exports = adminUserController;
