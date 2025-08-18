import React, { useState } from "react";
import axios from "axios";
import { User, Send, XCircle } from "lucide-react";
// import { toast } from "../../../utils/toastNew";

const RequestModal = ({ mentor, project, onClose, onRequestSent, API_URL }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = {
    show: (message, type = "info") => {
      const colors = {
        error: "bg-red-500",
        info: "bg-blue-500",
        success: "bg-green-500",
      };

      // Create wrapper container for stacking
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
        document.body.appendChild(container);
      }

      // Create toast element
      const toastEl = document.createElement("div");
      toastEl.className = `
      ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg 
      transform translate-x-[120%] transition-transform duration-300
      max-w-xs w-full
    `;
      toastEl.textContent = message;
      container.appendChild(toastEl);

      // Animate in
      setTimeout(() => {
        toastEl.style.transform = "translateX(0)";
      }, 10);

      // Animate out and remove
      setTimeout(() => {
        toastEl.style.transform = "translateX(120%)";
        setTimeout(() => {
          if (toastEl.parentNode) {
            container.removeChild(toastEl);
          }
        }, 300);
      }, 3000);
    },

    error: (message) => toast.show(message, "error"),
    info: (message) => toast.show(message, "info"),
    success: (message) => toast.show(message, "success"),
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/requests/send`,
        {
          projectId: project._id,
          mentorId: mentor._id,
          message: message.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(`Request sent to ${mentor.userId?.name} successfully!`);
        onRequestSent(mentor._id);
        onClose();
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.info(
          "You have already sent a request to this mentor for this project."
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to send request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl border border-white/20 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Send Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                {mentor.userId?.avatar ? (
                  <img
                    src={
                      mentor.userId.avatar.startsWith("/uploads/")
                        ? `${API_URL}${mentor.userId.avatar}`
                        : mentor.userId.avatar
                    }
                    alt={mentor.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">
                  {mentor.userId?.name || "Anonymous Mentor"}
                </h3>
                <p className="text-blue-300 text-sm truncate">{mentor.title}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-gray-300 text-sm">
                <span className="font-medium text-white">Project:</span>{" "}
                {project.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSendRequest} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Your Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like this mentor for your project..."
                rows={4}
                maxLength={2000}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                required
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-400">
                  Minimum 10 characters required
                </p>
                <p
                  className={`text-xs ${
                    message.length > 1900 ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  {message.length}/2000
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || message.trim().length < 10}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/25"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
