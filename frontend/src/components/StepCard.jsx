import React, { useState, useEffect } from 'react';

const StepCard = ({ step, title, description, icon: Icon, isActive, delay }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`relative group transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        
        {/* Step number */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl">
          {step}
        </div>

        {/* Icon container */}
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-emerald-400" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-200 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-white/80 leading-relaxed">
          {description}
        </p>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-500/30 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default StepCard;