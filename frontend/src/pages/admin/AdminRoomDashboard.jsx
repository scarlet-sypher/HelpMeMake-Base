import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import RoomCard from "../../components/admin/room/RoomCard";

export default function AdminRoomDashboard({ onReturn }) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalRooms: 0,
    openRooms: 0,
    closedRooms: 0,
    totalMessages: 0,
    recentMessages: 0,
  });

  useEffect(() => {
    fetchRoomsData();
    fetchRoomStats();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [searchTerm, statusFilter, rooms]);

  const fetchRoomsData = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("admin_token");

      if (!adminToken) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/rooms`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();
      setRooms(data.data);
      setFilteredRooms(data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomStats = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/rooms/stats`,
        {
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
      console.error("Error fetching room stats:", error);
    }
  };

  const handleRoomUpdate = (roomId, updatedData) => {
    // Update the room in your rooms state
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === roomId ? { ...room, ...updatedData } : room
      )
    );

    // Also update filteredRooms to reflect changes immediately
    setFilteredRooms((prevFilteredRooms) =>
      prevFilteredRooms.map((room) =>
        room._id === roomId ? { ...room, ...updatedData } : room
      )
    );

    // Update stats if status changed
    if (updatedData.status) {
      fetchRoomStats();
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((room) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          room.roomName.toLowerCase().includes(searchLower) ||
          room.roomId.toLowerCase().includes(searchLower) ||
          room.mentor.name.toLowerCase().includes(searchLower) ||
          room.mentor.email.toLowerCase().includes(searchLower) ||
          room.learner.name.toLowerCase().includes(searchLower) ||
          room.learner.email.toLowerCase().includes(searchLower) ||
          room.project.name.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((room) => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
  };

  const handleRefresh = () => {
    fetchRoomsData();
    fetchRoomStats();
  };

  const handleReturnToDashboard = () => {
    if (onReturn) {
      onReturn();
    } else {
      navigate("/admindashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading chat rooms...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Rooms
          </h2>
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleReturnToDashboard}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReturnToDashboard}
              className="flex items-center gap-2 text-white hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <MessageSquare size={32} />
                Chat Rooms Management
              </h1>
              <p className="text-slate-400">
                Monitor all communication channels
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare size={32} />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <div className="text-lg font-medium">Total Rooms</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity size={32} />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-2xl font-bold">{stats.openRooms}</div>
            <div className="text-lg font-medium">Active Rooms</div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-2xl font-bold">{stats.closedRooms}</div>
            <div className="text-lg font-medium">Closed Rooms</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare size={32} />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-2xl font-bold">
              {stats.totalMessages.toLocaleString()}
            </div>
            <div className="text-lg font-medium">Total Messages</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity size={32} />
              <TrendingUp size={20} className="opacity-60" />
            </div>
            <div className="text-2xl font-bold">{stats.recentMessages}</div>
            <div className="text-lg font-medium">Recent (24h)</div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by room, mentor, learner, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-slate-300 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all" className="bg-slate-800">
                  All Status
                </option>
                <option value="open" className="bg-slate-800">
                  Open Rooms
                </option>
                <option value="close" className="bg-slate-800">
                  Closed Rooms
                </option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-white/60">
            <span>
              Showing {filteredRooms.length} of {rooms.length} rooms
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-300 hover:text-blue-100 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
            <MessageSquare className="mx-auto mb-4 text-white/40" size={64} />
            <h3 className="text-xl font-bold text-white mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No matching rooms found"
                : "No rooms found"}
            </h3>
            <p className="text-white/60">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search criteria or filters"
                : "No chat rooms have been created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onRoomUpdate={handleRoomUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
