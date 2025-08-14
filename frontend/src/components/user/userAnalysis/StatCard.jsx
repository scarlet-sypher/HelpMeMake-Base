import React, { useState, useEffect } from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color,
  progressValue,
  isLoading = false,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    // Animate the main value
    const numericValue = parseInt(value) || 0;
    const duration = 1000;
    const steps = 50;
    const increment = numericValue / steps;
    let currentValue = 0;

    const valueInterval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(valueInterval);
      }
      setAnimatedValue(Math.round(currentValue));
    }, duration / steps);

    // Animate progress bar if progressValue is provided
    if (progressValue !== undefined) {
      let currentProgress = 0;
      const progressIncrement = progressValue / steps;

      const progressInterval = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= progressValue) {
          currentProgress = progressValue;
          clearInterval(progressInterval);
        }
        setAnimatedProgress(currentProgress);
      }, duration / steps);

      return () => {
        clearInterval(valueInterval);
        clearInterval(progressInterval);
      };
    }

    return () => clearInterval(valueInterval);
  }, [value, progressValue, isLoading]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl blur opacity-20 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse"></div>
            <div className="w-16 h-6 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-8 bg-white/10 rounded mb-2 animate-pulse"></div>
          <div className="w-32 h-4 bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Extract percentage from value for display
  const isPercentage = value.toString().includes("%");
  const displayValue = isPercentage
    ? `${animatedValue}%`
    : animatedValue.toString();

  // Determine if change is positive or negative
  const isPositive =
    change &&
    (change.includes("+") || (!change.includes("-") && !change.includes("0")));
  const changeColor = isPositive ? "text-emerald-400" : "text-red-400";

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500`}
      ></div>

      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-r ${color} rounded-xl shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>

          {/* Animated pulse indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="w-1 h-1 bg-emerald-400 rounded-full opacity-75"></div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className="text-2xl font-bold text-white mb-1">{displayValue}</h3>
          <p className="text-gray-300 text-sm font-medium">{label}</p>
        </div>

        {/* Progress bar if progressValue is provided */}
        {progressValue !== undefined && (
          <div className="mb-3">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${animatedProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Change indicator */}
        {change && (
          <div className="flex items-center">
            <span className={`text-xs font-medium ${changeColor}`}>
              {change}
            </span>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default StatCard;
