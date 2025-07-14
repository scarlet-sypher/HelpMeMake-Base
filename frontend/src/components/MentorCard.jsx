import React from 'react';
import { Star, MessageSquare, ArrowRight } from 'lucide-react';

const MentorCard = ({ mentor }) => {
  return (
    <div className="flex-none w-72 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl mx-3 overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-emerald-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-2xl"></div>
      
      {/* Profile Image Section */}
      <div className="relative p-5 pb-3">
        <div className="relative w-16 h-16 mx-auto mb-3">
          {mentor.image ? (
            <img 
              src={mentor.image} 
              alt={mentor.name}
              className="w-full h-full rounded-full object-cover border-2 border-white/30 group-hover:border-emerald-400/70 transition-all duration-500 group-hover:shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 border-2 border-white/30 group-hover:border-emerald-400/70 transition-all duration-500 group-hover:shadow-lg flex items-center justify-center text-white font-bold text-lg">
              {mentor.name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < mentor.rating ? 'text-yellow-400 fill-current' : 'text-white/30'} transition-all duration-300`} 
              />
            ))}
          </div>
          <span className="text-white/80 text-sm ml-2">({mentor.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 relative z-10">
        <h3 className="text-lg font-bold text-white mb-1 text-center group-hover:text-emerald-300 transition-colors duration-300">
          {mentor.name}
        </h3>
        
        <p className="text-emerald-300 text-sm font-medium mb-3 text-center">
          {mentor.specialty}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
          {mentor.techStack.map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/90 border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Rate */}
        <div className="text-center mb-3">
          <span className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">${mentor.rate}</span>
          <span className="text-white/70 text-sm">/hour</span>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 rounded-lg p-2.5 mb-4 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
          <p className="text-white/80 text-xs italic text-center leading-relaxed">
            "{mentor.testimonial}"
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full relative bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2.5 px-4 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center overflow-hidden group-hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center text-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Session
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default MentorCard;