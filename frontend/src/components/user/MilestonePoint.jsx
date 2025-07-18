import React from 'react';
import { Check, Clock, User, Users, Star, Zap, Crown, Anchor, Target, Award, BookOpen } from 'lucide-react';

const MilestonePoint = ({ milestones }) => {
  const SingleMilestone = ({ title, userVerified, mentorVerified, index, isLast }) => {
    const isCompleted = userVerified && mentorVerified;
    const isPartiallyCompleted = userVerified || mentorVerified;
    
    const getStatusColor = () => {
      if (isCompleted) return 'from-emerald-400 to-teal-500';
      if (isPartiallyCompleted) return 'from-yellow-400 to-orange-500';
      return 'from-slate-400 to-gray-500';
    };

    const getGlowColor = () => {
      if (isCompleted) return 'shadow-emerald-400/50';
      if (isPartiallyCompleted) return 'shadow-yellow-400/50';
      return 'shadow-slate-400/30';
    };

    const getStatusIcon = () => {
      if (isCompleted) return <Check size={16} className="text-white drop-shadow-lg" />;
      if (isPartiallyCompleted) return <Clock size={16} className="text-white drop-shadow-lg" />;
      return <div className="w-3 h-3 bg-white/80 rounded-full" />;
    };

    const getPulseAnimation = () => {
      if (isCompleted) return 'animate-pulse';
      if (isPartiallyCompleted) return 'animate-pulse';
      return '';
    };

    const getSpecialIcon = () => {
      const icons = [Crown, Anchor, Star, Zap, Award];
      const IconComponent = icons[index % icons.length];
      return <IconComponent size={12} className="text-white/70" />;
    };

    return (
      <div className="flex flex-col items-center relative group">
        {/* Connection Line - Hidden on mobile, visible on larger screens */}
        {!isLast && (
          <div className={`absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r ${getStatusColor()} opacity-60 transition-all duration-500 z-0 hidden sm:block`}></div>
        )}
        
        {/* Animated Background Glow */}
        <div className={`absolute w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${getStatusColor()} opacity-20 blur-xl ${getPulseAnimation()} transition-all duration-500`}></div>
        
        {/* Milestone Point */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center relative z-10 shadow-xl ${getGlowColor()} transition-all duration-500 hover:scale-125 hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm group-hover:border-white/40`}>
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
          
          {/* Status Icon */}
          <div className="relative z-10">
            {getStatusIcon()}
          </div>
          
          {/* Floating particles effect for completed milestones */}
          {isCompleted && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce shadow-lg">
              <Star size={8} className="text-white p-0.5" />
            </div>
          )}
        </div>
        
        {/* Milestone Label */}
        <div className="mt-3 sm:mt-4 text-center relative z-10 w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-2 py-2 sm:px-3 sm:py-3 border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300">
            <p className="text-xs sm:text-sm font-semibold text-white leading-tight mb-1 break-words">
              {title}
            </p>
            
            {/* Special Icon */}
            <div className="flex justify-center mb-2">
              {getSpecialIcon()}
            </div>
            
            {/* Enhanced Verification Status */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  userVerified 
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-400/50' 
                    : 'bg-gray-500/50 border border-gray-400/30'
                }`} 
                title="User Verified" />
                <User size={8} className={`${userVerified ? 'text-blue-300' : 'text-gray-400'} transition-colors duration-300 hidden sm:block`} />
              </div>
              
              <div className="w-px h-3 bg-white/20"></div>
              
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  mentorVerified 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50' 
                    : 'bg-gray-500/50 border border-gray-400/30'
                }`} 
                title="Mentor Verified" />
                <Users size={8} className={`${mentorVerified ? 'text-purple-300' : 'text-gray-400'} transition-colors duration-300 hidden sm:block`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Tooltip - Only visible on larger screens */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-2xl border border-white/20 backdrop-blur-sm hidden lg:block">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${userVerified ? 'bg-blue-400' : 'bg-gray-400'}`}></div>
              <User size={12} />
              <span className={`font-medium ${userVerified ? 'text-blue-300' : 'text-gray-400'}`}>
                User: {userVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${mentorVerified ? 'bg-purple-400' : 'bg-gray-400'}`}></div>
              <Users size={12} />
              <span className={`font-medium ${mentorVerified ? 'text-purple-300' : 'text-gray-400'}`}>
                Mentor: {mentorVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
        </div>
        
        {/* Progress Indicator Ring */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-all duration-500">
          <div className={`absolute inset-0 rounded-full border-2 border-transparent ${
            isCompleted 
              ? 'border-t-emerald-400 border-r-emerald-400' 
              : isPartiallyCompleted 
                ? 'border-t-yellow-400' 
                : ''
          } transition-all duration-500`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
      {/* Connection Line - Hidden on mobile */}
      {/* <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 -translate-y-1/2 hidden sm:block"></div> */}
      
      {/* Mobile Connection Lines - Vertical for mobile */}
      <div className="sm:hidden">
        {/* <div className="absolute left-1/2 top-12 bottom-12 w-0.5 bg-gradient-to-b from-blue-400/30 via-purple-400/30 to-pink-400/30 -translate-x-1/2"></div> */}
      </div>
      
      {/* Milestones */}
      <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 space-y-8 sm:space-y-0">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex-1 flex justify-center">
            <SingleMilestone 
              {...milestone} 
              index={index} 
              isLast={index === milestones.length - 1}
            />
          </div>
        ))}
      </div>
      
      {/* Progress Summary Bar */}
      <div className="mt-6 sm:mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-white">Overall Progress</span>
          <span className="text-xs sm:text-sm font-bold text-purple-300">
            {Math.round((milestones.filter(m => m.userVerified && m.mentorVerified).length / milestones.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ 
              width: `${(milestones.filter(m => m.userVerified && m.mentorVerified).length / milestones.length) * 100}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-blue-200">
          <span>{milestones.filter(m => m.userVerified && m.mentorVerified).length} Completed</span>
          <span>{milestones.filter(m => (m.userVerified || m.mentorVerified) && !(m.userVerified && m.mentorVerified)).length} In Progress</span>
          <span>{milestones.filter(m => !m.userVerified && !m.mentorVerified).length} Pending</span>
        </div>
      </div>
    </div>
  );
};

export default MilestonePoint;