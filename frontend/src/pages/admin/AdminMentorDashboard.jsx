import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Users,
  Star,
  UserCheck,
  Clock,
  TrendingUp,
  Filter,
  RefreshCw,
  Plus,
  Award,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import MentorCard from "../../components/admin/mentor/MentorCard";

const AdminMentorDashboard = ({ onReturn }) => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    rating: "all",
    experience: "all",
    location: "all",
  });

  useEffect(() => {
    fetchMentors();
    fetchStats();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [mentors, searchTerm, filters]);

  const fetchMentors = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      if (!adminToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors?search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMentors(data.data.mentors);
      } else {
        toast.error(data.message || "Failed to fetch mentors");
      }
    } catch (error) {
      console.error("Fetch mentors error:", error);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors/stats`,
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

  const filterMentors = () => {
    let filtered = mentors.filter((mentor) => {
      const searchMatch =
        !searchTerm ||
        mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.mentorProfile?.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        mentor.mentorProfile?.location
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      let statusMatch = true;
      if (filters.status !== "all") {
        const mentorData = mentor.mentorProfile || {};
        switch (filters.status) {
          case "online":
            statusMatch = mentorData.isOnline === true;
            break;
          case "offline":
            statusMatch = mentorData.isOnline === false;
            break;
          case "available":
            statusMatch = mentorData.isAvailable === true;
            break;
          case "unavailable":
            statusMatch = mentorData.isAvailable === false;
            break;
        }
      }

      let ratingMatch = true;
      if (filters.rating !== "all") {
        const rating = mentor.mentorProfile?.rating || 0;
        switch (filters.rating) {
          case "high":
            ratingMatch = rating >= 4;
            break;
          case "medium":
            ratingMatch = rating >= 2 && rating < 4;
            break;
          case "low":
            ratingMatch = rating < 2;
            break;
        }
      }

      let experienceMatch = true;
      if (filters.experience !== "all") {
        const years = mentor.mentorProfile?.experience?.years || 0;
        switch (filters.experience) {
          case "junior":
            experienceMatch = years < 2;
            break;
          case "senior":
            experienceMatch = years >= 2 && years < 5;
            break;
          case "expert":
            experienceMatch = years >= 5;
            break;
        }
      }

      return searchMatch && statusMatch && ratingMatch && experienceMatch;
    });

    setFilteredMentors(filtered);
  };

  const handleMentorDelete = (mentorId) => {
    setMentors((prev) =>
      prev.filter(
        (mentor) => (mentor.mentorProfile?._id || mentor._id) !== mentorId
      )
    );
    toast.success("Mentor removed from list");
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchMentors();
    fetchStats();
  };

  const handleReturn = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate("/admindashboard");
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      rating: "all",
      experience: "all",
      location: "all",
    });
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <button
              onClick={handleReturn}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Mentors Management
              </h1>
              <p className="text-slate-400">
                Manage all mentor profiles and their information
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/admin/mentors/create")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Mentor
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.totalMentors}
              </div>
              <div className="text-lg font-medium mb-2">Total Mentors</div>
              <div className="text-sm opacity-80">
                {stats.onlineMentors} online, {stats.availableMentors} available
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
              </div>
              <div className="text-lg font-medium mb-2">Avg Rating</div>
              <div className="text-sm opacity-80">Across all mentors</div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.totalSessions}
              </div>
              <div className="text-lg font-medium mb-2">Total Sessions</div>
              <div className="text-sm opacity-80">Completed sessions</div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <UserCheck className="w-8 h-8" />
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.totalStudents}
              </div>
              <div className="text-lg font-medium mb-2">Total Students</div>
              <div className="text-sm opacity-80">Students mentored</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, ID, title, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, rating: e.target.value }))
                }
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="high">High (4+ stars)</option>
                <option value="medium">Medium (2-4 stars)</option>
                <option value="low">Low (&lt;2 stars)</option>
              </select>

              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Experience</option>
                <option value="junior">Junior (&lt;2 years)</option>
                <option value="senior">Senior (2-5 years)</option>
                <option value="expert">Expert (5+ years)</option>
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm flex items-center"
              >
                <Filter className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || Object.values(filters).some((f) => f !== "all")) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  Search: "{searchTerm}"
                </span>
              )}
              {filters.status !== "all" && (
                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm border border-green-500/30">
                  Status: {filters.status}
                </span>
              )}
              {filters.rating !== "all" && (
                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
                  Rating: {filters.rating}
                </span>
              )}
              {filters.experience !== "all" && (
                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                  Experience: {filters.experience}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-300">
            Showing{" "}
            <span className="text-white font-medium">
              {filteredMentors.length}
            </span>{" "}
            of <span className="text-white font-medium">{mentors.length}</span>{" "}
            mentors
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {mentors.length === 0
                ? "No mentors found"
                : "No mentors match your search"}
            </h3>
            <p className="text-slate-400 mb-6">
              {mentors.length === 0
                ? "There are no mentors registered in the system yet."
                : "Try adjusting your search terms or filters to find mentors."}
            </p>
            {mentors.length === 0 && (
              <button
                onClick={() => navigate("/admin/mentors/create")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Mentor
              </button>
            )}
            {mentors.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                onDelete={handleMentorDelete}
              />
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredMentors.length > 0 && (
          <div className="text-center mt-12">
            <div className="text-slate-400">
              End of results - {filteredMentors.length} mentors shown
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMentorDashboard;
