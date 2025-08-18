import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Send,
  X,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Folder,
} from "lucide-react";
import { toast } from "../../../utils/toastNew";

const RequestModal = ({ mentor, project, onClose, onRequestSent, API_URL }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
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
        setTimeout(() => {
          handleClose();
        }, 500);
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

  const getCharacterCountColor = () => {
    if (message.length < 10) return "text-red-400";
    if (message.length > 1900) return "text-yellow-400";
    return "text-green-400";
  };

  const getCharacterCountText = () => {
    if (message.length < 10) return `${10 - message.length} more needed`;
    return `${message.length}/2000`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible
          ? "bg-black/70 backdrop-blur-xl"
          : "bg-black/0 backdrop-blur-none"
      }`}
    >
      {/* Enhanced backdrop with animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/20 to-purple-900/20" />

      {/* Modal container with enhanced styling */}
      <div
        className={`relative w-full max-w-lg transform transition-all duration-500 ${
          isVisible
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-8 opacity-0"
        }`}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-70" />

        {/* Main modal */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header with enhanced design */}
          <div className="relative p-6 border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Send Request</h2>
                  <p className="text-slate-400 text-sm">
                    Connect with your mentor
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="group p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Enhanced mentor info card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
              <div className="relative p-4 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center overflow-hidden">
                      {mentor.userId?.avatar ? (
                        <img
                          src={
                            mentor.userId.avatar.startsWith("/uploads/")
                              ? `${API_URL}${mentor.userId.avatar}`
                              : mentor.userId.avatar
                          }
                          alt={mentor.userId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-white w-7 h-7" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {mentor.userId?.name || "Anonymous Mentor"}
                    </h3>
                    <p className="text-blue-300 text-sm truncate mb-1">
                      {mentor.title}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs font-medium">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced project info */}
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                  <Folder className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-cyan-300 text-sm font-medium">
                    Selected Project
                  </p>
                  <p className="text-white font-semibold truncate">
                    {project.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced form */}
            <form onSubmit={handleSendRequest} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-white text-sm font-medium">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span>Your Message</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    {message.length >= 10 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${getCharacterCountColor()}`}
                    >
                      {getCharacterCountText()}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'm interested in working with you on my project. I'd love to discuss how your expertise can help me achieve my goals..."
                    rows={5}
                    maxLength={2000}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none backdrop-blur-sm"
                    required
                  />
                  <div className="absolute bottom-3 right-3">
                    <div
                      className={`w-3 h-3 rounded-full transition-colors ${
                        message.length >= 10 ? "bg-green-400" : "bg-red-400"
                      } ${message.length >= 10 ? "animate-pulse" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-2xl font-medium transition-all border border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || message.trim().length < 10}
                  className="group flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-2xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span>Send Request</span>
                      <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom gradient accent */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
