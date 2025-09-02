import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Lock,
  Star,
  Sparkles,
  Trophy,
  Crown,
  Shield,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import BadgeAnimator from "./BadgeAnimator";
import LegendaryOverlay from "./LegendaryOverlay";

const AchievementBadge = () => {
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deduplicatedBadges, setDeduplicatedBadges] = useState({});
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [legendaryOverlayOpen, setLegendaryOverlayOpen] = useState(false);
  const legendaryRef = useRef(null);

  const badgeLevels = {
    basic: {
      name: "Basic Badge",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-400/50",
      glowColor: "shadow-blue-500/20",
      textColor: "text-blue-200",
      stars: 1,
      position: "left",
    },
    common: {
      name: "Common Badge",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-400/50",
      glowColor: "shadow-green-500/20",
      textColor: "text-green-200",
      stars: 2,
      position: "right",
    },
    rare: {
      name: "Rare Badge",
      icon: Zap,
      color: "from-purple-500 to-violet-500",
      borderColor: "border-purple-400/50",
      glowColor: "shadow-purple-500/20",
      textColor: "text-purple-200",
      stars: 3,
      position: "top",
    },
    epic: {
      name: "Epic Badge",
      icon: Trophy,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-400/50",
      glowColor: "shadow-orange-500/20",
      textColor: "text-orange-200",
      stars: 4,
      position: "bottom",
    },
    legendary: {
      name: "Legendary Badge",
      icon: Crown,
      color: "from-yellow-400 to-amber-500",
      borderColor: "border-yellow-400/50",
      glowColor: "shadow-yellow-500/30",
      textColor: "text-yellow-200",
      stars: 5,
      position: "center",
    },
  };

  useEffect(() => {
    console.log("=== BADGES FETCH USEEFFECT TRIGGERED ===");
    fetchBadgeData();
  }, []);

  useEffect(() => {
    if (badgeData && badgeData.categories) {
      deduplicateBadges();
    }
  }, [badgeData]);

  const fetchBadgeData = async () => {
    try {
      console.log("=== FETCH BADGE DATA START ===");
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      console.log("API URL being used:", apiUrl);
      console.log(
        "Token from localStorage:",
        token ? "[TOKEN PRESENT]" : "[NO TOKEN FOUND]"
      );

      const response = await axios.get(`${apiUrl}/api/achievements/badges`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Raw API Response:", response);

      if (response.data.success) {
        console.log("Badge data received:", response.data.data);
        setBadgeData(response.data.data);
      } else {
        console.warn(
          "API responded with success=false:",
          response.data.message
        );
        throw new Error(response.data.message || "Failed to fetch badge data");
      }
    } catch (err) {
      console.error("Error fetching badge data:", err);
      console.log("Error details:", err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch badge data"
      );
    } finally {
      setLoading(false);
      console.log("=== FETCH BADGE DATA END ===");
    }
  };

  const deduplicateBadges = () => {
    if (!badgeData || !badgeData.categories) return;

    const badgeTypes = ["basic", "common", "rare", "epic", "legendary"];
    const deduped = {};

    badgeTypes.forEach((badgeType) => {
      let unlockedBadge = null;
      let fallbackBadge = null;

      for (const category of badgeData.categories) {
        const badge = category.badges.find((b) => b.level === badgeType);
        if (badge) {
          if (badge.unlocked && !unlockedBadge) {
            unlockedBadge = {
              ...badge,
              categoryTitle: category.title,
              categoryIcon: category.icon,
            };
          }
          if (!fallbackBadge) {
            fallbackBadge = {
              ...badge,
              categoryTitle: category.title,
              categoryIcon: category.icon,
            };
          }
        }
      }

      const badgeToAdd = unlockedBadge || fallbackBadge;

      if (badgeToAdd) {
        deduped[badgeType] = {
          ...badgeToAdd,
          level: badgeType,

          unlocked: unlockedBadge ? true : false,

          current: unlockedBadge
            ? badgeToAdd.current
            : badgeData.categories.reduce((sum, cat) => {
                const badge = cat.badges.find((b) => b.level === badgeType);
                return sum + (badge ? badge.current : 0);
              }, 0),
          required: badgeToAdd.required,
        };
      }
    });

    console.log("Deduplicated badges:", deduped);
    setDeduplicatedBadges(deduped);
  };

  const renderBadge = (badgeType, isCenter = false) => {
    const badge = deduplicatedBadges[badgeType];
    if (!badge) return null;

    const levelConfig = badgeLevels[badgeType];
    const IconComponent = levelConfig.icon;

    const progress = badge.unlocked
      ? 100
      : Math.min((badge.current / badge.required) * 100, 100);

    const tooltipText = badge.unlocked
      ? levelConfig.name
      : `${levelConfig.name} - Unlock at least one badge to display it here`;

    const handleLegendaryAnimation = () => {
      if (badgeType === "legendary" && badge.unlocked) {
        if (legendaryRef.current) {
          legendaryRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        setTimeout(() => {
          setLegendaryOverlayOpen(true);
        }, 500);
      }
    };

    return (
      <BadgeAnimator
        key={badgeType}
        type={badgeType}
        unlocked={badge.unlocked}
        centerRef={badgeType === "epic" ? legendaryRef : null}
        onStart={handleLegendaryAnimation}
      >
        <div
          ref={badgeType === "legendary" ? legendaryRef : null}
          className={`
            relative group cursor-pointer transition-all duration-500 
            ${
              badge.unlocked
                ? `bg-gradient-to-br ${levelConfig.color} hover:scale-110 border-2 ${levelConfig.borderColor} shadow-xl ${levelConfig.glowColor}`
                : "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105"
            }
            ${isCenter ? "w-20 h-20 rounded-2xl" : "w-16 h-16 rounded-xl"}
            backdrop-blur-sm overflow-hidden flex items-center justify-center
          `}
          onMouseEnter={() => setHoveredBadge(badgeType)}
          onMouseLeave={() => setHoveredBadge(null)}
        >
          {/* Animated background effects for unlocked badges */}
          {badge.unlocked && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {badgeType === "legendary" && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 animate-pulse rounded-2xl"></div>
              )}
            </>
          )}

          {/* Sparkle effects for higher tier badges */}
          {badge.unlocked &&
            (badgeType === "epic" || badgeType === "legendary") && (
              <>
                <div
                  className={`absolute -top-1 -right-1 text-yellow-400 animate-bounce`}
                >
                  <Sparkles size={isCenter ? 16 : 12} />
                </div>
                <div
                  className={`absolute -top-1 -left-1 text-blue-400 animate-pulse`}
                >
                  <Star size={isCenter ? 12 : 8} />
                </div>
              </>
            )}

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Badge Icon */}
            <div className="relative">
              <IconComponent
                size={isCenter ? 32 : 24}
                className={
                  badge.unlocked ? levelConfig.textColor : "text-gray-400"
                }
              />

              {/* Lock overlay for locked badges */}
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={isCenter ? 20 : 16} className="text-gray-300" />
                </div>
              )}
            </div>

            {/* Stars for unlocked badges */}
            {badge.unlocked && (
              <div className="flex mt-1">
                {[...Array(levelConfig.stars)].map((_, i) => (
                  <Star
                    key={i}
                    size={isCenter ? 8 : 6}
                    className={`fill-current ${levelConfig.textColor}`}
                  />
                ))}
              </div>
            )}

            {/* Progress bar for locked badges (only show on center badge) */}
            {!badge.unlocked && isCenter && (
              <div className="w-12 bg-white/20 rounded-full h-1 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Tooltip */}
          {hoveredBadge === badgeType && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              <div className="bg-black/90 backdrop-blur-sm text-white text-xs py-2 px-3 rounded-lg border border-white/20 shadow-xl whitespace-nowrap">
                {tooltipText}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          )}
        </div>
      </BadgeAnimator>
    );
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin text-blue-400 mr-3" size={20} />
          <span className="text-white text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-8 text-center">
          <div>
            <AlertCircle className="text-red-400 mx-auto mb-3" size={32} />
            <h3 className="text-lg font-bold text-white mb-2">
              Failed to Load
            </h3>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchBadgeData}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    !badgeData ||
    !badgeData.categories ||
    badgeData.categories.length === 0 ||
    Object.keys(deduplicatedBadges).length === 0
  ) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="text-center py-8 text-gray-400">
          <Trophy className="mx-auto mb-3 opacity-50" size={32} />
          <p className="text-sm">No achievement data available.</p>
        </div>
      </div>
    );
  }

  const totalUnlocked = Object.values(deduplicatedBadges).filter(
    (badge) => badge.unlocked
  ).length;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Trophy className="mr-2 text-yellow-400" size={20} />
            Hall of Frames
          </h2>
          <div className="text-right">
            <div className="text-xl font-bold text-yellow-400">
              {totalUnlocked}/5
            </div>
            <div className="text-xs text-gray-400">Unlocked</div>
          </div>
        </div>

        {/* Badge Layout - Cross Pattern with Legendary in Center */}
        <div className="relative w-full max-w-[240px] mx-auto">
          <div className="relative flex items-center justify-center h-[235px] w-[235px]">
            {/* Top Badge (Rare) */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              {renderBadge("rare")}
            </div>

            {/* Left Badge (Basic) */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              {renderBadge("basic")}
            </div>

            {/* Center Badge (Legendary) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {renderBadge("legendary", true)}
            </div>

            {/* Right Badge (Common) */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {renderBadge("common")}
            </div>

            {/* Bottom Badge (Epic) */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              {renderBadge("epic")}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {totalUnlocked < 5 && (
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-400 mb-2">
              {5 - totalUnlocked} badges remaining to unlock
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-700"
                style={{ width: `${(totalUnlocked / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Legendary Overlay */}
      <LegendaryOverlay
        open={legendaryOverlayOpen}
        onClose={() => setLegendaryOverlayOpen(false)}
        label="LEGENDARY!"
      />
    </div>
  );
};

export default AchievementBadge;
