const express = require("express");
const adminUserController = require("../../controller/admin/UserController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// GET /admin/users - Get all users with pagination and search
router.get("/", adminUserController.getAllUsers);

// GET /admin/users/stats - Get user statistics
router.get("/stats", adminUserController.getUserStats);

// GET /admin/users/:userId - Get single user by ID
router.get("/:userId", adminUserController.getUserById);

// PUT /admin/users/:userId - Update user data
router.put("/:userId", adminUserController.updateUser);

// PUT /admin/users/:userId/avatar - Update user avatar
router.put("/:userId/avatar", adminUserController.updateUserAvatar);

// DELETE /admin/users/:userId - Delete user
router.delete("/:userId", adminUserController.deleteUser);

module.exports = router;
