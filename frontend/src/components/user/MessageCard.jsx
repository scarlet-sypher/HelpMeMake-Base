import React, { useState, useEffect } from "react";
import { MessageCircle, Reply, MoreHorizontal, Heart, Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// API function moved here
const getRecentMessages = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/messages/messages/recent`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch recent messages");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching recent messages:", error);
    throw error;
  }
};

const MessageCard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigate to messages page
  const handleNavigateToMessages = () => {
    navigate("/user/messages");
  };

  // Fetch recent messages on component mount
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const recentMessages = await getRecentMessages();
        setMessages(recentMessages);
      } catch (err) {
        console.error("Error fetching recent messages:", err);
        setError(err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMessages();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white/10 rounded-2xl p-5">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-white/20 rounded w-1/3"></div>
                  <div className="h-3 bg-white/20 rounded w-4/5"></div>
                  <div className="h-3 bg-white/20 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-red-400 mb-3 font-semibold">
          Failed to load messages
        </div>
        <div className="text-sm text-gray-300 mb-4">{error}</div>
        <button
          onClick={handleNavigateToMessages}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Go to Messages
        </button>
      </div>
    );
  }

  // No messages state - improved visibility
  if (messages.length === 0) {
    return (
      <div className="text-center py-10 px-6">
        <div className="mb-6">
          <MessageCircle className="mx-auto text-gray-400 mb-4" size={56} />
          <div className="text-white text-lg font-semibold mb-2">
            No messages
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">
            You don't have any messages yet.
            <br />
            Start a conversation with your mentors!
          </div>
        </div>
        <button
          onClick={handleNavigateToMessages}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          Go to Messages
        </button>
      </div>
    );
  }

  // Render messages
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <SingleMessageCard
          key={message.id}
          {...message}
          onNavigate={handleNavigateToMessages}
        />
      ))}
      {/* View all messages button */}
      <div className="pt-2">
        <button
          onClick={handleNavigateToMessages}
          className="w-full py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] shadow-lg border border-white/10"
        >
          View All Messages
        </button>
      </div>
    </div>
  );
};

// Individual message card component - improved readability
const SingleMessageCard = ({
  id,
  senderName,
  senderImage,
  message,
  timestamp,
  isOnline = false,
  isUnread = false,
  messageType = "text",
  roomName,
  onNavigate,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
        isUnread
          ? "bg-gradient-to-r from-blue-500/25 to-purple-500/25 border-blue-400/40 shadow-lg"
          : "bg-white/15 border-white/20 hover:bg-white/20"
      }`}
      onClick={onNavigate}
    >
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-blue-400 rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
        </div>
      )}

      <div className="relative z-10 p-5">
        <div className="flex items-start space-x-4">
          {/* Profile Image with Online Status */}
          <div className="relative flex-shrink-0">
            <img
              src={senderImage || "/default-avatar.png"}
              alt={senderName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-lg ring-2 ring-white/20"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/30 shadow-lg">
                <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Message Content - improved contrast and spacing */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white truncate text-base group-hover:text-blue-200 transition-colors">
                {senderName}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-blue-200/90 font-medium bg-white/10 px-2 py-1 rounded-full">
                  {timestamp}
                </span>
                {isUnread && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </div>
            </div>

            {/* Room name (optional) */}
            {roomName && (
              <div className="text-xs text-blue-200/70 mb-2 font-medium">
                in {roomName}
              </div>
            )}

            {/* Message Text - improved readability */}
            <p className="text-sm text-gray-100 leading-relaxed mb-4 line-clamp-2 group-hover:text-white transition-colors font-medium">
              {message}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="flex items-center space-x-1 text-blue-200/80 hover:text-blue-100 transition-colors text-xs font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                  }}
                >
                  <Reply size={14} />
                  <span>Reply</span>
                </button>
                <button
                  className="flex items-center space-x-1 text-blue-200/80 hover:text-pink-200 transition-colors text-xs font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                  }}
                >
                  <Heart size={14} />
                  <span>Like</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="p-2 rounded-full text-blue-200/80 hover:text-white hover:bg-white/15 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                  }}
                >
                  <Pin size={14} />
                </button>
                <button
                  className="p-2 rounded-full text-blue-200/80 hover:text-white hover:bg-white/15 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate();
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    </div>
  );
};

export default MessageCard;
