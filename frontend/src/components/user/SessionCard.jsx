import React from "react";
import {
  MessageCircle,
  Clock,
  Calendar,
  Video,
  Phone,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";

const SessionCard = ({
  mentorName,
  mentorImage,
  sessionTitle,
  date,
  time,
  duration,
  status,
  statusColor,
}) => {
  // Enhanced status styling
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="group relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] hover:bg-white/15">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Mobile-first layout: Stack vertically on small screens */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          {/* Top section - Mentor info and status */}
          <div className="flex items-start justify-between sm:flex-1">
            {/* Left side - Mentor info */}
            <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
              {/* Mentor image with glow */}
              <div className="relative flex-shrink-0">
                <img
                  src={mentorImage}
                  alt={mentorName}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:border-white/40 transition-all duration-300"
                />
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white/50 animate-pulse"></div>
                {/* Subtle glow around image */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Session details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between sm:items-center sm:space-x-2 mb-1">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-blue-200 transition-colors duration-200 truncate">
                      {mentorName}
                    </h3>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-xs text-yellow-300">4.9</span>
                    </div>
                  </div>

                  {/* Status badge - moved to top right on mobile */}
                  <span
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                      status
                    )} backdrop-blur-sm flex-shrink-0 sm:hidden`}
                  >
                    {status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-blue-200 mb-2 sm:mb-3 group-hover:text-blue-100 transition-colors duration-200 line-clamp-2">
                  {sessionTitle}
                </p>

                {/* Session metadata - responsive grid */}
                <div className="grid grid-cols-1 gap-1 sm:flex sm:items-center sm:space-x-4 sm:gap-0 text-xs">
                  <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                    <Calendar size={12} className="flex-shrink-0" />
                    <span className="truncate">{date}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                    <Clock size={12} className="flex-shrink-0" />
                    <span className="truncate">{time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span className="truncate">{duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Status and actions for larger screens */}
          <div className="hidden sm:flex sm:flex-col sm:items-end sm:space-y-3 sm:ml-4">
            {/* Status badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                status
              )} backdrop-blur-sm`}
            >
              {status}
            </span>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn">
                <Video
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 group/btn">
                <Phone
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn">
                <MessageCircle
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Session actions bar */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center justify-between sm:justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald-300">Ready to join</span>
            </div>

            <button className="flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 group/arrow sm:hidden">
              <span>View Details</span>
              <ChevronRight
                size={12}
                className="group-hover/arrow:translate-x-1 transition-transform duration-200"
              />
            </button>
          </div>

          {/* Mobile action buttons */}
          <div className="flex items-center justify-between sm:hidden">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-300 transition-all duration-200 group/btn">
                <Video
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200 group/btn">
                <Phone
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
              <button className="p-2 rounded-xl bg-white/10 border border-white/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 group/btn">
                <MessageCircle
                  size={16}
                  className="group-hover/btn:scale-110 transition-transform duration-200"
                />
              </button>
            </div>
          </div>

          {/* Desktop view details button */}
          <button className="hidden sm:flex items-center space-x-1 text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200 group/arrow">
            <span>View Details</span>
            <ChevronRight
              size={12}
              className="group-hover/arrow:translate-x-1 transition-transform duration-200"
            />
          </button>
        </div>
      </div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
    </div>
  );
};

// Demo component to show the responsive behavior
const Demo = () => {
  const sampleSession = {
    mentorName: "Dracule Mihawk",
    mentorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sessionTitle: "Advanced Sword Techniques and Combat Strategies",
    date: "Today",
    time: "3:00 PM",
    duration: "1 hour",
    status: "confirmed",
    statusColor: "bg-emerald-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Responsive SessionCard Component
          </h1>
          <p className="text-blue-200">
            Resize your screen to see how it adapts!
          </p>
        </div>

        {/* Multiple cards to show responsiveness */}
        <div className="space-y-4">
          <SessionCard {...sampleSession} />
          <SessionCard
            {...sampleSession}
            mentorName="Nico Robin"
            mentorImage="https://images.unsplash.com/photo-1494790108755-2616b45e1b5e?w=150&h=150&fit=crop&crop=face"
            sessionTitle="Ancient History Research Methods"
            date="Tomorrow"
            time="10:00 AM"
            duration="2 hours"
            status="pending"
          />
          <SessionCard
            {...sampleSession}
            mentorName="Silvers Rayleigh"
            mentorImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            sessionTitle="Haki Training Fundamentals"
            date="Dec 22"
            time="2:00 PM"
            duration="3 hours"
            status="completed"
          />
        </div>

        {/* Responsive info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-white">
          <h2 className="text-xl font-bold mb-4">Responsive Features:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">{`Mobile (< 640px):`}</h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Vertical stack layout</li>
                <li>• Status badge in top right</li>
                <li>• Actions moved to bottom</li>
                <li>• Smaller avatar and text</li>
                <li>• Metadata in vertical grid</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">
                Desktop (≥ 640px):
              </h3>
              <ul className="space-y-1 text-blue-100">
                <li>• Horizontal layout</li>
                <li>• Status badge in top right</li>
                <li>• Actions in sidebar</li>
                <li>• Full-size elements</li>
                <li>• Metadata in horizontal row</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
