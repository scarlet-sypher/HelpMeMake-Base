import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  Activity,
  RefreshCw,
  Filter,
  Download,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import LearnerCard from "../../components/admin/learner/LearnerCard";

export default function AdminLearnerDashboard({ onReturn }) {
  const [learners, setLearners] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearners();
    fetchStats();
  }, [pagination.page]);

  useEffect(() => {
    filterLearners();
  }, [searchTerm, learners]);

  const fetchLearners = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("admin_token");

      if (!adminToken) {
        navigate("/login");
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners?${params}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setLearners(data.data.learners);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch learners");
      }
    } catch (error) {
      console.error("Fetch learners error:", error);
      toast.error("Failed to fetch learners");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/learners/stats`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const filterLearners = () => {
    if (!searchTerm.trim()) {
      setFilteredLearners(learners);
      return;
    }

    const filtered = learners.filter((learner) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        learner.name?.toLowerCase().includes(searchLower) ||
        learner.email?.toLowerCase().includes(searchLower) ||
        learner._id?.toLowerCase().includes(searchLower) ||
        learner.learnerDetails?.title?.toLowerCase().includes(searchLower) ||
        learner.learnerDetails?.location?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredLearners(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    fetchLearners();
    fetchStats();
    toast.success("Data refreshed successfully");
  };

  const handleLearnerDeleted = (deletedLearnerId) => {
    setLearners((prev) =>
      prev.filter((learner) => learner._id !== deletedLearnerId)
    );
    setFilteredLearners((prev) =>
      prev.filter((learner) => learner._id !== deletedLearnerId)
    );
    fetchStats();
  };

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate("/admindashboard");
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading && learners.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading learners...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReturn}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Learner Management
              </h1>
              <p className="text-slate-400">
                Manage all registered learners on your platform
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                size={18}
                className={`text-white ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">Total Learners</div>
                </div>
                <Users size={32} className="opacity-60" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.active}</div>
                  <div className="text-sm opacity-90">Active Online</div>
                </div>
                <UserCheck size={32} className="opacity-60" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.newThisMonth}</div>
                  <div className="text-sm opacity-90">New This Month</div>
                </div>
                <Activity size={32} className="opacity-60" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search learners by name, email, ID, title..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-400">
                {searchTerm
                  ? `${filteredLearners.length} filtered`
                  : `${pagination.total} total`}{" "}
                learners
              </div>
            </div>
          </div>
        </div>

        {filteredLearners.length === 0 ? (
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-12 text-center border border-slate-700/50">
            <Users size={64} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? "No learners found" : "No learners found"}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "There are currently no learners registered on your platform"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredLearners.map((learner) => (
                <LearnerCard
                  key={learner._id}
                  learner={learner}
                  onDelete={handleLearnerDeleted}
                />
              ))}
            </div>

            {!searchTerm && pagination.pages > 1 && (
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} learners
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.pages) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.pages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.pages - 2) {
                            pageNum = pagination.pages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                              className={`px-3 py-2 rounded-lg transition-colors ${
                                pageNum === pagination.page
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages || loading}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {loading && learners.length > 0 && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-white">Loading learners...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
