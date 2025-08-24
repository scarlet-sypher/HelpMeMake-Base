const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const authenticateJWT = passport.authenticate("jwt", { session: false });

// Helper function to check for admin token
const checkAdminToken = async (req, res, next) => {
  try {
    // Check for admin token first
    let adminToken = req.cookies?.admin_token;

    if (!adminToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        // Try to decode as admin token
        try {
          const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
          if (decoded.type === "admin") {
            adminToken = token;
          }
        } catch (error) {
          // Not an admin token, continue with regular flow
        }
      }
    }

    if (adminToken) {
      try {
        const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET);
        if (decoded.type === "admin") {
          // This is an admin token, verify admin exists
          const Admin = require("../Model/Admin");
          const admin = await Admin.findById(decoded.adminId).select(
            "-password"
          );

          if (admin) {
            req.admin = { adminId: admin._id, username: admin.username };
            req.isAdmin = true;
            return next();
          }
        }
      } catch (error) {
        // Invalid admin token, continue with regular auth
        console.error("Invalid admin token:", error);
      }
    }

    // No valid admin token found, continue with regular authentication
    next();
  } catch (error) {
    console.error("Admin token check error:", error);
    next();
  }
};

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // First check if this is an admin request
      await checkAdminToken(req, res, () => {
        // If admin is authenticated and requesting admin role
        if (
          req.isAdmin &&
          (allowedRoles === "admin" ||
            (Array.isArray(allowedRoles) && allowedRoles.includes("admin")))
        ) {
          return next();
        }

        // Continue with regular user authentication for non-admin requests
        authenticateJWT(req, res, (err) => {
          if (err) {
            return res.status(401).json({
              success: false,
              message: "Authentication failed",
            });
          }

          if (!req.user) {
            return res.status(401).json({
              success: false,
              message: "Please login to access this resource",
            });
          }

          if (!req.user.role) {
            return res.status(403).json({
              success: false,
              message: "Please select your role first",
              requiresRoleSelection: true,
            });
          }

          const userRole = req.user.role;
          const rolesArray = Array.isArray(allowedRoles)
            ? allowedRoles
            : [allowedRoles];

          if (!rolesArray.includes(userRole)) {
            return res.status(403).json({
              success: false,
              message: `Access denied. This resource requires ${allowedRoles} role.`,
              userRole: userRole,
              requiredRoles: rolesArray,
            });
          }

          // User is authenticated and authorized
          next();
        });
      });
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization check failed",
      });
    }
  };
};

// Specific role middlewares (unchanged)
const requireUser = requireRole("user");
const requireMentor = requireRole("mentor");
const requireAdmin = requireRole("admin"); // This now works for both admin tokens and user admin role
const requireUserOrMentor = requireRole(["user", "mentor"]);

// Middleware to ensure user is authenticated (has valid JWT) - unchanged
const requireAuth = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err || !req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }
    next();
  });
};

// Middleware to ensure user has selected a role - unchanged
const requireRoleSelection = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err || !req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Please select your role first",
        requiresRoleSelection: true,
      });
    }

    next();
  });
};

// NEW: Middleware specifically for admin-only routes (more explicit)
const requireSuperAdmin = async (req, res, next) => {
  try {
    let adminToken = req.cookies?.admin_token;

    if (!adminToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        adminToken = authHeader.substring(7);
      }
    }

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin access token required. Please login as admin.",
      });
    }

    const decoded = jwt.verify(adminToken, process.env.ADMIN_JWT_SECRET);

    if (decoded.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Invalid token type. Admin access required.",
      });
    }

    const Admin = require("../Model/Admin");
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
    console.error("Super admin authentication error:", error);

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
  authenticateJWT,
  requireRole,
  requireUser,
  requireMentor,
  requireAdmin,
  requireUserOrMentor,
  requireAuth,
  requireRoleSelection,
  requireSuperAdmin,
};
