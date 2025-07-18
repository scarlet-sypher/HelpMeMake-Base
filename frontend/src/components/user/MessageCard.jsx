import React from 'react';

const MessageCard = ({ senderName, senderImage, message, timestamp }) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
      <img 
        src={senderImage} 
        alt={senderName} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800 truncate">{senderName}</h4>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
      </div>
    </div>
  );
};

export default MessageCard;