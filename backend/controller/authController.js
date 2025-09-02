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
    secure: true, // Always true in production (HTTPS required)
    sameSite: "none", // Required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  // Also set a debug cookie to test if cookies work at all
  if (isProduction) {
    res.cookie("debug_cookie", "test", {
      httpOnly: false, // Make this readable from frontend for debugging
      secure: true,
      sameSite: "none",
      maxAge: 60 * 1000, // 1 minute
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

      // Generate token and set cookie
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      // Determine redirect URL
      let redirectUrl = `${process.env.UI_URL}`;

      if (user.tempGeneratedPassword) {
        // For new social users, redirect with generated password
        const encodedPassword = encodeURIComponent(user.tempGeneratedPassword);
        redirectUrl += user.role
          ? `/userdashboard?newPassword=${encodedPassword}&authToken=${token}`
          : `/select-role?newPassword=${encodedPassword}&authToken=${token}`;

        // Clear the temporary password
        delete user.tempGeneratedPassword;
      } else {
        // Existing user flow - add token to URL for immediate auth
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

  // Update githubCallback method
  githubCallback: async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(
          `${process.env.UI_URL}/login?error=authentication_failed`
        );
      }

      // Generate token and set cookie
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      // Determine redirect URL
      let redirectUrl = `${process.env.UI_URL}`;

      if (user.tempGeneratedPassword) {
        // For new GitHub users, redirect with generated password (same as Google flow)
        const encodedPassword = encodeURIComponent(user.tempGeneratedPassword);
        redirectUrl += user.role
          ? `/userdashboard?newPassword=${encodedPassword}&authToken=${token}`
          : `/select-role?newPassword=${encodedPassword}&authToken=${token}`;

        // Clear the temporary password
        delete user.tempGeneratedPassword;
      } else {
        // Existing user flow - add token to URL for immediate auth
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

      // Fetch role-specific data if user has a role
      if (user.role === "user") {
        try {
          const Learner = require("../Model/Learner");
          roleSpecificData = await Learner.findOne({ userId: user._id });

          // Create learner profile if it doesn't exist
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

          // Create mentor profile if it doesn't exist
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

      // Merge role-specific data if available
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

      // Create role-specific profile
      try {
        if (role === "user") {
          const Learner = require("../Model/Learner");

          // Check if learner profile already exists
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

          // Check if mentor profile already exists
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
        // Don't fail the role setting if profile creation fails
        // The profile will be created when they first access role-specific routes
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

      // Validation
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

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isAccountActive) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (existingUser && !existingUser.isAccountActive) {
        // Update existing inactive user
        existingUser.password = hashedPassword;
        existingUser.name = name || existingUser.name;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
      } else {
        // Create new user (inactive until OTP verification)
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          authProvider: "local",
          role: null, // Will be set after selecting role
          isAccountActive: false,
          isEmailVerified: false,
          otp,
          otpExpires,
        });
        await newUser.save();
      }

      // Send OTP email
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

  // Verify OTP
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      // Find user with matching email and OTP
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

      // Activate account and clear OTP
      user.isAccountActive = true;
      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      // Generate JWT token
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

  // Resend OTP
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Find inactive user
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

      // Generate new OTP
      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send new OTP email
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

      // Find user by email
      const user = await User.findOne({ email });
      if (!user || user.authProvider !== "local") {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if account is active (OTP verified)
      if (!user.isAccountActive) {
        return res.status(401).json({
          success: false,
          message:
            "Please verify your email first. Check your inbox for the verification code.",
          requiresVerification: true,
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      // Return response with token (similar to OAuth flow)
      res.json({
        success: true,
        message: "Login successful",
        token: token, // Include token in response for frontend
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

      // Find user by email
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

      // Only allow password reset for local auth users
      if (user.authProvider !== "local") {
        return res.status(400).json({
          success: false,
          message: `This account was created using ${user.authProvider}. Please use ${user.authProvider} to sign in.`,
        });
      }

      // Generate OTP for password reset
      const otp = generateOTP();
      const otpExpires = new Date(
        Date.now() + (parseInt(process.env.OTP_EXPIRES_IN) || 10) * 60 * 1000
      );

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      // Send OTP email
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

      // Find user with matching email and OTP
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

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear OTP
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
