import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ExternalLink,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  Users,
} from "lucide-react";

const SessionsCard = ({ session, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      ongoing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      expired: "bg-gray-100 text-gray-800 border-gray-200",
      rescheduled: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      scheduled: <Calendar size={16} />,
      completed: <CheckCircle size={16} />,
      ongoing: <Play size={16} />,
      cancelled: <XCircle size={16} />,
      expired: <AlertCircle size={16} />,
      rescheduled: <Clock size={16} />,
    };
    return icons[status] || <AlertCircle size={16} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const expectedDeleteText = `I want to delete session of ${session.project.name}`;
  const canDelete = deleteConfirmText === expectedDeleteText;

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(session._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openLink = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const defaultLearnerAvatar = "/uploads/public/default.jpg";
  const defaultMentorAvatar = "/uploads/public/default.jpg";
  const defaultProjectThumbnail = "/uploads/public/default-project.jpg";

  const getLearnerAvatarUrl = (avatar) => {
    if (!avatar) return defaultLearnerAvatar;
    if (avatar.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  const getMentorAvatarUrl = (avatar) => {
    if (!avatar) return defaultMentorAvatar;
    if (avatar.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  const getProjectThumbnailUrl = (thumbnail) => {
    if (!thumbnail) return defaultProjectThumbnail;
    if (thumbnail.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${thumbnail}`;
    }
    return thumbnail;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {session.title}
            </h3>
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                session.status
              )}`}
            >
              {getStatusIcon(session.status)}
              {session.status.toUpperCase()}
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Session"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Project Info */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <img
              src={getProjectThumbnailUrl(session.project?.thumbnail)}
              alt={session.project?.name || "Project"}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProjectThumbnail;
              }}
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {session.project.name}
              </h4>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-white px-2 py-1 rounded text-blue-600 font-medium">
                  {session.project.category}
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded text-green-600 font-medium">
                  {session.project.difficultyLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentor & Learner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Mentor */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <img
                src={getMentorAvatarUrl(session.mentor?.avatar)}
                alt={session.mentor?.name || "Mentor"}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultMentorAvatar;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.mentor.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {session.mentor.email}
                </p>
                <p className="text-xs text-purple-600 font-medium">Mentor</p>
              </div>
            </div>
          </div>

          {/* Learner */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-3">
              <img
                src={getLearnerAvatarUrl(session.learner?.avatar)}
                alt={session.learner?.name || "Learner"}
                className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultLearnerAvatar;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session.learner.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {session.learner.email}
                </p>
                <p className="text-xs text-green-600 font-medium">Learner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen size={16} className="text-gray-500" />
            <span className="font-medium">Topic:</span>
            <span className="text-gray-700">
              {truncateText(session.topic, 50)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-gray-500" />
            <span className="font-medium">Scheduled:</span>
            <span className="text-gray-700">
              {formatDate(session.scheduledAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gray-500" />
            <span className="font-medium">Duration:</span>
            <span className="text-gray-700">{session.duration} minutes</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-gray-500" />
            <span className="font-medium">Type:</span>
            <span className="text-gray-700">
              {session.sessionType.replace("-", " ")}
            </span>
          </div>

          {session.description && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Description:</span>
              <p className="text-gray-600 mt-1">
                {truncateText(session.description, 120)}
              </p>
            </div>
          )}
        </div>

        {/* Attendance Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div
            className={`p-2 rounded-lg text-center text-sm ${
              session.isMentorPresent
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            <div className="font-medium">Mentor</div>
            <div className="text-xs">
              {session.isMentorPresent ? "Present" : "Not Present"}
            </div>
          </div>
          <div
            className={`p-2 rounded-lg text-center text-sm ${
              session.isLearnerPresent
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-600 border border-gray-200"
            }`}
          >
            <div className="font-medium">Learner</div>
            <div className="text-xs">
              {session.isLearnerPresent ? "Present" : "Not Present"}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-2 flex-wrap">
          {session.meetingLink && (
            <button
              onClick={() => openLink(session.meetingLink)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              <ExternalLink size={14} />
              Meeting Link
            </button>
          )}
          {session.recordingLink && (
            <button
              onClick={() => openLink(session.recordingLink)}
              className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              <ExternalLink size={14} />
              Recording
            </button>
          )}
        </div>

        {/* Reasons (if any) */}
        {(session.learnerReason ||
          session.mentorReason ||
          session.expireReason) && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h5 className="text-sm font-medium text-amber-800 mb-2">
              Additional Notes:
            </h5>
            {session.expireReason && (
              <p className="text-xs text-amber-700 mb-1">
                <span className="font-medium">Expire Reason:</span>{" "}
                {session.expireReason}
              </p>
            )}
            {session.learnerReason && (
              <p className="text-xs text-amber-700 mb-1">
                <span className="font-medium">Learner Note:</span>{" "}
                {session.learnerReason}
              </p>
            )}
            {session.mentorReason && (
              <p className="text-xs text-amber-700">
                <span className="font-medium">Mentor Note:</span>{" "}
                {session.mentorReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-red-600 mb-4">
              Delete Session
            </h3>
            <p className="text-gray-700 mb-4">
              This action cannot be undone. Please type the following text to
              confirm:
            </p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-4 break-all">
              {expectedDeleteText}
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type the confirmation text..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={!canDelete || isDeleting}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  canDelete && !isDeleting
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionsCard;
