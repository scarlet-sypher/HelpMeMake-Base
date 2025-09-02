import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  User,
  Clock,
  Tag,
  DollarSign,
  TrendingUp,
  Calendar,
  Code,
  Star,
  Users,
  MapPin,
  Image,
  CheckCircle2,
  AlertCircle,
  Bell,
  BellRing,
} from "lucide-react";
import axios from "axios";

const ShortProjectView = ({ project, onApply = null, onToast = null }) => {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(project.hasApplied || false);
  const [hasAppliedForProject, setHasAppliedForProject] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposedPrice: "",
    coverLetter: "",
    estimatedDuration: "",
  });

  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [mentorStatus, setMentorStatus] = useState({
    hasActiveProject: false,
    isRestricted: false,
    activeProjectId: null,
  });

  useEffect(() => {
    checkMentorActiveProject();
    checkProjectRequests();
  }, []);

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

  useEffect(() => {
    const checkMentorPitchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${apiUrl}/projects/${project._id}/pitches/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          setHasAppliedForProject(data.hasApplied);
        }
      } catch (error) {
        console.error("Error checking pitch status:", error);
      }
    };

    checkMentorPitchStatus();
  }, [project._id]);

  const checkProjectRequests = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${API_URL}/requests/mentor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const projectRequests = response.data.requests.filter(
          (request) =>
            request.projectId === project._id && request.status === "pending"
        );

        setRequestCount(projectRequests.length);
        setHasNewRequests(projectRequests.length > 0);
      }
    } catch (error) {
      console.error("Error checking requests:", error);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "text-green-300 bg-green-500/20 border-green-400/30";
      case "Intermediate":
        return "text-yellow-300 bg-yellow-500/20 border-yellow-400/30";
      case "Advanced":
        return "text-red-300 bg-red-500/20 border-red-400/30";
      default:
        return "text-gray-300 bg-gray-500/20 border-gray-400/30";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const handleViewProject = () => {
    setHasNewRequests(false);
    setRequestCount(0);

    window.location.href = `/mentor/project/${project._id}`;
  };

  const handleApplyClick = () => {
    if (hasApplied) return;

    if (mentorStatus.isRestricted) {
      if (onToast) {
        onToast({
          message:
            "You already have a project in progress. Complete it before applying to new projects.",
          status: "error",
        });
      }
      return;
    }

    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async () => {
    if (
      !applicationData.proposedPrice ||
      !applicationData.coverLetter ||
      !applicationData.estimatedDuration
    ) {
      if (onToast) {
        onToast({
          message: "Please fill in all fields",
          status: "error",
        });
      }
      return;
    }

    setIsApplying(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/projects/${project._id}/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setHasApplied(true);
        setShowApplicationModal(false);
        setApplicationData({
          proposedPrice: "",
          coverLetter: "",
          estimatedDuration: "",
        });

        if (onApply) {
          onApply(project._id);
        }

        if (onToast) {
          onToast({
            message: "Application submitted successfully!",
            status: "success",
          });
        }
      } else {
        if (onToast) {
          onToast({
            message: data.message || "Failed to submit application",
            status: "error",
          });
        }
      }
    } catch (error) {
      console.error("Application error:", error);
      if (onToast) {
        onToast({
          message: "Failed to submit application",
          status: "error",
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  const checkMentorActiveProject = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/mentor/active-project-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMentorStatus({
          hasActiveProject: data.hasActiveProject,
          isRestricted: data.hasActiveProject,
          activeProjectId: data.activeProjectId,
        });
      }
    } catch (error) {
      console.error("Error checking mentor status:", error);
    }
  };

  return (
    <>
      <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] z-0 w-full max-w-full">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative h-40 sm:h-48 lg:h-52 overflow-hidden">
          <img
            src={
              project.thumbnail
                ? project.thumbnail.startsWith("/uploads/")
                  ? `${import.meta.env.VITE_API_URL}${project.thumbnail}`
                  : project.thumbnail
                : `${
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

          {hasNewRequests && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
              <div className="relative">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse min-w-0">
                  <BellRing size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">
                    {requestCount} Request{requestCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="absolute inset-0 bg-red-400/50 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold min-w-0">
              <span className="break-words">
                {formatPrice(project.openingPrice)}
              </span>
            </div>
          </div>

          {project.closingPrice && (
            <div className="absolute top-10 sm:top-16 right-2 sm:right-4 z-10">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Price Set
              </div>
            </div>
          )}

          <div
            className={`absolute ${
              hasNewRequests ? "top-10 sm:top-16" : "top-2 sm:top-4"
            } left-2 sm:left-4 z-10`}
          >
            <div
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                project.difficultyLevel
              )}`}
            >
              <span className="whitespace-nowrap">
                {project.difficultyLevel}
              </span>
            </div>
          </div>

          {hasApplied && (
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-green-500/80 text-green-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center z-10">
              <CheckCircle2
                size={10}
                className="mr-1 sm:w-3 sm:h-3 flex-shrink-0"
              />
              <span>Applied</span>
            </div>
          )}

          <div
            className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center opacity-0 transition-opacity duration-300"
            id={`fallback-${project._id}`}
          >
            <div className="text-center p-4">
              <Image className="text-white/50 mx-auto mb-2" size={24} />
              <p className="text-white/70 text-xs sm:text-sm">No Image</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-4 sm:p-6 w-full max-w-full">
          <div className="mb-3 min-w-0 w-full">
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight break-words">
              {project.name}

              {hasNewRequests && (
                <span className="ml-2 inline-flex items-center flex-shrink-0">
                  <Bell
                    size={14}
                    className="sm:w-4 sm:h-4 text-red-400 animate-bounce"
                  />
                </span>
              )}
            </h3>
          </div>

          <div className="mb-4 min-w-0 w-full">
            <p className="text-gray-300 text-sm leading-relaxed break-words line-clamp-3">
              {project.shortDescription}
            </p>
          </div>

          {project.learner && (
            <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/10 w-full max-w-full">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm overflow-hidden flex-shrink-0">
                  {project.learner.avatar ? (
                    <img
                      src={
                        project?.learner?.avatar
                          ? project.learner.avatar.startsWith("/uploads/")
                            ? `${import.meta.env.VITE_API_URL}${
                                project.learner.avatar
                              }`
                            : project.learner.avatar
                          : `${
                              import.meta.env.VITE_API_URL
                            }/uploads/public/default.jpg`
                      }
                      alt={project.learner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    project.learner.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm break-words">
                    {project.learner.name}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-400 min-w-0">
                    {project.learner.title && (
                      <span className="break-words">
                        {project.learner.title}
                      </span>
                    )}
                    {project.learner.title && project.learner.location && (
                      <span className="hidden sm:inline mx-1">•</span>
                    )}
                    {project.learner.location && (
                      <span className="flex items-center min-w-0">
                        <MapPin size={10} className="mr-1 flex-shrink-0" />
                        <span className="break-words">
                          {project.learner.location}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 w-full max-w-full">
            <div className="flex items-center mb-2">
              <Code
                size={14}
                className="sm:w-4 sm:h-4 text-cyan-400 mr-2 flex-shrink-0"
              />
              <span className="text-sm font-medium text-cyan-300">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30 break-words max-w-full"
                >
                  {tech}
                </span>
              ))}
              {project.techStack?.length > 3 && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/30 whitespace-nowrap">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6 w-full max-w-full">
            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1">
                <Clock
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-purple-400 mr-2 flex-shrink-0"
                />
                <span className="text-xs text-purple-300 font-medium">
                  Duration
                </span>
              </div>
              <p className="text-sm text-white font-semibold break-words">
                {project.duration}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1">
                <Tag
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-green-400 mr-2 flex-shrink-0"
                />
                <span className="text-xs text-green-300 font-medium">
                  Category
                </span>
              </div>
              <p className="text-sm text-white font-semibold break-words line-clamp-1">
                {project.category}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1">
                <Users
                  size={12}
                  className="sm:w-3.5 sm:h-3.5 text-orange-400 mr-2 flex-shrink-0"
                />
                <span className="text-xs text-orange-300 font-medium">
                  Applications
                </span>
              </div>
              <p className="text-sm text-white font-semibold">
                {project.pitches?.length || 0}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 min-w-0">
              <div className="flex items-center mb-1">
                {hasNewRequests ? (
                  <>
                    <Bell
                      size={12}
                      className="sm:w-3.5 sm:h-3.5 text-red-400 mr-2 flex-shrink-0"
                    />
                    <span className="text-xs text-red-300 font-medium">
                      Requests
                    </span>
                  </>
                ) : (
                  <>
                    <Eye
                      size={12}
                      className="sm:w-3.5 sm:h-3.5 text-blue-400 mr-2 flex-shrink-0"
                    />
                    <span className="text-xs text-blue-300 font-medium">
                      Views
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-white font-semibold">
                {hasNewRequests ? requestCount : project.viewCount || 0}
              </p>
            </div>
          </div>

          {project.createdAt && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-3 border border-white/10 mb-6 w-full max-w-full">
              <div className="flex items-center text-xs min-w-0">
                <Calendar
                  size={12}
                  className="text-indigo-400 mr-1 flex-shrink-0"
                />
                <span className="text-indigo-300 break-words">
                  Posted: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4 border-t border-white/10 w-full max-w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleViewProject}
                className={`group/btn flex items-center justify-center space-x-2 px-4 py-2 sm:py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg min-w-0 flex-1 ${
                  hasNewRequests
                    ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-red-500/25 animate-pulse"
                    : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 hover:shadow-cyan-500/25"
                } text-white`}
              >
                {hasNewRequests ? (
                  <BellRing
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform flex-shrink-0"
                  />
                ) : (
                  <Eye
                    size={16}
                    className="group-hover/btn:scale-110 transition-transform flex-shrink-0"
                  />
                )}
                <span className="text-sm break-words">
                  {hasNewRequests
                    ? `View (${requestCount} req)`
                    : "View Project"}
                </span>
              </button>

              <div className="relative group flex-1">
                <button
                  onClick={handleApplyClick}
                  disabled={hasAppliedForProject || mentorStatus.isRestricted}
                  title={
                    hasAppliedForProject
                      ? "You already applied to this project"
                      : mentorStatus.isRestricted
                      ? "One project is in progress"
                      : "Apply to this project"
                  }
                  className={`px-4 py-2 sm:py-3 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg w-full min-w-0 ${
                    hasAppliedForProject
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400/30 cursor-not-allowed"
                      : mentorStatus.isRestricted
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:shadow-emerald-500/25"
                  }`}
                >
                  <span className="text-sm break-words">
                    {hasAppliedForProject
                      ? "Already Applied"
                      : mentorStatus.isRestricted
                      ? "Restricted"
                      : "Apply"}
                  </span>
                </button>
                {(mentorStatus.isRestricted || hasAppliedForProject) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 max-w-xs break-words">
                    {hasAppliedForProject
                      ? "You already applied to this project"
                      : "One project is in progress"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl pointer-events-none"></div>
      </div>

      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative z-10 w-full max-w-full">
              <div className="flex items-center mb-6 min-w-0">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl mr-4 flex-shrink-0">
                  <Star className="text-white" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                    Apply to Project
                  </h3>
                  <p className="text-cyan-300 text-sm break-words line-clamp-2">
                    {project.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4 w-full max-w-full">
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-white mb-2">
                    Proposed Price (₹)
                  </label>
                  <input
                    type="number"
                    value={applicationData.proposedPrice}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        proposedPrice: e.target.value,
                      }))
                    }
                    placeholder="Enter your proposed price"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all min-w-0"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-sm font-medium text-white mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={applicationData.estimatedDuration}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        estimatedDuration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2 weeks, 1 month"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all min-w-0"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-sm font-medium text-white mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        coverLetter: e.target.value,
                      }))
                    }
                    placeholder="Tell the learner why you're the right mentor for this project..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all min-w-0"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-sm font-medium text-white mb-2">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={applicationData.estimatedDuration}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        estimatedDuration: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2 weeks, 1 month"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all min-w-0"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-sm font-medium text-white mb-2">
                    Proposed Price (₹)
                  </label>
                  <input
                    type="number"
                    value={applicationData.proposedPrice}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        proposedPrice: e.target.value,
                      }))
                    }
                    placeholder="Enter your proposed price"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none min-w-0"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 mt-6 w-full max-w-full">
                <button
                  onClick={() => {
                    setShowApplicationModal(false);
                    setApplicationData({
                      proposedPrice: "",
                      coverLetter: "",
                      estimatedDuration: "",
                    });
                  }}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 min-w-0"
                  disabled={isApplying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplicationSubmit}
                  disabled={
                    isApplying ||
                    !applicationData.proposedPrice ||
                    !applicationData.coverLetter ||
                    !applicationData.estimatedDuration
                  }
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg min-w-0"
                >
                  {isApplying ? "Applying..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShortProjectView;
