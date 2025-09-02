import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Star,
  Users,
  Clock,
  DollarSign,
  Award,
  Link,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const MentorForm = () => {
  const navigate = useNavigate();
  const { mentorId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",

    title: "",
    description: "",
    bio: "",
    location: "",

    experience: {
      years: 0,
      companies: [],
    },

    expertise: [],
    specializations: [],

    isOnline: false,
    isAvailable: true,

    rating: 0,
    totalReviews: 0,

    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      portfolio: "",
      blog: "",
    },

    completedSessions: 0,
    totalStudents: 0,
    responseTime: 30,
    achievements: 0,

    pricing: {
      hourlyRate: 0,
      currency: "USD",
      freeSessionsOffered: 1,
    },

    profileCompleteness: 20,
    onboardingCompleted: false,

    notificationPreferences: {
      email: true,
      push: true,
      sessionRequests: true,
      weeklyReports: true,
      marketingUpdates: false,
      profileUpdates: true,
      socialLinkUpdates: false,
    },
  });

  const [newExpertise, setNewExpertise] = useState({
    skill: "",
    level: "intermediate",
    yearsOfExperience: 0,
  });
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newCompany, setNewCompany] = useState({
    name: "",
    position: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    if (mentorId) {
      fetchMentorData();
    } else {
      setLoading(false);
    }
  }, [mentorId]);

  const fetchMentorData = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        const mentor = data.data;
        setFormData({
          name: mentor.userId?.name || "",
          email: mentor.userId?.email || "",
          avatar: mentor.userId?.avatar || "",

          title: mentor.title || "Software Engineer",
          description:
            mentor.description ||
            "Passionate about helping others learn and grow",
          bio:
            mentor.bio || "Experienced professional ready to share knowledge",
          location: mentor.location || "Remote",

          experience: mentor.experience || { years: 0, companies: [] },
          expertise: mentor.expertise || [],
          specializations: mentor.specializations || [],

          isOnline: mentor.isOnline || false,
          isAvailable:
            mentor.isAvailable !== undefined ? mentor.isAvailable : true,

          rating: mentor.rating || 0,
          totalReviews: mentor.totalReviews || 0,

          socialLinks: {
            linkedin: mentor.socialLinks?.linkedin || "",
            github: mentor.socialLinks?.github || "",
            twitter: mentor.socialLinks?.twitter || "",
            portfolio: mentor.socialLinks?.portfolio || "",
            blog: mentor.socialLinks?.blog || "",
          },

          completedSessions: mentor.completedSessions || 0,
          totalStudents: mentor.totalStudents || 0,
          responseTime: mentor.responseTime || 30,
          achievements: mentor.achievements || 0,

          pricing: {
            hourlyRate: mentor.pricing?.hourlyRate || 0,
            currency: mentor.pricing?.currency || "USD",
            freeSessionsOffered: mentor.pricing?.freeSessionsOffered || 1,
          },

          profileCompleteness: mentor.profileCompleteness || 20,
          onboardingCompleted: mentor.onboardingCompleted || false,

          notificationPreferences: {
            email: mentor.notificationPreferences?.email !== false,
            push: mentor.notificationPreferences?.push !== false,
            sessionRequests:
              mentor.notificationPreferences?.sessionRequests !== false,
            weeklyReports:
              mentor.notificationPreferences?.weeklyReports !== false,
            marketingUpdates:
              mentor.notificationPreferences?.marketingUpdates || false,
            profileUpdates:
              mentor.notificationPreferences?.profileUpdates !== false,
            socialLinkUpdates:
              mentor.notificationPreferences?.socialLinkUpdates || false,
          },
        });
      } else {
        toast.error(data.message || "Failed to fetch mentor data");
        navigate("/admin/mentors");
      }
    } catch (error) {
      console.error("Fetch mentor error:", error);
      toast.error("Failed to load mentor data");
      navigate("/admin/mentors");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [nested]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayAdd = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addExpertise = () => {
    if (!newExpertise.skill.trim()) {
      toast.error("Please enter a skill");
      return;
    }
    handleArrayAdd("expertise", { ...newExpertise });
    setNewExpertise({ skill: "", level: "intermediate", yearsOfExperience: 0 });
  };

  const addSpecialization = () => {
    if (!newSpecialization.trim()) {
      toast.error("Please enter a specialization");
      return;
    }
    handleArrayAdd("specializations", newSpecialization.trim());
    setNewSpecialization("");
  };

  const addCompany = () => {
    if (!newCompany.name.trim() || !newCompany.position.trim()) {
      toast.error("Please enter company name and position");
      return;
    }
    const updatedExperience = {
      ...formData.experience,
      companies: [...formData.experience.companies, { ...newCompany }],
    };
    setFormData((prev) => ({ ...prev, experience: updatedExperience }));
    setNewCompany({ name: "", position: "", duration: "", description: "" });
  };

  const removeCompany = (index) => {
    const updatedExperience = {
      ...formData.experience,
      companies: formData.experience.companies.filter((_, i) => i !== index),
    };
    setFormData((prev) => ({ ...prev, experience: updatedExperience }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors/${mentorId}/avatar`,
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
        setFormData((prev) => ({ ...prev, avatar: data.data.avatar }));
        toast.success("Profile picture updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors/${mentorId}`,
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
        toast.success("Mentor updated successfully");
        navigate("/admin/mentors");
      } else {
        toast.error(data.message || "Failed to update mentor");
      }
    } catch (error) {
      console.error("Save mentor error:", error);
      toast.error("Failed to save mentor data");
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = () => {
    navigate("/admin/mentors");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading mentor data...</div>
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
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {mentorId ? "Edit Mentor" : "Add Mentor"}
              </h1>
              <p className="text-slate-400">
                Manage mentor profile and settings
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleReturn}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Basic Info */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Picture
              </h3>

              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={formData.avatar || "/uploads/public/default.jpg"}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30"
                  />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <label className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload New Picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>
            </div>

            {/* Status Settings */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">
                Status & Availability
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Online Status</span>
                  <button
                    onClick={() =>
                      handleInputChange("isOnline", !formData.isOnline)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isOnline ? "bg-green-600" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isOnline ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Available for Sessions</span>
                  <button
                    onClick={() =>
                      handleInputChange("isAvailable", !formData.isAvailable)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isAvailable ? "bg-green-600" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isAvailable ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Onboarding Completed</span>
                  <button
                    onClick={() =>
                      handleInputChange(
                        "onboardingCompleted",
                        !formData.onboardingCompleted
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.onboardingCompleted
                        ? "bg-green-600"
                        : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.onboardingCompleted
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Professional Details */}
          <div className="space-y-6">
            {/* Description & Bio */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Professional Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Brief description of expertise..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Detailed Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 h-32 resize-none"
                    placeholder="Detailed professional biography..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience.years}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        parseInt(e.target.value) || 0,
                        "years"
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Expertise
              </h3>

              {/* Add New Expertise */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <input
                  type="text"
                  value={newExpertise.skill}
                  onChange={(e) =>
                    setNewExpertise((prev) => ({
                      ...prev,
                      skill: e.target.value,
                    }))
                  }
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Skill name"
                />
                <select
                  value={newExpertise.level}
                  onChange={(e) =>
                    setNewExpertise((prev) => ({
                      ...prev,
                      level: e.target.value,
                    }))
                  }
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                <button
                  onClick={addExpertise}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Expertise List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.expertise.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-700 p-2 rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-white font-medium">
                        {exp.skill}
                      </span>
                      <span className="text-slate-400 text-sm ml-2">
                        ({exp.level})
                      </span>
                    </div>
                    <button
                      onClick={() => handleArrayRemove("expertise", index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">
                Specializations
              </h3>

              {/* Add New Specialization */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Add specialization"
                />
                <button
                  onClick={addSpecialization}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Specializations List */}
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                  >
                    {spec}
                    <button
                      onClick={() =>
                        handleArrayRemove("specializations", index)
                      }
                      className="ml-2 text-blue-300 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Metrics & Settings */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Performance Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) =>
                      handleInputChange(
                        "rating",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Reviews
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalReviews}
                    onChange={(e) =>
                      handleInputChange(
                        "totalReviews",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Completed Sessions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.completedSessions}
                    onChange={(e) =>
                      handleInputChange(
                        "completedSessions",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Total Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalStudents}
                    onChange={(e) =>
                      handleInputChange(
                        "totalStudents",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Response Time (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.responseTime}
                    onChange={(e) =>
                      handleInputChange(
                        "responseTime",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Achievements
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.achievements}
                    onChange={(e) =>
                      handleInputChange(
                        "achievements",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Hourly Rate
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.hourlyRate}
                      onChange={(e) =>
                        handleInputChange(
                          "pricing",
                          parseFloat(e.target.value) || 0,
                          "hourlyRate"
                        )
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.pricing.currency}
                      onChange={(e) =>
                        handleInputChange("pricing", e.target.value, "currency")
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Free Sessions Offered
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pricing.freeSessionsOffered}
                    onChange={(e) =>
                      handleInputChange(
                        "pricing",
                        parseInt(e.target.value) || 0,
                        "freeSessionsOffered"
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Social Links
              </h3>

              <div className="space-y-4">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                      {platform}
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        handleInputChange(
                          "socialLinks",
                          e.target.value,
                          platform
                        )
                      }
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                      placeholder={`Enter ${platform} URL`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">
                Profile Completion
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">
                      Completion Percentage
                    </span>
                    <span className="text-blue-400">
                      {formData.profileCompleteness}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${formData.profileCompleteness}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Manual Override (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.profileCompleteness}
                    onChange={(e) =>
                      handleInputChange(
                        "profileCompleteness",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorForm;
