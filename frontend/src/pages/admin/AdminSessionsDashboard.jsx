import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import SessionsCard from "../../components/admin/sessions/SessionsCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminSessionsDashboard = ({ onReturn }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    ongoing: 0,
    expired: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0,
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    {
      value: "scheduled",
      label: "Scheduled",
      color: "text-blue-600",
      icon: Calendar,
    },
    {
      value: "ongoing",
      label: "Ongoing",
      color: "text-yellow-600",
      icon: Clock,
    },
    {
      value: "completed",
      label: "Completed",
      color: "text-green-600",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "text-red-600",
      icon: XCircle,
    },
    {
      value: "expired",
      label: "Expired",
      color: "text-gray-600",
      icon: AlertCircle,
    },
  ];

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, [searchTerm, selectedStatus]);

  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("admin_token");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/sessions?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data.data.sessions);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/sessions/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      const data = await response.json();
      toast.success("Session deleted successfully");

      setSessions(sessions.filter((session) => session._id !== sessionId));

      fetchStats();
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session");
      throw error;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleRefresh = () => {
    fetchSessions();
    fetchStats();
    toast.success("Sessions refreshed");
  };

  const getFilteredSessions = () => {
    return sessions;
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                onReturn ? onReturn() : navigate("/admindashboard")
              }
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Return to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Sessions Management
              </h1>
              <p className="text-slate-400">Manage all platform sessions</p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-800/60 rounded-xl p-4 backdrop-blur-sm border border-slate-700">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-slate-400 text-sm">Total Sessions</div>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-4 backdrop-blur-sm border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">
              {stats.scheduled}
            </div>
            <div className="text-slate-400 text-sm">Scheduled</div>
          </div>
          <div className="bg-yellow-500/20 rounded-xl p-4 backdrop-blur-sm border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">
              {stats.ongoing}
            </div>
            <div className="text-slate-400 text-sm">Ongoing</div>
          </div>
          <div className="bg-green-500/20 rounded-xl p-4 backdrop-blur-sm border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">
              {stats.completed}
            </div>
            <div className="text-slate-400 text-sm">Completed</div>
          </div>
          <div className="bg-red-500/20 rounded-xl p-4 backdrop-blur-sm border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">
              {stats.cancelled}
            </div>
            <div className="text-slate-400 text-sm">Cancelled</div>
          </div>
          <div className="bg-gray-500/20 rounded-xl p-4 backdrop-blur-sm border border-gray-500/30">
            <div className="text-2xl font-bold text-gray-400">
              {stats.expired}
            </div>
            <div className="text-slate-400 text-sm">Expired</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by project name, session title, mentor or learner name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={20} />
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Sessions Found
            </h3>
            <p className="text-slate-400">
              {searchTerm || selectedStatus
                ? "No sessions match your current filters."
                : "No sessions have been created yet."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Sessions ({filteredSessions.length})
              </h2>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredSessions.map((session) => (
                <SessionsCard
                  key={session._id}
                  session={session}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => fetchSessions(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Previous
                </button>

                <span className="text-white">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => fetchSessions(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSessionsDashboard;
