import React, { useState } from "react";
import {
  User,
  Calendar,
  DollarSign,
  Code,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MentorMilestoneList from "./MentorMilestoneList";

const MentorProjectCard = ({
  project,
  verifyMilestone,
  unverifyMilestone,
  updateMilestone,
  addReviewNote,
  saving,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `$${price.toLocaleString()}`;
  };

  const getCompletionPercentage = () => {
    if (!project.milestones || project.milestones.length === 0) return 0;
    const completed = project.milestones.filter(
      (m) =>
        m.learnerVerification?.isVerified && m.mentorVerification?.isVerified
    ).length;
    return Math.round((completed / project.milestones.length) * 100);
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads/")) return `${API_URL}${imagePath}`;
    return `${API_URL}/uploads/${imagePath}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Project Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Project Image */}
          <div className="flex-shrink-0">
            {project.thumbnail ? (
              <img
                src={getImageUrl(project.thumbnail)}
                alt={project.name}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-2 border-cyan-400/30"
              />
            ) : (
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center border-2 border-cyan-400/30">
                <Code className="text-white" size={32} />
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 break-words">
                  {project.name}
                </h2>
                <p className="text-cyan-200 mb-4 break-words">
                  {project.shortDescription}
                </p>

                {/* Project Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Student Info */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="text-cyan-400" size={14} />
                      <span className="text-xs text-cyan-200 font-medium">
                        Student
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.learnerId?.avatar && (
                        <img
                          src={getImageUrl(project.learnerId.avatar)}
                          alt={project.learnerId.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-white font-medium text-sm break-words">
                        {project.learnerId?.name || "Student"}
                      </span>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="text-green-400" size={14} />
                      <span className="text-xs text-green-200 font-medium">
                        Due Date
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {project.expectedEndDate
                        ? formatDate(project.expectedEndDate)
                        : "Not set"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="text-yellow-400" size={14} />
                      <span className="text-xs text-yellow-200 font-medium">
                        Price
                      </span>
                    </div>
                    <span className="text-white font-medium text-sm">
                      {formatPrice(project.closingPrice)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="text-purple-400" size={14} />
                      <span className="text-xs text-purple-200 font-medium">
                        Progress
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium text-sm">
                        {getCompletionPercentage()}%
                      </span>
                      <div className="flex-1 bg-white/20 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${getCompletionPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {project.skills && project.skills.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-teal-600/20 backdrop-blur-sm rounded-lg border border-cyan-400/30 text-cyan-300 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 5 && (
                        <span className="px-2 py-1 bg-white/10 rounded-lg text-gray-300 text-xs">
                          +{project.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-teal-600/20 backdrop-blur-sm rounded-xl border border-cyan-400/30 text-cyan-300 hover:from-cyan-500/30 hover:to-teal-600/30 transition-all flex-shrink-0"
              >
                <span className="text-sm font-medium">
                  {isExpanded ? "Hide" : "Show"} Milestones
                </span>
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      {isExpanded && (
        <div className="p-6">
          <MentorMilestoneList
            milestones={project.milestones || []}
            projectId={project._id}
            verifyMilestone={verifyMilestone}
            unverifyMilestone={unverifyMilestone}
            updateMilestone={updateMilestone}
            addReviewNote={addReviewNote}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
};

export default MentorProjectCard;
