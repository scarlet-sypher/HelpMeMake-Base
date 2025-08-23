import React from "react";
import {
  Search,
  MessageCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Zap,
  Star,
  MessageSquare,
  Users,
  Sparkles,
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
      } lg:flex flex-col ${getSidebarWidth()} bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-blue-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-500 shadow-2xl relative overflow-hidden`}
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-blue-400/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-indigo-400/10 to-transparent rounded-full blur-xl" />

      {/* Mobile Header */}
      <div className="lg:hidden relative z-10 bg-gradient-to-r from-slate-900/95 to-blue-900/95 backdrop-blur-sm border-b border-slate-700/50 p-4 sticky top-0">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="group relative p-3 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-700/80 hover:from-blue-600/80 hover:to-indigo-600/80 text-slate-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            aria-label="Open navigation menu"
          >
            <Menu
              size={20}
              className="transition-transform duration-200 group-hover:rotate-3"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
              <MessageSquare size={18} className="text-blue-400" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-wide">
              Messages
            </h1>
          </div>

          <div className="w-11 flex justify-center">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Desktop Collapse Toggle */}
      {setRoomListCollapsed && (
        <div className="hidden lg:flex justify-end p-3 border-b border-slate-700/30 relative z-10">
          <button
            onClick={() => setRoomListCollapsed(!roomListCollapsed)}
            className="group relative p-2.5 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-blue-600/60 hover:to-indigo-600/60 text-slate-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
            aria-label={
              roomListCollapsed ? "Expand room list" : "Collapse room list"
            }
          >
            {roomListCollapsed ? (
              <ChevronRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            ) : (
              <ChevronLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      )}

      {/* Search Bar - Hidden when collapsed on large screens */}
      <div
        className={`p-4 border-b border-slate-700/30 relative z-10 ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300 z-10"
            size={18}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full pl-12 pr-4 py-3.5 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/40 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-inner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      {/* Collapsed State - Show only icons */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-6 space-y-4 relative z-10">
          {/* Show first few room avatars */}
          {filteredRooms.slice(0, 4).map((room, index) => (
            <button
              key={room._id}
              onClick={() => handleRoomSelect(room)}
              className={`group relative p-1.5 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                selectedRoom?._id === room._id
                  ? "bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border-2 border-blue-400/60 shadow-lg shadow-blue-500/20"
                  : "hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60 border border-slate-600/30"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              aria-label={`Chat with ${room.mentor?.name || "Unknown Mentor"}`}
            >
              <div className="relative">
                <img
                  src={room.mentor?.avatar || "/default-avatar.jpg"}
                  alt={room.mentor?.name || "Mentor"}
                  className="w-11 h-11 rounded-xl object-cover shadow-md transition-all duration-300 group-hover:shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {isRoomClosed(room) && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full border border-slate-800 shadow-lg animate-pulse" />
                )}
                {room.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border border-slate-800 animate-bounce">
                    {room.unreadCount > 9 ? "9+" : room.unreadCount}
                  </div>
                )}
              </div>
            </button>
          ))}

          {filteredRooms.length > 4 && (
            <div className="mt-4 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/30">
              <div className="text-slate-300 text-xs font-bold text-center">
                +{filteredRooms.length - 4}
              </div>
              <div className="text-slate-400 text-xs text-center mt-0.5">
                more
              </div>
            </div>
          )}
        </div>
      )}

      {/* Room List - Hidden when collapsed */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 ${
          roomListCollapsed ? "hidden lg:hidden" : "block"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="absolute inset-2 w-12 h-12 border-2 border-blue-300/20 border-t-blue-300 rounded-full animate-spin"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-6">
            <div className="relative mb-6">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/30">
                <MessageCircle className="text-slate-400" size={48} />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full animate-ping" />
              <Sparkles
                className="absolute -bottom-1 -left-1 text-blue-400 animate-pulse"
                size={16}
              />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              No Conversations Yet
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Start a project to begin your mentoring journey and connect with
              expert mentors
            </p>
            <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500">
              <Zap size={12} />
              <span>Ready when you are</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredRooms.map((room, index) => (
              <div
                key={room._id}
                onClick={() => handleRoomSelect(room)}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedRoom?._id === room._id
                    ? "bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-blue-500/20 border-l-4 border-l-blue-400 shadow-xl shadow-blue-500/10"
                    : "hover:bg-gradient-to-r hover:from-slate-800/60 hover:to-slate-700/40 hover:shadow-lg"
                } ${
                  isRoomClosed(room) ? "opacity-75" : ""
                } border border-transparent hover:border-slate-600/30`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Ambient glow effect for selected room */}
                {selectedRoom?._id === room._id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 rounded-2xl" />
                )}

                <div className="flex items-center space-x-4 relative z-10">
                  <div className="relative flex-shrink-0">
                    <div className="relative">
                      <img
                        src={room.mentor?.avatar || "/default-avatar.jpg"}
                        alt={room.mentor?.name || "Mentor"}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-600/30 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:border-slate-500/50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Status indicators */}
                    {!isRoomClosed(room) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-slate-800 shadow-lg animate-pulse" />
                    )}
                    {isRoomClosed(room) && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-red-400 to-red-500 rounded-full border-2 border-slate-800 shadow-lg" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header with name and time */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-bold truncate text-sm group-hover:text-blue-100 transition-colors duration-300">
                          {room.mentor?.name || "Unknown Mentor"}
                        </h3>
                        <Star
                          size={12}
                          className="text-yellow-400 opacity-80"
                        />
                      </div>
                      {room.lastMessage?.timestamp && (
                        <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                          <Clock size={10} />
                          <span>{formatTime(room.lastMessage.timestamp)}</span>
                        </div>
                      )}
                    </div>

                    {/* Message preview and unread count */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-300 truncate leading-relaxed flex-1 group-hover:text-slate-200 transition-colors duration-300">
                        {room.lastMessage?.content || (
                          <span className="italic text-slate-400">
                            No messages yet - start the conversation!
                          </span>
                        )}
                      </p>
                      {room.unreadCount > 0 && (
                        <div className="ml-3">
                          <span className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full px-2.5 py-1 min-w-[28px] font-bold shadow-lg border border-blue-400/30 animate-pulse">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project info and status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Users size={10} />
                        <span className="truncate max-w-[150px]">
                          {room.projectId?.name || room.roomName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isRoomClosed(room) && (
                          <span className="bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 text-xs px-2.5 py-1 rounded-full font-medium border border-red-500/30 shadow-sm">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom indicator when collapsed */}
      {roomListCollapsed && (
        <div className="hidden lg:flex flex-col items-center py-4 border-t border-slate-700/30 relative z-10">
          <div className="flex items-center justify-center w-8 h-8 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 border border-slate-600/30 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" />
          </div>
          <div className="text-xs text-slate-400 font-bold">
            {filteredRooms.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">chats</div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgb(59 130 246 / 0.3),
            rgb(99 102 241 / 0.3)
          );
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgb(59 130 246 / 0.5),
            rgb(99 102 241 / 0.5)
          );
        }
      `}</style>
    </div>
  );
};

export default RoomsList;
