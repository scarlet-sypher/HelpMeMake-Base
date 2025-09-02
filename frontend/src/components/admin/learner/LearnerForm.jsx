import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  MapPin,
  FileText,
  Award,
  Activity,
  Github,
  Linkedin,
  Twitter,
  Target,
  Camera,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LearnerForm({ onReturn }) {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",

    title: "",
    description: "",
    location: "",
    level: 0,
    xp: 0,
    isOnline: false,
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (learnerId) {
      fetchLearnerData();
    } else {
      setLoading(false);
    }
  }, [learnerId]);

  const fetchLearnerData = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners/${learnerId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        const learner = data.data;
        setFormData({
          name: learner.name || "",
          email: learner.email || "",
          avatar: learner.avatar || "",
          title: learner.learnerDetails?.title || "",
          description: learner.learnerDetails?.description || "",
          location: learner.learnerDetails?.location || "",
          level: learner.learnerDetails?.level || 0,
          xp: learner.learnerDetails?.xp || 0,
          isOnline: learner.learnerDetails?.isOnline || false,
          socialLinks: {
            github: learner.learnerDetails?.socialLinks?.github || "",
            linkedin: learner.learnerDetails?.socialLinks?.linkedin || "",
            twitter: learner.learnerDetails?.socialLinks?.twitter || "",
          },
        });
      } else {
        toast.error(data.message || "Failed to fetch learner data");
        navigate("/admin/learners");
      }
    } catch (error) {
      console.error("Fetch learner error:", error);
      toast.error("Failed to fetch learner data");
      navigate("/admin/learners");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.level < 0) {
      newErrors.level = "Level cannot be negative";
    }

    if (formData.xp < 0) {
      newErrors.xp = "XP cannot be negative";
    }

    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (
      formData.socialLinks.github &&
      formData.socialLinks.github !== "#" &&
      !urlPattern.test(formData.socialLinks.github)
    ) {
      newErrors.github = "Invalid GitHub URL";
    }

    if (
      formData.socialLinks.linkedin &&
      formData.socialLinks.linkedin !== "#" &&
      !urlPattern.test(formData.socialLinks.linkedin)
    ) {
      newErrors.linkedin = "Invalid LinkedIn URL";
    }

    if (
      formData.socialLinks.twitter &&
      formData.socialLinks.twitter !== "#" &&
      !urlPattern.test(formData.socialLinks.twitter)
    ) {
      newErrors.twitter = "Invalid Twitter URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("socialLinks.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners/${learnerId}/avatar`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: formDataUpload,
        }
      );

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          avatar: data.data.avatar,
        }));
        toast.success("Avatar updated successfully");
      } else {
        toast.error(data.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setSaving(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners/${learnerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Learner updated successfully");
        navigate("/admin/learners");
      } else {
        toast.error(data.message || "Failed to update learner");
      }
    } catch (error) {
      console.error("Update learner error:", error);
      toast.error("Failed to update learner");
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate("/admin/learners");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading learner data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReturn}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Learner</h1>
              <p className="text-slate-400">
                Update learner information and settings
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReturn}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Camera className="mr-2" size={20} />
              Profile Picture
            </h2>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={formData.avatar || "/uploads/public/default.jpg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-slate-600"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !learnerId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>{uploading ? "Uploading..." : "Change Avatar"}</span>
                </button>
                <p className="text-xs text-slate-400 mt-2">
                  JPG, PNG, WebP up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.name ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.email ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.title ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                  placeholder="e.g., Student, Developer"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.location ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-slate-700 border ${
                  errors.description ? "border-red-500" : "border-slate-600"
                } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress & Stats */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Award className="mr-2" size={20} />
              Progress & Stats
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Level
                </label>
                <input
                  type="number"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.level ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                />
                {errors.level && (
                  <p className="text-red-400 text-sm mt-1">{errors.level}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience Points (XP)
                </label>
                <input
                  type="number"
                  name="xp"
                  value={formData.xp}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 bg-slate-700 border ${
                    errors.xp ? "border-red-500" : "border-slate-600"
                  } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                />
                {errors.xp && (
                  <p className="text-red-400 text-sm mt-1">{errors.xp}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline}
                  onChange={handleInputChange}
                  className="w-5 h-5 bg-slate-700 border border-slate-600 rounded focus:ring-blue-500 text-blue-600"
                />
                <label className="text-sm font-medium text-slate-300">
                  Currently Online
                </label>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Activity className="mr-2" size={20} />
              Social Links
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Github size={20} className="text-slate-400" />
                <div className="flex-1">
                  <input
                    type="url"
                    name="socialLinks.github"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-700 border ${
                      errors.github ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                    placeholder="GitHub profile URL"
                  />
                  {errors.github && (
                    <p className="text-red-400 text-sm mt-1">{errors.github}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Linkedin size={20} className="text-slate-400" />
                <div className="flex-1">
                  <input
                    type="url"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-700 border ${
                      errors.linkedin ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                    placeholder="LinkedIn profile URL"
                  />
                  {errors.linkedin && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.linkedin}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Twitter size={20} className="text-slate-400" />
                <div className="flex-1">
                  <input
                    type="url"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-700 border ${
                      errors.twitter ? "border-red-500" : "border-slate-600"
                    } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500`}
                    placeholder="Twitter profile URL"
                  />
                  {errors.twitter && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.twitter}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleReturn}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              <Save size={18} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
