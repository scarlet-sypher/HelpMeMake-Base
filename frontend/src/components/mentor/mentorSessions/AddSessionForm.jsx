import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  User,
  Video,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react";

const AddSessionForm = ({ activeProject, onClose, onSuccess, onToast }) => {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    sessionType: "one-on-one",
    scheduledAt: "",
    prerequisites: "",
    meetingLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
    }

    if (!formData.topic.trim()) {
      newErrors.topic = "Session topic is required";
    }

    if (!formData.scheduledAt) {
      newErrors.scheduledAt = "Schedule date and time is required";
    } else {
      const selectedDate = new Date(formData.scheduledAt);
      const minDate = new Date();
      minDate.setMinutes(minDate.getMinutes() + 1);

      if (selectedDate <= minDate) {
        newErrors.scheduledAt =
          "Session must be scheduled at least 1 minute from now";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sessions/mentor`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        onToast({
          message: "Session scheduled successfully",
          status: "success",
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating session:", error);
      if (error.response?.data?.message) {
        onToast({ message: error.response.data.message, status: "error" });
      } else {
        onToast({
          message: "Failed to create session. Please try again.",
          status: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const learner = activeProject?.learnerId?.userId || activeProject?.learnerId;

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";
    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }
    return avatar;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      data-modal="edit-session"
      tabIndex={-1}
    >
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
              <Plus className="text-white" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Schedule New Session
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                Plan a mentoring session with your learner
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

        {/* Learner Info */}
        {learner && (
          <div className="p-4 sm:p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center space-x-4">
              <img
                src={getAvatarUrl(learner.avatar)}
                alt={learner.name || "Learner"}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-cyan-400/50 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                  Session with {learner.name || "Unknown Learner"}
                </h3>
                <p className="text-cyan-200 text-xs sm:text-sm truncate">
                  Project: {activeProject?.name || "Unknown Project"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Session Title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Session Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <BookOpen
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., React Components Deep Dive"
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.title && (
              <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Session Topic */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Topic <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., JavaScript, React, Node.js"
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.topic && (
              <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1 flex-shrink-0" />
                <span>{errors.topic}</span>
              </p>
            )}
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Session Type
            </label>
            <select
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="one-on-one" className="bg-gray-800">
                One-on-One
              </option>
              <option value="group" className="bg-gray-800">
                Group Session
              </option>
              <option value="code-review" className="bg-gray-800">
                Code Review
              </option>
              <option value="workshop" className="bg-gray-800">
                Workshop
              </option>
            </select>
          </div>

          {/* Schedule DateTime */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Date & Time <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                min={getMinDateTime()}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            {errors.scheduledAt && (
              <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-start">
                <AlertCircle size={14} className="mr-1 flex-shrink-0 mt-0.5" />
                <span>{errors.scheduledAt}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what will be covered in this session..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Prerequisites/Notes for Learner
            </label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                placeholder="Any preparation needed, materials to review, etc..."
                rows={2}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Meeting Link
            </label>
            <div className="relative">
              <Video
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/... or Google Meet link"
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
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
              className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Scheduling...
                </div>
              ) : (
                "Schedule Session"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSessionForm;
