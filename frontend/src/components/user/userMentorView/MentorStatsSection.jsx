import React from "react";
import { TrendingUp, Clock, Target, Award } from "lucide-react";

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
      color: "text-green-400",
    },
    {
      label: "Response Time",
      value: mentorData.responseTime,
      suffix: " mins",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Profile Completeness",
      value: mentorData.profileCompleteness || 75,
      suffix: "%",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    {
      label: "Achievements",
      value: mentorData.achievements || 0,
      suffix: "",
      icon: Award,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <TrendingUp className="mr-2 text-yellow-400" size={20} />
        Performance Stats
      </h2>

      <div className="space-y-4">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all`}
              >
                <stat.icon className={`${stat.color}`} size={16} />
              </div>
              <span className="text-gray-300 text-sm sm:text-base">
                {stat.label}
              </span>
            </div>
            <span className="text-white font-semibold text-sm sm:text-base">
              {stat.value}
              {stat.suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorStatsSection;
