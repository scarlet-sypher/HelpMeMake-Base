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

      // Fetch learner data using learnerId
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "in progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "open":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      case "in progress":
        return <Clock size={14} />;
      case "open":
        return <AlertTriangle size={14} />;
      default:
        return <Clock size={14} />;
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

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-600/30 rounded-xl"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-600/30 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600/30 rounded w-1/2"></div>
            <div className="h-3 bg-gray-600/30 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105">
      {/* Project Header */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Project Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500">
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
              e.currentTarget.src = `${
                import.meta.env.VITE_API_URL
              }/uploads/public/default-project.jpg`;
            }}
          />
        </div>

        {/* Project Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white leading-tight">
              {project.name}
            </h3>
            <div
              className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
                project.status
              )}`}
            >
              {getStatusIcon(project.status)}
              <span>{project.status}</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">
            {project.shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded text-xs border border-green-500/30"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Learner Information */}
      <div className="bg-white/5 rounded-xl p-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
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
              <User className="text-white" size={16} />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-semibold text-sm">
                  {learnerData?.userId?.name || "Anonymous Learner"}
                </h4>
                <p className="text-blue-300 text-xs">
                  {learnerData?.title || "Student"}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <Star className="text-yellow-400" size={12} />
                <span className="text-white text-sm font-medium">
                  {learnerData?.rating || "0.0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Category:</span>
            <span className="text-white font-medium">{project.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Difficulty:</span>
            <span
              className={`font-medium ${
                project.difficultyLevel === "Beginner"
                  ? "text-green-300"
                  : project.difficultyLevel === "Intermediate"
                  ? "text-yellow-300"
                  : "text-red-300"
              }`}
            >
              {project.difficultyLevel}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Duration:</span>
            <span className="text-white font-medium">{project.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Price:</span>
            <span className="text-green-300 font-semibold">
              {formatPrice(
                project.closingPrice ||
                  project.negotiatedPrice ||
                  project.openingPrice,
                project.currency
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
        <div className="flex items-center space-x-1">
          <Calendar size={12} />
          <span>Started: {formatDate(project.startDate)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar size={12} />
          <span>
            {project.status === "Completed"
              ? `Completed: ${formatDate(project.actualEndDate)}`
              : `Expected: ${formatDate(project.expectedEndDate)}`}
          </span>
        </div>
      </div>

      {/* Progress Bar (if in progress) */}
      {project.status === "In Progress" && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300">Progress</span>
            <span className="text-xs text-white font-medium">
              {project.progressPercentage || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progressPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
