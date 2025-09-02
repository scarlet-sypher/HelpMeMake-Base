import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Reply,
  MoreHorizontal,
  Heart,
  Pin,
  Loader2,
  MessageSquareOff,
} from "lucide-react";

const MessageCard = ({
  senderName,
  senderImage,
  message,
  timestamp,
  isOnline = false,
  isUnread = false,
  messageType = "text",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${
        isUnread
          ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400/30 shadow-lg"
          : "bg-white/10 border-white/10 hover:bg-white/15"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {isUnread && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={senderImage || "/default-avatar.png"}
              alt={senderName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg ring-2 ring-white/10"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/20 shadow-lg">
                <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-white truncate text-sm group-hover:text-cyan-200 transition-colors">
                {senderName}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-cyan-300/80 font-medium">
                  {timestamp}
                </span>
                {isUnread && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
              </div>
            </div>

            <p className="text-sm text-cyan-100/90 leading-relaxed mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
              {message}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-200 transition-colors"
                >
                  <Reply size={14} />
                  <span className="text-xs">Reply</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="flex items-center space-x-1 text-cyan-300/70 hover:text-pink-300 transition-colors"
                >
                  <Heart size={14} />
                  <span className="text-xs">Like</span>
                </button>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="p-1 rounded-full text-cyan-300/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Pin size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="p-1 rounded-full text-cyan-300/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    </div>
  );
};

const NoMessagesState = () => {
  return (
    <div className="text-center py-12">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto">
          <MessageSquareOff className="w-10 h-10 text-cyan-300/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        No Recent Messages
      </h3>
      <p className="text-cyan-200/70 text-sm mb-4">
        You don't have any recent messages yet.
      </p>
      <p className="text-cyan-300/50 text-xs">
        Messages from your students will appear here.
      </p>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-white/10 rounded w-24"></div>
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-white/10 rounded w-full"></div>
                  <div className="h-3 bg-white/10 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentMessages = () => {
  const navigate = useNavigate();
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigateToMessages = () => {
    navigate("/mentor/messages");
  };

  useEffect(() => {
    const loadRecentMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/messages/messages/recent`,
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
        if (!data.success)
          throw new Error(data.message || "Failed to fetch recent messages");

        setRecentMessages(data.data);
      } catch (err) {
        console.error("Error loading recent messages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecentMessages();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageCircle className="mr-2 text-teal-400" size={20} />
            Recent Messages
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <button
              onClick={handleNavigateToMessages}
              className="text-sm text-teal-300 font-medium hover:text-teal-200 transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        {loading && <LoadingState />}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">Failed to load messages</div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-cyan-300 hover:text-cyan-200 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && recentMessages.length === 0 && (
          <NoMessagesState />
        )}

        {!loading && !error && recentMessages.length > 0 && (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <MessageCard
                key={message.id}
                {...message}
                onClick={handleNavigateToMessages}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMessages;
