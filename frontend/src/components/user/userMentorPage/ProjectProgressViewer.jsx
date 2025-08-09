import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Activity,
  TrendingUp,
  Clock,
  MessageCircle,
  X,
  Eye,
} from "lucide-react";

const ProjectProgressViewer = ({ projectData }) => {
  const [progressHistory, setProgressHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    const fetchProgressHistory = async () => {
      if (projectData?._id) {
        try {
          setLoading(true);
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await axios.get(
            `${apiUrl}/api/sync/progress-history/${projectData._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setProgressHistory(response.data.progressHistory || []);
          }
        } catch (error) {
          console.error("Error fetching progress history:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProgressHistory();
  }, [projectData]);

  const handleProgressClick = (progress) => {
    setSelectedProgress(progress);
    setShowNoteModal(true);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  const getProgressGradient = (percentage) => {
    if (percentage >= 80) return "from-green-400 to-emerald-600";
    if (percentage >= 60) return "from-blue-400 to-indigo-600";
    if (percentage >= 40) return "from-yellow-400 to-orange-500";
    if (percentage >= 20) return "from-orange-400 to-red-500";
    return "from-red-400 to-pink-500";
  };

  const currentProgress = projectData?.progressPercentage || 0;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Activity className="mr-2 text-green-400" size={24} />
            Project Progress
          </h2>
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-400" size={16} />
            <span className="text-sm text-green-300 font-medium">
              {currentProgress}% Complete
            </span>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-300">
              Overall Progress
            </span>
            <span className="text-lg font-bold text-white">
              {currentProgress}%
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getProgressGradient(
                  currentProgress
                )} h-4 rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${currentProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Progress Dots for History */}
            <div className="absolute -top-2 left-0 w-full h-8">
              {progressHistory.map((progress, index) => {
                const position = `${progress.percentage}%`;
                return (
                  <div
                    key={index}
                    className="absolute transform -translate-x-1/2 cursor-pointer group"
                    style={{ left: position }}
                    onClick={() => handleProgressClick(progress)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white ${getProgressColor(
                        progress.percentage
                      )} hover:scale-125 transition-all duration-200 shadow-lg`}
                    ></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {progress.percentage}% -{" "}
                      {new Date(progress.date).toLocaleDateString()}
                      {progress.note && (
                        <div className="text-center mt-1">
                          Click to view note
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Updates</span>
              <MessageCircle className="text-blue-400" size={16} />
            </div>
            <div className="text-2xl font-bold text-white">
              {progressHistory.length}
            </div>
            <div className="text-xs text-blue-300 mt-1">Progress Updates</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Last Update
              </span>
              <Clock className="text-green-400" size={16} />
            </div>
            <div className="text-lg font-bold text-white">
              {progressHistory.length > 0
                ? new Date(
                    progressHistory[progressHistory.length - 1]?.date
                  ).toLocaleDateString()
                : "No updates"}
            </div>
            <div className="text-xs text-green-300 mt-1">Most Recent</div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Milestone
              </span>
              <TrendingUp
                className={`${
                  currentProgress >= 100 ? "text-green-400" : "text-yellow-400"
                }`}
                size={16}
              />
            </div>
            <div
              className={`text-lg font-bold ${
                currentProgress >= 100 ? "text-green-400" : "text-white"
              }`}
            >
              {currentProgress >= 100
                ? "Completed"
                : currentProgress >= 75
                ? "Near Complete"
                : currentProgress >= 50
                ? "Half Way"
                : currentProgress >= 25
                ? "Getting Started"
                : "Just Started"}
            </div>
            <div
              className={`text-xs mt-1 ${
                currentProgress >= 100 ? "text-green-300" : "text-yellow-300"
              }`}
            >
              Current Status
            </div>
          </div>
        </div>

        {/* Progress History Timeline */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-300">
              Loading progress history...
            </span>
          </div>
        ) : progressHistory.length > 0 ? (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Clock className="mr-2 text-blue-400" size={20} />
              Progress Timeline
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {progressHistory
                .slice()
                .reverse()
                .map((progress, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handleProgressClick(progress)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getProgressColor(
                          progress.percentage
                        )}`}
                      ></div>
                      <div>
                        <div className="text-white font-medium">
                          {progress.percentage}% Complete
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(progress.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                    {progress.note && (
                      <div className="flex items-center text-blue-400">
                        <Eye size={16} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Activity className="mx-auto mb-4 opacity-50" size={48} />
            <p>No progress updates yet</p>
            <p className="text-sm mt-1">
              Your mentor will update progress as work continues
            </p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {showNoteModal && selectedProgress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Progress Update Details
                </h3>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <span className="text-sm text-gray-300">Progress</span>
                    <div className="text-2xl font-bold text-white">
                      {selectedProgress.percentage}%
                    </div>
                  </div>
                  <div
                    className={`w-16 h-16 rounded-full ${getProgressColor(
                      selectedProgress.percentage
                    )} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold">
                      {selectedProgress.percentage}%
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-sm text-gray-300 block mb-2">
                    Date Updated
                  </span>
                  <div className="text-white font-medium">
                    {new Date(selectedProgress.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>

                {selectedProgress.note && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-sm text-gray-300 block mb-2">
                      Mentor's Note
                    </span>
                    <div className="text-white">{selectedProgress.note}</div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default ProjectProgressViewer;
