import React from 'react';
import { MessageCircle, Reply, MoreHorizontal, Heart, Pin } from 'lucide-react';

const MessageCard = ({ senderName, senderImage, message, timestamp, isOnline = false, isUnread = false, messageType = 'text' }) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer ${
      isUnread 
        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-cyan-400/30 shadow-lg' 
        : 'bg-white/10 border-white/10 hover:bg-white/15'
    }`}>
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
      )}
      
      <div className="relative z-10 p-4">
        <div className="flex items-start space-x-3">
          {/* Profile Image with Online Status */}
          <div className="relative flex-shrink-0">
            <img
              src={senderImage}
              alt={senderName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg ring-2 ring-white/10"
            />
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/20 shadow-lg">
                <div className="absolute inset-0 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-white truncate text-sm group-hover:text-cyan-200 transition-colors">
                {senderName}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-cyan-300/80 font-medium">{timestamp}</span>
                {isUnread && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                )}
              </div>
            </div>
            
            {/* Message Text */}
            <p className="text-sm text-cyan-100/90 leading-relaxed mb-3 line-clamp-2 group-hover:text-white/90 transition-colors">
              {message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="flex items-center space-x-1 text-cyan-300/70 hover:text-cyan-200 transition-colors">
                  <Reply size={14} />
                  <span className="text-xs">Reply</span>
                </button>
                <button className="flex items-center space-x-1 text-cyan-300/70 hover:text-pink-300 transition-colors">
                  <Heart size={14} />
                  <span className="text-xs">Like</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-1 rounded-full text-cyan-300/70 hover:text-white hover:bg-white/10 transition-all">
                  <Pin size={14} />
                </button>
                <button className="p-1 rounded-full text-cyan-300/70 hover:text-white hover:bg-white/10 transition-all">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
    </div>
  );
};

const RecentMessages = ({ recentMessages }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageCircle className="mr-2 text-teal-400" size={20} />
            Recent Messages
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-teal-300 font-medium">Live Chat</span>
          </div>
        </div>
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <MessageCard key={message.id} {...message} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentMessages;