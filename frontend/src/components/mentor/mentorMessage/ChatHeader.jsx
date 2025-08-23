//==============================Mentor====================================

import React from "react";
import {
  ArrowLeft,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
  Circle,
} from "lucide-react";

const ChatHeader = ({
  selectedRoom,
  setShowRoomList,
  checkNewMessages,
  isPolling,
  setShowWallpaperSettings,
}) => {
  const isOnline = selectedRoom.status === "open";

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-800/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Back button and User Info */}
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Mobile back button */}
            <button
              onClick={() => setShowRoomList(true)}
              className="md:hidden p-2 -ml-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Back to room list"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-0.5">
                <img
                  src={selectedRoom.learner?.avatar || "/default-avatar.png"}
                  alt={selectedRoom.learner?.name || "Learner"}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                {isOnline ? (
                  <div className="relative">
                    <Circle
                      size={12}
                      className="text-emerald-400 fill-current drop-shadow-lg"
                    />
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                ) : (
                  <Circle size={12} className="text-red-400 fill-current" />
                )}
              </div>
            </div>

            {/* User details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                {selectedRoom.learner?.name || "Unknown Learner"}
              </h3>
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                {isOnline ? (
                  <>
                    <Wifi
                      size={14}
                      className="text-emerald-400 flex-shrink-0"
                    />
                    <span className="text-emerald-400 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-red-400 flex-shrink-0" />
                    <span className="text-red-400 font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Settings/Wallpaper button */}
            <button
              onClick={() => setShowWallpaperSettings(true)}
              className="group p-2 sm:p-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-gray-300 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              title="Chat settings"
              aria-label="Open chat settings"
            >
              <Settings
                size={16}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Optional: Typing indicator or additional info */}
      </div>
    </div>
  );
};

export default ChatHeader;
