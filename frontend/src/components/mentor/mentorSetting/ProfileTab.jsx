import React, { useState } from "react";
import {
  User,
  Camera,
  Upload,
  Loader,
  Save,
  Zap,
  Mail,
  MapPin,
  Shield,
  X,
  Info,
  DollarSign,
  FileText,
} from "lucide-react";
import axios from "axios";

const ProfileTab = ({
  profileData,
  setProfileData,
  imagePreview,
  setImagePreview,
  profileImage,
  setProfileImage,
  handleProfileUpdate,
  handleAvatarUpload,
  handleImageChange,
  loadingStates,
  notifications,
  indianStates,
  showNotification,
}) => {
  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    otp: ["", "", "", "", "", ""],
    isSubmitting: false,
    isResending: false,
    countdown: 0,
    pendingData: null,
  });

  const [sendingOTP, setSendingOTP] = useState(false);

  const [showEmailTooltip, setShowEmailTooltip] = useState(false);

  const professionalTitles = [
    "Software Development Engineer (SDE)",
    "Senior Software Engineer",
    "Lead Developer",
    "Tech Lead",
    "Solution Architect",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Data Scientist",
    "ML Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Engineering Manager",
    "CTO",
    "Consultant",
    "Freelancer",
    "Other",
  ];

  const startCountdown = () => {
    setOtpModal((prev) => ({ ...prev, countdown: 60 }));
    const timer = setInterval(() => {
      setOtpModal((prev) => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 6) return;

    if (value.length > 1) {
      const pasteDigits = value.split("").slice(0, 6);
      const newOtp = [...otpModal.otp];
      for (let i = 0; i < pasteDigits.length; i++) {
        newOtp[i] = pasteDigits[i];
      }
      setOtpModal((prev) => ({ ...prev, otp: newOtp }));

      const nextIndex = pasteDigits.length < 6 ? pasteDigits.length : 5;
      const nextInput = document.getElementById(
        `mentor-profile-otp-${nextIndex}`
      );
      if (nextInput) nextInput.focus();
      return;
    }

    const newOtp = [...otpModal.otp];
    newOtp[index] = value;
    setOtpModal((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `mentor-profile-otp-${index + 1}`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpModal.otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `mentor-profile-otp-${index - 1}`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const sendProfileOTP = async (formData) => {
    setSendingOTP(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${apiUrl}/mentor/send-profile-otp`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setOtpModal((prev) => ({
          ...prev,
          isOpen: true,
          pendingData: formData,
          otp: ["", "", "", "", "", ""],
        }));
        startCountdown();
        showNotification(
          "profile",
          "success",
          "Verification code sent to your email!"
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showNotification("profile", "error", "Failed to send verification code");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpModal.countdown > 0) return;

    setOtpModal((prev) => ({ ...prev, isResending: true }));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(
        `${apiUrl}/mentor/send-profile-otp`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        showNotification("profile", "success", "New verification code sent!");
        setOtpModal((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
        startCountdown();
      }
    } catch (error) {
      showNotification(
        "profile",
        "error",
        "Failed to resend verification code"
      );
    } finally {
      setOtpModal((prev) => ({ ...prev, isResending: false }));
    }
  };

  const verifyOTPAndUpdate = async () => {
    const otpString = otpModal.otp.join("");
    if (otpString.length !== 6) {
      showNotification("profile", "error", "Please enter all 6 digits");
      return;
    }

    setOtpModal((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.patch(
        `${apiUrl}/mentor/verify-profile-update`,
        {
          otp: otpString,
          profileData: {
            name: otpModal.pendingData.name,
            email: otpModal.pendingData.email,
            title: otpModal.pendingData.title,
            bio: otpModal.pendingData.bio,
            description: otpModal.pendingData.description,
            location: otpModal.pendingData.location,
            pricing: otpModal.pendingData.pricing,
          },
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        showNotification("profile", "success", "Profile updated successfully!");
        setOtpModal({
          isOpen: false,
          otp: ["", "", "", "", "", ""],
          isSubmitting: false,
          isResending: false,
          countdown: 0,
          pendingData: null,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showNotification(
        "profile",
        "error",
        error.response?.data?.message || "Invalid verification code"
      );
      setOtpModal((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
    } finally {
      setOtpModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleProfileUpdateWithOTP = async (e) => {
    e.preventDefault();

    await sendProfileOTP(profileData);
  };

  const closeOtpModal = () => {
    setOtpModal({
      isOpen: false,
      otp: ["", "", "", "", "", ""],
      isSubmitting: false,
      isResending: false,
      countdown: 0,
      pendingData: null,
    });
  };

  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;

    return (
      <div
        className={`relative overflow-hidden p-4 rounded-2xl mb-6 flex items-center space-x-3 backdrop-blur-sm border transition-all duration-500 animate-slide-in ${
          notification.status === "success"
            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-100 shadow-cyan-500/20"
            : "bg-red-500/10 border-red-500/30 text-red-100 shadow-red-500/20"
        } shadow-xl`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r opacity-10 animate-pulse"
          style={{
            background:
              notification.status === "success"
                ? "linear-gradient(45deg, #06b6d4, #0891b2)"
                : "linear-gradient(45deg, #ef4444, #dc2626)",
          }}
        />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === "success" ? (
            <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <span className="font-medium text-sm sm:text-base">
            {notification.message}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Only show notifications when modal is NOT open */}
      {!otpModal.isOpen && (
        <>
          <NotificationComponent notification={notifications.profile} />
          <NotificationComponent notification={notifications.avatar} />
        </>
      )}

      {/* Avatar Upload Section */}
      <div className="relative group/avatar">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl blur opacity-15 group-hover/avatar:opacity-20 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-xl">
              <Camera className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Profile Picture</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 to-transparent"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="relative group/img">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-full blur opacity-20 group-hover/img:opacity-30 transition duration-300"></div>
              <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-cyan-600 to-teal-700 flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-700 to-teal-700 rounded-full flex items-center justify-center cursor-pointer hover:from-cyan-800 hover:to-teal-800 transition-all transform hover:scale-110 shadow-lg">
                <Camera size={18} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-gray-300 mb-2 font-medium">
                  Upload a new profile picture
                </p>
                <p className="text-gray-400 text-sm">
                  Recommended: Square image, max 5MB (JPEG, PNG, WebP)
                </p>
              </div>
              {profileImage && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={loadingStates.avatar}
                  className="flex items-center space-x-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg font-medium text-sm sm:text-base"
                >
                  {loadingStates.avatar ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  <span>
                    {loadingStates.avatar ? "Uploading..." : "Upload Picture"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileUpdateWithOTP} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <User className="mr-2 text-cyan-400" size={16} />
              Full Name
            </label>
            <div className="relative group">
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                placeholder="Enter your full name"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600/10 to-teal-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <Zap className="mr-2 text-teal-400" size={16} />
              Professional Title
            </label>
            <div className="relative group">
              <select
                value={profileData.title}
                onChange={(e) =>
                  setProfileData({ ...profileData, title: e.target.value })
                }
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15 appearance-none"
                required
              >
                <option value="" className="bg-slate-800 text-white">
                  Select Title
                </option>
                {professionalTitles.map((title) => (
                  <option
                    key={title}
                    value={title}
                    className="bg-slate-800 text-white"
                  >
                    {title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-700/10 to-cyan-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <Mail className="mr-2 text-cyan-400" size={16} />
              Email Address
            </label>
            <div className="relative group">
              <input
                type="email"
                value={profileData.email}
                readOnly
                className="w-full p-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-gray-300 cursor-not-allowed backdrop-blur-sm"
                placeholder="your.email@example.com"
              />
              <button
                type="button"
                onClick={() => setShowEmailTooltip(!showEmailTooltip)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white transition-colors"
              >
                <Info size={16} />
              </button>
              {showEmailTooltip && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 text-white text-sm p-3 rounded-lg shadow-lg border border-slate-600 z-10">
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
                  Email ID can't be changed for security reasons.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
              <MapPin className="mr-2 text-teal-400" size={16} />
              Location
            </label>
            <div className="relative group">
              <select
                value={profileData.location}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15 appearance-none"
                required
              >
                <option value="" className="bg-slate-800 text-white">
                  Select State
                </option>
                <option value="Remote" className="bg-slate-800 text-white">
                  Remote
                </option>
                {indianStates.map((state) => (
                  <option
                    key={state}
                    value={state}
                    className="bg-slate-800 text-white"
                  >
                    {state}
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-700/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <FileText className="mr-2 text-cyan-400" size={16} />
            Professional Bio
          </label>
          <div className="relative group">
            <textarea
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              rows={4}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 resize-none backdrop-blur-sm hover:bg-white/15"
              placeholder="Write a professional bio about your experience and expertise..."
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <FileText className="mr-2 text-teal-400" size={16} />
            Short Description
          </label>
          <div className="relative group">
            <textarea
              value={profileData.description}
              onChange={(e) =>
                setProfileData({ ...profileData, description: e.target.value })
              }
              rows={3}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:bg-white/15 transition-all duration-300 resize-none backdrop-blur-sm hover:bg-white/15"
              placeholder="Brief description for your mentor profile..."
              required
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <DollarSign className="mr-2 text-cyan-400" size={16} />
            Hourly Rate (USD)
          </label>
          <div className="relative group">
            <input
              type="number"
              min="0"
              step="1"
              value={profileData.pricing?.hourlyRate || ""}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  pricing: {
                    ...profileData.pricing,
                    hourlyRate: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
              placeholder="Enter your hourly rate (0 for free sessions)"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600/10 to-teal-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <p className="text-gray-400 text-sm">
            Set to 0 if you offer free mentoring sessions
          </p>
        </div>

        <button
          type="submit"
          disabled={loadingStates.profile || sendingOTP}
          className="relative group overflow-hidden flex items-center justify-center space-x-3 px-6 sm:px-8 py-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-slate-600 hover:from-cyan-700 hover:via-teal-700 hover:to-slate-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {loadingStates.profile || sendingOTP ? (
            <Loader className="animate-spin relative z-10" size={20} />
          ) : (
            <Save className="relative z-10" size={20} />
          )}
          <span className="relative z-10 text-sm sm:text-base">
            {sendingOTP
              ? "Sending OTP to your email..."
              : loadingStates.profile
              ? "Updating..."
              : "Update Profile"}
          </span>
        </button>
      </form>

      {/* Click outside to close email tooltip */}
      {showEmailTooltip && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowEmailTooltip(false)}
        />
      )}

      {/* OTP Verification Modal */}
      {otpModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-slate-700/50 relative z-50 mx-4">
            {/* Show notifications inside modal with higher z-index */}
            <div className="relative z-50">
              <NotificationComponent notification={notifications.profile} />
            </div>

            {/* Close button */}
            <button
              onClick={closeOtpModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-50 p-1"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Verify Email
              </h2>
              <p className="text-slate-300 text-sm sm:text-base px-2">
                We've sent a 6-digit code to your email to verify this profile
                update
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpModal.otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`mentor-profile-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasteValue = e.clipboardData
                        .getData("text")
                        .replace(/[^0-9]/g, "");
                      handleOtpChange(0, pasteValue);
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                    disabled={otpModal.isSubmitting}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTPAndUpdate}
                disabled={
                  otpModal.isSubmitting || otpModal.otp.join("").length !== 6
                }
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
              >
                {otpModal.isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader className="animate-spin" size={18} />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify & Update Profile"
                )}
              </button>

              {/* Resend Button */}
              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={otpModal.isResending || otpModal.countdown > 0}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {otpModal.isResending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      <span>Sending...</span>
                    </div>
                  ) : otpModal.countdown > 0 ? (
                    `Resend in ${otpModal.countdown}s`
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
