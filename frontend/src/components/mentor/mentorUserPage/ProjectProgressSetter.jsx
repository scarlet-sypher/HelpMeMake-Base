import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TrendingUp, FileText, Save, History, Clock } from "lucide-react";

const ProjectProgressSetter = ({ projectData, onDataRefresh }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [newProgress, setNewProgress] = useState(0);
  const [progressNote, setProgressNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (projectData) {
      const progress = projectData.trackerPercentage || 0;
      setCurrentProgress(progress);
      setNewProgress(progress);
    }
  }, [projectData]);

  // Fetch progress history
  const fetchProgressHistory = async () => {
    try {
      setHistoryLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${apiUrl}/api/sync/mentor-tracker-history/${projectData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setProgressHistory(response.data.trackerHistory);
      }
    } catch (error) {
      console.error("Error fetching progress history:", error);
      toast.error("Failed to fetch progress history");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (projectData && showHistory) {
      fetchProgressHistory();
    }
  }, [projectData, showHistory]);

  const handleProgressUpdate = async () => {
    if (newProgress < currentProgress) {
      toast.error("Progress can only be increased, not decreased");
      return;
    }

    if (newProgress === currentProgress) {
      toast.error("Please select a different progress value");
      return;
    }

    if (!progressNote.trim()) {
      toast.error("Please add a note describing the progress");
      return;
    }

    if (progressNote.trim().length < 10) {
      toast.error("Progress note must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/update-tracker`,
        {
          projectId: projectData._id,
          percentage: newProgress,
          note: progressNote.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Progress updated successfully!");
        setCurrentProgress(newProgress);
        setProgressNote("");
        onDataRefresh();

        // Refresh history if it's being shown
        if (showHistory) {
          fetchProgressHistory();
        }
      } else {
        toast.error(response.data.message || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    } finally {
      setLoading(false);
    }
  };

  if (projectData?.status !== "In Progress") {
    return null;
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <TrendingUp className="mr-3 text-green-400" size={28} />
              Update Project Tracker
            </h3>
            <p className="text-gray-300">
              Track and update your apprentice's learning tracker
            </p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <History size={18} />
            <span className="text-sm">History</span>
          </button>
        </div>

        {/* Current Progress Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-300 font-medium">Current Progress</span>
            <span className="text-white font-bold text-lg">
              {currentProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Progress Setter */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Progress Percentage: {newProgress}%
            </label>
            <input
              type="range"
              min={currentProgress}
              max="100"
              value={newProgress}
              onChange={(e) => setNewProgress(parseInt(e.target.value))}
              disabled={loading}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${newProgress}%, #374151 ${newProgress}%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{currentProgress}%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FileText className="mr-2" size={16} />
              Progress Note <span className="text-red-400 ml-1">*</span>
            </label>
            <textarea
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              disabled={loading}
              placeholder="Describe what has been accomplished, what your apprentice learned, or what milestone was reached..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-xs ${
                  progressNote.trim().length < 10
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                Minimum 10 characters
              </span>
              <span className="text-xs text-gray-400">
                {progressNote.length}/500
              </span>
            </div>
          </div>

          <button
            onClick={handleProgressUpdate}
            disabled={
              newProgress <= currentProgress ||
              !progressNote.trim() ||
              progressNote.trim().length < 10 ||
              loading
            }
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update Progress</span>
              </>
            )}
          </button>
        </div>

        {/* Progress History */}
        {showHistory && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <History className="mr-2" size={20} />
              Progress History
            </h4>

            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-300 ml-3">Loading history...</span>
              </div>
            ) : progressHistory.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {progressHistory.map((update, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {update.percentage}%
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-green-400 font-medium">
                            Progress: {update.percentage}%
                          </span>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock size={14} className="mr-1" />
                            {new Date(update.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{update.note}</p>
                      </div>
                    </div>
                    {/* Connecting line */}
                    {index < progressHistory.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-4 bg-gray-600"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No progress updates yet</p>
                <p className="text-gray-500 text-sm">
                  Update progress to start tracking history
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ProjectProgressSetter;
