import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import StatCard from "../../components/user/StatCard";
import SessionCard from "../../components/user/SessionCard";
import MessageCard from "../../components/user/MessageCard";
import TimelineItem from "../../components/user/TimelineItem";
import AchievementBadge from "../../components/user/AchievementBadge";
import MilestonePoint from "../../components/user/MilestonePoint";
import HeroProfile from "../../components/user/HeroProfile";
import Sidebar from "../../components/user/Sidebar";
// Using fetch API instead of axios

import { importAllUserImages } from "../../utils/importAllUserImages";
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
} from "lucide-react";

const UserDashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [showPasswordBanner, setShowPasswordBanner] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Check if this is an OAuth redirect by looking for specific patterns
      const isFromOAuth =
        document.referrer.includes("accounts.google.com") ||
        document.referrer.includes("github.com") ||
        window.location.search.includes("newPassword");

      if (isFromOAuth) {
        // Give extra time for OAuth cookies to be set
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!loading && !isAuthenticated) {
        window.location.href = "/login";
      }
    };

    handleOAuthRedirect();
  }, [loading, isAuthenticated]);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && userDataLoading) {
        // Changed: was !userDataLoading
        try {
          setUserDataLoading(true);

          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token"); // Get token from localStorage

          const response = await fetch(`${apiUrl}/user/data`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Use Bearer token instead of cookies
            },
          });

          console.log("Response status:", response.status);
          console.log("Response headers:", response.headers);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API Response:", data);

          if (data.success) {
            console.log("Avatar from API:", data.user.avatar);
            setUserData(data.user);
          } else {
            console.error("API returned error:", data.message);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          console.error("Error details:", error.message);

          // If auth fails, redirect to login
          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            window.location.href = "/login";
          }
        } finally {
          setUserDataLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, userDataLoading]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated && dashboardLoading) {
        try {
          setDashboardLoading(true);

          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          // Updated endpoint for dashboard
          const response = await fetch(`${apiUrl}/api/dashboard/user/data`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Dashboard Response status:", response.status);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Dashboard API Response:", data);

          if (data.success) {
            setDashboardData(data.user);
          } else {
            console.error("Dashboard API returned error:", data.message);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);

          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            window.location.href = "/login";
          }
        } finally {
          setDashboardLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, dashboardLoading]);

  useEffect(() => {
    // Check URL params for generated password
    const urlParams = new URLSearchParams(window.location.search);
    const newPassword = urlParams.get("newPassword");

    if (newPassword && userData && !userData.isPasswordUpdated) {
      setGeneratedPassword(newPassword);
      setShowPasswordBanner(true);

      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (
      userData &&
      !userData.isPasswordUpdated &&
      userData.authProvider !== "local"
    ) {
      // Show banner for social users who haven't updated password
      setShowPasswordBanner(true);
    }
  }, [userData]);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (isAuthenticated && userData) {
        try {
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await fetch(
            `${apiUrl}/api/project/active-with-mentor`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Use Bearer token
              },
            }
          );

          const data = await response.json();

          if (data.success && data.project) {
            setProjectData(data.project);
          } else {
            setProjectData(null);
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          setProjectData(null);
        }
      }
    };

    fetchProjectData();
  }, [isAuthenticated, userData]);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (isAuthenticated && userData) {
        try {
          setAchievementsLoading(true);
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await fetch(`${apiUrl}/api/achievements`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Use Bearer token
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setAchievements(data.data);
            }
          } else {
            console.error("Failed to fetch achievements:", response.status);
          }
        } catch (error) {
          console.error("Error fetching achievements:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const userStats = dashboardData
    ? [
        {
          icon: Folders,
          label: "Active Projects",
          value: dashboardData.userActiveProjects.toString(),
          change: `${dashboardData.userActiveProjectsChange >= 0 ? "+" : ""}${
            dashboardData.userActiveProjectsChange
          } this week`,
          color: "from-blue-500 to-cyan-500",
        },
        {
          icon: CheckCircle,
          label: "Total Projects",
          value: dashboardData.userTotalProjects.toString(),
          change: `${dashboardData.userTotalProjectsChange >= 0 ? "+" : ""}${
            dashboardData.userTotalProjectsChange
          } projects`,
          color: "from-emerald-500 to-teal-500",
        },
        {
          icon: Calendar,
          label: "Sessions Scheduled",
          value: dashboardData.userSessionsScheduled.toString(),
          change: `${
            dashboardData.userSessionsScheduledChange >= 0 ? "+" : ""
          }${dashboardData.userSessionsScheduledChange} this month`,
          color: "from-purple-500 to-pink-500",
        },
        {
          icon: Target,
          label: "Completion Rate",
          value: `${dashboardData.userCompletionRate}%`,
          change: `${dashboardData.userCompletionRateChange >= 0 ? "+" : ""}${
            dashboardData.userCompletionRateChange
          }% this week`,
          color: "from-orange-500 to-red-500",
        },
      ]
    : [];

  const recentMessages = [
    {
      id: 1,
      senderName: "Boa Hancock",
      senderImage: userImg["hancock.jpg"],
      message: "Great progress on your project! The design looks amazing.",
      timestamp: "2 mins ago",
      isOnline: true,
      isUnread: true,
      messageType: "text",
    },
    {
      id: 2,
      senderName: "Marco the Phoenix",
      senderImage: userImg["marco.jpg"],
      message: "Ready for tomorrow's healing techniques session?",
      timestamp: "1 hour ago",
      isOnline: false,
      isUnread: false,
      messageType: "text",
    },
    {
      id: 3,
      senderName: "Portgas D. Ace",
      senderImage: userImg["ace.jpg"],
      message: "Don't forget to bring your fire safety equipment!",
      timestamp: "3 hours ago",
      isOnline: true,
      isUnread: true,
      messageType: "text",
    },
  ];

  const timelineItems = [
    {
      id: 1,
      icon: Award,
      title: "Achievement Unlocked: Devil Fruit Master",
      subtitle: "2 hours ago",
      color: "text-yellow-400",
    },
    {
      id: 2,
      icon: Calendar,
      title: "New session scheduled with Admiral Kizaru",
      subtitle: "5 hours ago",
      color: "text-blue-400",
    },
    {
      id: 3,
      icon: TrendingUp,
      title: 'Project "Grand Line Navigation" updated',
      subtitle: "1 day ago",
      color: "text-emerald-400",
    },
    {
      id: 4,
      icon: Users,
      title: "Session completed with Trafalgar Law",
      subtitle: "2 days ago",
      color: "text-purple-400",
    },
  ];

  const quickActions = [
    {
      icon: Calendar,
      label: "Schedule Session",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: PlayCircle,
      label: "Start Adventure",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Send,
      label: "Send Message",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      color: "from-orange-500 to-red-500",
    },
  ];

  // User profile data from API
  const userProfileData = {
    name: userData.name || userData.displayName || "User",
    title: userData.title,
    description: userData.description,
    profileImage: userData.avatar
      ? userData.avatar.startsWith("/uploads/")
        ? `${import.meta.env.VITE_API_URL}${userData.avatar}`
        : userData.avatar
      : userImg["luffy.jpg"],

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
      streakDays: userData.streakDays,
    },
  };

  console.log(userProfileData.profileImage);

  // Function to get the page title based on active item
  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      projects: "Projects",
      sessions: "Sessions",
      messages: "Messages",
      achievements: "Achievements",
      analytics: "Analytics",
      settings: "Settings",
    };
    return titles[activeItem] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="user" // Add this prop
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
                      <h3 className="text-xl font-bold text-white mb-1">
                        Complete Your Profile
                      </h3>
                      <p className="text-amber-200">
                        Unlock more features by completing your profile
                        information!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => (window.location.href = "user/settings")}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Update Profile
                    </button>
                  </div>
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
                  <span className="text-sm text-yellow-300 font-medium">
                    Ready to Launch
                  </span>
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
                        <action.icon
                          size={24}
                          className="group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-sm font-medium text-center">
                        {action.label}
                      </span>

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
                <SessionCard />{" "}
                {/* ✅ Just use SessionCard once, it handles everything */}
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
                    <span className="text-xs sm:text-sm text-purple-300 font-medium">
                      Live Updates
                    </span>
                  </div>
                </div>

                <MilestonePoint projectData={projectData} />
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
                      <div
                        className="bg-gradient-to-r from-orange-400 to-red-400 h-3 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">
                        12
                      </div>
                      <div className="text-sm text-orange-300">
                        Goals Completed
                      </div>
                    </div>
                    <div className="text-center bg-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-200">
                        {userData.totalAchievement}
                      </div>
                      <div className="text-sm text-orange-300">
                        Achievements Earned
                      </div>
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

              <div className="sticky top-6">
                <AchievementBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
