import React from "react";
import { Award } from "lucide-react";

const MentorBadgesSection = ({ mentorData }) => {
  if (!mentorData.badges || mentorData.badges.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Award className="mr-2 text-yellow-400" size={20} />
        Badges & Achievements
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mentorData.badges.map((badge, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {badge.icon || "🏆"}
            </div>
            <div className="text-white text-sm sm:text-base font-semibold mb-1">
              {badge.name}
            </div>
            {badge.description && (
              <div className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {badge.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorBadgesSection;
