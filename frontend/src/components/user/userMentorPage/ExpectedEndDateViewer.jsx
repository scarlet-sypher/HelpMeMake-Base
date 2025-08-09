import React, { useState } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, AlertCircle, X } from "lucide-react";

const ExpectedEndDateViewer = ({ projectData, onUpdate }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Unset";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfirmEndDate = async () => {
    if (!projectData?.tempExpectedEndDate) return;

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/confirm-expected-end-date`,
        {
          projectId: projectData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onUpdate();
        setIsConfirming(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error confirming end date:", error);
      alert("Failed to confirm end date");
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysRemaining) => {
    if (daysRemaining === null) return "text-gray-400";
    if (daysRemaining < 0) return "text-red-400";
    if (daysRemaining <= 7) return "text-yellow-400";
    return "text-green-400";
  };

  const expectedEndDate = projectData?.expectedEndDate;
  const tempEndDate = projectData?.tempExpectedEndDate;
  const daysRemaining = getDaysRemaining(expectedEndDate);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Calendar className="mr-2 text-blue-400" size={24} />
          Project Timeline
        </h2>
        <div className="flex items-center space-x-2">
          <Clock className="text-blue-400" size={16} />
          <span className="text-sm text-blue-300 font-medium">
            {projectData?.status || "Active"}
          </span>
        </div>
      </div>

      {/* Date Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Start Date */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Start Date
            </span>
            <CheckCircle className="text-green-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">
            {formatDate(projectData?.startDate)}
          </div>
          <div className="text-xs text-green-300 mt-1">Project Started</div>
        </div>

        {/* Expected End Date */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Expected End
            </span>
            {expectedEndDate ? (
              <CheckCircle className="text-green-400" size={16} />
            ) : (
              <AlertCircle className="text-yellow-400" size={16} />
            )}
          </div>
          <div className={`text-lg font-bold ${getStatusColor(daysRemaining)}`}>
            {formatDate(expectedEndDate)}
          </div>
          {daysRemaining !== null && (
            <div className={`text-xs mt-1 ${getStatusColor(daysRemaining)}`}>
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : daysRemaining === 0
                ? "Due today"
                : `${Math.abs(daysRemaining)} days overdue`}
            </div>
          )}
        </div>

        {/* Actual End Date */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Actual End
            </span>
            {projectData?.actualEndDate ? (
              <CheckCircle className="text-green-400" size={16} />
            ) : (
              <Clock className="text-gray-400" size={16} />
            )}
          </div>
          <div className="text-lg font-bold text-white">
            {formatDate(projectData?.actualEndDate)}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {projectData?.actualEndDate ? "Project Completed" : "In Progress"}
          </div>
        </div>
      </div>

      {/* Mentor's Proposed Date Section */}
      {tempEndDate && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <AlertCircle className="text-yellow-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">New End Date Proposed</h3>
                <p className="text-sm text-yellow-200">
                  Your mentor has suggested a new timeline
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-yellow-300">Proposed Date:</span>
              <div className="text-lg font-bold text-white">
                {formatDate(tempEndDate)}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleConfirmEndDate}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Confirm Date</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {expectedEndDate && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Timeline Progress
            </span>
            <span className="text-sm font-bold text-blue-400">
              {(() => {
                const start = new Date(projectData?.startDate);
                const end = new Date(expectedEndDate);
                const now = new Date();
                const total = end - start;
                const elapsed = now - start;
                const progress = Math.max(
                  0,
                  Math.min(100, (elapsed / total) * 100)
                );
                return Math.round(progress);
              })()}
              %
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(() => {
                  const start = new Date(projectData?.startDate);
                  const end = new Date(expectedEndDate);
                  const now = new Date();
                  const total = end - start;
                  const elapsed = now - start;
                  const progress = Math.max(
                    0,
                    Math.min(100, (elapsed / total) * 100)
                  );
                  return progress;
                })()}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Status Information */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                projectData?.status === "Completed"
                  ? "bg-green-400"
                  : projectData?.status === "In Progress"
                  ? "bg-blue-400"
                  : "bg-yellow-400"
              }`}
            ></div>
            <span className="text-white font-medium">
              Status: {projectData?.status || "In Progress"}
            </span>
          </div>
          {!tempEndDate && !expectedEndDate && (
            <span className="text-xs text-gray-400">
              Waiting for mentor to set timeline
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpectedEndDateViewer;
