import React, { useState, useEffect } from "react";
import {
  Edit,
  Eye,
  Trash2,
  Clock,
  Tag,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  XCircle,
  Code,
  Star,
  Calendar,
  Image,
  MapPin,
  MessageSquare,
} from "lucide-react";

const ShortProjectCard = ({ project, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isProjectRestricted = () => {
    const restrictedStatuses = ["In Progress", "Completed", "Cancelled"];
    return restrictedStatuses.includes(project.status);
  };

  const showToast = (message, type = "info") => {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-300 transform translate-x-full ${
      type === "error"
        ? "bg-gradient-to-r from-red-500 to-pink-500"
        : "bg-gradient-to-r from-blue-500 to-cyan-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  // Handle edit project
  const handleEditProject = () => {
    if (isProjectRestricted()) {
      showToast(
        "Can't edit in-progress project manually. Please visit My Mentor page",
        "error"
      );
      return;
    }
    window.location.href = `/projects/edit/${project._id}`;
  };

  // Handle delete project
  const handleDeleteProject = () => {
    if (isProjectRestricted()) {
      showToast(
        "Can't delete in-progress project manually. Please visit My Mentor page",
        "error"
      );
      return;
    }
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const images = document.querySelectorAll(`[alt="${project.name}"]`);

    const handleError = (e) => {
      const fallback = document.getElementById(`fallback-${project._id}`);
      if (fallback) fallback.style.opacity = "1";
    };

    const handleLoad = (e) => {
      const fallback = document.getElementById(`fallback-${project._id}`);
      if (fallback) fallback.style.opacity = "0";
    };

    images.forEach((img) => {
      img.addEventListener("error", handleError);
      img.addEventListener("load", handleLoad);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("error", handleError);
        img.removeEventListener("load", handleLoad);
      });
    };
  }, [project._id, project.name]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "Open":
        return {
          color: "from-blue-500 to-cyan-500",
          textColor: "text-blue-300",
          bgColor: "bg-blue-500/20",
          icon: PlayCircle,
        };
      case "In Progress":
        return {
          color: "from-orange-500 to-yellow-500",
          textColor: "text-orange-300",
          bgColor: "bg-orange-500/20",
          icon: TrendingUp,
        };
      case "Completed":
        return {
          color: "from-emerald-500 to-teal-500",
          textColor: "text-emerald-300",
          bgColor: "bg-emerald-500/20",
          icon: CheckCircle,
        };
      case "Cancelled":
        return {
          color: "from-red-500 to-pink-500",
          textColor: "text-red-300",
          bgColor: "bg-red-500/20",
          icon: XCircle,
        };
      default:
        return {
          color: "from-gray-500 to-slate-500",
          textColor: "text-gray-300",
          bgColor: "bg-gray-500/20",
          icon: AlertCircle,
        };
    }
  };

  // Get difficulty color
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "text-green-300 bg-green-500/20";
      case "Intermediate":
        return "text-yellow-300 bg-yellow-500/20";
      case "Advanced":
        return "text-red-300 bg-red-500/20";
      default:
        return "text-gray-300 bg-gray-500/20";
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  // Get active price (priority: closed > negotiated > opening)
  const getActivePrice = () => {
    if (project.closedPrice)
      return { price: project.closedPrice, type: "Final Price" };
    if (project.negotiatedPrice)
      return { price: project.negotiatedPrice, type: "Negotiated" };
    return { price: project.openingPrice, type: "Opening Price" };
  };

  const statusInfo = getStatusInfo(project.status);
  const StatusIcon = statusInfo.icon;
  const activePrice = getActivePrice();

  // Handle view project - mark pitches as read
  const handleViewProject = async () => {
    try {
      // If there are unread pitches, mark them as read
      if (project.hasUnreadPitch) {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${apiUrl}/projects/${project._id}/pitches/mark-read`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          console.log("Pitches marked as read successfully");
        } else {
          console.error("Failed to mark pitches as read");
        }
      }

      // Navigate to project details
      window.location.href = `/projects/${project._id}`;
    } catch (error) {
      console.error("Error marking pitches as read:", error);
      // Still navigate even if marking as read fails
      window.location.href = `/projects/${project._id}`;
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (deleteConfirmText !== project.name) {
      alert("Project name does not match. Please type the exact project name.");
      return;
    }

    setIsDeleting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/projects/${project._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Project deleted successfully!", "success");
        if (onDelete) {
          onDelete(project._id);
        }
        setShowDeleteModal(false);
      } else {
        showToast(
          data.message || "Failed to delete project. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast("Failed to delete project. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Project Card */}
      <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] z-0">
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Project Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              project.thumbnail ||
              `${
                import.meta.env.VITE_API_URL
              }/uploads/public/default-project.jpg`
            }
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = `${
                import.meta.env.VITE_API_URL
              }/uploads/public/default-project.jpg`;
            }}
          />

          {/* Status Badge */}
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full ${statusInfo.bgColor} backdrop-blur-sm border border-white/20 flex items-center space-x-2`}
          >
            <StatusIcon size={14} className={statusInfo.textColor} />
            <span className={`text-sm font-medium ${statusInfo.textColor}`}>
              {project.status}
            </span>
          </div>

          {/* Pitch Notification Dot */}
          {project.hasUnreadPitch && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 py-1 border border-green-400/30">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full relative"></div>
              </div>
              <MessageSquare size={12} className="text-green-400" />
              <span className="text-xs text-green-300 font-medium">New</span>
            </div>
          )}

          {/* Featured Badge */}
          {project.isFeatured && (
            <div className="absolute top-4 right-4 p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Star size={14} className="text-white" />
            </div>
          )}

          {/* Image Loading Fallback */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center opacity-0 transition-opacity duration-300"
            id={`fallback-${project._id}`}
          >
            <div className="text-center">
              <Image className="text-white/50 mx-auto mb-2" size={32} />
              <p className="text-white/70 text-sm">No Image</p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 p-6">
          {/* Project Name */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {project.name}
          </h3>

          {/* Short Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Code size={16} className="text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/30">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Pitch Status Indicator */}
          {project.hasUnreadPitch && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <MessageSquare size={14} className="text-green-400" />
                <span className="text-sm text-green-300 font-medium">
                  New pitches received!
                </span>
              </div>
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Duration */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <Clock size={14} className="text-purple-400 mr-2" />
                <span className="text-xs text-purple-300 font-medium">
                  Duration
                </span>
              </div>
              <p className="text-sm text-white font-semibold">
                {project.duration}
              </p>
            </div>

            {/* Difficulty */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <TrendingUp size={14} className="text-orange-400 mr-2" />
                <span className="text-xs text-orange-300 font-medium">
                  Level
                </span>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${getDifficultyColor(
                  project.difficultyLevel
                )}`}
              >
                {project.difficultyLevel}
              </span>
            </div>

            {/* Pitch Count */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <MessageSquare size={14} className="text-cyan-400 mr-2" />
                <span className="text-xs text-cyan-300 font-medium">
                  Pitches
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-white font-semibold">
                  {project.pitches?.length || 0}
                </p>
                {project.hasUnreadPitch && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Project Status Indicator */}
            {isProjectRestricted() && (
              <div className="col-span-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-3 border border-orange-400/20">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={14} className="text-orange-400" />
                  <span className="text-xs text-orange-300 font-medium">
                    {project.status === "In Progress"
                      ? "Project in progress - Limited editing"
                      : project.status === "Completed"
                      ? "Project completed - Read only"
                      : "Project cancelled - Limited access"}
                  </span>
                </div>
              </div>
            )}

            {/* Category */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <Tag size={14} className="text-green-400 mr-2" />
                <span className="text-xs text-green-300 font-medium">
                  Category
                </span>
              </div>
              <p className="text-sm text-white font-semibold line-clamp-1">
                {project.category}
              </p>
            </div>

            {/* Price */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 col-span-2">
              <div className="flex items-center mb-1">
                <DollarSign size={14} className="text-yellow-400 mr-2" />
                <span className="text-xs text-yellow-300 font-medium">
                  {activePrice.type}
                </span>
              </div>
              <p className="text-sm text-white font-bold">
                {formatPrice(activePrice.price)}
              </p>
            </div>
          </div>

          {/* Project Dates */}
          {(project.startDate || project.expectedEndDate) && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-3 border border-white/10 mb-6">
              <div className="flex items-center justify-between text-xs">
                {project.startDate && (
                  <div className="flex items-center">
                    <Calendar size={12} className="text-indigo-400 mr-1" />
                    <span className="text-indigo-300">
                      Started:{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.expectedEndDate && (
                  <div className="flex items-center">
                    <Calendar size={12} className="text-purple-400 mr-1" />
                    <span className="text-purple-300">
                      Due:{" "}
                      {new Date(project.expectedEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              {/* Edit Button */}
              <button
                onClick={() => handleEditProject()}
                disabled={isProjectRestricted()}
                className={`group/btn flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all transform shadow-lg ${
                  isProjectRestricted()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white hover:scale-105 hover:shadow-blue-500/25"
                }`}
                title={
                  isProjectRestricted()
                    ? "Cannot edit project in this status"
                    : "Edit project"
                }
              >
                <Edit
                  size={16}
                  className={`${
                    !isProjectRestricted()
                      ? "group-hover/btn:rotate-12 transition-transform"
                      : ""
                  }`}
                />
                <span className="text-sm">Edit</span>
              </button>

              {/* View Button with pitch notification indicator */}
              <button
                onClick={handleViewProject}
                className="group/btn relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                <Eye
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform"
                />
                <span className="text-sm">View</span>
                {project.hasUnreadPitch && (
                  <>
                    {/* Animated notification dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                  </>
                )}
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteProject()}
              disabled={isProjectRestricted()}
              className={`group/btn flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all transform shadow-lg ${
                isProjectRestricted()
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:scale-105 hover:shadow-red-500/25"
              }`}
              title={
                isProjectRestricted()
                  ? "Cannot delete project in this status"
                  : "Delete project"
              }
            >
              <Trash2
                size={16}
                className={`${
                  !isProjectRestricted() ? "group-hover/btn:animate-bounce" : ""
                }`}
              />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl pointer-events-none"></div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
            {/* Animated background elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4">
                  <Trash2 className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Delete Project
                  </h3>
                  <p className="text-red-300 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
                <p className="text-red-200 text-sm leading-relaxed">
                  You are about to permanently delete{" "}
                  <span className="font-bold text-white">"{project.name}"</span>
                  . This will remove all associated data, messages, and
                  progress.
                </p>
              </div>

              {/* Confirmation Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Type the project name to confirm deletion:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={project.name}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== project.name || isDeleting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortProjectCard;
