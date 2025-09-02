import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, XCircle, AlertTriangle, Type } from "lucide-react";

const CancelConfirmModal = ({ session, onClose, onSuccess }) => {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const CONFIRM_TEXT = "cancel";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmText.toLowerCase() !== CONFIRM_TEXT) {
      setError(`Please type "${CONFIRM_TEXT}" to confirm cancellation`);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `${apiUrl}/api/sessions/mentor/${session._id}/status`,
        {
          status: "cancelled",
          reason: reason.trim() || "Cancelled by mentor",
        },
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
      console.error("Error cancelling session:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to cancel session. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTextChange = (e) => {
    setConfirmText(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-[70] "
      data-modal="edit-session"
      tabIndex={-1}
    >
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
              <XCircle className="text-white" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Cancel Session
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                This action cannot be undone
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
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base truncate">
            {session.title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mb-2 truncate">
            {session.topic}
          </p>
          <p className="text-gray-400 text-xs">
            Scheduled for:{" "}
            {new Date(session.scheduledAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="p-3 sm:p-4 bg-red-500/20 rounded-xl border border-red-500/30">
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className="text-red-300 flex-shrink-0 mt-0.5"
                size={16}
              />
              <div className="text-red-200 text-xs sm:text-sm">
                <p className="font-medium mb-2">
                  Warning: Session Cancellation
                </p>
                <ul className="text-xs space-y-1">
                  <li>• The learner will be notified immediately</li>
                  <li>
                    • Session status will be permanently set to "Cancelled"
                  </li>
                  <li>• You can delete this session after cancellation</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              placeholder="Let the learner know why you're cancelling..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Type "
              <span className="text-red-400 font-bold">{CONFIRM_TEXT}</span>" to
              confirm cancellation
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={confirmText}
                onChange={handleConfirmTextChange}
                placeholder={CONFIRM_TEXT}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-start">
                <AlertTriangle
                  size={14}
                  className="mr-1 flex-shrink-0 mt-0.5"
                />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Keep Session
            </button>
            <button
              type="submit"
              disabled={loading || confirmText.toLowerCase() !== CONFIRM_TEXT}
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Cancelling...
                </div>
              ) : (
                "Cancel Session"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelConfirmModal;
