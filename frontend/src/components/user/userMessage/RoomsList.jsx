import React from "react";
import {
  Search,
  MessageCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RoomsList = ({
  showRoomList,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  filteredRooms,
  loading,
  handleRoomSelect,
  selectedRoom,
  formatTime,
  roomListCollapsed,
  setRoomListCollapsed,
}) => {
  const isRoomClosed = (room) => room?.status === "close";

  // Determine sidebar width based on collapsed state and screen size
  const getSidebarWidth = () => {
    if (window.innerWidth < 768) return "w-full"; // Full width on mobile
    if (roomListCollapsed) return "w-20"; // Collapsed width
    return "w-80"; // Fixed expanded width
  };

  return (
    <div
      className={`${
        showRoomList ? "flex" : "hidden"
      } lg:flex flex-col ${getSidebarWidth()} bg-white/5 backdrop-blur-sm border-r border-white/10 transition-all duration-300 shadow-2xl`}
    >
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-gray-300 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Messages
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Desktop Collapse Toggle */}
      {setRoomListCollapsed && (
        <div className="hidden lg:flex justify-end p-2 border-b border-white/5">
          <button
            onClick={() => setRoomListCollapsed(!roomListCollapsed)}
            className="p-2 rounded-lg bg-slate-700/40 hover:bg-slate-600/40 text-gray-300 hover:text-white transition-all duration-200 shadow-sm"
            aria-label={
              roomListCollapsed ? "Expand room list" : "Collapse room list"
            }
          >
            {roomListCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      )}

      {/* Search Bar - Hidden when collapsed on large screens */}
      <div
        className={`p-4 border-b border-white/10 ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200"
            size={16}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Collapsed State - Show only icons */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-4 space-y-3">
          {/* Show first few room avatars */}
          {filteredRooms.slice(0, 4).map((room) => (
            <button
              key={room._id}
              onClick={() => handleRoomSelect(room)}
              className={`relative p-1 rounded-xl transition-all duration-200 ${
                selectedRoom?._id === room._id
                  ? "bg-blue-500/20 border-2 border-blue-500/50"
                  : "hover:bg-white/10"
              }`}
              aria-label={`Chat with ${room.mentor?.name || "Unknown Mentor"}`}
            >
              <img
                src={room.mentor?.avatar || "/default-avatar.jpg"}
                alt={room.mentor?.name || "Mentor"}
                className="w-10 h-10 rounded-lg object-cover"
              />
              {isRoomClosed(room) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
              {room.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {room.unreadCount > 9 ? "9+" : room.unreadCount}
                </div>
              )}
            </button>
          ))}

          {filteredRooms.length > 4 && (
            <div className="text-gray-400 text-xs font-medium">
              +{filteredRooms.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Room List - Hidden when collapsed */}
      <div
        className={`flex-1 overflow-y-auto ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="relative mb-4">
              <MessageCircle className="text-gray-400" size={48} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-white font-semibold mb-2">No Conversations</h3>
            <p className="text-gray-400 text-sm">
              Start a project to begin chatting with your mentor
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleRoomSelect(room)}
              className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all duration-200 hover:shadow-md group ${
                selectedRoom?._id === room._id
                  ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-l-4 border-l-blue-500 shadow-lg"
                  : ""
              } ${isRoomClosed(room) ? "opacity-70" : ""}`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={room.mentor?.avatar || "/default-avatar.jpg"}
                    alt={room.mentor?.name || "Mentor"}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-md group-hover:shadow-lg transition-shadow duration-200"
                  />
                  {!isRoomClosed(room) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
                  )}
                  {isRoomClosed(room) && (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-400 rounded-full border-2 border-slate-800"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold truncate text-sm group-hover:text-blue-100 transition-colors duration-200">
                      {room.mentor?.name || "Unknown Mentor"}
                    </h3>
                    {room.lastMessage?.timestamp && (
                      <span className="text-xs text-gray-400 font-medium">
                        {formatTime(room.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300 truncate leading-relaxed">
                      {room.lastMessage?.content || "No messages yet"}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-bold shadow-lg">
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-gray-400">
                      {room.projectId?.name || room.roomName}
                    </span>
                    {isRoomClosed(room) && (
                      <span className="bg-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-full font-medium border border-red-500/20">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom indicator when collapsed */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-3 border-t border-white/10">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="text-xs text-gray-400 mt-1 font-medium">
            {filteredRooms.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
