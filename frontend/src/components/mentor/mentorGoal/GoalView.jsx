import React from "react";
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react";

const GoalView = ({ goal }) => {
  if (!goal) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-gray-600 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <Target className="text-gray-400" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                No Goal Set Yet
              </h3>
              <p className="text-gray-400">
                Set your monthly earning goal to start tracking your progress
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = goal.progressPercentage || 0;
  const remaining = goal.remaining || 0;
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Monthly Goal</h3>
              <p className="text-cyan-200">{currentMonth}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ₹{goal.monthlyGoal?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-cyan-200">Target Amount</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-medium text-cyan-300">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  ₹{goal.currentEarnings?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">Current Earnings</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <DollarSign className="text-orange-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  ₹{remaining.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Remaining</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-xl p-4 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="text-blue-400" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {new Date().getDate()}/
                  {new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0
                  ).getDate()}
                </div>
                <div className="text-sm text-gray-400">Days Passed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Message */}
        {progressPercentage >= 100 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-green-400">Goal Achieved! 🎉</h4>
                <p className="text-green-200 text-sm">
                  Congratulations on reaching your monthly goal!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Message */}
        {progressPercentage < 100 && progressPercentage > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-400/20 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={16} />
              </div>
              <div>
                <h4 className="font-bold text-cyan-400">Keep Going! 💪</h4>
                <p className="text-cyan-200 text-sm">
                  You're {progressPercentage}% there! Only ₹
                  {remaining.toLocaleString()} left to reach your goal.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalView;
