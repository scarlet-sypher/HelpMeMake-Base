const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Unique Project Identifier
  projectId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'PRJ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  },

  // Core Project Information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  fullDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  
  // Technical Details
  techStack: [{
    type: String,
    trim: true,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'AI/Machine Learning',
      'Data Science',
      'DevOps',
      'Blockchain',
      'IoT',
      'Game Development',
      'Desktop Applications',
      'API Development',
      'Database Design',
      'UI/UX Design',
      'Cybersecurity',
      'Cloud Computing',
      'Other'
    ]
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  
  // Project Metadata
  duration: {
    type: String,
    required: true,
    trim: true // e.g., "2 weeks", "1 month", "3-4 days"
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  thumbnail: {
    type: String,
    default: '/uploads/public/default-project.jpg'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Project Goals & Context
  projectOutcome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  motivation: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  knowledgeLevel: {
    type: String,
    required: true,
    enum: ['Complete Beginner', 'Some Knowledge', 'Good Understanding', 'Advanced Knowledge']
  },
  references: [{
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['Documentation', 'Tutorial', 'GitHub Repo', 'Article', 'Video', 'Book', 'Other'],
      default: 'Other'
    }
  }],
  
  // Relationships
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Learner',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    default: null
  },
  
  // Pricing Information
  openingPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Opening price must be a positive number'
    }
  },
  negotiatedPrice: {
    type: Number,
    default: null,
    min: 0,
    validate: {
      validator: function(v) {
        return v === null || v >= 0;
      },
      message: 'Negotiated price must be a positive number'
    }
  },
  closedPrice: {
    type: Number,
    default: null,
    min: 0,
    validate: {
      validator: function(v) {
        return v === null || v >= 0;
      },
      message: 'Closed price must be a positive number'
    }
  },
  currency: {
    type: String,
    default: 'INR',
  },
  
  // Project Timeline
  startDate: {
    type: Date,
    default: null
  },
  expectedEndDate: {
    type: Date,
    default: null
  },
  actualEndDate: {
    type: Date,
    default: null
  },
  
  // Project Progress & Milestones
  milestones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Milestone'
  }],
  
  totalMilestones: {
    type: Number,
    default: 0,
    max: 5 // Maximum 5 milestones per project
  },
  
  completedMilestones: {
    type: Number,
    default: 0
  },
  
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Communication & Feedback
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderType: {
      type: String,
      enum: ['Learner', 'Mentor'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Reviews & Ratings (after completion)
  learnerReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    reviewDate: Date
  },
  mentorReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    reviewDate: Date
  },
  
  // Additional Metadata
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  
  // Applications from mentors
  applications: [{
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
      required: true
    },
    proposedPrice: {
      type: Number,
      required: true,
      min: 0
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    estimatedDuration: {
      type: String,
      trim: true
    },
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ learnerId: 1 });
projectSchema.index({ mentorId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ difficultyLevel: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ 'applications.mentorId': 1 });
projectSchema.index({ projectId: 1 });

// Compound indexes for common queries
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ learnerId: 1, status: 1 });
projectSchema.index({ mentorId: 1, status: 1 });

// Virtual for calculating project age
projectSchema.virtual('projectAge').get(function() {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
});

// Virtual for checking if project is overdue
projectSchema.virtual('isOverdue').get(function() {
  if (!this.expectedEndDate || this.status === 'Completed') return false;
  return new Date() > this.expectedEndDate;
});

// Virtual for active price (returns the most relevant price)
projectSchema.virtual('activePrice').get(function() {
  if (this.closedPrice !== null) return this.closedPrice;
  if (this.negotiatedPrice !== null) return this.negotiatedPrice;
  return this.openingPrice;
});

// Pre-save middleware to update applicationsCount
projectSchema.pre('save', function(next) {
  if (this.isModified('applications')) {
    this.applicationsCount = this.applications.length;
  }
  next();
});

// Pre-save middleware to set project status based on mentor assignment
projectSchema.pre('save', function(next) {
  if (this.isModified('mentorId')) {
    if (this.mentorId && this.status === 'Idea') {
      this.status = 'In Progress';
      this.startDate = new Date();
    }
  }
  next();
});

// Static method to find projects by learner
projectSchema.statics.findByLearner = function(learnerId, status = null) {
  const query = { learnerId };
  if (status) query.status = status;
  return this.find(query).populate('learnerId mentorId');
};

// Static method to find projects by mentor
projectSchema.statics.findByMentor = function(mentorId, status = null) {
  const query = { mentorId };
  if (status) query.status = status;
  return this.find(query).populate('learnerId mentorId');
};

// Static method to find available projects (no mentor assigned)
projectSchema.statics.findAvailableProjects = function(filters = {}) {
  const query = { 
    mentorId: null, 
    status: { $in: ['Idea', 'Open'] },
    isVisible: true,
    ...filters 
  };
  return this.find(query).populate('learnerId');
};

// Instance method to add application
projectSchema.methods.addApplication = function(mentorId, proposedPrice, coverLetter, estimatedDuration) {
  // Check if mentor already applied
  const existingApplication = this.applications.find(
    app => app.mentorId.toString() === mentorId.toString()
  );
  
  if (existingApplication) {
    throw new Error('Mentor has already applied to this project');
  }
  
  this.applications.push({
    mentorId,
    proposedPrice,
    coverLetter,
    estimatedDuration
  });
  
  return this.save();
};

// Instance method to accept application
projectSchema.methods.acceptApplication = function(applicationId) {
  const application = this.applications.id(applicationId);
  if (!application) {
    throw new Error('Application not found');
  }
  
  // Set mentor and negotiated price
  this.mentorId = application.mentorId;
  this.negotiatedPrice = application.proposedPrice;
  this.status = 'In Progress';
  this.startDate = new Date();
  
  // Update application status
  application.applicationStatus = 'Accepted';
  
  // Reject all other applications
  this.applications.forEach(app => {
    if (app._id.toString() !== applicationId.toString() && app.applicationStatus === 'Pending') {
      app.applicationStatus = 'Rejected';
    }
  });
  
  return this.save();
};

// Configure JSON output
projectSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Project', projectSchema);