const express = require('express');
const { requireUser, requireUserOrMentor, requireMentor, authenticateJWT } = require('../middleware/roleAuth');
const {
    createProject,
    getProjectById,
    updateProject,
    getProjectsForUser,
    deleteProjectById,
    applyToProject,
    acceptMentorApplication,
    getUserProjects,
    getActiveProjectWithMentor,
    uploadProjectThumbnail  // ADD THIS LINE
} = require('../controller/projectController');

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`PROJECT ROUTE: ${req.method} ${req.originalUrl}`);
  next();
});

// Test route - MUST be first
router.get('/test', (req, res) => {
  console.log('Test route hit successfully!');
  res.json({
    success: true,
    message: 'Project routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get active project with mentor - MUST be before /:id route
router.get('/active-with-mentor', authenticateJWT, getActiveProjectWithMentor);

// ADD THIS LINE - Upload thumbnail route
router.post('/upload-thumbnail', authenticateJWT, uploadProjectThumbnail);

// Create new project
router.post('/create', requireUser, createProject);

// Get all projects for authenticated user
router.get('/user', requireUser, getProjectsForUser);

// Get projects by user ID
router.get('/user/:userId', requireUserOrMentor, getUserProjects);

// Apply to project
router.post('/:id/apply', requireMentor, applyToProject);

// Accept mentor application
router.patch('/:id/applications/:applicationId/accept', requireUser, acceptMentorApplication);

// Update project
router.patch('/:id', requireUser, updateProject);

// Delete project
router.delete('/:id', requireUser, deleteProjectById);

// Get project by ID - MUST be last
router.get('/:id', requireUserOrMentor, getProjectById);

module.exports = router;