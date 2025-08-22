import React from "react";
import { ArrowLeft, Palette, MessageSquare } from "lucide-react";

const ChatHeader = ({
  setShowMobileChat,
  roomDetails,
  selectedRoom,
  isRoomClosed,
  setShowWallpaperModal,
  checkNewMessages,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMobileChat(false)}
            className="lg:hidden text-white hover:text-gray-300 transition-colors"
            aria-label="Go back to rooms list"
          >
            <ArrowLeft size={24} />
          </button>

          <img
            src={roomDetails?.mentor?.avatar || "/default-avatar.jpg"}
            alt={roomDetails?.mentor?.name || "Mentor"}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
          />

          <div>
            <h2 className="text-white font-semibold">
              {roomDetails?.mentor?.name || "Unknown Mentor"}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">
                {roomDetails?.projectId?.name || selectedRoom.roomName}
              </span>
              {isRoomClosed(selectedRoom) && (
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full">
                  Read Only
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWallpaperModal(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Change Wallpaper"
            aria-label="Change wallpaper"
          >
            <Palette size={20} />
          </button>
          <button
            onClick={checkNewMessages}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Check Messages"
            aria-label="Check for new messages"
          >
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
