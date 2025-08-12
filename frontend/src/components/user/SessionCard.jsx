import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MessageCircle,
  Clock,
  Calendar,
  Video,
  Phone,
  MapPin,
  Star,
  ChevronRight,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const SessionCard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${apiUrl}/api/sessions/learner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const sessionsData = response.data.sessions || [];

        // Ensure we only get unique sessions by ID
        const uniqueSessions = sessionsData.filter(
          (session, index, self) =>
            index === self.findIndex((s) => s._id === session._id)
        );

        setSessions(uniqueSessions);
        setHasActiveProject(response.data.hasActiveProject || false);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.response?.data?.message || "Failed to fetch sessions");
      setSessions([]); // Clear sessions on error
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";
    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "rescheduled":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "ongoing":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleViewDetails = () => {
    navigate("/user/sessions");
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <div className="animate-pulse">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded w-full"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-red-400" size={20} />
          <div>
            <h3 className="text-red-300 font-medium">Error Loading Sessions</h3>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveProject) {
    return (
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <div className="text-center py-8">
          <BookOpen className="mx-auto text-gray-400 mb-3" size={32} />
          <h3 className="text-white font-medium mb-2">
            No Project in Progress
          </h3>
          <p className="text-gray-400 text-sm">
            Start a project with a mentor to schedule sessions
          </p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-3" size={32} />
          <h3 className="text-white font-medium mb-2">No Upcoming Sessions</h3>
          <p className="text-gray-400 text-sm">
            Your mentor will schedule sessions as your project progresses
          </p>
        </div>
      </div>
    );
  }

  // Only take the first 3 sessions and ensure they're unique
  const displaySessions = sessions.slice(0, 3);

  return (
    <div className="space-y-4">
      {displaySessions.map((session) => {
        const dateTime = formatDateTime(session.scheduledAt);
        const mentor = session.mentorId?.userId || session.mentorId;

        return (
          <div
            key={session._id} // Make sure this is unique
            className="group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] hover:bg-white/15"
          >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Mobile-first layout: Stack vertically on small screens */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                {/* Top section - Mentor info and status */}
                <div className="flex items-start justify-between sm:flex-1">
                  {/* Left side - Mentor info */}
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    {/* Mentor image with glow */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={getAvatarUrl(mentor?.avatar)}
                        alt={mentor?.name || "Mentor"}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300"
                      />
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>
                      {/* Subtle glow around image */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Session details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between sm:items-center sm:space-x-2 mb-1">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-blue-200 transition-colors duration-200 truncate">
                            {mentor?.name || "Unknown Mentor"}
                          </h3>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Star
                              size={12}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="text-xs text-yellow-300">
                              {session.mentorId?.rating || "5.0"}
                            </span>
                          </div>
                        </div>

                        {/* Status badge - moved to top right on mobile */}
                        <span
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                            session.status
                          )} backdrop-blur-sm flex-shrink-0 sm:hidden capitalize`}
                        >
                          {session.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-blue-200 mb-2 sm:mb-3 group-hover:text-blue-100 transition-colors duration-200 line-clamp-2">
                        {session.title}
                      </p>

                      {/* Session metadata - responsive grid */}
                      <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:space-x-4 sm:gap-0 text-xs">
                        <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                          <Calendar size={12} className="flex-shrink-0" />
                          <span className="truncate">{dateTime.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                          <Clock size={12} className="flex-shrink-0" />
                          <span className="truncate">{dateTime.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                          <MapPin size={12} className="flex-shrink-0" />
                          <span className="truncate">
                            {session.duration || 60} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Status and actions for larger screens */}
                <div className="hidden sm:flex sm:flex-col sm:items-end sm:space-y-3 sm:ml-4">
                  {/* Status badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                      session.status
                    )} backdrop-blur-sm capitalize`}
                  >
                    {session.status}
                  </span>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn"
                    >
                      <Video
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 group/btn"
                    >
                      <Phone
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn"
                    >
                      <MessageCircle
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Session actions bar */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center justify-between sm:justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-300">
                      {session.status === "scheduled"
                        ? "Ready to join"
                        : session.status === "ongoing"
                        ? "Session ongoing"
                        : "Rescheduled"}
                    </span>
                  </div>

                  <button
                    onClick={handleViewDetails}
                    className="flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 group/arrow sm:hidden"
                  >
                    <span>View Details</span>
                    <ChevronRight
                      size={12}
                      className="group-hover/arrow:translate-x-1 transition-transform duration-200"
                    />
                  </button>
                </div>

                {/* Mobile action buttons */}
                <div className="flex items-center justify-between sm:hidden">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn"
                    >
                      <Video
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 group/btn"
                    >
                      <Phone
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={handleViewDetails}
                      className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn"
                    >
                      <MessageCircle
                        size={16}
                        className="group-hover/btn:scale-110 transition-transform duration-200"
                      />
                    </button>
                  </div>
                </div>

                {/* Desktop view details button */}
                <button
                  onClick={handleViewDetails}
                  className="hidden sm:flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 group/arrow"
                >
                  <span>View Details</span>
                  <ChevronRight
                    size={12}
                    className="group-hover/arrow:translate-x-1 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>

            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionCard;
