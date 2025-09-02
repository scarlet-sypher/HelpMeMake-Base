const express = require("express");
const adminAuthController = require("../controller/adminAuthController");
const { authenticateAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", adminAuthController.adminLogin);
router.post("/logout", adminAuthController.adminLogout);

router.get("/me", authenticateAdmin, adminAuthController.getAdminInfo);

router.get("/test", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin authentication is working!",
    admin: req.admin,
  });
});

module.exports = router;
