import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  Shield,
  MapPin,
  Briefcase,
  FileText,
  Link,
  Github,
  Linkedin,
  Twitter,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";

const UserForm = ({ userId, onSave, onCancel }) => {
  const [userData, setUserData] = useState({
    // Base user fields
    name: "",
    email: "",
    role: "",
    isEmailVerified: false,
    isAccountActive: false,
    authProvider: "local",
    password: "",

    // Role-specific fields
    title: "",
    description: "",
    location: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },

    // Mentor-specific fields
    expertise: [],
    experience: "",
    hourlyRate: "",
    availability: {
      monday: { available: false, hours: "" },
      tuesday: { available: false, hours: "" },
      wednesday: { available: false, hours: "" },
      thursday: { available: false, hours: "" },
      friday: { available: false, hours: "" },
      saturday: { available: false, hours: "" },
      sunday: { available: false, hours: "" },
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData({
        ...userData,
        ...data.data,
        password: "", // Don't pre-fill password
        socialLinks: {
          github: data.data.socialLinks?.github || "",
          linkedin: data.data.socialLinks?.linkedin || "",
          twitter: data.data.socialLinks?.twitter || "",
        },
        availability: data.data.availability || userData.availability,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setUserData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setUserData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value,
        },
      },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!userData.role) {
      newErrors.role = "Role is required";
    }

    if (userData.password && userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");

      // Update user data
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/users/${userId}/avatar`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!avatarResponse.ok) {
          console.error("Failed to update avatar");
        }
      }

      onSave();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrors({ submit: "Failed to save user data" });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading user data...</div>
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
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Return</span>
            </button>
            <h1 className="text-3xl font-bold text-white">
              {userId ? "Edit User" : "Create User"}
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="mr-2" />
              Profile Picture
            </h2>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={
                    avatarPreview ||
                    userData.avatar ||
                    "/uploads/public/default.jpg"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-600"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload size={16} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="text-slate-300">
                <p className="text-sm">
                  Click the upload icon to change profile picture
                </p>
                <p className="text-xs mt-1">
                  Supported formats: JPG, PNG, WebP (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <User className="mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role *
                </label>
                <select
                  value={userData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Role</option>
                  <option value="user">Learner</option>
                  <option value="mentor">Mentor</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auth Provider
                </label>
                <select
                  value={userData.authProvider}
                  onChange={(e) =>
                    handleInputChange("authProvider", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="local">Local</option>
                  <option value="google">Google</option>
                  <option value="github">GitHub</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Account Status
              </h3>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userData.isEmailVerified}
                    onChange={(e) =>
                      handleInputChange("isEmailVerified", e.target.checked)
                    }
                    className="rounded bg-slate-700 border-slate-600"
                  />
                  <span className="text-slate-300">Email Verified</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userData.isAccountActive}
                    onChange={(e) =>
                      handleInputChange("isAccountActive", e.target.checked)
                    }
                    className="rounded bg-slate-700 border-slate-600"
                  />
                  <span className="text-slate-300">Account Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Briefcase className="mr-2" />
              Profile Details
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title/Profession
                </label>
                <input
                  type="text"
                  value={userData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter title or profession"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={userData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Link className="mr-2" />
              Social Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Github className="mr-2" size={16} />
                  GitHub
                </label>
                <input
                  type="url"
                  value={userData.socialLinks.github}
                  onChange={(e) =>
                    handleSocialLinkChange("github", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="GitHub profile URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Linkedin className="mr-2" size={16} />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={userData.socialLinks.linkedin}
                  onChange={(e) =>
                    handleSocialLinkChange("linkedin", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                  <Twitter className="mr-2" size={16} />
                  Twitter
                </label>
                <input
                  type="url"
                  value={userData.socialLinks.twitter}
                  onChange={(e) =>
                    handleSocialLinkChange("twitter", e.target.value)
                  }
                  className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Twitter profile URL"
                />
              </div>
            </div>
          </div>

          {/* Mentor-specific fields */}
          {userData.role === "mentor" && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Star className="mr-2" />
                Mentor Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Experience (years)
                  </label>
                  <input
                    type="text"
                    value={userData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="text"
                    value={userData.hourlyRate}
                    onChange={(e) =>
                      handleInputChange("hourlyRate", e.target.value)
                    }
                    className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hourly rate"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-4">
              <p className="text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={loading}
            >
              <Save size={20} />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
