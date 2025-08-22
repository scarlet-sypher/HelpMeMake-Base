import React from "react";
import { MessageCircle, Download, CheckCircle2 } from "lucide-react";

const MessagesArea = ({
  roomDetails,
  messagesLoading,
  messages,
  user,
  messagesEndRef,
  downloadImage,
}) => {
  if (messagesLoading) {
    return (
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-blue-900/30"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-white text-lg font-medium tracking-wide">
              Loading messages...
            </div>
            <div className="text-gray-400 text-sm">
              Please wait while we fetch your conversation
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 relative overflow-hidden"
      style={{
        backgroundImage: roomDetails?.userWallpaper
          ? `url(${roomDetails.userWallpaper})`
          : "linear-gradient(to bottom right, rgba(30, 41, 59, 0.3), rgba(30, 58, 138, 0.3))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Scrollable messages container */}
      <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4 hide-scrollbar-general">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MessageCircle className="text-gray-400 mb-4" size={48} />
            <h3 className="text-white font-semibold mb-2">No Messages Yet</h3>
            <p className="text-gray-400 text-sm">
              Start the conversation with your mentor
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isCurrentUserMessage = message.senderId._id === user.userId;
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId._id !== message.senderId._id;

              return (
                <div
                  key={`${message._id}-${index}`}
                  className={`flex ${
                    isCurrentUserMessage ? "justify-end" : "justify-start"
                  } mb-3`}
                >
                  <div
                    className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      isCurrentUserMessage
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar for mentor messages (left side) */}
                    {!isCurrentUserMessage && showAvatar && (
                      <img
                        src={message.senderId.avatar || "/default-avatar.jpg"}
                        alt={message.senderId.name}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                      />
                    )}
                    {!isCurrentUserMessage && !showAvatar && (
                      <div className="w-8 flex-shrink-0"></div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-full ${
                        isCurrentUserMessage
                          ? "bg-blue-500 text-white rounded-br-md shadow-lg"
                          : "bg-white/20 backdrop-blur-sm text-white rounded-bl-md border border-white/10 shadow-lg"
                      }`}
                    >
                      {/* Image Message */}
                      {message.messageType === "image" && message.imageUrl && (
                        <div className="mb-2">
                          <div className="relative group">
                            <img
                              src={message.imageUrl}
                              alt={message.imageName || "Shared image"}
                              className="max-w-full h-auto rounded-lg cursor-pointer"
                              style={{
                                maxHeight: "300px",
                                maxWidth: "250px",
                              }}
                              onClick={() =>
                                window.open(message.imageUrl, "_blank")
                              }
                            />
                            {/* Download button for receiver */}
                            {!isCurrentUserMessage && (
                              <button
                                onClick={() =>
                                  downloadImage(
                                    message.imageUrl,
                                    message.imageName
                                  )
                                }
                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Download Image"
                                aria-label="Download image"
                              >
                                <Download size={16} className="text-white" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Text Message Content */}
                      {(message.messageType === "text" || message.message) && (
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                          {message.message}
                        </p>
                      )}

                      {/* Time and Status */}
                      <div
                        className={`flex items-center justify-end mt-1 space-x-1 ${
                          isCurrentUserMessage
                            ? "text-blue-100"
                            : "text-gray-300"
                        }`}
                      >
                        <span className="text-xs">
                          {new Date(message.time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {/* Show read status only for current user's messages */}
                        {isCurrentUserMessage && (
                          <CheckCircle2
                            size={12}
                            className={
                              message.isRead
                                ? "text-green-300"
                                : "text-blue-300"
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesArea;
