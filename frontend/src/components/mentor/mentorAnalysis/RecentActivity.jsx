import React, { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  User,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";

const RecentActivity = ({ projects, title = "Recent Projects" }) => {
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleProjects(projects.slice(0, 5));
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [projects]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="text-green-400" size={20} />;
      case "In Progress":
        return <PlayCircle className="text-blue-400" size={20} />;
      case "Cancelled":
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-yellow-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
      case "Cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600";
      default:
        return "bg-gradient-to-r from-yellow-500 to-amber-600";
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-indigo-200 text-sm sm:text-base">
              Latest project activity
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Activity className="text-indigo-300 mx-auto mb-3" size={32} />
            <p className="text-gray-300">No recent projects</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Start mentoring to see activity
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 lg:p-8 border border-indigo-500/20 hover:border-indigo-400/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-indigo-200 text-sm sm:text-base">
              Latest project activity
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-indigo-400">
          <Calendar size={18} className="sm:size-5" />
          <span className="text-xs sm:text-sm font-medium">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {visibleProjects.map((project, index) => (
          <div
            key={project.id}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div
              className={`absolute top-0 left-0 h-1 ${getProgressColor(
                project.status
              )}`}
              style={{
                width: `${project.progressPercentage}%`,
                transition: "width 1s ease-out",
                transitionDelay: `${(index + 3) * 200}ms`,
              }}
            />

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getStatusIcon(project.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-white font-semibold text-base sm:text-lg truncate">
                        {project.name}
                      </h4>
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <User size={12} className="sm:size-4" />
                        <span>with {project.learnerName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} className="sm:size-4" />
                        <span>{project.progressPercentage}% complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 64 64"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-gray-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          28 *
                          (1 - project.progressPercentage / 100)
                        }`}
                        className={`transition-all duration-1000 ease-out ${
                          project.status === "Completed"
                            ? "stroke-green-500"
                            : project.status === "In Progress"
                            ? "stroke-blue-500"
                            : project.status === "Cancelled"
                            ? "stroke-red-500"
                            : "stroke-yellow-500"
                        }`}
                        style={{
                          transitionDelay: `${(index + 5) * 100}ms`,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {project.progressPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    Progress
                  </span>
                  <span className="text-[10px] sm:text-xs text-white font-medium">
                    {project.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(
                      project.status
                    )}`}
                    style={{
                      width: `${project.progressPercentage}%`,
                      transitionDelay: `${(index + 6) * 100}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="text-lg sm:text-2xl font-bold text-white mb-1">
            {projects.length}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
            Total Projects
          </div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="text-lg sm:text-2xl font-bold text-green-400 mb-1">
            {projects.filter((p) => p.status === "Completed").length}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
            Completed
          </div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="text-lg sm:text-2xl font-bold text-blue-400 mb-1">
            {projects.filter((p) => p.status === "In Progress").length}
          </div>
          <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
            In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
