import React, { useState, useEffect } from "react";
import {
  Sparkles,
  UserPlus,
  Shield,
  Clock,
  Users,
  Star,
  ArrowDown,
  Zap,
  Rocket,
  Heart,
  ShipWheel,
} from "lucide-react";

const FinalCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [scrollAnimations, setScrollAnimations] = useState({
    hero: false,
    cta: false,
    trust: false,
    testimonial: false,
  });

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setCtaVisible(true);
    }, 600);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const windowHeight = window.innerHeight;
      const heroElement = document.getElementById("hero-section");
      const ctaElement = document.getElementById("cta-section");
      const trustElement = document.getElementById("trust-section");
      const testimonialElement = document.getElementById("testimonial-section");

      const isElementInView = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.top < windowHeight * 0.8 && rect.bottom > windowHeight * 0.2
        );
      };

      setScrollAnimations({
        hero: isElementInView(heroElement),
        cta: isElementInView(ctaElement),
        trust: isElementInView(trustElement),
        testimonial: isElementInView(testimonialElement),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const trustFeatures = [
    {
      icon: Shield,
      title: "SSL Secure",
      description: "Bank-level encryption",
      color: "from-blue-500 to-cyan-500",
      borderColor: "blue-500/40",
      iconBg: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
      hoverIconColor: "group-hover:text-blue-300",
      titleColor: "group-hover:text-blue-300",
      cardBg: "from-blue-900/15 to-cyan-900/10",
      cardBorder: "border-blue-500/25",
      cardHoverBorder: "hover:border-blue-400/40",
    },
    {
      icon: Clock,
      title: "Escrow Safe",
      description: "Protected payments",
      color: "from-amber-500 to-yellow-500",
      borderColor: "amber-500/40",
      iconBg: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400",
      hoverIconColor: "group-hover:text-amber-300",
      titleColor: "group-hover:text-amber-300",
      cardBg: "from-amber-900/15 to-yellow-900/10",
      cardBorder: "border-amber-500/25",
      cardHoverBorder: "hover:border-amber-400/40",
    },
    {
      icon: Users,
      title: "Trusted Mentors",
      description: "Vetted experts",
      color: "from-emerald-500 to-green-500",
      borderColor: "emerald-500/40",
      iconBg: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      hoverIconColor: "group-hover:text-emerald-300",
      titleColor: "group-hover:text-emerald-300",
      cardBg: "from-emerald-900/15 to-green-900/10",
      cardBorder: "border-emerald-500/25",
      cardHoverBorder: "hover:border-emerald-400/40",
    },
  ];

  const floatingElements = [
    { icon: Zap, delay: 0, position: "top-1/4 left-1/4" },
    { icon: Rocket, delay: 1000, position: "top-1/3 right-1/3" },
    { icon: Heart, delay: 2000, position: "bottom-1/4 left-1/3" },
    { icon: Star, delay: 1500, position: "bottom-1/3 right-1/4" },
    { icon: Sparkles, delay: 500, position: "top-1/2 left-1/2" },
  ];

  const testimonialIcons = [
    {
      icon: UserPlus,
      color: "text-rose-400",
      bg: "from-rose-500/20 to-pink-500/20",
      blur: "from-rose-500/20 to-pink-500/20",
    },
    {
      icon: Star,
      color: "text-amber-400",
      bg: "from-amber-500/20 to-yellow-500/20",
      blur: "from-amber-500/20 to-yellow-500/20",
    },
    {
      icon: Heart,
      color: "text-emerald-400",
      bg: "from-emerald-500/20 to-green-500/20",
      blur: "from-emerald-500/20 to-green-500/20",
    },
  ];

  return (
    <section className="relative min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background with Mouse Tracking */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Enhanced floating background elements - responsive sizing */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-20 sm:top-40 right-8 sm:right-20 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-18 h-18 sm:w-36 sm:h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-14 h-14 sm:w-28 sm:h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-1500"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-5 sm:top-10 left-1/2 w-10 h-10 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow animation-delay-750"></div>

        {/* Animated geometric shapes - responsive sizing */}
        <div className="absolute top-10 sm:top-20 right-4 sm:right-10 w-8 h-8 sm:w-16 sm:h-16 border-2 border-emerald-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-6 sm:left-16 w-6 h-6 sm:w-12 sm:h-12 border-2 border-blue-400/20 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/2 left-8 sm:left-20 w-4 h-4 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400/30 to-pink-400/30 transform rotate-45 animate-pulse animation-delay-2000"></div>

        {/* Floating animated icons - responsive sizing */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.position} w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-10 animate-float-icon`}
            style={{ animationDelay: `${element.delay}ms` }}
          >
            <element.icon className="w-full h-full text-white" />
          </div>
        ))}

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main CTA Section */}
        <div
          id="hero-section"
          className={`text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 transform transition-all duration-1000 ${
            isVisible && scrollAnimations.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative">
            <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              <span className="inline-flex items-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm md:text-base font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105">
                <ShipWheel className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 mr-1.5 sm:mr-2 md:mr-2.5" />
                Fuel Your Dev Journey
              </span>
            </div>
            {/* Animated background text - responsive sizing */}
            <div className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black text-white/5 select-none animate-pulse-slow flex items-center justify-center">
              BUILD
            </div>

            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent animate-gradient">
                Ready to Build with Guidance?
              </span>
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 md:mb-12 animate-fade-in-up px-4">
            Start building smarter with expert guidance from day one. Transform
            your ideas into reality with personalized mentorship.
          </p>

          {/* Enhanced CTA Button */}
          <div
            id="cta-section"
            className={`mb-4 sm:mb-6 md:mb-8 transform transition-all duration-800 ${
              ctaVisible && scrollAnimations.cta
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-10 opacity-0 scale-95"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="relative inline-block">
              <button className="relative group w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden min-w-[200px] sm:min-w-[250px] md:min-w-[300px]">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>

                {/* Sparkle icon with enhanced animation */}
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300 animate-pulse" />

                <span className="relative z-10">Find My Mentor</span>

                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
              </button>
            </div>
          </div>

          {/* Animated arrow with enhanced styling - updated colors */}
          <div
            className={`mb-6 sm:mb-8 md:mb-12 transform transition-all duration-800 ${
              ctaVisible && scrollAnimations.cta
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/40 to-fuchsia-500/40 rounded-full blur-lg animate-pulse"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 rounded-full flex items-center justify-center animate-bounce shadow-lg border border-violet-400/30">
                  <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-violet-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Trust Features */}
        <div
          id="trust-section"
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16 transform transition-all duration-1000 ${
            ctaVisible && scrollAnimations.trust
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          {trustFeatures.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.cardBg} backdrop-blur-xl rounded-2xl p-3 sm:p-4 md:p-6 border ${feature.cardBorder} ${feature.cardHoverBorder} text-center transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl animate-fade-in-up`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Animated background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
              ></div>

              {/* Enhanced icon with pulse ring */}
              <div className="relative mb-3 sm:mb-4 flex justify-center">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.iconBg} rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
                <div
                  className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${feature.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor} ${feature.hoverIconColor} transition-colors duration-300`}
                  />
                </div>
              </div>

              {/* Content */}
              <h3
                className={`text-white font-semibold mb-2 text-sm sm:text-base ${feature.titleColor} transition-colors duration-300`}
              >
                {feature.title}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Animated corner decorations */}
              <div
                className={`absolute top-2 right-2 w-2 h-2 bg-gradient-to-r ${feature.iconBg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse`}
              ></div>
              <div
                className={`absolute bottom-2 left-2 w-1 h-1 bg-gradient-to-r ${feature.iconBg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse animation-delay-500`}
              ></div>
            </div>
          ))}
        </div>

        {/* Enhanced Testimonial */}
        <div
          id="testimonial-section"
          className={`transform transition-all duration-1000 ${
            ctaVisible && scrollAnimations.testimonial
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <div className="relative bg-gradient-to-br from-indigo-900/20 to-purple-900/15 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-indigo-400/30 shadow-2xl max-w-5xl mx-auto group hover:border-indigo-400/50 transition-all duration-300">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>

            {/* Enhanced quote bubble */}
            <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-50"></div>
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Quote content */}
            <div className="relative text-center pt-2 sm:pt-4">
              <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/90 italic mb-4 sm:mb-6 leading-relaxed px-2">
                "HelpMeMake changed how I learn and build. It's like having a
                dev buddy 24/7 who actually cares about your success."
              </blockquote>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${testimonialIcons[0].blur} rounded-full blur-md`}
                    ></div>
                    <div
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${testimonialIcons[0].bg} rounded-full flex items-center justify-center`}
                    >
                      <UserPlus
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${testimonialIcons[0].color}`}
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm sm:text-base">
                      Ash Ketchum
                    </p>
                    <p className="text-white/70 text-xs sm:text-sm">
                      Frontend Developer
                    </p>
                  </div>
                </div>

                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced sparkle decorations with different colors */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-1 h-1 bg-amber-400 rounded-full opacity-60 animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-pulse animation-delay-1000"></div>
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse animation-delay-1500"></div>
            <div className="absolute top-1/2 left-3 sm:left-4 w-1 h-1 bg-violet-400 rounded-full opacity-60 animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        {/* Additional animated elements for empty space - responsive sizing */}
        <div className="absolute top-5 sm:top-10 left-4 sm:left-10 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-8 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-ping animation-delay-2000"></div>
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
        
        /* Responsive font scaling */
        @media (max-width: 640px) {
          .min-w-[200px] { min-width: 180px; }
        }
        
        @media (max-width: 480px) {
          .min-w-[180px] { min-width: 160px; }
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
