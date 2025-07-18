import React from 'react';
import { Check, Clock, User, Users } from 'lucide-react';

const MilestonePoint = ({ title, userVerified, mentorVerified, index }) => {
  const isCompleted = userVerified && mentorVerified;
  const isPartiallyCompleted = userVerified || mentorVerified;
  
  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isPartiallyCompleted) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getStatusIcon = () => {
    if (isCompleted) return <Check size={12} className="text-white" />;
    if (isPartiallyCompleted) return <Clock size={12} className="text-white" />;
    return <div className="w-3 h-3 bg-white rounded-full" />;
  };

  return (
    <div className="flex flex-col items-center relative group">
      {/* Milestone Point */}
      <div className={`w-8 h-8 rounded-full ${getStatusColor()} flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 hover:scale-110`}>
        {getStatusIcon()}
      </div>
      
      {/* Milestone Label */}
      <div className="mt-2 text-center">
        <p className="text-xs font-medium text-gray-700 max-w-20 leading-tight">
          {title}
        </p>
        
        {/* Verification Status */}
        <div className="flex items-center justify-center space-x-1 mt-1">
          <div className={`w-2 h-2 rounded-full ${userVerified ? 'bg-blue-500' : 'bg-gray-300'}`} title="User Verified" />
          <div className={`w-2 h-2 rounded-full ${mentorVerified ? 'bg-purple-500' : 'bg-gray-300'}`} title="Mentor Verified" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
        <div className="flex items-center space-x-2">
          <User size={10} />
          <span className={userVerified ? 'text-green-400' : 'text-gray-400'}>
            {userVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users size={10} />
          <span className={mentorVerified ? 'text-purple-400' : 'text-gray-400'}>
            {mentorVerified ? 'Verified' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MilestonePoint;