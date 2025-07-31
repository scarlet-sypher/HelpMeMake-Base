import React from 'react';
import { 
  Users, 
  User,
  Bot,
  Award,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProjectActions = ({ 
  project, 
  setProject, 
  setShowMentorSelection, 
  handleAIMentorSelection, 
  API_URL, 
  formatPrice, 
  formatDate 
}) => {

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      {project.status === 'Open' && !project.mentorId && (
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
                <Bot size={20} className="text-white animate-pulse drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                <span className="tracking-wide">Let AI Pick Your Mentor</span>
                <div className="ml-2 px-2 py-1 bg-orange-500/30 text-yellow-200 rounded-lg text-xs font-bold shadow-inner animate-bounce">
                ✨ NEW
                </div>
            </div>
            </button>

          </div>
        </div>
      )}

      {/* Current Mentor (if assigned) */}
      {project.mentorId && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Award className="mr-2 text-yellow-400" size={20} />
            Assigned Mentor
          </h2>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="text-white font-semibold">Mentor Assigned</div>
            <div className="text-gray-300 text-sm">Project in progress</div>
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
              <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white">Mentor Application</div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    application.applicationStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    application.applicationStatus === 'Accepted' ? 'bg-green-500/20 text-green-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {application.applicationStatus}
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Proposed Price: {formatPrice(application.proposedPrice, project.currency)}</div>
                  <div>Duration: {application.estimatedDuration}</div>
                  <div>Applied: {formatDate(application.appliedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-400" size={20} />
          Project Stats
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Views</span>
            <span className="text-white font-semibold">{project.viewCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Applications</span>
            <span className="text-white font-semibold">{project.applicationsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Progress</span>
            <span className="text-white font-semibold">{project.progressPercentage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Category</span>
            <span className="text-white font-semibold">{project.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Knowledge Level</span>
            <span className="text-white font-semibold">{project.knowledgeLevel}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectActions;