import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  Calendar,
  CalendarPlus,
  CalendarX,
  CheckCircle,
  Clock,
  Folder,
  FolderPlus,
  FolderMinus,
  PlayCircle,
  Target,
  TargetIcon,
  Trash2,
  Trophy,
  XCircle,
} from "lucide-react";

const TimelineItem = ({
  icon: Icon,
  title,
  subtitle,
  color,
  isLast = false,
}) => {
  return (
    <div className="relative flex items-start space-x-4 group px-2">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-white/30 via-white/20 to-white/5 z-0"></div>
      )}

      {/* Icon Container with improved hover spacing */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative">
          {/* Glow effect background */}
          <div
            className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${color
              .replace("text-", "from-")
              .replace(
                "-400",
                "-400/20"
              )} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md scale-110`}
          ></div>

          {/* Main icon container */}
          <div className="relative p-4 rounded-xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/25 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
            <Icon
              size={20}
              className={`${color} group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`}
            />
          </div>

          {/* Pulsing dot indicator */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-75 group-hover:opacity-100 animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-8">
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/15 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-white/15 group-hover:to-white/8 group-hover:border-white/30 group-hover:translate-x-1">
          {/* Content inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <p className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors duration-300 leading-relaxed">
              {title}
            </p>
            <p className="text-xs text-blue-300/80 mt-2 group-hover:text-blue-200 transition-colors duration-300 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Animated accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-2xl"></div>

          {/* Side accent */}
          <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-400/60 to-purple-400/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getIconComponent = (iconName) => {
    const iconMap = {
      Award,
      Calendar,
      CalendarPlus,
      CalendarX,
      CheckCircle,
      Clock,
      Folder,
      FolderPlus,
      FolderMinus,
      PlayCircle,
      Target,
      TargetIcon,
      Trash2,
      Trophy,
      XCircle,
    };
    return iconMap[iconName] || Award;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const fetchTimelineData = useCallback(async () => {
    try {
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${apiUrl}/api/timeline`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const events = data.data.events || [];

        const eventMap = new Map();
        events.forEach((event) => {
          const key = event.id || `${event.message}-${event.createdAt}`;
          eventMap.set(key, event);
        });

        const uniqueEvents = Array.from(eventMap.values());
        setTimelineEvents(uniqueEvents);
      } else {
        throw new Error(data.message || "Failed to fetch timeline data");
      }
    } catch (err) {
      console.error("Error fetching timeline data:", err);
      setError(err.message);

      setTimelineEvents([
        {
          id: "fallback-1",
          message: "Welcome to your journey!",
          icon: "Trophy",
          color: "text-yellow-400",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTimeline = async () => {
    try {
      setRefreshing(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/timeline/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        await fetchTimelineData();
      }
    } catch (err) {
      console.error("Error updating timeline:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadTimeline = async () => {
      await updateTimeline();
    };

    loadTimeline();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        updateTimeline();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshing, timelineEvents.length]);

  if (loading) {
    return (
      <div className="space-y-6 px-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative flex items-start space-x-4 animate-pulse"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 rounded-xl backdrop-blur-sm"></div>
            <div className="flex-1 space-y-3 py-2">
              <div className="h-4 bg-gradient-to-r from-white/20 to-white/5 rounded-lg w-3/4 backdrop-blur-sm"></div>
              <div className="h-3 bg-gradient-to-r from-white/15 to-white/5 rounded-lg w-1/2 backdrop-blur-sm"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-4">
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-lg rounded-2xl p-6 border border-red-400/30 shadow-lg">
          <XCircle className="mx-auto mb-4 text-red-400" size={48} />
          <p className="text-red-300 text-sm mb-4 font-medium">{error}</p>
          <button
            onClick={fetchTimelineData}
            className="px-6 py-2 bg-gradient-to-r from-red-500/30 to-red-600/30 hover:from-red-500/40 hover:to-red-600/40 text-red-200 rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl backdrop-blur-sm border border-red-400/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/15 shadow-lg">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl opacity-50"></div>
            <Trophy
              className="relative mx-auto mb-6 text-yellow-400 drop-shadow-lg"
              size={64}
            />
          </div>
          <p className="text-white text-xl font-semibold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Your Journey Awaits!
          </p>
          <p className="text-blue-300/80 text-sm leading-relaxed">
            Start your learning adventure and your timeline will come alive with
            achievements and progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(59, 130, 246, 0.6) 0%,
            rgba(147, 51, 234, 0.6) 100%
          );
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(59, 130, 246, 0.8) 0%,
            rgba(147, 51, 234, 0.8) 100%
          );
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>

      {/* Timeline Container with improved height and padding */}
      <div className="relative">
        {/* Gradient fade at top */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none rounded-t-lg"></div>

        {/* Timeline Events */}
        <div className="custom-scrollbar space-y-1 h-[420px] overflow-y-auto py-4 px-1">
          {timelineEvents.map((event, index) => {
            const IconComponent = getIconComponent(event.icon);
            return (
              <TimelineItem
                key={event.id || index}
                icon={IconComponent}
                title={event.message}
                subtitle={formatTimeAgo(event.createdAt)}
                color={event.color}
                isLast={index === timelineEvents.length - 1}
              />
            );
          })}
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default Timeline;
