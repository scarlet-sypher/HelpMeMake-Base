import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, RotateCcw, Calendar, AlertCircle, Clock } from "lucide-react";

const RescheduleModal = ({ session, onClose, onSuccess }) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const modalElement = document.querySelector('[data-modal="edit-session"]');
    if (modalElement) {
      modalElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      modalElement.focus();
    }
  }, []);

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const formatCurrentDateTime = () => {
    const date = new Date(session.scheduledAt);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleChange = (e) => {
    setScheduledAt(e.target.value);
    if (error) {
      setError("");
    }
  };

  const validateDateTime = () => {
    if (!scheduledAt) {
      setError("New date and time is required");
      return false;
    }

    const selectedDate = new Date(scheduledAt);
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 1);

    if (selectedDate <= minDate) {
      setError("Session must be scheduled at least 1 hour from now");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDateTime()) {
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `${apiUrl}/api/sessions/mentor/${session._id}/reschedule`,
        { scheduledAt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error rescheduling session:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to reschedule session. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[70]"
      data-modal="edit-session"
      tabIndex={-1}
    >
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
              <RotateCcw className="text-white" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Reschedule Session
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                Choose a new date and time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="mb-4">
            <h3 className="text-white font-semibold mb-2 text-sm sm:text-base truncate">
              {session.title}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mb-3 truncate">
              {session.topic}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="text-amber-400 flex-shrink-0" size={14} />
              <span className="text-gray-300">Current time:</span>
            </div>
            <span className="text-white font-medium text-xs sm:text-sm break-all sm:break-normal">
              {formatCurrentDateTime()}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              New Date & Time <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={handleChange}
                min={getMinDateTime()}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-start">
                <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="p-3 sm:p-4 bg-amber-500/20 rounded-xl border border-amber-500/30">
            <div className="flex items-start space-x-3">
              <AlertCircle
                className="text-amber-300 flex-shrink-0 mt-0.5"
                size={16}
              />
              <div className="text-amber-200 text-xs sm:text-sm">
                <p className="font-medium mb-1">Please note:</p>
                <ul className="text-xs space-y-1">
                  <li>• The learner will be notified of the schedule change</li>
                  <li>• Session status will be updated to "Rescheduled"</li>
                  <li>• Both attendance records will be reset</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Rescheduling...
                </div>
              ) : (
                "Reschedule Session"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
