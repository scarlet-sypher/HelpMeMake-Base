import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Sidebar from "../../components/user/Sidebar";
import ExpectedEndDateViewer from "../../components/user/userMentorPage/ExpectedEndDateViewer";
import ProjectProgressViewer from "../../components/user/userMentorPage/ProjectProgressViewer";
import MentorProjectCard from "../../components/user/userMentorPage/MentorProjectCard";
import CompleteCancelBox from "../../components/user/userMentorPage/CompleteCancelBox";
import { Menu, Calendar, User, Activity, AlertCircle, X } from "lucide-react";

const MyMentor = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("mentor");
  const [projectData, setProjectData] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info",
  });

  const Toast = ({ open, message, status, onClose }) => {
    useEffect(() => {
      if (open) {
        const timer = setTimeout(() => onClose(), 4000);
        const handleEsc = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleEsc);
        return () => {
          clearTimeout(timer);
          document.removeEventListener("keydown", handleEsc);
        };
      }
    }, [open, onClose]);

    if (!open) return null;

    const statusStyles = {
      success: "from-green-500/90 to-emerald-600/90 border-green-400/50",
      error: "from-red-500/90 to-pink-600/90 border-red-400/50",
      info: "from-blue-500/90 to-purple-600/90 border-blue-400/50",
    };

    return (
      <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2">
        <div
          className={`bg-gradient-to-r ${statusStyles[status]} backdrop-blur-sm rounded-2xl p-4 border shadow-2xl max-w-sm`}
        >
          <div className="flex items-start justify-between">
            <p className="text-white text-sm font-medium pr-2">{message}</p>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    const fetchMentorProjectData = async () => {
      if (isAuthenticated && user) {
        try {
          setLoadingData(true);
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await axios.get(
            `${apiUrl}/api/sync/mentor-project-data`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setProjectData(response.data.project);
            setMentorData(response.data.mentor);
            setError(null);
          } else {
            setError(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching mentor project data:", error);
          if (error.response?.status === 404) {
            setError("No active project with mentor found");
          } else {
            setError("Failed to load mentor project data");
          }
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchMentorProjectData();
  }, [isAuthenticated, user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProjectUpdate = () => {
    window.location.reload();
  };

  const showToast = ({ message, status = "info" }) => {
    setToast({ open: true, message, status });
  };

  const hideToast = () => {
    setToast({ open: false, message: "", status: "info" });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="user"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">My Mentor</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          {/* Page Title */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    My Mentor
                  </h1>
                  <p className="text-blue-200">
                    Manage your ongoing project and mentorship
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-300 font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          {error ? (
            <div className="bg-red-500/20 backdrop-blur-sm rounded-3xl p-6 border border-red-400/30">
              <div className="flex items-center space-x-4">
                <AlertCircle className="text-red-400" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    No Active Mentor
                  </h3>
                  <p className="text-red-200">{error}</p>
                  <button
                    onClick={() => (window.location.href = "/user/projects")}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    View Projects
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Expected End Date Section */}
                  <ExpectedEndDateViewer
                    projectData={projectData}
                    onUpdate={handleProjectUpdate}
                  />

                  {/* Project Progress Section */}
                  <ProjectProgressViewer projectData={projectData} />

                  {/* Complete/Cancel Actions */}
                  <CompleteCancelBox
                    projectData={projectData}
                    onUpdate={handleProjectUpdate}
                    showToast={showToast}
                  />
                </div>

                {/* Right Column - Mentor Card */}
                <div className="space-y-6">
                  <MentorProjectCard
                    mentorData={mentorData}
                    projectData={projectData}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <Toast
          open={toast.open}
          message={toast.message}
          status={toast.status}
          onClose={hideToast}
        />
      </div>
    </div>
  );
};

export default MyMentor;
