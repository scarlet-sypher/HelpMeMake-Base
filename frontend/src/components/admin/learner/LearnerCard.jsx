import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Trash2,
  User,
  Mail,
  MapPin,
  Calendar,
  Award,
  Target,
  Activity,
  Github,
  Linkedin,
  Twitter,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LearnerCard({ learner, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/learners/edit/${learner._id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setConfirmationText("");
  };

  const handleDeleteConfirm = async () => {
    const expectedText = `I want to delete ${learner.name || learner.email}`;

    if (confirmationText !== expectedText) {
      toast.error("Confirmation text does not match");
      return;
    }

    setIsDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners/${learner._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ confirmationText }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Learner deleted successfully");
        setShowDeleteModal(false);
        onDelete(learner._id);
      } else {
        toast.error(data.message || "Failed to delete learner");
      }
    } catch (error) {
      console.error("Delete learner error:", error);
      toast.error("Failed to delete learner");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level) => {
    if (level >= 10) return "text-purple-400";
    if (level >= 5) return "text-blue-400";
    if (level >= 2) return "text-green-400";
    return "text-gray-400";
  };

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={learner.avatar || "/uploads/public/default.jpg"}
            alt={learner.name || "Learner"}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {learner.name || "No Name"}
            </h3>
            <div className="flex items-center text-sm text-slate-400 mb-1">
              <Mail size={14} className="mr-1" />
              <span className="truncate">{learner.email}</span>
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <User size={14} className="mr-1" />
              <span>ID: {learner._id}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Edit Learner"
            >
              <Edit3 size={16} className="text-white" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              title="Delete Learner"
            >
              <Trash2 size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Learner Details */}
        {learner.learnerDetails && (
          <div className="space-y-3">
            {/* Title and Description */}
            <div>
              <div className="text-sm text-slate-300 font-medium">
                {learner.learnerDetails.title}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                {learner.learnerDetails.description}
              </div>
            </div>

            {/* Location */}
            {learner.learnerDetails.location && (
              <div className="flex items-center text-sm text-slate-400">
                <MapPin size={14} className="mr-1" />
                <span>{learner.learnerDetails.location}</span>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <Award
                  size={16}
                  className={getLevelColor(learner.learnerDetails.level)}
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    Level {learner.learnerDetails.level}
                  </div>
                  <div className="text-xs text-slate-400">
                    {learner.learnerDetails.xp} XP
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {learner.learnerDetails.streakDays}
                  </div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Activity size={16} className="text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">
                    {learner.learnerDetails.completedSessions}
                  </div>
                  <div className="text-xs text-slate-400">Sessions</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    learner.learnerDetails.isOnline
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    {learner.learnerDetails.isOnline ? "Online" : "Offline"}
                  </div>
                  <div className="text-xs text-slate-400">Status</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {learner.learnerDetails.socialLinks && (
              <div className="flex space-x-3 pt-2">
                {learner.learnerDetails.socialLinks.github &&
                  learner.learnerDetails.socialLinks.github !== "#" && (
                    <a
                      href={learner.learnerDetails.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Github size={16} />
                    </a>
                  )}
                {learner.learnerDetails.socialLinks.linkedin &&
                  learner.learnerDetails.socialLinks.linkedin !== "#" && (
                    <a
                      href={learner.learnerDetails.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                {learner.learnerDetails.socialLinks.twitter &&
                  learner.learnerDetails.socialLinks.twitter !== "#" && (
                    <a
                      href={learner.learnerDetails.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Join Date */}
        <div className="mt-4 pt-3 border-t border-slate-600/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>Joined {formatDate(learner.createdAt)}</span>
            </div>
            <div className="px-2 py-1 bg-slate-700/50 rounded text-xs">
              {learner.authProvider || "local"}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Delete Learner</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 mb-4">
                This action cannot be undone. This will permanently delete the
                learner account and all associated data.
              </p>

              <p className="text-sm text-slate-400 mb-3">
                To confirm, type the following text exactly:
              </p>

              <p className="text-sm font-mono bg-slate-700/50 p-2 rounded border text-white mb-3">
                I want to delete {learner.name || learner.email}
              </p>

              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type confirmation text here..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={
                  isDeleting ||
                  confirmationText !==
                    `I want to delete ${learner.name || learner.email}`
                }
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Learner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
