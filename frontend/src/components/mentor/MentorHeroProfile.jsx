import React from "react";
import {
  Linkedin,
  Github,
  Twitter,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Users,
  Clock,
  Target,
} from "lucide-react";

const MentorHeroProfile = ({ mentor }) => {
  const {
    name = "Sensei Mentor",
    title = "Expert Code Instructor",
    description = "Guiding future developers with expertise and passion!",
    profileImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isOnline = true,
    rating = 4.9,
    totalReviews = 124,
    location = "Remote",
    joinDate = "January 2023",
    socialLinks = {
      linkedin: "#",
      github: "#",
      twitter: "#",
    },
    stats = {
      totalStudents: 156,
      completedSessions: 340,
      responseTime: 15,
    },
  } = mentor || {};

  return (
    <div className="bg-gradient-to-r from-slate-600/30 via-cyan-600/30 to-teal-600/30 backdrop-blur-sm rounded-3xl p-6 lg:p-8 text-white border border-white/20 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-slate-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-28 h-28 lg:w-36 lg:h-36 rounded-full border-4 border-white/30 shadow-2xl transform group-hover:scale-105 transition-all duration-300"
              />

              {isOnline && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white/50 animate-pulse shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                </div>
              )}

              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-400 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                MENTOR
              </div>
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent leading-tight">
                {name}
              </h1>
              <div className="flex items-center justify-center lg:justify-start space-x-2 mt-2">
                <Trophy className="text-cyan-400" size={20} />
                <p className="text-lg lg:text-xl text-slate-200 font-medium">
                  {title}
                </p>
              </div>
            </div>

            <p className="text-sm lg:text-base text-slate-300 max-w-2xl leading-relaxed">
              {description}
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20 max-w-md mx-auto lg:mx-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-cyan-200">
                  Mentor Rating
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400 fill-current" size={14} />
                  <span className="text-xs font-bold text-cyan-200">
                    {rating} ({totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-teal-400 to-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${(rating / 5) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-1">
                  <Users className="text-cyan-400" size={16} />
                  <span className="text-lg font-bold text-cyan-400 ml-1">
                    {stats.totalStudents}
                  </span>
                </div>
                <div className="text-xs text-gray-300">Students</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-1">
                  <Target className="text-teal-400" size={16} />
                  <span className="text-lg font-bold text-teal-400 ml-1">
                    {stats.completedSessions}
                  </span>
                </div>
                <div className="text-xs text-gray-300">Sessions</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="text-slate-400" size={16} />
                  <span className="text-lg font-bold text-slate-400 ml-1">
                    {stats.responseTime}min
                  </span>
                </div>
                <div className="text-xs text-gray-300">Response</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-lg font-bold text-yellow-400 mb-1">
                  {rating}⭐
                </div>
                <div className="text-xs text-gray-300">Rating</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-4 pt-2">
              <a
                href={socialLinks.linkedin}
                className="text-white hover:text-slate-200 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={socialLinks.github}
                className="text-white hover:text-gray-200 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Github size={20} />
              </a>
              <a
                href={socialLinks.twitter}
                className="text-white hover:text-slate-200 transition-all duration-300 transform hover:scale-125 hover:rotate-12 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHeroProfile;
