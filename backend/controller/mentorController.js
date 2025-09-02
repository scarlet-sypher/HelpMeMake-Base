const Mentor = require("../Model/Mentor");
const User = require("../Model/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const { generateOTP, sendOTPEmail } = require("../config/emailService");
const path = require("path");

const getAllMentors = async (req, res) => {
  try {
    const {
      category,
      expertise,
      minRating,
      maxPrice,
      isOnline,
      sortBy = "rating",
      sortOrder = "desc",
      limit = 50,
    } = req.query;

    let filter = { isAvailable: true };

    if (category) {
      filter["expertise.skill"] = { $regex: category, $options: "i" };
    }

    if (expertise) {
      filter["expertise.skill"] = { $regex: expertise, $options: "i" };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (maxPrice) {
      filter["pricing.hourlyRate"] = { $lte: parseFloat(maxPrice) };
    }

    if (isOnline !== undefined) {
      filter.isOnline = isOnline === "true";
    }

    let sort = {};
    const validSortFields = [
      "rating",
      "totalStudents",
      "completedSessions",
      "responseTime",
      "pricing.hourlyRate",
      "createdAt",
    ];

    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.rating = -1;
    }

    const mentors = await Mentor.find(filter)
      .populate("userId", "name email avatar isEmailVerified")
      .sort(sort)
      .limit(parseInt(limit))
      .lean();

    const activeMentors = mentors.filter(
      (mentor) => mentor.userId && mentor.userId.isEmailVerified
    );

    const formattedMentors = activeMentors.map((mentor) => {
      let profileCompleteness = mentor.profileCompleteness;
      if (profileCompleteness < 50) {
        profileCompleteness = calculateProfileCompleteness(mentor);
      }

      return {
        _id: mentor._id,
        userId: mentor.userId,
        title: mentor.title,
        description: mentor.description,
        bio: mentor.bio,
        location: mentor.location,
        experience: mentor.experience,
        expertise: mentor.expertise,
        specializations: mentor.specializations,
        isOnline: mentor.isOnline,
        isAvailable: mentor.isAvailable,
        rating: mentor.rating,
        totalReviews: mentor.totalReviews,
        socialLinks: mentor.socialLinks,
        completedSessions: mentor.completedSessions,
        totalStudents: mentor.totalStudents,
        responseTime: mentor.responseTime,
        badges: mentor.badges,
        achievements: mentor.achievements,
        pricing: mentor.pricing,
        availability: mentor.availability,
        verification: {
          isVerified: mentor.verification?.isVerified || false,
          verificationLevel: mentor.verification?.verificationLevel || "none",
        },
        teachingPreferences: mentor.teachingPreferences,
        joinDate: mentor.joinDate,
        profileCompleteness,

        successRate:
          mentor.completedSessions > 0
            ? Math.floor(
                (mentor.completedSessions / (mentor.completedSessions + 2)) *
                  100
              )
            : 85,
        primaryExpertise:
          mentor.expertise
            ?.filter(
              (exp) => exp.level === "expert" || exp.level === "advanced"
            )
            ?.map((exp) => exp.skill)
            ?.slice(0, 3) || [],
      };
    });

    const sortedMentors = formattedMentors.sort((a, b) => {
      if (a.profileCompleteness >= 60 && b.profileCompleteness < 60) return -1;
      if (a.profileCompleteness < 60 && b.profileCompleteness >= 60) return 1;

      if (a.rating !== b.rating) return b.rating - a.rating;

      return b.totalStudents - a.totalStudents;
    });

    res.json({
      success: true,
      message: "Mentors retrieved successfully",
      mentors: sortedMentors,
      count: sortedMentors.length,
      filters: {
        category,
        expertise,
        minRating,
        maxPrice,
        isOnline,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Get all mentors error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentors. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const calculateProfileCompleteness = (mentor) => {
  let completeness = 20;

  if (mentor.bio && mentor.bio.length > 50) completeness += 15;
  if (mentor.expertise && mentor.expertise.length > 0) completeness += 20;
  if (mentor.experience?.companies && mentor.experience.companies.length > 0)
    completeness += 15;
  if (mentor.socialLinks?.linkedin && mentor.socialLinks.linkedin !== "#")
    completeness += 10;
  if (mentor.pricing?.hourlyRate && mentor.pricing.hourlyRate > 0)
    completeness += 10;
  if (
    mentor.availability?.weeklyHours &&
    mentor.availability.weeklyHours.length > 0
  )
    completeness += 10;

  return Math.min(completeness, 100);
};

const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID is required",
      });
    }

    const mentor = await Mentor.findById(id)
      .populate("userId", "name email avatar isEmailVerified createdAt")
      .populate("reviews.learnerId", "name avatar");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (!mentor.userId || !mentor.userId.isEmailVerified) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile is not available",
      });
    }

    res.json({
      success: true,
      message: "Mentor retrieved successfully",
      mentor,
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
};

const searchMentors = async (req, res) => {
  try {
    const { query, category, skills } = req.query;

    if (!query && !category && !skills) {
      return res.status(400).json({
        success: false,
        message: "Search query, category, or skills parameter is required",
      });
    }

    let searchFilter = { isAvailable: true };

    const searchConditions = [];

    if (query) {
      searchConditions.push(
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } },
        { "expertise.skill": { $regex: query, $options: "i" } },
        { specializations: { $regex: query, $options: "i" } }
      );
    }

    if (category) {
      searchConditions.push({
        "expertise.skill": { $regex: category, $options: "i" },
      });
    }

    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      searchConditions.push({
        "expertise.skill": {
          $in: skillsArray.map((skill) => new RegExp(skill, "i")),
        },
      });
    }

    if (searchConditions.length > 0) {
      searchFilter.$or = searchConditions;
    }

    const mentors = await Mentor.find(searchFilter)
      .populate("userId", "name email avatar isEmailVerified")
      .sort({ rating: -1, totalStudents: -1 })
      .limit(20)
      .lean();

    const activeMentors = mentors.filter(
      (mentor) => mentor.userId && mentor.userId.isEmailVerified
    );

    res.json({
      success: true,
      message: "Search completed successfully",
      mentors: activeMentors,
      count: activeMentors.length,
      searchTerms: { query, category, skills },
    });
  } catch (error) {
    console.error("Search mentors error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed. Please try again.",
    });
  }
};

