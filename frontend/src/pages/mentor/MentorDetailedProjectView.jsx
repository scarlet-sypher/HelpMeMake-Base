import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Bot,
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  Code,
  Database,
  Smartphone,
  Monitor,
  Cpu,
  Shield,
  Cloud,
  Gamepad2,
  Palette,
  Network,
  AlertCircle,
  Eye,
  BookOpen,
  ExternalLink,
  MessageSquare,
  UserCheck,
  Briefcase,
  MapPin,
  Star,
  Award,
  Send,
  HandHeart,
  Loader2,
  Mail,
  BellRing,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import PitchModal from "../../components/mentor/mentorProject/PitchModal";
import ShowRequestsModal from "../../components/mentor/mentorProject/ShowRequestsModal";

const MentorDetailedProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [mentorStatus, setMentorStatus] = useState({
    hasActiveProject: false,
    isRestricted: false,
    activeProjectId: null,
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info",
  });

  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const [hasAppliedForProject, setHasAppliedForProject] = useState(false);

  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [hasRequests, setHasRequests] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = ({ message, status = "info" }) => {
    setToast({
      open: true,
      message,
      status,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Web Development": Monitor,
      "Mobile Development": Smartphone,
      "AI/Machine Learning": Bot,
      "Data Science": Database,
      DevOps: Cloud,
      Blockchain: Network,
      IoT: Cpu,
      "Game Development": Gamepad2,
      "Desktop Applications": Monitor,
      "API Development": Code,
      "Database Design": Database,
      "UI/UX Design": Palette,
      Cybersecurity: Shield,
      "Cloud Computing": Cloud,
      Other: Code,
    };
    return icons[category] || Code;
  };

  const getDifficultyColor = (level) => {
    const colors = {
      Beginner: "from-green-500 to-emerald-500",
      Intermediate: "from-yellow-500 to-orange-500",
      Advanced: "from-red-500 to-pink-500",
    };
    return colors[level] || "from-gray-500 to-slate-500";
  };

  const checkMentorActiveProject = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${API_URL}/mentor/active-project-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMentorStatus({
          hasActiveProject: response.data.hasActiveProject,
          isRestricted: response.data.hasActiveProject,
          activeProjectId: response.data.activeProjectId,
        });
      }
    } catch (error) {
      console.error("Error checking mentor status:", error);
    }
  };

  const checkPitchStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${API_URL}/projects/${id}/pitches/mine`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHasAppliedForProject(response.data.hasApplied);
      }
    } catch (error) {
      console.error("Error checking pitch status:", error);
    }
  };

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
          (request) => request.projectId === id
        );

        setRequestCount(projectRequests.length);
        setHasRequests(projectRequests.length > 0);
      }
    } catch (error) {
      console.error("Error checking requests:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "from-blue-500 to-cyan-500",
      "In Progress": "from-purple-500 to-pink-500",
      Completed: "from-green-500 to-emerald-500",
      Cancelled: "from-gray-500 to-slate-500",
    };
    return colors[status] || "from-gray-500 to-slate-500";
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${API_URL}/projects/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProject(response.data.project);

          await checkMentorActiveProject();

          await checkProjectRequests();
        } else {
          setError("Failed to load project details");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(
          error.response?.data?.message || "Error loading project details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, API_URL]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const handleShowUserProfile = () => {
    if (project?.learner?.userId?._id) {
      navigate(`/mentor/user/${project.learner.userId._id}`);
    } else if (project?.learner?.userId) {
      navigate(`/mentor/user/${project.learner.userId}`);
    } else {
      showToast({
        message: "Unable to view profile - user information not available",
        status: "error",
      });
    }
  };

  const handleMessageUser = () => {
    showToast({
      message: "Messaging feature coming soon!",
      status: "error",
    });
  };

  const handleOpenPitchModal = () => {
    if (mentorStatus.isRestricted) {
      showToast({
        message:
          "You already have a project in progress. Complete it before taking on new projects.",
        status: "error",
      });
      return;
    }
    setShowPitchModal(true);
  };

  const handleShowRequests = () => {
    setShowRequestsModal(true);
  };

  const calculateNegotiatedPrice = (project) => {
    if (!project.pitches || project.pitches.length === 0) {
      return 0;
    }

    const totalPrice = project.pitches.reduce(
      (sum, pitch) => sum + pitch.price,
      0
    );
    return Math.round(totalPrice / project.pitches.length);
  };

  const handleTakeProject = async () => {
    if (mentorStatus.isRestricted) {
      showToast({
        message:
          "You already have a project in progress. Complete it before taking on new projects.",
        status: "error",
      });
      return;
    }

    setShowAcceptConfirm(true);
  };

  const confirmTakeProject = async () => {
    if (confirmationText !== "i m ready") {
      showToast({
        message: 'Please type exactly "i m ready" to confirm.',
        status: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `${API_URL}/projects/take/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        showToast({
          message:
            "Project accepted successfully! You can now start working on it.",
          status: "success",
        });

        setMentorStatus({
          hasActiveProject: true,
          isRestricted: true,
          activeProjectId: id,
        });

        setShowAcceptConfirm(false);
        setConfirmationText("");

        setTimeout(() => {
          navigate("/mentor/my-apprentice");
        }, 2000);
      }
    } catch (error) {
      console.error("Error taking project:", error);
      showToast({
        message:
          error.response?.data?.message ||
          "Failed to accept project. Please try again.",
        status: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error ||
              "The project you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/mentor/projects")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(project.category);
  const learner = project.learner || project.learnerId;

  const Toast = () => {
    if (!toast.open) return null;

    const getToastStyles = (status) => {
      const styles = {
        success: "from-green-500 to-emerald-500 border-green-400/30",
        error: "from-red-500 to-red-600 border-red-400/30",
        info: "from-blue-500 to-cyan-500 border-blue-400/30",
      };
      return styles[status] || styles.info;
    };

    const getToastIcon = (status) => {
      const icons = {
        success: CheckCircle2,
        error: AlertTriangle,
        info: Info,
      };
      const Icon = icons[status] || Info;
      return <Icon size={20} className="text-white flex-shrink-0" />;
    };

    return (
      <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right-5 fade-in duration-300">
        <div
          className={`bg-gradient-to-r ${getToastStyles(
            toast.status
          )} backdrop-blur-sm rounded-2xl shadow-2xl border p-4 min-w-[300px] max-w-md`}
        >
          <div className="flex items-start space-x-3">
            {getToastIcon(toast.status)}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={closeToast}
              className="text-white/70 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/mentor/projects")}
            className="group flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Return to Projects</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                {project.name}
                {/* NEW: Request notification in title */}
                {hasRequests && (
                  <span className="ml-3 inline-flex items-center">
                    <BellRing
                      size={20}
                      className="text-red-400 animate-bounce"
                    />
                    <span className="ml-1 text-red-400 text-lg">
                      {requestCount}
                    </span>
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center space-x-1">
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  <span>{project.viewCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} className="sm:w-4 sm:h-4" />
                  <span>{project.applicationsCount} applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Project Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl self-start">
                    <CategoryIcon className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                      {project.name}
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base break-words">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                  <div
                    className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${getStatusColor(
                      project.status
                    )} text-white rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap`}
                  >
                    {project.status}
                  </div>
                  <div
                    className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${getDifficultyColor(
                      project.difficultyLevel
                    )} text-white rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap`}
                  >
                    {project.difficultyLevel}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <DollarSign
                    className="mx-auto mb-2 text-green-400"
                    size={20}
                  />
                  <div className="text-base sm:text-lg font-bold text-white break-words">
                    {formatPrice(project.openingPrice, project.currency)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Opening Price
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <Clock className="mx-auto mb-2 text-blue-400" size={20} />
                  <div className="text-base sm:text-lg font-bold text-white break-words">
                    {project.duration}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Duration
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <TrendingUp
                    className="mx-auto mb-2 text-purple-400"
                    size={20}
                  />
                  <div className="text-base sm:text-lg font-bold text-white">
                    {project.progressPercentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Progress
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                  <BookOpen
                    className="mr-2 text-cyan-400 flex-shrink-0"
                    size={18}
                  />
                  <span>Project Description</span>
                </h3>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base break-words">
                    {project.fullDescription}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                  <Code
                    className="mr-2 text-green-400 flex-shrink-0"
                    size={18}
                  />
                  <span>Tech Stack</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg text-xs sm:text-sm border border-green-500/30 break-words"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Outcome & Motivation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center">
                    <Target
                      className="mr-2 text-purple-400 flex-shrink-0"
                      size={16}
                    />
                    <span>Expected Outcome</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed break-words">
                      {project.projectOutcome}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center">
                    <Zap
                      className="mr-2 text-yellow-400 flex-shrink-0"
                      size={16}
                    />
                    <span>Motivation</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed break-words">
                      {project.motivation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {project.prerequisites && project.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                    <AlertCircle
                      className="mr-2 text-orange-400 flex-shrink-0"
                      size={18}
                    />
                    <span>Prerequisites</span>
                  </h3>
                  <div className="space-y-2">
                    {project.prerequisites.map((prereq, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 text-gray-200"
                      >
                        <CheckCircle
                          className="text-orange-400 flex-shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-xs sm:text-sm break-words">
                          {prereq}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {project.references && project.references.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                    <ExternalLink
                      className="mr-2 text-cyan-400 flex-shrink-0"
                      size={18}
                    />
                    <span>References</span>
                  </h3>
                  <div className="space-y-2">
                    {project.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="text-white font-medium text-sm sm:text-base break-words">
                            {ref.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 break-words">
                            {ref.type}
                          </div>
                        </div>
                        <ExternalLink
                          className="text-cyan-400 group-hover:text-cyan-300 flex-shrink-0"
                          size={16}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - User Info & Actions */}
          <div className="space-y-6">
            {/* User Profile Card */}
            {learner && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <div className="relative inline-block mb-4">
                    <img
                      src={
                        learner.userId?.avatar
                          ? learner.userId.avatar.startsWith("/uploads/")
                            ? `${import.meta.env.VITE_API_URL}${
                                learner.userId.avatar
                              }`
                            : learner.userId.avatar
                          : learner.avatar
                          ? learner.avatar.startsWith("/uploads/")
                            ? `${import.meta.env.VITE_API_URL}${learner.avatar}`
                            : learner.avatar
                          : `${
                              import.meta.env.VITE_API_URL
                            }/uploads/public/default.jpg`
                      }
                      alt={learner.userId?.name || "User"}
                      className="w-20 h-20 rounded-full object-cover border-4 border-cyan-500/50"
                      onError={(e) => {
                        e.target.src = "/uploads/public/default.jpg";
                      }}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {learner.userId?.name || "Anonymous User"}
                  </h3>
                  <p className="text-cyan-300 mb-2 flex items-center justify-center">
                    <Briefcase size={14} className="mr-1" />
                    {learner.title || "Student"}
                  </p>
                  <p className="text-gray-300 text-sm flex items-center justify-center">
                    <MapPin size={14} className="mr-1" />
                    {learner.location || "Location not specified"}
                  </p>
                </div>

                <div className="text-center mb-4">
                  <p className="text-gray-200 text-sm italic">
                    "{learner.description || "No description provided"}"
                  </p>
                </div>

                <div className="flex justify-center space-x-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">
                      {learner.level || 0}
                    </div>
                    <div className="text-xs text-gray-300">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">
                      {learner.completedSessions || 0}
                    </div>
                    <div className="text-xs text-gray-300">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400 flex items-center">
                      <Star size={16} className="mr-1" />
                      {learner.rating || "0.0"}
                    </div>
                    <div className="text-xs text-gray-300">Rating</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <HandHeart className="mr-2 text-cyan-400" size={20} />
                Mentor Actions
              </h3>

              <div className="space-y-3">
                {/* Show User Profile */}
                <button
                  onClick={handleShowUserProfile}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <UserCheck size={18} />
                  <span>Show User Profile</span>
                </button>

                {/* Message User */}
                <button
                  onClick={handleMessageUser}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <MessageSquare size={18} />
                  <span>Message User</span>
                </button>

                {/* NEW: Show Requests Button */}
                <button
                  onClick={handleShowRequests}
                  disabled={!hasRequests}
                  title={
                    hasRequests
                      ? `View ${requestCount} request${
                          requestCount > 1 ? "s" : ""
                        } for this project`
                      : "No requests for this project"
                  }
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    hasRequests
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transform hover:scale-105"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {hasRequests ? (
                    <>
                      <BellRing size={18} />
                      <span>Show Requests ({requestCount})</span>
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      <span>No Requests</span>
                    </>
                  )}
                </button>

                {/* Interest / Pitch / Negotiate */}
                <div className="relative">
                  <button
                    onClick={handleOpenPitchModal}
                    disabled={hasAppliedForProject || mentorStatus.isRestricted}
                    title={
                      hasAppliedForProject
                        ? "You already applied to this project"
                        : mentorStatus.isRestricted
                        ? "One project is in progress"
                        : "Express Interest & Negotiate"
                    }
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      hasAppliedForProject
                        ? "bg-blue-500/20 text-blue-300 border border-blue-400/30 cursor-not-allowed"
                        : mentorStatus.isRestricted
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white transform hover:scale-105"
                    }`}
                  >
                    <Send size={18} />
                    <span>
                      {hasAppliedForProject
                        ? "Already Applied"
                        : "Express Interest & Negotiate"}
                    </span>
                  </button>
                  {(mentorStatus.isRestricted || hasAppliedForProject) && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {hasAppliedForProject
                        ? "You already applied to this project"
                        : "One project is in progress"}
                    </div>
                  )}
                </div>

                {/* Take Project */}
                <div className="relative group">
                  <button
                    onClick={handleTakeProject}
                    disabled={
                      !project.closingPrice || mentorStatus.isRestricted
                    }
                    title={
                      mentorStatus.isRestricted
                        ? "One project is in progress"
                        : !project.closingPrice
                        ? "No closing price yet"
                        : "Accept this project"
                    }
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      project.closingPrice && !mentorStatus.isRestricted
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transform hover:scale-105"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Award size={18} />
                    <span>Accept Project</span>
                  </button>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Pricing Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Opening Price:</span>
                    <span className="text-green-400 font-medium">
                      {formatPrice(project.openingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Negotiated Price:</span>
                    <span className="text-yellow-400 font-medium">
                      {calculateNegotiatedPrice(project) > 0
                        ? `₹${calculateNegotiatedPrice(
                            project
                          ).toLocaleString()}`
                        : "No pitches"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Closing Price:</span>
                    <span className="text-purple-400 font-medium">
                      {project.closingPrice
                        ? formatPrice(project.closingPrice)
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pitch Modal */}
        {showPitchModal && (
          <PitchModal
            project={project}
            onClose={() => setShowPitchModal(false)}
            API_URL={API_URL}
            onToast={showToast}
          />
        )}

        {/*Show Requests Modal */}
        {showRequestsModal && (
          <ShowRequestsModal
            project={project}
            onClose={() => setShowRequestsModal(false)}
            API_URL={API_URL}
            showToast={showToast}
          />
        )}

        {/* Accept Confirmation Modal */}
        {showAcceptConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4">
                  Confirm Project Acceptance
                </h3>
                <p className="text-gray-300 mb-4">
                  By accepting this project, you commit to complete it. Type{" "}
                  <span className="text-cyan-400 font-semibold">
                    "i m ready"
                  </span>{" "}
                  to confirm:
                </p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Type exactly: i m ready"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all mb-4"
                />
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowAcceptConfirm(false);
                      setConfirmationText("");
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmTakeProject}
                    disabled={confirmationText !== "i m ready"}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
                  >
                    Accept Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Toast />
      </div>
    </div>
  );
};

export default MentorDetailedProjectView;
