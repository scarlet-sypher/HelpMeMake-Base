import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Users,
  Calendar,
  Eye,
  Image,
  ExternalLink,
} from "lucide-react";

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  const handleViewRoom = () => {
    navigate(`/admin/rooms/${room._id}/view`);
  };

  const openWallpaperInNewTab = (wallpaperUrl, type) => {
    const fullUrl = wallpaperUrl.startsWith("http")
      ? wallpaperUrl
      : `${import.meta.env.VITE_API_URL}${wallpaperUrl}`;
    window.open(fullUrl, "_blank");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    return status === "open"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Header with Project Thumbnail */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={
            room.project.thumbnail?.startsWith("http")
              ? room.project.thumbnail
              : `${import.meta.env.VITE_API_URL}${room.project.thumbnail}`
          }
          alt={room.project.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white">
          <h3 className="text-sm font-semibold truncate max-w-48">
            {room.project.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                room.status
              )}`}
            >
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="p-4 space-y-3">
        {/* Room ID and Name */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={16} className="text-blue-600" />
            <span className="text-xs text-slate-500 font-mono">
              {room.roomId}
            </span>
          </div>
          <h4 className="font-semibold text-slate-800 truncate">
            {room.roomName}
          </h4>
        </div>

        {/* Participants */}
        <div className="space-y-2">
          {/* Learner */}
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <img
              src={
                room.learner.avatar?.startsWith("http")
                  ? room.learner.avatar
                  : `${import.meta.env.VITE_API_URL}${room.learner.avatar}`
              }
              alt={room.learner.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-green-700">Learner</div>
              <div className="text-sm font-semibold text-slate-800 truncate">
                {room.learner.name}
              </div>
              <div className="text-xs text-slate-600 truncate">
                {room.learner.email}
              </div>
            </div>
          </div>

          {/* Mentor */}
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
            <img
              src={
                room.mentor.avatar?.startsWith("http")
                  ? room.mentor.avatar
                  : `${import.meta.env.VITE_API_URL}${room.mentor.avatar}`
              }
              alt={room.mentor.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-purple-700">Mentor</div>
              <div className="text-sm font-semibold text-slate-800 truncate">
                {room.mentor.name}
              </div>
              <div className="text-xs text-slate-600 truncate">
                {room.mentor.email}
              </div>
            </div>
          </div>
        </div>

        {/* Room Statistics */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="text-lg font-bold text-slate-800">
              {room.totalMessages}
            </div>
            <div className="text-xs text-slate-600">Messages</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="text-lg font-bold text-slate-800">
              {room.learnerUnreadCount + room.mentorUnreadCount}
            </div>
            <div className="text-xs text-slate-600">Unread</div>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={14} />
          <span>Created: {formatDate(room.createdAt)}</span>
        </div>

        {/* Last Message */}
        {room.lastMessage?.content && (
          <div className="bg-slate-50 rounded-lg p-2">
            <div className="text-xs text-slate-500 mb-1">Last Message:</div>
            <div className="text-sm text-slate-700 line-clamp-2">
              {room.lastMessage.content}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {formatDate(room.lastMessage.timestamp)}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-0 space-y-2">
        {/* Main View Button */}
        <button
          onClick={handleViewRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          View Room
        </button>

        {/* Wallpaper Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              openWallpaperInNewTab(room.learnerWallpaper, "learner")
            }
            className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <Image size={14} />
            <ExternalLink size={12} />
            Learner BG
          </button>
          <button
            onClick={() =>
              openWallpaperInNewTab(room.mentorWallpaper, "mentor")
            }
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <Image size={14} />
            <ExternalLink size={12} />
            Mentor BG
          </button>
        </div>
      </div>
    </div>
  );
}
