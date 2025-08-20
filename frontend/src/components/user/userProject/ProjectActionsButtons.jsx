import React from "react";
import {
  Users,
  User,
  Bot,
  Award,
  MessageCircle,
  TrendingUp,
  Image,
  Sparkles,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Target,
  Zap,
} from "lucide-react";

const ProjectActionsButtons = ({
  project,
  setProject,
  setShowMentorSelection,
  handleAIMentorSelection,
  API_URL,
  formatPrice,
  formatDate,
  onToast,
}) => {
  const handleManualMentorSelection = () => {
    onToast?.({ message: "Opening mentor selection...", status: "info" });
    setShowMentorSelection(true);
  };

  const handleAISelection = () => {
    onToast?.({
      message: "🤖 AI is analyzing your project for perfect mentor matches...",
      status: "info",
    });
    handleAIMentorSelection();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Buttons - Only show if project is Open and no mentor assigned */}
      {project.status === "Open" && !project.mentorId && (
        <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-500 hover:shadow-purple-500/20">
          <div className="flex items-center mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Users className="text-white" size={20} />
            </div>
            <div className="ml-3 sm:ml-4">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Find Your Perfect Mentor
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Choose your preferred selection method
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleManualMentorSelection}
              className="w-full group/btn px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                <User
                  size={18}
                  className="group-hover/btn:rotate-12 transition-transform duration-300"
                />
                <span className="text-sm sm:text-base">
                  Browse & Select Manually
                </span>
              </div>
            </button>

            <button
              onClick={handleAISelection}
              className="group/ai relative w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-400 hover:to-red-400 text-white rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover/ai:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
                <Bot
                  size={18}
                  className="animate-pulse group-hover/ai:animate-spin text-white drop-shadow-lg"
                />
                <span className="text-sm sm:text-base tracking-wide">
                  AI-Powered Smart Match
                </span>
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-orange-400/30 to-yellow-400/30 text-yellow-100 rounded-md sm:rounded-lg text-xs font-bold shadow-inner animate-bounce">
                  <Sparkles size={12} className="animate-pulse" />
                  <span className="hidden sm:inline">NEW</span>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
            <div className="flex items-start space-x-2">
              <Zap size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
                <span className="font-semibold text-blue-100">Pro Tip:</span>{" "}
                Both options let you send personalized requests. AI analyzes
                your project requirements for optimal mentor matching.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Status Updates */}
      {project.mentorId && (
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 hover:border-green-400/30 transition-all duration-500">
          <div className="flex items-center mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Award className="text-white" size={20} />
            </div>
            <div className="ml-3 sm:ml-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Project Status
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Active collaboration
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-gray-300">
                  Status
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${
                  project.status === "In Progress"
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/30"
                    : project.status === "Completed"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-400/30"
                    : "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-400/30"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <span className="text-sm font-medium text-gray-300">
                  Mentor Assigned
                </span>
              </div>
              <span className="text-green-300 font-semibold text-sm">Yes</span>
            </div>

            {project.startDate && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Started
                  </span>
                </div>
                <span className="text-white font-medium text-sm">
                  {formatDate(project.startDate)}
                </span>
              </div>
            )}

            {project.expectedEndDate && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Expected End
                  </span>
                </div>
                <span className="text-white font-medium text-sm">
                  {formatDate(project.expectedEndDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications */}
      {project.applications && project.applications.length > 0 && (
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg">
                <MessageCircle className="text-white" size={20} />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Applications
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Mentor interest
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold border border-green-400/30">
              {project.applications.length}
            </div>
          </div>

          <div className="space-y-3">
            {project.applications.slice(0, 3).map((application, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-white text-sm sm:text-base">
                    Mentor Application
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold border ${
                      application.applicationStatus === "Pending"
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/30"
                        : application.applicationStatus === "Accepted"
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30"
                        : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-400/30"
                    }`}
                  >
                    {application.applicationStatus}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={14} className="text-green-400" />
                    <span>
                      {formatPrice(application.proposedPrice, project.currency)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-blue-400" />
                    <span>{application.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-purple-400" />
                    <span>{formatDate(application.appliedAt)}</span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1 font-medium">
                      Cover Letter:
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed line-clamp-3">
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {project.applications.length > 3 && (
              <div className="text-center p-3">
                <p className="text-gray-400 text-sm">
                  +{project.applications.length - 3} more applications
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pitches */}
      {project.pitches && project.pitches.length > 0 && (
        <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div className="ml-3 sm:ml-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Price Proposals
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Received offers
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold border border-orange-400/30">
              {project.pitches.length}
            </div>
          </div>

          <div className="space-y-3">
            {project.pitches.slice(0, 3).map((pitch, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl sm:rounded-2xl p-4 border border-white/10 hover:border-orange-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-white text-sm sm:text-base">
                    Mentor Proposal
                  </div>
                  <div className="text-orange-300 font-bold text-base sm:text-lg">
                    {formatPrice(pitch.price, project.currency)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300 mb-3">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Submitted: {formatDate(pitch.timestamp)}</span>
                </div>

                {pitch.note && (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1 font-medium">
                      Note:
                    </p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed line-clamp-2">
                      {pitch.note}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {project.pitches.length > 3 && (
              <div className="text-center p-3">
                <p className="text-gray-400 text-sm">
                  +{project.pitches.length - 3} more proposals
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Overview Stats */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/0 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
            <Image className="text-white" size={20} />
          </div>
          <div className="ml-3 sm:ml-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Project Insights
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Key metrics & details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10">
            <Eye className="mx-auto mb-2 text-blue-400" size={18} />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {project.viewCount || 0}
            </div>
            <div className="text-xs text-gray-400 font-medium">Views</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10">
            <Users className="mx-auto mb-2 text-green-400" size={18} />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {project.applicationsCount || 0}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Applications
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-green-400" />
              <span className="text-sm font-medium text-gray-300">Budget</span>
            </div>
            <span className="text-white font-semibold text-sm">
              {formatPrice(project.openingPrice, project.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                Duration
              </span>
            </div>
            <span className="text-white font-semibold text-sm">
              {project.duration}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Category
              </span>
            </div>
            <span className="text-white font-semibold text-sm">
              {project.category}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <AlertTriangle
                size={16}
                className={`${
                  project.difficultyLevel === "Beginner"
                    ? "text-green-400"
                    : project.difficultyLevel === "Intermediate"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              />
              <span className="text-sm font-medium text-gray-300">
                Difficulty
              </span>
            </div>
            <span
              className={`font-semibold text-sm ${
                project.difficultyLevel === "Beginner"
                  ? "text-green-400"
                  : project.difficultyLevel === "Intermediate"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {project.difficultyLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActionsButtons;
