import React from 'react';
import { MessageCircle, Clock, Calendar, Video, Phone, MapPin, Star, ChevronRight } from 'lucide-react';

const SessionCard = ({
  mentorName,
  mentorImage,
  sessionTitle,
  date,
  time,
  duration,
  status,
  statusColor
}) => {
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
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] hover:bg-white/15">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          {/* Left side - Mentor info */}
          <div className="flex items-start space-x-4 flex-1">
            {/* Mentor image with glow */}
            <div className="relative">
              <img
                src={mentorImage}
                alt={mentorName}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300"
              />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>
              {/* Subtle glow around image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Session details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-white text-base group-hover:text-blue-200 transition-colors duration-200">
                  {mentorName}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-xs text-yellow-300">4.9</span>
                </div>
              </div>
              
              <p className="text-sm text-blue-200 mb-3 group-hover:text-blue-100 transition-colors duration-200">
                {sessionTitle}
              </p>
              
              {/* Session metadata */}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                  <Calendar size={12} />
                  <span>{date}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                  <Clock size={12} />
                  <span>{time}</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                  <MapPin size={12} />
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Status and actions */}
          <div className="flex flex-col items-end space-y-3">
            {/* Status badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)} backdrop-blur-sm`}>
              {status}
            </span>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn">
                <Video size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 group/btn">
                <Phone size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn">
                <MessageCircle size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Session actions bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-300">Ready to join</span>
          </div>
          
          <button className="flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 group/arrow">
            <span>View Details</span>
            <ChevronRight size={12} className="group-hover/arrow:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
};

export default SessionCard;