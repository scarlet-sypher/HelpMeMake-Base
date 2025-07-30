const express = require('express');
const { requireUser, requireUserOrMentor } = require('../middleware/roleAuth');
const { createProject, getProjectById, updateProject } = require('../controller/projectController');

const router = express.Router();

// Create new project - only learners (users) can create projects
router.post('/create', requireUser, createProject);

// Get project by ID - both learners and mentors can view projects
router.get('/:id', requireUserOrMentor, getProjectById);

// Update project - only project owner (learner) can update
router.patch('/:id', requireUser, updateProject);

module.exports = router;