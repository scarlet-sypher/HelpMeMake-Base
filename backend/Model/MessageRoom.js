const mongoose = require("mongoose");

const messageRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return (
          "ROOM-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
        );
      },
    },

    // References to participants
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Learner",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // Room configuration
    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
      required: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },

    // Wallpaper settings for both users
    learnerWallpaper: {
      type: String,
      default: "/uploads/wallpapers/default-learner.jpg",
      required: true,
    },
    mentorWallpaper: {
      type: String,
      default: "/uploads/wallpapers/default-mentor.jpg",
      required: true,
    },

    // Message tracking
    lastMessage: {
      content: {
        type: String,
        default: "",
      },
      timestamp: {
        type: Date,
        default: null,
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    // Unread message counts
    learnerUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    mentorUnreadCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Room metadata
    totalMessages: {
      type: Number,
      default: 0,
      min: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
messageRoomSchema.index({ roomId: 1 });
messageRoomSchema.index({ learnerId: 1 });
messageRoomSchema.index({ mentorId: 1 });
messageRoomSchema.index({ projectId: 1 });
messageRoomSchema.index({ status: 1 });
messageRoomSchema.index({ createdAt: -1 });

// Compound indexes for common queries
messageRoomSchema.index({ learnerId: 1, status: 1 });
messageRoomSchema.index({ mentorId: 1, status: 1 });
messageRoomSchema.index({ projectId: 1, status: 1 });

// Virtual for checking if room is active
messageRoomSchema.virtual("isActive").get(function () {
  return this.status === "open";
});

// Instance method to generate room name from project
messageRoomSchema.methods.generateRoomName = function (projectName) {
  return `Chat - ${projectName}`;
};

// Instance method to close room
messageRoomSchema.methods.closeRoom = function () {
  this.status = "close";
  return this.save();
};

// Instance method to increment unread count
messageRoomSchema.methods.incrementUnreadCount = function (receiverRole) {
  if (receiverRole === "learner") {
    this.learnerUnreadCount += 1;
  } else if (receiverRole === "mentor") {
    this.mentorUnreadCount += 1;
  }
  return this.save();
};

// Instance method to reset unread count
messageRoomSchema.methods.resetUnreadCount = function (userRole) {
  if (userRole === "learner") {
    this.learnerUnreadCount = 0;
  } else if (userRole === "mentor") {
    this.mentorUnreadCount = 0;
  }
  return this.save();
};

// Static method to find rooms by learner
messageRoomSchema.statics.findByLearner = function (learnerId, status = null) {
  const query = { learnerId };
  if (status) query.status = status;
  return this.find(query)
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status")
    .sort({ updatedAt: -1 });
};

// Static method to find rooms by mentor
messageRoomSchema.statics.findByMentor = function (mentorId, status = null) {
  const query = { mentorId };
  if (status) query.status = status;
  return this.find(query)
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status")
    .sort({ updatedAt: -1 });
};

// Static method to find room by project
messageRoomSchema.statics.findByProject = function (projectId) {
  return this.findOne({ projectId })
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status");
};

// Pre-save middleware to update totalMessages and lastMessage tracking
messageRoomSchema.pre("save", function (next) {
  if (this.isModified("lastMessage.timestamp")) {
    this.updatedAt = new Date();
  }
  next();
});

// Configure JSON output
messageRoomSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("MessageRoom", messageRoomSchema);
