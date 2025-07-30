const Project = require('../Model/Project');
const Learner = require('../Model/Learner');
const Mentor = require('../Model/Mentor');
const User = require('../Model/User');

// Create New Project
const createProject = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      fullDescription,
      techStack,
      category,
      difficultyLevel,
      duration,
      status,
      thumbnail,
      tags,
      openingPrice,
      currency,
      projectOutcome,
      motivation,
      prerequisites,
      knowledgeLevel,
      references
    } = req.body;

    // Validation
    if (!name || !shortDescription || !fullDescription || !techStack || techStack.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, shortDescription, fullDescription, and at least one technology'
      });
    }

    if (!category || !difficultyLevel || !duration || !openingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: category, difficultyLevel, duration, and openingPrice'
      });
    }

    if (!projectOutcome || !motivation || !knowledgeLevel) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: projectOutcome, motivation, and knowledgeLevel'
      });
    }

    // Validate price
    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Opening price must be a valid positive number'
      });
    }

    // Get learner ID from authenticated user
    const learnerId = req.user._id;

    // Verify user is a learner
    const learner = await Learner.findOne({ userId: learnerId });
    if (!learner) {
      return res.status(403).json({
        success: false,
        message: 'Only learners can create projects'
      });
    }

    // Create project
    const projectData = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      techStack: techStack.map(tech => tech.trim()).filter(tech => tech.length > 0),
      category,
      difficultyLevel,
      duration: duration.trim(),
      status: status || 'Open',
      thumbnail: thumbnail || '/uploads/public/default-project.jpg',
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0) : [],
      openingPrice: price,
      currency: currency || 'INR',
      projectOutcome: projectOutcome.trim(),
      motivation: motivation.trim(),
      prerequisites: prerequisites ? prerequisites.map(prereq => prereq.trim()).filter(prereq => prereq.length > 0) : [],
      knowledgeLevel,
      references: references || [],
      learnerId: learner._id, // Use learner's ObjectId, not user's
      isVisible: true
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    // Update learner's project count
    await Learner.findByIdAndUpdate(learner._id, {
      $inc: { 
        userTotalProjects: 1,
        userActiveProjects: savedProject.status === 'Open' ? 1 : 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project: savedProject
    });

  } catch (error) {
    console.error('Create project error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A project with this information already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create project. Please try again.'
    });
  }
};

// Get Project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    const project = await Project.findById(id)
      .populate('learnerId', 'userId title description location')
      .populate('mentorId', 'userId title description location')
      .populate({
        path: 'applications.mentorId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has permission to view this project
    const userLearner = await Learner.findOne({ userId: req.user._id });
    const userMentor = await Mentor.findOne({ userId: req.user._id });
    
    // Allow access if:
    // 1. User is the project owner
    // 2. Project is visible and open
    // 3. User is the assigned mentor
    // 4. User is a mentor (can view open projects)
    const isOwner = userLearner && project.learnerId._id.toString() === userLearner._id.toString();
    const isAssignedMentor = project.mentorId && project.mentorId._id.toString() === req.user._id.toString();
    const isPubliclyVisible = project.isVisible && project.status === 'Open';
    const isMentor = userMentor !== null;

    if (!isOwner && !isAssignedMentor && !isPubliclyVisible && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this project'
      });
    }

    // Increment view count if not the owner
    if (!isOwner) {
      await Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    res.json({
      success: true,
      message: 'Project retrieved successfully',
      project
    });

  } catch (error) {
    console.error('Get project error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project'
    });
  }
};

// Apply to Project (Mentor Application)
const applyToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedPrice, coverLetter, estimatedDuration } = req.body;

    // Validation
    if (!proposedPrice || !coverLetter || !estimatedDuration) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: proposedPrice, coverLetter, estimatedDuration'
      });
    }

    // Validate price
    const price = parseFloat(proposedPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Proposed price must be a valid positive number'
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project is open for applications
    if (project.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'This project is not accepting applications'
      });
    }

    // Check if project already has a mentor
    if (project.mentorId) {
      return res.status(400).json({
        success: false,
        message: 'This project already has an assigned mentor'
      });
    }

    // Verify user is a mentor
    const mentor = await Mentor.findOne({ userId: req.user._id });
    if (!mentor) {
      return res.status(403).json({
        success: false,
        message: 'Only mentors can apply to projects'
      });
    }

    // Check if mentor already applied
    const existingApplication = project.applications.find(
      app => app.mentorId.toString() === mentor._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this project'
      });
    }

    // Create application
    const newApplication = {
      mentorId: mentor._id,
      proposedPrice: price,
      coverLetter: coverLetter.trim(),
      estimatedDuration: estimatedDuration.trim(),
      applicationStatus: 'Pending',
      appliedAt: new Date()
    };

    // Add application to project
    project.applications.push(newApplication);
    project.applicationsCount = project.applications.length;

    await project.save();

    // Populate the new application for response
    const updatedProject = await Project.findById(id)
      .populate({
        path: 'applications.mentorId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      });

    const addedApplication = updatedProject.applications[updatedProject.applications.length - 1];

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: addedApplication
    });

  } catch (error) {
    console.error('Apply to project error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
};

// Accept Mentor Application (for learners)
const acceptMentorApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify user is the project owner
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (!userLearner || project.learnerId.toString() !== userLearner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project owner can accept applications'
      });
    }

    // Find the application
    const application = project.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if application is pending
    if (application.applicationStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'This application has already been processed'
      });
    }

    // Accept the application
    application.applicationStatus = 'Accepted';
    project.mentorId = application.mentorId;
    project.negotiatedPrice = application.proposedPrice;
    project.status = 'In Progress';
    project.startDate = new Date();

    // Reject all other pending applications
    project.applications.forEach(app => {
      if (app._id.toString() !== applicationId && app.applicationStatus === 'Pending') {
        app.applicationStatus = 'Rejected';
      }
    });

    await project.save();

    // Update learner stats
    await Learner.findByIdAndUpdate(userLearner._id, {
      $inc: { 
        userActiveProjects: -1, // Move from open to in progress
        userSessionsScheduled: 1
      }
    });

    // Update mentor stats
    await Mentor.findByIdAndUpdate(application.mentorId, {
      $inc: { 
        mentorActiveStudents: 1,
        totalStudents: 1
      }
    });

    res.json({
      success: true,
      message: 'Application accepted successfully!',
      project
    });

  } catch (error) {
    console.error('Accept application error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to accept application. Please try again.'
    });
  }
};

