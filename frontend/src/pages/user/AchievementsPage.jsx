import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import AchievementCategoryList from "../../components/user/userAchievements/AchievementCategoryList";
import XPProgressTracker from "../../components/user/userAchievements/XPProgressTracker";
import BadgeAnimations from "../../components/user/userAchievements/BadgeAnimations";
import axios from "axios";
import {
  Trophy,
  Star,
  Menu,
  Sparkles,
  Crown,
  Target,
  Users,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Settings,
  Plus,
  Minus,
  Zap,
  Gift,
  TrendingUp,
  Award,
} from "lucide-react";

// Add custom styles for scrollbar hiding
const customStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const AchievementsPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("achievements");
  const [achievementData, setAchievementData] = useState(null);
  const [learnerData, setLearnerData] = useState(null);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [newBadges, setNewBadges] = useState([]);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Test panel state
  const [testValues, setTestValues] = useState({
    projectCount: 0,
    sessionCount: 0,
    milestoneCount: 0,
    streakDays: 0,
    totalLogins: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  // Fetch achievements data
  const fetchAchievements = async (showLoading = true) => {
    if (!isAuthenticated) return;

    try {
      if (showLoading) setAchievementsLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.get(`${apiUrl}/api/achievements`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const data = response.data.data;
        setLearnerData(data.learner);
        setAchievementData(data.achievements);

        // Show new badges if any
        if (data.newBadges && data.newBadges.length > 0) {
          setNewBadges(data.newBadges);
          // Clear new badges after 5 seconds
          setTimeout(() => setNewBadges([]), 5000);
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      if (showLoading) setAchievementsLoading(false);
    }
  };

  // Force recalculate achievements
  const recalculateAchievements = async () => {
    if (!isAuthenticated) return;

    try {
      setIsRefreshing(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(
        `${apiUrl}/api/achievements/recalculate`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setLearnerData(data.learner);
        setAchievementData(data.achievements);

        // Show new badges if any
        if (data.newBadges && data.newBadges.length > 0) {
          setNewBadges(data.newBadges);
          setTimeout(() => setNewBadges([]), 5000);
        }
      }
    } catch (error) {
      console.error("Error recalculating achievements:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Test function to update values manually
  const updateTestValue = async (type, value) => {
    if (!isAuthenticated) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(
        `${apiUrl}/api/achievements/test-update`,
        {
          type,
          value,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        setLearnerData(data.learner);
        setAchievementData(data.achievements);

        if (data.newBadges && data.newBadges.length > 0) {
          setNewBadges(data.newBadges);
          setTimeout(() => setNewBadges([]), 5000);
        }
      }
    } catch (error) {
      console.error("Error updating test values:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAchievements();
  }, [isAuthenticated]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchAchievements(false); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBadgeClick = (badgeInfo) => {
    console.log("Badge clicked:", badgeInfo);
    // Handle badge click animation or effects
  };

  if (loading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center w-full overflow-hidden">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading achievements...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex w-full overflow-x-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">Achievements</h1>
              <button
                onClick={() => setShowTestPanel(!showTestPanel)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full">
            {/* Hero Section with Welcome */}
            <div className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-yellow-400/30 w-full">
                <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl sm:rounded-2xl relative">
                      <Trophy className="text-white" size={32} />
                      {newBadges.length > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-white text-xs font-bold">
                            {newBadges.length}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome back, {learnerData?.name || "Learner"}! 🏆
                      </h1>
                      <p className="text-yellow-200 text-sm sm:text-base lg:text-lg">
                        Track your learning journey and unlock amazing
                        achievements
                      </p>
                      {newBadges.length > 0 && (
                        <div className="mt-2 flex items-center justify-center space-x-2">
                          <Sparkles
                            className="text-yellow-400 animate-pulse"
                            size={16}
                          />
                          <span className="text-yellow-300 font-semibold text-sm">
                            {newBadges.length} new badge
                            {newBadges.length > 1 ? "s" : ""} unlocked!
                          </span>
                          <Sparkles
                            className="text-yellow-400 animate-pulse"
                            size={16}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
                    <button
                      onClick={recalculateAchievements}
                      disabled={isRefreshing}
                      className={`
                        flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl 
                        font-semibold transition-all text-sm sm:text-base
                        ${
                          isRefreshing
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105"
                        }
                      `}
                    >
                      <RefreshCw
                        size={16}
                        className={isRefreshing ? "animate-spin" : ""}
                      />
                      <span>
                        {isRefreshing ? "Updating..." : "Refresh Achievements"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Tracker */}
            {learnerData && achievementData && (
              <XPProgressTracker
                learnerData={learnerData}
                achievements={achievementData}
              />
            )}

            {/* Achievement Categories */}
            {achievementData && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                    <Award className="mr-2 text-purple-400" size={20} />
                    Your Achievement Collection
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Sparkles
                      className="text-yellow-400 animate-pulse"
                      size={14}
                    />
                    <span className="text-xs sm:text-sm text-yellow-300 font-medium">
                      {achievementData.totalBadges || 0} badges earned
                    </span>
                  </div>
                </div>

                <AchievementCategoryList
                  achievements={achievementData}
                  onBadgeClick={handleBadgeClick}
                  newBadges={newBadges}
                />
              </div>
            )}

            {/* Motivation Section */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-400/30 w-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 text-emerald-400" size={20} />
                  Keep Learning!
                </h3>
                <Gift className="text-emerald-400 animate-bounce" size={20} />
              </div>
              <p className="text-emerald-200 mb-3 sm:mb-4 text-sm sm:text-base">
                You're doing amazing! Every project completed, every session
                attended, and every milestone achieved brings you closer to
                mastery.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <Target
                    className="text-blue-400 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <span className="text-xs sm:text-sm text-blue-200">
                    Complete more projects
                  </span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <Users
                    className="text-green-400 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <span className="text-xs sm:text-sm text-green-200">
                    Attend mentor sessions
                  </span>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <CheckCircle
                    className="text-purple-400 mr-2 flex-shrink-0"
                    size={16}
                  />
                  <span className="text-xs sm:text-sm text-purple-200">
                    Finish milestones
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AchievementsPage;
