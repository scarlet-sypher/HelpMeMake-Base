import React from "react";
import { ArrowLeft, RefreshCw, Settings } from "lucide-react";

const ChatHeader = ({
  selectedRoom,
  setShowRoomList,
  checkNewMessages,
  isPolling,
  setShowWallpaperSettings,
}) => {
  return (
    <div className="sticky top-0 z-20 bg-slate-800/50 backdrop-blur-sm border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile back button */}
          <button
            onClick={() => setShowRoomList(true)}
            className="md:hidden text-white hover:text-gray-300 transition-colors mr-2"
          >
            <ArrowLeft size={20} />
          </button>

          <img
            src={selectedRoom.learner?.avatar || "/default-avatar.png"}
            alt={selectedRoom.learner?.name || "Learner"}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-white">
              {selectedRoom.learner?.name || "Unknown Learner"}
            </h3>
            <p className="text-sm text-gray-400">
              {selectedRoom.status === "open" ? "Online" : "Chat closed"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={checkNewMessages}
            disabled={isPolling}
            className={`p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors ${
              isPolling ? "animate-pulse" : ""
            }`}
          >
            <RefreshCw size={16} className={isPolling ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowWallpaperSettings(true)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
