import React from "react";
import { UserCheck, MapPin } from "lucide-react";

const AssignedMentorSection = ({ project, API_URL }) => {
  // Format price
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

  if (!project.mentorId) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <UserCheck className="mr-2 text-blue-400" size={20} />
        Assigned Mentor
      </h2>
      <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
        <img
          src={
            project.mentorId.userId?.avatar
              ? project.mentorId.userId.avatar.startsWith("/uploads/")
                ? `${API_URL}${project.mentorId.userId.avatar}`
                : project.mentorId.userId.avatar
              : `${API_URL}/uploads/public/default.jpg`
          }
          alt={project.mentorId.userId?.name || "Mentor"}
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-400/30"
          onError={(e) => {
            e.target.src = `${API_URL}/uploads/public/default.jpg`;
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            {project.mentorId.userId?.name || "Unknown Mentor"}
          </h3>
          <p className="text-blue-300 text-sm">
            {project.mentorId.title || "Mentor"}
          </p>
          {project.mentorId.location && (
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span>{project.mentorId.location}</span>
            </div>
          )}
          {project.mentorId.userId?.email && (
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <span>{project.mentorId.userId.email}</span>
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {project.closingPrice
              ? formatPrice(project.closingPrice)
              : calculateNegotiatedPrice(project) > 0
              ? formatPrice(calculateNegotiatedPrice(project))
              : "No pitches yet"}
          </div>
          <div className="text-xs text-gray-300">Final Price</div>
        </div>
      </div>
      {project.mentorId.description && (
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <p className="text-gray-200 text-sm">
            {project.mentorId.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedMentorSection;
