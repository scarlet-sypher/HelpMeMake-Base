import React, { useState } from "react";
import axios from "axios";
import { Send, XCircle, Star, User, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const RequestMentorModal = ({
  selectedMentor,
  setSelectedMentor,
  project,
  onRequestSent,
  API_URL,
  formatPrice,
}) => {
  const [message, setMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [error, setError] = useState("");

  // Handle sending mentor request
  const handleSendMentorRequest = async () => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters long");
      return;
    }

    try {
      setSendingRequest(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/requests/send`,
        {
          projectId: project._id,
          mentorId: selectedMentor._id,
          message: message.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(
          `Request sent to ${selectedMentor.userId?.name} successfully!`
        );
        setSelectedMentor(null);
        setMessage("");
        setError("");

        // Notify parent component that a request was sent
        if (onRequestSent) {
          onRequestSent(selectedMentor._id);
        }
      } else {
        setError(response.data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending mentor request:", error);

      if (error.response?.status === 409) {
        setError(
          "You have already sent a request to this mentor for this project"
        );
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid request data");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to send this request");
      } else {
        setError("Failed to send request. Please try again.");
      }
    } finally {
      setSendingRequest(false);
    }
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!selectedMentor) {
      setMessage("");
      setError("");
      setSendingRequest(false);
    }
  }, [selectedMentor]);

  if (!selectedMentor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Send className="mr-2 text-green-400" size={24} />
              Send Request to {selectedMentor.userId?.name}
            </h2>
            <button
              onClick={() => setSelectedMentor(null)}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={sendingRequest}
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Mentor Summary */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {selectedMentor.userId?.avatar ? (
                  <img
                    src={
                      selectedMentor.userId.avatar.startsWith("/uploads/")
                        ? `${API_URL}${selectedMentor.userId.avatar}`
                        : selectedMentor.userId.avatar
                    }
                    alt={selectedMentor.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold">
                  {selectedMentor.userId?.name}
                </h3>
                <p className="text-blue-300 text-sm">{selectedMentor.title}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Star className="text-yellow-400" size={12} />
                  <span>{selectedMentor.rating}</span>
                  <span>•</span>
                  <span>
                    {formatPrice(
                      selectedMentor.pricing.hourlyRate,
                      selectedMentor.pricing.currency
                    )}
                    /hr
                  </span>
                  <span>•</span>
                  <span>{selectedMentor.totalStudents} students</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white/5 rounded-xl p-3 mb-4">
            <h4 className="text-white font-semibold text-sm mb-1">
              For Project:
            </h4>
            <p className="text-blue-300 font-medium">{project.name}</p>
            <p className="text-gray-300 text-sm">{project.shortDescription}</p>
          </div>

          {/* Request Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Message to Mentor *
              </label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError(""); // Clear error when user starts typing
                }}
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                placeholder="Tell the mentor why you'd like to work with them, what you hope to learn, and any specific requirements for this project..."
                maxLength={2000}
                disabled={sendingRequest}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">
                  Minimum 10 characters required
                </span>
                <span className="text-xs text-gray-400">
                  {message.length}/2000
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex items-center space-x-2">
                <AlertCircle className="text-red-400 flex-shrink-0" size={16} />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setSelectedMentor(null)}
                disabled={sendingRequest}
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMentorRequest}
                disabled={
                  sendingRequest ||
                  !message.trim() ||
                  message.trim().length < 10
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {sendingRequest ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMentorModal;
