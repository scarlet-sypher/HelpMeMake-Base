const jwt = require("jsonwebtoken");
const Admin = require("../Model/Admin");

const authenticateAdmin = async (req, res, next) => {
  try {
    let token = req.cookies?.admin_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin access token required. Please login as admin.",
      });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Invalid token type. Admin access required.",
      });
    }

    const admin = await Admin.findById(decoded.adminId).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account no longer exists",
      });
    }

    req.admin = {
      adminId: admin._id,
      username: admin.username,
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin token expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Admin authentication failed",
    });
  }
};

module.exports = {
  authenticateAdmin,
};
