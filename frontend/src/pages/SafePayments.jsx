import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, Quote, DollarSign, Lock, Users, Star } from 'lucide-react';
import StepCard from '../components/StepCard';
import ConnectingLine from '../components/ConnectingLine';

const SafePayments = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setStepsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Fund Escrow Securely",
      description: "Your payment is held safely in escrow until the work is completed to your satisfaction. No upfront risks.",
      icon: Shield
    },
    {
      title: "Sessions are Time-Tracked",
      description: "Every mentoring session is automatically tracked and logged, ensuring transparency and accurate billing.",
      icon: Clock
    },
    {
      title: "Release Payment After Work is Done",
      description: "Once you approve the completed work, payment is instantly released to your mentor. Simple and secure.",
      icon: CheckCircle
    }
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Seamless Background - Matching LiveCollabPage */}
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
              <Lock className="w-4 h-4 mr-2" />
              Escrow-Backed Security
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Safe Payments, Guaranteed Results
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Our escrow system protects both mentors and students, ensuring fair payment and quality work every time.
          </p>
        </div>

        {/* Steps Container */}
        <div className="mb-16">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-center space-x-8">
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

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
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

        {/* Testimonial Quote */}
        <div className={`max-w-4xl mx-auto transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            {/* Quote icon */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <Quote className="w-6 h-6 text-white" />
            </div>

            {/* Quote content */}
            <div className="text-center">
              <blockquote className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
                "I built my first project without worrying about getting scammed."
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">Sarah Chen</p>
                  <p className="text-white/70 text-sm">Full-Stack Developer</p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Additional Security Features */}
        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
          <div className="bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No Hidden Fees</h3>
            <p className="text-white/70 text-sm">Transparent pricing with no surprise charges or hidden costs.</p>
          </div>

          <div className="bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Dispute Resolution</h3>
            <p className="text-white/70 text-sm">Fair and quick resolution process for any payment disputes.</p>
          </div>

          <div className="bg-gradient-to-r from-white/5 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center hover:border-emerald-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Bank-Level Security</h3>
            <p className="text-white/70 text-sm">256-bit SSL encryption and secure payment processing.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
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

export default SafePayments;