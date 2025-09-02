import React, { useState, useEffect, useRef } from "react";
import { Rocket, GraduationCap, Brain, Code, Zap, Target } from "lucide-react";

const UseCases = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  const [quoteVisible, setQuoteVisible] = useState(false);

  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const quoteRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: [0.1, 0.3, 0.6],
      rootMargin: "-10% 0px -10% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;

        if (entry.target === sectionRef.current) {
          setIsVisible(isIntersecting && intersectionRatio > 0.2);
        }

        if (entry.target === quoteRef.current) {
          setQuoteVisible(isIntersecting && intersectionRatio > 0.2);
        }

        cardsRef.current.forEach((cardRef, index) => {
          if (entry.target === cardRef) {
            setCardsVisible((prev) => {
              const newState = [...prev];
              newState[index] = isIntersecting && intersectionRatio > 0.15;
              return newState;
            });
          }
        });
      });
    }, observerOptions);

    const elementsToObserve = [
      sectionRef.current,
      quoteRef.current,
      ...cardsRef.current,
    ].filter(Boolean);
    elementsToObserve.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const useCases = [
    {
      icon: Rocket,
      title: "New Devs",
      subtitle: "Learn and build at the same time",
      description:
        "Skip the tutorial hell. Build real projects with expert guidance, getting hands-on experience while learning the fundamentals.",
      features: [
        "Live code reviews",
        "Project-based learning",
        "Career guidance",
      ],
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-500/10 via-red-500/5 to-pink-500/10",
      borderColor: "border-orange-400/30",
      iconBg: "from-orange-400 to-red-500",
      accentColor: "text-orange-300",
    },
    {
      icon: GraduationCap,
      title: "Students",
      subtitle: "Finish portfolio pieces",
      description:
        "Transform your academic projects into portfolio-worthy pieces that actually impress employers and showcase your skills.",
      features: [
        "Portfolio optimization",
        "Interview prep",
        "Industry insights",
      ],
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      bgGradient: "from-violet-500/10 via-purple-500/5 to-indigo-500/10",
      borderColor: "border-violet-400/30",
      iconBg: "from-violet-400 to-purple-500",
      accentColor: "text-violet-300",
    },
    {
      icon: Brain,
      title: "Senior Devs",
      subtitle: "Need help with one component",
      description:
        "Get unstuck on that specific problem. Whether it's a tricky algorithm or new tech stack, find the right expert quickly.",
      features: [
        "Targeted expertise",
        "Quick solutions",
        "Architecture advice",
      ],
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-cyan-500/10",
      borderColor: "border-emerald-400/30",
      iconBg: "from-emerald-400 to-teal-500",
      accentColor: "text-emerald-300",
    },
  ];

  const getParticleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 8;
      if (window.innerWidth < 1024) return 15;
      return 25;
    }
    return 15;
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden"
    >
      {/* Enhanced Responsive Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Responsive floating elements */}
        <div className="absolute top-4 sm:top-8 md:top-12 lg:top-20 left-2 sm:left-4 md:left-6 lg:left-10 w-12 sm:w-16 md:w-24 lg:w-32 h-12 sm:h-16 md:h-24 lg:h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse"></div>
        <div className="absolute top-16 sm:top-24 md:top-32 lg:top-40 right-4 sm:right-8 md:right-12 lg:right-20 w-16 sm:w-20 md:w-28 lg:w-40 h-16 sm:h-20 md:h-28 lg:h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 lg:bottom-32 left-1/6 sm:left-1/5 md:left-1/4 w-20 sm:w-24 md:w-32 lg:w-36 h-20 sm:h-24 md:h-32 lg:h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/3 sm:top-1/2 right-1/6 sm:right-1/5 md:right-1/4 w-12 sm:w-16 md:w-24 lg:w-28 h-12 sm:h-16 md:h-24 lg:h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-6 sm:bottom-10 md:bottom-16 lg:bottom-20 right-2 sm:right-4 md:right-6 lg:right-10 w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-4 sm:top-6 md:top-8 lg:top-10 left-1/3 sm:left-1/2 w-8 sm:w-12 md:w-16 lg:w-20 h-8 sm:h-12 md:h-16 lg:h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-lg sm:blur-xl md:blur-2xl lg:blur-3xl animate-pulse animation-delay-750"></div>

        {/* Enhanced responsive animated particles */}
        <div className="absolute inset-0">
          {[...Array(getParticleCount())].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 sm:w-1 h-0.5 sm:h-1 bg-white rounded-full opacity-10 sm:opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Enhanced responsive gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Enhanced Responsive Header */}
        <div
          className={`text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 transform transition-all duration-1200 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-16 sm:translate-y-20 md:translate-y-24 opacity-0 scale-95"
          }`}
        >
          <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <span className="inline-flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105">
              <Target className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 mr-1.5 sm:mr-2 md:mr-2.5" />
              For Every Developer
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight  px-2 sm:px-4">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
              Real Help for Every Developer
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-4 sm:px-6 md:px-8 lg:px-4">
            Whether you're just starting out or need expert help on a specific
            problem, find the right mentorship for your journey.
          </p>
        </div>

        {/* Enhanced Fully Responsive Use Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`group relative bg-gradient-to-br ${
                useCase.bgGradient
              } backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 xl:p-10 border ${
                useCase.borderColor
              } shadow-xl hover:border-white/50 transition-all duration-700 hover:-translate-y-2 sm:hover:-translate-y-3 md:hover:-translate-y-4 hover:shadow-2xl transform ${
                cardsVisible[index]
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-12 sm:translate-y-16 md:translate-y-20 opacity-0 scale-90"
              }`}
              style={{
                transitionDelay: `${index * 200}ms`,
                boxShadow: cardsVisible[index]
                  ? `0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px ${useCase.borderColor
                      .replace("border-", "rgba(")
                      .replace("/30", ", 0.3)")}`
                  : "none",
              }}
            >
              {/* Enhanced gradient glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-20 rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl transition-all duration-700 blur-lg sm:blur-xl`}
              ></div>

              {/* Enhanced Professional Icon Design */}
              <div className="relative mb-4 sm:mb-6 md:mb-7 lg:mb-8">
                <div
                  className={`relative w-12 sm:w-14 md:w-16 lg:w-18 xl:w-20 h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 bg-gradient-to-br ${useCase.iconBg} rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl hover:shadow-2xl`}
                >
                  <useCase.icon className="w-6 sm:w-7 md:w-8 lg:w-9 xl:w-10 h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10 text-white drop-shadow-lg" />

                  {/* Enhanced icon glow and ring effects */}
                  <div
                    className={`absolute inset-0 border-2 border-white/20 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl group-hover:border-white/50 transition-all duration-500`}
                  ></div>
                  <div
                    className={`absolute -inset-0.5 border border-white/10 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl group-hover:border-white/30 transition-all duration-500`}
                  ></div>
                </div>
              </div>

              {/* Enhanced Responsive Content */}
              <div className="text-center relative z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mb-1 sm:mb-2 md:mb-3">
                  {useCase.title}
                </h3>
                <p
                  className={`${useCase.accentColor} text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-semibold mb-3 sm:mb-4 md:mb-5 lg:mb-6`}
                >
                  {useCase.subtitle}
                </p>
                <p className="text-white/85 leading-relaxed mb-4 sm:mb-6 md:mb-7 lg:mb-8 text-xs sm:text-sm md:text-base lg:text-base xl:text-lg px-1 sm:px-2 md:px-0">
                  {useCase.description}
                </p>

                {/* Enhanced Responsive Features */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {useCase.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center justify-center space-x-2 sm:space-x-3 group-hover:scale-105 transition-transform duration-300"
                      style={{ transitionDelay: `${featureIndex * 100}ms` }}
                    >
                      <div
                        className={`w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 bg-gradient-to-r ${useCase.iconBg} rounded-full shadow-md`}
                      ></div>
                      <span className="text-white/75 text-xs sm:text-sm md:text-base lg:text-base font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced responsive decorative elements */}
              <div
                className={`absolute -top-2 sm:-top-3 md:-top-4 -right-2 sm:-right-3 md:-right-4 w-8 sm:w-12 md:w-16 lg:w-20 h-8 sm:h-12 md:h-16 lg:h-20 bg-gradient-to-br ${useCase.gradient} opacity-10 rounded-full blur-lg sm:blur-xl md:blur-2xl group-hover:opacity-25 group-hover:scale-125 transition-all duration-700`}
              ></div>
              <div
                className={`absolute -bottom-2 sm:-bottom-3 md:-bottom-4 -left-2 sm:-left-3 md:-left-4 w-6 sm:w-10 md:w-12 lg:w-16 h-6 sm:h-10 md:h-12 lg:h-16 bg-gradient-to-br ${useCase.gradient} opacity-5 rounded-full blur-lg sm:blur-xl md:blur-2xl group-hover:opacity-20 group-hover:scale-110 transition-all duration-700`}
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced Responsive Footer Quote */}
        <div
          ref={quoteRef}
          className={`text-center transform transition-all duration-1200 ease-out ${
            quoteVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 sm:translate-y-16 md:translate-y-20 opacity-0 scale-95"
          }`}
        >
          <div className="relative bg-gradient-to-r from-amber-900/20 via-yellow-900/10 to-amber-900/20 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-7 lg:p-8 xl:p-10 border border-amber-500/20 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto shadow-xl hover:shadow-2xl hover:border-amber-400/40 transition-all duration-700 group">
            {/* Enhanced responsive accent for quote */}
            <div className="absolute -top-3 sm:-top-4 md:-top-5 lg:-top-6 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 md:w-9 lg:w-10 h-6 sm:h-8 md:h-9 lg:h-10 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Code className="w-3 sm:w-4 md:w-4.5 lg:w-5 h-3 sm:h-4 md:h-4.5 lg:h-5 text-white drop-shadow-lg" />
            </div>

            <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white/95 italic leading-relaxed px-2 sm:px-4 md:px-6 lg:px-4 pt-2 sm:pt-3 md:pt-4">
              "No matter your level — we've got you covered."
            </blockquote>

            {/* Enhanced responsive decorative sparkles */}
            <div className="absolute top-2 sm:top-3 md:top-4 left-3 sm:left-4 md:left-6 lg:left-8 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-amber-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 lg:right-12 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-yellow-400 rounded-full opacity-70 animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-6 sm:left-8 md:left-10 lg:left-16 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-orange-400 rounded-full opacity-70 animate-pulse animation-delay-1000"></div>
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-3 sm:right-4 md:right-6 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-amber-300 rounded-full opacity-70 animate-pulse animation-delay-1500"></div>

            {/* Enhanced quote background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-orange-500/5 rounded-xl sm:rounded-2xl md:rounded-2xl lg:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1;
          }
          25% { 
            transform: translateY(-8px) rotate(5deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-16px) rotate(10deg); 
            opacity: 0.2;
          }
          75% { 
            transform: translateY(-8px) rotate(5deg); 
            opacity: 0.3;
          }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }

       
        @media (max-width: 640px) {
          .shadow-4xl {
            box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
          }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .shadow-4xl {
            box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.35), 0 15px 20px -5px rgba(0, 0, 0, 0.25);
          }
        }

        @media (min-width: 1025px) {
          .shadow-4xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.3);
          }
        }

       
        @media (max-width: 640px) {
          .blur-responsive { filter: blur(8px); }
        }
        
        @media (min-width: 641px) and (max-width: 1024px) {
          .blur-responsive { filter: blur(12px); }
        }

        @media (min-width: 1025px) {
          .blur-responsive { filter: blur(16px); }
        }

       
        html {
          scroll-behavior: smooth;
        }

       
        @media (hover: hover) and (pointer: fine) {
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
          .group:hover .group-hover\\:rotate-3 {
            transform: rotate(3deg) scale(1.1);
          }
          .group:hover .group-hover\\:rotate-6 {
            transform: rotate(6deg) scale(1.1);
          }
        }

       
        @media (hover: none) {
          .group:active .group-hover\\:scale-110 {
            transform: scale(1.05);
            transition-duration: 0.15s;
          }
        }

       
        @media (max-width: 375px) {
          .text-responsive-sm { font-size: 0.75rem; }
          .text-responsive-base { font-size: 0.875rem; }
          .text-responsive-lg { font-size: 1rem; }
          .text-responsive-xl { font-size: 1.125rem; }
        }

       
        .animate-pulse {
          animation-duration: 2s;
        }

       
        @media (max-width: 360px) {
          .container-padding { padding-left: 0.75rem; padding-right: 0.75rem; }
        }

       
        .focus\\:ring-enhanced:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }

       
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

       
        .prevent-cls {
          contain: layout style paint;
        }
      `}</style>
    </section>
  );
};

export default UseCases;
