import React from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";

const ChatMessages = ({
  messages,
  selectedRoom,
  wallpaperPresets,
  user,
  formatTime,
  messagesEndRef,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 relative overflow-hidden">
        {/* Loading skeleton */}
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="relative z-10 h-full p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-start mb-3">
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 bg-slate-700/50 rounded-full animate-pulse"></div>
                <div className="px-4 py-2 bg-slate-700/50 rounded-2xl animate-pulse">
                  <div className="w-32 h-4 bg-slate-600/50 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end mb-3">
            <div className="px-4 py-2 bg-cyan-500/30 rounded-2xl animate-pulse">
              <div className="w-24 h-4 bg-cyan-400/50 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Fixed background wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            selectedRoom.mentorWallpaper || wallpaperPresets[0]
          })`,
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px]"></div>

      {/* Messages container */}
      <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4 hide-scrollbar-general">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageCircle className="mx-auto mb-3" size={48} />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUserMessage = message.senderId._id === user.userId;
            const showAvatar =
              index === 0 ||
              messages[index - 1]?.senderId._id !== message.senderId._id;

            const uniqueKey = `${message._id}-${message.time}-${index}`;

            return (
              <div
                key={uniqueKey}
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
                  {/* Avatar - Show avatar for non-current user (learner) */}
                  {!isCurrentUserMessage && showAvatar && (
                    <img
                      src={message.senderId.avatar || "/default-avatar.png"}
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
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-br-md shadow-lg"
                        : "bg-slate-700/80 backdrop-blur-sm text-white rounded-bl-md border border-white/10 shadow-lg"
                    }`}
                  >
                    {/* Image Message with Preview and Buttons */}
                    {message.messageType === "image" && message.imageUrl && (
                      <div className="mb-2">
                        <div className="relative group">
                          <img
                            src={message.imageUrl}
                            alt={message.imageName || "Shared image"}
                            className="max-w-full h-auto rounded-lg"
                            style={{
                              maxHeight: "200px",
                              maxWidth: "200px",
                            }}
                          />

                          {/* Image Action Buttons - Always show for both sender and receiver */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                            {/* View Button */}
                            <button
                              onClick={() =>
                                window.open(message.imageUrl, "_blank")
                              }
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                              title="View Image"
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>

                            {/* Download Button */}
                            <button
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = message.imageUrl;
                                link.download = message.imageName || "image";
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                              title="Download Image"
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Image Info */}
                        <div className="mt-1 text-xs opacity-70">
                          {message.imageName && (
                            <div className="truncate">{message.imageName}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Message Content or Image Caption */}
                    {message.message && message.message.trim() && (
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.message}
                      </p>
                    )}

                    {/* Time + Status */}
                    <div
                      className={`flex items-center justify-end mt-1 space-x-1 ${
                        isCurrentUserMessage ? "text-cyan-100" : "text-gray-400"
                      }`}
                    >
                      <span className="text-xs">
                        {formatTime(message.time)}
                      </span>
                      {isCurrentUserMessage && (
                        <CheckCircle2
                          size={12}
                          className={
                            message.isRead ? "text-cyan-200" : "text-cyan-300"
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
