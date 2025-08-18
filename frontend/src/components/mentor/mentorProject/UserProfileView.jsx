import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Award,
  Calendar,
  User,
  Briefcase,
  Link,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Shield,
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trophy,
  Medal,
  Flame,
  Zap,
  Crown,
  Sparkles,
  Lock,
} from "lucide-react";
import ShortProjectView from "./ShortProjectView";

const UserProfileView = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [badgesLoading, setBadgesLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [mentorStatus, setMentorStatus] = useState({
    hasActiveProject: false,
    isRestricted: false,
    activeProjectId: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const badgeLevels = {
    basic: {
      name: "Basic",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-400/50",
      progressColor: "bg-blue-200", // lighter blue for visibility
      textColor: "text-white",
    },
    common: {
      name: "Common",
      icon: Star,
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-400/50",
      progressColor: "bg-green-200", // soft green contrast
      textColor: "text-white",
    },
    rare: {
      name: "Rare",
      icon: Zap,
      color: "from-purple-500 to-violet-500",
      borderColor: "border-purple-400/50",
      progressColor: "bg-purple-200", // pastel purple
      textColor: "text-white",
    },
    epic: {
      name: "Epic",
      icon: Trophy,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-400/50",
      progressColor: "bg-orange-200", // soft orange
      textColor: "text-white",
    },
    legendary: {
      name: "Legendary",
      icon: Crown,
      color: "from-yellow-400 to-amber-500",
      borderColor: "border-yellow-400/50",
      progressColor: "bg-yellow-200", // pale yellow
      textColor: "text-white",
    },
  };

  // Get current user data first to determine their role
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        console.log("🔍 Fetching current user data...");
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/auth/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          console.log("✅ Current user data fetched:", data.user);
          setCurrentUserData(data.user);

          // Only check mentor status if current user is a mentor
          if (data.user?.role === "mentor") {
            await checkMentorStatus();
          }
        }
      } catch (error) {
        console.error("❌ Error getting current user:", error);
      }
    };

    getCurrentUser();
  }, [API_URL]);

  // Check if current user is a mentor and get their status
  const checkMentorStatus = async () => {
    try {
      console.log("🔍 Checking mentor status...");
      const token = localStorage.getItem("access_token");
      const mentorStatusResponse = await fetch(
        `${API_URL}/mentor/active-project-status`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statusData = await mentorStatusResponse.json();
      if (statusData.success) {
        console.log("✅ Mentor status fetched:", statusData);
        setMentorStatus({
          hasActiveProject: statusData.hasActiveProject,
          isRestricted: statusData.hasActiveProject,
          activeProjectId: statusData.activeProjectId,
        });
      }
    } catch (error) {
      console.error("❌ Error checking mentor status:", error);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    // Check if user data was passed via navigation state
    if (location.state?.userData && location.state?.fromProject) {
      console.log("📋 Using user data from navigation state");
      setUser(location.state.userData);
      setLoading(false);
      return;
    }

    // Otherwise, fetch user profile data from API
    const fetchUserProfile = async () => {
      try {
        console.log(`🔍 Fetching user profile for userId: ${userId}`);
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("✅ User profile fetched:", data.user);
          setUser(data.user);
        } else {
          console.error("❌ Failed to fetch user profile:", data.message);
          setError(data.message || "Failed to load user profile");
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, API_URL, location.state]);

  // Fetch user projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        console.log(`🔍 Fetching projects for userId: ${userId}`);
        setProjectsLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/projects/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log("✅ User projects fetched:", data.projects);
          setProjects(data.projects || []);
        } else {
          console.error("❌ Failed to load user projects:", data.message);
          setProjects([]);
        }
      } catch (error) {
        console.error("❌ Error fetching user projects:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (userId) {
      fetchUserProjects();
    }
  }, [userId, API_URL]);

  // Fetch user badges
  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        console.log(`🏆 Fetching badges for userId: ${userId}`);
        setBadgesLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${API_URL}/api/achievements/user/${userId}/badges`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("🏆 Badge API response:", data);

        if (response.ok && data.success) {
          console.log("✅ User badges fetched:", data.data);
          setBadges(data.data.categories || []);
        } else {
          console.log("⚠️ No badges found or error:", data.message);
          setBadges([]); // Set empty array if no badges
        }
      } catch (error) {
        console.error("❌ Error fetching user badges:", error);
        setBadges([]); // Set empty array on error
      } finally {
        setBadgesLoading(false);
      }
    };

    if (userId) {
      fetchUserBadges();
    }
  }, [userId, API_URL]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApplyCallback = (projectId) => {
    // Refresh projects or update UI after successful application
    console.log(`Applied to project: ${projectId}`);
    // You can add additional logic here if needed
  };

  const handleMessageUser = () => {
    // Placeholder for messaging functionality
    alert("Messaging feature coming soon!");
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Twitter;
      default:
        return Link;
    }
  };

  const formatSocialUrl = (platform, url) => {
    if (!url || url === "#") return null;

    // If URL already includes domain, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Add appropriate domain based on platform
    switch (platform) {
      case "github":
        return url.startsWith("/")
          ? `https://github.com${url}`
          : `https://github.com/${url}`;
      case "linkedin":
        return url.startsWith("/")
          ? `https://linkedin.com${url}`
          : `https://linkedin.com/in/${url}`;
      case "twitter":
        return url.startsWith("/")
          ? `https://twitter.com${url}`
          : `https://twitter.com/${url}`;
      default:
        return url;
    }
  };

  // Group badges by level and check if user has unlocked any at each level
  const processGroupedBadges = () => {
    if (!badges || badges.length === 0) {
      // Return empty state for all levels
      return Object.keys(badgeLevels).map((level) => ({
        level,
        config: badgeLevels[level],
        count: 0,
        unlocked: false,
        totalAvailable: badges.length * 5, // Assuming 5 levels per category
        progress: 0,
      }));
    }

    const levelCounts = {};

    // Initialize level counts
    Object.keys(badgeLevels).forEach((level) => {
      levelCounts[level] = {
        count: 0,
        unlocked: false,
        totalAvailable: 0,
      };
    });

    // Process each category and count badges by level
    badges.forEach((category) => {
      category.badges.forEach((badge) => {
        const level = badge.level;
        if (levelCounts[level]) {
          levelCounts[level].totalAvailable++;
          if (badge.unlocked) {
            levelCounts[level].count++;
            levelCounts[level].unlocked = true;
          }
        }
      });
    });

    // Convert to array format for rendering
    return Object.keys(badgeLevels).map((level) => ({
      level,
      config: badgeLevels[level],
      count: levelCounts[level].count,
      unlocked: levelCounts[level].unlocked,
      totalAvailable: levelCounts[level].totalAvailable,
      progress:
        levelCounts[level].totalAvailable > 0
          ? (levelCounts[level].count / levelCounts[level].totalAvailable) * 100
          : 0,
    }));
  };

  // Render enhanced badges section
  const renderBadges = () => {
    if (badgesLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-white flex items-center space-x-3">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading achievements...</span>
          </div>
        </div>
      );
    }

    const groupedBadges = processGroupedBadges();
    const totalUnlocked = groupedBadges.reduce(
      (sum, badge) => sum + badge.count,
      0
    );
    const totalAvailable = groupedBadges.reduce(
      (sum, badge) => sum + badge.totalAvailable,
      0
    );

    return (
      <div className="space-y-6">
        {/* Achievement Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
              <Trophy className="text-yellow-400" size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Hall of Frames</h4>
              <p className="text-sm text-gray-300">Achievement Collection</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {totalUnlocked}
            </div>
            <div className="text-xs text-gray-400">
              {totalAvailable > 0 ? `of ${totalAvailable}` : "Achievements"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalAvailable > 0 && (
          <div className="w-full bg-white/10 rounded-full h-3 border border-white/20 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${(totalUnlocked / totalAvailable) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Grouped Badge Levels */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {groupedBadges.map((badgeGroup) => {
            const { level, config, count, unlocked, totalAvailable } =
              badgeGroup;
            const IconComponent = config.icon;

            return (
              <div
                key={level}
                className={`
                  relative group transition-all duration-300 transform hover:scale-105
                  ${
                    unlocked
                      ? `bg-gradient-to-br ${config.color} border-2 ${config.borderColor} shadow-xl ${config.glowColor}`
                      : "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }
                  rounded-2xl p-4 backdrop-blur-sm overflow-hidden cursor-pointer
                `}
              >
                {/* Animated background effects for unlocked badges */}
                {unlocked && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {level === "legendary" && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 animate-pulse"></div>
                        <div className="absolute -top-1 -right-1 text-yellow-400 animate-bounce">
                          <Sparkles size={12} />
                        </div>
                        <div className="absolute -top-1 -left-1 text-blue-400 animate-pulse">
                          <Star size={8} />
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Badge Icon */}
                  <div className="relative mb-3">
                    <div
                      className={`p-3 rounded-xl ${
                        unlocked ? config.bgGlow : "bg-white/5"
                      } border border-white/20`}
                    >
                      <IconComponent
                        size={24}
                        className={
                          unlocked ? config.textColor : "text-gray-400"
                        }
                      />

                      {/* Lock overlay for locked badges */}
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badge Level Name */}
                  <h5
                    className={`text-sm font-bold mb-1 ${
                      unlocked ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {config.name}
                  </h5>

                  {/* Badge Count */}
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-lg font-bold ${
                        unlocked ? config.textColor : "text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                    {totalAvailable > 0 && (
                      <span className="text-md text-white">
                        /{totalAvailable}
                      </span>
                    )}
                  </div>

                  {/* Stars for unlocked badges */}
                  {unlocked && (
                    <div className="flex mt-2 space-x-1">
                      {[
                        ...Array(Object.keys(badgeLevels).indexOf(level) + 1),
                      ].map((_, i) => (
                        <Star
                          key={i}
                          size={8}
                          className={`fill-current ${config.textColor}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Progress indicator for partially unlocked levels */}
                  {unlocked && count < totalAvailable && totalAvailable > 0 && (
                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                      <div
                        className={`bg-gradient-to-r ${config.progressColor} h-1 rounded-full transition-all duration-700`}
                        style={{ width: `${(count / totalAvailable) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                  <div className="bg-black/90 backdrop-blur-sm text-white text-xs py-2 px-3 rounded-lg border border-white/20 shadow-xl whitespace-nowrap">
                    {unlocked
                      ? `${config.name} Level - ${count} earned`
                      : `${config.name} Level - Not unlocked yet`}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Statistics */}
        {totalAvailable > 0 && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-green-400">
                  {totalUnlocked}
                </div>
                <div className="text-xs text-gray-400">Total Earned</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-400">
                  {totalAvailable}
                </div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-400">
                  {Math.round((totalUnlocked / totalAvailable) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Completion</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-orange-400">
                  {groupedBadges.filter((b) => b.unlocked).length}
                </div>
                <div className="text-xs text-gray-400">Levels Unlocked</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error ||
              "The user you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Enhanced header with back button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="group flex items-center space-x-2 text-white hover:text-cyan-300 transition-all duration-200 hover:bg-white/10 rounded-xl px-3 py-2"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Previous Page</span>
          </button>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 mb-6 relative overflow-hidden">
          {/* Enhanced animated background elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-12 h-12 bg-purple-400/15 rounded-full blur-lg animate-pulse"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Enhanced User Avatar and Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <div className="relative">
                      <img
                        src={
                          user.avatar
                            ? user.avatar.startsWith("/uploads/")
                              ? `${API_URL}${user.avatar}`
                              : user.avatar
                            : `${API_URL}/uploads/public/default.jpg`
                        }
                        alt={user.name}
                        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gradient-to-r from-cyan-500 to-teal-500 mx-auto lg:mx-0 shadow-2xl"
                        onError={(e) => {
                          e.target.src = `${API_URL}/uploads/public/default.jpg`;
                        }}
                      />
                      {/* Enhanced status indicator */}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <CheckCircle size={20} className="text-white" />
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 blur-xl -z-10"></div>
                    </div>
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {user.name || "Anonymous User"}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full px-3 py-1 border border-cyan-400/30">
                      <Briefcase size={16} className="text-cyan-300" />
                      <span className="text-sm text-cyan-200">
                        {user.title || "Student"}
                      </span>
                    </div>
                    {user.location && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-400/30">
                        <MapPin size={16} className="text-purple-300" />
                        <span className="text-sm text-purple-200">
                          {user.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced stats grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30 text-center group hover:scale-105 transition-transform duration-200">
                      <div className="text-xl font-bold text-yellow-400 flex items-center justify-center">
                        <Trophy size={18} className="mr-1" />
                        {user.level || 0}
                      </div>
                      <div className="text-xs text-yellow-200">Level</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30 text-center group hover:scale-105 transition-transform duration-200">
                      <div className="text-xl font-bold text-purple-400 flex items-center justify-center">
                        <Star size={16} className="mr-1 fill-current" />
                        {user.rating || "0.0"}
                      </div>
                      <div className="text-xs text-purple-200">Rating</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30 text-center group hover:scale-105 transition-transform duration-200">
                      <div className="text-xl font-bold text-green-400 flex items-center justify-center">
                        <BookOpen size={16} className="mr-1" />
                        {user.completedSessions || 0}
                      </div>
                      <div className="text-xs text-green-200">Sessions</div>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleMessageUser}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                    >
                      <MessageSquare size={18} />
                      <span>Message User</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                    </button>

                    {user.email && (
                      <a
                        href={`mailto:${user.email}`}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
                      >
                        <Mail size={18} />
                        <span>Send Email</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced User Details and Stats */}
              <div className="lg:col-span-2">
                {/* Enhanced About Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl border border-cyan-400/30 mr-3">
                      <User className="text-cyan-400" size={20} />
                    </div>
                    About
                  </h3>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                    <p className="text-gray-200 leading-relaxed text-base">
                      {user.description ||
                        "This user hasn't added a description yet."}
                    </p>
                  </div>
                </div>

                {/* Enhanced Achievement Badges Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30 mr-3">
                      <Award className="text-yellow-400" size={20} />
                    </div>
                    Achievement Badges
                  </h3>
                  <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/10 shadow-xl">
                    {renderBadges()}
                  </div>
                </div>

                {/* Enhanced Social Links */}
                {user.socialLinks && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 mr-3">
                        <Link className="text-green-400" size={20} />
                      </div>
                      Social Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(user.socialLinks).map(
                        ([platform, url]) => {
                          const SocialIcon = getSocialIcon(platform);
                          const socialUrl = formatSocialUrl(platform, url);

                          if (!socialUrl) return null;

                          return (
                            <a
                              key={platform}
                              href={socialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/15 border border-white/20 rounded-xl px-4 py-3 text-white transition-all duration-200 transform hover:scale-105 group shadow-lg hover:shadow-xl relative overflow-hidden"
                            >
                              <SocialIcon size={16} />
                              <span className="capitalize font-medium">
                                {platform}
                              </span>
                              <ExternalLink
                                size={14}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced User Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30 text-center group hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="p-2 bg-blue-400/20 rounded-xl w-fit mx-auto mb-3">
                      <BookOpen className="text-blue-400" size={24} />
                    </div>
                    <div className="text-lg font-bold text-white">
                      {user.userActiveProjects || 0}
                    </div>
                    <div className="text-sm text-blue-200">Active Projects</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30 text-center group hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="p-2 bg-green-400/20 rounded-xl w-fit mx-auto mb-3">
                      <Target className="text-green-400" size={24} />
                    </div>
                    <div className="text-lg font-bold text-white">
                      {user.userTotalProjects || 0}
                    </div>
                    <div className="text-sm text-green-200">Total Projects</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl p-4 border border-purple-400/30 text-center group hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="p-2 bg-purple-400/20 rounded-xl w-fit mx-auto mb-3">
                      <Clock className="text-purple-400" size={24} />
                    </div>
                    <div className="text-lg font-bold text-white">
                      {user.userSessionsScheduled || 0}
                    </div>
                    <div className="text-sm text-purple-200">
                      Scheduled Sessions
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-400/30 text-center group hover:scale-105 transition-all duration-200 shadow-lg">
                    <div className="p-2 bg-orange-400/20 rounded-xl w-fit mx-auto mb-3">
                      <TrendingUp className="text-orange-400" size={24} />
                    </div>
                    <div className="text-lg font-bold text-white">
                      {user.userCompletionRate || 0}%
                    </div>
                    <div className="text-sm text-orange-200">
                      Completion Rate
                    </div>
                  </div>
                </div>

                {/* Enhanced Join Date */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-400/20 shadow-lg">
                  <div className="flex items-center text-sm">
                    <div className="p-2 bg-indigo-400/20 rounded-xl mr-3">
                      <Calendar size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-indigo-300 font-medium">
                      Member since{" "}
                      {new Date(
                        user.joinDate || user.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced User Projects Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-cyan-400/15 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-5 -left-5 w-12 h-12 bg-teal-400/15 rounded-full blur-xl animate-pulse"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl border border-cyan-400/30 mr-3">
                  <Briefcase className="text-cyan-400" size={24} />
                </div>
                User's Projects
              </h2>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 border border-white/20">
                <Users size={16} className="text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">
                  {projectsLoading
                    ? "Loading..."
                    : `${projects.length} projects`}
                </span>
              </div>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white flex items-center space-x-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading projects...</span>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-400/10 rounded-full w-fit mx-auto mb-4">
                  <Briefcase className="text-gray-400" size={48} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Projects Found
                </h3>
                <p className="text-gray-300">
                  This user hasn't created any projects yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ShortProjectView
                    key={project._id}
                    project={project}
                    onApply={
                      currentUserData?.role === "mentor" &&
                      !mentorStatus.isRestricted
                        ? handleApplyCallback
                        : null
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
