import React, { useState } from "react";
import {
  Edit,
  Trash2,
  User,
  Mail,
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const UserCard = ({ user, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = () => {
    onEdit(user._id);
  };
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation("");
  };

  const handleConfirmDelete = async () => {
    const expectedText = `I want to delete ${user.name || user.email}`;
    if (deleteConfirmation !== expectedText) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(user._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "mentor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAuthProviderIcon = (provider) => {
    switch (provider) {
      case "github":
        return <Github size={16} />;
      case "google":
        return <Mail size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Header with Avatar */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar || "/uploads/public/default.jpg"}
                alt={user.name || "User Avatar"}
                className="w-16 h-16 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/uploads/public/default.jpg";
                }}
              />
              <div className="absolute -bottom-1 -right-1">
                {user.isAccountActive ? (
                  <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
                )}
              </div>
            </div>
            <div className="flex-1 text-white">
              <h3 className="text-xl font-bold truncate">
                {user.name || "Unknown User"}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role || "No Role"}
                </span>
                <div className="flex items-center space-x-1 text-white/80">
                  {getAuthProviderIcon(user.authProvider)}
                  <span className="text-xs capitalize">
                    {user.authProvider}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <User size={16} />
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {user._id}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Mail size={16} />
              <span className="text-sm truncate">{user.email}</span>
              {user.isEmailVerified && (
                <CheckCircle size={16} className="text-green-500" />
              )}
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>

            {user.location && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>

          {/* Role-specific Info */}
          {user.title && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {user.title}
              </div>
              {user.description && (
                <div className="text-sm text-gray-600 line-clamp-2">
                  {user.description}
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks &&
            Object.values(user.socialLinks).some(
              (link) => link && link !== "#"
            ) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Social:
                </span>
                <div className="flex space-x-2">
                  {user.socialLinks.github &&
                    user.socialLinks.github !== "#" && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Github size={16} />
                      </a>
                    )}
                  {user.socialLinks.linkedin &&
                    user.socialLinks.linkedin !== "#" && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  {user.socialLinks.twitter &&
                    user.socialLinks.twitter !== "#" && (
                      <a
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Twitter size={16} />
                      </a>
                    )}
                </div>
              </div>
            )}

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                user.isEmailVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isEmailVerified ? "Email Verified" : "Email Unverified"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                user.isAccountActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isAccountActive ? "Active" : "Inactive"}
            </span>
            {user.isPasswordUpdated && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Password Updated
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">
                To confirm deletion, please type the following text exactly:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg mb-3">
                <code className="text-sm font-mono">
                  I want to delete {user.name || user.email}
                </code>
              </div>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Type the confirmation text..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={
                  deleteConfirmation !==
                    `I want to delete ${user.name || user.email}` || isDeleting
                }
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
