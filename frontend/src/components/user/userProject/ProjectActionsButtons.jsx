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
      {/* Action Buttons - Only show if project is Open and no mentor assigned */}
      {project.status === "Open" && !project.mentorId && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Users className="mr-2 text-purple-400" size={20} />
            Find a Mentor
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            Choose how you'd like to find the perfect mentor for your project
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowMentorSelection(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <User size={20} />
              <span>Browse & Select Mentor Manually</span>
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
                <span className="tracking-wide">
                  Let AI Pick Your Perfect Mentor
                </span>
                <div className="ml-2 px-2 py-1 bg-orange-500/30 text-yellow-200 rounded-lg text-xs font-bold shadow-inner animate-bounce">
                  ✨ NEW
                </div>
              </div>
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <p className="text-blue-200 text-xs">
              💡 <strong>Tip:</strong> Both options will allow you to send
              personalized requests to mentors. AI selection analyzes your
              project requirements to recommend the most compatible mentors.
            </p>
          </div>
        </div>
      )}

      {/* Project Status Updates */}
      {project.mentorId && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Award className="mr-2 text-green-400" size={20} />
            Project Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  project.status === "In Progress"
                    ? "bg-blue-500/20 text-blue-300"
                    : project.status === "Completed"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Mentor Assigned:</span>
              <span className="text-white font-medium">Yes</span>
            </div>
            {project.startDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Started:</span>
                <span className="text-white">
                  {formatDate(project.startDate)}
                </span>
              </div>
            )}
            {project.expectedEndDate && (
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Expected End:</span>
                <span className="text-white">
                  {formatDate(project.expectedEndDate)}
                </span>
              </div>
            )}
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
                  {application.coverLetter && (
                    <div className="mt-2 p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400">Cover Letter:</p>
                      <p className="text-sm text-gray-200">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pitches (if any) */}
      {project.pitches && project.pitches.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2 text-orange-400" size={20} />
            Received Pitches ({project.pitches.length})
          </h2>
          <div className="space-y-3">
            {project.pitches.slice(0, 3).map((pitch, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">Mentor Pitch</div>
                  <div className="text-orange-300 font-semibold">
                    {formatPrice(pitch.price, project.currency)}
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Submitted: {formatDate(pitch.timestamp)}</div>
                  {pitch.note && (
                    <div className="mt-2 p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-gray-400">Note:</p>
                      <p className="text-sm text-gray-200">{pitch.note}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {project.pitches.length > 3 && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  +{project.pitches.length - 3} more pitches
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Image className="mr-2 text-cyan-400" size={20} />
          Project Overview
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {project.viewCount || 0}
            </div>
            <div className="text-xs text-gray-400">Views</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl">
            <div className="text-2xl font-bold text-white">
              {project.applicationsCount || 0}
            </div>
            <div className="text-xs text-gray-400">Applications</div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Budget:</span>
            <span className="text-white font-semibold">
              {formatPrice(project.openingPrice, project.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Duration:</span>
            <span className="text-white font-semibold">{project.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Category:</span>
            <span className="text-white font-semibold">{project.category}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Difficulty:</span>
            <span
              className={`font-semibold ${
                project.difficultyLevel === "Beginner"
                  ? "text-green-400"
                  : project.difficultyLevel === "Intermediate"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {project.difficultyLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActionsButtons;
