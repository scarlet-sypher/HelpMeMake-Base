import React from "react";
import {
  MessageCircle,
  Search,
  RefreshCw,
  Lock,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const RoomListSidebar = ({
  showRoomList,
  rooms,
  searchTerm,
  setSearchTerm,
  selectedRoom,
  selectRoom,
  loadRooms,
  isLoading,
  setSidebarOpen,
  formatTime,
  roomListCollapsed = false,
  setRoomListCollapsed,
}) => {
  const filteredRooms = rooms.filter(
    (room) =>
      room.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      } md:flex flex-col ${getSidebarWidth()} bg-slate-800/60 backdrop-blur-md border-r border-white/10 transition-all duration-300 shadow-2xl`}
    >
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-slate-900/90 to-gray-900/90 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-cyan-300 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
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

      {/* Header - Hidden when collapsed on large screens */}
      <div
        className={`p-4 border-b border-white/10 ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Messages
          </h2>
          <button
            onClick={loadRooms}
            className={`p-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-200 shadow-lg border border-cyan-500/20 hover:border-cyan-500/40 ${
              isLoading ? "animate-spin" : ""
            }`}
            aria-label="Refresh conversations"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-200"
            size={16}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/70 transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Collapsed State - Show only icons */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-4 space-y-3">
          <button
            onClick={loadRooms}
            className={`p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-200 ${
              isLoading ? "animate-spin" : ""
            }`}
            aria-label="Refresh conversations"
          >
            <RefreshCw size={18} />
          </button>

          {/* Show first few room avatars */}
          {filteredRooms.slice(0, 4).map((room) => (
            <button
              key={room._id}
              onClick={() => selectRoom(room)}
              className={`relative p-1 rounded-xl transition-all duration-200 ${
                selectedRoom?._id === room._id
                  ? "bg-cyan-500/20 border-2 border-cyan-500/50"
                  : "hover:bg-white/10"
              }`}
              aria-label={`Chat with ${
                room.learner?.name || "Unknown Learner"
              }`}
            >
              <img
                src={room.learner?.avatar || "/default-avatar.png"}
                alt={room.learner?.name || "Learner"}
                className="w-10 h-10 rounded-lg object-cover"
              />
              {room.status === "close" && (
                <div className="absolute -bottom-1 -right-1 p-0.5 bg-red-500 rounded-full">
                  <Lock size={8} className="text-white" />
                </div>
              )}
              {room.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
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
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="relative mb-4">
              <MessageCircle className="mx-auto text-gray-600" size={48} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500/20 rounded-full animate-ping"></div>
            </div>
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Your active conversations will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                onClick={() => selectRoom(room)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5 group ${
                  selectedRoom?._id === room._id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-l-4 border-l-cyan-500 shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={room.learner?.avatar || "/default-avatar.png"}
                      alt={room.learner?.name || "Learner"}
                      className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200"
                    />
                    {room.status === "close" && (
                      <div className="absolute -bottom-1 -right-1 p-1 bg-red-500 rounded-full shadow-md">
                        <Lock size={10} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                        room.status === "open" ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate text-sm group-hover:text-cyan-100 transition-colors duration-200">
                        {room.learner?.name || "Unknown Learner"}
                      </h3>
                      {room.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-400 font-medium">
                          {formatTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 truncate mb-2 leading-relaxed">
                      {room.lastMessage?.content ||
                        room.roomName ||
                        "No messages yet"}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
                          room.status === "open"
                            ? "bg-green-500/20 text-green-300 border border-green-500/20"
                            : "bg-red-500/20 text-red-300 border border-red-500/20"
                        }`}
                      >
                        {room.status === "open" ? "Active" : "Closed"}
                      </span>

                      {room.unreadCount > 0 && (
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[24px] text-center font-bold shadow-lg">
                          {room.unreadCount > 99 ? "99+" : room.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom indicator when collapsed */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-3 border-t border-white/10">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="text-xs text-gray-400 mt-1 font-medium">
            {filteredRooms.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomListSidebar;
