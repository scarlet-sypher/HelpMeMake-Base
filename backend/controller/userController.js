const User = require("../Model/User");
const Learner = require("../Model/Learner");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const { generateOTP, sendOTPEmail } = require("../config/emailService");

const getUserData = async (req, res) => {
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

    let learnerData = await Learner.findOne({ userId: user._id });

    if (!learnerData) {
      learnerData = new Learner({
        userId: user._id,
      });
      await learnerData.save();
    }

    const profileScore = calculateProfileScore(user, learnerData);

    const combinedData = {
      ...user.toObject(),
      ...learnerData.toObject(),
      userId: learnerData.userId,
      profileScore: profileScore,
      generatedPassword: user.tempPassword || null,
    };

    if (user.tempPassword) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { tempPassword: 1 },
      });
    }

    res.json({
      success: true,
      message: "User data retrieved successfully",
      user: combinedData,
    });
  } catch (error) {
    console.error("Get user data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user data",
    });
  }
};

const calculateProfileScore = (user, learner) => {
  let score = 0;
  const totalFields = 8;

  if (user.name && user.name.trim()) score += 12.5;
  if (user.email && user.email.trim()) score += 12.5;
  if (user.avatar && user.avatar !== "/uploads/public/default.jpg")
    score += 12.5;

  if (
    learner.title &&
    learner.title.trim() &&
    learner.title !== "Not mentioned"
  )
    score += 12.5;
  if (
    learner.description &&
    learner.description.trim() &&
    learner.description !== "To Lazy to type"
  )
    score += 12.5;
  if (
    learner.location &&
    learner.location.trim() &&
    learner.location !== "Home"
  )
    score += 12.5;

  const socialLinks = learner.socialLinks || {};
  let socialScore = 0;
  if (socialLinks.github && socialLinks.github !== "#") socialScore += 4.17;
  if (socialLinks.linkedin && socialLinks.linkedin !== "#") socialScore += 4.17;
  if (socialLinks.twitter && socialLinks.twitter !== "#") socialScore += 4.16;
  score += socialScore;

  return Math.round(score);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/userUploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `avatar-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
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
}).single("avatar");

const updateProfile = async (req, res) => {
  try {
    const { name, title, description, location, email } = req.body;
    const User = require("../Model/User");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, select: "-password" }
    );

    let profileScore = 0;
    let updatedLearner = null;

    if (req.user.role === "user") {
      const Learner = require("../Model/Learner");

      const currentLearner = await Learner.findOne({ userId: req.user._id });
      const isFirstUpdate = currentLearner && !currentLearner.isProfileUpdated;

      updatedLearner = await Learner.findOneAndUpdate(
        { userId: req.user._id },
        {
          title,
          description,
          location,

          ...(isFirstUpdate && { isProfileUpdated: true }),
        },
        { new: true, upsert: true }
      );

      profileScore = calculateProfileScore(updatedUser, updatedLearner);
    } else if (req.user.role === "mentor") {
      const Mentor = require("../Model/Mentor");
      await Mentor.findOneAndUpdate(
        { userId: req.user._id },
        { title, description, location },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      profileScore: profileScore,
      isProfileUpdated: updatedLearner?.isProfileUpdated || false,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

const updateSocialLinks = async (req, res) => {
  try {
    const { github, linkedin, twitter } = req.body;
    const socialLinksData = { github, linkedin, twitter };

    if (req.user.role === "user") {
      const Learner = require("../Model/Learner");
      await Learner.findOneAndUpdate(
        { userId: req.user._id },
        { socialLinks: socialLinksData },
        { new: true, upsert: true }
      );
    } else if (req.user.role === "mentor") {
      const Mentor = require("../Model/Mentor");
      await Mentor.findOneAndUpdate(
        { userId: req.user._id },
        { socialLinks: socialLinksData },
        { new: true, upsert: true }
      );
    }

    res.json({
      success: true,
      message: "Social links updated successfully",
    });
  } catch (error) {
    console.error("Update social links error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update social links",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const User = require("../Model/User");

    const user = await User.findById(req.user._id);

    if (
      user.authProvider !== "local" &&
      !user.tempPassword &&
      user.isPasswordUpdated !== false
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change password for ${user.authProvider} accounts that don't have a generated password`,
      });
    }

    const skipCurrentPasswordCheck =
      user.authProvider !== "local" &&
      (user.tempPassword || user.isPasswordUpdated === false);

    if (!skipCurrentPasswordCheck) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword,
      isPasswordUpdated: true,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

