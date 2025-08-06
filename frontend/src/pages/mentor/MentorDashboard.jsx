import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/user/Sidebar';
import { importAllUserImages } from '../../utils/importAllUserImages';

// Import the new MentorHeroProfile component
import MentorHeroProfile from '../../components/mentor/MentorHeroProfile';

// Import mentor components
import StatsGrid from '../../components/mentor/StatsGrid';
import QuickActions from '../../components/mentor/QuickActions';
import UpcomingSessions from '../../components/mentor/UpcomingSessions';
import ProgressTracker from '../../components/mentor/ProgressTracker';
import EarningsOverview from '../../components/mentor/EarningsOverview';
import RecentMessages from '../../components/mentor/RecentMessages';
import ActivityTimeline from '../../components/mentor/ActivityTimeline';
import StudentFeedback from '../../components/mentor/StudentFeedback';

import { 
  Calendar, 
  Github,
  Linkedin,
  Twitter,
  Target,
  Star,
  GraduationCap,
  Lock,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';

const userImg = importAllUserImages();

const MentorDashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mentorData, setMentorData] = useState(null);
  const [mentorDataLoading, setMentorDataLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [showPasswordBanner, setShowPasswordBanner] = useState(false);

  // Redirect non-mentors
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== 'mentor'))) {
      window.location.href = '/login';
    }
  }, [loading, isAuthenticated, user]);

  // Handle OAuth redirects
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const isFromOAuth = document.referrer.includes('accounts.google.com') || 
                        document.referrer.includes('github.com') ||
                        window.location.search.includes('newPassword');
      
      if (isFromOAuth) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (!loading && !isAuthenticated) {
        window.location.href = '/login';
      }
    };
    
    handleOAuthRedirect();
  }, [loading, isAuthenticated]);

  // Fetch mentor data
  useEffect(() => {
    const fetchMentorData = async () => {
      if (isAuthenticated && mentorDataLoading) {
        try {
          setMentorDataLoading(true);
          
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const token = localStorage.getItem('access_token');
          
          const response = await fetch(`${apiUrl}/mentor/data`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            setMentorData(data.user);
          } else {
            console.error('API returned error:', data.message);
          }
        } catch (error) {
          console.error('Error fetching mentor data:', error);
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/login';
          }
        } finally {
          setMentorDataLoading(false);
        }
      }
    };

    fetchMentorData();
  }, [isAuthenticated, mentorDataLoading]);

  // Handle password banner
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newPassword = urlParams.get('newPassword');
    
    if (newPassword && mentorData && !mentorData.isPasswordUpdated) {
      setGeneratedPassword(newPassword);
      setShowPasswordBanner(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (mentorData && !mentorData.isPasswordUpdated && mentorData.authProvider !== 'local') {
      setShowPasswordBanner(true);
    }
  }, [mentorData]);

  // Show loading
  if (loading || mentorDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or no mentor data
  if (!isAuthenticated || !mentorData) {
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

  // Mock data for demonstration
  const upcomingSessions = [
    {
      id: 1,
      studentName: 'Monkey D. Luffy',
      studentImage: userImg['luffy.jpg'],
      sessionTitle: 'React Advanced Patterns',
      date: 'Today',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'confirmed',
      statusColor: 'bg-cyan-500'
    },
    {
      id: 2,
      studentName: 'Roronoa Zoro',
      studentImage: userImg['zoro.jpg'],
      sessionTitle: 'Full-Stack Development Review',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '1.5 hours',
      status: 'pending',
      statusColor: 'bg-amber-500'
    },
    {
      id: 3,
      studentName: 'Nami',
      studentImage: userImg['nami.jpg'],
      sessionTitle: 'JavaScript Fundamentals',
      date: 'Dec 24',
      time: '4:00 PM',
      duration: '1 hour',
      status: 'confirmed',
      statusColor: 'bg-cyan-500'
    }
  ];

  const recentMessages = [
    {
      id: 1,
      senderName: 'Sanji',
      senderImage: userImg['sanji.jpg'],
      message: 'Thank you for the excellent session on Node.js!',
      timestamp: '5 mins ago',
      isOnline: true,
      isUnread: true,
      messageType: 'text'
    },
    {
      id: 2,
      senderName: 'Usopp',
      senderImage: userImg['usopp.jpg'],
      message: 'Can we schedule another session for next week?',
      timestamp: '2 hours ago',
      isOnline: false,
      isUnread: false,
      messageType: 'text'
    }
  ];

  // Profile data
  const mentorProfileData = {
    name: mentorData.name || mentorData.displayName || "Mentor",
    title: mentorData.title || "Software Engineering Mentor",
    description: mentorData.description || "Passionate about helping others learn and grow in their development journey",
    profileImage: mentorData.avatar ? mentorData.avatar.startsWith('/uploads/') ? 
      `${import.meta.env.VITE_API_URL}${mentorData.avatar}` : mentorData.avatar : userImg['luffy.jpg'],
    isOnline: mentorData.isOnline || true,
    rating: mentorData.rating || 5.0,
    totalReviews: mentorData.totalReviews || 0,
    location: mentorData.location || "Remote",
    joinDate: formatDate(mentorData.joinDate || mentorData.createdAt),
    socialLinks: mentorData.socialLinks || {},
    stats: {
      totalStudents: mentorData.totalStudents || 0,
      completedSessions: mentorData.completedSessions || 0,
      responseTime: mentorData.responseTime || 30
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar - Reuse existing component but with mentor context */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor" // Pass mentor role for conditional rendering
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Hero Profile Section - Using new MentorHeroProfile */}
          <MentorHeroProfile mentor={mentorProfileData} />

          {/* Profile Completion Banner */}
          {mentorData && !mentorData.onboardingCompleted && (
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-cyan-500/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
                      <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Complete Your Mentor Profile</h3>
                      <p className="text-cyan-200">Set up your expertise, pricing, and availability to start mentoring!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => window.location.href = '/mentor/settings'}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Setup Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Update Banner */}
          {showPasswordBanner && mentorData && !mentorData.isPasswordUpdated && (
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex-shrink-0">
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
                            We've generated a temporary password for your {mentorData.authProvider} account:
                          </p>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-red-300/30 flex items-center space-x-3">
                            <code className="text-yellow-300 font-mono text-lg font-bold flex-1">
                              {generatedPassword}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPassword);
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
                      window.location.href = '/mentor/settings';
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Update Password Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid Component */}
          <StatsGrid mentorData={mentorData} />

          {/* Quick Actions Component */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Upcoming Sessions Component */}
              <UpcomingSessions upcomingSessions={upcomingSessions} />

              {/* Mentorship Progress Tracker Component */}
              <ProgressTracker userImg={userImg} />

              {/* Earnings Overview Component */}
              <EarningsOverview />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Recent Messages Component */}
              <RecentMessages recentMessages={recentMessages} />

              {/* Activity Timeline Component */}
              <ActivityTimeline />

              {/* Student Feedback Component */}
              <StudentFeedback userImg={userImg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;