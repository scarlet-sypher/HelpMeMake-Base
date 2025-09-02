import React, { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, TrendingUp, Calendar, Award, Target } from "lucide-react";

const EarningsOverview = () => {
  const [earningsData, setEarningsData] = useState({
    monthlyGoal: 0,
    currentEarnings: 0,
    sessionsCompleted: 0,
    avgPerSession: 0,
    earningsChange: 0,
    sessionsChange: 0,
    avgPerSessionChange: 0,
    daysLeft: 0,
    progressPercentage: 0,
    remaining: 0,
    sessionsToGo: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${apiUrl}/api/goals/mentor/goal-reviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success && response.data.data.goal) {
          const goalData = response.data.data.goal;

          setEarningsData({
            monthlyGoal: goalData.monthlyGoal || 0,
            currentEarnings: goalData.currentEarnings || 0,
            sessionsCompleted: goalData.sessionsCompleted || 0,
            avgPerSession: goalData.avgPerSession || 0,
            earningsChange: goalData.earningsChange || 0,
            sessionsChange: goalData.sessionsChange || 0,
            avgPerSessionChange: goalData.avgPerSessionChange || 0,
            daysLeft: goalData.daysLeft || 0,
            progressPercentage: goalData.progressPercentage || 0,
            remaining: goalData.remaining || 0,
            sessionsToGo: goalData.sessionsToGo,
          });
        }
      } catch (err) {
        console.error("Error fetching earnings data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  const displayValue = (value, prefix = "", suffix = "") => {
    if (value === 0 || value === null || value === undefined) {
      return "Not Set";
    }
    return `${prefix}${value}${suffix}`;
  };

  const formatCurrency = (amount) => {
    if (amount === 0 || amount === null || amount === undefined) {
      return "Not Set";
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatPercentageChange = (change) => {
    if (change === 0 || change === null || change === undefined) {
      return "No change";
    }
    const sign = change > 0 ? "+" : "";
    return `${sign}${change}% vs last month`;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 text-center">
            <p>Error loading earnings data</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    monthlyGoal,
    currentEarnings,
    sessionsCompleted,
    avgPerSession,
    earningsChange,
    sessionsChange,
    avgPerSessionChange,
    daysLeft,
    progressPercentage,
    remaining,
    sessionsToGo,
  } = earningsData;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <DollarSign className="mr-2 text-cyan-400" size={20} />
            Monthly Earnings Overview
          </h2>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-cyan-400" size={16} />
            <span className="text-sm text-cyan-300 font-medium">
              {formatPercentageChange(earningsChange)}
            </span>
          </div>
        </div>

        {/* Main Progress Section */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/10 mb-6">
          {/* Goal Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="text-cyan-300" size={18} />
              <span className="text-white font-medium">
                Monthly Goal Progress
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(currentEarnings)}
              </div>
              <div className="text-sm text-cyan-300">
                of {formatCurrency(monthlyGoal)}
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
              {/* Progress indicator */}
              {progressPercentage < 100 && (
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-cyan-400 transition-all duration-1000"
                  style={{ left: `${Math.min(progressPercentage, 95)}%` }}
                ></div>
              )}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-cyan-300">0%</span>
              <span className="text-white font-bold">
                {progressPercentage}%
              </span>
              <span className="text-cyan-300">100%</span>
            </div>
          </div>

          {/* Milestone Indicators */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                  progressPercentage >= 25
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/50"
                    : "bg-gray-400/50"
                }`}
              ></div>
              <span className="text-xs text-white/70">25%</span>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                  progressPercentage >= 50
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50"
                    : "bg-gray-400/50"
                }`}
              ></div>
              <span className="text-xs text-white/70">50%</span>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                  progressPercentage >= 75
                    ? "bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-400/50"
                    : "bg-gray-400/50"
                }`}
              ></div>
              <span className="text-xs text-white/70">75%</span>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                  progressPercentage >= 100
                    ? "bg-gradient-to-r from-cyan-400 to-teal-500 shadow-lg shadow-cyan-400/50"
                    : "bg-gray-400/50"
                }`}
              ></div>
              <span className="text-xs text-white/70">Goal</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg">
                <DollarSign size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(currentEarnings)}
            </div>
            <div className="text-sm text-emerald-300">This Month</div>
            <div className="mt-2 text-xs text-white/60">
              {formatPercentageChange(earningsChange)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg">
                <Calendar size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {displayValue(sessionsCompleted)}
            </div>
            <div className="text-sm text-teal-300">Sessions Completed</div>
            <div className="mt-2 text-xs text-white/60">
              {formatPercentageChange(sessionsChange)}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(avgPerSession)}
            </div>
            <div className="text-sm text-yellow-300">Avg Per Session</div>
            <div className="mt-2 text-xs text-white/60">
              {formatPercentageChange(avgPerSessionChange)}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                <Award size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Achievement Unlock</h4>
                <p className="text-cyan-300 text-sm">
                  {remaining > 0
                    ? `You're ${formatCurrency(
                        remaining
                      )} away from your monthly goal!`
                    : monthlyGoal > 0
                    ? "Congratulations! You've reached your monthly goal!"
                    : "Set a monthly goal to track your progress!"}
                </p>
              </div>
            </div>
            <div className="text-cyan-300 font-bold text-lg">
              {sessionsToGo && sessionsToGo > 0
                ? `${sessionsToGo} sessions to go`
                : remaining > 0 && avgPerSession > 0
                ? `${Math.ceil(remaining / avgPerSession)} sessions to go`
                : progressPercentage >= 100
                ? "Goal Achieved!"
                : "Keep going!"}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 flex justify-between text-xs text-blue-200">
          <span>Goal: {formatCurrency(monthlyGoal)}</span>
          <span>Remaining: {formatCurrency(remaining)}</span>
          <span>Days left: {displayValue(daysLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;
