import React from 'react';

const ConnectingLine = ({ isVertical, index, isVisible }) => {
  return (
    <div 
      className={`relative ${isVertical ? 'h-16 w-full flex justify-center' : 'w-16 h-full flex items-center'}`}
    >
      <div 
        className={`bg-gradient-to-r from-emerald-500/50 to-blue-500/50 transition-all duration-1000 ${
          isVertical ? 'w-1' : 'h-1'
        } ${isVisible ? (isVertical ? 'h-16' : 'w-16') : (isVertical ? 'h-0' : 'w-0')}`}
        style={{ transitionDelay: `${index * 300}ms` }}
      />
      
      {/* Animated dots */}
      <div className={`absolute ${isVertical ? 'top-0' : 'left-0'} w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse`} />
      <div className={`absolute ${isVertical ? 'bottom-0' : 'right-0'} w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse`} 
           style={{ animationDelay: '500ms' }} />
    </div>
  );
};

export default ConnectingLine;