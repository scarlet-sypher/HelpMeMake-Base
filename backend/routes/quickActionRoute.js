const express = require("express");
const router = express.Router();
const { requireUserOrMentor } = require("../middleware/roleAuth");

const {
  getUserQuickActions,
  getAvailableActions,
  saveUserQuickActions,
  resetToDefault,
} = require("../controller/quickActionController");

router.get("/", requireUserOrMentor, getUserQuickActions);
router.get("/available", requireUserOrMentor, getAvailableActions);
router.post("/save", requireUserOrMentor, saveUserQuickActions);
router.patch("/reset", requireUserOrMentor, resetToDefault);

module.exports = router;
