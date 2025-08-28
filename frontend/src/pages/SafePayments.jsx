import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Clock,
  CheckCircle,
  Quote,
  DollarSign,
  Lock,
  Users,
  Star,
} from "lucide-react";

// Enhanced StepCard Component
const StepCard = ({
  step,
  title,
  description,
  icon: Icon,
  isActive,
  delay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group transform transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${isInView ? "scale-100" : "scale-95"}`}
      style={{ transitionDelay: isInView ? "0ms" : `${delay}ms` }}
    >
      <div
        className={`relative backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 ${
          step === 1
            ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/30 group-hover:border-emerald-400/60"
            : step === 2
            ? "bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30 group-hover:border-blue-400/60"
            : "bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 group-hover:border-purple-400/60"
        }`}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10"></div>

        <div className="absolute inset-0 rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-300 to-blue-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-2xl"></div>
        </div>

        <div
          className={`absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-xl group-hover:scale-110 transition-transform duration-500 ${
            step === 1
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
              : step === 2
              ? "bg-gradient-to-r from-blue-600 to-blue-500"
              : "bg-gradient-to-r from-purple-600 to-purple-500"
          }`}
        >
          <span className="relative z-10">{step}</span>
          <div
            className={`absolute inset-0 rounded-full animate-pulse opacity-50 ${
              step === 1
                ? "bg-gradient-to-r from-emerald-400 to-emerald-300"
                : step === 2
                ? "bg-gradient-to-r from-blue-400 to-blue-300"
                : "bg-gradient-to-r from-purple-400 to-purple-300"
            }`}
          ></div>
        </div>

        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden ${
            step === 1
              ? "bg-gradient-to-br from-emerald-500/25 to-emerald-600/15"
              : step === 2
              ? "bg-gradient-to-br from-blue-500/25 to-blue-600/15"
              : "bg-gradient-to-br from-purple-500/25 to-purple-600/15"
          }`}
        >
          <Icon
            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-colors duration-300 relative z-10 ${
              step === 1
                ? "text-emerald-400 group-hover:text-emerald-300"
                : step === 2
                ? "text-blue-400 group-hover:text-blue-300"
                : "text-purple-400 group-hover:text-purple-300"
            }`}
          />
          <div
            className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              step === 1
                ? "bg-gradient-to-r from-emerald-400/20 to-emerald-500/15"
                : step === 2
                ? "bg-gradient-to-r from-blue-400/20 to-blue-500/15"
                : "bg-gradient-to-r from-purple-400/20 to-purple-500/15"
            }`}
          ></div>
        </div>

        <h3
          className={`text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 transition-colors duration-300 leading-tight ${
            step === 1
              ? "group-hover:text-emerald-200"
              : step === 2
              ? "group-hover:text-blue-200"
              : "group-hover:text-purple-200"
          }`}
        >
          {title}
        </h3>
        <p className="text-white/80 group-hover:text-white/90 leading-relaxed text-sm sm:text-base lg:text-lg transition-colors duration-300">
          {description}
        </p>

        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-500/40 transition-all duration-700">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
        </div>

        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 ${
            step === 1
              ? "bg-emerald-400"
              : step === 2
              ? "bg-blue-400"
              : "bg-purple-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-4 left-4 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 ${
            step === 1
              ? "bg-emerald-300"
              : step === 2
              ? "bg-blue-300"
              : "bg-purple-300"
          }`}
          style={{ transitionDelay: "100ms" }}
        ></div>
      </div>
    </div>
  );
};

// Enhanced ConnectingLine Component
const ConnectingLine = ({ isVertical, index, isVisible }) => {
  const [isInView, setIsInView] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const lineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setTimeout(() => setAnimationPhase(1), 200);
            setTimeout(() => setAnimationPhase(2), 600);
            setTimeout(() => setAnimationPhase(3), 1000);
          } else {
            setAnimationPhase(0);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-20px 0px",
      }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => {
      if (lineRef.current) {
        observer.unobserve(lineRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={lineRef}
      className={`relative flex items-center justify-center transition-all duration-1000 ${
        isVertical
          ? "h-16 sm:h-20 lg:h-24 w-full"
          : "w-16 sm:w-20 lg:w-24 h-full"
      }`}
    >
      <div
        className={`relative bg-gradient-to-r from-emerald-500/60 via-blue-500/80 to-purple-500/60 transition-all duration-1200 ease-out ${
          isVertical ? "w-1" : "h-1"
        } ${
          isVisible && isInView
            ? isVertical
              ? "h-16 sm:h-20 lg:h-24"
              : "w-16 sm:w-20 lg:w-24"
            : isVertical
            ? "h-0"
            : "w-0"
        } shadow-lg`}
        style={{ transitionDelay: `${index * 300}ms` }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent ${
            isVertical ? "animate-pulse" : "animate-pulse"
          } opacity-${
            animationPhase > 0 ? "100" : "0"
          } transition-opacity duration-500`}
        ></div>
      </div>

      <div
        className={`absolute ${
          isVertical ? "top-0" : "left-0"
        } transition-all duration-700 ${
          animationPhase > 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <div className="relative w-3 h-3 sm:w-4 sm:h-4">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      <div
        className={`absolute ${
          isVertical ? "bottom-0" : "right-0"
        } transition-all duration-700 ${
          animationPhase > 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        <div className="relative w-3 h-3 sm:w-4 sm:h-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      <div
        className={`absolute ${
          isVertical ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2"
        } transition-all duration-700 ${
          animationPhase > 2 ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <div className="relative w-2 h-2 sm:w-3 sm:h-3">
          <div className="absolute inset-0 bg-gradient-to-r from-white to-emerald-200 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute inset-0 bg-white/50 rounded-full animate-ping"></div>
        </div>
      </div>

      <div
        className={`absolute ${
          isVertical
            ? "top-0 left-1/2 -translate-x-1/2 w-1 h-full"
            : "left-0 top-1/2 -translate-y-1/2 h-1 w-full"
        } bg-gradient-to-${
          isVertical ? "b" : "r"
        } from-transparent via-white/40 to-transparent transition-all duration-1000 ${
          animationPhase > 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`absolute ${
            isVertical
              ? "w-full h-4 animate-bounce"
              : "h-full w-4 animate-bounce"
          } bg-gradient-to-${
            isVertical ? "b" : "r"
          } from-emerald-400/60 to-blue-400/60 blur-sm`}
        ></div>
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/30 to-purple-500/20 rounded-full blur-lg transition-all duration-1000 ${
          isInView ? "opacity-60 scale-150" : "opacity-0 scale-100"
        }`}
        style={{ transitionDelay: `${index * 200}ms` }}
      ></div>
    </div>
  );
};

const SafePayments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerInView, setHeaderInView] = useState(false);
  const [testimonialInView, setTestimonialInView] = useState(false);
  const [featuresInView, setFeaturesInView] = useState(false);

  const headerRef = useRef(null);
  const testimonialRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setStepsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === headerRef.current) {
          setHeaderInView(entry.isIntersecting);
        } else if (entry.target === testimonialRef.current) {
          setTestimonialInView(entry.isIntersecting);
        } else if (entry.target === featuresRef.current) {
          setFeaturesInView(entry.isIntersecting);
        }
      });
    }, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (testimonialRef.current) observer.observe(testimonialRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      title: "Fund Escrow Securely",
      description:
        "Your payment is held safely in escrow until the work is completed to your satisfaction. No upfront risks.",
      icon: Shield,
    },
    {
      title: "Sessions are Time-Tracked",
      description:
        "Every mentoring session is automatically tracked and logged, ensuring transparency and accurate billing.",
      icon: Clock,
    },
    {
      title: "Release Payment After Work is Done",
      description:
        "Once you approve the completed work, payment is instantly released to your mentor. Simple and secure.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="relative min-h-screen py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Enhanced Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Enhanced floating elements with parallax */}
        <div
          className="absolute top-20 left-10 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="absolute top-40 right-20 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-28 sm:w-36 lg:w-44 h-28 sm:h-36 lg:h-44 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-500"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-20 sm:w-28 lg:w-32 h-20 sm:h-28 lg:h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-1500"
          style={{ transform: `translateY(${scrollY * -0.12}px)` }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-16 sm:w-24 lg:w-28 h-16 sm:h-24 lg:h-28 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div
          className="absolute top-10 left-1/2 w-12 sm:w-20 lg:w-24 h-12 sm:h-20 lg:h-24 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-750"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>

        {/* Enhanced animated particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
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
                transform: `translateY(${
                  scrollY * (0.02 + Math.random() * 0.08)
                }px)`,
              }}
            />
          ))}
        </div>

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-slate-900/30"></div> */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1200 ease-out ${
            headerInView
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-95"
          }`}
        >
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-lg">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
              Escrow-Backed Security
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Safe Payments,
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Guaranteed Results
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
            Our escrow system protects both mentors and students, ensuring fair
            payment and quality work every time.
          </p>
        </div>

        {/* Enhanced Steps Container */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  isActive={stepsVisible}
                  delay={index * 200}
                />
                {index < steps.length - 1 && (
                  <ConnectingLine
                    isVertical={false}
                    index={index}
                    isVisible={stepsVisible}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tablet Layout */}
          <div className="hidden md:flex lg:hidden flex-col items-center space-y-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  isActive={stepsVisible}
                  delay={index * 200}
                />
                {index < steps.length - 1 && (
                  <ConnectingLine
                    isVertical={true}
                    index={index}
                    isVisible={stepsVisible}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  isActive={stepsVisible}
                  delay={index * 200}
                />
                {index < steps.length - 1 && (
                  <ConnectingLine
                    isVertical={true}
                    index={index}
                    isVisible={stepsVisible}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Enhanced Testimonial Quote */}
        <div
          ref={testimonialRef}
          className={`max-w-5xl mx-auto mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1200 ease-out ${
            testimonialInView
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-95"
          }`}
        >
          <div className="relative bg-gradient-to-br from-indigo-900/25 to-indigo-800/15 backdrop-blur-xl rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 border border-indigo-500/30 shadow-2xl hover:shadow-3xl transition-all duration-700 group hover:border-indigo-400/50">
            {/* Enhanced quote icon */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-300 rounded-full opacity-50"></div> */}
            </div>

            {/* Enhanced quote content */}
            <div className="text-center">
              <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-6 sm:mb-8 leading-relaxed">
                "I built my first project without worrying about getting
                <span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                  {" "}
                  scammed
                </span>
                ."
              </blockquote>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500/25 to-indigo-600/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white font-semibold text-lg sm:text-xl">
                    Ichigo Kurosaki
                  </p>
                  <p className="text-white/70 text-sm sm:text-base">
                    Full-Stack Developer
                  </p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute top-4 right-4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-gradient-to-r from-indigo-500/15 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-4 left-4 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-gradient-to-r from-indigo-400/10 to-indigo-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-3xl sm:rounded-4xl border-2 border-transparent group-hover:border-indigo-500/40 transition-all duration-700"></div>
          </div>
        </div>

        {/* Enhanced Additional Security Features */}
        <div
          ref={featuresRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 transform transition-all duration-1200 ease-out ${
            featuresInView
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {[
            {
              icon: DollarSign,
              title: "No Hidden Fees",
              description:
                "Transparent pricing with no surprise charges or hidden costs.",
              delay: "0ms",
              colorScheme: "orange",
            },
            {
              icon: Shield,
              title: "Dispute Resolution",
              description:
                "Fair and quick resolution process for any payment disputes.",
              delay: "200ms",
              colorScheme: "violet",
            },
            {
              icon: Lock,
              title: "Bank-Level Security",
              description:
                "256-bit SSL encryption and secure payment processing.",
              delay: "400ms",
              colorScheme: "lime",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border text-center transition-all duration-500 group hover:scale-105 hover:shadow-2xl ${
                feature.colorScheme === "orange"
                  ? "bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/25 hover:border-orange-400/50"
                  : feature.colorScheme === "violet"
                  ? "bg-gradient-to-br from-violet-900/20 to-violet-800/10 border-violet-500/25 hover:border-violet-400/50"
                  : "bg-gradient-to-br from-lime-900/20 to-lime-800/10 border-lime-500/25 hover:border-lime-400/50"
              }`}
              style={{
                transitionDelay: featuresInView ? feature.delay : "0ms",
                transform: featuresInView
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden ${
                  feature.colorScheme === "orange"
                    ? "bg-gradient-to-br from-orange-500/25 to-orange-600/15"
                    : feature.colorScheme === "violet"
                    ? "bg-gradient-to-br from-violet-500/25 to-violet-600/15"
                    : "bg-gradient-to-br from-lime-500/25 to-lime-600/15"
                }`}
              >
                <feature.icon
                  className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-colors duration-300 relative z-10 ${
                    feature.colorScheme === "orange"
                      ? "text-orange-400 group-hover:text-orange-300"
                      : feature.colorScheme === "violet"
                      ? "text-violet-400 group-hover:text-violet-300"
                      : "text-lime-400 group-hover:text-lime-300"
                  }`}
                />
                <div
                  className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    feature.colorScheme === "orange"
                      ? "bg-gradient-to-r from-orange-400/20 to-orange-500/15"
                      : feature.colorScheme === "violet"
                      ? "bg-gradient-to-r from-violet-400/20 to-violet-500/15"
                      : "bg-gradient-to-r from-lime-400/20 to-lime-500/15"
                  }`}
                ></div>
              </div>
              <h3
                className={`text-white font-semibold mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl transition-colors duration-300 ${
                  feature.colorScheme === "orange"
                    ? "group-hover:text-orange-200"
                    : feature.colorScheme === "violet"
                    ? "group-hover:text-violet-200"
                    : "group-hover:text-lime-200"
                }`}
              >
                {feature.title}
              </h3>
              <p className="text-white/70 group-hover:text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover effect elements */}
              <div
                className={`absolute top-3 right-3 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 ${
                  feature.colorScheme === "orange"
                    ? "bg-orange-400"
                    : feature.colorScheme === "teal"
                    ? "bg-teal-400"
                    : "bg-rose-400"
                }`}
              ></div>
              <div
                className={`absolute bottom-3 left-3 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 ${
                  feature.colorScheme === "orange"
                    ? "bg-orange-300"
                    : feature.colorScheme === "teal"
                    ? "bg-teal-300"
                    : "bg-rose-300"
                }`}
                style={{ transitionDelay: "100ms" }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        
        .rounded-4xl { border-radius: 2rem; }
        
        /* Custom scrollbar for better UX */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #2563eb);
        }
        
        /* Smooth focus styles */
        *:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default SafePayments;
