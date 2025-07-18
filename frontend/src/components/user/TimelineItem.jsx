import React from 'react';

const TimelineItem = ({ icon: Icon, title, subtitle, color }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default TimelineItem;