import React from "react";
import { Award, Star, Trophy, Zap } from "lucide-react";

const MentorBadgesSection = ({ mentorData }) => {
  if (!mentorData.badges || mentorData.badges.length === 0) {
    return null;
  }

  const getBadgeGradient = (index) => {
    const gradients = [
      "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
      "from-purple-500/20 to-pink-500/20 border-purple-500/30",
      "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
      "from-green-500/20 to-emerald-500/20 border-green-500/30",
      "from-red-500/20 to-rose-500/20 border-red-500/30",
      "from-indigo-500/20 to-purple-500/20 border-indigo-500/30",
    ];
    return gradients[index % gradients.length];
  };

  const getBadgeTextGradient = (index) => {
    const textGradients = [
      "from-yellow-400 to-orange-400",
      "from-purple-400 to-pink-400",
      "from-blue-400 to-cyan-400",
      "from-green-400 to-emerald-400",
      "from-red-400 to-rose-400",
      "from-indigo-400 to-purple-400",
    ];
    return textGradients[index % textGradients.length];
  };

  return (
    <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating particles */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-400/40 rounded-full animate-bounce"></div>
      <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-orange-400/40 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-red-400/40 rounded-full animate-pulse delay-700"></div>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Enhanced Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-75 animate-ping"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Badges & Achievements
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1 group-hover:w-28 transition-all duration-300"></div>
          </div>
          <Trophy className="w-6 h-6 text-orange-400 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
        </div>

        {/* Enhanced Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mentorData.badges.map((badge, index) => (
            <div
              key={index}
              className={`group/badge relative bg-gradient-to-br ${getBadgeGradient(
                index
              )} backdrop-blur-sm rounded-2xl p-6 border hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden`}
            >
              {/* Badge background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300"></div>

              {/* Shimmering effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover/badge:translate-x-[200%] transition-transform duration-1000 ease-out"></div>

              <div className="relative z-10 text-center">
                {/* Enhanced Badge Icon */}
                <div className="relative mb-4 inline-block">
                  <div className="text-4xl sm:text-5xl mb-2 group-hover/badge:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {badge.icon || "🏆"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl scale-150 opacity-0 group-hover/badge:opacity-50 transition-opacity duration-300"></div>
                </div>

                {/* Badge Name */}
                <h3
                  className={`text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r ${getBadgeTextGradient(
                    index
                  )} bg-clip-text text-transparent`}
                >
                  {badge.name}
                </h3>

                {/* Badge Description */}
                {badge.description && (
                  <div className="relative">
                    <div className="absolute -left-2 top-0 w-0.5 h-full bg-gradient-to-b from-yellow-400/60 to-transparent rounded-full"></div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed pl-4 group-hover/badge:text-gray-200 transition-colors duration-300">
                      {badge.description}
                    </p>
                  </div>
                )}

                {/* Decorative stars */}
                <div className="flex justify-center space-x-1 mt-4 opacity-60 group-hover/badge:opacity-100 transition-opacity duration-300">
                  {[...Array(3)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-3 h-3 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${starIndex * 200}ms` }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-yellow-400/30 rounded-tr-xl opacity-60"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-orange-400/30 rounded-bl-xl opacity-60"></div>
            </div>
          ))}
        </div>

        {/* Achievement count indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-500/30">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold text-sm">
              {mentorData.badges.length} Achievement
              {mentorData.badges.length !== 1 ? "s" : ""} Unlocked
            </span>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorBadgesSection;
