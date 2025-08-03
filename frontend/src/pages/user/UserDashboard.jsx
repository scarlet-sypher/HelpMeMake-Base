import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/user/StatCard';
import SessionCard from '../../components/user/SessionCard';
import MessageCard from '../../components/user/MessageCard';
import TimelineItem from '../../components/user/TimelineItem';
import AchievementBadge from '../../components/user/AchievementBadge';
import MilestonePoint from '../../components/user/MilestonePoint';
import HeroProfile from '../../components/user/HeroProfile';
import Sidebar from '../../components/user/Sidebar';
// Using fetch API instead of axios

import { importAllUserImages } from '../../utils/importAllUserImages';
const userImg = importAllUserImages();

import { 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Award,
  Github,
  Linkedin,
  Twitter,
  PlayCircle,
  Send,
  BarChart3,
  Clock,
  Folders ,
  Target,
  Users,
  Zap,
  AlertCircle,
  Activity,
  CheckCircle,
  Flame,
  Menu,
  X,
  Lock
} from 'lucide-react';

const UserDashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [showPasswordBanner, setShowPasswordBanner] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Check if this is an OAuth redirect by looking for specific patterns
      const isFromOAuth = document.referrer.includes('accounts.google.com') || 
                        document.referrer.includes('github.com') ||
                        window.location.search.includes('newPassword');
      
      if (isFromOAuth) {
        // Give extra time for OAuth cookies to be set
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (!loading && !isAuthenticated) {
        window.location.href = '/login';
      }
    };
    
    handleOAuthRedirect();
  }, [loading, isAuthenticated]);

  // Fetch user data from API
  useEffect(() => {
  const fetchUserData = async () => {
    if (isAuthenticated) {
      try {
        setUserDataLoading(true);
        
        // Add a small delay to ensure cookie is properly set after OAuth redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/user/data`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success) {
          console.log('Avatar from API:', data.user.avatar);
          setUserData(data.user);
        } else {
          console.error('API returned error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.error('Error details:', error.message);
        
        // If auth fails, redirect to login
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          window.location.href = '/login';
        }
      } finally {
        setUserDataLoading(false);
      }
    }
  };

  // Only fetch if authenticated and not already loading
  if (isAuthenticated && !userDataLoading) {
    fetchUserData();
  }
}, [isAuthenticated]);


  useEffect(() => {
    // Check URL params for generated password
    const urlParams = new URLSearchParams(window.location.search);
    const newPassword = urlParams.get('newPassword');
    
    if (newPassword && userData && !userData.isPasswordUpdated) {
      setGeneratedPassword(newPassword);
      setShowPasswordBanner(true);
      
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (userData && !userData.isPasswordUpdated && userData.authProvider !== 'local') {
      // Show banner for social users who haven't updated password
      setShowPasswordBanner(true);
    }
  }, [userData]);

  useEffect(() => {
  // Check URL params for generated password
  const urlParams = new URLSearchParams(window.location.search);
  const newPassword = urlParams.get('newPassword');
  
  // ADD THESE DEBUG LOGS
  console.log('URL search params:', window.location.search);
  console.log('newPassword from URL:', newPassword);
  console.log('userData:', userData);
  console.log('userData.isPasswordUpdated:', userData?.isPasswordUpdated);
  
  if (newPassword && userData && !userData.isPasswordUpdated) {
    console.log('Setting generated password:', newPassword); // DEBUG
    setGeneratedPassword(newPassword);
    setShowPasswordBanner(true);
    
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (userData && !userData.isPasswordUpdated && userData.authProvider !== 'local') {
    console.log('Showing banner for social user without password'); // DEBUG
    // Show banner for social users who haven't updated password
    setShowPasswordBanner(true);
  }
}, [userData]);

useEffect(() => {
  const fetchProjectData = async () => {
    if (isAuthenticated) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/project/active-with-mentor`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data.success && data.project) {
          setProjectData(data.project);
        } else {
          setProjectData(null);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setProjectData(null);
      }
    }
  };

  // Only fetch project data after user data is loaded
  if (userData) {
    fetchProjectData();
  }
}, [isAuthenticated, userData]);


useEffect(() => {
  const fetchAchievements = async () => {
    if (isAuthenticated && userData) {
      try {
        setAchievementsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/achievements`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAchievements(data.data);
          }
        } else {
          console.error('Failed to fetch achievements:', response.status);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setAchievementsLoading(false);
      }
    }
  };

  fetchAchievements();
}, [isAuthenticated, userData]);

  // Show loading spinner while checking auth or fetching user data
  if (loading || userDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  

  

  // Don't render dashboard if not authenticated
  if (!isAuthenticated || !userData) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const userStats = [
    { 
      icon: Folders , 
      label: 'Active Projects', 
      value: userData.userActiveProjects.toString(), 
      change: `${userData.userActiveProjectsChange >= 0 ? '+' : ''}${userData.userActiveProjectsChange} this week`, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: CheckCircle, 
      label: 'Total Projects', 
      value: userData.userTotalProjects.toString(), 
      change: `${userData.userTotalProjectsChange >= 0 ? '+' : ''}${userData.userTotalProjectsChange}% in total`, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      icon: Calendar, 
      label: 'Sessions Scheduled', 
      value: userData.userSessionsScheduled.toString(), 
      change: `${userData.userSessionsScheduledChange >= 0 ? '+' : ''}${userData.userSessionsScheduledChange} this month`, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: Target, 
      label: 'Completion Rate', 
      value: `${userData.userCompletionRate}%`, 
      change: `${userData.userCompletionRateChange >= 0 ? '+' : ''}${userData.userCompletionRateChange}% this week`, 
      color: 'from-orange-500 to-red-500' 
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      mentorName: 'Dracule Mihawk',
      mentorImage: userImg['mihawk.jpg'],
      sessionTitle: 'Advanced Sword Techniques',
      date: 'Today',
      time: '3:00 PM',
      duration: '1 hour',
      status: 'confirmed',
      statusColor: 'bg-emerald-500'
    },
    {
      id: 2,
      mentorName: 'Nico Robin',
      mentorImage: userImg['robin.jpg'],
      sessionTitle: 'Ancient History Research',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'pending',
      statusColor: 'bg-yellow-500'
    },
    {
      id: 3,
      mentorName: 'Silvers Rayleigh',
      mentorImage: userImg['Rayleigh.jpg'],
      sessionTitle: 'Haki Training Fundamentals',
      date: 'Dec 22',
      time: '2:00 PM',
      duration: '3 hours',
      status: 'confirmed',
      statusColor: 'bg-emerald-500'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      senderName: 'Boa Hancock',
      senderImage: userImg['hancock.jpg'],
      message: 'Great progress on your project! The design looks amazing.',
      timestamp: '2 mins ago',
      isOnline: true,
      isUnread: true,
      messageType: 'text'
    },
    {
      id: 2,
      senderName: 'Marco the Phoenix',
      senderImage: userImg['marco.jpg'],
      message: 'Ready for tomorrow\'s healing techniques session?',
      timestamp: '1 hour ago',
      isOnline: false,
      isUnread: false,
      messageType: 'text'
    },
    {
      id: 3,
      senderName: 'Portgas D. Ace',
      senderImage: userImg['ace.jpg'],
      message: 'Don\'t forget to bring your fire safety equipment!',
      timestamp: '3 hours ago',
      isOnline: true,
      isUnread: true,
      messageType: 'text'
    }
  ];

  const timelineItems = [
    { id: 1, icon: Award, title: 'Achievement Unlocked: Devil Fruit Master', subtitle: '2 hours ago', color: 'text-yellow-400' },
    { id: 2, icon: Calendar, title: 'New session scheduled with Admiral Kizaru', subtitle: '5 hours ago', color: 'text-blue-400' },
    { id: 3, icon: TrendingUp, title: 'Project "Grand Line Navigation" updated', subtitle: '1 day ago', color: 'text-emerald-400' },
    { id: 4, icon: Users, title: 'Session completed with Trafalgar Law', subtitle: '2 days ago', color: 'text-purple-400' }
  ];



  const milestones = [
    { id: 1, title: "Initial Meeting", userVerified: true, mentorVerified: true },
    { id: 2, title: "Requirements", userVerified: true, mentorVerified: false },
    { id: 3, title: "Mid Review", userVerified: false, mentorVerified: false },
    { id: 4, title: "Final Submission", userVerified: false, mentorVerified: false },
    { id: 5, title: "Project Delivery", userVerified: false, mentorVerified: false }
  ];

  const quickActions = [
    { icon: Calendar, label: 'Schedule Session', color: 'from-blue-500 to-cyan-500' },
    { icon: PlayCircle, label: 'Start Adventure', color: 'from-purple-500 to-pink-500' },
    { icon: Send, label: 'Send Message', color: 'from-emerald-500 to-teal-500' },
    { icon: BarChart3, label: 'View Analytics', color: 'from-orange-500 to-red-500' }
  ];

  // User profile data from API
  const userProfileData = {
    name: userData.name || userData.displayName || "User",
    title: userData.title,
    description: userData.description,
    profileImage: userData.avatar ? userData.avatar.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${userData.avatar}` 
    : userData.avatar : userImg['luffy.jpg'] ,

    isOnline: userData.isOnline,
    level: userData.level,
    xp: userData.xp,
    nextLevelXp: userData.nextLevelXp,
    location: userData.location,
    joinDate: formatDate(userData.joinDate || userData.createdAt),
    rating: userData.rating,
    socialLinks: userData.socialLinks,
    stats: {
      completedSessions: userData.completedSessions,
      totalEarnings: userData.userTotalProjects,
      streakDays: userData.streakDays
    }
  };

  console.log(userProfileData.profileImage);


  // Function to get the page title based on active item
  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      sessions: 'Sessions',
      messages: 'Messages',
      achievements: 'Achievements',
      analytics: 'Analytics',
      settings: 'Settings'
    };
    return titles[activeItem] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Hero Profile Section */}
          <HeroProfile user={userProfileData} />

          {/* Profile Completion Banner */}
          {userData && !userData.isProfileUpdated && (
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                      <AlertCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Complete Your Profile</h3>
                      <p className="text-amber-200">Unlock more features by completing your profile information!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => window.location.href = 'user/settings'}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Update Banner */}
          {showPasswordBanner && userData && !userData.isPasswordUpdated && (
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-red-500/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex-shrink-0">
                      <Lock className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                        🔐 Security Update Required
                        <button
                          onClick={() => setShowPasswordBanner(false)}
                          className="ml-auto text-red-200 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                        >
                          <X size={18} />
                        </button>
                      </h3>
                      {generatedPassword ? (
                        <div className="space-y-3">
                          <p className="text-red-200">
                            We've generated a temporary password for your {userData.authProvider} account:
                          </p>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-300/30 flex items-center space-x-3">
                            <code className="text-yellow-300 font-mono text-lg font-bold flex-1">
                              {generatedPassword}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPassword);
                                // Add a small notification here if needed
                              }}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                              title="Copy password"
                            >
                              📋
                            </button>
                          </div>
                          <p className="text-red-200 text-sm">
                            ⚠️ Please copy this password and update it immediately. This is the only time it will be shown.
                          </p>
                        </div>
                      ) : (
                        <p className="text-red-200">
                          Please update your password to ensure full control of your account.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-4 space-x-3">
                  <button
                    onClick={() => setShowPasswordBanner(false)}
                    className="px-4 py-2 text-red-200 hover:text-white transition-colors font-medium"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => {
                      setActiveItem('settings');
                      window.location.href = '/user/settings';
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Update Password Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            {userStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Zap className="mr-2 text-yellow-400" size={24} />
                  Quick Actions
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  <span className="text-sm text-yellow-300 font-medium">Ready to Launch</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`group relative p-4 lg:p-6 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                        <action.icon size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-sm font-medium text-center">{action.label}</span>
                      
                      {/* Action indicator */}
                      <div className="mt-2 w-8 h-0.5 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors"></div>
                    </div>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Upcoming Sessions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Clock className="mr-2 text-blue-400" size={20} />
                    Upcoming Sessions
                  </h2>
                  <Activity className="text-blue-400 animate-pulse" size={20} />
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} {...session} />
                  ))}
                </div>
              </div>

              {/* Project Milestone Tracker */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <Target className="mr-2 text-purple-400" size={20} />
                    Project Milestone Tracker
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-purple-300 font-medium">Live Updates</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <span className="text-sm text-blue-200 font-medium">Current Project:</span>
                    <span className="text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text ">
                      {projectData ? projectData.name : 'No active project'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 sm:w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(() => {
                            const realMilestones = milestones.filter(m => !m.isPlaceholder);
                            const completedMilestones = realMilestones.filter(
                              m => m.userVerified && m.mentorVerified
                            );
                            return realMilestones.length > 0
                              ? Math.round(
                                  (completedMilestones.length / realMilestones.length) * 100
                                )
                              : 0;
                          })()}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-purple-400">
                      {(() => {
                        const realMilestones = milestones.filter(m => !m.isPlaceholder);
                        const completedMilestones = realMilestones.filter(
                          m => m.userVerified && m.mentorVerified
                        );
                        return realMilestones.length > 0
                          ? Math.round(
                              (completedMilestones.length / realMilestones.length) * 100
                            )
                          : 0;
                      })()}%
                    </span>
                  </div>

                </div>
                
                {/* Enhanced Milestone Container */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-2 sm:p-4 border border-white/10">
                  <MilestonePoint projectData={projectData} />
                </div>
                
                {/* Additional Project Info */}
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl font-bold text-emerald-400">
                      {milestones.filter(m => m.userVerified && m.mentorVerified).length}
                    </div>
                    <div className="text-xs sm:text-sm text-emerald-300">Completed</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl font-bold text-yellow-400">
                      {milestones.filter(m => (m.userVerified || m.mentorVerified) && !(m.userVerified && m.mentorVerified)).length}
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-300">In Progress</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                    <div className="text-lg sm:text-xl font-bold text-slate-400">
                      {milestones.filter(m => !m.userVerified && !m.mentorVerified).length}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300">Pending</div>
                  </div>
                </div>
              </div>

              {/* Grand Line Journey */}
              <div className="bg-gradient-to-r from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-3xl p-6 text-white border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Flame className="mr-2 text-orange-400" size={20} />
                  Your Grand Line Journey
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Monthly Goals Progress</span>
                      <span className="font-bold text-orange-200">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">12</div>
                      <div className="text-sm text-orange-300">Goals Completed</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">{userData.totalAchievement}</div>
                      <div className="text-sm text-orange-300">Achievements Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Recent Messages */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="mr-2 text-green-400" size={20} />
                    Recent Messages
                  </h2>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <MessageCard key={message.id} {...message} />
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2 text-yellow-400" size={20} />
                  Activity Timeline
                </h2>
                <div className="space-y-2">
                  {timelineItems.map((item, index) => (
                    <TimelineItem 
                      key={item.id} 
                      {...item} 
                      isLast={index === timelineItems.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Award className="mr-2 text-purple-400" size={20} />
                  Achievements
                  {achievementsLoading && (
                    <div className="ml-2 w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h2>
                
                {achievementsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
                        <div className="flex justify-between items-center mb-3">
                          <div className="w-12 h-12 bg-white/10 rounded"></div>
                          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 bg-white/10 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : achievements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <AchievementBadge 
                        key={achievement.id} 
                        title={achievement.title}
                        description={achievement.description}
                        achieved={achievement.achieved}
                        icon={achievement.icon}
                        rarity={achievement.rarity}
                        progressPercentage={achievement.progressPercentage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Award className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No achievements yet. Start your journey!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;