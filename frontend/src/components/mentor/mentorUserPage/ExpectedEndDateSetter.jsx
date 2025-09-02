import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
} from "lucide-react";

const ExpectedEndDateSetter = ({ projectData, onDataRefresh }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSetExpectedDate = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const selectedDateTime = new Date(selectedDate);
    const now = new Date();

    if (selectedDateTime <= now) {
      toast.error("End date must be in the future");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/set-expected-end-date`,
        {
          projectId: projectData._id,
          date: selectedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          "Expected end date set! Waiting for apprentice confirmation."
        );
        setSelectedDate("");
        onDataRefresh();
      } else {
        toast.error(response.data.message || "Failed to set expected end date");
      }
    } catch (error) {
      console.error("Error setting expected end date:", error);
      toast.error(
        error.response?.data?.message || "Failed to set expected end date"
      );
    } finally {
      setLoading(false);
    }
  };

  const isDateConfirmed =
    projectData?.expectedEndDate && projectData?.isTempEndDateConfirmed;
  const hasPendingDate =
    projectData?.tempExpectedEndDate && !projectData?.isTempEndDateConfirmed;

  if (projectData?.status !== "In Progress") {
    return null;
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Calendar className="mr-3 text-blue-400" size={28} />
              Expected End Date
            </h3>
            <p className="text-gray-300">
              Set the expected completion date for this project
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          {projectData?.startDate && (
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-300">Project Started</span>
              </div>
              <span className="text-white font-medium">
                {new Date(projectData.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {isDateConfirmed && (
            <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-xl border border-green-600/30">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-green-300">
                  Expected End Date (Confirmed)
                </span>
              </div>
              <span className="text-white font-medium">
                {new Date(projectData.expectedEndDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          )}

          {hasPendingDate && (
            <div className="flex items-center justify-between p-3 bg-yellow-900/30 rounded-xl border border-yellow-600/30">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-400 mr-3" />
                <span className="text-yellow-300">
                  Pending Apprentice Confirmation
                </span>
              </div>
              <span className="text-white font-medium">
                {new Date(projectData.tempExpectedEndDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          )}
        </div>

        {!isDateConfirmed && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Expected End Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleSetExpectedDate}
                disabled={!selectedDate || loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Set Date</span>
                  </>
                )}
              </button>
            </div>

            {hasPendingDate && (
              <div className="flex items-start p-4 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-300">
                  <p className="font-medium mb-1">
                    Waiting for Apprentice Confirmation
                  </p>
                  <p>
                    Your apprentice needs to confirm the expected end date
                    before it becomes official. You can update it until they
                    confirm.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {isDateConfirmed && (
          <div className="flex items-start p-4 bg-green-900/20 rounded-xl border border-green-600/30">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-300">
              <p className="font-medium mb-1">End Date Confirmed</p>
              <p>
                The expected end date has been confirmed by your apprentice and
                cannot be changed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpectedEndDateSetter;
