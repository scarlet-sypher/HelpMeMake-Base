import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, Target } from "lucide-react";

const MonthlyTrend = ({ data, title = "Monthly Completion Trend" }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(data);
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  const maxCompleted = Math.max(...animatedData.map((m) => m.completed), 1);
  const totalCompleted = animatedData.reduce(
    (sum, month) => sum + month.completed,
    0
  );
  const averageCompleted =
    Math.round(totalCompleted / animatedData.length) || 0;

  const getBarHeight = (completed) => {
    const baseHeight = 160;
    const minHeight = 8;

    if (maxCompleted === 0) return minHeight;

    if (maxCompleted > 20) {
      const logMax = Math.log(maxCompleted + 1);
      const logValue = Math.log(completed + 1);
      const percentage = logValue / logMax;
      return Math.max(percentage * baseHeight, minHeight);
    } else {
      const percentage = completed / maxCompleted;
      return Math.max(percentage * baseHeight, minHeight);
    }
  };

  const Colors = [
    "#f43f5e",
    "#f97316",
    "#facc15",
    "#84cc16",
    "#10b981",
    "#14b8a6",
    "#0ea5e9",
    "#6366f1",
    "#a855f7",
    "#ec4899",
  ];

  const getBarColor = (completed, index) => {
    return Colors[index % Colors.length];
  };

  const getYAxisLabels = () => {
    const labels = [];
    if (maxCompleted <= 10) {
      for (
        let i = maxCompleted;
        i >= 0;
        i -= Math.max(1, Math.floor(maxCompleted / 5))
      ) {
        labels.push(i);
      }
    } else if (maxCompleted <= 50) {
      const increment = Math.ceil(maxCompleted / 5);
      for (let i = maxCompleted; i >= 0; i -= increment) {
        labels.push(Math.round(i));
      }
    } else {
      const increment = Math.ceil(maxCompleted / 4);
      for (let i = maxCompleted; i >= 0; i -= increment) {
        labels.push(Math.round(i));
      }
    }
    return labels.slice(0, 6);
  };

  const yAxisLabels = getYAxisLabels();

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl shadow-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-emerald-200">
              Projects completed over time
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32 sm:h-40">
          <div className="text-center">
            <BarChart3 className="text-emerald-300 mx-auto mb-3" size={32} />
            <p className="text-gray-300 text-sm sm:text-base">
              No trend data available
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Complete projects to see trends
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-emerald-500/20 hover:border-emerald-400/30 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl shadow-lg">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-sm sm:text-base text-emerald-200">
              Projects completed over time
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400">
          <TrendingUp size={16} className="sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">Growth Trend</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-500/20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Target className="text-emerald-400 shrink-0" size={16} />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {totalCompleted}
              </div>
              <div className="text-emerald-200 text-xs sm:text-sm">
                Total Completed
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-teal-500/20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Calendar className="text-teal-400 shrink-0" size={16} />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {averageCompleted}
              </div>
              <div className="text-teal-200 text-xs sm:text-sm">
                Monthly Average
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-cyan-500/20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <TrendingUp className="text-cyan-400 shrink-0" size={16} />
            <div className="min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">
                {maxCompleted}
              </div>
              <div className="text-cyan-200 text-xs sm:text-sm">Peak Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels with dynamic scaling */}
        <div className="absolute left-0 top-0 bottom-8 w-8 sm:w-10 flex flex-col justify-between text-gray-400 text-xs pr-2">
          {yAxisLabels.map((label, index) => (
            <span key={index} className="text-right leading-none">
              {label}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-10 sm:ml-12 relative overflow-x-auto">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yAxisLabels.map((_, i) => (
              <div
                key={i}
                className="border-t border-gray-700/30 w-full"
                style={{ marginTop: i === 0 ? 0 : -1 }}
              />
            ))}
          </div>

          {/* Bars container with responsive width */}
          <div
            className="flex items-end justify-between h-48 sm:h-56 lg:h-64 relative z-10 px-1"
            style={{
              minWidth:
                animatedData.length > 8
                  ? `${animatedData.length * 60}px`
                  : "100%",
              gap: animatedData.length > 12 ? "4px" : "8px",
            }}
          >
            {animatedData.map((month, index) => {
              const barHeight = getBarHeight(month.completed);

              return (
                <div
                  key={month.month}
                  className="flex flex-col items-center group cursor-pointer relative"
                  style={{
                    width:
                      animatedData.length > 8
                        ? "48px"
                        : `${Math.max(100 / animatedData.length - 2, 12)}%`,
                    minWidth: "24px",
                  }}
                >
                  {/* Bar with improved height handling */}
                  <div className="relative flex flex-col items-center w-full h-full justify-end">
                    {/* Value label - shows on hover for mobile, always visible on desktop for high values */}
                    <div
                      className={`mb-1 sm:mb-2 text-white font-bold text-xs sm:text-sm transition-all duration-300 ${
                        month.completed > maxCompleted * 0.7 ||
                        window.innerWidth >= 640
                          ? "opacity-0 group-hover:opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } ${isVisible ? "animate-bounce" : ""}`}
                      style={{
                        animationDelay: `${index * 150 + 800}ms`,
                        animationDuration: "0.6s",
                        animationFillMode: "forwards",
                      }}
                    >
                      {month.completed}
                    </div>

                    {/* Animated bar with logarithmic scaling */}
                    <div className="w-full relative">
                      <div
                        className="w-full rounded-t-lg relative overflow-hidden group-hover:scale-105 transition-all duration-300 shadow-lg"
                        style={{
                          height: `${barHeight}px`,
                          backgroundColor: getBarColor(month.completed, index),
                          animation: isVisible
                            ? `growUp 1s ease-out ${index * 100}ms forwards`
                            : "none",
                          transform: isVisible ? "scaleY(1)" : "scaleY(0)",
                          transformOrigin: "bottom",
                        }}
                      >
                        {/* Enhanced shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Month label with responsive text */}
                  <div
                    className={`mt-2 sm:mt-3 text-center transform transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{
                      transitionDelay: `${index * 100 + 400}ms`,
                    }}
                  >
                    {/* Small screens: stacked Month + Year */}
                    <div className="flex flex-col items-center leading-tight sm:hidden px-1">
                      <span className="text-white font-semibold text-xs group-hover:text-emerald-300 transition-colors duration-200 truncate">
                        {month.month.split(" ")[0]}
                      </span>
                      <span className="text-gray-400 text-[10px]">
                        {month.month.split(" ")[1] || ""}
                      </span>
                    </div>

                    {/* Larger screens: Month Year inline */}
                    <div className="hidden sm:block px-1">
                      <span className="text-white font-semibold text-xs sm:text-sm group-hover:text-emerald-300 transition-colors duration-200 truncate">
                        {month.month}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced tooltip */}
                  <div
                    className="absolute left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-20 whitespace-nowrap"
                    style={{
                      bottom: `${40}px`,
                    }}
                  >
                    <div className="text-white text-xs sm:text-sm font-medium">
                      {month.month}
                    </div>
                    <div className="text-gray-300 text-xs">
                      <span className="font-semibold text-emerald-400">
                        {month.completed}
                      </span>{" "}
                      projects completed
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis line */}
          <div className="border-t border-gray-600/50 mt-2" />
        </div>

        {/* Scroll indicator for mobile when needed */}
        {animatedData.length > 8 && (
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="text-xs text-gray-400 bg-gray-800/50 rounded-full px-3 py-1 backdrop-blur-sm">
              ← Scroll to view all months →
            </div>
          </div>
        )}
      </div>

      {/* Value range indicator for high counts */}
      {maxCompleted > 20 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/30 rounded-full px-3 py-1 text-xs text-gray-400">
            <span>Range: 0 - {maxCompleted}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>Logarithmic scale applied</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes growUp {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
      `}</style>
    </div>
  );
};

export default MonthlyTrend;
