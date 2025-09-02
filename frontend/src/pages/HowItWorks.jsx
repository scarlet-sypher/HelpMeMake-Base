import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Search,
  MessageSquare,
  Video,
  Code,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Star,
  Target,
  Brain,
  Zap,
  Award,
  FileText,
  Play,
  Clock,
  ChevronRight,
  Lightbulb,
  CheckSquare,
  Rocket,
  Heart,
  TrendingUp,
  Briefcase,
  Trophy,
} from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => new Set(prev).add(entry.target.id));
          } else {
            setAnimatedElements((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: 1,
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Tell Us What You Need",
      subtitle: "Your goals, your way",
      description:
        "Easily outline your goals, project scope, preferred tools, and timeline to connect with the right mentor who can guide, debug, and teach effectively.",
      subtext:
        "No project is too small — we connect passion with expertise so you gain value from every session.",
      color: "from-emerald-500 to-blue-500",
      bgColor: "from-emerald-500/20 to-blue-500/20",
      features: [
        "Project scope",
        "Tech stack selection",
        "Timeline planning",
        "Mentor preferences",
      ],
      processDetails: [
        {
          icon: <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Share your project vision",
        },
        {
          icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Select preferred technologies",
        },
        {
          icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Set your timeline",
        },
        {
          icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Choose mentor type",
        },
      ],
    },
    {
      id: 2,
      icon: <Brain className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Right Mentor, Instantly",
      subtitle: "Let AI do the hard work",
      description:
        "Our AI-powered engine evaluates mentor skills, availability, and past feedback to suggest ideal matches that save time and maximize compatibility.",
      subtext:
        "Skip endless searching — get personalized mentor matches instantly with skill and schedule alignment.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      features: [
        "AI-powered matching",
        "Skill compatibility",
        "Availability sync",
        "Trusted Reviews",
      ],
      processDetails: [
        {
          icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "AI analyzes your requirements",
        },
        {
          icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Matches with expert mentors",
        },
        {
          icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Reviews compatibility scores",
        },
        {
          icon: <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Presents top 3 matches",
        },
      ],
    },
    {
      id: 3,
      icon: <Video className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Live & Interactive Build",
      subtitle: "Real-time pair coding",
      description:
        "Collaborate seamlessly with mentors through live sessions, interactive pair coding, instant chat, and guided screen walkthroughs for real progress.",
      subtext:
        "Learn efficiently, code confidently, and strengthen your abilities while creating real solutions.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-500/20 to-purple-500/20",
      features: [
        "Video calls",
        "Code sharing",
        "Real-time chat",
        "Screen sharing",
      ],
      processDetails: [
        {
          icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Join video session",
        },
        {
          icon: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Share code in real-time",
        },
        {
          icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Chat and collaborate",
        },
        {
          icon: <Play className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Build together live",
        },
      ],
    },
    {
      id: 4,
      icon: <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Pay Securely After the Session",
      subtitle: "Only pay for value",
      description:
        "Pay safely after your session is complete. No upfront cost, only transparent billing with security built in, ensuring you pay only for results.",
      subtext:
        "Your satisfaction is guaranteed — if you don’t see value in the mentorship, you don’t spend a rupee.",
      color: "from-emerald-600 to-teal-500",
      bgColor: "from-emerald-600/20 to-teal-500/20",
      features: [
        "Secure payment",
        "No upfront fees",
        "Transparent pricing",
        "Satisfaction guarantee",
      ],
      processDetails: [
        {
          icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Complete your session",
        },
        {
          icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Rate your experience",
        },
        {
          icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Secure payment gateway",
        },
        {
          icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Pay only if satisfied",
        },
      ],
    },
    {
      id: 5,
      icon: <Award className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Build Your Project + Portfolio",
      subtitle: "Walk away with more than just a session",
      description:
        "Each mentorship gives more than knowledge — you finish with portfolio-ready results, expanded skills, and a mentor relationship you can reuse.",
      subtext:
        "You leave with projects and stronger skills, creating a foundation for career growth and future success.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      features: [
        "Portfolio projects",
        "Skill development",
        "Mentor network",
        "Career growth",
      ],
      processDetails: [
        {
          icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Add to portfolio",
        },
        {
          icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Track skill growth",
        },
        {
          icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Build mentor network",
        },
        {
          icon: <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "Accelerate career",
        },
      ],
    },
  ];

  const benefits = [
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Vetted Mentors",
      description: "All mentors are thoroughly screened and verified",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/8 to-cyan-500/8",
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Instant Matching",
      description: "Get matched with the perfect mentor in minutes",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/8 to-orange-500/8",
    },
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Quality Assured",
      description: "99% satisfaction rate with money-back guarantee",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/8 to-pink-500/8",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Community Driven",
      description: "Join a thriving community of learners and builders",
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-500/8 to-green-500/8",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Expert Mentors",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      iconColor: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
    },
    {
      number: "1.2k+",
      label: "Success Stories",
      icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
      iconColor: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-500/10 to-yellow-500/10",
    },
    {
      number: "99%",
      label: "Satisfaction Rate",
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      iconColor: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/10 to-purple-500/10",
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
      iconColor: "from-rose-500 to-pink-500",
      bgColor: "from-rose-500/10 to-pink-500/10",
    },
  ];

  const isAnimated = (id) => animatedElements.has(id);

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 xl:py-28 overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Dynamic floating elements with scroll parallax */}
        <div
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="absolute top-20 sm:top-40 right-10 sm:right-20 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        ></div>
        <div
          className="absolute bottom-16 sm:bottom-32 left-1/4 w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-500"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-1500"
          style={{ transform: `translateY(${scrollY * -0.12}px)` }}
        ></div>

        {/* Enhanced Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full opacity-30"
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

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div
          id="header"
          data-animate
          className={`text-center mb-16 sm:mb-20 lg:mb-24 xl:mb-28 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          } ${
            isAnimated("header")
              ? "scale-100 opacity-100"
              : "scale-95 opacity-80"
          }`}
        >
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              Simple & Effective Process
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 ">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent inline-block py-2">
              How It Works
            </span>
          </h2>

          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed px-4">
            Get started with{" "}
            <span className="text-emerald-400 font-semibold">HelpMeMake</span>{" "}
            in five simple steps and transform your ideas into reality.
          </p>
        </div>

        {/* Enhanced Interactive Step Process */}
        <div
          id="steps"
          data-animate
          className={`mb-16 sm:mb-20 lg:mb-24 xl:mb-28 transform transition-all duration-1000 ${
            isAnimated("steps")
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {/* Enhanced Progress Bar */}
          <div className="flex justify-center mb-12 sm:mb-16 px-2 sm:px-4">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 overflow-x-auto pb-4 max-w-full scrollbar-hide">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-500 hover:scale-110 shadow-lg flex-shrink-0 ${
                      index <= activeStep
                        ? `bg-gradient-to-r ${steps[activeStep].color} border-transparent text-white shadow-lg`
                        : "border-white/30 text-white/50 hover:border-white/50 backdrop-blur-sm"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {index < activeStep ? (
                      <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                    ) : (
                      <span className="font-semibold text-xs sm:text-base md:text-lg lg:text-xl">
                        {step.id}
                      </span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-4 sm:w-8 md:w-12 lg:w-20 h-0.5 transition-all duration-500 flex-shrink-0 ${
                        index < activeStep
                          ? `bg-gradient-to-r ${steps[activeStep].color} shadow-sm`
                          : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Current Step Display */}
          <div className="max-w-7xl mx-auto px-2 sm:px-0">
            <div
              className={`bg-gradient-to-r ${steps[activeStep].bgColor} backdrop-blur-xl rounded-3xl sm:rounded-4xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20 shadow-2xl min-h-[700px] sm:min-h-[800px] md:min-h-[900px] lg:min-h-[1000px] transition-all duration-500`}
            >
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-6 sm:gap-8 md:gap-10 h-full">
                {/* Enhanced Step Content - Header Section */}
                <div className="order-1 lg:order-1 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 space-y-4 sm:space-y-6 flex flex-col justify-start">
                  <div
                    className={`inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-medium bg-gradient-to-r ${steps[activeStep].bgColor} text-white border border-white/20 backdrop-blur-sm shadow-lg`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${steps[activeStep].color} mr-2 animate-pulse`}
                    ></span>
                    Step {steps[activeStep].id} of 5
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                      {steps[activeStep].title}
                    </h3>

                    <p className="text-emerald-300 text-lg sm:text-xl md:text-2xl font-medium">
                      {steps[activeStep].subtitle}
                    </p>

                    <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
                      {steps[activeStep].description}
                    </p>

                    <p className="text-white/70 italic text-sm sm:text-base md:text-lg">
                      {steps[activeStep].subtext}
                    </p>
                  </div>

                  {/* Enhanced Process Details */}
                  <div className="space-y-3 sm:space-y-4">
                    {steps[activeStep].processDetails.map((detail, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 text-white/90 text-sm sm:text-base md:text-lg p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-x-2`}
                      >
                        <div
                          className={`p-2 rounded-xl bg-gradient-to-r ${steps[activeStep].bgColor} flex-shrink-0 shadow-lg`}
                        >
                          {detail.icon}
                        </div>
                        <span className="flex-1 font-medium">
                          {detail.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Visual Representation */}
                <div className="order-2 lg:order-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 flex items-start justify-center pt-4 lg:pt-8">
                  <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                    {/* Enhanced Main Visual Container */}
                    <div
                      className={`relative bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col w-full`}
                    >
                      {/* Enhanced Icon Display */}
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center mb-6 sm:mb-8 mx-auto text-white shadow-xl`}
                      >
                        {steps[activeStep].icon}
                      </div>

                      {/* Enhanced Step-specific Visual Content */}
                      {activeStep === 0 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 backdrop-blur-sm">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-white text-sm sm:text-base font-medium">
                                Tech Stack
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm text-white font-medium backdrop-blur-sm">
                                React
                              </div>
                              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm text-white font-medium backdrop-blur-sm">
                                Node.js
                              </div>
                              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full text-xs sm:text-sm text-white font-medium backdrop-blur-sm">
                                MongoDB
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 1 && (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="flex justify-center space-x-4 sm:space-x-6 mb-6">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm transition-all duration-500 ${
                                    i <= 1 ? "animate-pulse" : ""
                                  }`}
                                  style={{ animationDelay: `${i * 200}ms` }}
                                >
                                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                              ))}
                            </div>
                            <div className="text-white text-sm sm:text-base mb-4 font-medium">
                              AI Matching in Progress...
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 mb-4">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 sm:h-3 rounded-full animate-pulse shadow-lg"
                                style={{ width: "75%" }}
                              ></div>
                            </div>
                            <div className="text-white/70 text-xs sm:text-sm">
                              Analyzing 500+ expert mentors
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 2 && (
                        <div className="space-y-6">
                          <div className="bg-black/50 rounded-xl p-4 sm:p-6 border border-white/20 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white text-sm sm:text-base font-medium">
                                  Live Session Active
                                </span>
                              </div>
                              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <div className="bg-white/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                                <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-2" />
                                <div className="text-xs sm:text-sm text-white font-medium">
                                  Code Share
                                </div>
                              </div>
                              <div className="bg-white/20 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm hover:bg-white/30 transition-all duration-300">
                                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-2" />
                                <div className="text-xs sm:text-sm text-white font-medium">
                                  Chat
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 3 && (
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-white text-base sm:text-lg mb-6 font-medium">
                              Session Complete! 🎉
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                              <div className="flex items-center justify-between bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm border border-white/20">
                                <span className="text-white text-sm sm:text-base font-medium">
                                  Session Quality
                                </span>
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current animate-pulse"
                                      style={{ animationDelay: `${i * 100}ms` }}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="bg-emerald-500/20 rounded-lg p-3 sm:p-4 border border-emerald-500/30 backdrop-blur-sm">
                                <div className="text-emerald-300 text-sm sm:text-base text-center font-medium">
                                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                                  Secure Payment Gateway
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 4 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 text-center border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1.5" />
                              <div className="text-[11px] sm:text-xs text-white font-medium">
                                Portfolio
                              </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 text-center border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1.5" />
                              <div className="text-[11px] sm:text-xs text-white font-medium">
                                Skills
                              </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 text-center border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1.5" />
                              <div className="text-[11px] sm:text-xs text-white font-medium">
                                Network
                              </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 text-center border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1.5" />
                              <div className="text-[11px] sm:text-xs text-white font-medium">
                                Growth
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Floating Action Button */}
                    <div
                      className={`absolute -top-3 sm:-top-4 -right-3 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${steps[activeStep].color} rounded-full flex items-center justify-center animate-bounce shadow-xl transition-all duration-500`}
                    >
                      <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="order-3 lg:order-3 lg:col-start-2 lg:col-end-3 lg:row-start-2">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mt-4 lg:mt-6">
                    {steps[activeStep].features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 sm:space-x-3 text-white/80 text-xs sm:text-sm lg:text-base p-2 sm:p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/5 transition-all duration-300"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-400 flex-shrink-0" />
                        <span className="flex-1 font-medium leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div
          id="benefits"
          data-animate
          className={`mb-16 sm:mb-20 lg:mb-24 xl:mb-28 transform transition-all duration-1000 ${
            isAnimated("benefits")
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              Why Choose <span className="text-emerald-400">HelpMeMake</span>?
            </h3>
            <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              We're not just another platform. We're your partner in building
              something amazing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${
                  benefit.bgColor
                } backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-500 group hover:scale-105 hover:shadow-2xl transform shadow-lg ${
                  isAnimated("benefits")
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {benefit.icon}
                </div>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3 sm:mb-4 leading-tight">
                  {benefit.title}
                </h4>
                <p className="text-white/80 text-base sm:text-lg md:text-xl leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div
          id="stats"
          data-animate
          className={`mb-10 sm:mb-12 lg:mb-16 px-3 transform transition-all duration-1000 ${
            isAnimated("stats")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-r ${
                    stat.bgColor
                  } backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:scale-110 ${
                    isAnimated("stats")
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  {/* Icon container */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r ${stat.iconColor} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md hover:scale-110 transition-transform duration-300 text-white`}
                  >
                    {stat.icon}
                  </div>

                  {/* Number */}
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight text-center">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-white/80 text-sm sm:text-base md:text-lg font-medium text-center">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div
          id="cta"
          data-animate
          className={`text-center px-3 transform transition-all duration-1000 ${
            isAnimated("cta")
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-snug tracking-tight">
              Ready to Build Something Amazing?
            </h3>

            {/* Paragraph */}
            <p className="text-white/80 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of builders who've transformed their ideas into
              reality with expert mentorship.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center max-w-xl mx-auto">
              {/* Primary CTA */}
              <button
                onClick={() => navigate("/signup")}
                className="group relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* Secondary CTA */}
              <button className="group border-2 border-white/30 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm shadow-md">
                <MessageSquare className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) rotate(15deg); 
            opacity: 0.6;
          }
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

       
        @media (max-width: 640px) {
          .leading-tight {
            line-height: 1.15;
          }
          
          .tracking-tight {
            letter-spacing: -0.025em;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .leading-tight {
            line-height: 1.1;
          }
          
          .tracking-tight {
            letter-spacing: -0.05em;
          }
        }

        @media (min-width: 1025px) {
          .leading-tight {
            line-height: 1.05;
          }
          
          .tracking-tight {
            letter-spacing: -0.075em;
          }
        }

       
        html {
          scroll-behavior: smooth;
        }

       
        @media (max-width: 768px) {
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }
        }

       
        @supports (backdrop-filter: blur(0)) {
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }
          
          .backdrop-blur-xl {
            backdrop-filter: blur(24px);
          }
        }

       
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #2563eb);
        }

       
        button:focus-visible,
        .cursor-pointer:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }

       
        .animate-pulse,
        .animate-bounce {
          will-change: transform, opacity;
        }

       
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

       
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25), 
                      0 0 0 1px rgba(255, 255, 255, 0.1);
        }

       
        @media (max-width: 480px) {
          .max-w-7xl {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

       
        button:active {
          transform: scale(0.98);
        }

       
        .text-white\/90 {
          color: rgba(255, 255, 255, 0.95);
        }

        .text-white\/80 {
          color: rgba(255, 255, 255, 0.85);
        }

        .text-white\/70 {
          color: rgba(255, 255, 255, 0.75);
        }

       
        .rounded-4xl {
          border-radius: 2rem;
        }

        @media (min-width: 640px) {
          .sm\\:rounded-4xl {
            border-radius: 2.5rem;
          }
        }

       
        * {
          box-sizing: border-box;
        }

        img, video {
          max-width: 100%;
          height: auto;
        }

       
        @media (hover: none) and (pointer: coarse) {
          button,
          .cursor-pointer {
            min-height: 48px;
            min-width: 48px;
          }
        }
          .scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}


@media (max-width: 380px) {
  .flex.items-center.space-x-1 {
    padding: 0 8px;
    justify-content: flex-start;
  }
}
      `}</style>
    </section>
  );
};

export default HowItWorks;
