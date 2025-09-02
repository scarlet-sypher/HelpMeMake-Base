import React from "react";
import {
  HandHeart,
  Plus,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const ProjectActions = ({
  project,
  pitches,
  onSetClosingPrice,
  onViewPitches,
  onToast,
}) => {
  const handleSetClosingPrice = () => {
    if (!pitches || pitches.length === 0) {
      onToast?.({
        message:
          "No pitches received yet. Wait for mentors to submit their proposals.",
        status: "info",
      });
      return;
    }

    if (project.closingPrice) {
      onToast?.({
        message: "Closing price has already been set for this project.",
        status: "info",
      });
      return;
    }

    onSetClosingPrice();
  };

  const handleViewPitches = () => {
    onViewPitches();
    if (pitches.length > 0) {
      onToast?.({
        message: `Viewing ${pitches.length} pitch${
          pitches.length > 1 ? "es" : ""
        } for your project`,
        status: "info",
      });
    }
  };

  const getStatusIcon = () => {
    if (project.closingPrice) {
      return <CheckCircle className="text-green-400" size={18} />;
    }
    if (!pitches || pitches.length === 0) {
      return <Clock className="text-yellow-400" size={18} />;
    }
    return <TrendingUp className="text-blue-400" size={18} />;
  };

  const getStatusText = () => {
    if (project.closingPrice) return "Price Set Successfully";
    if (!pitches || pitches.length === 0) return "Awaiting Pitches";
    return "Ready to Set Price";
  };

  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mr-3 border border-blue-400/30">
            <HandHeart className="text-blue-400" size={20} />
          </div>
          Project Actions
        </h3>
        <div className="flex items-center space-x-2 text-sm">
          {getStatusIcon()}
          <span
            className={`font-medium ${
              project.closingPrice
                ? "text-green-400"
                : pitches?.length > 0
                ? "text-blue-400"
                : "text-yellow-400"
            }`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="text-blue-400" size={16} />
            <span className="text-blue-300 text-sm font-medium">Pitches</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {pitches?.length || 0}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {pitches?.length === 0 ? "No submissions" : "Received"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="text-green-400" size={16} />
            <span className="text-green-300 text-sm font-medium">Status</span>
          </div>
          <div className="text-lg font-bold text-white leading-tight">
            {project.closingPrice ? "Finalized" : "Open"}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {project.closingPrice ? "Price set" : "Accepting pitches"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSetClosingPrice}
          className={`group w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${
            pitches && pitches.length > 0 && !project.closingPrice
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/25"
              : project.closingPrice
              ? "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!pitches || pitches.length === 0 || project.closingPrice}
        >
          {pitches && pitches.length > 0 && !project.closingPrice && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          )}

          <div className="flex items-center space-x-3 relative z-10">
            {project.closingPrice ? (
              <CheckCircle size={20} />
            ) : (
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
            )}
            <span>
              {project.closingPrice ? "Price Already Set" : "Set Closing Price"}
            </span>
            {!pitches ||
              (pitches.length === 0 && !project.closingPrice && (
                <AlertTriangle size={16} />
              ))}
          </div>
        </button>

        <button
          onClick={handleViewPitches}
          className="group w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-blue-500/25 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <div className="flex items-center space-x-3 relative z-10">
            <MessageSquare
              size={20}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span>View All Pitches</span>
            <div className="flex items-center space-x-1">
              <div className="bg-white/20 text-xs px-2 py-1 rounded-full font-bold">
                {pitches?.length || 0}
              </div>
              {project.hasUnreadPitch && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              )}
            </div>
          </div>
        </button>
      </div>

      {(!pitches || pitches.length === 0) && !project.closingPrice && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl">
          <div className="flex items-start space-x-3">
            <Clock className="text-yellow-400 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-yellow-200 text-sm font-medium mb-1">
                Waiting for mentor pitches
              </p>
              <p className="text-yellow-100/70 text-xs leading-relaxed">
                Once mentors submit their proposals, you'll be able to review
                them and set your project's closing price.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectActions;
