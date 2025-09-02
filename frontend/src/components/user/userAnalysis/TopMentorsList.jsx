import React from "react";
import { Star, Users, Award, TrendingUp } from "lucide-react";

const TopMentorsList = ({ mentors, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="w-32 sm:w-48 h-6 bg-white/10 rounded animate-pulse"></div>
            <div className="w-12 sm:w-16 h-4 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 p-4 bg-white/5 rounded-xl animate-pulse"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full mb-3 sm:mb-0"></div>
                <div className="flex-1 w-full">
                  <div className="w-24 sm:w-32 h-4 bg-white/10 rounded mb-2"></div>
                  <div className="w-20 sm:w-24 h-3 bg-white/10 rounded"></div>
                </div>
                <div className="w-12 sm:w-16 h-8 bg-white/10 rounded mt-3 sm:mt-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!mentors || mentors.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center">
            <Users className="mr-2 text-emerald-400" size={20} />
            Top Mentors
          </h3>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
            <div className="w-14 sm:w-16 h-14 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 sm:w-8 h-6 sm:h-8" />
            </div>
            <p className="text-center text-sm sm:text-base">
              No mentor collaborations yet
            </p>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
              Complete projects to see your top mentors!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>

      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Users className="mr-2 text-emerald-400" size={20} />
            Top Mentors
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-emerald-300 font-medium">
              {mentors.length} Mentor{mentors.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {mentors.map((mentorData, index) => {
            const mentor = mentorData.mentor;
            const completedProjects = mentorData.completedProjects;
            const totalProjects = mentorData.totalProjects;

            const rankColors = {
              0: "from-yellow-500 to-amber-500",
              1: "from-gray-400 to-gray-500",
              2: "from-amber-600 to-orange-600",
            };

            const rankColor =
              rankColors[index] || "from-emerald-500 to-teal-500";
            const rankIcons = [Award, Star, TrendingUp];
            const RankIcon = rankIcons[index] || Users;

            return (
              <div
                key={mentor._id || index}
                className="group/item relative p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="absolute -top-2 -left-2 w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-white/20">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    #{index + 1}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <div className="relative mb-3 sm:mb-0 self-start">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${rankColor} rounded-full blur opacity-40 group-hover/item:opacity-60 transition-opacity`}
                    ></div>
                    <img
                      src={
                        mentor.avatar?.startsWith("/uploads/")
                          ? `${import.meta.env.VITE_API_URL}${mentor.avatar}`
                          : mentor.avatar || "/uploads/public/default.jpg"
                      }
                      alt={mentor.name}
                      className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/20"
                    />

                    <div
                      className={`absolute -bottom-1 -right-1 w-5 sm:w-6 h-5 sm:h-6 bg-gradient-to-r ${rankColor} rounded-full flex items-center justify-center border border-white/30`}
                    >
                      <RankIcon
                        size={10}
                        className="sm:w-3 sm:h-3 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate group-hover/item:text-emerald-300 transition-colors text-sm sm:text-base">
                      {mentor.name}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {mentor.email}
                    </p>
                  </div>

                  <div className="text-left sm:text-right mt-3 sm:mt-0">
                    <div className="text-white font-bold text-base sm:text-lg">
                      {completedProjects}
                    </div>
                    <div className="text-gray-400 text-[10px] sm:text-xs">
                      completed
                    </div>
                    {totalProjects > completedProjects && (
                      <div className="text-emerald-400 text-[10px] sm:text-xs mt-1">
                        +{totalProjects - completedProjects} ongoing
                      </div>
                    )}
                  </div>
                </div>

                {totalProjects > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1">
                      <span>Success Rate</span>
                      <span>
                        {Math.round((completedProjects / totalProjects) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${rankColor} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{
                          width: `${
                            (completedProjects / totalProjects) * 100
                          }%`,
                          transitionDelay: `${index * 200}ms`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {mentors.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10 space-y-1 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-gray-400">
              <span>Total Collaborations</span>
              <span className="text-emerald-400 font-semibold">
                {mentors.reduce((sum, m) => sum + m.totalProjects, 0)} projects
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <span>Successful Completions</span>
              <span className="text-emerald-400 font-semibold">
                {mentors.reduce((sum, m) => sum + m.completedProjects, 0)}{" "}
                completed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMentorsList;
