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

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Learner&background=0D8ABC&color=fff";

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

  const getAvatarUrl = () => {
    if (!learner?.avatar) return defaultAvatar;
    if (learner.avatar.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${learner.avatar}`;
    }
    return learner.avatar;
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
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50 w-full flex flex-col min-h-[400px]">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={getAvatarUrl()}
            alt={learner?.name || "Learner Avatar"}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover mb-3"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
          />

          <h3 className="text-lg font-semibold text-white mb-2">
            {learner.name || "No Name"}
          </h3>

          <div className="flex items-center text-sm text-slate-400 mb-1">
            <Mail size={14} className="mr-1" />
            <span className="truncate max-w-[200px]">{learner.email}</span>
          </div>

          <div className="flex items-center text-xs text-slate-500">
            <User size={12} className="mr-1" />
            <span>ID: {learner._id}</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {learner.learnerDetails && (
            <>
              <div className="text-center">
                <div className="text-sm text-slate-300 font-medium mb-1">
                  {learner.learnerDetails.title}
                </div>
                {learner.learnerDetails.description && (
                  <div className="text-xs text-slate-400 line-clamp-2 max-w-full">
                    {learner.learnerDetails.description}
                  </div>
                )}
              </div>

              {learner.learnerDetails.location && (
                <div className="flex items-center justify-center text-sm text-slate-400">
                  <MapPin size={14} className="mr-1" />
                  <span>{learner.learnerDetails.location}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-2 bg-slate-700/30 rounded-lg">
                  <Award
                    size={16}
                    className={getLevelColor(learner.learnerDetails.level)}
                  />
                  <div className="text-sm font-medium text-white mt-1">
                    Level {learner.learnerDetails.level}
                  </div>
                  <div className="text-xs text-slate-400">
                    {learner.learnerDetails.xp} XP
                  </div>
                </div>

                <div className="flex flex-col items-center p-2 bg-slate-700/30 rounded-lg">
                  <Target size={16} className="text-green-400" />
                  <div className="text-sm font-medium text-white mt-1">
                    {learner.learnerDetails.streakDays}
                  </div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>

                <div className="flex flex-col items-center p-2 bg-slate-700/30 rounded-lg">
                  <Activity size={16} className="text-blue-400" />
                  <div className="text-sm font-medium text-white mt-1">
                    {learner.learnerDetails.completedSessions}
                  </div>
                  <div className="text-xs text-slate-400">Sessions</div>
                </div>

                <div className="flex flex-col items-center p-2 bg-slate-700/30 rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      learner.learnerDetails.isOnline
                        ? "bg-green-400"
                        : "bg-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium text-white mt-1">
                    {learner.learnerDetails.isOnline ? "Online" : "Offline"}
                  </div>
                  <div className="text-xs text-slate-400">Status</div>
                </div>
              </div>

              {learner.learnerDetails.socialLinks && (
                <div className="flex justify-center space-x-4 pt-2">
                  {learner.learnerDetails.socialLinks.github &&
                    learner.learnerDetails.socialLinks.github !== "#" && (
                      <a
                        href={learner.learnerDetails.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all"
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
                        className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all"
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
                        className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all"
                      >
                        <Twitter size={16} />
                      </a>
                    )}
                </div>
              )}
            </>
          )}

          <div className="pt-3 border-t border-slate-600/50">
            <div className="flex flex-col items-center space-y-2 text-xs text-slate-400">
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                <span>Joined {formatDate(learner.createdAt)}</span>
              </div>
              <div className="px-3 py-1 bg-slate-700/50 rounded-full text-xs">
                {learner.authProvider || "local"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-600/50">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
            title="Edit Learner"
          >
            <Edit3 size={16} className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
            title="Delete Learner"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

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

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
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
