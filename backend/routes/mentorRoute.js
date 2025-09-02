const express = require("express");
const {
  requireMentor,
  requireUserOrMentor,
} = require("../middleware/roleAuth");
const {
  getAllMentors,
  getMentorById,
  searchMentors,
  getMentorStats,
  updateSocialLinks,
  changePassword,
  updatePersonalDetails,
  updateProfile,
  sendProfileOTP,
  verifyProfileUpdate,
  uploadAvatar,
} = require("../controller/mentorController");
const {
  getMentorApplicationStats,
  getMentorActiveProjectStatus,
} = require("../controller/projectController");
const User = require("../Model/User");
const Mentor = require("../Model/Mentor");
const { getMentorWithAIReason } = require("../controller/mentorController");
const router = express.Router();

router.get("/all", requireUserOrMentor, getAllMentors);

router.get("/search", requireUserOrMentor, searchMentors);

router.get("/stats/overview", getMentorStats);

router.get("/dashboard", requireMentor, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Mentor Dashboard!",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get("/data", requireMentor, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let mentorData = await Mentor.findOne({ userId: user._id });

    if (!mentorData) {
      mentorData = new Mentor({
        userId: user._id,
      });
      await mentorData.save();
    }

    const combinedData = {
      ...user.toObject(),
      ...mentorData.toObject(),
    };

    res.json({
      success: true,
      message: "Mentor data retrieved successfully",
      user: combinedData,
    });
  } catch (error) {
    console.error("Get mentor data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor data",
    });
  }
});

router.get("/profile", requireMentor, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.patch("/profile", requireMentor, async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      bio,
      location,
      expertise,
      socialLinks,
      pricing,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, select: "-password" }
    );

    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: req.user._id },
      { title, description, bio, location, expertise, socialLinks, pricing },
      { new: true, upsert: true }
    );

    if (updatedMentor.calculateProfileCompleteness) {
      updatedMentor.calculateProfileCompleteness();
      await updatedMentor.save();
    }

    const combinedData = {
      ...updatedUser.toObject(),
      ...updatedMentor.toObject(),
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: combinedData,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

router.get(
  "/active-project-status",
  requireMentor,
  getMentorActiveProjectStatus
);

router.get("/application-stats", requireMentor, getMentorApplicationStats);

router.get("/ai-reason/:id", requireUserOrMentor, getMentorWithAIReason);

router.get("/:id", requireUserOrMentor, getMentorById);

router.patch("/social-links", requireMentor, updateSocialLinks);

router.patch("/change-password", requireMentor, changePassword);

router.patch("/update-personal", requireMentor, updatePersonalDetails);

router.patch("/update-profile", requireMentor, updateProfile);

router.post("/send-profile-otp", requireMentor, sendProfileOTP);

router.patch("/verify-profile-update", requireMentor, verifyProfileUpdate);

router.patch("/upload-avatar", requireMentor, uploadAvatar);

module.exports = router;
