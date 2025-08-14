import React, { useState, useEffect } from "react";
import { Star, Zap, Trophy, Crown, TrendingUp, Award } from "lucide-react";

const XPProgressTracker = ({ learnerData, achievements }) => {
  const [animateXP, setAnimateXP] = useState(false);
  const [displayXP, setDisplayXP] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(0);

  const maxLevel = 10;
  const xpPerLevel = 1000;

  // Calculate current level progress
  const currentLevelXP = learnerData.xp % xpPerLevel;
  const progressPercentage = (currentLevelXP / xpPerLevel) * 100;

  // Next level XP needed
  const xpToNextLevel = xpPerLevel - currentLevelXP;
  const isMaxLevel = learnerData.level >= maxLevel;

  // Animate XP changes
  useEffect(() => {
    if (learnerData.xp !== displayXP) {
      setAnimateXP(true);

      // Animate XP counter
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = (learnerData.xp - displayXP) / steps;
      const levelIncrement = (learnerData.level - displayLevel) / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayXP((prev) => Math.floor(prev + increment));
        setDisplayLevel((prev) => Math.floor(prev + levelIncrement));

        if (currentStep >= steps) {
          setDisplayXP(learnerData.xp);
          setDisplayLevel(learnerData.level);
          setAnimateXP(false);
          clearInterval(interval);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [learnerData.xp, learnerData.level]);

  const getLevelIcon = (level) => {
    if (level >= 8) return Crown;
    if (level >= 6) return Trophy;
    if (level >= 4) return Award;
    if (level >= 2) return Star;
    return Zap;
  };

  const getLevelColor = (level) => {
    if (level >= 8) return "from-yellow-400 to-amber-500";
    if (level >= 6) return "from-purple-400 to-indigo-500";
    if (level >= 4) return "from-blue-400 to-cyan-500";
    if (level >= 2) return "from-green-400 to-emerald-500";
    return "from-gray-400 to-gray-500";
  };

  const LevelIcon = getLevelIcon(displayLevel);
  const levelGradient = getLevelColor(displayLevel);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <TrendingUp className="mr-2 text-blue-400" size={20} />
            Your Progress
          </h2>
          <div className="flex items-center space-x-2">
            <Zap className="text-yellow-400" size={16} />
            <span className="text-yellow-300 font-semibold text-sm">
              Level {displayLevel}
            </span>
          </div>
        </div>

        {/* Level Badge and XP Display */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Level Badge */}
          <div className="relative group">
            <div
              className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${levelGradient} 
              border-4 border-white/20 flex items-center justify-center 
              shadow-xl transition-all duration-300 hover:scale-110
              ${animateXP ? "animate-pulse" : ""}
            `}
            >
              <LevelIcon size={32} className="text-white" />
            </div>

            {/* Level number overlay */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white/20">
              <span className="text-white text-sm font-bold">
                {displayLevel}
              </span>
            </div>

            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                Level {displayLevel} {isMaxLevel ? "(MAX)" : ""}
              </div>
            </div>
          </div>

          {/* XP Information */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {displayXP.toLocaleString()} XP
                </span>
                {!isMaxLevel && (
                  <span className="text-gray-300 text-sm">
                    {xpToNextLevel} XP to level {learnerData.level + 1}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {!isMaxLevel ? (
                <div className="relative">
                  <div className="w-full bg-gray-700/50 rounded-full h-3 sm:h-4 overflow-hidden">
                    <div
                      className={`
                        h-full bg-gradient-to-r ${levelGradient} rounded-full transition-all duration-1000 ease-out relative
                        ${animateXP ? "animate-pulse" : ""}
                      `}
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer" />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{currentLevelXP}</span>
                    <span>{xpPerLevel}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full h-4 flex items-center justify-center">
                    <span className="text-yellow-900 font-bold text-sm">
                      MAX LEVEL REACHED!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* XP Breakdown */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-gray-300">Total Badges</div>
                <div className="text-white font-semibold">
                  {achievements?.totalBadges || 0}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-gray-300">Achievements</div>
                <div className="text-white font-semibold">
                  {achievements?.totalAchievements || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Milestones */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
            Level Milestones
          </h3>
          <div className="flex justify-between items-center space-x-1 sm:space-x-2">
            {[...Array(maxLevel + 1)].map((_, index) => {
              const level = index;
              const isAchieved = displayLevel >= level;
              const isCurrent = displayLevel === level;
              const MilestoneIcon = getLevelIcon(level);
              const milestoneGradient = getLevelColor(level);

              return (
                <div
                  key={level}
                  className={`
                    relative flex flex-col items-center group cursor-pointer
                    ${isCurrent ? "transform scale-110" : ""}
                  `}
                >
                  <div
                    className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      isAchieved
                        ? `bg-gradient-to-br ${milestoneGradient} border-2 border-white/30`
                        : "bg-gray-700 border border-gray-500"
                    }
                    ${
                      isCurrent
                        ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent animate-pulse"
                        : ""
                    }
                  `}
                  >
                    <MilestoneIcon
                      size={12}
                      className={isAchieved ? "text-white" : "text-gray-400"}
                    />
                  </div>

                  <span
                    className={`
                    text-xs mt-1 transition-colors duration-300
                    ${isAchieved ? "text-white font-semibold" : "text-gray-500"}
                    ${isCurrent ? "text-yellow-400" : ""}
                  `}
                  >
                    {level}
                  </span>

                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Level {level}{" "}
                      {isAchieved ? "✓" : `(${level * xpPerLevel} XP)`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-300">Streak</div>
            <div className="text-lg sm:text-xl font-bold text-orange-400">
              {learnerData.streakDays || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-300">Max Streak</div>
            <div className="text-lg sm:text-xl font-bold text-purple-400">
              {learnerData.maxStreak || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-gray-300">Total Logins</div>
            <div className="text-lg sm:text-xl font-bold text-blue-400">
              {learnerData.totalLogins || 0}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 sm:p-4 border border-blue-400/20">
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 mr-2" size={16} />
            <span className="text-yellow-300 font-semibold text-sm">
              {isMaxLevel ? "Master Level!" : "Keep it up!"}
            </span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">
            {isMaxLevel
              ? "You've reached the maximum level! You are a true learning master!"
              : `You're ${progressPercentage.toFixed(1)}% of the way to level ${
                  learnerData.level + 1
                }. Every achievement brings you closer to mastery!`}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default XPProgressTracker;
