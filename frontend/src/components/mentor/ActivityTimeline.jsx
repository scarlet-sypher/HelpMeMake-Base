import React from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Users,
  DollarSign,
  BookOpen
} from 'lucide-react';

const TimelineItem = ({ icon: Icon, title, subtitle, color, isLast = false }) => {
  return (
    <div className="relative flex items-start space-x-4 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-white/20 to-white/5"></div>
      )}
     
      {/* Icon Container */}
      <div className="relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon size={18} className={`${color} group-hover:scale-110 transition-transform duration-300`} />
        </div>
        {/* Glowing effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${color.replace('text-', 'from-').replace('-400', '-400/20')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
      </div>
     
      {/* Content */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
          <p className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors duration-300">
            {title}
          </p>
          <p className="text-xs text-cyan-300 mt-1 group-hover:text-cyan-200 transition-colors duration-300">
            {subtitle}
          </p>
         
          {/* Animated accent line */}
          <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = () => {
  const timelineItems = [
    { id: 1, icon: Award, title: 'New 5-star review from Luffy', subtitle: '1 hour ago', color: 'text-yellow-400' },
    { id: 2, icon: Calendar, title: 'Session completed with Zoro', subtitle: '3 hours ago', color: 'text-cyan-400' },
    { id: 3, icon: Users, title: 'New student request from Robin', subtitle: '1 day ago', color: 'text-teal-400' },
    { id: 4, icon: DollarSign, title: 'Earnings milestone reached: $1000', subtitle: '2 days ago', color: 'text-emerald-400' },
    { id: 5, icon: BookOpen, title: 'Course material updated', subtitle: '3 days ago', color: 'text-purple-400' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="mr-2 text-teal-400" size={20} />
            Recent Activity
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-teal-300 font-medium">Live Updates</span>
          </div>
        </div>
        <div className="space-y-2">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={item.id}
              {...item}
              isLast={index === timelineItems.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;