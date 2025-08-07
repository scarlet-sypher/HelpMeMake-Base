import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const ShortProjectView = ({ project, onApply = null }) => {
  //   console.log("Learner avatar:", project?.learner?.avatar);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(project.hasApplied || false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposedPrice: "",
    coverLetter: "",
    estimatedDuration: "",
  });

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

  // Get difficulty color
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

  // Format price
  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const handleViewProject = () => {
    window.location.href = `/mentor/project/${project._id}`;
  };

  const handleViewProfile = () => {
    if (project.learner?.userId) {
      window.location.href = `/mentor/user/${project.learner.userId}`;
    } else {
      console.error("User ID not found for this project learner");
    }
  };

  const handleApplyClick = () => {
    if (hasApplied) return;
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async () => {
    if (
      !applicationData.proposedPrice ||
      !applicationData.coverLetter ||
      !applicationData.estimatedDuration
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsApplying(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      // Use fetch instead of axios for the demo
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

        alert("Application submitted successfully!");
      }
    } catch (error) {
      console.error("Application error:", error);
      alert(data.message || "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      {/* Project Card */}
      <div className="group relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] z-0">
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

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

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {formatPrice(project.openingPrice)}
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                project.difficultyLevel
              )}`}
            >
              {project.difficultyLevel}
            </div>
          </div>

          {/* Application Status Badge */}
          {hasApplied && (
            <div className="absolute bottom-4 right-4 bg-green-500/80 text-green-100 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <CheckCircle2 size={12} className="mr-1" />
              Applied
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
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {project.name}
          </h3>

          {/* Short Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Learner Info */}
          {project.learner && (
            <div className="mb-4 bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                  {project.learner.avatar ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${
                        project?.learner?.avatar
                      }`}
                      alt={project.learner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    project.learner.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    {project.learner.name}
                  </p>
                  <div className="flex items-center text-xs text-gray-400">
                    {project.learner.title && (
                      <>
                        <span>{project.learner.title}</span>
                        {project.learner.location && (
                          <span className="mx-1">•</span>
                        )}
                      </>
                    )}
                    {project.learner.location && (
                      <span className="flex items-center">
                        <MapPin size={10} className="mr-1" />
                        {project.learner.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Code size={16} className="text-cyan-400 mr-2" />
              <span className="text-sm font-medium text-cyan-300">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-400/30"
                >
                  {tech}
                </span>
              ))}
              {project.techStack?.length > 3 && (
                <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full border border-gray-400/30">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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

            {/* Applications Count */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <Users size={14} className="text-orange-400 mr-2" />
                <span className="text-xs text-orange-300 font-medium">
                  Applications
                </span>
              </div>
              <p className="text-sm text-white font-semibold">
                {project.applicationsCount || 0}
              </p>
            </div>

            {/* Views */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-1">
                <Eye size={14} className="text-blue-400 mr-2" />
                <span className="text-xs text-blue-300 font-medium">Views</span>
              </div>
              <p className="text-sm text-white font-semibold">
                {project.viewCount || 0}
              </p>
            </div>
          </div>

          {/* Project Date */}
          {project.createdAt && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-3 border border-white/10 mb-6">
              <div className="flex items-center text-xs">
                <Calendar size={12} className="text-indigo-400 mr-1" />
                <span className="text-indigo-300">
                  Posted: {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-3 flex-1">
              {/* View Project Button */}
              <button
                onClick={handleViewProject}
                className="group/btn flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                <Eye
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform"
                />
                <span className="text-xs sm:text-sm">View Project</span>
              </button>

              {/* View Profile Button */}
              <button
                onClick={handleViewProfile}
                className="group/btn flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                <User
                  size={16}
                  className="group-hover/btn:rotate-12 transition-transform"
                />
                <span className="text-xs sm:text-sm">View Profile</span>
              </button>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyClick}
              disabled={hasApplied}
              className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto ${
                hasApplied
                  ? "bg-green-500/20 text-green-300 border border-green-400/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white hover:shadow-emerald-500/25"
              }`}
            >
              <span className="text-xs sm:text-sm">
                {hasApplied ? "Applied" : "Apply"}
              </span>
            </button>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl pointer-events-none"></div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
            {/* Animated background elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl mr-4">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Apply to Project
                  </h3>
                  <p className="text-cyan-300 text-sm">{project.name}</p>
                </div>
              </div>

              {/* Application Form */}
              <div className="space-y-4">
                <div>
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>

                <div>
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>

                <div>
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowApplicationModal(false);
                    setApplicationData({
                      proposedPrice: "",
                      coverLetter: "",
                      estimatedDuration: "",
                    });
                  }}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
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
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
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
