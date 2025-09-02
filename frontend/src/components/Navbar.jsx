import React, { useState, useEffect } from "react";
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
  Zap,
  Sparkles,
  Workflow,
  UserCheck,
  Layers,
  CreditCard,
  Network,
  Rocket,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const navItems = [
    { name: "Process", sectionId: "how-it-works", icon: Workflow },
    { name: "Mentors", sectionId: "mentors", icon: UserCheck },
    { name: "Features", sectionId: "live-collab", icon: Layers },
    { name: "SafePay", sectionId: "safe-payments", icon: CreditCard },
    { name: "Network", sectionId: "use-cases", icon: Network },
    { name: "Ignite", sectionId: "final-cta", icon: Rocket },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = [
        "hero",
        "how-it-works",
        "mentors",
        "live-collab",
        "safe-payments",
        "use-cases",
        "final-cta",
      ];
      let currentSection = "hero";

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = sections[i];
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setActiveSection("hero");
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <div
          className={`relative transition-all duration-500 ${
            scrolled
              ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-purple-500/30"
              : "bg-slate-900/90 backdrop-blur-md shadow-xl border border-emerald-500/20"
          } rounded-full overflow-hidden`}
        >
          <div
            className="absolute inset-0 opacity-30 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(139, 92, 246, 0.4) 0%,
                rgba(59, 130, 246, 0.3) 30%,
                rgba(16, 185, 129, 0.2) 60%,
                transparent 100%)`,
            }}
          />

          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `navFloat ${
                    2 + Math.random() * 2
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="relative flex items-center justify-between px-6 py-3">
            <div
              className="flex items-center group cursor-pointer"
              onClick={scrollToTop}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                  <Code className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="ml-3 text-lg font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-blue-300 transition-all duration-300">
                HelpMeMake
              </span>
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.sectionId);
                    }}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group overflow-hidden cursor-pointer ${
                      activeSection === item.sectionId
                        ? "text-emerald-300"
                        : "text-white/90 hover:text-emerald-300"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full transition-all duration-300 ${
                        activeSection === item.sectionId
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                      }`}
                    ></div>
                    <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <div className="flip-container inline-block">
                        <div className="flipper transition-transform duration-500 group-hover:rotate-y-180 preserve-3d">
                          <div className="flip-front backface-hidden">
                            <span className="whitespace-nowrap inline-block">
                              {item.name}
                            </span>
                          </div>

                          <div className="flip-back backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-300 ${
                        activeSection === item.sectionId
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></div>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="relative px-4 py-2 text-white/90 hover:text-emerald-300 text-sm font-medium transition-all duration-300 rounded-full hover:bg-white/10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Login</span>
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="relative flex items-center px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold rounded-full hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                <span className="relative z-10 flex items-center">
                  Sign Up
                  <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute top-0 left-0 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative flex items-center justify-center w-10 h-10 text-white/90 hover:text-emerald-300 transition-all duration-300 rounded-full hover:bg-white/10 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                <div className="relative z-10 transform transition-transform duration-300">
                  {isMenuOpen ? (
                    <X className="w-5 h-5 rotate-0 group-hover:rotate-90 transition-transform duration-300" />
                  ) : (
                    <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-500 ease-out ${
            isMenuOpen
              ? "relative mt-4 opacity-100 translate-y-0 pointer-events-auto scale-100"
              : "absolute top-full left-0 right-0 mt-4 opacity-0 -translate-y-8 pointer-events-none scale-95"
          }`}
        >
          <div className="relative bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-purple-500/30 rounded-3xl p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>

            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `navFloat ${
                      3 + Math.random() * 2
                    }s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <div className="relative space-y-2">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.sectionId);
                    }}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-white/10 group relative overflow-hidden cursor-pointer ${
                      activeSection === item.sectionId
                        ? "text-emerald-300 bg-white/5"
                        : "text-white/90 hover:text-emerald-300"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: isMenuOpen
                        ? "slideInFromLeft 0.5s ease-out forwards"
                        : "none",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                    <div
                      className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-6 bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-300 rounded-r ${
                        activeSection === item.sectionId
                          ? "w-1"
                          : "w-0 group-hover:w-1"
                      }`}
                    ></div>

                    <div className="relative z-10 flex items-center">
                      <div className="flip-container h-5 flex items-center mr-3">
                        <div className="flipper transition-transform duration-500 group-hover:rotate-y-180 preserve-3d">
                          <div className="flip-front absolute inset-0 backface-hidden flex items-center justify-center">
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="flip-back absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                        {item.name}
                      </span>
                    </div>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/20 space-y-3">
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full text-center px-4 py-3 text-white/90 hover:text-emerald-300 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-white/10 group relative overflow-hidden"
                  style={{
                    animationDelay: "400ms",
                    animation: isMenuOpen
                      ? "slideInFromLeft 0.5s ease-out forwards"
                      : "none",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                  <span className="relative z-10">Login</span>
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group relative overflow-hidden"
                  style={{
                    animationDelay: "500ms",
                    animation: isMenuOpen
                      ? "slideInFromLeft 0.5s ease-out forwards"
                      : "none",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-0 group-hover:scale-100"></div>
                  <span className="relative z-10 flex items-center justify-center">
                    Sign Up
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes navFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(4px); }
          50% { transform: translateY(-4px) translateX(-2px); }
          75% { transform: translateY(-12px) translateX(2px); }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* 3D Flip Animation Styles */
        .flip-container {
          perspective: 1000px;
          width: auto;
          min-width: fit-content;
        }

        .flipper {
          position: relative;
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
        }

        .flip-front, .flip-back {
          backface-visibility: hidden;
          width: 100%;
          height: 100%;
        }

        .flip-back {
          transform: rotateY(180deg);
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        /* Enhanced responsive design */
        @media (max-width: 768px) {
          .max-w-6xl {
            max-width: calc(100vw - 2rem);
          }
        }

        @media (max-width: 640px) {
          .text-lg { font-size: 1rem; }
          .px-6 { padding-left: 1rem; padding-right: 1rem; }
          .py-3 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        }

        @media (max-width: 480px) {
          .max-w-6xl {
            max-width: calc(100vw - 1rem);
          }
          .px-4 { padding-left: 0.5rem; padding-right: 0.5rem; }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Enhanced backdrop blur for better browser support */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Custom hover effects */
        .group:hover .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Improved accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .flipper {
            transition: none !important;
          }
        }

        /* Focus styles for better accessibility */
        a:focus, button:focus {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default Navbar;
