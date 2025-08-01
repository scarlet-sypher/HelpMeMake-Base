const Achievement = require('../Model/Achievement');
const Learner = require('../Model/Learner');
const Mentor = require('../Model/Mentor');
const Project = require('../Model/Project');

// Get all achievements for a user
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.user.role === 'user' ? 'Learner' : 'Mentor';

    // Check if user has achievements, if not create default ones
    let achievements = await Achievement.find({ userId }).sort({ displayOrder: 1 });
    
    if (achievements.length === 0) {
      achievements = await Achievement.createDefaultAchievements(userId, userType);
    }

    // Update achievements based on current user data
    await updateUserAchievementProgress(userId, userType);
    
    // Fetch updated achievements
    achievements = await Achievement.find({ userId }).sort({ displayOrder: 1 });

    // Format achievements for the component
    const formattedAchievements = achievements.map(achievement => ({
      id: achievement._id,
      title: achievement.title,
      description: achievement.description,
      achieved: achievement.isAchieved,
      icon: achievement.icon,
      rarity: achievement.rarity,
      progressPercentage: achievement.progressPercentage,
      achievedAt: achievement.achievedAt,
      rewards: achievement.rewards,
      category: achievement.category
    }));

    res.status(200).json({
      success: true,
      message: 'Achievements fetched successfully',
      data: formattedAchievements
    });

  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
};

// Get specific achievement details
const getAchievementById = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const userId = req.user._id;

    const achievement = await Achievement.findOne({ 
      _id: achievementId, 
      userId 
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement details fetched successfully',
      data: {
        id: achievement._id,
        title: achievement.title,
        description: achievement.description,
        achieved: achievement.isAchieved,
        icon: achievement.icon,
        rarity: achievement.rarity,
        progressPercentage: achievement.progressPercentage,
        achievedAt: achievement.achievedAt,
        rewards: achievement.rewards,
        category: achievement.category,
        criteria: achievement.criteria,
        progressHistory: achievement.progressHistory
      }
    });

  } catch (error) {
    console.error('Error fetching achievement details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement details',
      error: error.message
    });
  }
};

// Update achievement progress (called internally or by webhook)
const updateAchievementProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.user.role === 'user' ? 'Learner' : 'Mentor';

    await updateUserAchievementProgress(userId, userType);

    res.status(200).json({
      success: true,
      message: 'Achievement progress updated successfully'
    });

  } catch (error) {
    console.error('Error updating achievement progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update achievement progress',
      error: error.message
    });
  }
};

// Helper function to update user achievement progress
const updateUserAchievementProgress = async (userId, userType) => {
  try {
    let activityData = {};

    if (userType === 'Learner') {
      const learner = await Learner.findOne({ userId });
      if (learner) {
        // Get completed projects count
        const completedProjects = await Project.countDocuments({
          learnerId: learner._id,
          status: 'Completed'
        });

        activityData = {
          completedSessions: learner.completedSessions || 0,
          completedProjects: completedProjects,
          streakDays: learner.streakDays || 0,
          xp: learner.xp || 0,
          rating: learner.rating || 0
        };
      }
    } else if (userType === 'Mentor') {
      const mentor = await Mentor.findOne({ userId });
      if (mentor) {
        // Get completed projects count
        const completedProjects = await Project.countDocuments({
          mentorId: mentor._id,
          status: 'Completed'
        });

        activityData = {
          completedSessions: mentor.completedSessions || 0,
          completedProjects: completedProjects,
          streakDays: 0, // Mentors don't have streak days
          xp: 0, // Mentors don't have XP
          rating: mentor.rating || 0
        };
      }
    }

    // Update achievements based on activity data
    await Achievement.updateUserAchievements(userId, userType, activityData);

  } catch (error) {
    console.error('Error updating user achievement progress:', error);
    throw error;
  }
};

// Get achievement statistics
const getAchievementStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const achievements = await Achievement.find({ userId });
    
    const stats = {
      total: achievements.length,
      achieved: achievements.filter(a => a.isAchieved).length,
      inProgress: achievements.filter(a => !a.isAchieved && a.criteria.currentProgress > 0).length,
      byRarity: {
        common: achievements.filter(a => a.rarity === 'common' && a.isAchieved).length,
        rare: achievements.filter(a => a.rarity === 'rare' && a.isAchieved).length,
        epic: achievements.filter(a => a.rarity === 'epic' && a.isAchieved).length,
        legendary: achievements.filter(a => a.rarity === 'legendary' && a.isAchieved).length
      },
      totalXpEarned: achievements
        .filter(a => a.isAchieved)
        .reduce((sum, a) => sum + (a.rewards.xpBonus || 0), 0)
    };

    res.status(200).json({
      success: true,
      message: 'Achievement statistics fetched successfully',
      data: stats
    });

  } catch (error) {
    console.error('Error fetching achievement statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement statistics',
      error: error.message
    });
  }
};

// Initialize achievements for new users (called when user selects role)
const initializeUserAchievements = async (req, res) => {
  try {
    const userId = req.user._id;
    const userType = req.user.role === 'user' ? 'Learner' : 'Mentor';

    // Check if achievements already exist
    const existingAchievements = await Achievement.find({ userId });
    
    if (existingAchievements.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Achievements already initialized',
        data: existingAchievements.length
      });
    }

    // Create default achievements
    const achievements = await Achievement.createDefaultAchievements(userId, userType);

    res.status(201).json({
      success: true,
      message: 'Achievements initialized successfully',
      data: achievements.length
    });

  } catch (error) {
    console.error('Error initializing achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize achievements',
      error: error.message
    });
  }
};

module.exports = {
  getUserAchievements,
  getAchievementById,
  updateAchievementProgress,
  getAchievementStats,
  initializeUserAchievements
};