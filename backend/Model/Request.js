const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // cover letter limit
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    }, // only track createdAt
  }
);

// Compound unique index to ensure one request per (projectId + mentorId + learnerId) combination
requestSchema.index(
  { projectId: 1, mentorId: 1, learnerId: 1 },
  { unique: true }
);

// Individual indexes for fast lookups
requestSchema.index({ projectId: 1 });
requestSchema.index({ mentorId: 1 });
requestSchema.index({ learnerId: 1 });
requestSchema.index({ createdAt: -1 });

// Virtual for learner population (uses mentorId -> Mentor -> userId -> User)
requestSchema.virtual("learnerUser", {
  ref: "Learner",
  localField: "learnerId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for mentor population (uses mentorId -> Mentor -> userId -> User)
requestSchema.virtual("mentorProfile", {
  ref: "Mentor",
  localField: "mentorId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for project population
requestSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

// Static method to check if request already exists
requestSchema.statics.requestExists = function (
  projectId,
  mentorId,
  learnerId
) {
  return this.findOne({ projectId, mentorId, learnerId });
};

// Static method to get requests for a project
requestSchema.statics.getProjectRequests = function (projectId) {
  return this.find({ projectId })
    .populate({
      path: "mentorProfile",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    })
    .populate({
      path: "learnerUser",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    })
    .sort({ createdAt: -1 });
};

requestSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Request", requestSchema);
