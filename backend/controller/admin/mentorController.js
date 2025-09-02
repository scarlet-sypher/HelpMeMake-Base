const User = require("../../Model/User");
const Mentor = require("../../Model/Mentor");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../utils/cloudinary");
const streamifier = require("streamifier");

const adminMentorController = {
  getAllMentors: async (req, res) => {
    try {
      const { search } = req.query;

      let userSearchQuery = { role: "mentor" };
      if (search) {
        userSearchQuery.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { _id: search.length === 24 ? search : null },
        ].filter(Boolean);
      }

      const mentors = await User.aggregate([
        { $match: userSearchQuery },
        {
          $lookup: {
            from: "mentors",
            localField: "_id",
            foreignField: "userId",
            as: "mentorProfile",
          },
        },
        {
          $unwind: {
            path: "$mentorProfile",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            password: 0,
            otp: 0,
            otpExpires: 0,
            profileOTP: 0,
            profileOTPExpires: 0,
            tempPassword: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      res.json({
        success: true,
        message: "Mentors retrieved successfully",
        data: {
          mentors,
          total: mentors.length,
        },
      });
    } catch (error) {
      console.error("Get all mentors error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve mentors",
      });
    }
  },

  getMentorById: async (req, res) => {
    try {
      const { mentorId } = req.params;

      const mentor = await Mentor.findById(mentorId).populate({
        path: "userId",
        select:
          "-password -otp -otpExpires -profileOTP -profileOTPExpires -tempPassword",
      });

      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Mentor not found",
        });
      }

      res.json({
        success: true,
        message: "Mentor retrieved successfully",
        data: mentor,
      });
    } catch (error) {
      console.error("Get mentor by ID error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid mentor ID format",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to retrieve mentor",
      });
    }
  },

  updateMentor: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const updateData = req.body;

      const userFields = ["name", "email"];
      const userData = {};
      const mentorData = {};

      Object.keys(updateData).forEach((key) => {
        if (userFields.includes(key)) {
          userData[key] = updateData[key];
        } else {
          mentorData[key] = updateData[key];
        }
      });

      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Mentor not found",
        });
      }

      if (Object.keys(userData).length > 0) {
        await User.findByIdAndUpdate(mentor.userId, userData, { new: true });
      }

      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        mentorData,
        { new: true }
      ).populate({
        path: "userId",
        select:
          "-password -otp -otpExpires -profileOTP -profileOTPExpires -tempPassword",
      });

      res.json({
        success: true,
        message: "Mentor updated successfully",
        data: updatedMentor,
      });
    } catch (error) {
      console.error("Update mentor error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid mentor ID format",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to update mentor",
      });
    }
  },

  updateMentorAvatar: async (req, res) => {
    try {
      const { mentorId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Mentor not found",
        });
      }

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              public_id: `mentor-avatar-${mentor.userId}`,
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
      const avatarUrl = result.secure_url;

      await User.findByIdAndUpdate(mentor.userId, { avatar: avatarUrl });

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        data: { avatar: avatarUrl },
      });
    } catch (error) {
      console.error("Update mentor avatar error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
      });
    }
  },

  deleteMentor: async (req, res) => {
    try {
      const { mentorId } = req.params;
      const { confirmationText } = req.body;

      const mentor = await Mentor.findById(mentorId).populate({
        path: "userId",
        select: "name email",
      });

      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Mentor not found",
        });
      }

      const expectedText = `I want to delete ${mentor.userId.name}`;
      if (confirmationText !== expectedText) {
        return res.status(400).json({
          success: false,
          message:
            "Confirmation text does not match. Please type exactly: " +
            expectedText,
        });
      }

      await Mentor.findByIdAndDelete(mentorId);

      await User.findByIdAndDelete(mentor.userId._id);

      res.json({
        success: true,
        message: "Mentor deleted successfully",
      });
    } catch (error) {
      console.error("Delete mentor error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid mentor ID format",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to delete mentor",
      });
    }
  },

  getMentorStats: async (req, res) => {
    try {
      const stats = await Mentor.aggregate([
        {
          $group: {
            _id: null,
            totalMentors: { $sum: 1 },
            onlineMentors: { $sum: { $cond: ["$isOnline", 1, 0] } },
            availableMentors: { $sum: { $cond: ["$isAvailable", 1, 0] } },
            averageRating: { $avg: "$rating" },
            totalSessions: { $sum: "$completedSessions" },
            totalStudents: { $sum: "$totalStudents" },
          },
        },
      ]);

      const mentorStats = stats[0] || {
        totalMentors: 0,
        onlineMentors: 0,
        availableMentors: 0,
        averageRating: 0,
        totalSessions: 0,
        totalStudents: 0,
      };

      res.json({
        success: true,
        message: "Mentor statistics retrieved successfully",
        data: mentorStats,
      });
    } catch (error) {
      console.error("Get mentor stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve mentor statistics",
      });
    }
  },
};

module.exports = adminMentorController;