// Update Existing Project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      shortDescription,
      fullDescription,
      techStack,
      category,
      difficultyLevel,
      duration,
      status,
      thumbnail,
      tags,
      openingPrice,
      currency,
      projectOutcome,
      motivation,
      prerequisites,
      knowledgeLevel,
      references
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user owns this project
    const userLearner = await Learner.findOne({ userId: req.user._id });
    if (!userLearner || project.learnerId.toString() !== userLearner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own projects'
      });
    }

    // Validation for required fields
    if (!name || !shortDescription || !fullDescription || !techStack || techStack.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, shortDescription, fullDescription, and at least one technology'
      });
    }

    if (!category || !difficultyLevel || !duration || !openingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: category, difficultyLevel, duration, and openingPrice'
      });
    }

    if (!projectOutcome || !motivation || !knowledgeLevel) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: projectOutcome, motivation, and knowledgeLevel'
      });
    }

    // Validate price
    const price = parseFloat(openingPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Opening price must be a valid positive number'
      });
    }

    // Check if project can be edited (not in certain states)
    if (project.status === 'Completed' || project.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit completed or cancelled projects'
      });
    }

    // Track status change for learner stats
    const oldStatus = project.status;
    const newStatus = status || project.status;

    // Prepare update data
    const updateData = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      techStack: techStack.map(tech => tech.trim()).filter(tech => tech.length > 0),
      category,
      difficultyLevel,
      duration: duration.trim(),
      status: newStatus,
      thumbnail: thumbnail || project.thumbnail,
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0) : [],
      openingPrice: price,
      currency: currency || 'INR',
      projectOutcome: projectOutcome.trim(),
      motivation: motivation.trim(),
      prerequisites: prerequisites ? prerequisites.map(prereq => prereq.trim()).filter(prereq => prereq.length > 0) : [],
      knowledgeLevel,
      references: references || []
    };

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('learnerId', 'userId title description location')
     .populate('mentorId', 'userId title description location');

    // Update learner stats if status changed
    if (oldStatus !== newStatus) {
      const statusChanges = {};
      
      // Handle active projects count
      if (oldStatus === 'Open' && newStatus !== 'Open') {
        statusChanges.userActiveProjects = -1;
      } else if (oldStatus !== 'Open' && newStatus === 'Open') {
        statusChanges.userActiveProjects = 1;
      }

      if (Object.keys(statusChanges).length > 0) {
        await Learner.findByIdAndUpdate(userLearner._id, { $inc: statusChanges });
      }
    }

    res.json({
      success: true,
      message: 'Project updated successfully!',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update project. Please try again.'
    });
  }
};

// Get all projects for authenticated user (Dashboard)
const getProjectsForUser = async (req, res) => {
  try {
    // Get learner profile for the authenticated user
    const userLearner = await Learner.findOne({ userId: req.user._id });
    
    if (!userLearner) {
      return res.status(403).json({
        success: false,
        message: 'Only learners can access this endpoint'
      });
    }

    // Find all projects belonging to this learner
    const projects = await Project.find({ learnerId: userLearner._id })
      .populate('learnerId', 'userId title description location')
      .populate('mentorId', 'userId title description location')
      .sort({ createdAt: -1 }); // Sort by newest first

    // Calculate some basic stats
    const stats = {
      total: projects.length,
      open: projects.filter(p => p.status === 'Open').length,
      inProgress: projects.filter(p => p.status === 'In Progress').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      cancelled: projects.filter(p => p.status === 'Cancelled').length
    };

    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      projects,
      stats
    });

  } catch (error) {
    console.error('Get user projects error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects'
    });
  }
};

// Delete project by ID (only if user owns it)
const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Find the project first
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user owns this project
    const userLearner = await Learner.findOne({ userId: req.user._id });
    
    if (!userLearner) {
      return res.status(403).json({
        success: false,
        message: 'Only learners can delete projects'
      });
    }

    if (project.learnerId.toString() !== userLearner._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own projects'
      });
    }

    // Check if project can be deleted (business logic)
    if (project.status === 'In Progress' && project.mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete projects that are in progress with an assigned mentor'
      });
    }

    // Store project status for stats update
    const projectStatus = project.status;

    // Delete the project
    await Project.findByIdAndDelete(id);

    // Update learner's project count
    const statsUpdate = { userTotalProjects: -1 };
    
    if (projectStatus === 'Open') {
      statsUpdate.userActiveProjects = -1;
    }

    await Learner.findByIdAndUpdate(userLearner._id, { $inc: statsUpdate });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete project. Please try again.'
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
  updateProject,
  getProjectsForUser,    
  deleteProjectById,
  applyToProject,
  acceptMentorApplication
};