const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Model/Admin");

const generateAdminToken = (adminId, username) => {
  return jwt.sign(
    {
      adminId,
      username,
      type: "admin", // Add type to differentiate from user tokens
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "2h" } // Short-lived token as requested
  );
};

const adminAuthController = {
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Admin ID and password are required",
        });
      }

      // Step 1: Verify against environment variables
      const envAdminId = process.env.ADMIN_ID;
      const envAdminPassword = process.env.ADMIN_PASSWORD;

      if (!envAdminId || !envAdminPassword) {
        console.error(
          "Admin credentials not configured in environment variables"
        );
        return res.status(500).json({
          success: false,
          message: "Server configuration error",
        });
      }

      // Step 2: Check credentials against environment variables
      if (username !== envAdminId || password !== envAdminPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      // Step 3: Verify against MongoDB record
      const adminRecord = await Admin.findOne({ username });

      if (!adminRecord) {
        return res.status(401).json({
          success: false,
          message: "Admin record not found in database",
        });
      }

      // Compare password with database record
      const isValidPassword = await bcrypt.compare(
        password,
        adminRecord.password
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      // Step 4: All checks passed - generate JWT token
      const token = generateAdminToken(adminRecord._id, adminRecord.username);

      // Set httpOnly cookie for security
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        path: "/",
      });

      res.json({
        success: true,
        message: "Admin login successful",
        token: token, // Also send in response for frontend storage
        admin: {
          id: adminRecord._id,
          username: adminRecord.username,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({
        success: false,
        message: "Admin login failed",
      });
    }
  },

  // Get current admin info (for protected routes)
  getAdminInfo: async (req, res) => {
    try {
      const admin = await Admin.findById(req.admin.adminId).select("-password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      res.json({
        success: true,
        admin: {
          id: admin._id,
          username: admin.username,
          createdAt: admin.createdAt,
        },
      });
    } catch (error) {
      console.error("Get admin info error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get admin information",
      });
    }
  },

  // Admin logout
  adminLogout: (req, res) => {
    try {
      // Clear admin token cookie
      res.clearCookie("admin_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      res.json({
        success: true,
        message: "Admin logged out successfully",
      });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({
        success: false,
        message: "Admin logout failed",
      });
    }
  },
};

module.exports = adminAuthController;
