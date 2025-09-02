import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Sparkles,
  Code,
  Brain,
  Heart,
  Star,
} from "lucide-react";
import MentorCard from "../components/MentorCard";

import { importAllMentorImages } from "../utils/importAllMentorImages";
const mentorImages = importAllMentorImages();

const MentorPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [elementsInView, setElementsInView] = useState({});
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    checkScrollButtons();

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      rootMargin: "-20px 0px -20px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const ratio = entry.intersectionRatio;
        setElementsInView((prev) => ({
          ...prev,
          [entry.target.dataset.element]: ratio,
        }));
      });
    }, observerOptions);

    const elements = [headerRef.current, statsRef.current, ctaRef.current];
    elements.forEach((el, index) => {
      if (el) {
        el.dataset.element = ["header", "stats", "cta"][index];
        observer.observe(el);
      }
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const mentors = [
    {
      id: 1,
      name: "Jiraiya",
      specialty: "Full-Stack Developer",
      image: mentorImages["jiraiya.jpg"],
      rating: 5,
      reviews: 127,
      rate: 65,
      techStack: ["React", "Node.js", "Python"],
      testimonial:
        "Sarah helped me build my first full-stack app in just 3 sessions!",
      colorScheme: "blue",
    },
    {
      id: 2,
      name: "Eren Yeager",
      specialty: "AI/ML Engineer",
      image: mentorImages["eren.jpg"],
      rating: 5,
      reviews: 89,
      rate: 80,
      techStack: ["Python", "TensorFlow", "PyTorch"],
      testimonial: "Amazing mentor who simplified complex ML concepts for me.",
      colorScheme: "purple",
    },
    {
      id: 3,
      name: "L",
      specialty: "Mobile Developer",
      image: mentorImages["L.jpg"],
      rating: 5,
      reviews: 156,
      rate: 70,
      techStack: ["React Native", "Flutter", "Swift"],
      testimonial: "Emily's guidance helped me launch my first mobile app!",
      colorScheme: "pink",
    },
    {
      id: 4,
      name: "Peter Parker",
      specialty: "DevOps Engineer",
      image: mentorImages["spidey.jpg"],
      rating: 5,
      reviews: 94,
      rate: 75,
      techStack: ["AWS", "Docker", "Kubernetes"],
      testimonial:
        "David taught me DevOps best practices that transformed my workflow.",
      colorScheme: "red",
    },
    {
      id: 5,
      name: "Rengoku",
      specialty: "UI/UX Designer",
      image: mentorImages["rengoku.jpg"],
      rating: 5,
      reviews: 203,
      rate: 60,
      techStack: ["Figma", "Adobe XD", "Sketch"],
      testimonial:
        "Maria's design insights elevated my project's user experience.",

      colorScheme: "orange",
    },
    {
      id: 6,
      name: "Izuku Midoriya",
      specialty: "Blockchain Developer",
      image: mentorImages["deku.jpg"],
      rating: 5,
      reviews: 67,
      rate: 90,
      techStack: ["Solidity", "Web3.js", "Ethereum"],
      testimonial:
        "James made blockchain development accessible and practical.",
      colorScheme: "teal",
    },
    {
      id: 7,
      name: "Minato",
      specialty: "Data Scientist",
      image: mentorImages["minato.jpg"],
      rating: 5,
      reviews: 142,
      rate: 85,
      techStack: ["Python", "R", "SQL"],
      testimonial:
        "Lisa's data science expertise helped me solve complex problems.",
      colorScheme: "amber",
    },
    {
      id: 8,
      name: "Roronoa Zoro",
      specialty: "Backend Developer",
      image: mentorImages["zoro.jpg"],
      rating: 5,
      reviews: 118,
      rate: 72,
      techStack: ["Java", "Spring", "PostgreSQL"],
      testimonial: "Michael's backend architecture knowledge is exceptional.",

      colorScheme: "emerald",
    },
  ];

  const cardsPerPage = 3;
  const totalPages = Math.ceil(mentors.length / cardsPerPage);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const cardWidth = 288 + 24;
      const newPage = Math.round(scrollLeft / (cardWidth * cardsPerPage));
      setCurrentPage(newPage);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24;
      const scrollAmount = cardWidth * cardsPerPage;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24;
      const scrollAmount = cardWidth * cardsPerPage;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollToPage = (pageIndex) => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24;
      const scrollAmount = cardWidth * cardsPerPage * pageIndex;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const stats = [
    {
      number: "500+",
      label: "Expert Mentors",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      colorScheme: "emerald",
    },
    {
      number: "4.9",
      label: "Average Rating",
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      colorScheme: "amber",
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
      colorScheme: "rose",
    },
    {
      number: "50+",
      label: "Tech Stacks",
      icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
      colorScheme: "indigo",
    },
  ];

  const getAnimationStyle = (elementKey, delay = 0) => {
    const inViewRatio = elementsInView[elementKey] || 0;
    const opacity = Math.min(inViewRatio * 1.5, 1);
    const translateY = (1 - inViewRatio) * 30;
    const scale = 0.95 + inViewRatio * 0.05;

    return {
      opacity,
      transform: `translateY(${translateY}px) scale(${scale})`,
      transitionDelay: `${delay}ms`,
      transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  };

  return (
    <section
      id="mentors"
      className="relative min-h-screen py-12 sm:py-16 md:py-20 overflow-hidden"
      ref={sectionRef}
    >
      {/* Enhanced Seamless Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Continuous floating background elements with responsive sizing */}
        <div
          className="absolute top-16 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{
            transform: `translateY(${scrollY * -0.1}px) rotate(${
              scrollY * 0.02
            }deg)`,
          }}
        ></div>
        <div
          className="absolute top-32 sm:top-40 right-8 sm:right-20 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-1000"
          style={{
            transform: `translateY(${scrollY * 0.05}px) rotate(${
              -scrollY * 0.01
            }deg)`,
          }}
        ></div>
        <div
          className="absolute bottom-24 sm:bottom-32 left-1/4 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-500"
          style={{
            transform: `translateY(${scrollY * -0.08}px)`,
          }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-1500"
          style={{
            transform: `translateX(${scrollY * 0.03}px) rotate(${
              scrollY * 0.015
            }deg)`,
          }}
        ></div>
        <div
          className="absolute bottom-16 sm:bottom-20 right-4 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-2000"
          style={{
            transform: `translateY(${scrollY * 0.06}px)`,
          }}
        ></div>
        <div
          className="absolute top-8 sm:top-10 left-1/2 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-750"
          style={{
            transform: `translateX(${scrollY * -0.04}px) rotate(${
              scrollY * -0.01
            }deg)`,
          }}
        ></div>

        {/* Enhanced animated particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full opacity-10 sm:opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `translateY(${
                  scrollY * (0.02 + Math.random() * 0.03)
                }px)`,
              }}
            />
          ))}
        </div>

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-slate-900/20"></div> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 sm:mb-16 md:mb-20 transform"
          style={getAnimationStyle("header")}
        >
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Meet Our Expert Mentors
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Learn from the Best
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Connect with industry experts who've helped thousands of developers
            build amazing projects and accelerate their careers.
          </p>
        </div>

        {/* Enhanced Stats Section */}
        <div
          ref={statsRef}
          className="mb-12 sm:mb-16"
          style={getAnimationStyle("stats", 200)}
        >
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group"
                  style={{
                    ...getAnimationStyle("stats", 300 + index * 100),
                    transform: `${
                      getAnimationStyle("stats", 300 + index * 100).transform
                    } translateY(${
                      Math.sin((scrollY + index * 200) * 0.001) * 2
                    }px)`,
                  }}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg ${
                      stat.colorScheme === "emerald"
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                        : stat.colorScheme === "amber"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600"
                        : stat.colorScheme === "rose"
                        ? "bg-gradient-to-r from-rose-500 to-rose-600"
                        : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 transition-colors duration-300 ${
                      stat.colorScheme === "emerald"
                        ? "group-hover:text-emerald-300"
                        : stat.colorScheme === "amber"
                        ? "group-hover:text-amber-300"
                        : stat.colorScheme === "rose"
                        ? "group-hover:text-rose-300"
                        : "group-hover:text-indigo-300"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-white/80 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Mentor Cards Section */}
        <div className="relative mb-12 sm:mb-16 md:mb-20">
          {/* Enhanced Navigation Buttons */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              canScrollLeft
                ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 cursor-pointer hover:shadow-emerald-500/25"
                : "bg-white/20 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              canScrollRight
                ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 cursor-pointer hover:shadow-emerald-500/25"
                : "bg-white/20 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Enhanced Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth scrollbar-hide px-16 sm:px-20 py-6 sm:py-8 gap-4 sm:gap-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={checkScrollButtons}
          >
            {mentors.map((mentor, index) => (
              <div
                key={mentor.id}
                style={{
                  transform: `translateY(${
                    Math.sin((scrollY + index * 100) * 0.002) * 3
                  }px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <MentorCard mentor={mentor} colorScheme={mentor.colorScheme} />
              </div>
            ))}
          </div>

          {/* Enhanced Scroll Indicators */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  currentPage === index
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg shadow-emerald-500/30"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div
          ref={ctaRef}
          className="text-center"
          style={getAnimationStyle("cta", 400)}
        >
          <div className="bg-gradient-to-r from-violet-900/20 to-violet-800/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-violet-500/30 shadow-2xl hover:border-violet-400/50 transition-all duration-300">
            <div className="mb-6 sm:mb-8">
              <Brain
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 text-violet-400"
                style={{
                  transform: `rotate(${Math.sin(scrollY * 0.001) * 5}deg)`,
                }}
              />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Don't See Your Perfect Match?
              </h3>
              <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Our AI-powered matching system will find the perfect mentor for
                your specific needs and project requirements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto">
              <button className="group relative bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold hover:from-violet-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 flex items-center justify-center overflow-hidden w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center text-sm sm:text-base">
                  <Sparkles className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                  Find My Perfect Mentor
                </span>
              </button>

              <button className="group border-2 border-white/30 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm w-full sm:w-auto">
                <Users className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-sm sm:text-base" />
                Browse All Mentors
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(10deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

       
        @media (max-width: 640px) {
          .text-responsive {
            font-size: clamp(0.875rem, 2.5vw, 1rem);
          }
        }

       
        html {
          scroll-behavior: smooth;
        }

       
        button:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

       
        @media (hover: hover) {
          .group:hover .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
          
          .group:hover .group-hover\\:text-emerald-300 {
            color: #6ee7b7;
          }
        }

       
        @media (max-width: 768px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }

       
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default MentorPage;
