import React from "react";
import {
  User,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Target,
  GraduationCap,
  Badge,
} from "lucide-react";

const UserProjectCard = ({ projectData, apprenticeData }) => {
  if (!projectData || !apprenticeData) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No project data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (projectData.closingPrice !== null) return projectData.closingPrice;
    if (projectData.negotiatedPrice !== null)
      return projectData.negotiatedPrice;
    return projectData.openingPrice;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-900/30 border-green-600/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-600/30";
      case "advanced":
        return "text-red-400 bg-red-900/30 border-red-600/30";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-600/30";
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <User className="mr-3 text-cyan-400" size={28} />
            My Apprentice
          </h3>
        </div>

        {/* Apprentice Profile */}
        <div className="mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <img
                src={apprenticeData.avatar || "/uploads/public/default.jpg"}
                alt={apprenticeData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
              />
              {apprenticeData.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-1">
                {apprenticeData.name}
              </h4>
              <p className="text-gray-300 text-sm mb-2">
                {apprenticeData.title || "Learner"}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-white font-medium">
                    {apprenticeData.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                {apprenticeData.location && (
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{apprenticeData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apprentice Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Level</span>
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 text-cyan-400 mr-1" />
                  <span className="text-white font-medium">
                    {apprenticeData.level || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">XP</span>
                <span className="text-white font-medium">
                  {apprenticeData.xp || 0}
                </span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Sessions</span>
                <span className="text-white font-medium">
                  {apprenticeData.completedSessions || 0}
                </span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Streak</span>
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-orange-400 mr-1" />
                  <span className="text-white font-medium">
                    {apprenticeData.streakDays || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="border-t border-gray-700/50 pt-6">
          <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Badge className="mr-2 text-teal-400" size={20} />
            Project Details
          </h5>

          <div className="space-y-4">
            {/* Project Name & Description */}
            <div>
              <h6 className="text-white font-medium mb-2 line-clamp-2">
                {projectData.name}
              </h6>
              <p className="text-gray-400 text-sm line-clamp-3">
                {projectData.shortDescription}
              </p>
            </div>

            {/* Project Metadata */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-gray-400 text-sm">Project Value</span>
                </div>
                <span className="text-white font-medium">
                  {projectData.currency} {formatPrice()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-gray-400 text-sm">Duration</span>
                </div>
                <span className="text-white font-medium">
                  {projectData.duration}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-gray-400 text-sm">Started</span>
                </div>
                <span className="text-white font-medium">
                  {formatDate(projectData.startDate)}
                </span>
              </div>

              {projectData.expectedEndDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-gray-400 text-sm">Expected End</span>
                  </div>
                  <span className="text-white font-medium">
                    {formatDate(projectData.expectedEndDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Difficulty Level */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Difficulty</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getSkillLevelColor(
                  projectData.difficultyLevel
                )}`}
              >
                {projectData.difficultyLevel}
              </span>
            </div>

            {/* Tech Stack */}
            {projectData.techStack && projectData.techStack.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm block mb-2">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {projectData.techStack.slice(0, 4).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-lg border border-cyan-600/30"
                    >
                      {tech}
                    </span>
                  ))}
                  {projectData.techStack.length > 4 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg border border-gray-600">
                      +{projectData.techStack.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Project Category */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Category</span>
              <span className="text-white text-sm">{projectData.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProjectCard;
