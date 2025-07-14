import React, { useState, useEffect } from 'react';
import { Rocket, GraduationCap, Brain, Code, Zap, Target } from 'lucide-react';

const UseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setCardsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const useCases = [
    {
      icon: Rocket,
      title: "New Devs",
      subtitle: "Learn and build at the same time",
      description: "Skip the tutorial hell. Build real projects with expert guidance, getting hands-on experience while learning the fundamentals.",
      features: ["Live code reviews", "Project-based learning", "Career guidance"],
      gradient: "from-emerald-500 to-blue-500"
    },
    {
      icon: GraduationCap,
      title: "Students",
      subtitle: "Finish portfolio pieces",
      description: "Transform your academic projects into portfolio-worthy pieces that actually impress employers and showcase your skills.",
      features: ["Portfolio optimization", "Interview prep", "Industry insights"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Brain,
      title: "Senior Devs",
      subtitle: "Need help with one component",
      description: "Get unstuck on that specific problem. Whether it's a tricky algorithm or new tech stack, find the right expert quickly.",
      features: ["Targeted expertise", "Quick solutions", "Architecture advice"],
      gradient: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Seamless Background - Matching SafePayments */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Continuous floating background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-750"></div>

        {/* Animated particles for continuity */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Target className="w-4 h-4 mr-2" />
              For Every Developer
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Real Help for Every Developer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Whether you're just starting out or need expert help on a specific problem, find the right mentorship for your journey.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:border-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl transform ${
                cardsVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
              }`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                animation: cardsVisible ? 'slideInUp 0.8s ease-out forwards' : 'none'
              }}
            >
              {/* Gradient glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`relative w-16 h-16 bg-gradient-to-r ${useCase.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <useCase.icon className="w-8 h-8 text-white" />
                
                {/* Icon glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
              </div>

              {/* Content */}
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-emerald-300 text-lg font-medium mb-4">{useCase.subtitle}</p>
                <p className="text-white/80 leading-relaxed mb-6">{useCase.description}</p>
                
                {/* Features */}
                <div className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center space-x-2">
                      <div className={`w-2 h-2 bg-gradient-to-r ${useCase.gradient} rounded-full`}></div>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-r ${useCase.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
              <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r ${useCase.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Footer Quote */}
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="relative bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto">
            {/* Quote accent */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>

            <blockquote className="text-xl md:text-2xl font-medium text-white/90 italic">
              "No matter your level — we've got you covered."
            </blockquote>

            {/* Decorative sparkles */}
            <div className="absolute top-2 left-8 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-6 right-12 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-4 left-16 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes slideInUp {
          0% { 
            transform: translateY(40px) scale(0.95); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </section>
  );
};

export default UseCases;