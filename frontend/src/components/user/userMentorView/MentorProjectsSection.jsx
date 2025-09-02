import React from "react";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import ProjectCard from "../../user/userProject/ProjectCard";

const MentorProjectsSection = ({
  mentorProjects,
  projectsLoading,
  API_URL,
}) => {
  return (
    <div className="relative group">
      {/* Enhanced container with modern styling */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header section with enhanced styling */}
        <div className="relative p-6 sm:p-8 border-b border-slate-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Completed Projects
                </h3>
                <p className="text-slate-400 text-sm">
                  Showcasing successful mentorship outcomes
                </p>
              </div>
            </div>

            {/* Enhanced project count badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-semibold text-sm">
                  {mentorProjects.length}{" "}
                  {mentorProjects.length === 1 ? "Project" : "Projects"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="relative p-6 sm:p-8">
          {projectsLoading ? (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 border-r-purple-400 mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400/20 mx-auto"></div>
              </div>
              <div className="space-y-2">
                <div className="text-white text-lg font-medium">
                  Loading projects...
                </div>
                <div className="text-slate-400 text-sm">
                  Discovering mentor achievements
                </div>
              </div>
            </div>
          ) : mentorProjects.length > 0 ? (
            <div className="space-y-6">
              {/* Projects grid with enhanced responsive layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {mentorProjects.map((project, index) => (
                  <div
                    key={project._id}
                    className="transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    {/* Enhanced project card wrapper */}
                    <div className="relative group/card">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-all duration-300 blur-sm"></div>
                      <div className="relative">
                        <ProjectCard project={project} API_URL={API_URL} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary stats if multiple projects */}
              {mentorProjects.length > 3 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl border border-slate-600/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Heading */}
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-400 shrink-0" />
                      <span className="text-white font-medium text-lg sm:text-base">
                        Portfolio Highlights
                      </span>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-slate-300">
                          {mentorProjects.length} Completed
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-slate-300">Recent Work</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-3xl mx-auto flex items-center justify-center border border-slate-600/50">
                  <Briefcase className="w-12 h-12 text-slate-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  Portfolio Coming Soon
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  This mentor is just getting started and hasn't completed any
                  projects yet. Be among the first to work with them!
                </p>
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MentorProjectsSection;
