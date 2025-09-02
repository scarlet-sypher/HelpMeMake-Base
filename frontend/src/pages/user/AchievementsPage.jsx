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
  AlertTriangle,
  X,
} from "lucide-react";

const customStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const DebugConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const requiredPhrase = "i want to distroy my account";
  const isValid = inputValue.trim() === requiredPhrase;

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleEnter = (e) => {
      if (e.key === "Enter" && isOpen && isValid && !isLoading) {
        handleConfirm();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [isOpen, isValid, isLoading]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() !== "" && value.trim() !== requiredPhrase) {
      setError("Type the exact phrase to enable Confirm.");
    } else {
      setError("");
    }
  };

  const handleConfirm = () => {
    if (isValid && !isLoading) {
      onConfirm();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      ></div>

      <div className="relative bg-gradient-to-br from-slate-900 to-red-950/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-red-500/30 shadow-2xl max-w-md w-full mx-4">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                ⚠ Dangerous Debug Action
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6 mb-6">
            <div className="space-y-2 text-sm sm:text-base text-gray-200">
              <p>
                By continuing, you will open the debug panel with testing
                controls.
              </p>
              <p>
                Use the debug panel carefully as it can modify your account
                data.
              </p>
              <p>This will give you access to testing functions.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                To proceed, type: "{requiredPhrase}"
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 disabled:opacity-50 text-sm sm:text-base"
                placeholder="Type the phrase here..."
                autoComplete="off"
              />
              {error && (
                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isValid || isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{isLoading ? "Processing..." : "Confirm"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [isDebugLoading, setIsDebugLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

        if (data.newBadges && data.newBadges.length > 0) {
          setNewBadges(data.newBadges);
          setTimeout(() => setNewBadges([]), 5000);
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      if (showLoading) setAchievementsLoading(false);
    }
  };

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
  const executeDebugAction = async () => {
    if (!isAuthenticated) return;

    try {
      setIsDebugLoading(true);

      // Just close modal and open debug panel
      setShowDebugModal(false);
      setShowTestPanel(true);

      setSuccessMessage("Debug panel opened successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error opening debug panel:", error);
    } finally {
      setIsDebugLoading(false);
    }
  };

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

  useEffect(() => {
    fetchAchievements();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchAchievements(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBadgeClick = (badgeInfo) => {
    console.log("Badge clicked:", badgeInfo);
  };

  const handleDebugClick = () => {
    setShowDebugModal(true);
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
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        <div className="flex-1 w-full min-w-0 lg:ml-64">
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

          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 w-full">
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-green-200 text-sm">
                    {successMessage}
                  </span>
                </div>
              </div>
            )}

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

                    <button
                      onClick={() => setShowDebugModal(true)}
                      className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base transform hover:scale-105"
                    >
                      <Settings size={16} />
                      <span className="hidden sm:inline">Debug Panel</span>
                      <span className="sm:hidden">Debug</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showTestPanel && (
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-600/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Settings className="mr-2 text-gray-400" size={20} />
                    Debug Panel (Testing Only)
                  </h3>
                  <button
                    onClick={() => setShowTestPanel(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Add Project
                    </label>
                    <button
                      onClick={() => updateTestValue("addProject")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      Add Completed Project
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Add Session
                    </label>
                    <button
                      onClick={() => updateTestValue("addSession")}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      Add Completed Session
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Add Milestone
                    </label>
                    <button
                      onClick={() => updateTestValue("addMilestone")}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      Add Completed Milestone
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Streak Days
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateTestValue(
                            "updateStreak",
                            Math.max(0, (learnerData?.streakDays || 0) - 1)
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white text-sm flex-1 text-center">
                        {learnerData?.streakDays || 0}
                      </span>
                      <button
                        onClick={() =>
                          updateTestValue(
                            "updateStreak",
                            (learnerData?.streakDays || 0) + 1
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Total Logins
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateTestValue(
                            "updateLogins",
                            Math.max(0, (learnerData?.totalLogins || 0) - 1)
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white text-sm flex-1 text-center">
                        {learnerData?.totalLogins || 0}
                      </span>
                      <button
                        onClick={() =>
                          updateTestValue(
                            "updateLogins",
                            (learnerData?.totalLogins || 0) + 1
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <label className="block text-white text-sm font-semibold mb-2">
                      Quick Actions
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={handleDebugClick}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Add All Types
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {learnerData && achievementData && (
              <XPProgressTracker
                learnerData={learnerData}
                achievements={achievementData}
              />
            )}

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

        <DebugConfirmationModal
          isOpen={showDebugModal}
          onClose={() => setShowDebugModal(false)}
          onConfirm={executeDebugAction}
          isLoading={isDebugLoading}
        />
      </div>
    </>
  );
};

export default AchievementsPage;
