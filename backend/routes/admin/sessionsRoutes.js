const express = require("express");
const { authenticateAdmin } = require("../../middleware/adminAuth");
const adminSessionsController = require("../../controller/admin/sessionsController");

const router = express.Router();

router.use(authenticateAdmin);

router.get("/", adminSessionsController.getAllSessions);

router.get("/stats", adminSessionsController.getSessionStats);

router.delete("/:sessionId", adminSessionsController.deleteSession);

module.exports = router;
