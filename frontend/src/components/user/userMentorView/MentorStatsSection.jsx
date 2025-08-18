import React from "react";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Zap,
  Users,
  Star,
} from "lucide-react";

const MentorStatsSection = ({ mentorData }) => {
  const statsData = [
    {
      label: "Success Rate",
      value:
        mentorData.completedSessions > 0
          ? Math.floor(
              (mentorData.completedSessions /
                (mentorData.completedSessions + 2)) *
                100
            )
          : 85,
      suffix: "%",
      icon: Target,
      color: "from-emerald-400 to-green-500",
      bgGlow: "from-emerald-500/20 to-green-500/20",
    },
    {
      label: "Avg Response",
      value: mentorData.responseTime || 24,
      suffix: "h",
      icon: Clock,
      color: "from-blue-400 to-cyan-500",
      bgGlow: "from-blue-500/20 to-cyan-500/20",
    },
    {
      label: "Profile Score",
      value: mentorData.profileCompleteness || 95,
      suffix: "%",
      icon: TrendingUp,
      color: "from-purple-400 to-pink-500",
      bgGlow: "from-purple-500/20 to-pink-500/20",
    },
    {
      label: "Total Sessions",
      value: mentorData.completedSessions || 12,
      suffix: "",
      icon: Users,
      color: "from-orange-400 to-red-500",
      bgGlow: "from-orange-500/20 to-red-500/20",
    },
    {
      label: "Rating",
      value: mentorData.rating || 4.8,
      suffix: "/5",
      icon: Star,
      color: "from-yellow-400 to-amber-500",
      bgGlow: "from-yellow-500/20 to-amber-500/20",
    },
    {
      label: "Achievements",
      value: mentorData.achievements || 8,
      suffix: "",
      icon: Award,
      color: "from-indigo-400 to-purple-500",
      bgGlow: "from-indigo-500/20 to-purple-500/20",
    },
  ];

  const getProgressWidth = (value, suffix) => {
    if (suffix === "%") return value;
    if (suffix === "/5") return (value / 5) * 100;
    if (suffix === "h") return Math.max(0, 100 - (value / 48) * 100);
    return Math.min(100, (value / 20) * 100);
  };

  return (
    <div className="group relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 hover:bg-white/15 transition-all duration-500">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl blur-lg opacity-50"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
              Performance Stats
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-time metrics & achievements
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group/stat relative transform hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInScale 0.5s ease-out forwards",
              }}
            >
              {/* Card glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.bgGlow} rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 blur-sm`}
              ></div>

              <div className="relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon and Value Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-lg blur-md opacity-30`}
                    ></div>
                    <div
                      className={`relative bg-gradient-to-r ${stat.color} p-2.5 rounded-lg shadow-lg`}
                    >
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                      {stat.suffix}
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="mb-3">
                  <span className="text-gray-300 text-sm font-medium">
                    {stat.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${getProgressWidth(stat.value, stat.suffix)}%`,
                      animation: `progressFill 1s ease-out ${
                        index * 100
                      }ms forwards`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300">
                  <Zap className="w-3 h-3 text-white/50" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Highly Rated</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
              <span>Fast Response</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <span>Verified Profile</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default MentorStatsSection;
