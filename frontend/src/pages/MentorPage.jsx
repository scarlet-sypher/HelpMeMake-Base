import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Users, Sparkles, Code, Brain, Heart, Star } from 'lucide-react';
import MentorCard from '../components/MentorCard';

import { importAllMentorImages } from '../utils/importAllMentorImages';
const mentorImages = importAllMentorImages();


const MentorPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
    checkScrollButtons();
  }, []);

  const mentors = [
    {
      id: 1,
      name: "Jiraiya",
      specialty: "Full-Stack Developer",
      image: mentorImages['jiraiya.jpg'], 
      rating: 5,
      reviews: 127,
      rate: 65,
      techStack: ["React", "Node.js", "Python"],
      testimonial: "Sarah helped me build my first full-stack app in just 3 sessions!"
    },
    {
      id: 2,
      name: "Eren Yeager",
      specialty: "AI/ML Engineer",
      image: mentorImages['eren.jpg'], 
      rating: 5,
      reviews: 89,
      rate: 80,
      techStack: ["Python", "TensorFlow", "PyTorch"],
      testimonial: "Amazing mentor who simplified complex ML concepts for me."
    },
    {
      id: 3,
      name: "L",
      specialty: "Mobile Developer",
      image: mentorImages['L.jpg'], 
      rating: 5,
      reviews: 156,
      rate: 70,
      techStack: ["React Native", "Flutter", "Swift"],
      testimonial: "Emily's guidance helped me launch my first mobile app!"
    },
    {
      id: 4,
      name: "Peter Parker",
      specialty: "DevOps Engineer",
      image: mentorImages['spidey.jpg'], 
      rating: 5,
      reviews: 94,
      rate: 75,
      techStack: ["AWS", "Docker", "Kubernetes"],
      testimonial: "David taught me DevOps best practices that transformed my workflow."
    },
    {
      id: 5,
      name: "Rengoku",
      specialty: "UI/UX Designer",
      image: mentorImages['rengoku.jpg'], 
      rating: 5,
      reviews: 203,
      rate: 60,
      techStack: ["Figma", "Adobe XD", "Sketch"],
      testimonial: "Maria's design insights elevated my project's user experience."
    },
    {
      id: 6,
      name: "Izuku Midoriya",
      specialty: "Blockchain Developer",
      image: mentorImages['deku.jpg'], 
      rating: 5,
      reviews: 67,
      rate: 90,
      techStack: ["Solidity", "Web3.js", "Ethereum"],
      testimonial: "James made blockchain development accessible and practical."
    },
    {
      id: 7,
      name: "Minato",
      specialty: "Data Scientist",
      image: mentorImages['minato.jpg'],
      rating: 5,
      reviews: 142,
      rate: 85,
      techStack: ["Python", "R", "SQL"],
      testimonial: "Lisa's data science expertise helped me solve complex problems."
    },
    {
      id: 8,
      name: "Roronoa Zoro",
      specialty: "Backend Developer",
      image: mentorImages['zoro.jpg'], 
      rating: 5,
      reviews: 118,
      rate: 72,
      techStack: ["Java", "Spring", "PostgreSQL"],
      testimonial: "Michael's backend architecture knowledge is exceptional."
    }
  ];

  const cardsPerPage = 3;
  const totalPages = Math.ceil(mentors.length / cardsPerPage);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current page based on scroll position
      const cardWidth = 288 + 24; // card width + margin
      const newPage = Math.round(scrollLeft / (cardWidth * cardsPerPage));
      setCurrentPage(newPage);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24; // card width + margin
      const scrollAmount = cardWidth * cardsPerPage;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24; // card width + margin
      const scrollAmount = cardWidth * cardsPerPage;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollToPage = (pageIndex) => {
    if (scrollContainerRef.current) {
      const cardWidth = 288 + 24; // card width + margin
      const scrollAmount = cardWidth * cardsPerPage * pageIndex;
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const stats = [
    { number: "500+", label: "Expert Mentors", icon: <Users className="w-6 h-6" /> },
    { number: "4.9", label: "Average Rating", icon: <Star className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Heart className="w-6 h-6" /> },
    { number: "50+", label: "Tech Stacks", icon: <Code className="w-6 h-6" /> }
  ];

  return (
    <section id="mentors" className="relative min-h-screen py-20 overflow-hidden">
      {/* Seamless Background */}
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
          {[...Array(20)].map((_, i) => (
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
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              Meet Our Expert Mentors
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Learn from the Best
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Connect with industry experts who've helped thousands of developers build amazing projects and accelerate their careers.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">{stat.number}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mentor Cards Section */}
        <div className="relative">
          {/* Enhanced Navigation Buttons */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              canScrollLeft 
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 cursor-pointer' 
                : 'bg-white/20 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              canScrollRight 
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 cursor-pointer' 
                : 'bg-white/20 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth scrollbar-hide px-20 py-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={checkScrollButtons}
          >
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>

          {/* Working Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  currentPage === index 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <div className="mb-8">
              <Brain className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Don't See Your Perfect Match?
              </h3>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Our AI-powered matching system will find the perfect mentor for your specific needs and project requirements.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-10 py-4 rounded-full font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <Sparkles className="mr-3 w-5 h-5" />
                  Find My Perfect Mentor
                </span>
              </button>
              
              <button className="group border-2 border-white/30 text-white px-10 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <Users className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                Browse All Mentors
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
      `}</style>
    </section>
  );
};

export default MentorPage;