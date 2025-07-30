const express = require('express');
const { requireUser, requireUserOrMentor } = require('../middleware/roleAuth');
const { 
    createProject, 
    getProjectById, 
    updateProject ,
    getProjectsForUser, 
    deleteProjectById  
} = require('../controller/projectController');

const router = express.Router();

// Create new project - only learners (users) can create projects
router.post('/create', requireUser, createProject);

// Get all projects for authenticated user (Dashboard) - NEW
router.get('/user', requireUser, getProjectsForUser);

// Get project by ID - both learners and mentors can view projects
router.get('/:id', requireUserOrMentor, getProjectById);

// Update project - only project owner (learner) can update
router.patch('/:id', requireUser, updateProject);

// Delete project - only project owner (learner) can delete - NEW
router.delete('/:id', requireUser, deleteProjectById);
module.exports = router;