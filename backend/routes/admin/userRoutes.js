const express = require("express");
const adminUserController = require("../../controller/admin/UserController");
const { authenticateAdmin } = require("../../middleware/adminAuth");

const router = express.Router();

router.use(authenticateAdmin);

router.get("/", adminUserController.getAllUsers);

router.get("/stats", adminUserController.getUserStats);

router.get("/:userId", adminUserController.getUserById);

router.put("/:userId", adminUserController.updateUser);

router.put("/:userId/avatar", adminUserController.updateUserAvatar);

router.delete("/:userId", adminUserController.deleteUser);

module.exports = router;
