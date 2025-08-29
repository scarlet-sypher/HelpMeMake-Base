import heroImage from "../assets/heroImage.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Users,
  Code,
  Video,
  Shield,
  Star,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Zap,
} from "lucide-react";

const NUM_SPARKLES = 20;

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    // Generate sparkles only once on mount
    setSparkles(
      Array.from({ length: NUM_SPARKLES }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
      }))
    );

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Dynamic Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-30 md:opacity-50 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(139, 92, 246, 0.3) 0%,
              rgba(59, 130, 246, 0.2) 30%,
              rgba(16, 185, 129, 0.1) 60%,
              transparent 100%)`,
          }}
        />

        {/* Animated Particles - Responsive */}
        <div className="absolute inset-0">
          {sparkles
            .slice(0, window.innerWidth < 768 ? 10 : NUM_SPARKLES)
            .map((sparkle, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full opacity-20"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  animation: `float ${sparkle.duration}s ease-in-out infinite`,
                  animationDelay: `${sparkle.delay}s`,
                }}
              />
            ))}
        </div>

        {/* Enhanced Floating Elements - Responsive */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-r from-emerald-400/30 to-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 sm:top-40 right-8 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-24 sm:bottom-32 left-1/6 sm:left-1/4 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/6 sm:right-1/4 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-2xl animate-pulse animation-delay-1500"></div>
      </div>

      {/* Enhanced Mountain Landscape - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <svg
          viewBox="0 0 1440 400"
          className="w-full h-40 sm:h-60 md:h-80 lg:h-96"
          preserveAspectRatio="none"
        >
          {/* Animated Mountain Layers */}
          <path
            d="M0,400 L0,180 Q200,120 400,150 Q600,100 800,130 Q1000,80 1200,110 Q1300,90 1440,100 L1440,400 Z"
            fill="url(#mountain1)"
            className="animate-mountain-1"
          />
          <path
            d="M0,400 L0,220 Q300,170 600,200 Q900,150 1200,180 Q1320,160 1440,170 L1440,400 Z"
            fill="url(#mountain2)"
            className="animate-mountain-2"
          />
          <path
            d="M0,400 L0,280 Q400,240 800,270 Q1000,250 1200,260 Q1320,250 1440,255 L1440,400 Z"
            fill="url(#mountain3)"
            className="animate-mountain-3"
          />
          <path
            d="M0,400 L0,320 Q300,300 600,310 Q900,290 1200,300 Q1320,295 1440,300 L1440,400 Z"
            fill="url(#mountain4)"
            className="animate-mountain-4"
          />

          <defs>
            <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
            </linearGradient>
            <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
            </linearGradient>
            <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.5)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.4)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
            </linearGradient>
            <linearGradient id="mountain4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content - Enhanced Responsive Layout */}
      <div className="relative z-10 pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column - Enhanced Responsive Text */}
            <div
              className={`lg:col-span-7 text-center lg:text-left transform transition-all duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="mb-4 sm:mb-4 mt-5">
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden xs:inline">Now Live - </span>
                  AI-Powered Mentorship
                </span>
              </div>

              {/* Responsive Typography */}
              <h1 className="text-3xl xs:text-6xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-snug sm:leading-snug tracking-tight">
                <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent animate-gradient block">
                  Build your dream
                </span>
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient animation-delay-500 block mt-1 sm:mt-1">
                  project today
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 max-w-none sm:max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Connect with{" "}
                <span className="text-emerald-400 font-semibold">
                  vetted mentors
                </span>{" "}
                to learn tech stacks, build your portfolio, or understand
                complex components—safely and effectively.
              </p>

              {/* Enhanced Responsive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-end lg:justify-start mb-8 sm:mb-12">
                <button
                  onClick={() => navigate("/signup")}
                  className="group relative bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-semibold text-sm sm:text-base hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center overflow-hidden w-full sm:w-auto touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="group border-2 border-white/30 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
                >
                  <BookOpen className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  Read Docs
                </button>
              </div>

              {/* Responsive Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 sm:space-x-8 text-center">
                <div className="flex-1 sm:flex-none">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Expert Mentors
                  </div>
                </div>
                <div className="flex-1 sm:flex-none">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    1.2k+
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Success Stories
                  </div>
                </div>
                <div className="flex-1 sm:flex-none">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    99%
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced Responsive Hero Image */}
            <div
              className={`lg:col-span-5 mt-12 sm:mt-16 lg:mt-0 relative transform transition-all duration-1000 delay-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Main Hero Image Container - Responsive */}
              <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
                {/* Hero Image - Responsive */}
                <div className="relative mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Mentorship Platform"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl sm:rounded-2xl hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  {/* Fallback if image doesn't load */}
                  <div className="hidden w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-xl sm:rounded-2xl items-center justify-center">
                    <div className="text-center text-white">
                      <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-80" />
                      <p className="text-base sm:text-lg font-semibold">
                        Connect & Learn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Mock Interface - Responsive */}
                <div className="bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      <span className="text-xs sm:text-sm text-white/80">
                        Live Session
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl p-4 sm:p-6 flex items-center justify-center transform hover:scale-105 transition-transform">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg sm:rounded-xl p-4 sm:p-6 flex items-center justify-center transform hover:scale-105 transition-transform">
                      <Code className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>

                  {/* Live Activity Indicators - Responsive */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-white/80">
                        12 mentors online
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-white/80">
                        Active sessions
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Responsive Floating Elements */}
              <div className="absolute -top-4 sm:-top-6 md:-top-8 -right-4 sm:-right-6 md:-right-8 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -left-4 sm:-left-6 md:-left-8 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="absolute top-1/2 -left-2 sm:-left-3 md:-left-4 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-spin-slow shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-mountain-1 {
          animation: float 6s ease-in-out infinite;
        }

        .animate-mountain-2 {
          animation: float 8s ease-in-out infinite reverse;
        }

        .animate-mountain-3 {
          animation: float 10s ease-in-out infinite;
        }

        .animate-mountain-4 {
          animation: float 12s ease-in-out infinite reverse;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-1500 {
          animation-delay: 1500ms;
        }

        /* Enhanced responsive breakpoint for extra small devices */
        @media (min-width: 475px) {
          .xs\\:text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
          }
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
