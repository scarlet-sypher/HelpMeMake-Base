import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Users, Filter, RefreshCw } from "lucide-react";
import UserCard from "../../components/admin/user/UserCard";
import UserForm from "../../components/admin/user/UserForm";

const AdminUserDashboard = ({ onReturn }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, roleFilter, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchQuery && { search: searchQuery }),
        ...(roleFilter !== "all" && { role: roleFilter }),
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data.users);
      setTotalPages(data.data.pagination.totalPages);
      setTotalUsers(data.data.pagination.totalUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh the users list
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
  };

  const handleSaveUser = async () => {
    setEditingUserId(null);
    await fetchUsers();
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user._id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // If editing a user, show the UserForm
  if (editingUserId) {
    return (
      <UserForm
        userId={editingUserId}
        onSave={handleSaveUser}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReturn}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Return to Dashboard</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-slate-400 mt-1">
                Managing {totalUsers} users across the platform
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="pl-10 pr-8 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">Learners</option>
                <option value="mentor">Mentors</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw
                className="animate-spin text-blue-400 mx-auto mb-4"
                size={48}
              />
              <p className="text-white text-xl">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-2xl p-6 mb-8">
            <p className="text-red-400 text-center">{error}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Users Found */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="text-slate-400 mx-auto mb-4" size={64} />
            <p className="text-white text-xl mb-2">No users found</p>
            <p className="text-slate-400">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are no users in the system yet."}
            </p>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && filteredUsers.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onDelete={handleDeleteUser}
                  onEdit={handleEditUser}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-400 transition-colors"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum =
                      currentPage > 3 ? currentPage - 2 + i : i + 1;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-white hover:bg-slate-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-400 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Stats Summary */}
        {!loading && !error && users.length > 0 && (
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {totalUsers}
                </div>
                <div className="text-slate-400 text-sm">Total Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {users.filter((u) => u.role === "user").length}
                </div>
                <div className="text-slate-400 text-sm">Learners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {users.filter((u) => u.role === "mentor").length}
                </div>
                <div className="text-slate-400 text-sm">Mentors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {users.filter((u) => u.isAccountActive).length}
                </div>
                <div className="text-slate-400 text-sm">Active Users</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDashboard;
