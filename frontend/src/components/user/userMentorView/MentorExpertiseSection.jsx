import React from "react";
import { Award, TrendingUp } from "lucide-react";

const MentorExpertiseSection = ({ mentorData }) => {
  const getExpertiseLevelColor = (level) => {
    switch (level) {
      case "expert":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "advanced":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "intermediate":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Award className="mr-2 text-green-400" size={20} />
        Expertise & Skills
      </h2>

      {mentorData.expertise && mentorData.expertise.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mentorData.expertise.map((skill, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h3 className="text-white font-semibold text-sm sm:text-base flex-1 min-w-0">
                  {skill.skill}
                </h3>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-medium border self-start sm:self-auto ${getExpertiseLevelColor(
                    skill.level
                  )}`}
                >
                  {skill.level}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                <TrendingUp size={14} className="text-blue-400" />
                <span>{skill.yearsOfExperience || 0} years experience</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Award className="mx-auto mb-3 text-gray-400" size={48} />
          <p className="text-gray-400 text-sm sm:text-base">
            No expertise information provided.
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorExpertiseSection;
