const mongoose = require("mongoose");

const quickActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    selectedActions: [
      {
        icon: {
          type: String, // e.g. "Calendar", "PlayCircle", "Send"
          required: true,
        },
        label: {
          type: String, // e.g. "Schedule Session"
          required: true,
          trim: true,
        },
        color: {
          type: String, // e.g. "from-blue-500 to-cyan-500"
          required: true,
        },
        path: {
          type: String, // e.g. "/user/sessions"
          required: true,
        },
        ariaLabel: {
          type: String, // e.g. "Navigate to schedule a new mentoring session"
          required: true,
        },
      },
    ],
    isCustomized: {
      type: Boolean,
      default: false, // false = using default actions, true = user customized
    },
  },
  { timestamps: true }
);

// Ensure one quick action config per user
quickActionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("QuickAction", quickActionSchema);
