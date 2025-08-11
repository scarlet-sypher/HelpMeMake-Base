import React, { useState, useEffect } from "react";
import { Edit, X, Loader, Save, Calendar } from "lucide-react";

const MilestoneEditModal = ({ milestone, onClose, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    title: milestone.title || "",
    description: milestone.description || "",
    dueDate: milestone.dueDate
      ? new Date(milestone.dueDate).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    setFormData({
      title: milestone.title || "",
      description: milestone.description || "",
      dueDate: milestone.dueDate
        ? new Date(milestone.dueDate).toISOString().split("T")[0]
        : "",
    });
  }, [milestone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const updateData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      ...(formData.dueDate && { dueDate: formData.dueDate }),
    };

    try {
      await onUpdate(milestone._id, updateData);
      onClose();
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Edit className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit Milestone</h3>
                <p className="text-sm text-gray-300">
                  Update milestone details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Milestone Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter milestone title..."
                maxLength={200}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {formData.title.length}/200 characters
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what needs to be accomplished..."
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-400">
                  {formData.description.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            {/* Warning for completed milestones */}
            {milestone.learnerVerification?.isVerified &&
              milestone.mentorVerification?.isVerified && (
                <div className="p-4 bg-amber-500/20 backdrop-blur-sm rounded-xl border border-amber-400/30">
                  <p className="text-amber-200 text-sm">
                    ⚠️ Note: This milestone is completed by both parties.
                    Changes may affect project progress tracking.
                  </p>
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.title.trim() || saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              {saving ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>Update Milestone</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneEditModal;
