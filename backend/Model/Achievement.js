const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  // Unique Achievement Identifier
  achievementId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'ACH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },

  // Core Achievement Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  icon: {
    type: String,
    required: true,
    trim: true // emoji or icon identifier
  },
  
  // Achievement Classification
  category: {
    type: String,
    required: true,
    enum: ['learning', 'mentoring', 'project', 'engagement', 'milestone', 'social']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  // Achievement Criteria & Progress
  criteria: {
    type: {
      type: String,
      required: true,
      enum: [
        'sessions_completed',
        'projects_completed', 
        'streak_days',
        'rating_achieved',
        'students_mentored',
        'xp_earned',
        'profile_completion',
        'mentor_hours',
        'custom'
      ]
    },
    targetValue: {
      type: Number,
      required: true,
      min: 1
    },
    currentProgress: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Rewards & Benefits
  rewards: {
    xpBonus: {
      type: Number,
      default: 0,
      min: 0
    },
    badgeUrl: {
      type: String,
      default: null
    },
    title_unlock: {
      type: String,
      default: null
    },
    specialPerks: [{
      type: String,
      trim: true
    }]
  },
  
  // User Association
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['Learner', 'Mentor'],
  },
  
  // Achievement Status
  isAchieved: {
    type: Boolean,
    default: false,
    required: true
  },
  achievedAt: {
    type: Date,
    default: null
  },
  
  // Progress Tracking
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Metadata & Analytics
  isVisible: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Related Data References
  relatedData: {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Learner',
      default: null
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      default: null
    },
    projectIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }]
  },
  
  // Achievement History & Updates
  progressHistory: [{
    previousProgress: Number,
    newProgress: Number,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    triggerEvent: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
achievementSchema.index({ userId: 1 });
achievementSchema.index({ userType: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ isAchieved: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ achievementId: 1 });

// Compound indexes
achievementSchema.index({ userId: 1, isAchieved: 1 });
achievementSchema.index({ userId: 1, category: 1 });

// Virtual for checking if achievement is in progress
achievementSchema.virtual('isInProgress').get(function() {
  return !this.isAchieved && this.criteria.currentProgress > 0;
});

// Virtual for time since achievement
achievementSchema.virtual('daysSinceAchieved').get(function() {
  if (!this.achievedAt) return null;
  const diffTime = Math.abs(new Date() - this.achievedAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate progress percentage
achievementSchema.pre('save', function(next) {
  if (this.isModified('criteria.currentProgress') || this.isModified('criteria.targetValue')) {
    this.progressPercentage = Math.min(
      Math.floor((this.criteria.currentProgress / this.criteria.targetValue) * 100),
      100
    );
    
    // Check if achievement should be marked as achieved
    if (this.criteria.currentProgress >= this.criteria.targetValue && !this.isAchieved) {
      this.isAchieved = true;
      this.achievedAt = new Date();
    }
  }
  next();
});

// Static method to create default achievements for a user
achievementSchema.statics.createDefaultAchievements = async function(userId, userType) {
  const defaultAchievements = [
    // Achievement 1: First Steps (Common)
    {
      title: "First Steps",
      description: userType === 'Learner' 
        ? "Complete your first learning session and begin your journey" 
        : "Complete your first mentoring session and start helping others",
      icon: "🚀",
      category: userType === 'Learner' ? 'learning' : 'mentoring',
      rarity: 'common',
      criteria: {
        type: 'sessions_completed',
        targetValue: 1,
        currentProgress: 0
      },
      rewards: {
        xpBonus: 100,
        title_unlock: "Starter"
      },
      userId,
      userType,
      displayOrder: 1
    },
    
    // Achievement 2: Dedicated Learner/Mentor (Rare)
    {
      title: userType === 'Learner' ? "Dedicated Learner" : "Dedicated Mentor",
      description: userType === 'Learner' 
        ? "Complete 10 learning sessions and show your commitment" 
        : "Complete 10 mentoring sessions and prove your dedication",
      icon: "⭐",
      category: userType === 'Learner' ? 'learning' : 'mentoring',
      rarity: 'rare',
      criteria: {
        type: 'sessions_completed',
        targetValue: 10,
        currentProgress: 0
      },
      rewards: {
        xpBonus: 500,
        title_unlock: userType === 'Learner' ? "Dedicated Student" : "Dedicated Guide"
      },
      userId,
      userType,
      displayOrder: 2
    },
    
    // Achievement 3: Project Master (Epic)
    {
      title: "Project Master",
      description: userType === 'Learner' 
        ? "Successfully complete 5 projects and master your skills" 
        : "Successfully mentor 5 projects to completion",
      icon: "🏆",
      category: 'project',
      rarity: 'epic',
      criteria: {
        type: 'projects_completed',
        targetValue: 5,
        currentProgress: 0
      },
      rewards: {
        xpBonus: 1000,
        title_unlock: "Project Master",
        specialPerks: ["Priority project matching", "Featured profile badge"]
      },
      userId,
      userType,
      displayOrder: 3
    },
    
    // Achievement 4: Legend (Legendary)
    {
      title: "Legend",
      description: userType === 'Learner' 
        ? "Maintain a 30-day learning streak and become a learning legend" 
        : "Achieve a 4.8+ rating with 20+ reviews and become a mentoring legend",
      icon: "👑",
      category: userType === 'Learner' ? 'engagement' : 'mentoring',
      rarity: 'legendary',
      criteria: {
        type: userType === 'Learner' ? 'streak_days' : 'rating_achieved',
        targetValue: userType === 'Learner' ? 30 : 480, // 4.8 * 100 for rating
        currentProgress: 0
      },
      rewards: {
        xpBonus: 2500,
        title_unlock: "Legend",
        specialPerks: [
          "Exclusive legend badge", 
          "Priority support", 
          "Special profile highlighting",
          userType === 'Learner' ? "Access to premium mentors" : "Higher commission rates"
        ]
      },
      userId,
      userType,
      displayOrder: 4
    }
  ];

  try {
    const achievements = await this.insertMany(defaultAchievements);
    return achievements;
  } catch (error) {
    throw new Error(`Failed to create default achievements: ${error.message}`);
  }
};

// Instance method to update progress
achievementSchema.methods.updateProgress = function(newProgress, triggerEvent = '') {
  const previousProgress = this.criteria.currentProgress;
  this.criteria.currentProgress = Math.min(newProgress, this.criteria.targetValue);
  
  // Add to progress history
  this.progressHistory.push({
    previousProgress,
    newProgress: this.criteria.currentProgress,
    triggerEvent
  });
  
  return this.save();
};

// Static method to update user achievements based on activity
achievementSchema.statics.updateUserAchievements = async function(userId, userType, activityData) {
  const achievements = await this.find({ userId, isAchieved: false });
  
  for (const achievement of achievements) {
    let newProgress = achievement.criteria.currentProgress;
    
    switch (achievement.criteria.type) {
      case 'sessions_completed':
        newProgress = activityData.completedSessions || 0;
        break;
      case 'projects_completed':
        newProgress = activityData.completedProjects || 0;
        break;
      case 'streak_days':
        newProgress = activityData.streakDays || 0;
        break;
      case 'rating_achieved':
        newProgress = Math.floor((activityData.rating || 0) * 100);
        break;
      case 'xp_earned':
        newProgress = activityData.xp || 0;
        break;
    }
    
    if (newProgress > achievement.criteria.currentProgress) {
      await achievement.updateProgress(newProgress, 'Activity Update');
    }
  }
};

// Configure JSON output
achievementSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);