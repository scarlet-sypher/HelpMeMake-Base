import React, { useState } from "react";
import {
  Target,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  Crown,
  Trophy,
  Zap,
  Medal,
  Sparkles,
} from "lucide-react";
import BadgeAnimations from "./BadgeAnimations";

const AchievementCategoryList = ({
  achievements,
  onBadgeClick,
  newBadges = [],
}) => {
  const [expandedCategory, setExpandedCategory] = useState("project");
  const [animatingBadges, setAnimatingBadges] = useState(new Set());

  const categoryIcons = {
    project: Target,
    social: Users,
    learnerStats: BookOpen,
    milestone: CheckCircle,
  };

  const categoryColors = {
    project: {
      bg: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-400/30",
      text: "text-blue-400",
      icon: "text-blue-400",
    },
    social: {
      bg: "from-green-500/20 to-emerald-500/20",
      border: "border-green-400/30",
      text: "text-green-400",
      icon: "text-green-400",
    },
    learner: {
      bg: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-400/30",
      text: "text-purple-400",
      icon: "text-purple-400",
    },
    milestone: {
      bg: "from-orange-500/20 to-red-500/20",
      border: "border-orange-400/30",
      text: "text-orange-400",
      icon: "text-orange-400",
    },

    learnerStats: {
      bg: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-400/30",
      text: "text-purple-400",
      icon: "text-purple-400",
    },
  };

  const badgeStyles = {
    basic: {
      gradient: "from-gray-400 to-gray-600",
      shadow: "shadow-gray-500/20",
      glow: "hover:shadow-gray-400/40",
      text: "text-gray-100",
    },
    common: {
      gradient: "from-blue-400 to-blue-600",
      shadow: "shadow-blue-500/20",
      glow: "hover:shadow-blue-400/40",
      text: "text-blue-100",
    },
    rare: {
      gradient: "from-purple-400 to-purple-600",
      shadow: "shadow-purple-500/20",
      glow: "hover:shadow-purple-400/40",
      text: "text-purple-100",
    },
    epic: {
      gradient: "from-orange-400 to-red-600",
      shadow: "shadow-orange-500/20",
      glow: "hover:shadow-orange-400/40",
      text: "text-orange-100",
    },
    legendary: {
      gradient: "from-yellow-400 to-amber-600",
      shadow: "shadow-yellow-500/20",
      glow: "hover:shadow-yellow-400/40",
      text: "text-yellow-100",
    },
  };

  const getBadgeIcon = (level) => {
    switch (level) {
      case "basic":
        return Star;
      case "common":
        return Trophy;
      case "rare":
        return Medal;
      case "epic":
        return Crown;
      case "legendary":
        return Sparkles;
      default:
        return Star;
    }
  };

  const renderBadge = (categoryKey, achievementKey, achievement, level) => {
    const isUnlocked = achievement.earnedBadges?.includes(level) || false;
    const BadgeIcon = getBadgeIcon(level);
    const style = badgeStyles[level];
    const badgeId = `${categoryKey}-${achievementKey}-${level}`;

    const isNewBadge = newBadges.some(
      (badge) =>
        badge.category === categoryKey &&
        badge.type === achievementKey &&
        badge.level === level
    );

    const handleBadgeClick = () => {
      if (isUnlocked && !animatingBadges.has(badgeId)) {
        setAnimatingBadges((prev) => new Set([...prev, badgeId]));
        if (onBadgeClick) {
          onBadgeClick({
            category: categoryKey,
            type: achievementKey,
            level,
            badgeId,
          });
        }
      }
    };

    const handleAnimationComplete = () => {
      setAnimatingBadges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(badgeId);
        return newSet;
      });
    };

    return (
      <div key={level} className="relative">
        <BadgeAnimations
          badge={{ ...achievement, earnedBadges: [level] }}
          onAnimationComplete={handleAnimationComplete}
          isClickable={isUnlocked}
          cooldownTime={15}
        >
          <div
            className={`
              relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 transition-all duration-300 group cursor-pointer
              ${
                isUnlocked
                  ? `bg-gradient-to-br ${style.gradient} ${style.shadow} ${style.glow} border-white/20 hover:scale-110`
                  : "bg-gray-800/50 border-gray-600/30 opacity-50"
              }
              ${isNewBadge ? "animate-pulse ring-4 ring-yellow-400/50" : ""}
            `}
            onClick={handleBadgeClick}
          >
            {/* Badge Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <BadgeIcon
                size={24}
                className={`${
                  isUnlocked ? style.text : "text-gray-500"
                } transition-all duration-300`}
              />
            </div>

            {/* Badge Level Stars */}
            <div className="absolute -top-1 -right-1 flex space-x-0.5">
              {[
                ...Array(
                  level === "basic"
                    ? 1
                    : level === "common"
                    ? 2
                    : level === "rare"
                    ? 3
                    : level === "epic"
                    ? 4
                    : 5
                ),
              ].map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className={`${
                    isUnlocked
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Progress indicator for locked badges */}
            {!isUnlocked && (
              <div className="absolute bottom-1 left-1 right-1">
                <div className="bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        ((achievement.currentCount || 0) /
                          (achievement[level] || 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* New badge indicator */}
            {isNewBadge && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles size={12} className="text-yellow-900" />
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {isUnlocked
                  ? `${level.charAt(0).toUpperCase() + level.slice(1)} Badge`
                  : `${achievement.currentCount || 0}/${
                      achievement[level] || 0
                    }`}
              </div>
            </div>
          </div>
        </BadgeAnimations>
      </div>
    );
  };

  const renderAchievementSection = (categoryKey, categoryData) => {
    const CategoryIcon = categoryIcons[categoryKey] || BookOpen;
    const colors = categoryColors[categoryKey] || categoryColors.learner;
    const isExpanded = expandedCategory === categoryKey;

    const validAchievements = Object.entries(categoryData).filter(
      ([key, value]) => {
        return (
          ![
            "_id",
            "learner",
            "xp",
            "level",
            "nextLevelXp",
            "unlocked",
            "totalBadges",
            "totalAchievements",
            "createdAt",
            "updatedAt",
            "__v",
          ].includes(key) &&
          value &&
          typeof value === "object" &&
          (value.hasOwnProperty("currentCount") || key === "firstLogin")
        );
      }
    );

    if (validAchievements.length === 0) {
      return null;
    }

    return (
      <div
        key={categoryKey}
        className={`bg-gradient-to-r ${colors.bg} backdrop-blur-sm rounded-2xl border ${colors.border} overflow-hidden`}
      >
        {/* Category Header */}
        <div
          className="p-4 sm:p-6 cursor-pointer hover:bg-white/5 transition-all duration-300"
          onClick={() => setExpandedCategory(isExpanded ? null : categoryKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white/10`}>
                <CategoryIcon size={24} className={colors.icon} />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-bold ${colors.text}`}>
                  {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}{" "}
                  Achievements
                </h3>
                <p className="text-gray-300 text-sm">
                  {validAchievements.length} achievement types
                </p>
              </div>
            </div>
            <div
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={colors.text}
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Content */}
        {isExpanded && (
          <div className="px-4 pb-6 sm:px-6">
            {validAchievements.map(([achievementKey, achievement]) => {
              if (achievementKey === "firstLogin") {
                return (
                  <div key={achievementKey} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold capitalize">
                        First Login Achievement
                      </h4>
                      <span
                        className={`text-sm ${
                          achievement ? colors.text : "text-gray-400"
                        }`}
                      >
                        {achievement ? "Completed!" : "Not achieved yet"}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <div
                        className={`
                    w-20 h-20 rounded-xl border-2 flex items-center justify-center
                    ${
                      achievement
                        ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300/50"
                        : "bg-gray-800/50 border-gray-600/30 opacity-50"
                    }
                  `}
                      >
                        <BookOpen
                          size={24}
                          className={
                            achievement ? "text-green-100" : "text-gray-500"
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={achievementKey} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold capitalize">
                      {achievementKey.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <span className={`text-sm ${colors.text}`}>
                      {achievement.currentCount} completed
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {["basic", "common", "rare", "epic", "legendary"].map(
                      (level) =>
                        renderBadge(
                          categoryKey,
                          achievementKey,
                          achievement,
                          level
                        )
                    )}
                  </div>

                  {/* Progress bar for current achievement */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress to next badge</span>
                      <span>
                        {achievement.currentCount || 0}/
                        {achievement.earnedBadges?.includes("legendary")
                          ? achievement.legendary
                          : achievement.earnedBadges?.includes("epic")
                          ? achievement.legendary
                          : achievement.earnedBadges?.includes("rare")
                          ? achievement.epic
                          : achievement.earnedBadges?.includes("common")
                          ? achievement.rare
                          : achievement.earnedBadges?.includes("basic")
                          ? achievement.common
                          : achievement.basic}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${colors.bg.replace(
                          "/20",
                          "/60"
                        )} transition-all duration-500`}
                        style={{
                          width: `${Math.min(
                            ((achievement.currentCount || 0) /
                              (achievement.earnedBadges?.includes("legendary")
                                ? achievement.legendary
                                : achievement.earnedBadges?.includes("epic")
                                ? achievement.legendary
                                : achievement.earnedBadges?.includes("rare")
                                ? achievement.epic
                                : achievement.earnedBadges?.includes("common")
                                ? achievement.rare
                                : achievement.earnedBadges?.includes("basic")
                                ? achievement.common
                                : achievement.basic || 1)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!achievements) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="text-gray-400" size={24} />
        </div>
        <p className="text-gray-400">No achievements data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {Object.entries(achievements).map(([categoryKey, categoryData]) => {
        if (
          [
            "_id",
            "learner",
            "xp",
            "level",
            "nextLevelXp",
            "unlocked",
            "totalBadges",
            "totalAchievements",
            "createdAt",
            "updatedAt",
            "__v",
          ].includes(categoryKey)
        ) {
          return null;
        }

        return renderAchievementSection(categoryKey, categoryData);
      })}
    </div>
  );
};

export default AchievementCategoryList;
