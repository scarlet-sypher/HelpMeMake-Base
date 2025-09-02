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
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "user":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
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
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative bg-gradient-to-r from-slate-700 to-slate-800 p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.jpg"}
                alt={user.name || "User Avatar"}
                className="w-16 h-16 rounded-full border-4 border-white object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.jpg";
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

        <div className="p-6 space-y-4 bg-gradient-to-br from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-700">
              <User size={16} />
              <span className="text-sm font-medium">ID:</span>
              <span className="font-mono bg-white/70 px-2 py-1 rounded text-xs border border-slate-200">
                {user._id}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Mail size={16} />
              <span className="text-sm truncate">{user.email}</span>
              {user.isEmailVerified && (
                <CheckCircle size={16} className="text-green-500" />
              )}
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Calendar size={16} />
              <span className="text-sm">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>

            {user.location && (
              <div className="flex items-center space-x-2 text-slate-700">
                <MapPin size={16} />
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>

          {user.title && (
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50">
              <div className="text-sm font-medium text-slate-900 mb-1">
                {user.title}
              </div>
              {user.description && (
                <div className="text-sm text-slate-600 line-clamp-2">
                  {user.description}
                </div>
              )}
            </div>
          )}

          {user.socialLinks &&
            Object.values(user.socialLinks).some(
              (link) => link && link !== "#"
            ) && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-800">
                  Social:
                </span>
                <div className="flex space-x-2">
                  {user.socialLinks.github &&
                    user.socialLinks.github !== "#" && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-slate-900"
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
                        className="text-slate-600 hover:text-slate-900"
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
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Twitter size={16} />
                      </a>
                    )}
                </div>
              </div>
            )}

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

        <div className="border-t border-slate-200/50 p-4 bg-gradient-to-r from-slate-100/80 to-blue-100/80 backdrop-blur-sm">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all border border-slate-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Delete User
                  </h3>
                  <p className="text-sm text-slate-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-700 mb-3">
                  To confirm deletion, please type the following text exactly:
                </p>
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-lg mb-3 border border-slate-200">
                  <code className="text-sm font-mono text-slate-800">
                    I want to delete {user.name || user.email}
                  </code>
                </div>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                  placeholder="Type the confirmation text..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-white/50 transition-colors backdrop-blur-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={
                    deleteConfirmation !==
                      `I want to delete ${user.name || user.email}` ||
                    isDeleting
                  }
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isDeleting ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
