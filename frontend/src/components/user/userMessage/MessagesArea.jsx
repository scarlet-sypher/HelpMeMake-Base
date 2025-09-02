import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Download,
  CheckCircle2,
  ChevronDown,
  Eye,
  Sparkles,
  Clock,
} from "lucide-react";

const MessagesArea = ({
  roomDetails,
  messagesLoading,
  messages,
  user,
  messagesEndRef,
  downloadImage,
}) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const messagesContainerRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 150;

    const progress =
      scrollHeight > clientHeight
        ? Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100)
        : 0;

    setScrollProgress(progress);
    setIsNearBottom(isNear);

    setShowScrollButton(
      !isNear && scrollHeight > clientHeight && scrollTop > 300
    );

    lastScrollTopRef.current = scrollTop;
  };

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

    handleScroll();

    return () => {
      container.removeEventListener("scroll", optimizedScrollHandler);
    };
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length === 0) return;

    const shouldAutoScroll = isNearBottom || messages.length <= 1;

    if (shouldAutoScroll) {
      setTimeout(() => {
        scrollToBottom(false);
        setIsNearBottom(true);
      }, 10);
    }
  }, [messages.length]);

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

    setIsNearBottom(true);
    setShowScrollButton(false);
  };

  const formatDateSection = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return messageDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.time);
    const previousDate = new Date(previousMessage.time);

    return currentDate.toDateString() !== previousDate.toDateString();
  };

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

  if (messagesLoading) {
    return (
      <div className="flex-1 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-blue-950/50 to-indigo-950/60">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse"></div>
        </div>

        {/* Enhanced loading skeleton */}
        <div className="relative z-10 h-full p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-start" : "justify-end"
              } mb-3 sm:mb-4`}
            >
              <div
                className={`flex items-end space-x-2 sm:space-x-3 max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md ${
                  i % 2 === 1 ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {i % 2 === 0 && (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-slate-700/60 to-slate-600/60 rounded-full animate-pulse border border-white/10"></div>
                )}
                <div
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl animate-pulse backdrop-blur-sm border ${
                    i % 2 === 0
                      ? "bg-gradient-to-br from-slate-700/60 to-slate-600/60 rounded-bl-md border-white/10"
                      : "bg-gradient-to-br from-blue-500/40 to-indigo-500/40 rounded-br-md border-blue-400/20"
                  }`}
                >
                  <div
                    className={`h-3 sm:h-4 rounded-md animate-pulse mb-2 ${
                      i % 2 === 0 ? "bg-slate-500/50" : "bg-blue-300/50"
                    }`}
                    style={{ width: `${100 + i * 30}px` }}
                  ></div>
                  <div
                    className={`h-2 sm:h-3 rounded-md animate-pulse ${
                      i % 2 === 0 ? "bg-slate-600/30" : "bg-blue-400/30"
                    }`}
                    style={{ width: "50px" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-full border border-white/10">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-xs text-gray-300 font-medium">
                Loading messages...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Enhanced wallpaper with better overlay system */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out"
        style={{
          backgroundImage: roomDetails?.userWallpaper
            ? `url(${roomDetails.userWallpaper})`
            : "linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(30, 58, 138, 0.4), rgba(67, 56, 202, 0.3))",
        }}
      />

      {/* Multi-layer overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-blue-950/65 to-indigo-950/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20"></div>

      {/* Subtle mesh pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      ></div>

      {/* Messages container with enhanced styling and improved responsiveness */}
      <div
        ref={messagesContainerRef}
        className="relative z-10 h-full overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6 space-y-1 hide-scrollbar-general scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8 sm:py-12 flex flex-col items-center justify-center h-full px-4">
            <div className="relative mb-6 sm:mb-8 p-4 sm:p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
              <MessageCircle
                className="relative mx-auto text-gray-500"
                size={window.innerWidth < 640 ? 56 : 72}
              />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              No Messages Yet
            </h3>
            <p className="text-gray-400 max-w-md text-center text-sm sm:text-base leading-relaxed px-2">
              Start your conversation with your mentor and begin your learning
              journey
            </p>
            <div className="mt-4 sm:mt-6 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-400/20">
              <span className="text-xs text-blue-300 font-medium">
                Your messages will appear here
              </span>
            </div>
          </div>
        ) : (
          <>
            {groupedMessages.map((item) => {
              if (item.type === "date-separator") {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-center py-3 sm:py-4 my-2 sm:my-4"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-full border border-white/10">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
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

              const message = item.data;
              const index = item.index;
              const isCurrentUserMessage = message.senderId._id === user.userId;
              const showAvatar =
                index === 0 ||
                messages[index - 1]?.senderId._id !== message.senderId._id;
              const isConsecutive =
                index > 0 &&
                messages[index - 1]?.senderId._id === message.senderId._id;

              const isLastInGroup =
                index === messages.length - 1 ||
                messages[index + 1]?.senderId._id !== message.senderId._id;

              return (
                <div
                  key={item.id}
                  className={`flex ${
                    isCurrentUserMessage ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mb-1" : "mb-3 sm:mb-4"} px-1`}
                >
                  <div
                    className={`flex items-end space-x-2 sm:space-x-3 max-w-[260px] sm:max-w-[320px] md:max-w-sm lg:max-w-md xl:max-w-lg ${
                      isCurrentUserMessage
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Enhanced Avatar with status indicator and improved responsiveness */}
                    {!isCurrentUserMessage && showAvatar && (
                      <div className="relative flex-shrink-0 group">
                        <img
                          src={message.senderId.avatar || "/default-avatar.jpg"}
                          alt={message.senderId.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover border-2 border-white/30 shadow-lg transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-slate-800 shadow-sm"></div>

                        {/* Hover tooltip - hidden on mobile */}
                        <div className="hidden sm:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {message.senderId.name}
                        </div>
                      </div>
                    )}
                    {!isCurrentUserMessage && !showAvatar && (
                      <div className="w-7 sm:w-8 md:w-9 flex-shrink-0"></div>
                    )}

                    {/* Enhanced Message Bubble with improved mobile responsiveness */}
                    <div
                      className={`px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-2xl max-w-full transition-all duration-300 group relative ${
                        isCurrentUserMessage
                          ? `bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 ${
                              isLastInGroup ? "rounded-br-md" : "rounded-br-2xl"
                            }`
                          : `bg-gradient-to-br from-slate-700/95 to-slate-600/95 backdrop-blur-sm text-white border border-white/10 shadow-lg hover:shadow-slate-500/20 ${
                              isLastInGroup ? "rounded-bl-md" : "rounded-bl-2xl"
                            }`
                      } transform hover:scale-[1.02] hover:-translate-y-0.5`}
                    >
                      {/* Enhanced Image Message with improved mobile handling */}
                      {message.messageType === "image" && message.imageUrl && (
                        <div className="mb-2 sm:mb-3">
                          <div className="relative group/image overflow-hidden rounded-lg">
                            <img
                              src={message.imageUrl}
                              alt={message.imageName || "Shared image"}
                              className="max-w-full h-auto rounded-lg transition-all duration-300 hover:brightness-110 max-h-[30vh] sm:max-h-[35vh] md:max-h-[40vh]"
                              loading="lazy"
                            />

                            {/* Enhanced Image Action Buttons with mobile optimization */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/20 opacity-0 group-hover/image:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                {/* View Button */}
                                <button
                                  onClick={() =>
                                    window.open(message.imageUrl, "_blank")
                                  }
                                  className="p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border border-white/10"
                                  title="View Image"
                                >
                                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                </button>

                                {/* Download Button */}
                                <button
                                  onClick={() =>
                                    downloadImage(
                                      message.imageUrl,
                                      message.imageName
                                    )
                                  }
                                  className="p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg border border-white/10"
                                  title="Download Image"
                                >
                                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Image Info with responsive text */}
                          {message.imageName && (
                            <div className="mt-2 text-xs text-white/70 bg-black/20 rounded-md px-2 py-1 backdrop-blur-sm">
                              <div className="truncate font-medium">
                                {message.imageName}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced Text Message with responsive typography */}
                      {(message.messageType === "text" || message.message) && (
                        <div className="text-xs sm:text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap font-medium">
                          {message.message}
                        </div>
                      )}

                      {/* Enhanced Time + Status with responsive spacing */}
                      <div
                        className={`flex items-center justify-end mt-1.5 sm:mt-2 space-x-1 sm:space-x-2 ${
                          isCurrentUserMessage
                            ? "text-blue-100/80"
                            : "text-gray-400/80"
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {new Date(message.time).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isCurrentUserMessage && (
                          <CheckCircle2
                            size={12}
                            className={`sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
                              message.isRead
                                ? "text-blue-200 drop-shadow-sm"
                                : "text-blue-300/70"
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
                className="text-blue-400"
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
              className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/10 flex items-center justify-center group"
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

export default MessagesArea;
