import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 1,
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />,
      title: "Tell Us What You Need",
      subtitle: "Your goals, your way",
      description:
        "Quickly fill out a short form outlining your project idea, tech stack preferences, timeline, and the type of mentor you're looking for — whether it's for guidance, debugging, architecture, or learning.",
      subtext: "No idea is too small — we match curiosity with experience.",
      color: "from-emerald-500 to-blue-500",
      bgColor: "from-emerald-500/20 to-blue-500/20",
      features: [
        "Project scope definition",
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
      title: "Smart Matching with the Right Mentor",
      subtitle: "Let AI do the hard work",
      description:
        "Our intelligent matchmaking engine connects you with the best-fit mentor based on skills, availability, past reviews, and compatibility.",
      subtext:
        "No endless browsing. Just instant, personalized mentor matches.",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      features: [
        "AI-powered matching",
        "Skill compatibility",
        "Availability sync",
        "Review-based selection",
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
      title: "Build Together, Live & Interactive",
      subtitle: "Real-time collaboration, just like pair programming",
      description:
        "Work with your mentor via 1-on-1 video calls, interactive code sharing, real-time chat, and screen sharing & walkthroughs.",
      subtext:
        "Debug faster, build smarter, and grow your skills while working on your project.",
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
        "Once your session is complete and you're satisfied, pay securely through our trusted gateway. No upfront fees. Transparent pricing.",
      subtext: "Your success is the currency. No results? No payment.",
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
        "Every mentorship adds value: Portfolio-ready project output, new skills + tools learned, and a trusted mentor you can rebook.",
      subtext: "You're not just finishing a task — you're building a future.",
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
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Instant Matching",
      description: "Get matched with the perfect mentor in minutes",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Quality Assured",
      description: "99% satisfaction rate with money-back guarantee",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Community Driven",
      description: "Join a thriving community of learners and builders",
      color: "from-emerald-500 to-green-500",
    },
  ];

  const stats = [
    {
      number: "500+",
      label: "Expert Mentors",
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      number: "1.2k+",
      label: "Success Stories",
      icon: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      number: "99%",
      label: "Satisfaction Rate",
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      number: "24/7",
      label: "Support Available",
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative min-h-screen py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Background matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Static floating elements */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse animation-delay-1500"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Simple & Effective Process
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Get started with{" "}
            <span className="text-emerald-400 font-semibold">HelpMeMake</span>{" "}
            in five simple steps and transform your ideas into reality.
          </p>
        </div>

        {/* Interactive Step Process */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          {/* Progress Bar */}
          <div className="flex justify-center mb-8 sm:mb-12 px-4">
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto pb-4 max-w-full">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-500 hover:scale-110 ${
                      index <= activeStep
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 border-emerald-500 text-white shadow-lg"
                        : "border-white/30 text-white/50 hover:border-white/50"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {index < activeStep ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="font-semibold text-sm sm:text-base">
                        {step.id}
                      </span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 sm:w-8 md:w-16 h-0.5 transition-all duration-500 ${
                        index < activeStep
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500"
                          : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Display */}
          <div className="max-w-6xl mx-auto px-2 sm:px-0">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 border border-white/20 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                {/* Step Content */}
                <div className="order-2 lg:order-1">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r ${steps[activeStep].bgColor} text-white border border-white/20 backdrop-blur-sm mb-4 sm:mb-6`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${steps[activeStep].color} mr-2 animate-pulse`}
                    ></span>
                    Step {steps[activeStep].id} of 5
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {steps[activeStep].title}
                  </h3>

                  <p className="text-emerald-300 text-base sm:text-lg font-medium mb-4 sm:mb-6">
                    {steps[activeStep].subtitle}
                  </p>

                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                    {steps[activeStep].description}
                  </p>

                  <p className="text-white/70 italic text-sm sm:text-base mb-6 sm:mb-8">
                    {steps[activeStep].subtext}
                  </p>

                  {/* Process Details */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {steps[activeStep].processDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 text-white/90 text-sm sm:text-base"
                      >
                        <div
                          className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${steps[activeStep].bgColor} flex-shrink-0`}
                        >
                          {detail.icon}
                        </div>
                        <span className="flex-1">{detail.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {steps[activeStep].features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-white/80 text-sm"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                        <span className="flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="order-1 lg:order-2">
                  <div className="relative">
                    {/* Main Visual Container */}
                    <div
                      className={`relative bg-gradient-to-r ${steps[activeStep].bgColor} backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105`}
                    >
                      {/* Icon Display */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-r ${steps[activeStep].color} flex items-center justify-center mb-4 sm:mb-6 mx-auto text-white shadow-lg`}
                      >
                        {steps[activeStep].icon}
                      </div>

                      {/* Step-specific Visual Content */}
                      {activeStep === 0 && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400 rounded-full"></div>
                              <span className="text-white text-xs sm:text-sm">
                                Project Details
                              </span>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="h-1.5 sm:h-2 bg-white/20 rounded w-3/4"></div>
                              <div className="h-1.5 sm:h-2 bg-white/20 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4 border border-white/20">
                            <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                              <span className="text-white text-xs sm:text-sm">
                                Tech Stack
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                                React
                              </div>
                              <div className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                                Node.js
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 1 && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="text-center">
                            <div className="flex justify-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center"
                                >
                                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                              ))}
                            </div>
                            <div className="text-white text-xs sm:text-sm mb-2">
                              AI Matching...
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 sm:h-2 rounded-full animate-pulse"
                                style={{ width: "75%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 2 && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="bg-black/40 rounded-lg p-3 sm:p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs sm:text-sm">
                                  Live Session
                                </span>
                              </div>
                              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white/20 rounded p-2 sm:p-3 text-center">
                                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1" />
                                <div className="text-xs text-white">
                                  Code Share
                                </div>
                              </div>
                              <div className="bg-white/20 rounded p-2 sm:p-3 text-center">
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1" />
                                <div className="text-xs text-white">Chat</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 3 && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="text-center">
                            <div className="text-white text-xs sm:text-sm mb-3 sm:mb-4">
                              Session Complete!
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                              <div className="flex items-center justify-between bg-white/10 rounded p-2 sm:p-3">
                                <span className="text-white text-xs sm:text-sm">
                                  Session Quality
                                </span>
                                <div className="flex space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="bg-emerald-500/20 rounded p-2 sm:p-3 border border-emerald-500/30">
                                <div className="text-emerald-300 text-xs sm:text-sm text-center">
                                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                                  Secure Payment Gateway
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStep === 4 && (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center border border-white/20">
                              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1 sm:mb-2" />
                              <div className="text-xs text-white">
                                Portfolio
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center border border-white/20">
                              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1 sm:mb-2" />
                              <div className="text-xs text-white">Skills</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center border border-white/20">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1 sm:mb-2" />
                              <div className="text-xs text-white">Network</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center border border-white/20">
                              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white mx-auto mb-1 sm:mb-2" />
                              <div className="text-xs text-white">Growth</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Floating Action Button */}
                    <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Why Choose <span className="text-emerald-400">HelpMeMake</span>?
            </h3>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
              We're not just another platform. We're your partner in building
              something amazing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300 group hover:scale-105"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {benefit.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-white/80 text-sm sm:text-base">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20 px-4">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center px-4">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of builders who've transformed their ideas into
              reality with expert mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
              <button className="group relative bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center text-sm sm:text-base">
                  Start Your Journey
                  <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group border-2 border-white/30 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <MessageSquare className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm sm:text-base">Talk to Our Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
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

        /* Enhanced typography */
        @media (max-width: 640px) {
          .leading-tight {
            line-height: 1.15;
          }
        }

        /* Smooth scrolling behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Better touch targets for mobile */
        @media (max-width: 768px) {
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
