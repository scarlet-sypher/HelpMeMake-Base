import React, { useState, useEffect } from "react";
import {
  Clock,
  Activity,
  Video,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SessionCard = ({ session }) => {
  const navigate = useNavigate();

  const learner = session.learnerId?.userId || session.learnerId;
  const sessionTitle = session.title;
  const sessionTopic = session.topic;

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

  const dateTime = formatDateTime(session.scheduledAt);

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
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleDetailsClick = () => {
    navigate("/mentor/sessions");
  };

  const handleVideoClick = () => {
    navigate("/mentor/sessions");
  };

  const handlePhoneClick = () => {
    navigate("/mentor/sessions");
  };

  const handleMessageClick = () => {
    navigate("/mentor/sessions");
  };

  return (
    <div className="group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-[1.02] hover:bg-white/15">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="relative flex-shrink-0">
              <img
                src={getAvatarUrl(learner?.avatar)}
                alt={learner?.name || "Learner"}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300"
              />

              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>

              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-cyan-200 transition-colors duration-200 truncate">
                    {learner?.name || "Unknown Learner"}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs text-yellow-300">4.8</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-cyan-200 mb-2 group-hover:text-cyan-100 transition-colors duration-200 line-clamp-2">
                {sessionTitle}
              </p>

              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <Calendar size={12} />
                  <span>{dateTime.date}</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <Clock size={12} />
                  <span>{dateTime.time}</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <MapPin size={12} />
                  <span>{session.duration || 60}min</span>
                </div>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
              session.status
            )} backdrop-blur-sm`}
          >
            {session.status}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-300">Ready to start</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleVideoClick}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn"
            >
              <Video
                size={16}
                className="group-hover/btn:scale-110 transition-transform duration-200"
              />
            </button>
            <button
              onClick={handlePhoneClick}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-200 group/btn"
            >
              <Phone
                size={16}
                className="group-hover/btn:scale-110 transition-transform duration-200"
              />
            </button>
            <button
              onClick={handleMessageClick}
              className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn"
            >
              <MessageCircle
                size={16}
                className="group-hover/btn:scale-110 transition-transform duration-200"
              />
            </button>
            <button
              onClick={handleDetailsClick}
              className="flex items-center space-x-1 text-xs text-cyan-300 hover:text-cyan-200 transition-colors duration-200 group/arrow"
            >
              <span>Details</span>
              <ChevronRight
                size={12}
                className="group-hover/arrow:translate-x-1 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
};

const UpcomingSessions = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveProject, setHasActiveProject] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${apiUrl}/api/sessions/mentor`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const { sessions, hasActiveProject: projectExists } = response.data;
          setHasActiveProject(projectExists);

          if (projectExists && sessions) {
            const upcomingStatuses = ["scheduled", "rescheduled", "ongoing"];
            const now = new Date();

            const filteredSessions = sessions
              .filter((session) => {
                const sessionDate = new Date(session.scheduledAt);
                return (
                  upcomingStatuses.includes(session.status) &&
                  sessionDate >= now
                );
              })
              .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
              .slice(0, 3);

            setUpcomingSessions(filteredSessions);
          } else {
            setUpcomingSessions([]);
          }
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions");
        setUpcomingSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-white/20 rounded w-48"></div>
            <div className="h-6 bg-white/20 rounded w-24"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    <div className="h-3 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="text-center">
          <div className="text-red-400 mb-2">
            <Activity size={24} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Error Loading Sessions
          </h3>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasActiveProject) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="mr-2 text-cyan-400" size={20} />
              Upcoming Sessions
            </h2>
            <div className="flex items-center space-x-2">
              <Activity className="text-cyan-400" size={20} />
              <span className="text-sm text-cyan-300 font-medium">
                No Active Project
              </span>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Project in Progress
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              You need an active project to schedule sessions with learners.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (upcomingSessions.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="mr-2 text-cyan-400" size={20} />
              Upcoming Sessions
            </h2>
            <div className="flex items-center space-x-2">
              <Activity className="text-cyan-400" size={20} />
              <span className="text-sm text-cyan-300 font-medium">
                Live Updates
              </span>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No Upcoming Sessions Yet
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Schedule your first session to start mentoring your learner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Clock className="mr-2 text-cyan-400" size={20} />
            Upcoming Sessions
          </h2>
          <div className="flex items-center space-x-2">
            <Activity className="text-cyan-400 animate-pulse" size={20} />
            <span className="text-sm text-cyan-300 font-medium">
              Live Updates
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;