const getMentorStats = async (req, res) => {
  try {
    const stats = await Mentor.aggregate([
      {
        $group: {
          _id: null,
          totalMentors: { $sum: 1 },
          activeMentors: { $sum: { $cond: ["$isAvailable", 1, 0] } },
          onlineMentors: { $sum: { $cond: ["$isOnline", 1, 0] } },
          averageRating: { $avg: "$rating" },
          totalSessions: { $sum: "$completedSessions" },
          totalStudents: { $sum: "$totalStudents" },
        },
      },
    ]);

    const categoryStats = await Mentor.aggregate([
      { $unwind: "$expertise" },
      {
        $group: {
          _id: "$expertise.skill",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      message: "Mentor statistics retrieved successfully",
      stats: stats[0] || {
        totalMentors: 0,
        activeMentors: 0,
        onlineMentors: 0,
        averageRating: 0,
        totalSessions: 0,
        totalStudents: 0,
      },
      categoryStats,
    });
  } catch (error) {
    console.error("Get mentor stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor statistics",
    });
  }
};

const getMentorWithAIReason = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Mentor ID is required",
      });
    }

    const mentor = await Mentor.findById(id)
      .populate("userId", "name email avatar isEmailVerified createdAt")
      .populate("reviews.learnerId", "name avatar");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    if (!mentor.userId || !mentor.userId.isEmailVerified) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile is not available",
      });
    }

    let aiReason = null;
    let aiScore = null;

    if (projectId) {
      try {
        const Project = require("../Model/Project");
        const project = await Project.findById(projectId);

        if (project) {
          const aiResponse = await generateMentorReasoning(project, mentor);
          aiReason = aiResponse.reason;
          aiScore = aiResponse.score;
        }
      } catch (aiError) {
        console.error("AI reasoning generation failed:", aiError);
      }
    }

    res.json({
      success: true,
      message: "Mentor details retrieved successfully",
      mentor,
      aiReason,
      aiScore,
    });
  } catch (error) {
    console.error("Get mentor with AI reason error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid mentor ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve mentor details",
    });
  }
};

const generateMentorReasoning = async (project, mentor) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI expert mentor selector. Analyze why this specific mentor is suitable for this project. Give the reason in very professional way

