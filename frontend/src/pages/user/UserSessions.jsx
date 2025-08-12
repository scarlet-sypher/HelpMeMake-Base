import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import UserSessionBox from "../../components/user/userSessions/UserSessionBox";
import axios from "axios";
import {
  Calendar,
  Clock,
  AlertCircle,
  Menu,
  BookOpen,
  Activity,
  TrendingUp,
  Zap,
} from "lucide-react";

const UserSession = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("sessions");
  const [sessionData, setSessionData] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    const fetchSessions = async () => {
      if (isAuthenticated) {
        try {
          setSessionLoading(true);
          setError(null);

          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await axios.get(`${apiUrl}/api/sessions/user`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            setSessionData(response.data);
          } else {
            setError(response.data.message || "Failed to fetch sessions");
          }
        } catch (error) {
          console.error("Error fetching sessions:", error);
          setError(
            error.response?.data?.message ||
              "Failed to fetch sessions. Please try again."
          );

          if (error.response?.status === 401) {
            window.location.href = "/login";
          }
        } finally {
          setSessionLoading(false);
        }
      }
    };

    fetchSessions();
  }, [isAuthenticated]);

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-1">
              Loading Sessions...
            </div>
            <div className="text-blue-300 text-sm">
              Please wait while we fetch your data
            </div>
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

  const handleSessionUpdate = () => {
    const fetchSessions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${apiUrl}/api/sessions/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSessionData(response.data);
        }
      } catch (error) {
        console.error("Error refetching sessions:", error);
      }
    };

    fetchSessions();
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-red-400/30">
                <AlertCircle className="text-red-400" size={32} />
              </div>
              <div className="absolute inset-0 bg-red-400/10 rounded-full blur-xl"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <TrendingUp
                className="group-hover:rotate-12 transition-transform duration-300"
                size={16}
              />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    if (
      !sessionData ||
      !sessionData.sessionsByProject ||
      Object.keys(sessionData.sessionsByProject).length === 0
    ) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-lg mx-auto px-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-blue-400/30">
                <Calendar className="text-blue-400" size={36} />
              </div>
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              No Sessions Yet
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Once your mentor schedules sessions, they will appear here. Your
              learning journey is about to begin!
            </p>
            <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
              <div className="relative">
                <Activity className="text-blue-400 animate-pulse" size={20} />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-blue-300 font-medium text-sm">
                Waiting for mentor to schedule sessions...
              </span>
            </div>
          </div>
        </div>
      );
    }

    const projectBoxes = Object.entries(sessionData.sessionsByProject)
      .map(([projectId, projectData]) => ({
        projectId,
        ...projectData,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.project.startDate || a.project.createdAt || 0);
        const dateB = new Date(b.project.startDate || b.project.createdAt || 0);
        return dateB - dateA;
      });

    return (
      <div className="space-y-6">
        {projectBoxes.map((projectBox, index) => (
          <div
            key={projectBox.projectId}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <UserSessionBox
              projectData={projectBox}
              onSessionUpdate={handleSessionUpdate}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="user"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/90 to-blue-900/90 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 text-white hover:text-blue-300 transition-all duration-200 hover:bg-white/10 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <Zap className="text-blue-400" size={18} />
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Sessions
              </h1>
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <Calendar className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                        My Sessions
                      </h1>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-1"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base font-medium">
                    Track and join your scheduled learning sessions
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <div className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                        {sessionData?.totalSessions || 0}
                      </div>
                      <div className="text-xs text-blue-200 font-medium flex items-center justify-center space-x-1">
                        <BookOpen size={10} />
                        <span>Total Sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:scale-105">
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                        {sessionData?.hasActiveSessions ? "Active" : "None"}
                      </div>
                      <div className="text-xs text-green-200 font-medium flex items-center justify-center space-x-1">
                        <Clock size={10} />
                        <span>Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Content */}
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
};

export default UserSession;
