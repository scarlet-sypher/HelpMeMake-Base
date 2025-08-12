import React from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  Target,
  Star,
  CheckCircle,
  Circle,
} from "lucide-react";

const LearnerProjectProfile = ({ activeProject }) => {
  if (!activeProject) return null;

  const learner = activeProject.learnerId?.userId || activeProject.learnerId;
  const project = activeProject;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get avatar URL
  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";
    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  // Calculate progress
  const progressPercentage = project.progressPercentage || 0;
  const completedMilestones = project.completedMilestones || 0;
  const totalMilestones = project.totalMilestones || 0;

  return (
    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden mx-2 sm:mx-0">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-400/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full lg:w-auto">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex-shrink-0">
              <User className="text-white" size={20} />
            </div>
            <div className="min-w-0 flex-1 lg:flex-initial">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-1">
                Current Mentoring Project
              </h2>
              <p className="text-cyan-200 text-xs sm:text-base">
                Active learner and project information
              </p>
            </div>
          </div>

          {/* Project Status Badge */}
          <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 self-start lg:self-auto">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="font-medium text-sm sm:text-base capitalize">
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Learner Profile */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
              <div className="relative flex-shrink-0">
                <img
                  src={getAvatarUrl(learner?.avatar)}
                  alt={learner?.name || "Learner"}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-cyan-400/50 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                  {learner?.name || "Unknown Learner"}
                </h3>
                <div className="flex items-center justify-center sm:justify-start text-cyan-200 text-xs sm:text-sm mb-2">
                  <Mail size={12} className="mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {learner?.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start flex-wrap gap-3 sm:gap-4 text-xs">
                  <div className="flex items-center space-x-1 text-yellow-300">
                    <Star size={10} className="fill-current flex-shrink-0" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center space-x-1 text-cyan-300">
                    <Calendar size={10} className="flex-shrink-0" />
                    <span>Joined {formatDate(project.startDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-teal-500/20 rounded-lg flex-shrink-0">
                <BookOpen className="text-teal-300 sm:w-5 sm:h-5" size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {project.name}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mt-1">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-300">
                    Progress
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-cyan-300">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-cyan-300">
                    {completedMilestones}/{totalMilestones}
                  </div>
                  <div className="text-xs text-gray-400">Milestones</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-teal-300">
                    {project.expectedEndDate
                      ? Math.max(
                          0,
                          Math.ceil(
                            (new Date(project.expectedEndDate) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">Days Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Timeline */}
        <div className="mt-4 sm:mt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-3 lg:space-y-0 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="text-cyan-400 flex-shrink-0" size={14} />
              <span className="text-gray-300">
                Started: {formatDate(project.startDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="text-teal-400 flex-shrink-0" size={14} />
              <span className="text-gray-300">
                Target: {formatDate(project.expectedEndDate)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-initial px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-cyan-300 rounded-lg transition-colors">
              View Project
            </button>
            <button className="flex-1 sm:flex-initial px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-teal-300 rounded-lg transition-colors">
              Message Learner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProjectProfile;
