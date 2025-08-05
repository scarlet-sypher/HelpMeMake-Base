import React from 'react';
import { Trophy, Users, Calendar, Zap,Image } from 'lucide-react';

const ProjectInfo = ({ projectData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
            <Trophy className="text-yellow-400 mr-0 sm:mr-3" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-white break-words">{projectData.name}</h2>
          </div>
          <p className="text-blue-200 mb-6 text-sm sm:text-base">{projectData.shortDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                  <Users className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-blue-200 font-medium">Mentor</span>
              </div>
              <p className="text-white font-bold text-sm sm:text-base break-words">
                {projectData.mentorId?.name || 'Assigned Mentor'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                  <Calendar className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-green-200 font-medium">End Date</span>
              </div>
              <p className="text-white font-bold text-sm sm:text-base">
                {projectData.expectedEndDate ? formatDate(projectData.expectedEndDate) : 'Not Set'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-purple-500 rounded-lg">
                  <Zap className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-purple-200 font-medium">Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-white font-bold text-sm sm:text-base">{projectData.progressPercentage || 0}%</p>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${projectData.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;