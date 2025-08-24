import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Eye,
  Activity,
  IndianRupee,
} from "lucide-react";
import AdminUserDashboard from "./AdminUserDashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (currentPage === "users") {
    return <AdminUserDashboard onReturn={() => setCurrentPage("dashboard")} />;
  }

  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      if (!adminToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      if (adminToken) {
        await fetch(`${import.meta.env.VITE_API_URL}/admin/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      localStorage.removeItem("admin_token");
      navigate("/login");
    } catch (error) {
      console.error("Admin logout error:", error);
      localStorage.removeItem("admin_token");
      navigate("/login");
    }
  };

  const navigateToPage = (page) => {
    if (page === "users") {
      setCurrentPage("users");
    } else if (page === "learners") {
      navigate("/admin/learners");
    } else {
      navigate(`/admin/${page}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.users?.total || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      subtext: `${stats?.users?.learners || 0} learners, ${
        stats?.users?.mentors || 0
      } mentors`,
    },
    {
      label: "Active Projects",
      value: stats?.projects?.active || 0,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      subtext: `${stats?.projects?.completed || 0} completed`,
    },
    {
      label: "Total Sessions",
      value: stats?.sessions?.total || 0,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      subtext: `${stats?.sessions?.scheduled || 0} scheduled`,
    },
    {
      label: "Message Rooms",
      value: stats?.messageRooms?.total || 0,
      icon: MessageSquare,
      color: "from-indigo-500 to-blue-500",
      subtext: `${stats?.messageRooms?.open || 0} active chats`,
    },
    {
      label: "Total Earnings",
      value: `₹${(stats?.financials?.totalEarnings || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "from-yellow-400 to-orange-500",
      subtext: `Avg rating: ${(
        stats?.financials?.avgProjectRating || 0
      ).toFixed(1)}`,
    },
  ];

  const navigationButtons = [
    {
      label: "Users Management",
      icon: Users,
      color: "bg-blue-600 hover:bg-blue-700",
      page: "users",
      description: "Manage all registered users",
    },
    {
      label: "Learners Management",
      icon: GraduationCap,
      color: "bg-green-600 hover:bg-green-700",
      page: "learners",
      description: "View learner profiles and progress",
    },
    {
      label: "Mentors Management",
      icon: UserCheck,
      color: "bg-purple-600 hover:bg-purple-700",
      page: "mentors",
      description: "Manage mentor profiles and stats",
    },
    {
      label: "Projects Overview",
      icon: Briefcase,
      color: "bg-indigo-600 hover:bg-indigo-700",
      page: "projects",
      description: "Monitor all projects and progress",
    },
    {
      label: "Sessions Management",
      icon: Calendar,
      color: "bg-orange-600 hover:bg-orange-700",
      page: "sessions",
      description: "Track and manage all sessions",
    },
    {
      label: "Message Rooms",
      icon: MessageSquare,
      color: "bg-teal-600 hover:bg-teal-700",
      page: "message-rooms",
      description: "Monitor communication channels",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">Manage your platform from here</p>
          </div>
          <button
            onClick={handleAdminLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Admin Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-gradient-to-r ${card.color} rounded-2xl shadow-lg p-6 text-white hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon size={32} />
                <TrendingUp size={20} className="opacity-60" />
              </div>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="text-lg font-medium mb-2">{card.label}</div>
              <div className="text-sm opacity-80">{card.subtext}</div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Eye className="mr-2" />
            Management Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationButtons.map((button) => (
              <button
                key={button.page}
                onClick={() => navigateToPage(button.page)}
                className={`${button.color} rounded-xl p-6 text-left text-white transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <button.icon size={32} />
                  <ArrowRight size={20} />
                </div>
                <div className="text-xl font-bold mb-2">{button.label}</div>
                <div className="text-sm opacity-90">{button.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-slate-800/60 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-6">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {stats?.projects?.total || 0}
              </div>
              <div className="text-slate-400">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {stats?.sessions?.completed || 0}
              </div>
              <div className="text-slate-400">Completed Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {stats?.users?.mentors || 0}
              </div>
              <div className="text-slate-400">Active Mentors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {stats?.users?.learners || 0}
              </div>
              <div className="text-slate-400">Active Learners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
