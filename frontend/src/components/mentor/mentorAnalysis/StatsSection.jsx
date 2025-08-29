import React, { useState, useEffect } from "react";
import {
  Target,
  CheckCircle,
  PlayCircle,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  unit = "",
  percentage = null,
  trend = null,
  color = "cyan",
  animated = true,
  maxValue = 100,
  showProgress = false,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
        if (percentage !== null) {
          setAnimatedPercentage(percentage);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
      if (percentage !== null) {
        setAnimatedPercentage(percentage);
      }
    }
  }, [value, percentage, animated]);

  const getColorClasses = (color) => {
    const colors = {
      cyan: {
        gradient: "from-cyan-500 to-teal-600",
        bg: "from-cyan-500/20 to-teal-600/20",
        border: "border-cyan-400/30",
        icon: "text-cyan-300",
        progress: "bg-gradient-to-r from-cyan-500 to-teal-600",
        text: "text-cyan-200",
      },
      green: {
        gradient: "from-green-500 to-emerald-600",
        bg: "from-green-500/20 to-emerald-600/20",
        border: "border-green-400/30",
        icon: "text-green-300",
        progress: "bg-gradient-to-r from-green-500 to-emerald-600",
        text: "text-green-200",
      },
      blue: {
        gradient: "from-blue-500 to-indigo-600",
        bg: "from-blue-500/20 to-indigo-600/20",
        border: "border-blue-400/30",
        icon: "text-blue-300",
        progress: "bg-gradient-to-r from-blue-500 to-indigo-600",
        text: "text-blue-200",
      },
      purple: {
        gradient: "from-purple-500 to-violet-600",
        bg: "from-purple-500/20 to-violet-600/20",
        border: "border-purple-400/30",
        icon: "text-purple-300",
        progress: "bg-gradient-to-r from-purple-500 to-violet-600",
        text: "text-purple-200",
      },
      orange: {
        gradient: "from-orange-500 to-red-600",
        bg: "from-orange-500/20 to-red-600/20",
        border: "border-orange-400/30",
        icon: "text-orange-300",
        progress: "bg-gradient-to-r from-orange-500 to-red-600",
        text: "text-orange-200",
      },
      yellow: {
        gradient: "from-yellow-500 to-amber-600",
        bg: "from-yellow-500/20 to-amber-600/20",
        border: "border-yellow-400/30",
        icon: "text-yellow-300",
        progress: "bg-gradient-to-r from-yellow-500 to-amber-600",
        text: "text-yellow-200",
      },
      indigo: {
        gradient: "from-indigo-500 to-blue-600",
        bg: "from-indigo-500/20 to-blue-600/20",
        border: "border-indigo-400/30",
        icon: "text-indigo-300",
        progress: "bg-gradient-to-r from-indigo-500 to-blue-600",
        text: "text-indigo-200",
      },
    };
    return colors[color] || colors.cyan;
  };

  const colorClasses = getColorClasses(color);
  const progressWidth = showProgress
    ? (animatedValue / maxValue) * 100
    : animatedPercentage;

  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + "M";
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + "K";
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="group relative">
      {/* Animated gradient background */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses.gradient} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500`}
      ></div>

      {/* Main card */}
      <div
        className={`relative bg-gradient-to-br ${colorClasses.bg} backdrop-blur-sm rounded-2xl p-4 sm:p-6 border ${colorClasses.border} transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
      >
        {/* Mobile Layout (small screens) */}
        <div className="block lg:hidden">
          {/* Icon at top center */}
          <div className="flex justify-center mb-3">
            <div
              className={`p-2.5 bg-gradient-to-r ${colorClasses.gradient} rounded-xl shadow-lg`}
            >
              <Icon className="text-white" size={20} aria-label={label} />
            </div>
          </div>

          {/* Value and Label stacked on right side */}
          <div className="flex justify-end mb-3">
            <div className="flex flex-col items-end">
              <div className="flex items-baseline space-x-1">
                <div className="text-lg font-bold text-white transition-all duration-1000">
                  {formatValue(animatedValue)}
                </div>
                {unit && (
                  <span className={`text-sm font-medium ${colorClasses.text}`}>
                    {unit}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 text-right whitespace-nowrap mt-1">
                {label}
              </p>
            </div>
          </div>

          {/* Progress bar for mobile */}
          {(showProgress || percentage !== null) && (
            <div className="mb-3">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${colorClasses.progress} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${Math.min(progressWidth, 100)}%`,
                    transitionDelay: animated ? "500ms" : "0ms",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Trend indicator for mobile */}
          {trend !== null && (
            <div className="flex justify-center">
              <div
                className={`flex items-center space-x-1 ${
                  trend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend >= 0 ? (
                  <TrendingUp size={12} aria-label="Trending up" />
                ) : (
                  <TrendingDown size={12} aria-label="Trending down" />
                )}
                <span className="text-xs font-semibold">
                  {Math.abs(trend)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout (large screens and up) */}
        <div className="hidden lg:block">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 bg-gradient-to-r ${colorClasses.gradient} rounded-xl shadow-lg`}
            >
              <Icon className="text-white" size={24} aria-label={label} />
            </div>

            {trend !== null && (
              <div
                className={`flex items-center space-x-1 ${
                  trend >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend >= 0 ? (
                  <TrendingUp size={16} aria-label="Trending up" />
                ) : (
                  <TrendingDown size={16} aria-label="Trending down" />
                )}
                <span className="text-sm font-semibold">
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">
              {label}
            </h3>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold text-white transition-all duration-1000">
                {formatValue(animatedValue)}
              </div>
              {unit && (
                <span className={`text-lg font-medium ${colorClasses.text}`}>
                  {unit}
                </span>
              )}
            </div>

            {/* Progress bar */}
            {(showProgress || percentage !== null) && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(progressWidth)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${colorClasses.progress} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${Math.min(progressWidth, 100)}%`,
                      transitionDelay: animated ? "500ms" : "0ms",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sparkle animation on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-ping delay-75"></div>
          <div className="absolute top-12 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-150"></div>
        </div>
      </div>
    </div>
  );
};

// Stats Section Component with proper responsive layout
const StatsSection = ({ analyticsData }) => {
  const overview = analyticsData?.overview || {};
  const sessions = analyticsData?.sessions || {};

  // Define exactly 7 stat cards with live data
  const statsConfig = [
    {
      icon: Target,
      label: "Total Projects",
      value: overview.totalProjects || 0,
      color: "cyan",
      showProgress: true,
      percentage: overview.totalProjects > 0 ? 100 : 0,
    },
    {
      icon: CheckCircle,
      label: "Completed Projects",
      value: overview.completedProjects || 0,
      percentage:
        overview.totalProjects > 0
          ? (overview.completedProjects / overview.totalProjects) * 100
          : 0,
      color: "green",
      showProgress: true,
      maxValue: overview.totalProjects || 1,
    },
    {
      icon: PlayCircle,
      label: "Ongoing Projects",
      value: overview.ongoingProjects || 0,
      percentage:
        overview.totalProjects > 0
          ? (overview.ongoingProjects / overview.totalProjects) * 100
          : 0,
      color: "blue",
      showProgress: true,
      maxValue: overview.totalProjects || 1,
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: overview.successRate || 0,
      unit: "%",
      percentage: overview.successRate || 0,
      color: "green",
    },
    {
      icon: Clock,
      label: "Avg Completion",
      value: overview.averageCompletionDays || 0,
      unit: "days",
      color: "orange",
    },
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: overview.totalEarnings || 0,
      unit: "₹",
      color: "purple",
    },
    {
      icon: Calendar,
      label: "Total Sessions",
      value: sessions.totalSessions || 0,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mobile/Tablet Layout - Simple 2x2 grid that flows naturally */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {statsConfig.map((stat, index) => (
            <div
              key={`mobile-${index}`}
              className={`${
                // Make the last card span full width if odd number of cards
                index === statsConfig.length - 1 && statsConfig.length % 2 === 1
                  ? "col-span-2"
                  : ""
              }`}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - 4+3 layout */}
      <div className="hidden lg:block space-y-6">
        {/* Top Row - 4 Cards */}
        <div className="grid grid-cols-4 gap-6">
          {statsConfig.slice(0, 4).map((stat, index) => (
            <StatCard key={`top-${index}`} {...stat} />
          ))}
        </div>

        {/* Bottom Row - 3 Cards */}
        <div className="grid grid-cols-3 gap-6">
          {statsConfig.slice(4, 7).map((stat, index) => (
            <StatCard key={`bottom-${index}`} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { StatCard, StatsSection };
