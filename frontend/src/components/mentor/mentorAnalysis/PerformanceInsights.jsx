import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Target,
  Award,
  DollarSign,
} from "lucide-react";

const PerformanceInsights = ({ data, title = "Performance Insights" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value) => {
    if (!value) return "₹0";
    return `₹${value.toLocaleString()}`;
  };

  const getPerformanceLevel = (rate) => {
    if (rate >= 90)
      return {
        level: "Excellent",
        color: "text-green-400",
        bg: "bg-green-500/20",
      };
    if (rate >= 75)
      return { level: "Good", color: "text-blue-400", bg: "bg-blue-500/20" };
    if (rate >= 60)
      return {
        level: "Average",
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
      };
    return {
      level: "Needs Improvement",
      color: "text-red-400",
      bg: "bg-red-500/20",
    };
  };

  const insights = [
    {
      label: "Success Rate",
      value: `${data?.successRate || 0}%`,
      trend: data?.successRateTrend || 0,
      icon: Target,
      performance: getPerformanceLevel(data?.successRate || 0),
    },
    {
      label: "Average Rating",
      value: data?.averageRating || "0.0",
      trend: data?.ratingTrend || 0,
      icon: Star,
      suffix: "/5.0",
    },
    {
      label: "Response Time",
      value: `${data?.responseTime || 0}`,
      trend: data?.responseTimeTrend || 0,
      icon: Clock,
      suffix: " min",
    },
    {
      label: "Completion Rate",
      value: `${data?.completionRate || 0}%`,
      trend: data?.completionRateTrend || 0,
      icon: Award,
    },
  ];

  const earnings = {
    total: data?.totalEarnings || 0,
    thisMonth: data?.thisMonthEarnings || 0,
    lastMonth: data?.lastMonthEarnings || 0,
    avgPerProject: data?.avgEarningsPerProject || 0,
  };

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl p-8 border border-violet-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-violet-200">Performance analytics</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <TrendingUp className="text-violet-300 mx-auto mb-3" size={32} />
            <p className="text-gray-300">No performance data available</p>
            <p className="text-gray-400 text-sm">
              Complete projects to see insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl p-8 border border-violet-500/20 hover:border-violet-400/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-lg">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <p className="text-violet-200">Key metrics and recommendations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Key Performance Indicators
          </h4>

          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              const isPositiveTrend = insight.trend >= 0;

              return (
                <div
                  key={insight.label}
                  className={`p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-violet-500/20 to-purple-600/20 rounded-xl">
                        <IconComponent className="text-violet-300" size={20} />
                      </div>
                      <span className="text-gray-300 font-medium">
                        {insight.label}
                      </span>
                    </div>

                    {insight.trend !== undefined && (
                      <div
                        className={`flex items-center space-x-1 ${
                          isPositiveTrend ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {isPositiveTrend ? (
                          <TrendingUp size={16} />
                        ) : (
                          <TrendingDown size={16} />
                        )}
                        <span className="text-sm font-semibold">
                          {Math.abs(insight.trend)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">
                        {insight.value}
                      </span>
                      {insight.suffix && (
                        <span className="text-lg text-violet-200">
                          {insight.suffix}
                        </span>
                      )}
                    </div>

                    {insight.performance && (
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${insight.performance.bg} ${insight.performance.color} border border-current/30`}
                      >
                        {insight.performance.level}
                      </div>
                    )}
                  </div>

                  {/* Progress bar for percentage values */}
                  {insight.value.includes("%") && (
                    <div className="mt-3">
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.min(
                              parseFloat(insight.value),
                              100
                            )}%`,
                            transitionDelay: `${(index + 4) * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            Earnings Breakdown
          </h4>

          <div className="space-y-4">
            {/* Total Earnings Card */}
            <div
              className={`p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-600/10 backdrop-blur-sm border border-violet-400/30 transform transition-all duration-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: "400ms",
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h5 className="text-white font-semibold">Total Earnings</h5>
                  <p className="text-violet-200 text-sm">All time revenue</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatCurrency(earnings.total)}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-green-400">
                  This Month: {formatCurrency(earnings.thisMonth)}
                </div>
                <div className="text-gray-300">
                  Last Month: {formatCurrency(earnings.lastMonth)}
                </div>
              </div>
            </div>

            {/* Earnings Details */}
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  label: "Average per Project",
                  value: formatCurrency(earnings.avgPerProject),
                  description: "Revenue per completed project",
                },
                {
                  label: "Monthly Growth",
                  value:
                    earnings.thisMonth && earnings.lastMonth
                      ? `${Math.round(
                          ((earnings.thisMonth - earnings.lastMonth) /
                            earnings.lastMonth) *
                            100
                        )}%`
                      : "0%",
                  description: "Month-over-month change",
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: `${(index + 6) * 150}ms`,
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 font-medium">
                      {item.label}
                    </span>
                    <span className="text-white font-bold text-lg">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">
          Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Improve Response Time",
              description:
                "Aim for under 30 minutes to increase learner satisfaction",
              show: (data?.responseTime || 0) > 30,
            },
            {
              title: "Maintain High Ratings",
              description:
                "Keep providing quality mentorship to maintain 4.5+ rating",
              show: (data?.averageRating || 0) < 4.5,
            },
            {
              title: "Increase Project Completion",
              description: "Focus on helping learners complete their projects",
              show: (data?.completionRate || 0) < 80,
            },
            {
              title: "Great Performance!",
              description: "You're exceeding expectations across all metrics",
              show:
                (data?.successRate || 0) >= 90 &&
                (data?.averageRating || 0) >= 4.5,
            },
          ]
            .filter((rec) => rec.show)
            .slice(0, 2)
            .map((recommendation, index) => (
              <div
                key={recommendation.title}
                className={`p-4 rounded-xl bg-white/5 border border-white/10 transform transition-all duration-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${(index + 8) * 150}ms`,
                }}
              >
                <h5 className="text-white font-semibold mb-2">
                  {recommendation.title}
                </h5>
                <p className="text-gray-300 text-sm">
                  {recommendation.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
