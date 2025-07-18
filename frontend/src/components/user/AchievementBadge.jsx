import React from 'react';
import { Check, Lock } from 'lucide-react';

const AchievementBadge = ({ title, description, achieved, icon }) => {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
      achieved 
        ? 'bg-green-50 border-green-200 hover:bg-green-100' 
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`p-1 rounded-full ${
          achieved ? 'bg-green-500' : 'bg-gray-400'
        }`}>
          {achieved ? (
            <Check size={12} className="text-white" />
          ) : (
            <Lock size={12} className="text-white" />
          )}
        </div>
      </div>
      <h3 className={`font-semibold text-sm ${
        achieved ? 'text-green-800' : 'text-gray-600'
      }`}>
        {title}
      </h3>
      <p className={`text-xs mt-1 ${
        achieved ? 'text-green-600' : 'text-gray-500'
      }`}>
        {description}
      </p>
    </div>
  );
};

export default AchievementBadge;