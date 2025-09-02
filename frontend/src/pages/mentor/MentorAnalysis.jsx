import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Sidebar from "../../components/user/Sidebar";
import { StatsSection } from "../../components/mentor/mentorAnalysis/StatsSection";
import DonutChart from "../../components/mentor/mentorAnalysis/DonutChart";
import TopLearnersList from "../../components/mentor/mentorAnalysis/TopLearnersList";
import RecentActivity from "../../components/mentor/mentorAnalysis/RecentActivity";
import MonthlyTrend from "../../components/mentor/mentorAnalysis/MonthlyTrend";
import PerformanceInsights from "../../components/mentor/mentorAnalysis/PerformanceInsights";
import { Menu, RefreshCw, AlertCircle, Star } from "lucide-react";

const MentorAnalysis = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("analytics");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "mentor"))) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated, user]);

  const fetchAnalyticsData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setAnalyticsLoading(true);
      }
      setError(null);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${apiUrl}/api/analysis/mentor`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load analytics"
      );

      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setAnalyticsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchAnalyticsData();
    }
  }, [isAuthenticated, loading]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRefresh = () => {
    fetchAnalyticsData(true);
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/uploads/public/default.jpg";

    if (avatar.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL}${avatar}`;
    }

    return avatar;
  };

  if (loading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">
            Loading Analytics...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Failed to Load Analytics
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => fetchAnalyticsData()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const overview = analyticsData?.overview || {};
  const mentor = analyticsData?.mentor || {};
  const projectDistribution = analyticsData?.projectDistribution || {};
  const topLearners = analyticsData?.topLearners || [];
  const sessions = analyticsData?.sessions || {};
  const milestones = analyticsData?.milestones || {};

  const performanceData = {
    successRate: overview.successRate,
    successRateTrend: overview.successRateTrend,
    averageRating: mentor.rating,
    ratingTrend: overview.ratingTrend,
    responseTime: sessions.avgResponseTime,
    responseTimeTrend: sessions.responseTimeTrend,
    completionRate: milestones.completionRate,
    completionRateTrend: milestones.completionRateTrend,
    totalEarnings: overview.completedProjectsEarnings,
    thisMonthEarnings: overview.thisMonthEarnings,
    lastMonthEarnings: overview.lastMonthEarnings,
    avgEarningsPerProject: overview.avgEarningsPerProject,
  };
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar (fixed so it overlays on mobile, pushes content on desktop) */}
      <div className="fixed inset-y-0 left-0 z-30 lg:static lg:inset-auto">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          userRole="mentor"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Analytics</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Page Content */}
        <div className="relative z-10 p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-white/10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-xl shrink-0">
                  <img
                    src={getAvatarUrl(mentor.avatar)}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/uploads/public/default.jpg";
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Analytics Dashboard
                  </h1>
                  <p className="text-cyan-200 text-sm sm:text-base">
                    Welcome back, {mentor.name || "Mentor"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm sm:text-base">
                      <Star className="text-yellow-400 shrink-0" size={16} />
                      <span className="text-white font-semibold">
                        {mentor.rating}
                      </span>
                      <span className="text-gray-300">
                        ({mentor.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      Member since{" "}
                      {new Date(mentor.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 sm:p-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw
                    size={20}
                    className={refreshing ? "animate-spin" : ""}
                  />
                </button>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    ₹{overview.completedProjectsEarnings?.toLocaleString() || 0}
                  </div>
                  <div className="text-cyan-200 text-xs sm:text-sm">
                    Total Earnings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - 7 cards */}
          <StatsSection analyticsData={analyticsData} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Donut Chart */}
            <div className="animate-fade-in-left min-h-[300px] sm:min-h-[350px]">
              <DonutChart
                data={projectDistribution}
                title="Project Distribution"
              />
            </div>

            {/* Top Learners List */}
            <div className="animate-fade-in-right">
              <TopLearnersList learners={topLearners} title="Top Apprentices" />
            </div>
          </div>

          {/* Recent Activity */}
          {analyticsData?.recentProjects?.length > 0 && (
            <div className="animate-fade-in-up">
              <RecentActivity projects={analyticsData.recentProjects} />
            </div>
          )}

          {/* Monthly Trend Chart */}
          {analyticsData?.monthlyTrend?.length > 0 && (
            <div className="animate-fade-in-up min-h-[300px] sm:min-h-[350px]">
              <MonthlyTrend data={analyticsData.monthlyTrend} />
            </div>
          )}

          {/* Performance Insights */}
          <div className="animate-fade-in-up">
            <PerformanceInsights data={overview} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MentorAnalysis;
