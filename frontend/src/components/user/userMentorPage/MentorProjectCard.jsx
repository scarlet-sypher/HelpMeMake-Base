import React from "react";
import {
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Github,
  Linkedin,
  Twitter,
  User,
  MessageCircle,
} from "lucide-react";

const MentorProjectCard = ({ mentorData, projectData }) => {
  const formatPrice = (price) => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return "Not specified";
    return duration;
  };

  const getActivePrice = () => {
    if (projectData?.closingPrice) return projectData.closingPrice;
    if (projectData?.negotiatedPrice) return projectData.negotiatedPrice;
    return projectData?.openingPrice;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="text-yellow-400 fill-current" size={16} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="text-yellow-400 fill-current opacity-50"
            size={16}
          />
        );
      } else {
        stars.push(<Star key={i} className="text-gray-400" size={16} />);
      }
    }
    return stars;
  };

  if (!mentorData || !projectData) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="w-20 h-20 bg-white/10 rounded-full mx-auto"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-white/10 rounded w-1/2 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded"></div>
            <div className="h-3 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="mr-2 text-blue-400" size={20} />
            Your Mentor
          </h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                mentorData.isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            ></div>
            <span
              className={`text-xs font-medium ${
                mentorData.isOnline ? "text-green-300" : "text-gray-400"
              }`}
            >
              {mentorData.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Mentor Profile */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <img
              src={
                mentorData.avatar
                  ? mentorData.avatar.startsWith("/uploads/")
                    ? `${import.meta.env.VITE_API_URL}${mentorData.avatar}`
                    : mentorData.avatar
                  : "/uploads/public/default.jpg"
              }
              alt={mentorData.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg"
            />
            {mentorData.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {mentorData.name}
          </h3>
          <p className="text-blue-200 text-sm mb-3">
            {mentorData.title || "Software Engineer"}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="flex space-x-1">
              {renderStars(mentorData.rating || 5)}
            </div>
            <span className="text-yellow-400 font-bold text-sm">
              {(mentorData.rating || 5).toFixed(1)}
            </span>
            <span className="text-gray-400 text-xs">
              ({mentorData.totalReviews || 0} reviews)
            </span>
          </div>

          {/* Location */}
          {mentorData.location && (
            <div className="flex items-center justify-center text-gray-300 text-sm">
              <MapPin size={14} className="mr-1" />
              {mentorData.location}
            </div>
          )}
        </div>

        {/* Project Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-2">
              {projectData.name}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {projectData.shortDescription}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-2">
                <DollarSign className="text-green-400 mr-2" size={16} />
                <span className="text-sm text-gray-300">Price</span>
              </div>
              <div className="text-white font-bold">
                {formatPrice(getActivePrice())}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-2">
                <Clock className="text-blue-400 mr-2" size={16} />
                <span className="text-sm text-gray-300">Duration</span>
              </div>
              <div className="text-white font-bold text-sm">
                {formatDuration(projectData.duration)}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-2">
                <Calendar className="text-purple-400 mr-2" size={16} />
                <span className="text-sm text-gray-300">Category</span>
              </div>
              <div className="text-white font-bold text-sm">
                {projectData.category}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center mb-2">
                <Award className="text-yellow-400 mr-2" size={16} />
                <span className="text-sm text-gray-300">Level</span>
              </div>
              <div className="text-white font-bold text-sm">
                {projectData.difficultyLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Stats */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-blue-400/30 mb-6">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Award className="mr-2 text-yellow-400" size={16} />
            Mentor Stats
          </h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                {mentorData.completedSessions || 0}
              </div>
              <div className="text-xs text-blue-300">Sessions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {mentorData.totalStudents || 0}
              </div>
              <div className="text-xs text-blue-300">Students</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {mentorData.responseTime || 30}min
              </div>
              <div className="text-xs text-blue-300">Response</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {mentorData.achievements || 0}
              </div>
              <div className="text-xs text-blue-300">Achievements</div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {mentorData.socialLinks && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3 text-sm">
              Connect with Mentor
            </h4>
            <div className="flex justify-center space-x-4">
              {mentorData.socialLinks.github &&
                mentorData.socialLinks.github !== "#" && (
                  <a
                    href={mentorData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Github className="text-white" size={18} />
                  </a>
                )}
              {mentorData.socialLinks.linkedin &&
                mentorData.socialLinks.linkedin !== "#" && (
                  <a
                    href={mentorData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Linkedin className="text-white" size={18} />
                  </a>
                )}
              {mentorData.socialLinks.twitter &&
                mentorData.socialLinks.twitter !== "#" && (
                  <a
                    href={mentorData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Twitter className="text-white" size={18} />
                  </a>
                )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = "/user/messages")}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <MessageCircle size={16} />
            <span>Message Mentor</span>
          </button>

          <div className="text-center">
            <span className="text-xs text-gray-400">
              Project started on{" "}
              {new Date(projectData.startDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProjectCard;
