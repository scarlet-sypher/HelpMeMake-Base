const Milestone = require('../Model/Milestone');
const Project = require('../Model/Project');
const Learner = require('../Model/Learner');
const Mentor = require('../Model/Mentor');

const milestoneController = {
  async getMilestonesByProject(req, res) {
    try {
      const { projectId } = req.params;
      // FIX: Handle both _id and userId fields from token
      const userId = req.user._id || req.user.userId;

      // DEBUG: Log all incoming data
      console.log('=== MILESTONE FETCH DEBUG ===');
      console.log('Project ID from params:', projectId);
      console.log('User ID from token:', userId);
      console.log('Full req.user object:', req.user);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      // Verify user has access to this project
      const project = await Project.findById(projectId);
      console.log('Project found:', project ? 'YES' : 'NO');
      if (project) {
        console.log('Project learner ID:', project.learnerId);
        console.log('Project mentor ID:', project.mentorId);
      }

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      // Check if user is learner or mentor of this project
      const learner = await Learner.findOne({ userId });
      const mentor = await Mentor.findOne({ userId });

      console.log('Learner found:', learner ? 'YES' : 'NO');
      console.log('Mentor found:', mentor ? 'YES' : 'NO');
      
      if (learner) {
        console.log('Learner _id:', learner._id);
        console.log('Learner _id toString:', learner._id.toString());
        console.log('Project learnerId toString:', project.learnerId.toString());
        console.log('IDs match:', learner._id.toString() === project.learnerId.toString());
      }

      if (mentor) {
        console.log('Mentor _id:', mentor._id);
        console.log('Mentor _id toString:', mentor._id.toString());
        console.log('Project mentorId toString:', project.mentorId ? project.mentorId.toString() : 'null');
        console.log('IDs match:', mentor && project.mentorId && project.mentorId.toString() === mentor._id.toString());
      }

      const hasAccess = (learner && project.learnerId.toString() === learner._id.toString()) ||
                       (mentor && project.mentorId && project.mentorId.toString() === mentor._id.toString());

      console.log('Has access:', hasAccess);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this project',
          debug: {
            userId,
            projectId,
            learnerFound: !!learner,
            mentorFound: !!mentor,
            learnerId: learner ? learner._id : null,
            mentorId: mentor ? mentor._id : null,
            projectLearnerId: project.learnerId,
            projectMentorId: project.mentorId
          }
        });
      }

      const milestones = await Milestone.find({ projectId })
        .sort({ order: 1 })
        .populate('learnerId mentorId', 'name email');

      console.log('Milestones found:', milestones.length);
      console.log('=== END DEBUG ===');

      res.json({
        success: true,
        milestones
      });
    } catch (error) {
      console.error('Error fetching milestones:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Create new milestone
  async createMilestone(req, res) {
    try {
      const { projectId, title, description, dueDate, order } = req.body;
      // FIX: Handle both _id and userId fields from token
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      // Verify project exists and user is the learner
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || project.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Only project owner can create milestones'
        });
      }

      // Check if project has mentor assigned
      if (!project.mentorId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create milestone without assigned mentor'
        });
      }

      if (!project.learnerId || !project.mentorId) {
        return res.status(400).json({
            success: false,
            message: 'Cannot create milestones. Project must have both learner and mentor assigned.'
        });
    }

      // Check milestone limit (5 max)
      const existingMilestones = await Milestone.countDocuments({ projectId });
      if (existingMilestones >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 milestones allowed per project'
        });
      }

      const milestone = new Milestone({
        title,
        description,
        projectId,
        learnerId: learner._id,
        mentorId: project.mentorId,
        dueDate,
        order: order || existingMilestones + 1
      });

      await milestone.save();

      res.status(201).json({
        success: true,
        milestone,
        message: 'Milestone created successfully'
      });
    } catch (error) {
      console.error('Error creating milestone:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  async learnerUnverifyMilestone(req, res) {
    try {
        const { milestoneId } = req.params;
        // FIX: Handle both _id and userId fields from token
        const userId = req.user._id || req.user.userId;

        if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'User ID not found in token'
        });
        }

        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) {
        return res.status(404).json({
            success: false,
            message: 'Milestone not found'
        });
        }

        const learner = await Learner.findOne({ userId });
        if (!learner || milestone.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
        }

        // Check if learner has verified this milestone
        if (!milestone.learnerVerification.isVerified) {
        return res.status(400).json({
            success: false,
            message: 'Milestone is not verified by learner'
        });
        }

        // Don't allow undo if mentor has already verified
        if (milestone.mentorVerification.isVerified) {
        return res.status(400).json({
            success: false,
            message: 'Cannot undo milestone that has been verified by mentor'
        });
        }

        // Reset learner verification
        milestone.learnerVerification.isVerified = false;
        milestone.learnerVerification.verifiedAt = null;
        milestone.learnerVerification.verificationNotes = '';
        milestone.learnerVerification.submissionUrl = '';

        await milestone.save();

        res.json({
        success: true,
        milestone,
        message: 'Milestone verification undone successfully'
        });
    } catch (error) {
        console.error('Error undoing milestone verification:', error);
        res.status(500).json({
        success: false,
        message: 'Server error'
        });
    }
    },

  // Learner verify milestone
  async learnerVerifyMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      const { verificationNotes, submissionUrl } = req.body;
      // FIX: Handle both _id and userId fields from token
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || milestone.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if previous milestones are completed (sequential completion)
      const previousMilestones = await Milestone.find({
        projectId: milestone.projectId,
        order: { $lt: milestone.order }
      });

      const incompletePrevious = previousMilestones.some(m => !m.learnerVerification.isVerified);
      if (incompletePrevious) {
        return res.status(400).json({
          success: false,
          message: 'Complete previous milestones first'
        });
      }

      milestone.learnerVerification.isVerified = true;
      milestone.learnerVerification.verifiedAt = new Date();
      milestone.learnerVerification.verificationNotes = verificationNotes;
      milestone.learnerVerification.submissionUrl = submissionUrl;

      await milestone.save();

      res.json({
        success: true,
        milestone,
        message: 'Milestone marked as done'
      });
    } catch (error) {
      console.error('Error verifying milestone:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Mentor verify milestone
  async mentorVerifyMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      const { verificationNotes, rating, feedback } = req.body;
      // FIX: Handle both _id and userId fields from token
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      const mentor = await Mentor.findOne({ userId });
      if (!mentor || milestone.mentorId.toString() !== mentor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if learner has verified first
      if (!milestone.learnerVerification.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Learner must verify milestone first'
        });
      }

      milestone.mentorVerification.isVerified = true;
      milestone.mentorVerification.verifiedAt = new Date();
      milestone.mentorVerification.verificationNotes = verificationNotes;
      milestone.mentorVerification.rating = rating;
      milestone.mentorVerification.feedback = feedback;

      await milestone.save();

      res.json({
        success: true,
        milestone,
        message: 'Milestone verified by mentor'
      });
    } catch (error) {
      console.error('Error verifying milestone:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Delete milestone
  async deleteMilestone(req, res) {
    try {
      const { milestoneId } = req.params;
      // FIX: Handle both _id and userId fields from token
      const userId = req.user._id || req.user.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const milestone = await Milestone.findById(milestoneId);
      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      const learner = await Learner.findOne({ userId });
      if (!learner || milestone.learnerId.toString() !== learner._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Only milestone creator can delete it'
        });
      }

      // Don't allow deletion if already verified
      if (milestone.learnerVerification.isVerified || milestone.mentorVerification.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete verified milestone'
        });
      }

      await Milestone.findByIdAndDelete(milestoneId);

      res.json({
        success: true,
        message: 'Milestone deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get milestone by ID
  async getMilestoneById(req, res) {
    try {
      const { milestoneId } = req.params;
      
      const milestone = await Milestone.findById(milestoneId)
        .populate('learnerId mentorId projectId');

      if (!milestone) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found'
        });
      }

      res.json({
        success: true,
        milestone
      });
    } catch (error) {
      console.error('Error fetching milestone:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = milestoneController;