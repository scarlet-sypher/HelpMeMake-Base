import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Users,
  Calendar,
  Eye,
  Image,
  ExternalLink,
  Edit3,
  X,
  Save,
} from "lucide-react";

export default function RoomCard({ room, onRoomUpdate }) {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(room.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewRoom = () => {
    navigate(`/admin/rooms/${room._id}/view`);
  };

  const handleEditClick = () => {
    setEditingStatus(room.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/rooms/${room._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify({ status: editingStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (onRoomUpdate) {
          onRoomUpdate(room._id, { status: editingStatus });
        }
        setShowEditModal(false);
      } else {
        alert(result.message || "Failed to update room status");
      }
    } catch (error) {
      console.error("Error updating room status:", error);
      alert("Failed to update room status");
    } finally {
      setIsUpdating(false);
    }
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
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
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

          <button
            onClick={handleEditClick}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm"
            title="Edit Room Status"
          >
            <Edit3 size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3">
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

          <div className="space-y-2">
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
                <div className="text-xs font-medium text-green-700">
                  Learner
                </div>
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {room.learner.name}
                </div>
                <div className="text-xs text-slate-600 truncate">
                  {room.learner.email}
                </div>
              </div>
            </div>

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
                <div className="text-xs font-medium text-purple-700">
                  Mentor
                </div>
                <div className="text-sm font-semibold text-slate-800 truncate">
                  {room.mentor.name}
                </div>
                <div className="text-xs text-slate-600 truncate">
                  {room.mentor.email}
                </div>
              </div>
            </div>
          </div>

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

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar size={14} />
            <span>Created: {formatDate(room.createdAt)}</span>
          </div>

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

        <div className="p-4 pt-0 space-y-2">
          <button
            onClick={handleViewRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Room
          </button>

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

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Edit Room Status
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Room: {room.roomName}
                </label>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="open"
                      checked={editingStatus === "open"}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-green-700 font-medium">Open</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="close"
                      checked={editingStatus === "close"}
                      onChange={(e) => setEditingStatus(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-700 font-medium">Close</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || editingStatus === room.status}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
