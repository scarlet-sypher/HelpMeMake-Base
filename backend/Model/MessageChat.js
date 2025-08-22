const mongoose = require("mongoose");

const messageChatSchema = new mongoose.Schema(
  {
    // Room reference
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageRoom",
      required: true,
    },

    // Message participants (using User IDs for consistency)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Message content and type
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    message: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
      trim: true,
      maxlength: 2000,
    },

    // Image message fields
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    imageName: {
      type: String,
      default: null,
    },
    imageSize: {
      type: Number,
      default: null,
    },

    time: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Message status tracking
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // Message delivery status
    isDelivered: {
      type: Boolean,
      default: true,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },

    // Optional: File attachments (for future use)
    attachments: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
      },
    ],

    // Message reactions (for future use)
    reactions: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Soft delete capability
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Message editing (for future use)
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    originalMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
messageChatSchema.index({ roomId: 1 });
messageChatSchema.index({ senderId: 1 });
messageChatSchema.index({ receiverId: 1 });
messageChatSchema.index({ time: 1 }); // For chronological ordering
messageChatSchema.index({ isRead: 1 });
messageChatSchema.index({ isDeleted: 1 });

// Compound indexes for common queries
messageChatSchema.index({ roomId: 1, time: 1 });
messageChatSchema.index({ roomId: 1, isDeleted: 1, time: 1 });
messageChatSchema.index({ senderId: 1, isRead: 1 });
messageChatSchema.index({ receiverId: 1, isRead: 1 });

// Virtual for checking if message is recent
messageChatSchema.virtual("isRecent").get(function () {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.time > fiveMinutesAgo;
});

// Virtual for message age in minutes
messageChatSchema.virtual("ageInMinutes").get(function () {
  return Math.floor((Date.now() - this.time) / (1000 * 60));
});

// Instance method to mark as read
messageChatSchema.methods.markAsRead = function (userId) {
  if (this.receiverId.toString() === userId.toString()) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  throw new Error("Only receiver can mark message as read");
};

// Instance method to soft delete message
messageChatSchema.methods.softDelete = function (userId) {
  // Only sender can delete their message
  if (this.senderId.toString() === userId.toString()) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  }
  throw new Error("Only sender can delete their message");
};

// Static method to get messages by room with pagination
messageChatSchema.statics.getMessagesByRoom = function (
  roomId,
  page = 1,
  limit = 50,
  includeDeleted = false
) {
  const query = {
    roomId,
    ...(includeDeleted ? {} : { isDeleted: false }),
  };

  return this.find(query)
    .populate("senderId", "name avatar email")
    .populate("receiverId", "name avatar email")
    .sort({ time: 1 }) // Ascending order for chat messages
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
};

// Static method to get unread messages count
messageChatSchema.statics.getUnreadCount = function (roomId, userId) {
  return this.countDocuments({
    roomId,
    receiverId: userId,
    isRead: false,
    isDeleted: false,
  });
};

// Static method to get messages after specific time (for polling)
messageChatSchema.statics.getMessagesAfterTime = function (
  roomId,
  lastMessageTime
) {
  return this.find({
    roomId,
    time: { $gt: new Date(lastMessageTime) },
    isDeleted: false,
  })
    .populate("senderId", "name avatar email")
    .populate("receiverId", "name avatar email")
    .sort({ time: 1 });
};

// Static method to mark all messages as read for a user in a room
messageChatSchema.statics.markAllAsRead = function (roomId, userId) {
  return this.updateMany(
    {
      roomId,
      receiverId: userId,
      isRead: false,
      isDeleted: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );
};

// Pre-save middleware for validation
messageChatSchema.pre("save", function (next) {
  // Ensure sender and receiver are different
  if (this.senderId.toString() === this.receiverId.toString()) {
    const error = new Error("Sender and receiver cannot be the same");
    return next(error);
  }

  // Trim message content
  if (this.message) {
    this.message = this.message.trim();
  }

  next();
});

// Configure JSON output
messageChatSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    // Hide deleted messages content for privacy
    if (ret.isDeleted) {
      ret.message = "[This message was deleted]";
      delete ret.attachments;
    }
    return ret;
  },
});

module.exports = mongoose.model("MessageChat", messageChatSchema);
