import React from "react";
import {
  Eye,
  Users,
  Calendar,
  Monitor,
  Smartphone,
  Bot,
  Database,
  Cloud,
  Network,
  Cpu,
  Gamepad2,
  Palette,
  Shield,
  Code,
  DollarSign,
  Clock,
  TrendingUp,
  BookOpen,
  Target,
  Zap,
  AlertCircle,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

const ProjectOverview = ({ project, API_URL }) => {
  // Category icons mapping
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

  // Difficulty level colors
  const getDifficultyColor = (level) => {
    const colors = {
      Beginner: "from-green-500 to-emerald-500",
      Intermediate: "from-yellow-500 to-orange-500",
      Advanced: "from-red-500 to-pink-500",
    };
    return colors[level] || "from-gray-500 to-slate-500";
  };

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      Open: "from-blue-500 to-cyan-500",
      "In Progress": "from-purple-500 to-pink-500",
      Completed: "from-green-500 to-emerald-500",
      Cancelled: "from-gray-500 to-slate-500",
    };
    return colors[status] || "from-gray-500 to-slate-500";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price
  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div className="xl:col-span-2 space-y-6">
      {/* Project Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl self-start">
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
            <DollarSign className="mx-auto mb-2 text-green-400" size={20} />
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
            <div className="text-xs sm:text-sm text-gray-300">Duration</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
            <TrendingUp className="mx-auto mb-2 text-purple-400" size={20} />
            <div className="text-base sm:text-lg font-bold text-white">
              {project.progressPercentage}%
            </div>
            <div className="text-xs sm:text-sm text-gray-300">Progress</div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
            <BookOpen className="mr-2 text-blue-400 flex-shrink-0" size={18} />
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
            <Code className="mr-2 text-green-400 flex-shrink-0" size={18} />
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
              <Zap className="mr-2 text-yellow-400 flex-shrink-0" size={16} />
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

      {/* Pricing Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <DollarSign className="mr-2 text-green-400" size={20} />
          Pricing Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">
              {formatPrice(project.openingPrice, project.currency)}
            </div>
            <div className="text-sm text-gray-300">Opening Price</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400">
              {project.pitches && project.pitches.length > 0
                ? `₹${Math.round(
                    project.pitches.reduce(
                      (sum, pitch) => sum + pitch.price,
                      0
                    ) / project.pitches.length
                  ).toLocaleString()}`
                : "No pitches yet"}
            </div>
            <div className="text-sm text-gray-300">Negotiated Price</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-purple-400">
              {project.closingPrice
                ? formatPrice(project.closingPrice, project.currency)
                : "Not set"}
            </div>
            <div className="text-sm text-gray-300">Final Price</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Calendar className="mr-2 text-blue-400" size={20} />
          Project Timeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {formatDate(project.startDate)}
            </div>
            <div className="text-sm text-gray-300">Start Date</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {formatDate(project.expectedEndDate)}
            </div>
            <div className="text-sm text-gray-300">Expected End</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {formatDate(project.actualEndDate)}
            </div>
            <div className="text-sm text-gray-300">Actual End</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
