import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Users,
  DollarSign,
  BookOpen,
  FolderPlus,
  FolderMinus,
  CheckCircle,
  Target,
  TargetIcon,
  Trash2,
  CalendarPlus,
  CalendarX,
  Clock,
  PlayCircle,
  XCircle,
  Folder,
} from "lucide-react";

const TimelineItem = ({
  icon: Icon,
  title,
  subtitle,
  color,
  isLast = false,
}) => {
  return (
    <div className="relative flex items-start space-x-3 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-4 top-10 w-0.5 h-6 bg-gradient-to-b from-white/20 to-white/5"></div>
      )}

      {/* Icon Container - matching attached file sizing */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={`p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300`}
        >
          <Icon
            size={16}
            className={`${color} transition-transform duration-300`}
          />
        </div>

        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 rounded-lg bg-gradient-to-br ${color
            .replace("text-", "from-")
            .replace(
              "-400",
              "-400/20"
            )} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}
        ></div>
      </div>

      {/* Content - matching attached file styling */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
          <p className="text-sm font-medium text-white group-hover:text-cyan-200 transition-colors duration-300">
            {title}
          </p>
          <p className="text-xs text-cyan-300/80 mt-1 group-hover:text-cyan-200 transition-colors duration-300">
            {subtitle}
          </p>

          {/* Animated accent line */}
          <div className="mt-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIconComponent = (iconName) => {
    const iconMap = {
      Award: Award,
      Calendar: Calendar,
      Users: Users,
      DollarSign: DollarSign,
      BookOpen: BookOpen,
      FolderPlus: FolderPlus,
      FolderMinus: FolderMinus,
      CheckCircle: CheckCircle,
      Target: Target,
      TargetIcon: TargetIcon,
      Trash2: Trash2,
      CalendarPlus: CalendarPlus,
      CalendarX: CalendarX,
      Clock: Clock,
      PlayCircle: PlayCircle,
      XCircle: XCircle,
      Folder: Folder,
    };
    return iconMap[iconName] || BookOpen;
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const fetchMentorTimeline = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/mentor-timeline`, {
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
        setTimelineData(data.data.events);
      } else {
        throw new Error(data.message || "Failed to fetch timeline");
      }
    } catch (error) {
      console.error("Error fetching mentor timeline:", error);
      setError(error.message);
      setTimelineData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateMentorTimeline = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await fetch(`${apiUrl}/api/mentor-timeline/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchMentorTimeline();
    } catch (error) {
      console.error("Error updating mentor timeline:", error);
    }
  };

  useEffect(() => {
    const loadTimeline = async () => {
      await updateMentorTimeline();
    };

    loadTimeline();

    const interval = setInterval(() => {
      updateMentorTimeline();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && timelineData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white text-sm">Loading timeline...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="mr-2 text-teal-400" size={20} />
            Recent Activity
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-teal-300 font-medium">
              Live Updates
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-400 text-sm mb-2">
              Failed to load timeline
            </div>
            <div className="text-gray-400 text-xs">{error}</div>
            <button
              onClick={() => updateMentorTimeline()}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && timelineData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <div className="text-white text-lg font-semibold mb-2">
              Your Journey Awaits!
            </div>
            <div className="text-gray-400 text-sm">
              Start your learning adventure and your timeline will come alive
              with achievements and progress.
            </div>
          </div>
        )}

        {/* Timeline Events */}
        {!error && timelineData.length > 0 && (
          <div
            className="space-y-1 timeline-scroll"
            style={{
              maxHeight: "320px",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "8px",
            }}
          >
            {timelineData.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <TimelineItem
                  key={item.id || `${item.type}-${index}`}
                  icon={IconComponent}
                  title={item.message}
                  subtitle={formatTimeAgo(item.createdAt)}
                  color={item.color}
                  isLast={index === timelineData.length - 1}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .timeline-scroll::-webkit-scrollbar {
          width: 4px;
        }

        .timeline-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .timeline-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            135deg,
            rgba(20, 184, 166, 0.6) 0%,
            rgba(6, 182, 212, 0.6) 100%
          );
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            135deg,
            rgba(20, 184, 166, 0.8) 0%,
            rgba(6, 182, 212, 0.8) 100%
          );
        }

        /* Firefox scrollbar */
        .timeline-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(20, 184, 166, 0.6) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default ActivityTimeline;
