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
  Star,
  Award,
  Lightbulb,
  Activity,
  Layers,
} from "lucide-react";

const ProjectOverview = ({ project, API_URL, onToast }) => {
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
      Beginner: "from-emerald-400 via-green-500 to-teal-600",
      Intermediate: "from-amber-400 via-orange-500 to-red-500",
      Advanced: "from-red-500 via-pink-500 to-purple-600",
    };
    return colors[level] || "from-slate-400 via-gray-500 to-slate-600";
  };

  const getStatusColor = (status) => {
    const colors = {
      Open: "from-blue-400 via-cyan-500 to-teal-500",
      "In Progress": "from-purple-400 via-pink-500 to-rose-500",
      Completed: "from-green-400 via-emerald-500 to-teal-600",
      Cancelled: "from-gray-400 via-slate-500 to-stone-500",
    };
    return colors[status] || "from-gray-400 via-slate-500 to-stone-500";
  };

  const getDifficultyIcon = (level) => {
    const icons = {
      Beginner: Star,
      Intermediate: Award,
      Advanced: Activity,
    };
    return icons[level] || Star;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "from-emerald-400 to-green-500";
    if (percentage >= 60) return "from-blue-400 to-cyan-500";
    if (percentage >= 40) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-pink-500";
  };

  const CategoryIcon = getCategoryIcon(project.category);
  const DifficultyIcon = getDifficultyIcon(project.difficultyLevel);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-4 lg:px-0">
      {/* Hero Project Overview Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-700 group">
        {/* Animated background gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div> */}

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 flex-1 min-w-0">
              {/* Category Icon */}
              <div className="relative group/icon flex-shrink-0 self-start">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl blur-lg opacity-50 group-hover/icon:opacity-75 transition-opacity duration-300"></div>
                <div className="relative p-2 sm:p-3 md:p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl transform transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3">
                  <CategoryIcon
                    className="text-white"
                    size={
                      window.innerWidth < 640
                        ? 20
                        : window.innerWidth < 768
                        ? 24
                        : 28
                    }
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight break-words">
                  {project.name}
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed break-words mb-3 sm:mb-4">
                  {project.shortDescription}
                </p>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                  <Calendar size={12} className="flex-shrink-0" />
                  <span className="truncate">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status & Difficulty Badges */}
            <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 flex-shrink-0">
              <div
                className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r ${getStatusColor(
                  project.status
                )} text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm lg:text-base font-bold text-center whitespace-nowrap shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <Activity size={window.innerWidth < 640 ? 12 : 16} />
                  <span className="truncate">{project.status}</span>
                </div>
              </div>
              <div
                className={`flex-1 sm:flex-none px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r ${getDifficultyColor(
                  project.difficultyLevel
                )} text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm lg:text-base font-bold text-center whitespace-nowrap shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                  <DifficultyIcon size={window.innerWidth < 640 ? 12 : 16} />
                  <span className="truncate">{project.difficultyLevel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {/* Opening Price */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20 hover:border-emerald-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <DollarSign
                    className="text-white"
                    size={window.innerWidth < 640 ? 18 : 24}
                  />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 break-words">
                  {formatPrice(project.openingPrice, project.currency)}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Opening Price
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Clock
                    className="text-white"
                    size={window.innerWidth < 640 ? 18 : 24}
                  />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 break-words">
                  {project.duration}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Duration
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20 hover:border-purple-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${getProgressColor(
                    project.progressPercentage
                  )} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <TrendingUp
                    className="text-white"
                    size={window.innerWidth < 640 ? 18 : 24}
                  />
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                  {project.progressPercentage}%
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Progress
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                Project Completion
              </span>
              <span className="text-xs sm:text-sm font-bold text-white">
                {project.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden border border-white/20">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor(
                  project.progressPercentage
                )} transition-all duration-1000 ease-out rounded-full shadow-lg`}
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Project Description */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <BookOpen
                  className="text-white"
                  size={window.innerWidth < 640 ? 14 : 18}
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Project Description
              </h3>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base lg:text-lg break-words">
                {project.fullDescription}
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <Code
                  className="text-white"
                  size={window.innerWidth < 640 ? 14 : 18}
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Tech Stack
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {project.techStack.map((tech, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-lg sm:rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative inline-flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 backdrop-blur-sm text-green-300 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-medium border border-green-500/30 hover:border-green-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg break-words">
                    <Layers
                      size={window.innerWidth < 640 ? 12 : 14}
                      className="mr-1 sm:mr-2 flex-shrink-0"
                    />
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {tech}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Outcome & Motivation Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Expected Outcome */}
            <div className="flex flex-col">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <Target
                    className="text-white"
                    size={window.innerWidth < 640 ? 14 : 18}
                  />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  Expected Outcome
                </h3>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 flex-1 min-h-0">
                <p className="text-gray-200 text-xs sm:text-sm lg:text-base leading-relaxed break-words">
                  {project.projectOutcome}
                </p>
              </div>
            </div>

            {/* Motivation */}
            <div className="flex flex-col">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <Lightbulb
                    className="text-white"
                    size={window.innerWidth < 640 ? 14 : 18}
                  />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  Motivation
                </h3>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 flex-1 min-h-0">
                <p className="text-gray-200 text-xs sm:text-sm lg:text-base leading-relaxed break-words">
                  {project.motivation}
                </p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          {project.prerequisites && project.prerequisites.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <AlertCircle
                    className="text-white"
                    size={window.innerWidth < 640 ? 14 : 18}
                  />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  Prerequisites
                </h3>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
                <div className="space-y-2 sm:space-y-3">
                  {project.prerequisites.map((prereq, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 sm:space-x-3 group"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                        <CheckCircle
                          className="text-white"
                          size={window.innerWidth < 640 ? 10 : 12}
                        />
                      </div>
                      <span className="text-gray-200 text-xs sm:text-sm lg:text-base leading-relaxed break-words group-hover:text-white transition-colors duration-200 flex-1">
                        {prereq}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* References */}
          {project.references && project.references.length > 0 && (
            <div>
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <ExternalLink
                    className="text-white"
                    size={window.innerWidth < 640 ? 14 : 18}
                  />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  References
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {project.references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative overflow-hidden"
                    onClick={() =>
                      onToast &&
                      onToast({
                        message: `Opening reference: ${ref.title}`,
                        status: "info",
                      })
                    }
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0 mr-2 sm:mr-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          <ExternalLink
                            className="text-white"
                            size={window.innerWidth < 640 ? 14 : 18}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1 break-words group-hover:text-cyan-300 transition-colors duration-200 line-clamp-2">
                            {ref.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 break-words truncate">
                            {ref.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/10 rounded-md sm:rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                          <ExternalLink
                            className="text-cyan-400"
                            size={window.innerWidth < 640 ? 12 : 16}
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Pricing Information */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
              <DollarSign
                className="text-white"
                size={window.innerWidth < 640 ? 18 : 24}
              />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Pricing Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Opening Price */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <DollarSign
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2 break-all">
                    {formatPrice(project.openingPrice, project.currency)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Opening Price
                  </div>
                </div>
              </div>
            </div>

            {/* Negotiated Price */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <TrendingUp
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-400 mb-1 sm:mb-2 break-all">
                    {project.pitches && project.pitches.length > 0
                      ? `₹${Math.round(
                          project.pitches.reduce(
                            (sum, pitch) => sum + pitch.price,
                            0
                          ) / project.pitches.length
                        ).toLocaleString()}`
                      : "No pitches"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Negotiated Price
                  </div>
                </div>
              </div>
            </div>

            {/* Final Price */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <Award
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-400 mb-1 sm:mb-2 break-all">
                    {project.closingPrice
                      ? formatPrice(project.closingPrice, project.currency)
                      : "Not set"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Final Price
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Timeline */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-700 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
              <Calendar
                className="text-white"
                size={window.innerWidth < 640 ? 18 : 24}
              />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Project Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Start Date */}
            <div className="group text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <Calendar
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-400 mb-1 sm:mb-2 break-all">
                    {formatDate(project.startDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Start Date
                  </div>
                </div>
              </div>
            </div>

            {/* Expected End */}
            <div className="group text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <Clock
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-yellow-400 mb-1 sm:mb-2 break-all">
                    {formatDate(project.expectedEndDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Expected End
                  </div>
                </div>
              </div>
            </div>

            {/* Actual End */}
            <div className="group text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 transform transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle
                      className="text-white"
                      size={window.innerWidth < 640 ? 16 : 20}
                    />
                  </div>
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-green-400 mb-1 sm:mb-2 break-all">
                    {formatDate(project.actualEndDate)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 font-medium">
                    Actual End
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
