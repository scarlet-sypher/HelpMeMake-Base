import React from "react";
import { Target } from "lucide-react";

const MentorSpecializationsSection = ({ mentorData }) => {
  if (!mentorData.specializations || mentorData.specializations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Target className="mr-2 text-purple-400" size={20} />
        Specializations
      </h3>
      <div className="flex flex-wrap gap-3">
        {mentorData.specializations.map((spec, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl border border-purple-500/30 text-sm sm:text-base font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-default"
          >
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MentorSpecializationsSection;
