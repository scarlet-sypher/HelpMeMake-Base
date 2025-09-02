import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Video,
  Edit3,
  Trash2,
  RotateCcw,
  Clock,
  Calendar,
  User,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  MapPin,
  Play,
  Pause,
  MessageSquare,
} from "lucide-react";

import EditSessionModal from "./EditSessionModal";
import RescheduleModal from "./RescheduleModal";
import CancelConfirmModal from "./CancelConfirmModal";

const SessionCard = ({
  session,
  onRefresh,
  isPastOnly,
  onEdit,
  onReschedule,
  onCancel,
  onToast,
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingLink, setRecordingLink] = useState(
    session.recordingLink || ""
  );
  const [showMentorReasonModal, setShowMentorReasonModal] = useState(false);
  const [mentorReason, setMentorReason] = useState("");

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <Clock size={14} />;
      case "ongoing":
        return <Play size={14} />;
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

  const handleJoinSession = async () => {
    if (!session.meetingLink) {
      onToast({
        message: "No meeting link provided for this session",
        status: "error",
      });
      return;
    }

    try {
      setActionLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${apiUrl}/api/sessions/mentor/${session._id}/attendance`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onToast({ message: "Joining session...", status: "success" });
      window.open(session.meetingLink, "_blank");
      onRefresh();
    } catch (error) {
      console.error("Error joining session:", error);
      onToast({ message: "Failed to join session", status: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const canJoinSession = () => {
    if (
      session.status !== "scheduled" &&
      session.status !== "rescheduled" &&
      session.status !== "ongoing"
    )
      return false;

    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const fiveMinutesBefore = new Date(sessionTime.getTime() - 5 * 60 * 1000);
    const tenMinutesAfter = new Date(sessionTime.getTime() + 10 * 60 * 1000);

    return now >= fiveMinutesBefore && now <= tenMinutesAfter;
  };

  const shouldShowJoinButton = () => {
    return (
      (session.status === "scheduled" ||
        session.status === "rescheduled" ||
        session.status === "ongoing") &&
      session.meetingLink
    );
  };

  const handleDeleteSession = async () => {
    if (!confirm("Are you sure you want to delete this session?")) return;

    try {
      setActionLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.delete(`${apiUrl}/api/sessions/mentor/${session._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      onRefresh();
      onToast({ message: "Session deleted successfully", status: "success" });
    } catch (error) {
      console.error("Error deleting session:", error);
      onToast({ message: "Failed to delete session", status: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const dateTime = formatDateTime(session.scheduledAt);
  const learner = session.learnerId?.userId || session.learnerId;
  const project = session.projectId;

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";
    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  const isUpcoming = () => {
    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const timeDiff = sessionTime - now;
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
  };

  const handleMentorReasonSubmit = async () => {
    if (!mentorReason.trim()) {
      onToast({
        message: "Please provide a reason for your absence",
        status: "error",
      });
      return;
    }

    try {
      setActionLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${apiUrl}/api/sessions/mentor/${session._id}/reason`,
        { reason: mentorReason.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onToast({ message: "Reason submitted successfully", status: "success" });

      setShowMentorReasonModal(false);
      setMentorReason("");
      onRefresh();
    } catch (error) {
      console.error("Error submitting mentor reason:", error);
      onToast({ message: "Failed to submit reason", status: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordingUpdate = async () => {
    try {
      setActionLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      await axios.patch(
        `${apiUrl}/api/sessions/mentor/${session._id}/recording`,
        { recordingLink: recordingLink.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onToast({
        message: "Recording link updated successfully",
        status: "success",
      });

      setShowRecordingModal(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating recording link:", error);
      onToast({ message: "Failed to update recording link", status: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const needsMentorReason = () => {
    return (
      session.status === "expired" &&
      !session.mentorReason &&
      !session.isMentorPresent
    );
  };

  return (
    <div
      className={`group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 ${
        isUpcoming() ? "ring-2 ring-cyan-500/50" : ""
      }`}
    >
      {/* Upcoming session indicator */}
      {isUpcoming() && (
        <div className="absolute -top-2 -right-2 px-2 sm:px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold rounded-full animate-pulse">
          <span className="hidden xs:inline">Starting Soon!</span>
          <span className="xs:hidden">Soon!</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* Learner Avatar */}
            <img
              src={getAvatarUrl(learner?.avatar)}
              alt={learner?.name || "Learner"}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20 shadow-lg flex-shrink-0"
            />

            {/* Session Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-1">
                {session.title}
              </h3>
              <p className="text-cyan-200 text-sm mb-2 line-clamp-1">
                {session.topic}
              </p>
              <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-1 xs:space-y-0 text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <User size={12} />
                  <span className="truncate">
                    {learner?.name || "Unknown Learner"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen size={12} />
                  <span className="truncate">
                    {project?.name || "Unknown Project"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm flex-shrink-0 ml-2 ${getStatusStyle(
              session.status
            )}`}
          >
            {getStatusIcon(session.status)}

            {/* Status text — visible on all screen sizes, truncated if too long */}
            <span className="capitalize truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
              {session.status}
            </span>
          </div>
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {session.description}
          </p>
        )}

        {/* Session Details */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar className="text-cyan-400 flex-shrink-0" size={14} />
            <div className="min-w-0">
              <div className="text-white font-medium text-sm truncate">
                {dateTime.date}
              </div>
              <div className="text-gray-400 text-xs">{dateTime.time}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-teal-400 flex-shrink-0" size={14} />
            <div className="min-w-0">
              <div className="text-white font-medium text-sm truncate">
                {session.sessionType}
              </div>
              <div className="text-gray-400 text-xs">Session Type</div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {session.prerequisites && (
          <div className="mb-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="text-amber-300 text-sm font-medium mb-1">
              Prerequisites:
            </div>
            <div className="text-amber-200 text-xs">
              {session.prerequisites}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between space-y-3 xs:space-y-0 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 w-full xs:w-auto">
            {/* Join Button */}
            {shouldShowJoinButton() && (
              <div className="relative group flex-1 xs:flex-initial">
                <button
                  onClick={handleJoinSession}
                  disabled={actionLoading || !canJoinSession()}
                  className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm w-full ${
                    actionLoading || !canJoinSession()
                      ? "bg-gray-400/30 text-gray-500 cursor-not-allowed border border-gray-400/40 opacity-60"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                  }`}
                >
                  <Video size={14} className="sm:w-4 sm:h-4" />
                  <span>Join</span>
                </button>

                {/* Custom Tooltip */}
                {(actionLoading || !canJoinSession()) && (
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    {actionLoading
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
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg font-medium transition-all border border-purple-500/30 text-sm flex-1 xs:flex-initial"
              >
                <Play size={14} className="sm:w-4 sm:h-4" />
                <span>Recording</span>
              </button>
            )}

            {/* Add Recording Button */}
            {session.status === "completed" && !session.recordingLink && (
              <button
                onClick={() => setShowRecordingModal(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg font-medium transition-all border border-blue-500/30 text-sm flex-1 xs:flex-initial"
              >
                <Play size={14} className="sm:w-4 sm:h-4" />
                <span>Add Recording</span>
              </button>
            )}

            {/* Update Recording Button */}
            {session.status === "completed" && session.recordingLink && (
              <button
                onClick={() => {
                  setRecordingLink(session.recordingLink);
                  setShowRecordingModal(true);
                }}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg font-medium transition-all border border-blue-500/30 text-sm flex-1 xs:flex-initial"
              >
                <Edit3 size={14} className="sm:w-4 sm:h-4" />
                <span>Edit Recording</span>
              </button>
            )}

            {/* Mentor Reason Button */}
            {needsMentorReason() && (
              <button
                onClick={() => setShowMentorReasonModal(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 text-sm flex-1 xs:flex-initial"
              >
                <MessageSquare size={14} className="sm:w-4 sm:h-4" />
                <span>Submit Reason</span>
              </button>
            )}
          </div>

          {/* Action Menu */}
          {!isPastOnly && (
            <div className="flex items-center space-x-2 w-full xs:w-auto justify-end">
              {/* Edit Button - Only for scheduled sessions */}
              {session.status === "scheduled" && (
                <button
                  onClick={() => onEdit(session)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-cyan-400 rounded-lg transition-all"
                  title="Edit Session"
                >
                  <Edit3 size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Reschedule Button */}
              {(session.status === "scheduled" ||
                session.status === "expired") && (
                <button
                  onClick={() => onReschedule(session)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-amber-400 rounded-lg transition-all"
                  title="Reschedule"
                >
                  <RotateCcw size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Cancel Button - Not available for ongoing sessions */}
              {(session.status === "scheduled" ||
                session.status === "rescheduled") && (
                <button
                  onClick={() => onCancel(session)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-red-400 rounded-lg transition-all"
                  title="Cancel Session"
                >
                  <XCircle size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}

              {/* Delete Button */}
              {(session.status === "cancelled" ||
                session.status === "expired") && (
                <button
                  onClick={handleDeleteSession}
                  disabled={actionLoading}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all disabled:opacity-50"
                  title="Delete Session"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Absence Reasons */}
        {session.status === "expired" && (
          <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            {session.mentorReason && (
              <div className="text-red-300 text-sm mb-1">
                <strong>Mentor Absent:</strong> {session.mentorReason}
              </div>
            )}
            {session.learnerReason && (
              <div className="text-red-300 text-sm mb-1">
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

        {/* Recording Link Modal */}
        {showRecordingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-2xl p-6 border border-white/20 max-w-md w-full shadow-2xl">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
                  <Play className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {session.recordingLink ? "Update" : "Add"} Recording Link
                </h3>
                <p className="text-gray-300 text-sm">
                  Provide a link to the session recording for the learner
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="url"
                    value={recordingLink}
                    onChange={(e) => setRecordingLink(e.target.value)}
                    placeholder="https://example.com/recording-link"
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowRecordingModal(false);
                      setRecordingLink(session.recordingLink || "");
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordingUpdate}
                    disabled={actionLoading || !recordingLink.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentor Reason Modal */}
        {showMentorReasonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-2xl p-6 border border-white/20 max-w-md w-full shadow-2xl">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-400/30">
                  <MessageSquare className="text-orange-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Why did you miss this session?
                </h3>
                <p className="text-gray-300 text-sm">
                  Please provide a reason for your absence
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={mentorReason}
                  onChange={(e) => setMentorReason(e.target.value)}
                  placeholder="Enter your reason for missing the session..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  maxLength={500}
                />

                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowMentorReasonModal(false);
                      setMentorReason("");
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMentorReasonSubmit}
                    disabled={actionLoading || !mentorReason.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                  >
                    {actionLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SessionList = ({ sessions, onRefresh, isPastOnly, onToast }) => {
  const [editingSession, setEditingSession] = useState(null);
  const [reschedulingSession, setReschedulingSession] = useState(null);
  const [cancellingSession, setCancellingSession] = useState(null);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">
          No Sessions Found
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto px-4">
          {isPastOnly
            ? "No session history available."
            : "Schedule your first session to get started with mentoring."}
        </p>
      </div>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.scheduledAt);
    const dateB = new Date(b.scheduledAt);
    const now = new Date();

    if (dateA > now && dateB > now) {
      return dateA - dateB;
    }

    if (dateA < now && dateB < now) {
      return dateB - dateA;
    }

    if (dateA > now && dateB < now) return -1;
    if (dateA < now && dateB > now) return 1;

    return dateA - dateB;
  });

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {sortedSessions.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            onRefresh={onRefresh}
            isPastOnly={isPastOnly}
            onEdit={(session) => setEditingSession(session)}
            onReschedule={(session) => setReschedulingSession(session)}
            onCancel={(session) => setCancellingSession(session)}
            onToast={onToast}
          />
        ))}
      </div>

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSuccess={() => {
            setEditingSession(null);
            onRefresh();
          }}
          onToast={onToast}
        />
      )}

      {/* Reschedule Modal */}
      {reschedulingSession && (
        <RescheduleModal
          session={reschedulingSession}
          onClose={() => setReschedulingSession(null)}
          onSuccess={() => {
            setReschedulingSession(null);
            onRefresh();
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingSession && (
        <CancelConfirmModal
          session={cancellingSession}
          onClose={() => setCancellingSession(null)}
          onSuccess={() => {
            setCancellingSession(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default SessionList;
