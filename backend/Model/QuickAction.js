const mongoose = require("mongoose");

const quickActionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedActions: [
      {
        icon: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: true,
          trim: true,
        },
        color: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
        ariaLabel: {
          type: String,
          required: true,
        },
      },
    ],
    isCustomized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quickActionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("QuickAction", quickActionSchema);
