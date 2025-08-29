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
    <div className="relative flex items-start space-x-4 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-white/20 to-white/5"></div>
      )}
      {/* Icon Container */}
      <div className="relative z-10">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
        >
          <Icon
            size={18}
            className={`${color} group-hover:scale-110 transition-transform duration-300`}
          />
        </div>
        {/* Glowing effect */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${color
            .replace("text-", "from-")
            .replace(
              "-400",
              "-400/20"
            )} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
        ></div>
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
          <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </p>
          <p className="text-xs text-blue-300 mt-1 group-hover:text-blue-200 transition-colors duration-300">
            {subtitle}
          </p>
          {/* Animated accent line */}
          <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

  // Icon mapping for timeline events
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

  // Format time helper
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

  // Fetch timeline data
  const fetchTimelineData = useCallback(async () => {
    try {
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No access token found");
      }

      //debug - Print logged-in user making request
      // console.log(
      //   "//debug - Fetching timeline data from:",
      //   `${apiUrl}/api/timeline`
      // );

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

      //debug - Print timeline response
      // console.log("//debug - Timeline API response:", data);

      if (data.success) {
        const events = data.data.events || [];

        // Create a Map to remove duplicates based on event ID or message+createdAt
        const eventMap = new Map();
        events.forEach((event) => {
          const key = event.id || `${event.message}-${event.createdAt}`;
          eventMap.set(key, event);
        });

        const uniqueEvents = Array.from(eventMap.values());

        //debug - Print current selected timeline events
        // console.log(
        //   "//debug - Current selected timeline events:",
        //   uniqueEvents.length
        // );
        // uniqueEvents.slice(0, 5).forEach((event, index) => {
        //   console.log(`//debug - Timeline event ${index + 1}:`, event.message);
        // });

        // Force complete state replacement
        setTimelineEvents(uniqueEvents);
      } else {
        throw new Error(data.message || "Failed to fetch timeline data");
      }
    } catch (err) {
      console.error("Error fetching timeline data:", err);
      setError(err.message);

      // Set fallback data if API fails
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

  // Update timeline by checking for changes
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
        // Always refetch after update to ensure we have latest data
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
      await updateTimeline(); // This will update and then fetch
    };

    loadTimeline();
  }, []);

  // Auto-update timeline every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        // Only update if not already refreshing
        updateTimeline();
      }
    }, 10000); // 10 seconds - now matches mentor timeline

    return () => clearInterval(interval);
  }, [refreshing, timelineEvents.length]);

  //debug - Print any state updates
  useEffect(() => {
    // console.log(
    //   "//debug - Timeline state updated - events count:",
    //   timelineEvents.length
    // );
  }, [timelineEvents]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative flex items-start space-x-4 animate-pulse"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30">
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchTimelineData}
            className="mt-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <Trophy className="mx-auto mb-4 text-yellow-400" size={48} />
          <p className="text-white text-lg font-semibold mb-2">
            Your Journey Awaits!
          </p>
          <p className="text-blue-300 text-sm">
            Start your learning adventure and your timeline will come alive with
            achievements and progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Events */}
      <div className="hide-scrollbar-general space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/20">
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
    </div>
  );
};

export default Timeline;
