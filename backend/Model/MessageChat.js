const mongoose = require("mongoose");

const messageChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageRoom",
      required: true,
    },

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

    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },

    isDelivered: {
      type: Boolean,
      default: true,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },

    attachments: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
      },
    ],

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

messageChatSchema.index({ roomId: 1 });
messageChatSchema.index({ senderId: 1 });
messageChatSchema.index({ receiverId: 1 });
messageChatSchema.index({ time: 1 });
messageChatSchema.index({ isRead: 1 });
messageChatSchema.index({ isDeleted: 1 });

messageChatSchema.index({ roomId: 1, time: 1 });
messageChatSchema.index({ roomId: 1, isDeleted: 1, time: 1 });
messageChatSchema.index({ senderId: 1, isRead: 1 });
messageChatSchema.index({ receiverId: 1, isRead: 1 });

messageChatSchema.virtual("isRecent").get(function () {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.time > fiveMinutesAgo;
});

messageChatSchema.virtual("ageInMinutes").get(function () {
  return Math.floor((Date.now() - this.time) / (1000 * 60));
});

messageChatSchema.methods.markAsRead = function (userId) {
  if (this.receiverId.toString() === userId.toString()) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  throw new Error("Only receiver can mark message as read");
};

messageChatSchema.methods.softDelete = function (userId) {
  if (this.senderId.toString() === userId.toString()) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this.save();
  }
  throw new Error("Only sender can delete their message");
};

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
    .sort({ time: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();
};

messageChatSchema.statics.getUnreadCount = function (roomId, userId) {
  return this.countDocuments({
    roomId,
    receiverId: userId,
    isRead: false,
    isDeleted: false,
  });
};

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

messageChatSchema.pre("save", function (next) {
  if (this.senderId.toString() === this.receiverId.toString()) {
    const error = new Error("Sender and receiver cannot be the same");
    return next(error);
  }

  if (this.message) {
    this.message = this.message.trim();
  }

  next();
});

messageChatSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;

    if (ret.isDeleted) {
      ret.message = "[This message was deleted]";
      delete ret.attachments;
    }
    return ret;
  },
});

module.exports = mongoose.model("MessageChat", messageChatSchema);
