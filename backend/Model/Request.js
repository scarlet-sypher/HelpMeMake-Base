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

    // NEW: Status tracking for mentor responses
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },

    // NEW: Mentor's response message (optional)
    mentorResponse: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // NEW: When mentor responded
    respondedAt: {
      type: Date,
      default: null,
    },

    // NEW: Track if learner has seen the response
    isReadByLearner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true, // Allow updates now for status changes
    },
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
requestSchema.index({ status: 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ respondedAt: -1 });

// Virtual for learner population (uses learnerId -> Learner -> userId -> User)
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

// NEW: Static method to get pending requests count for a mentor
requestSchema.statics.getPendingRequestsCount = function (mentorId) {
  return this.countDocuments({ mentorId, status: "pending" });
};

// NEW: Static method to get requests by mentor with filtering
requestSchema.statics.getMentorRequests = function (mentorId, status = null) {
  const query = { mentorId };
  if (status) query.status = status;

  return this.find(query)
    .populate({
      path: "learnerUser",
      populate: {
        path: "userId",
        select: "name email avatar",
      },
    })
    .populate("project", "name shortDescription status")
    .sort({ createdAt: -1 });
};

// NEW: Instance method to accept request
requestSchema.methods.accept = function (response = "") {
  this.status = "accepted";
  this.mentorResponse = response;
  this.respondedAt = new Date();
  return this.save();
};

// NEW: Instance method to reject request
requestSchema.methods.reject = function (response = "") {
  this.status = "rejected";
  this.mentorResponse = response;
  this.respondedAt = new Date();
  return this.save();
};

// NEW: Virtual to check if request is pending
requestSchema.virtual("isPending").get(function () {
  return this.status === "pending";
});

// NEW: Virtual to check if request has been responded to
requestSchema.virtual("hasResponse").get(function () {
  return this.status !== "pending";
});

// NEW: Virtual to format response time
requestSchema.virtual("responseTime").get(function () {
  if (!this.respondedAt) return null;
  const diffTime = this.respondedAt - this.createdAt;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} days`;
  if (diffHours > 0) return `${diffHours} hours`;
  return "< 1 hour";
});

requestSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Request", requestSchema);
