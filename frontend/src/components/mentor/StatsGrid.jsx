import React from 'react';
import {
  DollarSign,
  Briefcase,
  CheckCircle,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, color }) => {
  // Extract the trend direction from the change text
  const isPositive = change.includes('+');
  const isNegative = change.includes('-');
 
  return (
    <div className="group relative">

      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
       
        {/* Floating orb effect */}
        <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r ${color} opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500`}></div>
       
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
              <Icon size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl lg:text-3xl font-bold text-white group-hover:text-cyan-100 transition-colors duration-300">
                {value}
              </p>
              <p className="text-sm text-cyan-200 group-hover:text-cyan-100 transition-colors duration-300">
                {label}
              </p>
            </div>
          </div>
         
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isPositive && (
                <TrendingUp size={16} className="text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
              )}
              {isNegative && (
                <TrendingDown size={16} className="text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              )}
              <span className={`text-sm font-medium transition-colors duration-300 ${
                isPositive
                  ? 'text-emerald-400 group-hover:text-emerald-300'
                  : isNegative
                  ? 'text-red-400 group-hover:text-red-300'
                  : 'text-cyan-300 group-hover:text-cyan-200'
              }`}>
                {change}
              </span>
            </div>
           
            {/* Progress indicator */}
            <div className="flex space-x-1">
              <div className={`w-1 h-4 rounded-full bg-gradient-to-t ${color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
              <div className={`w-1 h-6 rounded-full bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className={`w-1 h-3 rounded-full bg-gradient-to-t ${color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
            </div>
          </div>
         
          {/* Subtle bottom glow */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-b-2xl`}></div>
        </div>
      </div>
    </div>
  );
};

const StatsGrid = ({ mentorData }) => {
  const mentorStats = [
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: `$${mentorData.mentorTotalEarnings || 0}`,
      change: `${mentorData.mentorTotalEarningsChange >= 0 ? '+' : ''}${mentorData.mentorTotalEarningsChange || 0}% this month`,
      color: 'from-cyan-500 to-teal-600'
    },
    {
      icon: Briefcase,
      label: 'Active Students',
      value: mentorData.mentorActiveStudents?.toString() || '0',
      change: `${mentorData.mentorActiveStudentsChange >= 0 ? '+' : ''}${mentorData.mentorActiveStudentsChange || 0} this week`,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: CheckCircle,
      label: 'Sessions Completed',
      value: mentorData.mentorSessionsCompleted?.toString() || '0',
      change: `${mentorData.mentorSessionsCompletedChange >= 0 ? '+' : ''}${mentorData.mentorSessionsCompletedChange || 0} this month`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      label: 'Satisfaction Rate',
      value: `${mentorData.mentorSatisfactionRate || 0}%`,
      change: `${mentorData.mentorSatisfactionRateChange >= 0 ? '+' : ''}${mentorData.mentorSatisfactionRateChange || 0}% this week`,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {mentorStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;