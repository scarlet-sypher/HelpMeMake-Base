import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/user/Sidebar';
import axios from 'axios';
import { 
  User, 
  Shield, 
  Link, 
  Settings as SettingsIcon,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
  Menu,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Mail,
  Lock,
  Upload,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

const UserSettings = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    description: '',
    location: '',
    email: '',
    updatePercentage : 0 
  });
  
  const [socialLinksData, setSocialLinksData] = useState({
    github: '',
    linkedin: '',
    twitter: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    socialLinks: false,
    password: false,
    avatar: false
  });
  const [notifications, setNotifications] = useState({
    profile: null,
    socialLinks: null,
    password: null,
    avatar: null
  });

  const [indianStates, setIndianStates] = useState([]);
  const professionalTitles = [
    'Student',
    'Software Development Engineer (SDE)',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Data Scientist',
    'ML Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Business Analyst',
    'QA Engineer',
    'Freelancer',
    'Researcher',
    'Consultant',
    'Entrepreneur',
    'Other'
  ];

  // Fetch Indian states
  useEffect(() => {
    const fetchIndianStates = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/meta/indian-states`);
        
        if (response.data.success) {
          setIndianStates(response.data.states);
        }
      } catch (error) {
        console.error('Error fetching Indian states:', error);
        // Fallback to a basic list if API fails
        setIndianStates(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata']);
      }
    };

    fetchIndianStates();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          setUserDataLoading(true);
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${apiUrl}/auth/user`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.data.success) {
            const userData = response.data.user;
            setUserData(userData);
            
            // Populate form data
            setProfileData({
              name: userData.name || userData.displayName || '',
              title: userData.title || '',
              description: userData.description || '',
              location: userData.location || '',
              email: userData.email || '',
              updatePercentage: userData.profileScore || 0 ,

            });
            
            setSocialLinksData({
              github: userData.socialLinks?.github || '',
              linkedin: userData.socialLinks?.linkedin || '',
              twitter: userData.socialLinks?.twitter || ''
            });
            
            
            setImagePreview(
              userData.avatar
                ? userData.avatar.startsWith('/uploads/')
                  ? `${import.meta.env.VITE_API_URL}${userData.avatar}`
                  : userData.avatar
                : ''
            );
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          showNotification('profile', 'error', 'Failed to load user data');
        } finally {
          setUserDataLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const showNotification = (type, status, message) => {
    setNotifications(prev => ({
      ...prev,
      [type]: { status, message }
    }));
    
    setTimeout(() => {
      setNotifications(prev => ({
        ...prev,
        [type]: null
      }));
    }, 5000);
  };

  

  const setLoading = (type, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [type]: isLoading
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading('profile', true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.patch(`${apiUrl}/user/update-profile`, profileData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        showNotification('profile', 'success', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('profile', 'error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading('profile', false);
    }
  };

  const handleSocialLinksUpdate = async (e) => {
    e.preventDefault();
    setLoading('socialLinks', true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.patch(`${apiUrl}/user/social-links`, socialLinksData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        showNotification('socialLinks', 'success', 'Social links updated successfully!');
      }
    } catch (error) {
      console.error('Error updating social links:', error);
      showNotification('socialLinks', 'error', error.response?.data?.message || 'Failed to update social links');
    } finally {
      setLoading('socialLinks', false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('password', 'error', 'New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showNotification('password', 'error', 'Password must be at least 6 characters long');
      return;
    }
    
    setLoading('password', true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.patch(`${apiUrl}/user/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        showNotification('password', 'success', 'Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification('password', 'error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading('password', false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('avatar', 'error', 'Image size must be less than 5MB');
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
    
    setLoading('avatar', true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', profileImage);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.patch(`${apiUrl}/user/upload-avatar`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        showNotification('avatar', 'success', 'Profile picture updated successfully!');
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification('avatar', 'error', error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setLoading('avatar', false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-slate-600 to-blue-700' },
    { id: 'social', label: 'Social Links', icon: Link, gradient: 'from-blue-700 to-indigo-700' },
    { id: 'security', label: 'Security', icon: Shield, gradient: 'from-slate-700 to-slate-600' }
  ];

  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;
    
    return (
      <div className={`relative overflow-hidden p-4 rounded-2xl mb-6 flex items-center space-x-3 backdrop-blur-sm border transition-all duration-500 animate-slide-in ${
        notification.status === 'success' 
          ? 'bg-slate-700/30 border-slate-500/50 text-slate-200 shadow-slate-600/20' 
          : 'bg-slate-800/40 border-slate-600/50 text-slate-300 shadow-slate-700/25'
      } shadow-xl`}>
        <div className="absolute inset-0 bg-gradient-to-r opacity-5 animate-pulse"
             style={{
               background: notification.status === 'success' 
                 ? 'linear-gradient(45deg, #64748b, #475569)' 
                 : 'linear-gradient(45deg, #374151, #1f2937)'
             }} />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === 'success' ? (
            <CheckCircle size={20} className="animate-bounce text-slate-300" />
          ) : (
            <AlertCircle size={20} className="animate-pulse text-slate-400" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      </div>
    );
  };

  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-blue-700 rounded-full animate-ping opacity-15"></div>
            <div className="relative w-full h-full bg-gradient-to-r from-slate-600 to-blue-700 rounded-full flex items-center justify-center">
              <Loader className="animate-spin text-white" size={32} />
            </div>
          </div>
          <p className="text-white text-lg font-medium">Loading your settings...</p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-slate-600/15 to-blue-800/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-800/15 to-indigo-700/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-700/8 to-blue-700/8 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-slate-400/40 rounded-full animate-bounce opacity-30" style={{animationDelay: '0s', animationDuration: '4s'}}></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce opacity-25" style={{animationDelay: '1s', animationDuration: '5s'}}></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-indigo-400/40 rounded-full animate-bounce opacity-30" style={{animationDelay: '2s', animationDuration: '6s'}}></div>
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-slate-300/40 rounded-full animate-bounce opacity-35" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}></div>
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
                  <p className="text-blue-200/80 text-lg">Customize your profile and manage your preferences</p>
                </div>

                  {/* Profile Completion Score (didnt workred)
                  {userData && (
                    <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
                      <div className="relative group/score">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover/score:opacity-30 transition duration-300"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">{userData.profileScore || 0}%</div>
                            <div className="text-blue-300 text-sm font-medium">Profile Complete</div>
                            <div className="w-16 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                style={{ width: `${userData.profileScore || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )} */}
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
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-20 rounded-t-2xl`}></div>
                      )}
                      <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id 
                          ? `bg-gradient-to-r ${tab.gradient} shadow-lg transform scale-105` 
                          : 'bg-white/10 group-hover/tab:bg-white/20 group-hover/tab:scale-105'
                      }`}>
                        <tab.icon size={20} />
                      </div>
                      <span className="relative z-10 text-sm lg:text-base font-semibold">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} rounded-full`}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-8 animate-fade-in">
                    <NotificationComponent notification={notifications.profile} />
                    <NotificationComponent notification={notifications.avatar} />
                    
                    {/* Enhanced Avatar Upload Section */}
                    <div className="relative group/avatar">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-blue-700 rounded-2xl blur opacity-15 group-hover/avatar:opacity-20 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-slate-600 to-blue-700 rounded-xl">
                            <Camera className="text-white" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-white">Profile Picture</h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-slate-600/50 to-transparent"></div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                          <div className="relative group/img">
                            <div className="absolute -inset-2 bg-gradient-to-r from-slate-600 to-blue-700 rounded-full blur opacity-20 group-hover/img:opacity-30 transition duration-300"></div>
                            <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-blue-700 flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                              {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <User size={40} className="text-white" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-slate-700 to-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:from-slate-800 hover:to-blue-800 transition-all transform hover:scale-110 shadow-lg">
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
                                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-slate-700 to-blue-700 hover:from-slate-800 hover:to-blue-800 text-white rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg font-medium"
                              >
                                {loadingStates.avatar ? (
                                  <Loader className="animate-spin" size={18} />
                                ) : (
                                  <Upload size={18} />
                                )}
                                <span>{loadingStates.avatar ? 'Uploading...' : 'Upload Picture'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Profile Form */}
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                            <User className="mr-2 text-slate-400" size={16} />
                            Full Name
                          </label>
                          <div className="relative group">
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-slate-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                              placeholder="Enter your full name"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                            <Zap className="mr-2 text-blue-400" size={16} />
                            Professional Title
                          </label>
                          <div className="relative group">
                            <select
                              value={profileData.title}
                              onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15 appearance-none"
                            >
                              <option value="Not mentioned" className="bg-slate-800 text-white">Select Title</option>
                              {professionalTitles.map((title) => (
                                <option key={title} value={title} className="bg-slate-800 text-white">
                                  {title}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-700/10 to-indigo-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                            <Mail className="mr-2 text-slate-400" size={16} />
                            Email Address
                          </label>
                          <div className="relative group">
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-slate-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                              placeholder="your.email@example.com"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-600/10 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                              <MapPin className="mr-2 text-indigo-400" size={16} />
                              Location
                            </label>
                            <div className="relative group">
                              <select
                                value={profileData.location}
                                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15 appearance-none"
                              >
                                <option value="Home" className="bg-slate-800 text-white">Select State</option>
                                {indianStates.map((state) => (
                                  <option key={state} value={state} className="bg-slate-800 text-white">
                                    {state}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-700/10 to-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                          Bio / Description
                        </label>
                        <div className="relative group">
                          <textarea
                            value={profileData.description}
                            onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                            rows={4}
                            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 resize-none backdrop-blur-sm hover:bg-white/15"
                            placeholder="Tell us about yourself..."
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loadingStates.profile}
                        className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {loadingStates.profile ? (
                          <Loader className="animate-spin relative z-10" size={20} />
                        ) : (
                          <Save className="relative z-10" size={20} />
                        )}
                        <span className="relative z-10">{loadingStates.profile ? 'Updating Profile...' : 'Update Profile'}</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Social Links Tab */}
                {activeTab === 'social' && (
                  <div className="space-y-8 animate-fade-in">
                    <NotificationComponent notification={notifications.socialLinks} />
                    
                    <div className="relative group/social">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl blur opacity-15 group-hover/social:opacity-20 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl">
                            <Link className="text-white" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-white">Social Connections</h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-700/50 to-transparent"></div>
                        </div>
                        
                        <form onSubmit={handleSocialLinksUpdate} className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                              <Github className="mr-2 text-gray-400" size={16} />
                              GitHub Profile
                            </label>
                            <div className="relative group">
                              <input
                                type="url"
                                value={socialLinksData.github}
                                onChange={(e) => setSocialLinksData({...socialLinksData, github: e.target.value})}
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="https://github.com/yourusername"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                              <Linkedin className="mr-2 text-blue-400" size={16} />
                              LinkedIn Profile
                            </label>
                            <div className="relative group">
                              <input
                                type="url"
                                value={socialLinksData.linkedin}
                                onChange={(e) => setSocialLinksData({...socialLinksData, linkedin: e.target.value})}
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="https://linkedin.com/in/yourusername"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3  items-center">
                              <Twitter className="mr-2 text-sky-400" size={16} />
                              Twitter Profile
                            </label>
                            <div className="relative group">
                              <input
                                type="url"
                                value={socialLinksData.twitter}
                                onChange={(e) => setSocialLinksData({...socialLinksData, twitter: e.target.value})}
                                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="https://twitter.com/yourusername"
                              />
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loadingStates.socialLinks}
                            className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {loadingStates.socialLinks ? (
                              <Loader className="animate-spin relative z-10" size={20} />
                            ) : (
                              <Save className="relative z-10" size={20} />
                            )}
                            <span className="relative z-10">{loadingStates.socialLinks ? 'Updating Links...' : 'Update Social Links'}</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8 animate-fade-in">
                    <NotificationComponent notification={notifications.password} />
                    
                    {/* Security Notice */}
                    <div className="relative group/notice">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-blue-700 rounded-2xl blur opacity-15 group-hover/notice:opacity-20 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-slate-700/30 to-blue-800/30 border border-slate-500/40 rounded-2xl p-6 flex items-start space-x-4 backdrop-blur-sm">
                        <div className="p-2 bg-gradient-to-r from-slate-600 to-blue-700 rounded-xl flex-shrink-0">
                          <Shield className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="text-slate-200 font-bold text-lg mb-2">Security Notice</h4>
                          <p className="text-slate-300">
                            Your current password is required to make any security changes. This helps protect your account from unauthorized modifications.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative group/security">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl blur opacity-15 group-hover/security:opacity-20 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl">
                            <Lock className="text-white" size={20} />
                          </div>
                          <h3 className="text-xl font-bold text-white">Change Password</h3>
                          <div className="flex-1 h-px bg-gradient-to-r from-slate-600/50 to-transparent"></div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3 items-center">
                              <Lock className="mr-2 text-red-400" size={16} />
                              Current Password
                            </label>
                            <div className="relative group">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="Enter your current password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                              >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                              New Password
                            </label>
                            <div className="relative group">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="Enter new password"
                                minLength={6}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                              >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                              Confirm New Password
                            </label>
                            <div className="relative group">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="w-full p-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                                placeholder="Confirm new password"
                                minLength={6}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                              >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                          </div>

                          {passwordData.newPassword && passwordData.confirmPassword && 
                           passwordData.newPassword !== passwordData.confirmPassword && (
                            <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 animate-shake">
                              <AlertCircle size={16} className="flex-shrink-0" />
                              <span className="text-sm font-medium">Passwords do not match</span>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loadingStates.password || passwordData.newPassword !== passwordData.confirmPassword}
                            className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {loadingStates.password ? (
                              <Loader className="animate-spin relative z-10" size={20} />
                            ) : (
                              <Shield className="relative z-10" size={20} />
                            )}
                            <span className="relative z-10">{loadingStates.password ? 'Changing Password...' : 'Change Password'}</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
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