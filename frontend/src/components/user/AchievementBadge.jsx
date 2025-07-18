import React from 'react';
import { Check, Lock, Star, Sparkles } from 'lucide-react';

const AchievementBadge = ({ title, description, achieved, icon, rarity = 'common' }) => {
  // Define rarity-based styling
  const rarityStyles = {
    common: {
      border: 'border-blue-400/30',
      bg: 'bg-blue-600/20',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-200',
      desc: 'text-blue-300'
    },
    rare: {
      border: 'border-purple-400/30',
      bg: 'bg-purple-600/20',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-200',
      desc: 'text-purple-300'
    },
    epic: {
      border: 'border-orange-400/30',
      bg: 'bg-orange-600/20',
      glow: 'shadow-orange-500/20',
      text: 'text-orange-200',
      desc: 'text-orange-300'
    },
    legendary: {
      border: 'border-yellow-400/30',
      bg: 'bg-yellow-600/20',
      glow: 'shadow-yellow-500/20',
      text: 'text-yellow-200',
      desc: 'text-yellow-300'
    }
  };

  const currentRarity = rarityStyles[rarity] || rarityStyles.common;

  return (
    <div className={`
      relative p-4 rounded-2xl border-2 transition-all overflow-hidden duration-500 group cursor-pointer
      ${achieved 
        ? `${currentRarity.bg} ${currentRarity.border} hover:shadow-xl ${currentRarity.glow} hover:scale-105 backdrop-blur-sm` 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-102 backdrop-blur-sm'
      }
      ${achieved && rarity === 'legendary' ? 'animate-pulse' : ''}
    `}>
      {/* Animated background for legendary achievements */}
      {achieved && rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 animate-pulse"></div>
      )}
      
      {/* Sparkle effects for achieved badges */}
      {achieved && (
        <>
          <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce">
            <Sparkles size={12} />
          </div>
          <div className="absolute -top-1 -left-1 text-blue-400 animate-pulse">
            <Star size={8} />
          </div>
        </>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${
            achieved ? 'filter drop-shadow-lg' : 'grayscale opacity-60'
          }`}>
            {icon}
          </div>
          <div className={`p-2 rounded-full transition-all duration-300 ${
            achieved 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50' 
              : 'bg-gray-600/50 group-hover:bg-gray-500/50'
          }`}>
            {achieved ? (
              <Check size={14} className="text-white" />
            ) : (
              <Lock size={14} className="text-gray-400" />
            )}
          </div>
        </div>

        <h3 className={`font-bold text-sm mb-2 transition-colors duration-300 ${
          achieved ? currentRarity.text : 'text-gray-400 group-hover:text-gray-300'
        }`}>
          {title}
        </h3>
        
        <p className={`text-xs leading-relaxed transition-colors duration-300 ${
          achieved ? currentRarity.desc : 'text-gray-500 group-hover:text-gray-400'
        }`}>
          {description}
        </p>

        {/* Progress bar for partially achieved items */}
        {!achieved && (
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-700"
              style={{ width: '60%' }}
            ></div>
          </div>
        )}

        {/* Rarity indicator */}
        {achieved && rarity !== 'common' && (
          <div className="mt-2 flex items-center">
            <div className="flex space-x-0.5">
              {[...Array(rarity === 'rare' ? 2 : rarity === 'epic' ? 3 : 4)].map((_, i) => (
                <Star 
                  key={i} 
                  size={8} 
                  className={`${currentRarity.text} fill-current`}
                />
              ))}
            </div>
            <span className={`text-xs ml-2 capitalize ${currentRarity.text} font-medium`}>
              {rarity}
            </span>
          </div>
        )}
      </div>

      {/* Shine effect overlay */}
      {achieved && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </div>
    )}
    </div>
  );
};

export default AchievementBadge;