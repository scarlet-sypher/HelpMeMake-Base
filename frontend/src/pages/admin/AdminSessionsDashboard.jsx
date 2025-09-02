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
  Trash2,
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
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [batchDeleteConfirmText, setBatchDeleteConfirmText] = useState("");
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
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

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedSessions([]);
  };

  const handleSelectSession = (sessionId, isSelected) => {
    if (isSelected) {
      setSelectedSessions((prev) => [...prev, sessionId]);
    } else {
      setSelectedSessions((prev) => prev.filter((id) => id !== sessionId));
    }
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === filteredSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(filteredSessions.map((session) => session._id));
    }
  };

  const handleBatchDelete = async () => {
    if (batchDeleteConfirmText !== "I want to delete all") return;

    setIsBatchDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/sessions/batch-delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionIds: selectedSessions }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete sessions");
      }

      toast.success(`${selectedSessions.length} sessions deleted successfully`);
      setShowBatchDeleteModal(false);
      setBatchDeleteConfirmText("");
      setSelectedSessions([]);
      setSelectionMode(false);
      fetchSessions();
      fetchStats();
    } catch (error) {
      console.error("Batch delete error:", error);
      toast.error("Failed to delete sessions");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
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

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSelectionMode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                selectionMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              {selectionMode ? "Cancel Selection" : "Select Multiple"}
            </button>
            {selectionMode && selectedSessions.length > 0 && (
              <button
                onClick={() => setShowBatchDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Selected ({selectedSessions.length})
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

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

        <div className="bg-slate-800/60 rounded-xl p-6 backdrop-blur-sm border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
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

        {selectionMode && (
          <div className="bg-slate-800/60 rounded-xl p-4 backdrop-blur-sm border border-slate-700 mb-6">
            <button
              onClick={handleSelectAll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {selectedSessions.length === filteredSessions.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
        )}

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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {filteredSessions.map((session) => (
                <SessionsCard
                  key={session._id}
                  session={session}
                  onDelete={handleDeleteSession}
                  selectionMode={selectionMode}
                  isSelected={selectedSessions.includes(session._id)}
                  onSelectChange={handleSelectSession}
                />
              ))}
            </div>

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

        {showBatchDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-red-600 mb-4">
                Delete Sessions
              </h3>
              <p className="text-gray-700 mb-4">
                This will permanently delete {selectedSessions.length} selected
                session{selectedSessions.length !== 1 ? "s" : ""} and all
                associated data.
              </p>
              <p className="text-gray-700 mb-4">
                Please type the following text to confirm:
              </p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-4">
                I want to delete all
              </p>
              <input
                type="text"
                value={batchDeleteConfirmText}
                onChange={(e) => setBatchDeleteConfirmText(e.target.value)}
                placeholder="Type the confirmation text..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleBatchDelete}
                  disabled={
                    batchDeleteConfirmText !== "I want to delete all" ||
                    isBatchDeleting
                  }
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    batchDeleteConfirmText === "I want to delete all" &&
                    !isBatchDeleting
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isBatchDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowBatchDeleteModal(false);
                    setBatchDeleteConfirmText("");
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSessionsDashboard;
