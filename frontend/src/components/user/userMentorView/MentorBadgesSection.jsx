import React from "react";
import {
  Award,
  Star,
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";

const MentorBadgesSection = ({ mentorData }) => {
  if (!mentorData.badges || mentorData.badges.length === 0) {
    return null;
  }

  const getIconComponent = (iconName) => {
    const iconMap = {
      trophy: Trophy,
      star: Star,
      medal: Medal,
      crown: Crown,
      award: Award,
      sparkles: Sparkles,
      zap: Zap,
      shield: Shield,
    };
    return iconMap[iconName?.toLowerCase()] || Award;
  };

  const getBadgeColors = (category, index) => {
    const colorSchemes = [
      {
        gradient: "from-yellow-500/20 via-amber-500/20 to-orange-500/20",
        border: "border-yellow-500/40",
        glow: "shadow-yellow-500/25",
        text: "text-yellow-300",
        icon: "text-yellow-400",
      },
      {
        gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
        border: "border-blue-500/40",
        glow: "shadow-blue-500/25",
        text: "text-blue-300",
        icon: "text-blue-400",
      },
      {
        gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
        border: "border-purple-500/40",
        glow: "shadow-purple-500/25",
        text: "text-purple-300",
        icon: "text-purple-400",
      },
      {
        gradient: "from-green-500/20 via-emerald-500/20 to-lime-500/20",
        border: "border-green-500/40",
        glow: "shadow-green-500/25",
        text: "text-green-300",
        icon: "text-green-400",
      },
      {
        gradient: "from-red-500/20 via-orange-500/20 to-amber-500/20",
        border: "border-red-500/40",
        glow: "shadow-red-500/25",
        text: "text-red-300",
        icon: "text-red-400",
      },
    ];

    return colorSchemes[index % colorSchemes.length];
  };

  return (
    <div className="relative group">
      {/* Enhanced container with modern styling */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Header section */}
        <div className="relative p-6 sm:p-8 border-b border-slate-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Badges & Achievements
                </h2>
                <p className="text-slate-400 text-sm">
                  Recognition for excellence and expertise
                </p>
              </div>
            </div>

            {/* Badge count indicator */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl border border-yellow-500/30">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-semibold text-sm">
                {mentorData.badges.length}{" "}
                {mentorData.badges.length === 1 ? "Badge" : "Badges"}
              </span>
            </div>
          </div>
        </div>

        {/* Badges grid */}
        <div className="relative p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {mentorData.badges.map((badge, index) => {
              const colors = getBadgeColors(badge.category, index);
              const IconComponent = getIconComponent(badge.iconName);

              return (
                <div
                  key={index}
                  className="group/badge transform transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Badge card */}
                  <div className="relative">
                    {/* Hover glow effect */}
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-2xl opacity-0 group-hover/badge:opacity-100 transition-all duration-300 blur-sm ${colors.glow}`}
                    ></div>

                    {/* Main badge container */}
                    <div
                      className={`relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border ${colors.border} hover:border-opacity-60 transition-all duration-300`}
                    >
                      {/* Badge content */}
                      <div className="text-center space-y-4">
                        {/* Icon section with enhanced styling */}
                        <div className="relative inline-flex items-center justify-center">
                          {/* Background glow */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-2xl blur-xl opacity-50 group-hover/badge:opacity-80 transition-opacity duration-300`}
                          ></div>

                          {/* Icon container */}
                          <div
                            className={`relative w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center border ${colors.border} group-hover/badge:scale-110 transition-transform duration-300`}
                          >
                            {badge.icon &&
                            typeof badge.icon === "string" &&
                            badge.icon.match(/[\u{1F000}-\u{1F9FF}]/u) ? (
                              <span className="text-3xl group-hover/badge:animate-bounce">
                                {badge.icon}
                              </span>
                            ) : (
                              <IconComponent
                                className={`w-8 h-8 ${colors.icon} group-hover/badge:rotate-12 transition-transform duration-300`}
                              />
                            )}
                          </div>

                          {/* Floating sparkle effect */}
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300">
                            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                          </div>
                        </div>

                        {/* Badge name */}
                        <div>
                          <h3
                            className={`text-lg font-bold ${colors.text} mb-2 group-hover/badge:text-white transition-colors duration-300`}
                          >
                            {badge.name}
                          </h3>

                          {/* Badge description */}
                          {badge.description && (
                            <p className="text-slate-400 text-sm leading-relaxed group-hover/badge:text-slate-300 transition-colors duration-300">
                              {badge.description}
                            </p>
                          )}
                        </div>

                        {/* Additional badge metadata */}
                        {(badge.earnedDate || badge.level) && (
                          <div className="pt-3 border-t border-slate-700/50">
                            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                              {badge.level && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3" />
                                  <span>Level {badge.level}</span>
                                </div>
                              )}
                              {badge.earnedDate && (
                                <div className="flex items-center space-x-1">
                                  <Medal className="w-3 h-3" />
                                  <span>
                                    Earned{" "}
                                    {new Date(badge.earnedDate).getFullYear()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

export default MentorBadgesSection;
