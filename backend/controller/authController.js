const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/User");
const { generateOTP, sendOTPEmail } = require("../config/emailService");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  if (isProduction) {
    res.cookie("debug_cookie", "test", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 1000,
      path: "/",
    });
  }
};

const authController = {
  googleCallback: async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(
          `${process.env.UI_URL}/login?error=authentication_failed`
        );
      }

      const token = generateToken(user._id);
      setTokenCookie(res, token);

      let redirectUrl = `${process.env.UI_URL}`;

      if (user.tempGeneratedPassword) {
        const encodedPassword = encodeURIComponent(user.tempGeneratedPassword);
        redirectUrl += user.role
          ? `/userdashboard?newPassword=${encodedPassword}&authToken=${token}`
          : `/select-role?newPassword=${encodedPassword}&authToken=${token}`;

        delete user.tempGeneratedPassword;
      } else {
        if (!user.role) {
          redirectUrl += `/select-role?authToken=${token}`;
        } else {
          const dashboardMap = {
            admin: "/admindashboard",
            mentor: "/mentordashboard",
            user: "/userdashboard",
          };
          redirectUrl += `${
            dashboardMap[user.role] || "/userdashboard"
          }?authToken=${token}`;
        }
      }

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);

      if (error.message === "USER_EXISTS") {
        return res.redirect(`${process.env.UI_URL}/user-exists`);
      }

      return res.redirect(`${process.env.UI_URL}/login?error=server_error`);
    }
  },

  githubCallback: async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(
          `${process.env.UI_URL}/login?error=authentication_failed`
        );
      }

      const token = generateToken(user._id);
      setTokenCookie(res, token);

      let redirectUrl = `${process.env.UI_URL}`;

      if (user.tempGeneratedPassword) {
        const encodedPassword = encodeURIComponent(user.tempGeneratedPassword);
        redirectUrl += user.role
          ? `/userdashboard?newPassword=${encodedPassword}&authToken=${token}`
          : `/select-role?newPassword=${encodedPassword}&authToken=${token}`;

        delete user.tempGeneratedPassword;
      } else {
        if (!user.role) {
          redirectUrl += `/select-role?authToken=${token}`;
        } else {
          const dashboardMap = {
            admin: "/admindashboard",
            mentor: "/mentordashboard",
            user: "/userdashboard",
          };
          redirectUrl += `${
            dashboardMap[user.role] || "/userdashboard"
          }?authToken=${token}`;
        }
      }

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("GitHub callback error:", error);

      if (error.message === "USER_EXISTS") {
        return res.redirect(`${process.env.UI_URL}/user-exists`);
      }

      return res.redirect(`${process.env.UI_URL}/login?error=server_error`);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = req.user;
      let roleSpecificData = null;

      if (user.role === "user") {
        try {
          const Learner = require("../Model/Learner");
          roleSpecificData = await Learner.findOne({ userId: user._id });

          if (!roleSpecificData) {
            roleSpecificData = new Learner({
              userId: user._id,
            });
            await roleSpecificData.save();
          }
        } catch (error) {
          console.error("Error fetching learner data:", error);
        }
      } else if (user.role === "mentor") {
        try {
          const Mentor = require("../Model/Mentor");
          roleSpecificData = await Mentor.findOne({ userId: user._id });

          if (!roleSpecificData) {
            roleSpecificData = new Mentor({
              userId: user._id,
            });
            await roleSpecificData.save();
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
        }
      }

      const responseData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };

      if (roleSpecificData) {
        Object.assign(responseData, roleSpecificData.toObject());
      }

      res.json({
        success: true,
        user: responseData,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get user information",
      });
    }
  },

  setRole: async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.user._id;

      if (!role || !["user", "mentor"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be either "user" or "mentor"',
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, select: "-password" }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      try {
        if (role === "user") {
          const Learner = require("../Model/Learner");

          const existingLearner = await Learner.findOne({ userId: user._id });
          if (!existingLearner) {
            const learnerProfile = new Learner({
              userId: user._id,
            });
            await learnerProfile.save();
            console.log("✅ Learner profile created for user:", user.email);
          }
        } else if (role === "mentor") {
          const Mentor = require("../Model/Mentor");

          const existingMentor = await Mentor.findOne({ userId: user._id });
          if (!existingMentor) {
            const mentorProfile = new Mentor({
              userId: user._id,
            });
            await mentorProfile.save();
            console.log("✅ Mentor profile created for user:", user.email);
          }
        }
      } catch (profileError) {
        console.error("Profile creation error:", profileError);
      }

      res.json({
        success: true,
        message: "Role updated successfully",
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          authProvider: user.authProvider,
        },
        redirectUrl: role === "mentor" ? "/mentordashboard" : "/userdashboard",
      });
    } catch (error) {
      console.error("Set role error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update role",
      });
    }
  },

  signup: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isAccountActive) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (existingUser && !existingUser.isAccountActive) {
        existingUser.password = hashedPassword;
        existingUser.name = name || existingUser.name;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
      } else {
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          authProvider: "local",
          role: null,
          isAccountActive: false,
          isEmailVerified: false,
          otp,
          otpExpires,
        });
        await newUser.save();
      }

      await sendOTPEmail(email, otp, name);

      res.status(201).json({
        success: true,
        message:
          "Account created successfully. Please check your email for the verification code.",
        requiresVerification: true,
      });
    } catch (error) {
      console.error("Signup error:", error);

      if (error.message === "Failed to send verification email") {
        return res.status(500).json({
          success: false,
          message:
            "Account created but failed to send verification email. Please try again.",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to create account",
      });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
        isAccountActive: false,
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      user.isAccountActive = true;
      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: "Email verified successfully! Account is now active.",
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        requiresRoleSelection: user.role === null,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify OTP",
      });
    }
  },

  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await User.findOne({
        email,
        isAccountActive: false,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No pending verification found for this email",
        });
      }

      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendOTPEmail(email, otp, user.name);

      res.json({
        success: true,
        message: "New verification code sent to your email.",
      });
    } catch (error) {
      console.error("Resend OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to resend verification code",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await User.findOne({ email });
      if (!user || user.authProvider !== "local") {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!user.isAccountActive) {
        return res.status(401).json({
          success: false,
          message:
            "Please verify your email first. Check your inbox for the verification code.",
          requiresVerification: true,
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        requiresRoleSelection: user.role === null,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  },

  logout: (req, res) => {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
      });

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const user = await User.findOne({
        email,
        isAccountActive: true,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No account found with this email address",
        });
      }

      if (user.authProvider !== "local") {
        return res.status(400).json({
          success: false,
          message: `This account was created using ${user.authProvider}. Please use ${user.authProvider} to sign in.`,
        });
      }

      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendOTPEmail(email, otp, user.name, "reset");

      res.json({
        success: true,
        message: "Password reset code sent to your email.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send password reset code",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Email, OTP, and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date() },
        isAccountActive: true,
        authProvider: "local",
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      user.password = hashedPassword;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      res.json({
        success: true,
        message:
          "Password reset successfully! You can now login with your new password.",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reset password",
      });
    }
  },
};

module.exports = authController;
