import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import ProfileTab from "../../components/user/usersettings/ProfileTab";
import SocialLinksTab from "../../components/user/usersettings/SocialLinksTab";
import SecurityTab from "../../components/user/usersettings/SecurityTab";
import axios from "axios";
import {
  User,
  Shield,
  Link,
  Settings as SettingsIcon,
  Loader,
  Menu,
  Sparkles,
} from "lucide-react";

const UserSettings = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("settings");
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  // Form states
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    description: "",
    location: "",
    email: "",
    updatePercentage: 0,
  });

  const [socialLinksData, setSocialLinksData] = useState({
    github: "",
    linkedin: "",
    twitter: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    socialLinks: false,
    password: false,
    avatar: false,
  });
  const [notifications, setNotifications] = useState({
    profile: null,
    socialLinks: null,
    password: null,
    avatar: null,
  });

  const [indianStates, setIndianStates] = useState([]);
  const professionalTitles = [
    "Student",
    "Software Development Engineer (SDE)",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Data Scientist",
    "ML Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Business Analyst",
    "QA Engineer",
    "Freelancer",
    "Researcher",
    "Consultant",
    "Entrepreneur",
    "Other",
  ];

  // Fetch Indian states
  useEffect(() => {
    const fetchIndianStates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${apiUrl}/meta/indian-states`);

        if (response.data.success) {
          setIndianStates(response.data.states);
        }
      } catch (error) {
        console.error("Error fetching Indian states:", error);
        // Fallback to a basic list if API fails
        setIndianStates(["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"]);
      }
    };

    fetchIndianStates();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    // Check if user came from password update prompt
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("updatePassword") === "true") {
      setActiveTab("security");
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          setUserDataLoading(true);
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const response = await axios.get(`${apiUrl}/auth/user`, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.data.success) {
            const userData = response.data.user;
            setUserData(userData);

            // Populate form data
            setProfileData({
              name: userData.name || userData.displayName || "",
              title: userData.title || "",
              description: userData.description || "",
              location: userData.location || "",
              email: userData.email || "",
              updatePercentage: userData.profileScore || 0,
            });

            setSocialLinksData({
              github: userData.socialLinks?.github || "",
              linkedin: userData.socialLinks?.linkedin || "",
              twitter: userData.socialLinks?.twitter || "",
            });

            setImagePreview(
              userData.avatar
                ? userData.avatar.startsWith("/uploads/")
                  ? `${import.meta.env.VITE_API_URL}${userData.avatar}`
                  : userData.avatar
                : ""
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          showNotification("profile", "error", "Failed to load user data");
        } finally {
          setUserDataLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const showNotification = (type, status, message) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: { status, message },
    }));

    setTimeout(() => {
      setNotifications((prev) => ({
        ...prev,
        [type]: null,
      }));
    }, 5000);
  };

  const setLoading = (type, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [type]: isLoading,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading("profile", true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.patch(
        `${apiUrl}/user/update-profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showNotification("profile", "success", "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        "profile",
        "error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading("profile", false);
    }
  };

  const handleSocialLinksUpdate = async (e) => {
    e.preventDefault();
    setLoading("socialLinks", true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.patch(
        `${apiUrl}/user/social-links`,
        socialLinksData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showNotification(
          "socialLinks",
          "success",
          "Social links updated successfully!"
        );
      }
    } catch (error) {
      console.error("Error updating social links:", error);
      showNotification(
        "socialLinks",
        "error",
        error.response?.data?.message || "Failed to update social links"
      );
    } finally {
      setLoading("socialLinks", false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("password", "error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showNotification(
        "password",
        "error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    setLoading("password", true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.patch(
        `${apiUrl}/user/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showNotification(
          "password",
          "success",
          "Password changed successfully!"
        );
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Update user data to reflect password has been updated
        if (userData) {
          setUserData({
            ...userData,
            isPasswordUpdated: true,
          });
        }
      }
    } catch (error) {
      console.error("Error changing password:", error);
      showNotification(
        "password",
        "error",
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading("password", false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showNotification("avatar", "error", "Image size must be less than 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!profileImage) return;

    setLoading("avatar", true);

    try {
      const formData = new FormData();
      formData.append("avatar", profileImage);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.patch(
        `${apiUrl}/user/upload-avatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        showNotification(
          "avatar",
          "success",
          "Profile picture updated successfully!"
        );
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showNotification(
        "avatar",
        "error",
        error.response?.data?.message || "Failed to upload profile picture"
      );
    } finally {
      setLoading("avatar", false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      gradient: "from-slate-600 to-blue-700",
    },
    {
      id: "social",
      label: "Social Links",
      icon: Link,
      gradient: "from-blue-700 to-indigo-700",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      gradient: "from-slate-700 to-slate-600",
    },
  ];

  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-blue-700 rounded-full animate-ping opacity-15"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-slate-600 to-blue-700 rounded-full flex items-center justify-center">
              <Loader className="animate-spin text-white" size={32} />
            </div>
          </div>
          <p className="text-white text-lg font-medium">
            Loading your settings...
          </p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-slate-600/15 to-blue-800/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-800/15 to-indigo-700/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-700/8 to-blue-700/8 rounded-full blur-3xl animate-pulse"></div>

        {/* Floating particles */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-slate-400/40 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce opacity-25"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-32 left-40 w-3 h-3 bg-indigo-400/40 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-slate-300/40 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        ></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 relative z-10">
        {/* Enhanced Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/90 to-blue-900/90 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-all duration-300 p-2 hover:bg-white/10 rounded-xl"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <SettingsIcon className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-bold text-white">Settings</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-blue-700 to-indigo-700 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <SettingsIcon className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-slate-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={12} />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-blue-100 bg-clip-text text-transparent mb-2">
                    Account Settings
                  </h1>
                  <p className="text-blue-200/80 text-lg">
                    Customize your profile and manage your preferences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 via-blue-700 to-indigo-700 rounded-3xl blur opacity-15 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Enhanced Tab Navigation */}
              <div className="relative">
                <div className="flex overflow-x-auto scrollbar-hide bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center space-x-3 px-6 lg:px-8 py-4 lg:py-5 font-medium transition-all duration-300 whitespace-nowrap group/tab ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {activeTab === tab.id && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-20 rounded-t-2xl`}
                        ></div>
                      )}
                      <div
                        className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? `bg-gradient-to-r ${tab.gradient} shadow-lg transform scale-105`
                            : "bg-white/10 group-hover/tab:bg-white/20 group-hover/tab:scale-105"
                        }`}
                      >
                        <tab.icon size={20} />
                      </div>
                      <span className="relative z-10 text-sm lg:text-base font-semibold">
                        {tab.label}
                      </span>
                      {activeTab === tab.id && (
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} rounded-full`}
                        ></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <ProfileTab
                    profileData={profileData}
                    setProfileData={setProfileData}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    handleProfileUpdate={handleProfileUpdate}
                    handleAvatarUpload={handleAvatarUpload}
                    handleImageChange={handleImageChange}
                    loadingStates={loadingStates}
                    notifications={notifications}
                    indianStates={indianStates}
                    professionalTitles={professionalTitles}
                    showNotification={showNotification}
                  />
                )}

                {/* Social Links Tab */}
                {activeTab === "social" && (
                  <SocialLinksTab
                    socialLinksData={socialLinksData}
                    setSocialLinksData={setSocialLinksData}
                    handleSocialLinksUpdate={handleSocialLinksUpdate}
                    loadingStates={loadingStates}
                    notifications={notifications}
                  />
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <SecurityTab
                    userData={userData}
                    passwordData={passwordData}
                    setPasswordData={setPasswordData}
                    showCurrentPassword={showCurrentPassword}
                    setShowCurrentPassword={setShowCurrentPassword}
                    showNewPassword={showNewPassword}
                    setShowNewPassword={setShowNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    handlePasswordChange={handlePasswordChange}
                    loadingStates={loadingStates}
                    notifications={notifications}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        option {
          background-color: #1e293b;
          color: white;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default UserSettings;
