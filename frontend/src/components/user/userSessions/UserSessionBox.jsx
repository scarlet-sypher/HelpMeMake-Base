import React from "react";
import UserSessionItem from "./UserSessionItem";
import {
  Folder,
  User,
  Calendar,
  BookOpen,
  Activity,
  CheckCircle,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";

const UserSessionBox = ({ projectData, onSessionUpdate }) => {
  const { project, mentor, sessions } = projectData;

  // Calculate session statistics
  const completedSessions = sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const upcomingSessions = sessions.filter(
    (s) => s.status === "scheduled"
  ).length;
  const totalSessions = sessions.length;

  // Calculate completion percentage
  const completionPercentage =
    totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Format project status for display
  const getProjectStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-blue-300 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30";
      case "Completed":
        return "text-green-300 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30";
      case "Cancelled":
        return "text-red-300 bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/30";
      default:
        return "text-gray-300 bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/30";
    }
  };

  return (
    <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-white/30">
      {/* Box Header */}
      <div className="relative bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-cyan-500/20 p-4 md:p-5 border-b border-white/10 overflow-hidden">
        {/* Header background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-lg"></div>

        <div className="relative z-10">
          <div className="flex flex-col space-y-4">
            {/* Project Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-start space-x-3">
                <div className="relative group">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <Folder className="text-white" size={20} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-1.5 leading-tight">
                    {project.name}
                  </h2>
                  <p className="text-gray-300 text-sm mb-2 leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center text-blue-300 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-400/20">
                      <User className="mr-1.5" size={12} />
                      <span className="font-medium text-xs">
                        {mentor.userId?.name || "Mentor"}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getProjectStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <BookOpen
                      className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                      size={16}
                    />
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
                    {totalSessions}
                  </div>
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wide">
                    Total
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-green-500/15 to-emerald-500/5 backdrop-blur-sm rounded-xl p-3 border border-green-400/20 hover:border-green-400/30 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <CheckCircle
                      className="text-green-400 group-hover:text-green-300 transition-colors duration-300"
                      size={16}
                    />
                  </div>
                  <div className="text-lg font-bold text-green-300 group-hover:text-green-200 transition-colors duration-300">
                    {completedSessions}
                  </div>
                  <div className="text-xs text-green-200 font-medium uppercase tracking-wide">
                    Done
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-blue-500/15 to-cyan-500/5 backdrop-blur-sm rounded-xl p-3 border border-blue-400/20 hover:border-blue-400/30 transition-all duration-300 hover:scale-105 hover:shadow-md">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1.5">
                    <Clock
                      className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                      size={16}
                    />
                  </div>
                  <div className="text-lg font-bold text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                    {upcomingSessions}
                  </div>
                  <div className="text-xs text-blue-200 font-medium uppercase tracking-wide">
                    Pending
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            {project.status === "In Progress" && (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-3 border border-blue-400/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Activity
                        className="text-blue-400 animate-pulse"
                        size={16}
                      />
                      <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-blue-300 font-semibold text-sm">
                      Active Project
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-blue-300">
                    <Trophy size={12} />
                    <span className="text-xs font-medium">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                </div>
                <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-md"
                    style={{
                      width: `${Math.min(completionPercentage, 100)}%`,
                      boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="p-4 md:p-5">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500/20 to-slate-500/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-gray-400/20">
                <Calendar className="text-gray-400" size={28} />
              </div>
              <div className="absolute inset-0 bg-gray-400/5 rounded-full blur-lg"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No Sessions Scheduled
            </h3>
            <p className="text-gray-400 max-w-sm mx-auto leading-relaxed text-sm">
              No sessions have been scheduled for this project yet. Check back
              soon for updates!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg mr-2 border border-purple-400/20">
                  <BookOpen className="text-purple-400" size={16} />
                </div>
                <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  Sessions Timeline
                </span>
              </h3>
              <div className="flex items-center space-x-1.5 text-sm">
                <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-2.5 py-1.5 rounded-full border border-blue-400/20">
                  <TrendingUp size={12} className="text-blue-400" />
                  <span className="text-blue-300 font-medium text-xs">
                    {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div
                  key={session._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <UserSessionItem
                    session={session}
                    isLast={index === sessions.length - 1}
                    onSessionUpdate={onSessionUpdate}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default UserSessionBox;
