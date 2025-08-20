import React, { useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ExternalLink,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Video,
  FileText,
  Timer,
  Zap,
  Send,
  MapPin,
} from "lucide-react";

const UserSessionItem = ({ session, isLast, onSessionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonSubmitting, setReasonSubmitting] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      full: date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "ongoing":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "completed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "rescheduled":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "expired":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <Clock size={14} />;
      case "ongoing":
        return <PlayCircle size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      case "rescheduled":
        return <RotateCcw size={14} />;
      case "expired":
        return <AlertTriangle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const canJoinSession = () => {
    if (session.status !== "scheduled" && session.status !== "ongoing")
      return false;

    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const fiveMinutesBefore = new Date(sessionTime.getTime() - 5 * 60 * 1000);
    const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

    return now >= fiveMinutesBefore && now <= tenMinutesAfter;
  };

  const shouldShowJoinButton = () => {
    return session.status === "scheduled" || session.status === "ongoing";
  };

  const needsAbsenceReason = () => {
    return (
      session.status === "expired" &&
      !session.learnerReason &&
      !session.isLearnerPresent
    );
  };

  const handleJoinSession = async () => {
    if (!canJoinSession()) return;

    try {
      setLoading(true);

      if (session.meetingLink) {
        window.open(session.meetingLink, "_blank");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${apiUrl}/api/sessions/${session._id}/user-attendance`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onSessionUpdate) {
        onSessionUpdate();
      }
    } catch (error) {
      console.error("Error joining session:", error);
      alert(error.response?.data?.message || "Failed to join session");
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSubmit = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for your absence");
      return;
    }

    try {
      setReasonSubmitting(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${apiUrl}/api/sessions/${session._id}/user-reason`,
        { reason: reason.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowReasonBox(false);
      setReason("");

      if (onSessionUpdate) {
        onSessionUpdate();
      }
    } catch (error) {
      console.error("Error submitting reason:", error);
      alert(error.response?.data?.message || "Failed to submit reason");
    } finally {
      setReasonSubmitting(false);
    }
  };

  const isSessionSoon = () => {
    if (session.status !== "scheduled" && session.status !== "ongoing")
      return false;

    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const thirtyMinutesBefore = new Date(
      sessionTime.getTime() - 30 * 60 * 1000
    );

    return now >= thirtyMinutesBefore && now <= sessionTime;
  };

  // Get avatar URL for mentor
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";
    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  const dateTime = formatDateTime(session.scheduledAt);
  const mentor = session.mentorId?.userId || session.mentorId;

  return (
    <div className={`relative ${!isLast ? "pb-4" : ""}`}>
      <div
        className={`group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 ${
          isSessionSoon() ? "ring-2 ring-cyan-500/50" : ""
        } z-10`}
      >
        {/* Upcoming session indicator */}
        {isSessionSoon() && (
          <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold rounded-full animate-pulse">
            <div className="flex items-center space-x-1">
              <Zap size={10} />
              <span>Starting Soon!</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
              {/* Mentor Avatar */}
              <img
                src={getAvatarUrl(mentor?.avatar)}
                alt={mentor?.name || "Mentor"}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
              />

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                  {session.title}
                </h3>
                <p className="text-cyan-200 text-sm mb-2 line-clamp-1">
                  {session.topic}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-300">
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{mentor?.name || "Unknown Mentor"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen size={12} />
                    <span>{session.sessionType || "one-on-one"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusStyle(
                session.status
              )}`}
            >
              {getStatusIcon(session.status)}
              <span className="capitalize">{session.status}</span>
            </div>
          </div>

          {/* Description */}
          {session.description && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Session Details */}
            <div className="space-y-4">
              {/* Session Details */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-cyan-400" size={16} />
                    <div>
                      <div className="text-white font-medium">
                        {dateTime.date}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {dateTime.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="text-teal-400" size={16} />
                    <div>
                      <div className="text-white font-medium">
                        {session.duration || 60} min
                      </div>
                      <div className="text-gray-400 text-xs">Duration</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {session.prerequisites && (
                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="text-amber-300 text-sm font-medium mb-1">
                    Prerequisites:
                  </div>
                  <div className="text-amber-200 text-xs">
                    {session.prerequisites}
                  </div>
                </div>
              )}

              {/* Submitted reason display */}
              {session.learnerReason && (
                <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="text-orange-300 text-sm font-medium mb-1">
                    Your Reason:
                  </div>
                  <div className="text-orange-200 text-xs">
                    {session.learnerReason}
                  </div>
                </div>
              )}

              {/* Absence Reasons */}
              {session.status === "expired" && (
                <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  {session.mentorReason && (
                    <div className="text-red-300 text-sm mb-2">
                      <strong>Mentor Absent:</strong> {session.mentorReason}
                    </div>
                  )}
                  {session.learnerReason && (
                    <div className="text-red-300 text-sm">
                      <strong>Learner Absent:</strong> {session.learnerReason}
                    </div>
                  )}
                  {session.expireReason &&
                    !session.mentorReason &&
                    !session.learnerReason && (
                      <div className="text-red-300 text-sm">
                        <strong>Reason:</strong> {session.expireReason}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Join Session Button */}
                {shouldShowJoinButton() && (
                  <div className="relative group w-full flex justify-center">
                    <button
                      onClick={handleJoinSession}
                      disabled={loading || !canJoinSession()}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all transform ${
                        loading || !canJoinSession()
                          ? "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105"
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <PlayCircle size={18} />
                          <span>{loading ? "Joining..." : "Join Session"}</span>
                          <ExternalLink size={14} />
                        </>
                      )}
                    </button>

                    {/* Tooltip */}
                    {(loading || !canJoinSession()) && (
                      <span className="absolute -top-10 px-3 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                        {loading
                          ? "Joining session..."
                          : "Join is available only 5 minutes before the session"}
                      </span>
                    )}
                  </div>
                )}

                {/* Recording Button */}
                {session.status === "completed" && session.recordingLink && (
                  <button
                    onClick={() => window.open(session.recordingLink, "_blank")}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg font-medium transition-all border border-purple-500/30"
                  >
                    <Video size={18} />
                    <span>View Recording</span>
                    <ExternalLink size={14} />
                  </button>
                )}

                {/* Reason Button */}
                {needsAbsenceReason() && (
                  <button
                    onClick={() => setShowReasonBox(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
                  >
                    <MessageSquare size={18} />
                    <span>Submit Reason</span>
                  </button>
                )}
              </div>

              {/* Attendance Status */}
              <div className="flex flex-col space-y-2">
                {session.status === "completed" && (
                  <div className="flex items-center space-x-2 text-green-300 bg-green-500/10 px-3 py-2 rounded-lg border border-green-400/20">
                    <CheckCircle size={16} />
                    <span className="font-medium">Attended</span>
                  </div>
                )}
                {session.status === "expired" && !session.isLearnerPresent && (
                  <div className="flex items-center space-x-2 text-red-300 bg-red-500/10 px-3 py-2 rounded-lg border border-red-400/20">
                    <XCircle size={16} />
                    <span className="font-medium">Missed</span>
                  </div>
                )}
                {session.isLearnerPresent && session.status !== "completed" && (
                  <div className="flex items-center space-x-2 text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg border border-blue-400/20">
                    <Clock size={16} />
                    <span className="font-medium">Joined</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reason Submission Modal */}
        {showReasonBox && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-2xl p-6 border border-white/20 max-w-md w-full shadow-2xl relative overflow-hidden animate-scale-in">
              {/* Modal background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 rounded-2xl"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-400/30">
                    <MessageSquare className="text-orange-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent mb-2">
                    Why did you miss this session?
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Please provide a reason for your absence to help improve
                    future scheduling.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter your reason for missing the session..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-sm"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    <span
                      className={reason.length > 450 ? "text-orange-400" : ""}
                    >
                      {reason.length}/500 characters
                    </span>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setShowReasonBox(false);
                        setReason("");
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReasonSubmit}
                      disabled={reasonSubmitting || !reason.trim()}
                      className="group relative px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center space-x-1.5">
                        {reasonSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send
                            className="group-hover:translate-x-0.5 transition-transform duration-300"
                            size={14}
                          />
                        )}
                        <span>
                          {reasonSubmitting ? "Submitting..." : "Submit"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default UserSessionItem;
