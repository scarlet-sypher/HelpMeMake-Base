import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  User,
  GraduationCap,
  Calendar,
  IndianRupee,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const expectedText = `I want to delete ${project.name}`;
    if (deleteConfirmation !== expectedText) {
      toast.error("Please type the exact confirmation text");
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(project._id);
      setShowDeleteModal(false);
      setDeleteConfirmation("");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const defaultLearnerAvatar = "/uploads/public/default.jpg";
  const defaultMentorAvatar = "/uploads/public/default.jpg";
  const defaultProjectThumbnail = "/uploads/public/default-project.jpg";

  // Utility functions
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
        {/* Project Thumbnail */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
          {project.thumbnail ? (
            <img
              src={getProjectThumbnailUrl(project?.thumbnail)}
              alt={project?.name || "Project"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProjectThumbnail;
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Tag className="text-white" size={48} />
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          {/* Project Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {truncateText(project.name, 50)}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              ID: {project.projectId}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {truncateText(project.shortDescription, 120)}
            </p>
          </div>

          {/* Project Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="text-sm font-medium text-gray-900">
                {project.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Difficulty:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  project.difficultyLevel
                )}`}
              >
                {project.difficultyLevel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Budget:</span>
              <div className="flex items-center text-sm font-medium text-green-600">
                <IndianRupee size={14} className="mr-1" />
                {project.openingPrice?.toLocaleString() || "N/A"}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Duration:</span>
              <span className="text-sm font-medium text-gray-900">
                {project.duration || "N/A"}
              </span>
            </div>
          </div>

          {/* Learner & Mentor Info */}
          <div className="space-y-3 mb-4 bg-gray-50 p-3 rounded-lg">
            {/* Learner */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Learner</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {project.learner?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {project.learner?.email || "No email"}
                </p>
              </div>
              {project.learner?.avatar && (
                <img
                  src={getLearnerAvatarUrl(project?.learner?.avatar)}
                  alt={project?.learner?.name || "Learner"}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultLearnerAvatar;
                  }}
                />
              )}
            </div>

            {/* Mentor */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <User size={16} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Mentor</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {project.mentor?.name || "Not Assigned"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {project.mentor?.email || "No mentor assigned"}
                </p>
              </div>
              {project.mentor?.avatar && (
                <img
                  src={getMentorAvatarUrl(project?.mentor?.avatar)}
                  alt={project?.mentor?.name || "Mentor"}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultMentorAvatar;
                  }}
                />
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-gray-500 mb-4 space-y-1">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              Created: {new Date(project.createdAt).toLocaleDateString()}
            </div>
            {project.startDate && (
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                Started: {new Date(project.startDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onView(project._id)} // Make sure this passes project._id, not project
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Eye size={16} className="mr-1" />
              View
            </button>
            <button
              onClick={() => onEdit(project)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Project
              </h3>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete the
                project "{project.name}" and all associated data.
              </p>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type the following to confirm:
                  <span className="block font-mono text-red-600 bg-red-50 p-2 rounded mt-1">
                    I want to delete {project.name}
                  </span>
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Type confirmation text here..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={
                  deleteConfirmation !== `I want to delete ${project.name}` ||
                  isDeleting
                }
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
