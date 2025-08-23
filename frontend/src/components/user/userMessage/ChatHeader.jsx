import React from "react";
import {
  ArrowLeft,
  Palette,
  MessageSquare,
  User,
  Clock,
  Shield,
} from "lucide-react";

const ChatHeader = ({
  setShowMobileChat,
  roomDetails,
  selectedRoom,
  isRoomClosed,
  setShowWallpaperModal,
  checkNewMessages,
}) => {
  const mentor = roomDetails?.mentor;
  const project = roomDetails?.projectId;
  const isRoomClosedStatus = isRoomClosed(selectedRoom);

  return (
    <div className="bg-gradient-to-r from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-xl border-b border-white/20 shadow-xl sticky top-0 z-30">
      <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Left Section - Back Button + Avatar + Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
            {/* Mobile Back Button */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="lg:hidden group p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Go back to rooms list"
            >
              <ArrowLeft
                size={20}
                className="group-hover:transform group-hover:-translate-x-0.5 transition-transform duration-200"
              />
            </button>

            {/* Avatar with Status Ring */}
            <div className="relative flex-shrink-0">
              <div className="relative">
                <img
                  src={mentor?.avatar || "/default-avatar.jpg"}
                  alt={mentor?.name || "Mentor"}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gradient-to-r from-blue-400 to-indigo-400 shadow-lg"
                  onError={(e) => {
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-slate-900 rounded-full shadow-sm"></div>
              </div>
            </div>

            {/* Mentor Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-0.5">
                <h2 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
                  {mentor?.name || "Unknown Mentor"}
                </h2>
                {mentor?.isVerified && (
                  <div
                    className="flex-shrink-0 p-1 bg-blue-500/20 rounded-full"
                    title="Verified Mentor"
                  >
                    <Shield size={12} className="text-blue-400" />
                  </div>
                )}
              </div>

              {/* Project and Status Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center space-x-1 text-xs sm:text-sm">
                  <User size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    {project?.name ||
                      selectedRoom?.roomName ||
                      "Project Discussion"}
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex items-center space-x-2">
                  {isRoomClosedStatus && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                      <Clock size={10} className="mr-1" />
                      Read Only
                    </span>
                  )}

                  {!isRoomClosedStatus && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Mentor Info - Desktop Only */}
              <div className="hidden md:flex items-center space-x-3 mt-1">
                {mentor?.expertise && (
                  <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {mentor.expertise}
                  </span>
                )}
                {mentor?.rating && (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(mentor.rating)
                              ? "bg-yellow-400"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {mentor.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Wallpaper Button */}
            <button
              onClick={() => setShowWallpaperModal(true)}
              className="group p-2 sm:p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 relative overflow-hidden"
              title="Change Wallpaper"
              aria-label="Change wallpaper"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300"></div>
              <Palette
                size={18}
                className="relative z-10 group-hover:rotate-12 transition-transform duration-200"
              />
            </button>

            {/* Mobile Menu Button - Optional */}
            <div className="hidden sm:block w-px h-6 bg-white/20 mx-1"></div>

            {/* Connection Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-2 py-1 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
};

export default ChatHeader;
