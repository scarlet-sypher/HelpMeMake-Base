import React from "react";
import {
  Plus,
  Star,
  AlertCircle,
  Loader,
  Target,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";

const MilestoneForm = ({
  milestones = [],
  newMilestone,
  setNewMilestone,
  addMilestone,
  saving,
}) => {
  const completedMilestones = milestones.filter(
    (m) => m.status === "Completed"
  ).length;
  const inProgressMilestones = milestones.filter(
    (m) => m.status === "In Progress"
  ).length;
  const pendingReviewMilestones = milestones.filter(
    (m) => m.status === "Pending Review"
  ).length;
  const notStartedMilestones = milestones.filter(
    (m) => m.status === "Not Started"
  ).length;
  const progressPercentage =
    milestones.length > 0
      ? Math.round((completedMilestones / milestones.length) * 100)
      : 0;

  const getStatusColor = (status, count) => {
    if (count === 0) return "text-gray-500";
    switch (status) {
      case "Completed":
        return "text-green-400";
      case "In Progress":
        return "text-blue-400";
      case "Pending Review":
        return "text-yellow-400";
      case "Not Started":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={16} />;
      case "In Progress":
        return <Activity size={16} />;
      case "Pending Review":
        return <Clock size={16} />;
      case "Not Started":
        return <Target size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Create Milestones
              </h3>
              <p className="text-green-200 text-sm mt-1">
                Break down your project into achievable goals
              </p>
            </div>
          </div>

          {/* Milestone Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-400/30">
              <Star className="text-green-400" size={18} />
              <span className="text-green-300 font-semibold">
                {milestones.length}/5
              </span>
              <span className="text-green-200 text-sm hidden sm:inline">
                Created
              </span>
            </div>

            {milestones.length > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-400/30">
                <TrendingUp className="text-purple-400" size={18} />
                <span className="text-purple-300 font-semibold">
                  {progressPercentage}%
                </span>
                <span className="text-purple-200 text-sm hidden sm:inline">
                  Complete
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-6">
        {/* Milestone Statistics */}
        {milestones.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`${getStatusColor(
                    "Completed",
                    completedMilestones
                  )} group-hover:scale-110 transition-transform`}
                >
                  {getStatusIcon("Completed")}
                </div>
                <span className="text-xs sm:text-sm text-green-200 font-medium">
                  Completed
                </span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl">
                {completedMilestones}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`${getStatusColor(
                    "In Progress",
                    inProgressMilestones
                  )} group-hover:scale-110 transition-transform`}
                >
                  {getStatusIcon("In Progress")}
                </div>
                <span className="text-xs sm:text-sm text-blue-200 font-medium">
                  In Progress
                </span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl">
                {inProgressMilestones}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`${getStatusColor(
                    "Pending Review",
                    pendingReviewMilestones
                  )} group-hover:scale-110 transition-transform`}
                >
                  {getStatusIcon("Pending Review")}
                </div>
                <span className="text-xs sm:text-sm text-yellow-200 font-medium">
                  Pending
                </span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl">
                {pendingReviewMilestones}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-400/30 hover:border-gray-400/50 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`${getStatusColor(
                    "Not Started",
                    notStartedMilestones
                  )} group-hover:scale-110 transition-transform`}
                >
                  {getStatusIcon("Not Started")}
                </div>
                <span className="text-xs sm:text-sm text-gray-200 font-medium">
                  Not Started
                </span>
              </div>
              <p className="text-white font-bold text-lg sm:text-xl">
                {notStartedMilestones}
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {milestones.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="text-purple-400" size={20} />
                <span className="text-purple-200 font-medium">
                  Overall Progress
                </span>
              </div>
              <span className="text-white font-bold text-lg">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Creation Form */}
        {milestones.length < 5 && (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  placeholder="Describe your next milestone... (e.g., Complete user authentication)"
                  className="w-full px-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 group-hover:bg-white/15"
                  maxLength={200}
                  disabled={saving}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {newMilestone.length}/200
                </div>
              </div>

              <button
                onClick={addMilestone}
                disabled={
                  !newMilestone.trim() || saving || milestones.length >= 5
                }
                className="px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 min-w-max"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span className="hidden sm:inline">Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Milestone</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </button>
            </div>

            {/* Character count and tips */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} />
                <span>Tip: Be specific and measurable</span>
              </div>
              <div className="text-gray-400">
                {5 - milestones.length} milestone
                {5 - milestones.length !== 1 ? "s" : ""} remaining
              </div>
            </div>
          </div>
        )}

        {/* Maximum Reached Message */}
        {milestones.length >= 5 && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-400/30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <AlertCircle className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-amber-200 font-semibold">
                    Maximum Milestones Reached!
                  </h4>
                  <p className="text-amber-300 text-sm">
                    You've created all 5 milestones. Focus on completing them!
                  </p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="text-amber-400" size={16} />
                  <span className="text-amber-200 text-sm font-medium">
                    All Set!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneForm;
