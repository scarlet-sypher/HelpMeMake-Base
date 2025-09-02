import React from "react";
import { Target, Sparkles, Award, TrendingUp } from "lucide-react";

const MentorSpecializationsSection = ({ mentorData }) => {
  if (!mentorData.specializations || mentorData.specializations.length === 0) {
    return null;
  }

  const colorSchemes = [
    {
      bg: "from-purple-500/20 to-pink-500/20",
      text: "text-purple-300",
      border: "border-purple-500/30",
      hover:
        "hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/50",
      glow: "hover:shadow-lg hover:shadow-purple-500/25",
    },
    {
      bg: "from-blue-500/20 to-cyan-500/20",
      text: "text-blue-300",
      border: "border-blue-500/30",
      hover:
        "hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-400/50",
      glow: "hover:shadow-lg hover:shadow-blue-500/25",
    },
    {
      bg: "from-green-500/20 to-emerald-500/20",
      text: "text-green-300",
      border: "border-green-500/30",
      hover:
        "hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-400/50",
      glow: "hover:shadow-lg hover:shadow-green-500/25",
    },
    {
      bg: "from-orange-500/20 to-red-500/20",
      text: "text-orange-300",
      border: "border-orange-500/30",
      hover:
        "hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-400/50",
      glow: "hover:shadow-lg hover:shadow-orange-500/25",
    },
    {
      bg: "from-indigo-500/20 to-purple-500/20",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
      hover:
        "hover:from-indigo-500/30 hover:to-purple-500/30 hover:border-indigo-400/50",
      glow: "hover:shadow-lg hover:shadow-indigo-500/25",
    },
    {
      bg: "from-teal-500/20 to-cyan-500/20",
      text: "text-teal-300",
      border: "border-teal-500/30",
      hover:
        "hover:from-teal-500/30 hover:to-cyan-500/30 hover:border-teal-400/50",
      glow: "hover:shadow-lg hover:shadow-teal-500/25",
    },
  ];

  const getColorScheme = (index) => {
    return colorSchemes[index % colorSchemes.length];
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Target className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Specializations
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-400" />
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
            {mentorData.specializations.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {mentorData.specializations.map((spec, index) => {
          const scheme = getColorScheme(index);

          return (
            <div key={index} className="group/spec relative overflow-hidden">
              <div
                className={`relative p-4 bg-gradient-to-br ${scheme.bg} rounded-2xl border ${scheme.border} ${scheme.hover} ${scheme.glow} transition-all duration-300 cursor-default`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover/spec:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-2 h-2 ${scheme.text.replace(
                          "text-",
                          "bg-"
                        )} rounded-full`}
                      ></div>
                      <div
                        className={`absolute inset-0 ${scheme.text.replace(
                          "text-",
                          "bg-"
                        )} rounded-full animate-ping opacity-75`}
                      ></div>
                    </div>

                    <span
                      className={`${scheme.text} font-medium text-sm sm:text-base group-hover/spec:text-white transition-colors duration-300 truncate`}
                    >
                      {spec}
                    </span>
                  </div>

                  {[
                    "React",
                    "JavaScript",
                    "Python",
                    "AI",
                    "Machine Learning",
                    "Data Science",
                  ].some((popular) =>
                    spec.toLowerCase().includes(popular.toLowerCase())
                  ) && (
                    <TrendingUp
                      className={`w-4 h-4 ${scheme.text} opacity-60 group-hover/spec:opacity-100 flex-shrink-0 ml-2 transition-opacity duration-300`}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3 h-3" />
            <span>Expert-level skills</span>
          </div>
          <div className="text-right">
            <span className="font-medium">
              {mentorData.specializations.length} specializations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSpecializationsSection;
