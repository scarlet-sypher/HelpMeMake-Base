import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3 } from "lucide-react";

const ProjectStatusChart = ({ data, isLoading = false }) => {
  const [animatedData, setAnimatedData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = {
    completed: "#10b981",
    ongoing: "#3b82f6",
    cancelled: "#ef4444",
    open: "#f59e0b",
  };

  const chartData = [
    { name: "Completed", value: data?.completed || 0, color: colors.completed },
    { name: "Ongoing", value: data?.ongoing || 0, color: colors.ongoing },
    { name: "Open", value: data?.open || 0, color: colors.open },
    { name: "Cancelled", value: data?.cancelled || 0, color: colors.cancelled },
  ].filter((item) => item.value > 0);

  useEffect(() => {
    if (isLoading || !data) return;

    setIsAnimating(true);

    const startData = chartData.map((item) => ({ ...item, value: 0 }));
    setAnimatedData(startData);

    setTimeout(() => {
      setAnimatedData(chartData);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 100);
  }, [data, isLoading]);

  const totalProjects = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalProjects > 0 ? ((data.value / totalProjects) * 100).toFixed(1) : 0;

      return (
        <div className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-2xl">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-gray-300">
            <span className="font-bold" style={{ color: data.payload.color }}>
              {data.value}
            </span>{" "}
            projects ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 animate-pulse"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-32 sm:w-48 h-6 bg-white/10 rounded animate-pulse"></div>
            <div className="w-12 sm:w-16 h-4 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-64 sm:h-80 bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
            <div className="w-24 sm:w-32 h-24 sm:h-32 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (totalProjects === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <BarChart3 className="mr-2 text-purple-400" size={20} />
            <span className="hidden sm:inline">
              Project Status Distribution
            </span>
            <span className="sm:hidden">Project Status</span>
          </h3>
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 text-gray-400">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8" />
            </div>
            <p className="text-center text-sm sm:text-base">
              No projects to display
            </p>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 px-4">
              Start your learning journey by joining a project!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-indigo-500/30 rounded-2xl blur opacity-20 transition duration-500"></div>

      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <BarChart3 className="mr-2 text-purple-400" size={20} />
            <span className="hidden sm:inline">
              Project Status Distribution
            </span>
            <span className="sm:hidden">Project Status</span>
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-purple-300 font-medium">
              Live Data
            </span>
          </div>
        </div>

        {/* Chart and Legend Container */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:space-x-6">
          {/* Chart container */}
          <div className="relative flex-shrink-0">
            <div className="w-full max-w-sm mx-auto h-72 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={animatedData}
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="60%"
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {animatedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={entry.color}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{
                      zIndex: 50,
                    }}
                    position={{ y: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Center display - still centered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-slate-900/80 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex flex-col items-center justify-center border border-white/20">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {totalProjects}
                </div>
                <div className="text-xs text-gray-300">Total</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 mt-6 xl:mt-0">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4">
              Project Breakdown
            </h4>
            <div className="space-y-3">
              {chartData.map((item, index) => {
                const percentage =
                  totalProjects > 0
                    ? ((item.value / totalProjects) * 100).toFixed(1)
                    : 0;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group/item"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/20"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div>
                        <div className="text-white font-medium text-sm sm:text-base">
                          {item.name}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">
                          {item.value} projects
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="text-base sm:text-lg font-bold group-hover/item:scale-110 transition-transform"
                        style={{ color: item.color }}
                      >
                        {percentage}%
                      </div>

                      {/* Mini progress bar */}
                      <div className="w-16 sm:w-20 h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: item.color,
                            transitionDelay: `${index * 200}ms`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                  <div className="text-base sm:text-lg font-bold text-emerald-400">
                    {(((data?.completed || 0) / totalProjects) * 100).toFixed(
                      0
                    )}
                    %
                  </div>
                  <div className="text-xs text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                  <div className="text-base sm:text-lg font-bold text-blue-400">
                    {data?.ongoing || 0}
                  </div>
                  <div className="text-xs text-gray-400">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation indicator */}
        {isAnimating && (
          <div className="absolute top-4 right-4">
            <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStatusChart;
