const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../Model/Admin");

const generateAdminToken = (adminId, username) => {
  return jwt.sign(
    {
      adminId,
      username,
      type: "admin",
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "2h" }
  );
};

const adminAuthController = {
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Admin ID and password are required",
        });
      }

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

      if (username !== envAdminId || password !== envAdminPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin credentials",
        });
      }

      const adminRecord = await Admin.findOne({ username });

      if (!adminRecord) {
        return res.status(401).json({
          success: false,
          message: "Admin record not found in database",
        });
      }

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

      const token = generateAdminToken(adminRecord._id, adminRecord.username);

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 2 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({
        success: true,
        message: "Admin login successful",
        token: token,
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

  adminLogout: (req, res) => {
    try {
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
