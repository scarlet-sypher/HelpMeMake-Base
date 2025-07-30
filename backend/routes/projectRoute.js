const express = require('express');
const { requireUser, requireUserOrMentor, requireMentor } = require('../middleware/roleAuth');
const {
    createProject,
    getProjectById,
    updateProject,
    getProjectsForUser,
    deleteProjectById,
    applyToProject,
    acceptMentorApplication
} = require('../controller/projectController');

const router = express.Router();

// Create new project - only learners (users) can create projects
router.post('/create', requireUser, createProject);

// Get all projects for authenticated user (Dashboard) - only learners
router.get('/user', requireUser, getProjectsForUser);

// Get project by ID - both learners and mentors can view projects
router.get('/:id', requireUserOrMentor, getProjectById);

// Update project - only project owner (learner) can update
router.patch('/:id', requireUser, updateProject);

// Delete project - only project owner (learner) can delete
router.delete('/:id', requireUser, deleteProjectById);

// NEW ENDPOINTS FOR MENTOR APPLICATIONS

// Apply to project - only mentors can apply
router.post('/:id/apply', requireMentor, applyToProject);

// Accept mentor application - only project owner (learner) can accept
router.patch('/:id/applications/:applicationId/accept', requireUser, acceptMentorApplication);

module.exports = router;