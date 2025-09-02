const express = require("express");
const { requireUser, requireUserOrMentor } = require("../middleware/roleAuth");
const mongoose = require("mongoose");
const {
  getUserData,
  updateProfile,
  updateSocialLinks,
  changePassword,
  uploadAvatar,
  sendProfileOTP,
  verifyProfileUpdate,
  getUserById,
} = require("../controller/userController");
const router = express.Router();

router.get("/data", requireUser, getUserData);

router.get("/dashboard", requireUser, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to User Dashboard!",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

router.get("/profile", requireUser, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.patch("/update-profile", requireUser, updateProfile);
router.patch("/social-links", requireUser, updateSocialLinks);
router.patch("/change-password", requireUser, changePassword);
router.patch("/upload-avatar", requireUser, uploadAvatar);

router.post("/send-profile-otp", requireUser, sendProfileOTP);
router.patch("/verify-profile-update", requireUser, verifyProfileUpdate);

router.patch("/profile", requireUser, async (req, res) => {
  try {
    const { name, title, description, location, socialLinks } = req.body;
    const User = require("../Model/User");
    const Learner = require("../Model/Learner");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, select: "-password" }
    );

    const updatedLearner = await Learner.findOneAndUpdate(
      { userId: req.user._id },
      { title, description, location, socialLinks },
      { new: true, upsert: true }
    );

    const combinedData = {
      ...updatedUser.toObject(),
      ...updatedLearner.toObject(),
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

router.get("/:userId", requireUserOrMentor, async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }
  return getUserById(req, res, next);
});

module.exports = router;
