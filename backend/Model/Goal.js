const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      index: true,
    },
    // Core Goal Data
    monthlyGoal: {
      type: Number,
      required: true,
      default: 2000,
      min: 0,
    },
    currentEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Progress Tracking
    sessionsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgPerSession: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Time-bound Goal
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    // Comparisons / Insights
    lastMonthEarnings: {
      type: Number,
      default: 0,
    },
    lastMonthSessions: {
      type: Number,
      default: 0,
    },
    // Achievement Tracking
    milestones: [
      {
        percentage: { type: Number, enum: [25, 50, 75, 100] },
        achievedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Virtual: Progress Percentage
goalSchema.virtual("progressPercentage").get(function () {
  if (!this.monthlyGoal || this.monthlyGoal === 0) return 0;
  return Math.round((this.currentEarnings / this.monthlyGoal) * 100);
});

// Virtual: Remaining Amount
goalSchema.virtual("remaining").get(function () {
  return Math.max(this.monthlyGoal - this.currentEarnings, 0);
});

// Virtual: Sessions Needed to Hit Goal
goalSchema.virtual("sessionsToGo").get(function () {
  if (this.avgPerSession <= 0) return null;
  return Math.ceil(this.remaining / this.avgPerSession);
});

goalSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Goal", goalSchema);
