import React from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Users,
  Loader,
  Eye,
  EyeOff,
  X,
  Trophy,
  Award,
  Undo2
} from 'lucide-react';

const MilestoneList = ({ 
  milestones, 
  markMilestoneAsDone, 
  undoMilestone, 
  removeMilestone, 
  saving 
}) => {
  const getMilestoneStatus = (milestone) => {
    if (milestone.learnerVerification?.isVerified && milestone.mentorVerification?.isVerified) {
      return { color: 'bg-emerald-500', text: 'Completed', icon: CheckCircle };
    } else if (milestone.learnerVerification?.isVerified) {
      return { color: 'bg-yellow-500', text: 'Pending Review', icon: Clock };
    } else {
      return { color: 'bg-slate-500', text: 'Not Started', icon: AlertCircle };
    }
  };

  const isNextMilestoneVisible = (index) => {
    if (index === 0) return true;
    const previousMilestone = milestones[index - 1];
    return previousMilestone?.learnerVerification?.isVerified || false;
  };

  const getCompletionPercentage = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => 
      m.learnerVerification?.isVerified && m.mentorVerification?.isVerified
    ).length;
    return Math.round((completed / milestones.length) * 100);
  };

  if (milestones.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 lg:p-6 border border-white/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Target className="text-blue-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">Your Milestones</h3>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-sm text-blue-200">Progress:</div>
          <div className="flex-1 sm:flex-none sm:w-24 bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <span className="text-blue-300 font-medium text-sm">{getCompletionPercentage()}%</span>
        </div>
      </div>
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const status = getMilestoneStatus(milestone);
          const isVisible = isNextMilestoneVisible(index);
          const StatusIcon = status.icon;
          return (
            <div
              key={milestone._id}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all ${
                isVisible ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${status.color} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <span className="text-white font-bold text-sm sm:text-base">{index + 1}</span>
                    </div>
                    <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full border flex-shrink-0 ${
                      status.color === 'bg-emerald-500'
                        ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                        : status.color === 'bg-yellow-500'
                        ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
                        : 'bg-slate-500/20 border-slate-400/30 text-slate-300'
                    }`}>
                      <StatusIcon size={12} />
                      <span className="text-xs font-medium">{status.text}</span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      {isVisible ? (
                        <div className="flex items-center space-x-1 text-green-400">
                          <Eye size={12} />
                          <span className="text-xs hidden sm:inline">Unlocked</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-400">
                          <EyeOff size={12} />
                          <span className="text-xs hidden sm:inline">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-3 break-words">{milestone.title}</h4>
                  <div className="flex items-center space-x-4 sm:space-x-6 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        milestone.learnerVerification?.isVerified ? 'bg-blue-400' : 'bg-gray-500'
                      }`}></div>
                      <User size={12} className={`${
                        milestone.learnerVerification?.isVerified ? 'text-blue-300' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-300">Learner</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        milestone.mentorVerification?.isVerified ? 'bg-purple-400' : 'bg-gray-500'
                      }`}></div>
                      <Users size={12} className={`${
                        milestone.mentorVerification?.isVerified ? 'text-purple-300' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-300">Mentor</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {isVisible && !milestone.learnerVerification?.isVerified && (
                    <button
                      onClick={() => markMilestoneAsDone(milestone._id)}
                      disabled={saving}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                      {saving ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      <span className="text-xs sm:text-sm">Mark Done</span>
                    </button>
                  )}
                  {milestone.learnerVerification?.isVerified && !milestone.mentorVerification?.isVerified && (
                      <button
                        onClick={() => undoMilestone(milestone._id)}
                        disabled={saving}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                      >
                        {saving ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Undo2 size={14} />
                        )}
                        <span className="text-xs sm:text-sm">Undo</span>
                      </button>
                    )}
                    {!milestone.learnerVerification?.isVerified && !milestone.mentorVerification?.isVerified && (
                      <button
                        onClick={() => removeMilestone(milestone._id)}
                        disabled={saving}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 rounded-lg transition-all hover:scale-105 flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]"
                        title="Remove milestone"
                      >
                        <X size={16} />
                      </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {getCompletionPercentage() === 100 && (
        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-400/30">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Trophy className="text-yellow-400" size={24} />
              <span className="text-lg sm:text-xl font-bold text-yellow-300 text-center">
                🎉 All Milestones Completed! 🎉
              </span>
              <Award className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneList;