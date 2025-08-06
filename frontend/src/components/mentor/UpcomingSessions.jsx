// Enhanced UpcomingSessions Component
import React from 'react';
import { Clock, Activity, Video, Phone, MessageCircle, Calendar, MapPin, Star, ChevronRight } from 'lucide-react';

const SessionCard = ({ studentName, studentImage, sessionTitle, date, time, duration, status, statusColor }) => {
  // Enhanced status styling
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'completed':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:scale-[1.02] hover:bg-white/15">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          {/* Left side - Student info */}
          <div className="flex items-start space-x-3 flex-1">
            {/* Student image with glow */}
            <div className="relative flex-shrink-0">
              <img
                src={studentImage}
                alt={studentName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>
              {/* Subtle glow around image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Session details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white text-sm group-hover:text-cyan-200 transition-colors duration-200 truncate">
                    {studentName}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="text-xs text-yellow-300">4.8</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-cyan-200 mb-2 group-hover:text-cyan-100 transition-colors duration-200 line-clamp-2">
                {sessionTitle}
              </p>
              
              {/* Session metadata */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <Calendar size={12} />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <Clock size={12} />
                  <span>{time}</span>
                </div>
                <div className="flex items-center space-x-1 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200">
                  <MapPin size={12} />
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Status */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)} backdrop-blur-sm`}>
            {status}
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-300">Ready to start</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn">
              <Video size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-200 group/btn">
              <Phone size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
            </button>
            <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn">
              <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
            </button>
            <button className="flex items-center space-x-1 text-xs text-cyan-300 hover:text-cyan-200 transition-colors duration-200 group/arrow">
              <span>Details</span>
              <ChevronRight size={12} className="group-hover/arrow:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
};

const UpcomingSessions = ({ upcomingSessions }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Clock className="mr-2 text-cyan-400" size={20} />
            Upcoming Sessions
          </h2>
          <div className="flex items-center space-x-2">
            <Activity className="text-cyan-400 animate-pulse" size={20} />
            <span className="text-sm text-cyan-300 font-medium">Live Updates</span>
          </div>
        </div>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;