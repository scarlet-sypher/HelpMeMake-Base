import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, change, color }) => {
  // Extract the trend direction from the change text
  const isPositive = change.includes("+");
  const isNegative = change.includes("-");

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group relative overflow-hidden">
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      {/* Floating orb effect */}
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r ${color} opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500`}
      ></div>

      <div className="relative z-10">
        {/* Mobile Layout (small screens) */}
        <div className="block sm:hidden">
          {/* Icon at top center */}
          <div className="flex justify-center mb-3">
            <div
              className={`p-2.5 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}
            >
              <Icon size={20} className="text-white" />
            </div>
          </div>

          {/* Value and Label stacked on right side */}
          <div className="flex justify-end mb-3">
            <div className="flex flex-col items-end">
              <p className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                {value}
              </p>
              <p className="text-xs text-blue-200 group-hover:text-blue-100 transition-colors duration-300 text-right whitespace-nowrap">
                {label}
              </p>
            </div>
          </div>

          {/* Change and Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              {isPositive && (
                <TrendingUp
                  size={14}
                  className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"
                />
              )}
              {isNegative && (
                <TrendingDown
                  size={14}
                  className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
                />
              )}
              <span
                className={`text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                  isPositive
                    ? "text-emerald-400 group-hover:text-emerald-300"
                    : isNegative
                    ? "text-red-400 group-hover:text-red-300"
                    : "text-blue-300 group-hover:text-blue-200"
                }`}
              >
                {change}
              </span>
            </div>

            {/* Progress indicator - smaller on mobile */}
            <div className="flex space-x-0.5">
              <div
                className={`w-0.5 h-3 rounded-full bg-gradient-to-t ${color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              ></div>
              <div
                className={`w-0.5 h-4 rounded-full bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div
                className={`w-0.5 h-2.5 rounded-full bg-gradient-to-t ${color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              ></div>
            </div>
          </div>
        </div>

        {/* Desktop Layout (medium screens and up) */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}
            >
              <Icon size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl lg:text-3xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                {value}
              </p>
              <p className="text-sm text-blue-200 group-hover:text-blue-100 transition-colors duration-300 whitespace-nowrap">
                {label}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPositive && (
                <TrendingUp
                  size={16}
                  className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"
                />
              )}
              {isNegative && (
                <TrendingDown
                  size={16}
                  className="text-red-400 group-hover:text-red-300 transition-colors duration-300"
                />
              )}
              <span
                className={`text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  isPositive
                    ? "text-emerald-400 group-hover:text-emerald-300"
                    : isNegative
                    ? "text-red-400 group-hover:text-red-300"
                    : "text-blue-300 group-hover:text-blue-200"
                }`}
              >
                {change}
              </span>
            </div>

            {/* Progress indicator */}
            <div className="flex space-x-1">
              <div
                className={`w-1 h-4 rounded-full bg-gradient-to-t ${color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              ></div>
              <div
                className={`w-1 h-6 rounded-full bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div
                className={`w-1 h-3 rounded-full bg-gradient-to-t ${color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
              ></div>
            </div>
          </div>
        </div>

        {/* Subtle bottom glow */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-b-2xl`}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
