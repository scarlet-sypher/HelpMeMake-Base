import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Users,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function RoomView() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [roomData, setRoomData] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoomChats();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchRoomChats = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("admin_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/rooms/${roomId}/chats`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch room chats");
      }

      const data = await response.json();
      setRoomData(data.data.room);
      setChats(data.data.chats);
    } catch (error) {
      console.error("Error fetching room chats:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const dateKey = new Date(message.time).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const renderMessage = (message) => {
    const isLearner = message.sender.type === "learner";
    const messageClass = isLearner
      ? "ml-auto bg-green-500 text-white rounded-l-2xl rounded-tr-2xl"
      : "mr-auto bg-white text-slate-800 border border-slate-200 rounded-r-2xl rounded-tl-2xl";

    const alignmentClass = isLearner ? "justify-end" : "justify-start";

    return (
      <div key={message._id} className={`flex ${alignmentClass} mb-3`}>
        <div className="flex items-end gap-2 max-w-xs">
          {/* Avatar - only show for mentor (left side) */}
          {!isLearner && (
            <img
              src={
                message.sender.avatar?.startsWith("http")
                  ? message.sender.avatar
                  : `${import.meta.env.VITE_API_URL}${message.sender.avatar}`
              }
              alt={message.sender.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-purple-200 mb-1"
            />
          )}

          <div className={`px-4 py-2 shadow-sm ${messageClass}`}>
            {/* Message content */}
            {message.messageType === "text" ? (
              <div className="text-sm whitespace-pre-wrap break-words">
                {message.message}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ImageIcon size={16} />
                  <span>{message.imageName || "Image"}</span>
                </div>
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}

            {/* Time and read status */}
            <div
              className={`text-xs mt-2 ${
                isLearner ? "text-green-100" : "text-slate-500"
              }`}
            >
              {formatTime(message.time)}
              {message.isRead && <span className="ml-1">✓✓</span>}
            </div>
          </div>

          {/* Avatar for learner (right side) */}
          {isLearner && (
            <img
              src={
                message.sender.avatar?.startsWith("http")
                  ? message.sender.avatar
                  : `${import.meta.env.VITE_API_URL}${message.sender.avatar}`
              }
              alt={message.sender.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-green-200 mb-1"
            />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading chat room...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Room
          </h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin/rooms")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(chats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Return Button */}
            <button
              onClick={() => navigate("/admin/rooms")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Rooms
            </button>

            {/* Room Info */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-slate-800">
                {roomData.roomName}
              </h1>
              <p className="text-sm text-slate-600">{roomData.project.name}</p>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-4">
              {/* Mentor Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <img
                  src={
                    roomData.mentor.avatar?.startsWith("http")
                      ? roomData.mentor.avatar
                      : `${import.meta.env.VITE_API_URL}${
                          roomData.mentor.avatar
                        }`
                  }
                  alt={roomData.mentor.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                />
                <div className="text-left">
                  <div className="text-xs font-medium text-purple-700">
                    Mentor
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {roomData.mentor.name}
                  </div>
                </div>
              </div>

              {/* Learner Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <img
                  src={
                    roomData.learner.avatar?.startsWith("http")
                      ? roomData.learner.avatar
                      : `${import.meta.env.VITE_API_URL}${
                          roomData.learner.avatar
                        }`
                  }
                  alt={roomData.learner.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                />
                <div className="text-left">
                  <div className="text-xs font-medium text-green-700">
                    Learner
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {roomData.learner.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div
          className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          style={{
            height: "calc(100vh - 200px)",
            backgroundImage: `
              linear-gradient(to right, 
                rgba(168, 85, 247, 0.1) 0%, 
                rgba(168, 85, 247, 0.05) 50%, 
                rgba(34, 197, 94, 0.05) 50%, 
                rgba(34, 197, 94, 0.1) 100%)
            `,
          }}
        >
          {/* Chat Messages Container */}
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {chats.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white/60">
                  <MessageCircle size={48} className="mx-auto mb-4" />
                  <p className="text-lg">No messages in this room yet</p>
                </div>
              </div>
            ) : (
              Object.entries(messageGroups).map(([dateKey, messages]) => (
                <div key={dateKey}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-medium text-white">
                        {formatDate(dateKey)}
                      </span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {messages.map((message) => renderMessage(message))}
                </div>
              ))
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Room Statistics Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {roomData.totalMessages}
            </div>
            <div className="text-sm text-white/60">Total Messages</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {roomData.status === "open" ? "Active" : "Closed"}
            </div>
            <div className="text-sm text-white/60">Room Status</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {new Date(roomData.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-white/60">Created Date</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {chats.filter((chat) => chat.messageType === "image").length}
            </div>
            <div className="text-sm text-white/60">Images Shared</div>
          </div>
        </div>
      </div>
    </div>
  );
}
