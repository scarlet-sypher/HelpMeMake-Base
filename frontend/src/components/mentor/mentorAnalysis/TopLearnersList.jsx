import React, { useState, useEffect } from "react";
import { Users, Star, Trophy, Award, TrendingUp } from "lucide-react";

const TopLearnersList = ({ learners, title = "Top Apprentices" }) => {
  const [animatedLearners, setAnimatedLearners] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLearners(learners || []);
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [learners]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-300 drop-shadow-md" size={20} />;
      case 1:
        return <Award className="text-slate-200 drop-shadow-md" size={20} />;
      case 2:
        return <Award className="text-orange-500 drop-shadow-md" size={20} />;
      default:
        return <Star className="text-emerald-400 drop-shadow-md" size={20} />;
    }
  };

  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return "from-yellow-300 to-yellow-500 text-black";
      case 1:
        return "from-slate-300 to-slate-500 text-black";
      case 2:
        return "from-orange-400 to-orange-600 text-white";
      default:
        return "from-emerald-400 to-teal-600 text-white";
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";

    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }

    return avatar;
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!learners || learners.length === 0) {
    return (
      <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl shadow-lg self-start sm:self-auto">
            <Users className="text-white" size={24} />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-cyan-200 text-sm sm:text-base">
              Most active learners
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Users className="text-cyan-300 mx-auto mb-3" size={32} />
            <p className="text-gray-300">No apprentices yet</p>
            <p className="text-gray-400 text-sm">
              Start mentoring to see your top learners
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-400/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl shadow-lg">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-cyan-200">Most active learners</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-cyan-400">
          <TrendingUp size={20} />
          <span className="text-sm font-medium">Top Performers</span>
        </div>
      </div>

      {/* Learners Grid */}
      <div className="grid grid-cols-1 gap-4">
        {animatedLearners.slice(0, 5).map((learner, index) => {
          const completionRate =
            learner.totalProjects > 0
              ? (learner.completedProjects / learner.totalProjects) * 100
              : 0;

          return (
            <div
              key={learner.learner?._id || learner.id || index}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Rank stripe */}
              <div
                className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${
                  getRankBadgeColor(index).split(" ")[0]
                } ${getRankBadgeColor(index).split(" ")[1]}`}
              />

              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${getRankBadgeColor(
                        index
                      )} rounded-full flex items-center justify-center shadow-lg font-bold text-lg`}
                    >
                      #{index + 1}
                    </div>
                    <div className="absolute -top-1 -right-1">
                      {getRankIcon(index)}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-gradient-to-br from-cyan-500/20 to-teal-600/20">
                      {learner.learner?.avatar ? (
                        <img
                          src={getAvatarUrl(learner.learner.avatar)}
                          alt={learner.learner?.name || "Learner"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(
                              ".avatar-fallback"
                            ).style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`avatar-fallback w-full h-full ${
                          learner.learner?.avatar ? "hidden" : "flex"
                        } items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-cyan-500 to-teal-600`}
                      >
                        {getInitials(learner.learner?.name)}
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Learner Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold text-lg truncate">
                        {learner.learner?.name || "Unknown Learner"}
                      </h4>

                      {/* Success Rate Badge */}
                      {learner.totalProjects > 0 && (
                        <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500/20 to-emerald-600/20 text-green-300 border border-green-400/30">
                          <Star size={12} className="text-green-400" />
                          <span>{Math.round(completionRate)}%</span>
                        </div>
                      )}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4 mb-3 text-xs sm:text-sm">
                      <div className="text-center p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xl font-bold text-cyan-400">
                          {learner.totalProjects || 0}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          Total Projects
                        </div>
                      </div>

                      <div className="text-center p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xl font-bold text-green-400">
                          {learner.completedProjects || 0}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          Completed
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Completion Rate
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${completionRate}%`,
                            transitionDelay: `${(index + 5) * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none rounded-2xl" />
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="text-2xl font-bold text-white mb-1">
            {learners.reduce(
              (sum, learner) => sum + (learner.totalProjects || 0),
              0
            )}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Total Projects
          </div>
        </div>
        <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {learners.reduce(
              (sum, learner) => sum + (learner.completedProjects || 0),
              0
            )}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            Completed
          </div>
        </div>
      </div>

      {/* View More Button */}
      {learners.length > 5 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-teal-600/20 hover:from-cyan-500/30 hover:to-teal-600/30 border border-cyan-400/30 rounded-2xl text-cyan-300 hover:text-white transition-all duration-200 font-semibold">
            View All {learners.length} Apprentices
          </button>
        </div>
      )}
    </div>
  );
};

export default TopLearnersList;
