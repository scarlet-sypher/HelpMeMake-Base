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

const ShortProjectCard = ({ project, onDelete, onToast }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isProjectRestricted = () => {
    const restrictedStatuses = ["In Progress", "Completed", "Cancelled"];
    return restrictedStatuses.includes(project.status);
  };

  const handleEditProject = () => {
    if (isProjectRestricted()) {
      onToast?.({
        message:
          "Can't edit in-progress project manually. Please visit My Mentor page",
        status: "error",
      });
      return;
    }
    window.location.href = `/projects/edit/${project._id}`;
  };

  const handleDeleteProject = () => {
    if (isProjectRestricted()) {
      onToast?.({
        message:
          "Can't delete in-progress project manually. Please visit My Mentor page",
        status: "error",
      });
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

  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

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

  const handleViewProject = async () => {
    try {
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

      window.location.href = `/projects/${project._id}`;
    } catch (error) {
      console.error("Error marking pitches as read:", error);

      window.location.href = `/projects/${project._id}`;
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== project.name) {
      onToast?.({
        message:
          "Project name does not match. Please type the exact project name.",
        status: "error",
      });
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
        onToast?.({
          message: "Project deleted successfully!",
          status: "success",
        });
        if (onDelete) {
          onDelete(project._id);
        }
        setShowDeleteModal(false);
      } else {
        onToast?.({
          message:
            data.message || "Failed to delete project. Please try again.",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      onToast?.({
        message: "Failed to delete project. Please try again.",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group relative w-full max-w-full bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] z-0">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative h-40 sm:h-48 md:h-52 lg:h-48 xl:h-52 w-full overflow-hidden">
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

          <div
            className={`absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full ${statusInfo.bgColor} backdrop-blur-sm border border-white/20 flex items-center space-x-1 sm:space-x-2`}
          >
            <StatusIcon
              size={12}
              className={`sm:w-3.5 sm:h-3.5 ${statusInfo.textColor}`}
            />
            <span
              className={`text-xs sm:text-sm font-medium ${statusInfo.textColor} leading-tight`}
            >
              {project.status}
            </span>
          </div>

          {project.hasUnreadPitch && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center space-x-1 sm:space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-1.5 py-1 sm:px-2 sm:py-1 border border-green-400/30">
              <div className="relative">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full relative"></div>
              </div>
              <MessageSquare
                size={10}
                className="sm:w-3 sm:h-3 text-green-400"
              />
              <span className="text-xs sm:text-xs text-green-300 font-medium leading-tight">
                New
              </span>
            </div>
          )}

          {project.isFeatured && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Star size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center opacity-0 transition-opacity duration-300"
            id={`fallback-${project._id}`}
          >
            <div className="text-center">
              <Image className="text-white/50 mx-auto mb-2" size={24} />
              <p className="text-white/70 text-xs sm:text-sm">No Image</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-4 sm:p-5 lg:p-6 min-w-0">
          <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight group-hover:text-blue-300 transition-colors min-w-0 overflow-hidden text-ellipsis">
            <span className="break-words line-clamp-2">{project.name}</span>
          </h3>

          <div className="text-gray-300 text-sm sm:text-sm leading-relaxed mb-3 sm:mb-4 min-w-0">
            <p className="break-words line-clamp-3">
              {project.shortDescription}
            </p>
          </div>

          <div className="mb-3 sm:mb-4 min-w-0">
            <div className="flex items-center mb-2">
              <Code
                size={14}
                className="sm:w-4 sm:h-4 text-blue-400 mr-1.5 sm:mr-2 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium text-blue-300 leading-tight">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
              {project.techStack.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30 leading-tight flex-shrink-0 max-w-full overflow-hidden text-ellipsis"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/30 leading-tight flex-shrink-0">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {project.hasUnreadPitch && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-ping flex-shrink-0"></div>
                <MessageSquare
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-green-400 flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-green-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  New pitches received!
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6 min-w-0">
            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1">
                <Clock
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-purple-400 mr-1 sm:mr-2 flex-shrink-0"
                />
                <span className="text-xs text-purple-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  Duration
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold leading-tight min-w-0 overflow-hidden text-ellipsis">
                {project.duration}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1 min-w-0">
                <TrendingUp
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-orange-400 mr-1 sm:mr-2 flex-shrink-0"
                />
                <span className="text-xs text-orange-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  Level
                </span>
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg ${getDifficultyColor(
                  project.difficultyLevel
                )} leading-tight inline-block max-w-full overflow-hidden text-ellipsis`}
              >
                {project.difficultyLevel}
              </span>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1 min-w-0">
                <MessageSquare
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-cyan-400 mr-1 sm:mr-2 flex-shrink-0"
                />
                <span className="text-xs text-cyan-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  Pitches
                </span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <p className="text-xs sm:text-sm text-white font-semibold leading-tight">
                  {project.pitches?.length || 0}
                </p>
                {project.hasUnreadPitch && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                )}
              </div>
            </div>

            {isProjectRestricted() && (
              <div className="col-span-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-2.5 sm:p-3 border border-orange-400/20 min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                  <AlertCircle
                    size={12}
                    className="sm:w-3.5 sm:h-3.5 text-orange-400 flex-shrink-0"
                  />
                  <span className="text-xs text-orange-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                    {project.status === "In Progress"
                      ? "Project in progress - Limited editing"
                      : project.status === "Completed"
                      ? "Project completed - Read only"
                      : "Project cancelled - Limited access"}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1 min-w-0">
                <Tag
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-green-400 mr-1 sm:mr-2 flex-shrink-0"
                />
                <span className="text-xs text-green-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  Category
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-semibold leading-tight min-w-0 overflow-hidden text-ellipsis">
                {project.category}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 col-span-2 min-w-0">
              <div className="flex items-center mb-1 min-w-0">
                <DollarSign
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-yellow-400 mr-1 sm:mr-2 flex-shrink-0"
                />
                <span className="text-xs text-yellow-300 font-medium leading-tight min-w-0 overflow-hidden text-ellipsis">
                  {activePrice.type}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white font-bold leading-tight min-w-0 overflow-hidden text-ellipsis">
                {formatPrice(activePrice.price)}
              </p>
            </div>
          </div>

          {(project.startDate || project.expectedEndDate) && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-2.5 sm:p-3 border border-white/10 mb-4 sm:mb-6 min-w-0">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2 min-w-0">
                {project.startDate && (
                  <div className="flex items-center min-w-0">
                    <Calendar
                      size={10}
                      className="sm:w-3 sm:h-3 text-indigo-400 mr-1 flex-shrink-0"
                    />
                    <span className="text-indigo-300 leading-tight min-w-0 overflow-hidden text-ellipsis">
                      Started:{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {project.expectedEndDate && (
                  <div className="flex items-center min-w-0">
                    <Calendar
                      size={10}
                      className="sm:w-3 sm:h-3 text-purple-400 mr-1 flex-shrink-0"
                    />
                    <span className="text-purple-300 leading-tight min-w-0 overflow-hidden text-ellipsis">
                      Due:{" "}
                      {new Date(project.expectedEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <button
                onClick={() => handleEditProject()}
                disabled={isProjectRestricted()}
                className={`group/btn flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium transition-all transform shadow-lg text-xs sm:text-sm min-w-0 flex-shrink-0 ${
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
                  size={14}
                  className={`sm:w-4 sm:h-4 ${
                    !isProjectRestricted()
                      ? "group-hover/btn:rotate-12 transition-transform"
                      : ""
                  } flex-shrink-0`}
                />
                <span className="leading-tight">Edit</span>
              </button>

              <button
                onClick={handleViewProject}
                className="group/btn relative flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 text-xs sm:text-sm min-w-0 flex-shrink-0"
              >
                <Eye
                  size={14}
                  className="sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform flex-shrink-0"
                />
                <span className="leading-tight">View</span>
                {project.hasUnreadPitch && (
                  <>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => handleDeleteProject()}
              disabled={isProjectRestricted()}
              className={`group/btn flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium transition-all transform shadow-lg text-xs sm:text-sm min-w-0 flex-shrink-0 ${
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
                size={14}
                className={`sm:w-4 sm:h-4 ${
                  !isProjectRestricted() ? "group-hover/btn:animate-bounce" : ""
                } flex-shrink-0`}
              />
              <span className="leading-tight">Delete</span>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl pointer-events-none"></div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative hide-scrollbar-general bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto hide-sc">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative z-10 min-w-0">
              <div className="flex items-start mb-4 sm:mb-6 min-w-0">
                <div className="p-2.5 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-3 sm:mr-4 flex-shrink-0">
                  <Trash2 className="text-white" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    Delete Project
                  </h3>
                  <p className="text-red-300 text-sm leading-tight">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 min-w-0">
                <p className="text-red-200 text-sm leading-relaxed break-words">
                  You are about to permanently delete{" "}
                  <span className="font-bold text-white break-words">
                    "{project.name}"
                  </span>
                  . This will remove all associated data, messages, and
                  progress.
                </p>
              </div>

              <div className="mb-4 sm:mb-6 min-w-0">
                <label className="block text-sm font-medium text-white mb-2 leading-tight">
                  Type the project name to confirm deletion:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={project.name}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all text-sm leading-tight min-w-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 min-w-0">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 text-sm leading-tight min-w-0"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== project.name || isDeleting}
                  className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg text-sm leading-tight min-w-0"
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
