// =====================================================New==========================================================

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, TrendingUp } from "lucide-react";

const DonutChart = ({ data, title = "Project Distribution" }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Prepare chart data with memoization
  const chartData = useMemo(() => {
    return [
      { name: "Completed", value: data.completed || 0, color: "#10B981" },
      { name: "Ongoing", value: data.ongoing || 0, color: "#3B82F6" },
      { name: "Cancelled", value: data.cancelled || 0, color: "#EF4444" },
      { name: "Open", value: data.open || 0, color: "#F59E0B" },
    ].filter((item) => item.value > 0);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(chartData);
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [chartData]);

  const total = animatedData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage =
        total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-white font-semibold text-sm">{item.name}</p>
              <p className="text-gray-300 text-xs">
                {item.value} projects ({percentage}%)
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-purple-200">Project status overview</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Activity className="text-purple-300" size={32} />
            </div>
            <p className="text-gray-300 text-lg mb-2">No projects yet</p>
            <p className="text-gray-400 text-sm">
              Start mentoring to see your project analytics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              {title}
            </h3>
            <p className="text-purple-200 text-sm sm:text-base">
              Total: {total} projects
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <TrendingUp size={16} className="sm:size-5" />
          <span className="text-xs sm:text-sm font-medium">Active</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div className="h-56 sm:h-64 md:h-72 lg:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={animatedData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="85%"
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
                animationEasing="ease-out"
                strokeWidth={0}
              >
                {animatedData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color}
                    className="drop-shadow-sm hover:brightness-110 transition-all duration-200"
                    style={{
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1">
              {total}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm uppercase tracking-wide">
              Total Projects
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
        {animatedData.map((item, idx) => {
          const percentage =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div
              key={item.name}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-white font-medium text-xs sm:text-sm">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-xs sm:text-sm">
                  {item.value}
                </div>
                <div className="text-gray-400 text-[10px] sm:text-xs">
                  {percentage}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bars */}
      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        {animatedData.map((item, idx) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={`progress-${idx}`} className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-xs sm:text-sm">
                  {item.name}
                </span>
                <span className="text-white text-xs sm:text-sm font-medium">
                  {percentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    backgroundColor: item.color,
                    width: `${percentage}%`,
                    transitionDelay: `${(idx + 4) * 150}ms`,
                    boxShadow: `0 0 10px ${item.color}40`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
