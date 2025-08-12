import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import axios from "axios";
import {
  Calendar,
  Clock,
  Plus,
  Video,
  Edit3,
  Trash2,
  RotateCcw,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Menu,
  Users,
  BookOpen,
  Star,
} from "lucide-react";

// Import components
import LearnerProjectProfile from "../../components/mentor/mentorSessions/LearnerProjectProfile";
import SessionList from "../../components/mentor/mentorSessions/SessionList";
import AddSessionForm from "../../components/mentor/mentorSessions/AddSessionForm";

const MentorSessions = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("sessions");

  // Data states
  const [sessionsData, setSessionsData] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [showAddSession, setShowAddSession] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redirect non-mentors
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "mentor"))) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated, user]);

  // Fetch sessions data
  useEffect(() => {
    const fetchSessions = async () => {
      if (!isAuthenticated) return;

      try {
        setSessionsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${apiUrl}/api/sessions/mentor`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSessionsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      } finally {
        setSessionsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, refreshTrigger]);

  // Refresh data
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Show loading
  if (loading || sessionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">
            Loading Sessions...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // No project state
  const NoProjectState = () => (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-cyan-400" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 text-center">
        No Project in Progress
      </h3>
      <p className="text-gray-300 text-center mb-4 sm:mb-6 max-w-md text-sm sm:text-base px-4">
        You need an active project to schedule sessions with learners. Once you
        have a project in progress, you can schedule mentoring sessions here.
      </p>
      <button
        onClick={() => (window.location.href = "/mentor/dashboard")}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 text-sm sm:text-base"
      >
        Go to Dashboard
      </button>
    </div>
  );

  // Past sessions only state
  const PastSessionsOnlyState = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-amber-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-400/30 mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-amber-500/30 rounded-xl flex-shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">
              Past Sessions Only
            </h3>
            <p className="text-amber-200 text-sm sm:text-base">
              You have completed sessions but no active project. Start a new
              project to schedule more sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Display past sessions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4 sm:p-6 mx-2 sm:mx-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
          <Calendar className="mr-2 sm:mr-3 text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />
          Session History
        </h2>
        <SessionList
          sessions={sessionsData?.sessions || []}
          onRefresh={refreshData}
          isPastOnly={true}
        />
      </div>
    </div>
  );

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
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Sessions
            </h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Main Page Content */}
        <div className="relative z-10 p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 px-2 sm:px-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                Mentoring Sessions
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Manage your mentoring sessions and track progress
              </p>
            </div>

            {/* Add Session Button - Only show if has active project */}
            {sessionsData?.hasActiveProject && (
              <button
                onClick={() => setShowAddSession(true)}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Schedule Session</span>
                <span className="xs:hidden">Schedule</span>
              </button>
            )}
          </div>

          {/* Content based on state */}
          {!sessionsData?.hasActiveProject &&
            sessionsData?.sessions?.length === 0 && <NoProjectState />}

          {!sessionsData?.hasActiveProject &&
            sessionsData?.sessions?.length > 0 && <PastSessionsOnlyState />}

          {sessionsData?.hasActiveProject && (
            <div className="space-y-4 sm:space-y-6">
              {/* Learner & Project Profile */}
              <LearnerProjectProfile
                activeProject={sessionsData.activeProject}
              />

              {/* Sessions List */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4 sm:p-6 mx-2 sm:mx-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                    <Calendar className="mr-2 sm:mr-3 text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />
                    Scheduled Sessions
                  </h2>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                    <span>Total: {sessionsData?.sessions?.length || 0}</span>
                  </div>
                </div>

                <SessionList
                  sessions={sessionsData?.sessions || []}
                  onRefresh={refreshData}
                  isPastOnly={false}
                />
              </div>
            </div>
          )}

          {/* Add Session Modal */}
          {showAddSession && (
            <AddSessionForm
              activeProject={sessionsData?.activeProject}
              onClose={() => setShowAddSession(false)}
              onSuccess={() => {
                setShowAddSession(false);
                refreshData();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSessions;
