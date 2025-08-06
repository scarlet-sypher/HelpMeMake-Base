import React from 'react';
import { DollarSign, TrendingUp, Calendar, Award, Target } from 'lucide-react';

const EarningsOverview = () => {
  const monthlyGoal = 2000;
  const currentEarnings = 1250;
  const progressPercentage = Math.round((currentEarnings / monthlyGoal) * 100);

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
            <span className="text-sm text-cyan-300 font-medium">+12% vs last month</span>
          </div>
        </div>

        {/* Main Progress Section */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl p-6 border border-white/10 mb-6">
          {/* Goal Progress Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="text-cyan-300" size={18} />
              <span className="text-white font-medium">Monthly Goal Progress</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${currentEarnings.toLocaleString()}</div>
              <div className="text-sm text-cyan-300">of ${monthlyGoal.toLocaleString()}</div>
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
              <span className="text-white font-bold">{progressPercentage}%</span>
              <span className="text-cyan-300">100%</span>
            </div>
          </div>

          {/* Milestone Indicators */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                progressPercentage >= 25 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-400/50' 
                  : 'bg-gray-400/50'
              }`}></div>
              <span className="text-xs text-white/70">25%</span>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                progressPercentage >= 50 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-400/50' 
                  : 'bg-gray-400/50'
              }`}></div>
              <span className="text-xs text-white/70">50%</span>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                progressPercentage >= 75 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-400/50' 
                  : 'bg-gray-400/50'
              }`}></div>
              <span className="text-xs text-white/70">75%</span>
            </div>
            <div className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 transition-all duration-500 ${
                progressPercentage >= 100 
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-500 shadow-lg shadow-cyan-400/50'
                  : 'bg-gray-400/50'
              }`}></div>
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
            <div className="text-2xl font-bold text-white mb-1">${currentEarnings.toLocaleString()}</div>
            <div className="text-sm text-emerald-300">This Month</div>
            <div className="mt-2 text-xs text-white/60">+15% from last month</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg">
                <Calendar size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-sm text-teal-300">Sessions Completed</div>
            <div className="mt-2 text-xs text-white/60">8 this week</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <TrendingUp size={16} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">$52</div>
            <div className="text-sm text-yellow-300">Avg Per Session</div>
            <div className="mt-2 text-xs text-white/60">+$3 vs last month</div>
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
                <p className="text-cyan-300 text-sm">You're ${monthlyGoal - currentEarnings} away from your monthly goal!</p>
              </div>
            </div>
            <div className="text-cyan-300 font-bold text-lg">
              {Math.round(((monthlyGoal - currentEarnings) / 52))} sessions to go
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 flex justify-between text-xs text-blue-200">
          <span>Goal: ${monthlyGoal.toLocaleString()}</span>
          <span>Remaining: ${(monthlyGoal - currentEarnings).toLocaleString()}</span>
          <span>Days left: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsOverview;