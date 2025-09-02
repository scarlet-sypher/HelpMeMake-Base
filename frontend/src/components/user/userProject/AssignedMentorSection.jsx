import React from "react";
import {
  UserCheck,
  MapPin,
  Mail,
  Star,
  Award,
  TrendingUp,
  DollarSign,
  MessageCircle,
} from "lucide-react";

const AssignedMentorSection = ({ project, API_URL, onToast }) => {
  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  const calculateNegotiatedPrice = (project) => {
    if (!project.pitches || project.pitches.length === 0) {
      return 0;
    }
    const totalPrice = project.pitches.reduce(
      (sum, pitch) => sum + pitch.price,
      0
    );
    return Math.round(totalPrice / project.pitches.length);
  };

  const handleMentorClick = () => {
    onToast?.({
      message: "Mentor profile view feature coming soon!",
      status: "info",
    });
  };

  if (!project.mentorId) {
    return null;
  }

  const mentor = project.mentorId;
  const finalPrice = project.closingPrice || calculateNegotiatedPrice(project);

  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl mr-3 border border-green-400/30">
            <UserCheck className="text-green-400" size={20} />
          </div>
          Assigned Mentor
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Active</span>
        </div>
      </div>

      <div
        className="group relative p-5 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:shadow-xl"
        onClick={handleMentorClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <img
                src={
                  mentor.userId?.avatar
                    ? mentor.userId.avatar.startsWith("/uploads/")
                      ? `${API_URL}${mentor.userId.avatar}`
                      : mentor.userId.avatar
                    : `${API_URL}/uploads/public/default.jpg`
                }
                alt={mentor.userId?.name || "Mentor"}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-gradient-to-br from-blue-400/40 to-purple-400/40 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = `${API_URL}/uploads/public/default.jpg`;
                }}
              />

              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-gray-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                    {mentor.userId?.name || "Unknown Mentor"}
                  </h3>
                  <p className="text-blue-300 text-sm font-medium mb-2">
                    {mentor.title || "Mentor"}
                  </p>
                </div>

                {mentor.rating && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-2 py-1 rounded-lg border border-yellow-400/30">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span className="text-yellow-200 text-sm font-semibold">
                      {mentor.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {mentor.location && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <MapPin size={14} className="mr-2 text-purple-400" />
                    <span>{mentor.location}</span>
                  </div>
                )}
                {mentor.userId?.email && (
                  <div className="flex items-center text-gray-300 text-sm">
                    <Mail size={14} className="mr-2 text-blue-400" />
                    <span className="truncate">{mentor.userId.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-3 text-center">
              <Award className="text-blue-400 mx-auto mb-1" size={16} />
              <div className="text-sm font-bold text-white">
                {mentor.completedSessions || 0}
              </div>
              <div className="text-xs text-gray-300">Sessions</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-3 text-center">
              <TrendingUp className="text-green-400 mx-auto mb-1" size={16} />
              <div className="text-sm font-bold text-white">
                {mentor.totalStudents || 0}
              </div>
              <div className="text-xs text-gray-300">Students</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-3 text-center">
              <MessageCircle
                className="text-purple-400 mx-auto mb-1"
                size={16}
              />
              <div className="text-sm font-bold text-white">
                {mentor.responseTime || "N/A"}
              </div>
              <div className="text-xs text-gray-300">Resp. Time</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="text-green-400" size={18} />
                <span className="text-green-300 font-medium">
                  Project Price
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">
                  {finalPrice > 0 ? formatPrice(finalPrice) : "Pending"}
                </div>
                <div className="text-xs text-gray-300">
                  {project.closingPrice ? "Final Amount" : "Avg. Estimate"}
                </div>
              </div>
            </div>

            {!project.closingPrice && finalPrice === 0 && (
              <div className="mt-2 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-2">
                Waiting for mentor to submit proposal
              </div>
            )}
          </div>
        </div>
      </div>

      {mentor.description && (
        <div className="mt-4 p-4 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10">
          <div className="flex items-start space-x-3">
            <MessageCircle
              className="text-blue-400 mt-0.5 flex-shrink-0"
              size={16}
            />
            <div>
              <h4 className="text-white font-semibold text-sm mb-2">
                About Mentor
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                {mentor.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {mentor.expertise && mentor.expertise.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl border border-purple-400/20">
          <h4 className="text-white font-semibold text-sm mb-3 flex items-center">
            <Award className="mr-2 text-purple-400" size={16} />
            Expertise Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.slice(0, 4).map((exp, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 rounded-full text-xs font-medium border border-purple-400/30"
              >
                {exp.skill} • {exp.level}
              </span>
            ))}
            {mentor.expertise.length > 4 && (
              <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20">
                +{mentor.expertise.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedMentorSection;
