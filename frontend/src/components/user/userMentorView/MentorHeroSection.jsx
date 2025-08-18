import React from "react";
import {
  User,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Calendar,
  Send,
  XCircle,
  MessageCircle,
} from "lucide-react";

const MentorHeroSection = ({
  mentorData,
  selectedProject,
  requestStatus,
  mentorResponse,
  respondedAt,
  checkingRequest,
  onSendRequest,
  API_URL,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderActionButton = () => {
    if (checkingRequest) {
      return (
        <div className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Checking...</span>
        </div>
      );
    }

    if (requestStatus) {
      return (
        <div className="space-y-3">
          <div
            className={`w-full px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 ${
              requestStatus === "accepted"
                ? "bg-green-500/20 border border-green-500/30 text-green-300"
                : requestStatus === "rejected"
                ? "bg-red-500/20 border border-red-500/30 text-red-300"
                : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300"
            }`}
          >
            {requestStatus === "accepted" && <CheckCircle size={16} />}
            {requestStatus === "rejected" && <XCircle size={16} />}
            {requestStatus === "pending" && <Clock size={16} />}
            <span>
              {requestStatus === "accepted" && "Request Accepted"}
              {requestStatus === "rejected" && "Request Rejected"}
              {requestStatus === "pending" && "Request Pending"}
            </span>
          </div>

          {mentorResponse && requestStatus !== "pending" && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start space-x-2">
                <MessageCircle
                  size={16}
                  className="text-blue-400 mt-0.5 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">
                    Mentor's Response:
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {mentorResponse}
                  </p>
                  {respondedAt && (
                    <p className="text-xs text-gray-400 mt-2">
                      Responded on{" "}
                      {new Date(respondedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={onSendRequest}
        disabled={!mentorData.isAvailable || !selectedProject}
        className={`w-full px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
          mentorData.isAvailable && selectedProject
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25"
            : "bg-gray-500/20 text-gray-400 cursor-not-allowed transform-none"
        }`}
        title={
          !selectedProject
            ? "Please select a project first"
            : !mentorData.isAvailable
            ? "Mentor is not available"
            : "Send a request to this mentor"
        }
      >
        <Send size={16} />
        <span>
          {!selectedProject
            ? "No Project Selected"
            : mentorData.isAvailable
            ? "Send Request"
            : "Not Available"}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 mb-6 overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Mentor Info */}
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 shadow-xl">
                {mentorData.userId?.avatar ? (
                  <img
                    src={
                      mentorData.userId.avatar.startsWith("/uploads/")
                        ? `${API_URL}${mentorData.userId.avatar}`
                        : mentorData.userId.avatar
                    }
                    alt={mentorData.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={32} />
                )}
              </div>

              {/* Online Status with improved visibility */}
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                  mentorData.isOnline ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    mentorData.isOnline ? "animate-pulse bg-green-400" : ""
                  }`}
                ></div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {mentorData.userId?.name || "Anonymous Mentor"}
              </h1>
              <p className="text-blue-300 text-lg lg:text-xl mb-3 font-medium">
                {mentorData.title}
              </p>
              <p className="text-gray-200 mb-4 leading-relaxed text-sm sm:text-base max-w-2xl">
                {mentorData.description}
              </p>

              {/* Key Stats with improved responsive layout */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mb-4">
                <div className="flex items-center space-x-1 text-sm bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                  <Star className="text-yellow-400" size={16} />
                  <span className="text-white font-semibold">
                    {mentorData.rating}
                  </span>
                  <span className="text-gray-300 hidden sm:inline">
                    ({mentorData.totalReviews || 0} reviews)
                  </span>
                  <span className="text-gray-300 sm:hidden">
                    ({mentorData.totalReviews || 0})
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                  <Users className="text-green-400" size={16} />
                  <span className="text-white font-semibold">
                    {mentorData.totalStudents}
                  </span>
                  <span className="text-gray-300 hidden sm:inline">
                    students
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
                  <CheckCircle className="text-blue-400" size={16} />
                  <span className="text-white font-semibold">
                    {mentorData.completedSessions}
                  </span>
                  <span className="text-gray-300 hidden sm:inline">
                    sessions
                  </span>
                </div>
              </div>

              {/* Location and Join Date with improved mobile layout */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-300">
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <MapPin size={14} />
                  <span>{mentorData.location}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <Calendar size={14} />
                  <span>Joined {formatDate(mentorData.joinDate)}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-1">
                  <Clock size={14} />
                  <span>Responds in {mentorData.responseTime} mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with improved mobile layout */}
          <div className="flex flex-col space-y-3 w-full lg:w-64">
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHeroSection;
