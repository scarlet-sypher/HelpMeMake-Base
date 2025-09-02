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

messageRoomSchema.index({ roomId: 1 });
messageRoomSchema.index({ learnerId: 1 });
messageRoomSchema.index({ mentorId: 1 });
messageRoomSchema.index({ projectId: 1 });
messageRoomSchema.index({ status: 1 });
messageRoomSchema.index({ createdAt: -1 });

messageRoomSchema.index({ learnerId: 1, status: 1 });
messageRoomSchema.index({ mentorId: 1, status: 1 });
messageRoomSchema.index({ projectId: 1, status: 1 });

messageRoomSchema.virtual("isActive").get(function () {
  return this.status === "open";
});

messageRoomSchema.methods.generateRoomName = function (projectName) {
  return `Chat - ${projectName}`;
};

messageRoomSchema.methods.closeRoom = function () {
  this.status = "close";
  return this.save();
};

messageRoomSchema.methods.incrementUnreadCount = function (receiverRole) {
  if (receiverRole === "learner") {
    this.learnerUnreadCount += 1;
  } else if (receiverRole === "mentor") {
    this.mentorUnreadCount += 1;
  }
  return this.save();
};

messageRoomSchema.methods.resetUnreadCount = function (userRole) {
  if (userRole === "learner") {
    this.learnerUnreadCount = 0;
  } else if (userRole === "mentor") {
    this.mentorUnreadCount = 0;
  }
  return this.save();
};

messageRoomSchema.statics.findByLearner = function (learnerId, status = null) {
  const query = { learnerId };
  if (status) query.status = status;
  return this.find(query)
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status")
    .sort({ updatedAt: -1 });
};

messageRoomSchema.statics.findByMentor = function (mentorId, status = null) {
  const query = { mentorId };
  if (status) query.status = status;
  return this.find(query)
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status")
    .sort({ updatedAt: -1 });
};

messageRoomSchema.statics.findByProject = function (projectId) {
  return this.findOne({ projectId })
    .populate("learnerId", "userId")
    .populate("mentorId", "userId")
    .populate("projectId", "name status");
};

messageRoomSchema.pre("save", function (next) {
  if (this.isModified("lastMessage.timestamp")) {
    this.updatedAt = new Date();
  }
  next();
});

messageRoomSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("MessageRoom", messageRoomSchema);
