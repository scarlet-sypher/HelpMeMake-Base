import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Eye,
  Download,
  Clock,
} from "lucide-react";

const ChatMessages = ({
  messages,
  selectedRoom,
  wallpaperPresets,
  user,
  formatTime,
  messagesEndRef,
  isLoading,
}) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const messagesContainerRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  // Enhanced scroll handler with progress tracking and improved scroll-to-bottom detection
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 150; // Increased threshold for better UX

    // Calculate scroll progress (0-100)
    const progress =
      scrollHeight > clientHeight
        ? Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100)
        : 0;

    setScrollProgress(progress);
    setIsNearBottom(isNear);

    // Show scroll button when user scrolls up significantly
    setShowScrollButton(
      !isNear && scrollHeight > clientHeight && scrollTop > 300
    );

    lastScrollTopRef.current = scrollTop;
  };

  // Debounced scroll handler with better performance
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let ticking = false;
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", optimizedScrollHandler, {
      passive: true,
    });

    // Initial call to set up state
    handleScroll();

    return () => {
      container.removeEventListener("scroll", optimizedScrollHandler);
    };
  }, []);

  // Fixed auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    // Always scroll to bottom for new messages if user is near bottom
    // or if this is the first load of messages
    const shouldAutoScroll = isNearBottom || messages.length <= 1;

    if (shouldAutoScroll) {
      // Use a small delay to ensure DOM has updated
      setTimeout(() => {
        scrollToBottom(false); // Use immediate scroll for auto-scroll
        setIsNearBottom(true); // Ensure state is updated
      }, 10);
    }
  }, [messages.length]); // Only trigger on message count change

  const scrollToBottom = (smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (smooth) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    } else {
      container.scrollTop = container.scrollHeight;
    }

    // Update state immediately for smooth scrolling
    setIsNearBottom(true);
    setShowScrollButton(false);
  };

  // Helper function to format date sections
  const formatDateSection = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    // For older messages, show formatted date
    return messageDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to check if we should show a date separator
  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.time);
    const previousDate = new Date(previousMessage.time);

    return currentDate.toDateString() !== previousDate.toDateString();
  };

  // Group messages by date for rendering
  const groupMessagesByDate = () => {
    const grouped = [];

    messages.forEach((message, index) => {
      const previousMessage = index > 0 ? messages[index - 1] : null;

      if (shouldShowDateSeparator(message, previousMessage)) {
        grouped.push({
          type: "date-separator",
          date: message.time,
          id: `date-${message.time}-${index}`,
        });
      }

      grouped.push({
        type: "message",
        data: message,
        index,
        id: message._id || `message-${index}`,
      });
    });

    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex-1 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 animate-pulse"></div>

        {/* Loading skeleton with better animations and responsive design */}
        <div className="relative z-10 h-full p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              } mb-3 sm:mb-4`}
            >
              <div
                className={`flex items-end space-x-2 sm:space-x-3 max-w-[280px] sm:max-w-sm ${
                  i % 2 === 1 ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {i % 2 === 0 && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-full animate-pulse"></div>
                )}
                <div
                  className={`px-3 sm:px-6 py-3 sm:py-4 rounded-2xl animate-pulse ${
                    i % 2 === 0
                      ? "bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-bl-md"
                      : "bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-br-md"
                  }`}
                >
                  <div
                    className={`h-3 sm:h-4 rounded animate-pulse ${
                      i % 2 === 0 ? "bg-slate-600/50" : "bg-cyan-400/50"
                    }`}
                    style={{ width: `${120 + i * 40}px` }}
                  ></div>
                  <div
                    className={`w-12 sm:w-16 h-2 sm:h-3 rounded mt-2 animate-pulse ${
                      i % 2 === 0 ? "bg-slate-600/30" : "bg-cyan-400/30"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Enhanced wallpaper with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url(${
            selectedRoom.mentorWallpaper || wallpaperPresets[0]
          })`,
        }}
      />

      {/* Improved overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80 backdrop-blur-[1px]"></div>

      {/* Messages container with improved responsiveness */}
      <div
        ref={messagesContainerRef}
        className="relative z-10 h-full overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 space-y-1 hide-scrollbar-general"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8 sm:py-12 flex flex-col items-center justify-center h-full px-4">
            <div className="relative mb-4 sm:mb-6">
              <MessageCircle
                className="mx-auto text-gray-600"
                size={window.innerWidth < 640 ? 56 : 64}
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-400 max-w-md text-center text-sm sm:text-base leading-relaxed">
              Send your first message to begin chatting with your learner
            </p>
          </div>
        ) : (
          <>
            {groupedMessages.map((item) => {
              if (item.type === "date-separator") {
                // Date separator with improved responsive design
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-center py-3 sm:py-4 my-2 sm:my-4"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-full border border-white/10">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                          <span className="text-xs sm:text-sm font-medium text-white">
                            {formatDateSection(item.date)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                    </div>
                  </div>
                );
              }

              // Regular message rendering with improved responsiveness
              const message = item.data;
              const index = item.index;
              const isCurrentUserMessage = message.senderId._id === user.userId;
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId._id !== message.senderId._id;
              const isConsecutive =
                index > 0 &&
                messages[index - 1]?.senderId._id === message.senderId._id;

              return (
                <div
                  key={item.id}
                  className={`flex ${
                    isCurrentUserMessage ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mb-1" : "mb-3 sm:mb-4"}`}
                >
                  <div
                    className={`flex items-end space-x-2 sm:space-x-3 max-w-[260px] sm:max-w-[320px] md:max-w-sm lg:max-w-md xl:max-w-lg ${
                      isCurrentUserMessage
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Enhanced Avatar with improved responsiveness */}
                    {!isCurrentUserMessage && showAvatar && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={message.senderId.avatar || "/default-avatar.png"}
                          alt={message.senderId.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white/20 shadow-lg"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-slate-800"></div>
                      </div>
                    )}
                    {!isCurrentUserMessage && !showAvatar && (
                      <div className="w-7 sm:w-8 md:w-9 flex-shrink-0"></div>
                    )}

                    {/* Enhanced Message Bubble with improved mobile responsiveness */}
                    <div
                      className={`px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-2xl max-w-full transition-all duration-200 group relative ${
                        isCurrentUserMessage
                          ? "bg-teal-700 text-white rounded-br-md"
                          : "bg-gradient-to-r from-slate-700/90 to-slate-600/90 backdrop-blur-sm text-white rounded-bl-md border border-white/10 "
                      } ${
                        isConsecutive && !showAvatar
                          ? isCurrentUserMessage
                            ? "rounded-br-2xl"
                            : "rounded-bl-2xl"
                          : ""
                      }`}
                    >
                      {/* Enhanced Image Message with improved mobile handling */}
                      {message.messageType === "image" && message.imageUrl && (
                        <div className="mb-2 sm:mb-3">
                          <div className="relative group/image">
                            <img
                              src={message.imageUrl}
                              alt={message.imageName || "Shared image"}
                              className="max-w-full h-auto rounded-xl transition-transform duration-200 hover:scale-[1.02] max-h-[25vh] sm:max-h-[30vh] md:max-h-[35vh]"
                            />

                            {/* Enhanced Image Action Buttons with mobile optimization */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover/image:opacity-100 transition-all duration-300 rounded-xl flex items-center justify-center space-x-2 sm:space-x-3">
                              {/* View Button */}
                              <button
                                onClick={() =>
                                  window.open(message.imageUrl, "_blank")
                                }
                                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 shadow-lg"
                                title="View Image"
                              >
                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
                                className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 shadow-lg"
                                title="Download Image"
                              >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </button>
                            </div>
                          </div>

                          {/* Enhanced Image Info with responsive text */}
                          {message.imageName && (
                            <div className="mt-2 text-xs opacity-70 bg-black/20 rounded px-2 py-1">
                              <div className="truncate">
                                {message.imageName}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced Text Message with responsive typography */}
                      {message.message && message.message.trim() && (
                        <p className="text-xs sm:text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">
                          {message.message}
                        </p>
                      )}

                      {/* Enhanced Time + Status with responsive spacing */}
                      <div
                        className={`flex items-center justify-end mt-1.5 sm:mt-2 space-x-1 sm:space-x-2 ${
                          isCurrentUserMessage
                            ? "text-cyan-100/80"
                            : "text-gray-400/80"
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {formatTime(message.time)}
                        </span>
                        {isCurrentUserMessage && (
                          <CheckCircle2
                            size={12}
                            className={`sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
                              message.isRead
                                ? "text-cyan-200 drop-shadow-sm"
                                : "text-cyan-300/70"
                            }`}
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

      {/* Enhanced Scroll to Bottom Button with Progress Indicator and improved mobile positioning */}
      {showScrollButton && (
        <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 right-3 sm:right-4 md:right-6 z-20">
          <div className="relative">
            {/* Progress ring */}
            <svg
              className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-slate-700/50"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${scrollProgress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Button with responsive sizing */}
            <button
              onClick={() => scrollToBottom(true)}
              className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/10 flex items-center justify-center group"
              title="Scroll to bottom"
            >
              <ChevronDown
                size={window.innerWidth < 640 ? 16 : 20}
                className="transition-transform duration-200 group-hover:animate-bounce"
              />

              {/* Ripple effect on click */}
              <span className="absolute inset-0 rounded-full opacity-0 group-active:opacity-25 group-active:animate-ping bg-white"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
