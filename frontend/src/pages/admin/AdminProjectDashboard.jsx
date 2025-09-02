import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Briefcase,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import ProjectCard from "../../components/admin/project/ProjectCard";
import ProjectView from "../../components/admin/project/ProjectView";
import ProjectEdit from "../../components/admin/project/ProjectEdit";
import toast from "react-hot-toast";

const AdminProjectDashboard = ({ onReturn }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [stats, setStats] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [batchDeleteConfirmText, setBatchDeleteConfirmText] = useState("");
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const statusOptions = ["", "Open", "In Progress", "Completed", "Cancelled"];
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("admin_token");

      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects?${params}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.data.projects);
      setTotalPages(data.data.pagination.totalPages);
      setTotalProjects(data.data.pagination.totalProjects);
    } catch (error) {
      console.error("Fetch projects error:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/stats`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedProjects([]);
  };

  const handleSelectProject = (projectId, isSelected) => {
    if (isSelected) {
      setSelectedProjects((prev) => [...prev, projectId]);
    } else {
      setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((project) => project._id));
    }
  };

  const handleBatchDelete = async () => {
    if (batchDeleteConfirmText !== "I want to delete all") return;

    setIsBatchDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/batch-delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectIds: selectedProjects }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete projects");
      }

      toast.success(`${selectedProjects.length} projects deleted successfully`);
      setShowBatchDeleteModal(false);
      setBatchDeleteConfirmText("");
      setSelectedProjects([]);
      setSelectionMode(false);
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error("Batch delete error:", error);
      toast.error("Failed to delete projects");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleViewProject = (projectId) => {
    if (projectId && projectId !== "undefined") {
      navigate(`/admin/projects/${projectId}/view`);
    } else {
      toast.error("Invalid project ID");
    }
  };

  const handleEditProject = (project) => {
    navigate(`/admin/projects/${project._id}/edit`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      toast.success("Project deleted successfully");
      fetchProjects();
      fetchStats();
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Failed to delete project");
      throw error;
    }
  };

  const handleRefresh = () => {
    fetchProjects();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReturn || (() => navigate("/admindashboard"))}
              className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="text-lg font-medium">
                Back to Admin Dashboard
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">
              Projects Management
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSelectionMode}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectionMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-600 hover:bg-gray-700 text-white"
                }`}
              >
                {selectionMode ? "Cancel Selection" : "Select Multiple"}
              </button>
              {selectionMode && selectedProjects.length > 0 && (
                <button
                  onClick={() => setShowBatchDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Selected ({selectedProjects.length})</span>
                </button>
              )}
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Briefcase size={32} />
                <TrendingUp size={20} className="opacity-60" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totals.total}
              </div>
              <div className="text-lg font-medium">Total Projects</div>
              <div className="text-sm opacity-80 mt-2">
                Across all categories
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Activity size={32} />
                <TrendingUp size={20} className="opacity-60" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totals.active}
              </div>
              <div className="text-lg font-medium">In Progress</div>
              <div className="text-sm opacity-80 mt-2">
                Currently active projects
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle size={32} />
                <TrendingUp size={20} className="opacity-60" />
              </div>
              <div className="text-2xl font-bold mb-1">
                {stats.totals.completed}
              </div>
              <div className="text-lg font-medium">Completed</div>
              <div className="text-sm opacity-80 mt-2">
                Successfully finished
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle size={32} />
                <TrendingUp size={20} className="opacity-60" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totals.open}</div>
              <div className="text-lg font-medium">Open</div>
              <div className="text-sm opacity-80 mt-2">
                Awaiting mentor assignment
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by project name, ID, or category..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Status:</span>
              </div>
              <div className="flex space-x-2">
                {statusOptions.map((status) => (
                  <button
                    key={status || "all"}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status || "All"}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-gray-600">
              Showing {projects.length} of {totalProjects} projects
            </div>
          </div>

          {/* Selection Mode Controls */}
          {selectionMode && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <button
                onClick={handleSelectAll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {selectedProjects.length === projects.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <span className="text-gray-600 text-sm">
                {selectedProjects.length} of {projects.length} projects selected
              </span>
            </div>
          )}
        </div>

        {/* Projects Grid or Empty State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-white text-xl">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Projects Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter
                ? "No projects match your current search criteria. Try adjusting your filters."
                : "There are no projects in the system yet."}
            </p>
            {(searchTerm || statusFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onView={handleViewProject}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  selectionMode={selectionMode}
                  isSelected={selectedProjects.includes(project._id)}
                  onSelectChange={handleSelectProject}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium transition-colors"
                >
                  Previous
                </button>

                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 px-4 py-2 rounded-lg border border-gray-300 font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Batch Delete Confirmation Modal */}
        {showBatchDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Projects
                </h3>
                <p className="text-gray-600 mb-4">
                  This will permanently delete {selectedProjects.length}{" "}
                  selected project{selectedProjects.length !== 1 ? "s" : ""} and
                  all associated data.
                </p>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type the following to confirm:
                    <span className="block font-mono text-red-600 bg-red-50 p-2 rounded mt-1">
                      I want to delete all
                    </span>
                  </label>
                  <input
                    type="text"
                    value={batchDeleteConfirmText}
                    onChange={(e) => setBatchDeleteConfirmText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Type confirmation text here..."
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBatchDeleteModal(false);
                    setBatchDeleteConfirmText("");
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                  disabled={isBatchDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBatchDelete}
                  disabled={
                    batchDeleteConfirmText !== "I want to delete all" ||
                    isBatchDeleting
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {isBatchDeleting ? "Deleting..." : "Delete All"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjectDashboard;
