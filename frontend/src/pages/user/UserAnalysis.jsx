import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Sidebar from "../../components/user/Sidebar";
import StatCard from "../../components/user/userAnalysis/StatCard";
import ProjectStatusChart from "../../components/user/userAnalysis/ProjectStatusChart";
import TopMentorsList from "../../components/user/userAnalysis/TopMentorsList";
import {
  Folders,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Award,
  BarChart3,
  Activity,
  BookOpen,
  Menu,
} from "lucide-react";

const UserAnalysis = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("analytics");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${apiUrl}/api/analysis/learner`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setAnalyticsData(response.data.data);
          setError(null);
        } else {
          setError("Failed to fetch analytics data");
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError(
          error.response?.data?.message || "Failed to fetch analytics data"
        );

        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading Analytics...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          userRole="user"
        />
        <div className="flex-1 lg:ml-64">
          <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">Analytics</h1>
              <div className="w-6"></div>
            </div>
          </div>
          <div className="p-6 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Failed to Load Analytics
              </h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = analyticsData;

  const statCards = [
    {
      icon: Folders,
      label: "Total Projects",
      value: data?.overview?.totalProjects?.toString() || "0",
      change: "+2 this month",
      color: "from-blue-500 to-cyan-500",
      progressValue: Math.min((data?.overview?.totalProjects / 10) * 100, 100),
    },
    {
      icon: CheckCircle,
      label: "Completed Projects",
      value: data?.overview?.completedProjects?.toString() || "0",
      change: "+1 this week",
      color: "from-emerald-500 to-teal-500",
      progressValue:
        data?.overview?.totalProjects > 0
          ? (data?.overview?.completedProjects /
              data?.overview?.totalProjects) *
            100
          : 0,
    },
    {
      icon: Clock,
      label: "Ongoing Projects",
      value: data?.overview?.ongoingProjects?.toString() || "0",
      change: "Active now",
      color: "from-purple-500 to-pink-500",
      progressValue:
        data?.overview?.totalProjects > 0
          ? (data?.overview?.ongoingProjects / data?.overview?.totalProjects) *
            100
          : 0,
    },
    {
      icon: Star,
      label: "Average Rating",
      value: data?.overview?.averageRating || "0.0",
      change: "+0.2 this month",
      color: "from-orange-500 to-red-500",
      progressValue: (parseFloat(data?.overview?.averageRating || 0) / 5) * 100,
    },
  ];

  const additionalStats = [
    {
      icon: Calendar,
      label: "Total Sessions",
      value: data?.sessions?.totalSessions?.toString() || "0",
      change: `${data?.sessions?.completedSessions || 0} completed`,
      color: "from-indigo-500 to-purple-500",
      progressValue:
        data?.sessions?.totalSessions > 0
          ? (data?.sessions?.completedSessions /
              data?.sessions?.totalSessions) *
            100
          : 0,
    },
    {
      icon: Target,
      label: "Success Rate",
      value: `${data?.overview?.successRate || 0}%`,
      change:
        data?.overview?.successRate >= 80 ? "Excellent!" : "Keep improving!",
      color: "from-green-500 to-emerald-500",
      progressValue: data?.overview?.successRate || 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="user"
      />

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Analytics</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          <div className="relative z-10 p-4 sm:p-5 lg:p-6 space-y-6">
            <div className="relative group mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>

              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-5 sm:p-6 lg:p-8 border border-white/20 transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-60"></div>
                      <img
                        src={
                          data?.learner?.avatar?.startsWith("/uploads/")
                            ? `${import.meta.env.VITE_API_URL}${
                                data?.learner?.avatar
                              }`
                            : data?.learner?.avatar ||
                              "/uploads/public/default.jpg"
                        }
                        alt={data?.learner?.name}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-white/20"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                        {data?.learner?.name}'s Analytics
                      </h1>
                      <p className="text-blue-300 text-sm sm:text-base">
                        {data?.learner?.title}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {data?.learner?.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        Level {data?.learner?.level}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-300">
                        Current Level
                      </div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        {data?.learningStats?.streakDays || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-orange-300">
                        Day Streak
                      </div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        {data?.learningStats?.totalAchievements || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-300">
                        Achievements
                      </div>
                    </div>
                  </div>
                </div>

                {data?.learner && (
                  <div className="mt-6">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-300 mb-2">
                      <span>Experience Progress</span>
                      <span>
                        {data.learner.xp} / {data.learner.nextLevelXp} XP
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5 sm:h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-[1200ms] ease-out"
                        style={{
                          width: `${
                            data.learningStats?.progressPercentage || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} isLoading={false} />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
            {additionalStats.map((stat, index) => (
              <StatCard key={index} {...stat} isLoading={false} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ProjectStatusChart
                data={data?.projectDistribution}
                isLoading={false}
              />
            </div>

            <div>
              <TopMentorsList
                mentors={data?.topMentors || []}
                isLoading={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="mr-2 text-purple-400" size={20} />
                  Learning Progress
                </h3>

                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl 
                      transition-transform duration-300 ease-out hover:scale-[1.03] hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Target size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Milestones</div>
                        <div className="text-gray-400 text-sm">
                          Total completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {data?.milestones?.completedMilestones || 0}
                      </div>
                      <div className="text-gray-400 text-sm">
                        of {data?.milestones?.totalMilestones || 0}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl 
                      transition-transform duration-300 ease-out hover:scale-[1.03] hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Sessions</div>
                        <div className="text-gray-400 text-sm">
                          Completed sessions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {data?.sessions?.completedSessions || 0}
                      </div>
                      <div className="text-emerald-400 text-sm">
                        +{data?.sessions?.upcomingSessions || 0} upcoming
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl 
                      transition-transform duration-300 ease-out hover:scale-[1.03] hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Award size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Success Rate
                        </div>
                        <div className="text-gray-400 text-sm">
                          Overall completion
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-lg">
                        {data?.overview?.successRate || 0}%
                      </div>
                      <div className="text-blue-400 text-sm">
                        {data?.overview?.successRate >= 80
                          ? "Excellent!"
                          : data?.overview?.successRate >= 60
                          ? "Good job!"
                          : "Keep going!"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Activity className="mr-2 text-orange-400" size={20} />
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  {data?.recentProjects?.length > 0 ? (
                    data.recentProjects.slice(0, 5).map((project, index) => (
                      <div
                        key={project.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              project.status === "Completed"
                                ? "bg-emerald-500"
                                : project.status === "In Progress"
                                ? "bg-blue-500"
                                : project.status === "Cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {project.status === "Completed" ? (
                              <CheckCircle size={16} className="text-white" />
                            ) : project.status === "In Progress" ? (
                              <Clock size={16} className="text-white" />
                            ) : project.status === "Cancelled" ? (
                              <XCircle size={16} className="text-white" />
                            ) : (
                              <BookOpen size={16} className="text-white" />
                            )}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium truncate max-w-[180px] sm:max-w-xs">
                              {project.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              with {project.mentorName} •{" "}
                              {project.progressPercentage}% complete
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">
                        Start a project to see your activity here!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {data?.monthlyTrend && data.monthlyTrend.length > 0 && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="mr-2 text-cyan-400" size={20} />
                  Monthly Completion Trend
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {data.monthlyTrend.map((month, index) => {
                    const maxCompleted = Math.max(
                      ...data.monthlyTrend.map((m) => m.completed)
                    );
                    const height =
                      maxCompleted > 0
                        ? (month.completed / maxCompleted) * 100
                        : 0;

                    return (
                      <div key={index} className="text-center">
                        <div className="h-24 flex items-end justify-center mb-2">
                          <div
                            className="w-8 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all duration-1000 ease-out"
                            style={{
                              height: `${Math.max(height, 5)}%`,
                              transitionDelay: `${index * 100}ms`,
                            }}
                          ></div>
                        </div>
                        <div className="text-white font-semibold">
                          {month.completed}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {month.month}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAnalysis;