const uploadAvatar = async (req, res) => {
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
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
              public_id: `avatar-${req.user._id}`,
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

      const user = await User.findById(req.user._id);
      if (user.avatar && !user.avatar.includes("default.jpg")) {
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true, select: "-password" }
      );

      let profileScore = 0;
      if (req.user.role === "user") {
        const learnerData = await Learner.findOne({ userId: req.user._id });
        if (learnerData) {
          profileScore = calculateProfileScore(updatedUser, learnerData);
        }
      }

      res.json({
        success: true,
        message: "Profile picture updated successfully",
        avatar: avatarUrl,
        profileScore,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
      });
    }
  });
};

const sendProfileOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(req.user._id, {
      profileOTP: otp,
      profileOTPExpires: otpExpires,
    });

    await sendOTPEmail(
      user.email,
      otp,
      user.name || "User",
      "profile_verification"
    );

    res.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Send profile OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

const verifyProfileUpdate = async (req, res) => {
  try {
    const { otp, profileData } = req.body;
    const { name, title, description, location, email } = profileData;

    console.log("Received OTP verification request:", { otp, profileData }); // Debug log

    if (!otp || otp.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 6-digit OTP",
      });
    }

    const user = await User.findById(req.user._id).select(
      "+profileOTP +profileOTPExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User OTP data:", {
      stored: user.profileOTP,
      received: otp,
      expires: user.profileOTPExpires,
    }); // Debug log

    if (!user.profileOTP || !user.profileOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    if (new Date() > user.profileOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    if (user.profileOTP.toString() !== otp.toString()) {
      console.log("OTP mismatch:", { stored: user.profileOTP, received: otp });
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,

        $unset: {
          profileOTP: 1,
          profileOTPExpires: 1,
        },
      },
      { new: true, select: "-password" }
    );

    let profileScore = 0;
    let updatedLearner = null;

    if (req.user.role === "user") {
      const Learner = require("../Model/Learner");

      const currentLearner = await Learner.findOne({ userId: req.user._id });
      const isFirstUpdate = currentLearner && !currentLearner.isProfileUpdated;

      updatedLearner = await Learner.findOneAndUpdate(
        { userId: req.user._id },
        {
          title,
          description,
          location,

          ...(isFirstUpdate && { isProfileUpdated: true }),
        },
        { new: true, upsert: true }
      );

      profileScore = calculateProfileScore(updatedUser, updatedLearner);
    } else if (req.user.role === "mentor") {
      const Mentor = require("../Model/Mentor");
      await Mentor.findOneAndUpdate(
        { userId: req.user._id },
        { title, description, location },
        { new: true, upsert: true }
      );
    }

    console.log("Profile update successful"); // Debug log

    res.json({
      success: true,
      message: "Profile updated successfully",
      profileScore: profileScore,
      isProfileUpdated: updatedLearner?.isProfileUpdated || false,
    });
  } catch (error) {
    console.error("Verify profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify and update profile",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("Searching for user with ID:", userId); // Debug log

    const user = await User.findById(userId).select(
      "-password -otp -otpExpires -profileOTP -profileOTPExpires"
    );

    if (!user) {
      console.log("User not found in database:", userId); // Debug log
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User found:", user.name, user.role); // Debug log

    let userData = { ...user.toObject() };

    if (user.role === "user") {
      const learnerData = await Learner.findOne({ userId: user._id });

      if (learnerData) {
        userData = {
          ...userData,
          ...learnerData.toObject(),
          userId: learnerData.userId,
        };
        console.log("Learner data found and merged"); // Debug log
      } else {
        console.log("No learner data found, creating default"); // Debug log
        const newLearnerData = new Learner({
          userId: user._id,
          title: "Student",
          description: "No description provided",
          location: "Not specified",
        });
        await newLearnerData.save();

        userData = {
          ...userData,
          ...newLearnerData.toObject(),
          userId: newLearnerData.userId,
        };
      }
    } else if (user.role === "mentor") {
      const Mentor = require("../Model/Mentor");
      const mentorData = await Mentor.findOne({ userId: user._id });

      if (mentorData) {
        userData = {
          ...userData,
          ...mentorData.toObject(),
          userId: mentorData.userId,
        };
      }
    }

    delete userData.tempPassword;
    delete userData.isEmailVerified;
    delete userData.isAccountActive;
    delete userData.isPasswordUpdated;

    res.json({
      success: true,
      message: "User profile retrieved successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
    });
  }
};

module.exports = {
  getUserData,
  updateProfile,
  updateSocialLinks,
  changePassword,
  uploadAvatar,
  sendProfileOTP,
  verifyProfileUpdate,
  getUserById,
};
