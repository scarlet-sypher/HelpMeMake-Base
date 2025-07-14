import React, { useState, useEffect } from 'react';
import { Sparkles, UserPlus, Shield, Clock, Users, Star, ArrowDown, Zap, Rocket, Heart } from 'lucide-react';

const FinalCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setCtaVisible(true);
    }, 600);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const trustFeatures = [
    {
      icon: Shield,
      title: "SSL Secure",
      description: "Bank-level encryption",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: Clock,
      title: "Escrow Safe",
      description: "Protected payments",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Trusted Mentors",
      description: "Vetted experts",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const floatingElements = [
    { icon: Zap, delay: 0, position: 'top-1/4 left-1/4' },
    { icon: Rocket, delay: 1000, position: 'top-1/3 right-1/3' },
    { icon: Heart, delay: 2000, position: 'bottom-1/4 left-1/3' },
    { icon: Star, delay: 1500, position: 'bottom-1/3 right-1/4' },
    { icon: Sparkles, delay: 500, position: 'top-1/2 left-1/2' }
  ];

  return (
    <section className="relative min-h-screen py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background with Mouse Tracking */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        
        {/* Enhanced floating background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1500"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-750"></div>

        {/* Animated geometric shapes */}
        <div className="absolute top-20 right-10 w-16 h-16 border-2 border-emerald-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 left-16 w-12 h-12 border-2 border-blue-400/20 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-gradient-to-r from-purple-400/30 to-pink-400/30 transform rotate-45 animate-pulse animation-delay-2000"></div>

        {/* Enhanced particle system */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite, twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Floating animated icons */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} w-8 h-8 opacity-10 animate-float-icon`}
            style={{ animationDelay: `${element.delay}ms` }}
          >
            <element.icon className="w-full h-full text-white" />
          </div>
        ))}

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-900/20 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Section */}
        <div className={`text-center mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            {/* Animated background text */}
            <div className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white/5 select-none animate-pulse-slow">
              BUILD
            </div>
            
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent animate-gradient">
                Ready to Build with Guidance?
              </span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up">
            Start building smarter with expert guidance from day one. Transform your ideas into reality with personalized mentorship.
          </p>

          {/* Enhanced CTA Button */}
          <div className={`mb-6 sm:mb-8 transform transition-all duration-800 ${ctaVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`} style={{ transitionDelay: '400ms' }}>
            <div className="relative inline-block">
              {/* Button glow ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              
              <button className="relative group w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden min-w-[250px] sm:min-w-[300px]">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Sparkle icon with enhanced animation */}
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:rotate-12 transition-transform duration-300 animate-pulse" />
                
                <span className="relative z-10">Find My Mentor</span>
                
                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
              </button>
            </div>
          </div>

          {/* Animated arrow with enhanced styling */}
          <div className={`mb-8 sm:mb-12 transform transition-all duration-800 ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-full blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center animate-bounce">
                  <ArrowDown className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Trust Features */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 transform transition-all duration-1000 ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 text-center hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              {/* Enhanced icon with pulse ring */}
              <div className="relative mb-4 flex justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base group-hover:text-emerald-300 transition-colors duration-300">{feature.title}</h3>
              <p className="text-white/70 text-xs sm:text-sm group-hover:text-white/90 transition-colors duration-300">{feature.description}</p>
              
              {/* Animated corner decorations */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse animation-delay-500"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Testimonial */}
        <div className={`transform transition-all duration-1000 ${ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl max-w-4xl mx-auto group hover:border-emerald-500/30 transition-all duration-300">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            
            {/* Enhanced quote bubble */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-md opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                  <Star className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Quote content */}
            <div className="relative text-center pt-4">
              <blockquote className="text-base sm:text-lg md:text-xl font-medium text-white/90 italic mb-6 leading-relaxed">
                "HelpMeMake changed how I learn and build. It's like having a dev buddy 24/7 who actually cares about your success."
              </blockquote>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-md"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm sm:text-base">Alex Rivera</p>
                    <p className="text-white/70 text-xs sm:text-sm">Frontend Developer</p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 text-yellow-400 fill-current animate-pulse" 
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced sparkle decorations */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse animation-delay-1000"></div>
            <div className="absolute bottom-4 right-6 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-pulse animation-delay-1500"></div>
            <div className="absolute top-1/2 left-4 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        {/* Additional animated elements for empty space */}
        <div className="absolute top-10 left-10 w-3 h-3 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-10px) rotate(5deg) scale(1.1); }
          50% { transform: translateY(-15px) rotate(-5deg) scale(1); }
          75% { transform: translateY(-5px) rotate(3deg) scale(1.1); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-float-icon { animation: float-icon 4s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </section>
  );
};

export default FinalCTA;