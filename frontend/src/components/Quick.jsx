import React, { useEffect, useRef } from "react";
import {
  Calendar,
  Send,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  MessageCircle,
  Target,
} from "lucide-react";

const quickActions = [
  { label: "Schedule Session", icon: Calendar, gradient: "from-blue-500 to-cyan-400" },
  { label: "Send Message", icon: Send, gradient: "from-teal-500 to-green-400" },
  { label: "View Analytics", icon: BarChart3, gradient: "from-orange-500 to-pink-400" },
  { label: "Mentor Students", icon: Users, gradient: "from-yellow-500 to-orange-400" },
  { label: "Review Payments", icon: DollarSign, gradient: "from-green-500 to-lime-400" },
  { label: "Meeting History", icon: Clock, gradient: "from-indigo-500 to-blue-400" },
  { label: "Chat with Students", icon: MessageCircle, gradient: "from-pink-500 to-rose-400" },
  { label: "Set Goals", icon: Target, gradient: "from-purple-500 to-pink-400" },
];

const QuickActionsCarousel = () => {
  const scrollRef = useRef(null);

  // Auto-scroll (optional, comment out if using manual only)
  // useEffect(() => {
  //   const scrollContainer = scrollRef.current;
  //   let scrollAmount = 0;
  //   const speed = 0.5;

  //   const scroll = () => {
  //     if (scrollContainer) {
  //       scrollAmount += speed;
  //       scrollContainer.scrollLeft = scrollAmount;
  //       if (
  //         scrollContainer.scrollLeft >=
  //         scrollContainer.scrollWidth - scrollContainer.clientWidth
  //       ) {
  //         scrollAmount = 0;
  //       }
  //     }
  //   };

  //   const interval = setInterval(scroll, 30);
  //   return () => clearInterval(interval);
  // }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleClick = (label) => {
    alert(`You clicked on "${label}"`);
  };

  return (
    <div className="w-full relative">
      {/* Navigation Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800 shadow-md rounded-full p-2 hover:scale-110 transition"
      >
        ‹
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800 shadow-md rounded-full p-2 hover:scale-110 transition"
      >
        ›
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto no-scrollbar py-6 px-10 transition-all duration-1000"
      >
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleClick(action.label)}
              className={`flex flex-col justify-center items-center min-w-[240px] h-[140px] rounded-2xl text-white px-6 py-4 bg-gradient-to-r ${action.gradient} hover:scale-105 transform transition duration-300 shadow-lg`}
            >
              <Icon className="w-7 h-7 mb-2" />
              <span className="font-semibold text-base">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsCarousel;
