import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Star,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Code,
  TrendingUp,
  Award,
  MapPin,
  Zap,
  Target,
  BookOpen,
  Sparkles,
} from "lucide-react";

const ProjectCard = ({ project, API_URL }) => {
  const [learnerData, setLearnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearnerDetails();
  }, [project.learnerId._id]);

  const fetchLearnerDetails = async () => {
    try {
      setLoading(true);

      const learnerResponse = await axios.get(
        `${API_URL}/api/mentor-details/learner/${project.learnerId._id}`,
        { withCredentials: true }
      );

      if (learnerResponse.data.success) {
        setLearnerData(learnerResponse.data.learner);
      }
    } catch (error) {
      console.error("Error fetching learner details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          color: "from-green-500/20 to-emerald-500/20",
          textColor: "text-green-300",
          borderColor: "border-green-500/40",
          icon: CheckCircle,
          bgGlow: "shadow-green-500/25",
        };
      case "cancelled":
        return {
          color: "from-red-500/20 to-rose-500/20",
          textColor: "text-red-300",
          borderColor: "border-red-500/40",
          icon: XCircle,
          bgGlow: "shadow-red-500/25",
        };
      case "in progress":
        return {
          color: "from-blue-500/20 to-cyan-500/20",
          textColor: "text-blue-300",
          borderColor: "border-blue-500/40",
          icon: Clock,
          bgGlow: "shadow-blue-500/25",
        };
      case "open":
        return {
          color: "from-yellow-500/20 to-amber-500/20",
          textColor: "text-yellow-300",
          borderColor: "border-yellow-500/40",
          icon: AlertTriangle,
          bgGlow: "shadow-yellow-500/25",
        };
      default:
        return {
          color: "from-gray-500/20 to-slate-500/20",
          textColor: "text-gray-300",
          borderColor: "border-gray-500/40",
          icon: Clock,
          bgGlow: "shadow-gray-500/25",
        };
    }
  };

  const getDifficultyConfig = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return { color: "text-green-400", icon: "🟢" };
      case "intermediate":
        return { color: "text-yellow-400", icon: "🟡" };
      case "advanced":
      case "expert":
        return { color: "text-red-400", icon: "🔴" };
      default:
        return { color: "text-gray-400", icon: "⚪" };
    }
  };

  const formatPrice = (price, currency = "INR") => {
    if (!price || price === 0) return "Free";

    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return formattedPrice;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statusConfig = getStatusConfig(project.status);
  const difficultyConfig = getDifficultyConfig(project.difficultyLevel);
  const StatusIcon = statusConfig.icon;

  if (loading) {
    return (
      <div className="relative group w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-700/50 animate-pulse h-full">
          <div className="flex flex-col space-y-4">
            {/* Header skeleton */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-700/50 rounded-xl flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                <div className="h-4 sm:h-5 bg-slate-700/50 rounded-lg w-3/4"></div>
                <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-1/2"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 sm:h-6 bg-slate-700/50 rounded-full w-12 sm:w-16"></div>
                  <div className="h-5 sm:h-6 bg-slate-700/50 rounded-full w-16 sm:w-20"></div>
                </div>
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full">
      {/* Hover glow effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${statusConfig.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm ${statusConfig.bgGlow}`}
      ></div>

      {/* Main card container */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-300 overflow-hidden group-hover:transform group-hover:scale-[1.02] h-full flex flex-col">
        {/* Subtle gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${statusConfig.color} opacity-30 pointer-events-none`}
        />

        <div className="relative p-4 sm:p-5 lg:p-6 flex flex-col h-full">
          {/* Project Header */}
          <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-5 lg:mb-6">
            {/* Project Thumbnail */}
            <div className="relative group/thumb flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 ring-2 ring-slate-600/50 group-hover/thumb:ring-blue-400/50 transition-all duration-300">
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = `${
                      import.meta.env.VITE_API_URL
                    }/uploads/public/default-project.jpg`;
                  }}
                />
              </div>
              {/* Project type indicator */}
              <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                <Code className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors duration-300 line-clamp-2 pr-2">
                  {project.name}
                </h3>

                {/* Status Badge */}
                <div
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold border flex items-center space-x-1 backdrop-blur-sm ${statusConfig.color} ${statusConfig.textColor} ${statusConfig.borderColor} flex-shrink-0`}
                >
                  <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline truncate max-w-[60px] lg:max-w-none">
                    {project.status}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                {project.shortDescription}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.techStack.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-md sm:rounded-lg text-xs font-medium border border-cyan-500/30 hover:border-cyan-400/50 transition-colors duration-200 truncate max-w-[80px] sm:max-w-[100px] lg:max-w-[120px]"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-700/50 text-slate-300 rounded-md sm:rounded-lg text-xs font-medium border border-slate-600/50 flex-shrink-0">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Learner Info */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 lg:mb-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-slate-600/50">
                  {learnerData?.userId?.avatar ? (
                    <img
                      src={
                        learnerData.userId.avatar.startsWith("/uploads/")
                          ? `${API_URL}${learnerData.userId.avatar}`
                          : learnerData.userId.avatar
                      }
                      alt={learnerData.userId.name || "Learner"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                {/* Online status */}
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>

              {/* Name + Title + Rating */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-xs sm:text-sm truncate">
                      {learnerData?.userId?.name || "Anonymous Learner"}
                    </h4>
                    <p className="text-blue-300 text-xs flex items-center gap-1 truncate">
                      <BookOpen className="w-3 h-3 flex-shrink-0" />
                      <span>{learnerData?.title || "Student"}</span>
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 bg-slate-700/50 px-2 py-1 rounded-lg flex-shrink-0">
                    <Star className="text-yellow-400 fill-yellow-400 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-white text-xs font-medium">
                      {learnerData?.rating || "0.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
            {/* Category */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-0">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Category </span>
              </div>
              <span className="text-white font-medium text-xs truncate">
                {project.category}
              </span>
            </div>

            {/* Level */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-0">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Level</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">{difficultyConfig.icon}</span>
                <span
                  className={`font-medium text-xs ${difficultyConfig.color} truncate`}
                >
                  {project.difficultyLevel}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-0">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Duration</span>
              </div>
              <span className="text-white font-medium text-xs truncate">
                {project.duration}
              </span>
            </div>

            {/* Budget */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 sm:p-3 bg-slate-800/40 rounded-lg">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1 sm:mb-0">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-xs">Budget</span>
              </div>
              <span className="text-green-400 font-semibold text-xs truncate">
                {formatPrice(
                  project.closingPrice ||
                    project.negotiatedPrice ||
                    project.openingPrice,
                  project.currency
                )}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-2 text-xs text-slate-400 p-3 bg-slate-800/30 rounded-lg border-t border-slate-700/50 mb-4 sm:mb-5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                Started: {formatDate(project.startDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {project.status === "Completed"
                  ? `Completed: ${formatDate(project.actualEndDate)}`
                  : `Expected: ${formatDate(project.expectedEndDate)}`}
              </span>
            </div>
          </div>

          {/* Progress Bar (for In Progress projects) */}
          {project.status === "In Progress" && (
            <div className="p-3 sm:p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 mb-4">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white font-medium">
                    Progress
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-blue-300 font-bold">
                    {project.progressPercentage || 0}%
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <div className="relative w-full bg-slate-700/50 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${project.progressPercentage || 0}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Completed Badge */}
          {project.status === "Completed" && (
            <div className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/30 mt-auto">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-green-300 font-medium text-xs sm:text-sm">
                Successfully Completed
              </span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
