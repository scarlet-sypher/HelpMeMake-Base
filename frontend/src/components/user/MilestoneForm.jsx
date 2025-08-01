import React from 'react';
import { Plus, Star, AlertCircle, Loader } from 'lucide-react';

const MilestoneForm = ({ 
  milestones, 
  newMilestone, 
  setNewMilestone, 
  addMilestone, 
  saving 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plus className="text-green-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">Create Milestones</h3>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
          <Star className="text-green-400" size={16} />
          <span className="text-sm text-green-300 font-medium">
            {milestones.length}/5 Created
          </span>
        </div>
      </div>
      {milestones.length < 5 && (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Describe your next milestone..."
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
            maxLength={200}
            disabled={saving}
          />
          <button
            onClick={addMilestone}
            disabled={!newMilestone.trim() || saving}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            {saving ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            <span>Add Milestone</span>
          </button>
        </div>
      )}
      {milestones.length >= 5 && (
        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 flex items-center space-x-3">
          <AlertCircle className="text-yellow-400" size={20} />
          <span className="text-yellow-200 font-medium">Maximum 5 milestones reached! You're all set!</span>
        </div>
      )}
    </div>
  );
};

export default MilestoneForm;