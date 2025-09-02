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
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      required: true,
    },

    mentorResponse: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    isReadByLearner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

requestSchema.index(
  { projectId: 1, mentorId: 1, learnerId: 1 },
  { unique: true }
);

requestSchema.index({ projectId: 1 });
requestSchema.index({ mentorId: 1 });
requestSchema.index({ learnerId: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ createdAt: -1 });
requestSchema.index({ respondedAt: -1 });

requestSchema.virtual("learnerUser", {
  ref: "Learner",
  localField: "learnerId",
  foreignField: "_id",
  justOne: true,
});

requestSchema.virtual("mentorProfile", {
  ref: "Mentor",
  localField: "mentorId",
  foreignField: "_id",
  justOne: true,
});

requestSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

requestSchema.statics.requestExists = function (
  projectId,
  mentorId,
  learnerId
) {
  return this.findOne({ projectId, mentorId, learnerId });
};

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

requestSchema.statics.getPendingRequestsCount = function (mentorId) {
  return this.countDocuments({ mentorId, status: "pending" });
};

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

requestSchema.methods.accept = function (response = "") {
  this.status = "accepted";
  this.mentorResponse = response;
  this.respondedAt = new Date();
  return this.save();
};

requestSchema.methods.reject = function (response = "") {
  this.status = "rejected";
  this.mentorResponse = response;
  this.respondedAt = new Date();
  return this.save();
};

requestSchema.virtual("isPending").get(function () {
  return this.status === "pending";
});

requestSchema.virtual("hasResponse").get(function () {
  return this.status !== "pending";
});

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
