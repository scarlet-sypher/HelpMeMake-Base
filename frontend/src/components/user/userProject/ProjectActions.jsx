import React from "react";
import { HandHeart, Plus, MessageSquare } from "lucide-react";

const ProjectActions = ({
  project,
  pitches,
  onSetClosingPrice,
  onViewPitches,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <HandHeart className="mr-2 text-blue-400" size={20} />
        Project Actions
      </h3>

      <div className="space-y-3">
        {/* Set Closing Price Button */}
        <button
          onClick={onSetClosingPrice}
          disabled={!pitches || pitches.length === 0 || project.closingPrice}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            pitches && pitches.length > 0 && !project.closingPrice
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
          title={
            project.closingPrice
              ? "Closing price already set"
              : !pitches || pitches.length === 0
              ? "No pitches received yet"
              : "Set closing price for this project"
          }
        >
          <Plus size={18} />
          <span>
            {project.closingPrice ? "Price Set" : "Add Closing Price"}
          </span>
        </button>

        {/* See Pitching Button */}
        <button
          onClick={onViewPitches}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
        >
          <MessageSquare size={18} />
          <span>See Pitching ({pitches.length})</span>
          {project.hasUnreadPitch && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectActions;
