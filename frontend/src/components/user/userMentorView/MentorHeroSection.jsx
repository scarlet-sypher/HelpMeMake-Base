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
  Award,
  Zap,
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
        <div className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium flex items-center justify-center space-x-2 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Checking...</span>
        </div>
      );
    }

    if (requestStatus) {
      return (
        <div className="space-y-3">
          <div
            className={`w-full px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 backdrop-blur-sm transition-all duration-300 ${
              requestStatus === "accepted"
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300"
                : requestStatus === "rejected"
                ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/30 text-red-300"
                : "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 text-amber-300"
            }`}
          >
            {requestStatus === "accepted" && <CheckCircle size={16} />}
            {requestStatus === "rejected" && <XCircle size={16} />}
            {requestStatus === "pending" && (
              <Clock size={16} className="animate-pulse" />
            )}
            <span>
              {requestStatus === "accepted" && "Request Accepted"}
              {requestStatus === "rejected" && "Request Rejected"}
              {requestStatus === "pending" && "Request Pending"}
            </span>
          </div>

          {mentorResponse && requestStatus !== "pending" && (
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg flex-shrink-0 mt-0.5">
                  <MessageCircle size={14} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-300 mb-2">
                    Mentor's Response:
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed mb-2">
                    {mentorResponse}
                  </p>
                  {respondedAt && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>
                        {new Date(respondedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
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
        className={`group w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 ${
          mentorData.isAvailable && selectedProject
            ? "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40"
            : "bg-gradient-to-r from-gray-600/50 to-gray-500/50 text-gray-400 cursor-not-allowed transform-none"
        }`}
        title={
          !selectedProject
            ? "Please select a project first"
            : !mentorData.isAvailable
            ? "Mentor is not available"
            : "Send a request to this mentor"
        }
      >
        <Send
          size={16}
          className={
            mentorData.isAvailable && selectedProject
              ? "group-hover:translate-x-0.5 transition-transform"
              : ""
          }
        />
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
    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 mb-8 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 flex-1">
            <div className="relative group/avatar">
              <div className="relative">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 group-hover/avatar:shadow-purple-500/50 transition-all duration-500 transform group-hover/avatar:scale-105">
                  {mentorData.userId?.avatar ? (
                    <img
                      src={
                        mentorData.userId.avatar.startsWith("/uploads/")
                          ? `${API_URL}${mentorData.userId.avatar}`
                          : mentorData.userId.avatar
                      }
                      alt={mentorData.userId.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="text-white" size={42} />
                  )}
                </div>

                <div className="absolute -bottom-2 -right-2 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 rounded-full border-3 border-white shadow-lg ${
                      mentorData.isOnline ? "bg-emerald-500" : "bg-gray-500"
                    } flex items-center justify-center`}
                  >
                    {mentorData.isOnline && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  {mentorData.isOnline && (
                    <div className="absolute inset-0 w-8 h-8 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                  )}
                </div>
              </div>

              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                <Award size={12} className="inline mr-1" />
                Mentor
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                  {mentorData.userId?.name || "Anonymous Mentor"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 sm:max-w-[100px]"></div>
                  <p className="text-purple-300 text-lg lg:text-xl font-semibold px-3 py-1 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    {mentorData.title}
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent flex-1 sm:max-w-[100px]"></div>
                </div>
              </div>

              <p className="text-gray-200 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto sm:mx-0 bg-white/5 rounded-lg p-3 border border-white/10">
                {mentorData.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-3 border border-amber-400/30 text-center group/stat hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Star
                      className="text-amber-400 group-hover/stat:rotate-12 transition-transform"
                      size={18}
                    />
                    <span className="text-white font-bold text-lg">
                      {mentorData.rating}
                    </span>
                  </div>
                  <p className="text-amber-200 text-xs">
                    {mentorData.totalReviews || 0} reviews
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-3 border border-emerald-400/30 text-center group/stat hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Users
                      className="text-emerald-400 group-hover/stat:scale-110 transition-transform"
                      size={18}
                    />
                    <span className="text-white font-bold text-lg">
                      {mentorData.totalStudents}
                    </span>
                  </div>
                  <p className="text-emerald-200 text-xs">students</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-3 border border-blue-400/30 text-center group/stat hover:scale-105 transition-transform duration-300 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <CheckCircle
                      className="text-blue-400 group-hover/stat:rotate-6 transition-transform"
                      size={18}
                    />
                    <span className="text-white font-bold text-lg">
                      {mentorData.completedSessions}
                    </span>
                  </div>
                  <p className="text-blue-200 text-xs">sessions</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-sm hover:bg-white/15 transition-colors">
                  <MapPin size={14} className="text-pink-400" />
                  <span className="text-gray-200">{mentorData.location}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-sm hover:bg-white/15 transition-colors">
                  <Calendar size={14} className="text-cyan-400" />
                  <span className="text-gray-200">
                    Since {formatDate(mentorData.joinDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 text-sm hover:bg-white/15 transition-colors">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-gray-200">
                    {mentorData.responseTime}min response
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 w-full xl:w-80">
            {selectedProject && (
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-400/20">
                <h3 className="text-white font-semibold text-sm mb-2 flex items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                  Selected Project
                </h3>
                <p className="text-indigo-200 text-sm font-medium">
                  {selectedProject.title}
                </p>
              </div>
            )}
            {renderActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHeroSection;
