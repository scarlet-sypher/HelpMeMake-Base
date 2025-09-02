import React from "react";
import {
  Trophy,
  Users,
  Calendar,
  Zap,
  MapPin,
  Star,
  Briefcase,
  Mail,
  User,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const ProjectInfo = ({ projectData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "from-blue-500 to-cyan-500";
      case "Completed":
        return "from-green-500 to-emerald-500";
      case "Cancelled":
        return "from-red-500 to-rose-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <Activity className="text-white" size={16} />;
      case "Completed":
        return <CheckCircle className="text-white" size={16} />;
      case "Cancelled":
        return <AlertCircle className="text-white" size={16} />;
      default:
        return <Clock className="text-white" size={16} />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <Trophy className="text-white" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words">
                  {projectData.name}
                </h2>
              </div>
            </div>

            {projectData.shortDescription && (
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed mb-4">
                {projectData.shortDescription}
              </p>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${getStatusColor(
                  projectData.status
                )} rounded-full shadow-lg`}
              >
                {getStatusIcon(projectData.status)}
                <span className="text-white text-sm font-semibold">
                  {projectData.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                  <Zap className="text-white" size={16} />
                </div>
                <span className="text-sm text-purple-200 font-medium">
                  Progress
                </span>
              </div>
              <span className="text-lg font-bold text-white">
                {projectData.progressPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-700 shadow-lg"
                style={{ width: `${projectData.progressPercentage || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:scale-110 transition-transform">
                <Calendar className="text-white" size={16} />
              </div>
              <span className="text-sm text-green-200 font-medium">
                Target Date
              </span>
            </div>
            <p className="text-white font-bold text-sm sm:text-base">
              {projectData.expectedEndDate
                ? formatDate(projectData.expectedEndDate)
                : "Not Set"}
            </p>
            {projectData.expectedEndDate && (
              <p className="text-green-300 text-xs mt-1">
                {new Date(projectData.expectedEndDate) > new Date()
                  ? "Upcoming"
                  : "Overdue"}
              </p>
            )}
          </div>
        </div>

        {projectData.mentorId && typeof projectData.mentorId === "object" && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Mentor Details
              </h3>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl border-4 border-amber-400/30 group-hover:border-amber-400/60 transition-all duration-300">
                    {projectData.mentorId.avatar &&
                    projectData.mentorId.avatar.includes("http") ? (
                      <img
                        src={projectData.mentorId.avatar}
                        alt="Mentor Profile"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <User
                        size={48}
                        className="text-white sm:w-16 sm:h-16 lg:w-20 lg:h-20"
                      />
                    )}
                  </div>

                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white/20 shadow-lg"></div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-amber-400" />
                      <span className="text-sm text-amber-200 font-medium">
                        Name:
                      </span>
                    </div>
                    <span className="text-white font-semibold text-lg break-words pl-6">
                      {projectData.mentorId.name || "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-amber-400" />
                      <span className="text-sm text-amber-200 font-medium">
                        Email:
                      </span>
                    </div>
                    <span className="text-white font-mono text-sm break-all pl-6">
                      {projectData.mentorId.email || "Not provided"}
                    </span>
                  </div>

                  {projectData.mentorId.title && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-amber-400" />
                        <span className="text-sm text-amber-200 font-medium">
                          Title:
                        </span>
                      </div>
                      <span className="text-white break-words pl-6">
                        {projectData.mentorId.title}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {projectData.mentorId.location && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-amber-400" />
                        <span className="text-sm text-amber-200 font-medium">
                          Location:
                        </span>
                      </div>
                      <span className="text-white break-words pl-6">
                        {projectData.mentorId.location}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-amber-400" />
                      <span className="text-sm text-amber-200 font-medium">
                        Status:
                      </span>
                    </div>
                    <span className="text-white pl-6 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {projectData.mentorId.description && (
              <div className="mt-6 pt-6 border-t border-amber-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-amber-400" />
                  <span className="text-sm text-amber-200 font-medium">
                    About:
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed bg-white/5 rounded-lg p-4">
                  {projectData.mentorId.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
