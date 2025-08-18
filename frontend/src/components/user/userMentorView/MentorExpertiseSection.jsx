import React from "react";
import { Award, TrendingUp, Star, Zap, Target, Brain } from "lucide-react";

const MentorExpertiseSection = ({ mentorData }) => {
  const getExpertiseLevelConfig = (level) => {
    switch (level?.toLowerCase()) {
      case "expert":
        return {
          color:
            "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/40",
          icon: <Star size={14} className="text-purple-400" />,
          bgGradient: "from-purple-500/5 to-pink-500/5",
        };
      case "advanced":
        return {
          color:
            "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/40",
          icon: <Target size={14} className="text-blue-400" />,
          bgGradient: "from-blue-500/5 to-cyan-500/5",
        };
      case "intermediate":
        return {
          color:
            "from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-400/40",
          icon: <TrendingUp size={14} className="text-emerald-400" />,
          bgGradient: "from-emerald-500/5 to-green-500/5",
        };
      default:
        return {
          color:
            "from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-400/40",
          icon: <Brain size={14} className="text-gray-400" />,
          bgGradient: "from-gray-500/5 to-slate-500/5",
        };
    }
  };

  const getSkillIcon = (skill) => {
    const skillLower = skill?.toLowerCase() || "";
    if (
      skillLower.includes("react") ||
      skillLower.includes("javascript") ||
      skillLower.includes("frontend")
    ) {
      return <Zap className="text-yellow-400" size={16} />;
    } else if (
      skillLower.includes("design") ||
      skillLower.includes("ui") ||
      skillLower.includes("ux")
    ) {
      return <Target className="text-pink-400" size={16} />;
    } else if (
      skillLower.includes("backend") ||
      skillLower.includes("database") ||
      skillLower.includes("server")
    ) {
      return <Brain className="text-blue-400" size={16} />;
    }
    return <Award className="text-cyan-400" size={16} />;
  };

  return (
    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 overflow-hidden group">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-400/30">
              <Award className="text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <p className="text-gray-400 text-sm">
                Technical proficiencies and experience levels
              </p>
            </div>
          </div>
          <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-emerald-400/50 to-transparent"></div>
        </div>

        {mentorData.expertise && mentorData.expertise.length > 0 ? (
          <>
            {/* Skills count indicator */}
            <div className="mb-6 text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-sm">
                  {mentorData.expertise.length} Skills Listed
                </span>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {mentorData.expertise.map((skill, index) => {
                const config = getExpertiseLevelConfig(skill.level);
                return (
                  <div
                    key={index}
                    className={`group/skill relative bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-white/10`}
                  >
                    {/* Skill header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="p-2 bg-white/10 rounded-lg group-hover/skill:scale-110 transition-transform duration-300">
                          {getSkillIcon(skill.skill)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-base sm:text-lg leading-tight">
                            {skill.skill}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Level badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-gradient-to-r ${config.color} group-hover/skill:shadow-lg transition-all duration-300`}
                      >
                        {config.icon}
                        <span className="capitalize">
                          {skill.level || "Beginner"}
                        </span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <TrendingUp size={14} className="text-blue-400" />
                      </div>
                      <span className="text-gray-300 text-sm font-medium">
                        {skill.yearsOfExperience || 0} years experience
                      </span>
                    </div>

                    {/* Experience bar visualization */}
                    <div className="mt-3">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.min(
                              (skill.yearsOfExperience || 0) * 10,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-2xl opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 text-center border border-purple-400/20">
                <div className="text-2xl font-bold text-purple-300 mb-1">
                  {
                    mentorData.expertise.filter((s) => s.level === "expert")
                      .length
                  }
                </div>
                <div className="text-purple-200 text-xs">Expert Level</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 text-center border border-blue-400/20">
                <div className="text-2xl font-bold text-blue-300 mb-1">
                  {
                    mentorData.expertise.filter((s) => s.level === "advanced")
                      .length
                  }
                </div>
                <div className="text-blue-200 text-xs">Advanced</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4 text-center border border-emerald-400/20 col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-emerald-300 mb-1">
                  {Math.round(
                    mentorData.expertise.reduce(
                      (acc, skill) => acc + (skill.yearsOfExperience || 0),
                      0
                    ) / mentorData.expertise.length
                  ) || 0}
                </div>
                <div className="text-emerald-200 text-xs">Avg. Years</div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="text-gray-400" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No Skills Listed
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              This mentor hasn't added their technical expertise information
              yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorExpertiseSection;
