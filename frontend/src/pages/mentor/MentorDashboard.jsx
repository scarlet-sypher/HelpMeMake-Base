import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/user/Sidebar';
import { importAllUserImages } from '../../utils/importAllUserImages';

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
  Folders,
  Target,
  Users,
  Zap,
  AlertCircle,
  Activity,
  CheckCircle,
  Flame,
  Menu,
  X,
  Lock,
  DollarSign,
  BookOpen,
  Star,
  UserCheck,
  Briefcase,
  GraduationCap
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
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

  // Mentor-specific stats
  const mentorStats = [
    { 
      icon: DollarSign, 
      label: 'Total Earnings', 
      value: `$${mentorData.mentorTotalEarnings || 0}`, 
      change: `${mentorData.mentorTotalEarningsChange >= 0 ? '+' : ''}${mentorData.mentorTotalEarningsChange || 0}% this month`, 
      color: 'from-emerald-500 to-teal-500' 
    },
    { 
      icon: Briefcase, 
      label: 'Active Students', 
      value: mentorData.mentorActiveStudents?.toString() || '0', 
      change: `${mentorData.mentorActiveStudentsChange >= 0 ? '+' : ''}${mentorData.mentorActiveStudentsChange || 0} this week`, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: CheckCircle, 
      label: 'Sessions Completed', 
      value: mentorData.mentorSessionsCompleted?.toString() || '0', 
      change: `${mentorData.mentorSessionsCompletedChange >= 0 ? '+' : ''}${mentorData.mentorSessionsCompletedChange || 0} this month`, 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: Star, 
      label: 'Satisfaction Rate', 
      value: `${mentorData.mentorSatisfactionRate || 0}%`, 
      change: `${mentorData.mentorSatisfactionRateChange >= 0 ? '+' : ''}${mentorData.mentorSatisfactionRateChange || 0}% this week`, 
      color: 'from-orange-500 to-red-500' 
    }
  ];

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
      statusColor: 'bg-emerald-500'
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
      statusColor: 'bg-yellow-500'
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
      statusColor: 'bg-emerald-500'
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

  const timelineItems = [
    { id: 1, icon: Award, title: 'New 5-star review from Luffy', subtitle: '1 hour ago', color: 'text-yellow-400' },
    { id: 2, icon: Calendar, title: 'Session completed with Zoro', subtitle: '3 hours ago', color: 'text-emerald-400' },
    { id: 3, icon: Users, title: 'New student request from Robin', subtitle: '1 day ago', color: 'text-blue-400' },
    { id: 4, icon: TrendingUp, title: 'Earnings milestone reached: $1000', subtitle: '2 days ago', color: 'text-purple-400' }
  ];

  const quickActions = [
    { icon: Calendar, label: 'Schedule Session', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'View Students', color: 'from-blue-500 to-cyan-500' },
    { icon: Send, label: 'Send Message', color: 'from-purple-500 to-pink-500' },
    { icon: BarChart3, label: 'View Analytics', color: 'from-orange-500 to-red-500' }
  ];

  // Profile data
  const mentorProfileData = {
    name: mentorData.name || mentorData.displayName || "Mentor",
    title: mentorData.title || "Software Engineering Mentor",
    description: mentorData.description || "Passionate about helping others learn and grow",
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

  // Components
  const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-30 rounded-2xl blur transition duration-500"></div>
      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-sm ${change.startsWith('+') ? 'text-emerald-400' : change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const SessionCard = ({ studentName, studentImage, sessionTitle, date, time, duration, status, statusColor }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={studentImage} 
              alt={studentName}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/30"
            />
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-slate-800`}></div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white">{studentName}</h4>
            <p className="text-sm text-emerald-300">{sessionTitle}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
              <span>{date} at {time}</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 text-xs rounded-full ${status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageCard = ({ senderName, senderImage, message, timestamp, isOnline, isUnread }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img 
              src={senderImage} 
              alt={senderName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800"></div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white truncate">{senderName}</h4>
              <span className="text-xs text-gray-400">{timestamp}</span>
            </div>
            <p className={`text-sm mt-1 ${isUnread ? 'text-white font-medium' : 'text-gray-300'}`}>
              {message}
            </p>
          </div>
          {isUnread && <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>}
        </div>
      </div>
    </div>
  );

  const TimelineItem = ({ icon: Icon, title, subtitle, color, isLast }) => (
    <div className="flex items-start space-x-3">
      <div className={`w-8 h-8 rounded-full bg-slate-800 border-2 border-white/20 flex items-center justify-center`}>
        <Icon size={14} className={color} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-white">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {!isLast && <div className="w-px h-8 bg-white/10 ml-4"></div>}
    </div>
  );

  const HeroProfile = ({ mentor }) => (
    <div className="relative group mb-6">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-fuchsia-400/30">
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="relative">
            <img 
              src={mentor.profileImage} 
              alt={mentor.name}
              className="w-32 h-32 rounded-2xl object-cover border-4 border-emerald-400/30 shadow-2xl"
            />
            {mentor.isOnline && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{mentor.name}</h1>
                <p className="text-xl text-emerald-300 mb-2">{mentor.title}</p>
                <p className="text-gray-300 max-w-2xl">{mentor.description}</p>
              </div>
              
              <div className="mt-4 lg:mt-0 flex flex-col items-center lg:items-end space-y-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(mentor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'} />
                  ))}
                  <span className="text-white font-semibold ml-2">{mentor.rating}</span>
                  <span className="text-gray-400">({mentor.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-emerald-400">{mentor.stats.totalStudents}</div>
                <div className="text-sm text-gray-300">Total Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-emerald-400">{mentor.stats.completedSessions}</div>
                <div className="text-sm text-gray-300">Sessions Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-emerald-400">{mentor.stats.responseTime}min</div>
                <div className="text-sm text-gray-300">Response Time</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center">
                <Target className="mr-1" size={16} />
                {mentor.location}
              </span>
              <span className="flex items-center">
                <Calendar className="mr-1" size={16} />
                Joined {mentor.joinDate}
              </span>
              
              <div className="flex items-center space-x-2">
                {mentor.socialLinks?.github && mentor.socialLinks.github !== '#' && (
                  <a href={mentor.socialLinks.github} className="text-gray-400 hover:text-white transition-colors">
                    <Github size={16} />
                  </a>
                )}
                {mentor.socialLinks?.linkedin && mentor.socialLinks.linkedin !== '#' && (
                  <a href={mentor.socialLinks.linkedin} className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin size={16} />
                  </a>
                )}
                {mentor.socialLinks?.twitter && mentor.socialLinks.twitter !== '#' && (
                  <a href={mentor.socialLinks.twitter} className="text-gray-400 hover:text-white transition-colors">
                    <Twitter size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-900 to-purple-900 flex">
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
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-fuchsia-900/80 backdrop-blur-sm border-b border-white/10 p-4">
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
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          
          {/* Hero Profile Section */}
          <HeroProfile mentor={mentorProfileData} />

          {/* Profile Completion Banner */}
          {mentorData && !mentorData.onboardingCompleted && (
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-amber-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                      <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Complete Your Mentor Profile</h3>
                      <p className="text-amber-200">Set up your expertise, pricing, and availability to start mentoring!</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => window.location.href = '/mentor/settings'}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
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
            {mentorStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-fuchsia-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Zap className="mr-2 text-fuchsia-400" size={24} />
                  Quick Actions
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-ping"></div>
                  <span className="text-sm text-fuchsia-300 font-medium">Ready to Mentor</span>
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
                    <Clock className="mr-2 text-fuchsia-400" size={20} />
                    Upcoming Sessions
                  </h2>
                  <Activity className="text-fuchsia-400 animate-pulse" size={20} />
                </div>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard key={session.id} {...session} />
                  ))}
                </div>
              </div>

              {/* Mentorship Progress Tracker */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <UserCheck className="mr-2 text-fuchsia-400" size={20} />

                    Active Students Progress
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-fuchsia-300 font-medium">Live Updates</span>
                  </div>
                </div>
                
                {/* Student Progress Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Monkey D. Luffy', project: 'React E-commerce App', progress: 75, image: userImg['luffy.jpg'] },
                    { name: 'Roronoa Zoro', project: 'Node.js API Development', progress: 60, image: userImg['zoro.jpg'] },
                    { name: 'Nami', project: 'JavaScript Fundamentals', progress: 90, image: userImg['nami.jpg'] },
                    { name: 'Sanji', project: 'Full-Stack Web App', progress: 45, image: userImg['sanji.jpg'] }
                  ].map((student, index) => (
                    <div key={index} className="bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-3">
                        <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">{student.name}</h4>
                          <p className="text-xs text-fuchsia-300">{student.project}</p>
                        </div>
                        <span className="text-sm font-bold text-fuchsia-400">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-fuchsia-400 to-purple-500 h-2 rounded-full transition-all duration-500"Monthly Earnings Overview
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings Overview */}
              <div className="bg-gradient-to-r from-fuchsia-500/30 to-purple-500/30 backdrop-blur-sm rounded-3xl p-6 text-white border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <DollarSign className="mr-2 text-fuchsia-400" size={20} />
                  Monthly Earnings Overview
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">Monthly Goal Progress</span>
                      <span className="font-bold text-fuchsia-200">$1,250 / $2,000</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-fuchsia-400 to-purple-400 h-3 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-fuchsia-200">$1,250</div>
                      <div className="text-sm text-fuchsia-300">This Month</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-fuchsia-200">24</div>
                      <div className="text-sm text-fuchsia-300">Sessions Completed</div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-fuchsia-200">$52</div>
                      <div className="text-sm text-fuchsia-300">Avg Per Session</div>
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
                    <MessageCircle className="mr-2 text-fuchsia-400" size={20} />
                    Recent Messages
                  </h2>
                  <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
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
                  <TrendingUp className="mr-2 text-fuchsia-400" size={20} />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {timelineItems.map((item, index) => (
                    <TimelineItem 
                      key={item.id} 
                      {...item} 
                      isLast={index === timelineItems.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Student Feedback */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Star className="mr-2 text-yellow-400" size={20} />
                  Recent Feedback
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      name: 'Monkey D. Luffy',
                      image: userImg['luffy.jpg'],
                      rating: 5,
                      comment: 'Amazing mentor! Really helped me understand React hooks.',
                      date: '2 days ago'
                    },
                    {
                      name: 'Roronoa Zoro',
                      image: userImg['zoro.jpg'],
                      rating: 5,
                      comment: 'Great explanation of backend architecture concepts.',
                      date: '1 week ago'
                    }
                  ].map((feedback, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-start space-x-3">
                        <img src={feedback.image} alt={feedback.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-white">{feedback.name}</h4>
                            <span className="text-xs text-gray-400">{feedback.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-300">{feedback.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;