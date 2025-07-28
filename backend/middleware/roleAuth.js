const passport = require('../config/passport');


const authenticateJWT = passport.authenticate('jwt', { session: false });


const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {

      authenticateJWT(req, res, (err) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: 'Authentication failed'
          });
        }

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
          });
        }


        if (!req.user.role) {
          return res.status(403).json({
            success: false,
            message: 'Please select your role first',
            requiresRoleSelection: true
          });
        }


        const userRole = req.user.role;
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!rolesArray.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: `Access denied. This resource requires ${allowedRoles} role.`,
            userRole: userRole,
            requiredRoles: rolesArray
          });
        }

        // User is authenticated and authorized
        next();
      });
    } catch (error) {
      console.error('Role authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

// Specific role middlewares
const requireUser = requireRole('user');
const requireMentor = requireRole('mentor');
const requireAdmin = requireRole('admin');
const requireUserOrMentor = requireRole(['user', 'mentor']);



// Middleware to ensure user is authenticated (has valid JWT)
const requireAuth = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }
    next();
  });
};

// Middleware to ensure user has selected a role
const requireRoleSelection = (req, res, next) => {
  authenticateJWT(req, res, (err) => {
    if (err || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Please select your role first',
        requiresRoleSelection: true
      });
    }

    next();
  });
};

module.exports = {
  authenticateJWT,
  requireRole,
  requireUser,
  requireMentor,
  requireAdmin,
  requireUserOrMentor,
  requireAuth,
  requireRoleSelection
};