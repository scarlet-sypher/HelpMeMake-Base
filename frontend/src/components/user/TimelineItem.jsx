import React from 'react';

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
          <p className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </p>
          <p className="text-xs text-blue-300 mt-1 group-hover:text-blue-200 transition-colors duration-300">
            {subtitle}
          </p>
          
          {/* Animated accent line */}
          <div className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;