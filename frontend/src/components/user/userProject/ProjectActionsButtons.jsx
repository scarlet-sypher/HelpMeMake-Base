import React from "react";
import {
  Users,
  User,
  Bot,
  Award,
  MessageCircle,
  TrendingUp,
  Image,
} from "lucide-react";
import { toast } from "react-toastify";

const ProjectActionsButtons = ({
  project,
  setProject,
  setShowMentorSelection,
  handleAIMentorSelection,
  API_URL,
  formatPrice,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      {project.status === "Open" && !project.mentorId && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="mr-2 text-purple-400" size={20} />
            Find a Mentor
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowMentorSelection(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <User size={20} />
              <span>Choose Mentor Manually</span>
            </button>
            <button
              onClick={handleAIMentorSelection}
              className="group relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 
                        bg-[length:200%_100%] bg-left hover:bg-right 
                        text-white rounded-2xl font-semibold transition-all duration-500 ease-in-out 
                        transform hover:scale-105 hover:brightness-110 shadow-xl hover:shadow-pink-500/30 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <Bot
                  size={20}
                  className="text-white animate-pulse drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                />
                <span className="tracking-wide">Let AI Pick Your Mentor</span>
                <div className="ml-2 px-2 py-1 bg-orange-500/30 text-yellow-200 rounded-lg text-xs font-bold shadow-inner animate-bounce">
                  ✨ NEW
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Applications */}
      {project.applications && project.applications.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <MessageCircle className="mr-2 text-green-400" size={20} />
            Applications ({project.applications.length})
          </h2>
          <div className="space-y-3">
            {project.applications.map((application, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">
                    Mentor Application
                  </div>
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      application.applicationStatus === "Pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : application.applicationStatus === "Accepted"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {application.applicationStatus}
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>
                    Proposed Price:{" "}
                    {formatPrice(application.proposedPrice, project.currency)}
                  </div>
                  <div>Duration: {application.estimatedDuration}</div>
                  <div>Applied: {formatDate(application.appliedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectActionsButtons;