PROJECT DETAILS:
${JSON.stringify(
  {
    name: project.name,
    category: project.category,
    techStack: project.techStack,
    difficultyLevel: project.difficultyLevel,
    shortDescription: project.shortDescription,
    duration: project.duration,
    openingPrice: project.openingPrice,
    prerequisites: project.prerequisites || [],
  },
  null,
  2
)}

MENTOR DETAILS:
${JSON.stringify(
  {
    name: mentor.userId?.name || "Anonymous",
    title: mentor.title,
    expertise: mentor.expertise,
    rating: mentor.rating,
    totalStudents: mentor.totalStudents,
    completedSessions: mentor.completedSessions,
    experience: mentor.experience,
    responseTime: mentor.responseTime,
    pricing: mentor.pricing,
    description: mentor.description,
  },
  null,
  2
)}

TASK:
1. Analyze why this mentor is suitable for this specific project
2. Score the mentor out of 100 based on compatibility
3. Provide detailed reasoning covering:
   - Technical skill alignment
   - Experience level match
   - Communication and availability
   - Value proposition

RESPONSE FORMAT (JSON only):
{
  "score": 95,
  "reason": "This mentor is an excellent match because [detailed explanation]. Key strengths include [specific points]. The mentor's expertise in [specific skills] directly aligns with your project's [specific requirements]."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    let cleanResponse = response.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }
    if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/```\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedResponse = JSON.parse(cleanResponse);

    return {
      score: parsedResponse.score || 75,
      reason:
        parsedResponse.reason ||
        "This mentor appears to be a good match based on their expertise and experience.",
    };
  } catch (error) {
    console.error("AI reasoning generation error:", error);
    return {
      score: 75,
      reason:
        "This mentor was recommended based on their relevant skills and experience profile.",
    };
  }
};

const updateSocialLinks = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { github, linkedin, twitter, portfolio, blog } = req.body;

    const urlPattern = /^https?:\/\/.+/;
    const socialLinks = { github, linkedin, twitter, portfolio, blog };

    for (const [platform, url] of Object.entries(socialLinks)) {
      if (url && url !== "#" && url.trim() !== "") {
        if (!urlPattern.test(url)) {
          return res.status(400).json({
            success: false,
            message: `Invalid URL format for ${platform}. Please include http:// or https://`,
          });
        }
      }
    }

    Object.keys(socialLinks).forEach((key) => {
      if (socialLinks[key] === "" || socialLinks[key] === "#") {
        socialLinks[key] = "#";
      }
    });

    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: mentorId },
      {
        socialLinks,

        $inc: {
          profileCompleteness:
            github && github !== "#" && linkedin && linkedin !== "#" ? 5 : 0,
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Social links updated successfully!",
      socialLinks: updatedMentor.socialLinks,
    });
  } catch (error) {
    console.error("Update social links error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update social links. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Password cannot be changed for OAuth accounts",
      });
    }

    if (user.password && !user.tempPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required",
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      isPasswordUpdated: true,
      tempPassword: null,
    });

    await Mentor.findOneAndUpdate(
      { userId: userId },
      {
        isPasswordUpdated: true,

        $inc: { profileCompleteness: user.tempPassword ? 10 : 0 },
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updatePersonalDetails = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const {
      experience,
      expertise,
      specializations,
      availability,
      teachingPreferences,
    } = req.body;

    if (expertise && Array.isArray(expertise)) {
      for (const skill of expertise) {
        if (!skill.skill || !skill.level) {
          return res.status(400).json({
            success: false,
            message: "Each expertise must have skill name and level",
          });
        }

        if (
          !["beginner", "intermediate", "advanced", "expert"].includes(
            skill.level
          )
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid skill level. Must be: beginner, intermediate, advanced, or expert",
          });
        }
      }
    }

    if (teachingPreferences) {
      if (
        teachingPreferences.maxStudentsPerSession &&
        (teachingPreferences.maxStudentsPerSession < 1 ||
          teachingPreferences.maxStudentsPerSession > 10)
      ) {
        return res.status(400).json({
          success: false,
          message: "Max students per session must be between 1 and 10",
        });
      }

      if (
        teachingPreferences.sessionTypes &&
        Array.isArray(teachingPreferences.sessionTypes)
      ) {
        const validTypes = ["one-on-one", "group", "workshop", "code-review"];
        const invalidTypes = teachingPreferences.sessionTypes.filter(
          (type) => !validTypes.includes(type)
        );

        if (invalidTypes.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid session types: ${invalidTypes.join(", ")}`,
          });
        }
      }
    }

    if (availability && availability.timezone) {
      const validTimezones = [
        "UTC",
        "EST",
        "CST",
        "MST",
        "PST",
        "GMT",
        "CET",
        "IST",
        "JST",
        "AEST",
      ];
      if (!validTimezones.includes(availability.timezone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid timezone",
        });
      }
    }

    let updateData = {};

    if (experience) updateData.experience = experience;
    if (expertise) updateData.expertise = expertise;
    if (specializations) updateData.specializations = specializations;
    if (availability) updateData.availability = availability;
    if (teachingPreferences)
      updateData.teachingPreferences = teachingPreferences;

    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: mentorId },
      updateData,
      { new: true, upsert: true }
    );

    if (updatedMentor.calculateProfileCompleteness) {
      updatedMentor.calculateProfileCompleteness();
      await updatedMentor.save();
    }

    res.json({
      success: true,
      message: "Personal details updated successfully!",
      mentor: updatedMentor,
    });
  } catch (error) {
    console.error("Update personal details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update personal details. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, title, bio, description, location, pricing } = req.body;

    const userUpdateData = {};
    if (name) userUpdateData.name = name;

    let updatedUser = null;
    if (Object.keys(userUpdateData).length > 0) {
      updatedUser = await User.findByIdAndUpdate(userId, userUpdateData, {
        new: true,
        select: "-password -otp -otpExpires",
      });
    }

    const mentorUpdateData = {};
    if (title) mentorUpdateData.title = title;
    if (bio !== undefined) mentorUpdateData.bio = bio;
    if (description) mentorUpdateData.description = description;
    if (location) mentorUpdateData.location = location;
    if (pricing) mentorUpdateData.pricing = pricing;

    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: userId },
      mentorUpdateData,
      { new: true, upsert: true }
    );

    if (updatedMentor.calculateProfileCompleteness) {
      updatedMentor.calculateProfileCompleteness();
      await updatedMentor.save();
    }

    const combinedData = {
      ...(updatedUser ? updatedUser.toObject() : req.user.toObject()),
      ...updatedMentor.toObject(),
    };

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: combinedData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

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

const sendProfileOTP = async (req, res) => {
  try {
    console.log("🔄 Sending profile OTP for user:", req.user._id);

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("❌ User not found:", req.user._id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    console.log("🔑 Generated OTP:", otp);
    console.log("⏰ OTP expires at:", otpExpires);
    console.log("⏱️ Current time:", new Date());

    const updateResult = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileOTP: otp,
        profileOTPExpires: otpExpires,
      },
      { new: true }
    );

    console.log("✅ OTP stored in database:", {
      userId: req.user._id,
      otp: updateResult.profileOTP,
      expires: updateResult.profileOTPExpires,
    });

    await sendOTPEmail(
      user.email,
      otp,
      user.name || "Mentor",
      "profile_verification"
    );

    console.log("📧 OTP email sent successfully to:", user.email);

    res.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("❌ Send profile OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const verifyProfileUpdate = async (req, res) => {
  try {
    const { otp, profileData } = req.body;
    const { name, title, bio, description, location, pricing } = profileData;

    console.log("🔄 Starting OTP verification for user:", req.user._id);
    console.log("📝 Received OTP:", otp);
    console.log("📋 Profile data:", profileData);

    if (!otp || otp.length !== 6) {
      console.log("❌ Invalid OTP format:", otp);
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 6-digit OTP",
      });
    }

    const user = await User.findById(req.user._id).select(
      "+profileOTP +profileOTPExpires"
    );

    if (!user) {
      console.log("❌ User not found during verification:", req.user._id);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("🔍 User OTP data retrieved:", {
      userId: user._id,
      storedOTP: user.profileOTP,
      expiresAt: user.profileOTPExpires,
      currentTime: new Date(),
    });

    if (!user.profileOTP || !user.profileOTPExpires) {
      console.log("❌ No OTP found in database");
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.profileOTPExpires);

    if (currentTime > expiryTime) {
      console.log("⏰ OTP expired:", {
        currentTime: currentTime.toISOString(),
        expiryTime: expiryTime.toISOString(),
        timeDiff: currentTime - expiryTime,
      });

      await User.findByIdAndUpdate(req.user._id, {
        $unset: {
          profileOTP: 1,
          profileOTPExpires: 1,
        },
      });

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const storedOTP = user.profileOTP.toString().trim();
    const receivedOTP = otp.toString().trim();

    console.log("🔐 OTP comparison:", {
      stored: storedOTP,
      received: receivedOTP,
      match: storedOTP === receivedOTP,
    });

    if (storedOTP !== receivedOTP) {
      console.log("❌ OTP mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    console.log("✅ OTP verified successfully, proceeding with profile update");

    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        profileOTP: 1,
        profileOTPExpires: 1,
      },
    });

    const userUpdateData = {};
    if (name && name.trim()) userUpdateData.name = name.trim();

    let updatedUser = null;
    if (Object.keys(userUpdateData).length > 0) {
      updatedUser = await User.findByIdAndUpdate(req.user._id, userUpdateData, {
        new: true,
        select: "-password",
      });
      console.log("✅ User data updated:", userUpdateData);
    }

    const mentorUpdateData = {};
    if (title && title.trim()) mentorUpdateData.title = title.trim();
    if (bio !== undefined) mentorUpdateData.bio = bio || "";
    if (description && description.trim())
      mentorUpdateData.description = description.trim();
    if (location && location.trim())
      mentorUpdateData.location = location.trim();
    if (pricing && typeof pricing === "object") {
      mentorUpdateData.pricing = {
        hourlyRate: pricing.hourlyRate || 0,
        currency: pricing.currency || "USD",
        freeSessionsOffered: pricing.freeSessionsOffered || 1,
      };
    }

    console.log("🔄 Updating mentor data:", mentorUpdateData);

    const updatedMentor = await Mentor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: mentorUpdateData },
      {
        new: true,
        upsert: true,
        runValidators: false,
      }
    );

    console.log("✅ Mentor data updated successfully");

    try {
      if (
        updatedMentor &&
        typeof updatedMentor.calculateProfileCompleteness === "function"
      ) {
        updatedMentor.calculateProfileCompleteness();
        await updatedMentor.save({ validateBeforeSave: false });
        console.log("📊 Profile completeness recalculated");
      }
    } catch (completenessError) {
      console.log(
        "⚠️ Profile completeness calculation failed:",
        completenessError.message
      );
    }

    const responseUser =
      updatedUser || (await User.findById(req.user._id).select("-password"));
    const combinedData = {
      ...responseUser.toObject(),
      ...(updatedMentor ? updatedMentor.toObject() : {}),
    };

    console.log("🎉 Profile update completed successfully");

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: combinedData,
    });
  } catch (error) {
    console.error("❌ Verify profile update error:", error);

    try {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: {
          profileOTP: 1,
          profileOTPExpires: 1,
        },
      });
    } catch (clearError) {
      console.error("Failed to clear OTP on error:", clearError);
    }

    res.status(500).json({
      success: false,
      message: "Failed to verify and update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const uploadAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("❌ File upload error:", err);
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
      console.log("🖼️ Uploading avatar for user:", req.user._id);

      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "mentor-avatars",
              public_id: `mentor-avatar-${req.user._id}`,
              overwrite: true,
              resource_type: "auto",
            },
            (error, result) => {
              if (result) {
                console.log(
                  "✅ Cloudinary upload successful:",
                  result.public_id
                );
                resolve(result);
              } else {
                console.error("❌ Cloudinary upload failed:", error);
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req);
      const avatarUrl = result.secure_url;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true, select: "-password" }
      );

      console.log("✅ Avatar updated successfully:", avatarUrl);

      res.json({
        success: true,
        message: "Profile picture updated successfully!",
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error("❌ Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  });
};

module.exports = {
  getAllMentors,
  getMentorById,
  searchMentors,
  getMentorStats,
  getMentorWithAIReason,
  updateSocialLinks,
  changePassword,
  updatePersonalDetails,
  updateProfile,
  sendProfileOTP,
  verifyProfileUpdate,
  uploadAvatar,
};
