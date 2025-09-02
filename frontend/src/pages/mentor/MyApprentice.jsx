import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import axios from "axios";
import { toast } from "react-hot-toast";

import ExpectedEndDateSetter from "../../components/mentor/mentorUserPage/ExpectedEndDateSetter";
import ProjectProgressSetter from "../../components/mentor/mentorUserPage/ProjectProgressSetter";
import UserProjectCard from "../../components/mentor/mentorUserPage/UserProjectCard";
import CompleteCancelBox from "../../components/mentor/mentorUserPage/CompleteCancelBox";

import {
  Calendar,
  User,
  Target,
  Clock,
  TrendingUp,
  Star,
  Menu,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MyApprentice = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("myApprentice");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [projectData, setProjectData] = useState(null);
  const [apprenticeData, setApprenticeData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "mentor"))) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    const fetchApprenticeData = async () => {
      if (isAuthenticated) {
        try {
          setDataLoading(true);
          setError(null);

          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await axios.get(
            `${apiUrl}/api/sync/apprentice-project-data`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            setProjectData(response.data.project);
            setApprenticeData(response.data.apprentice);
          } else {
            setError(response.data.message || "Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching apprentice data:", error);
          if (error.response?.status === 404) {
            setError("No active project with apprentice found");
          } else if (error.response?.status === 401) {
            window.location.href = "/login";
          } else {
            setError(
              error.response?.data?.message || "Failed to fetch apprentice data"
            );
          }
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchApprenticeData();
  }, [isAuthenticated]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">
            Loading My Apprentice...
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

  const handleDataRefresh = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${apiUrl}/api/sync/apprentice-project-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setProjectData(response.data.project);
        setApprenticeData(response.data.apprentice);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          userRole="mentor"
        />

        <div className="flex-1 lg:ml-64">
          <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">My Apprentice</h1>
              <div className="w-6"></div>
            </div>
          </div>

          <div className="relative z-10 p-4 lg:p-6 flex items-center justify-center min-h-[80vh]">
            <div className="relative group max-w-md w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-gradient-to-r from-red-500/20 to-rose-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30 text-center">
                <div className="p-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertCircle className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  No Active Apprentice
                </h3>
                <p className="text-red-200 mb-6">{error}</p>
                <button
                  onClick={() => (window.location.href = "/mentordashboard")}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />

      <div className="flex-1 lg:ml-64">
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">My Apprentice</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    My Apprentice
                  </h1>
                  <p className="text-gray-300">
                    Manage your apprentice's learning journey
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
                  <User className="text-white" size={32} />
                </div>
              </div>
            </div>
          </div>

          {projectData && (
            <div
              className={`relative group ${
                projectData.status === "Completed"
                  ? "opacity-75"
                  : projectData.status === "Cancelled"
                  ? "opacity-60"
                  : ""
              }`}
            >
              <div
                className={`absolute -inset-0.5 rounded-2xl blur opacity-20 transition duration-500 ${
                  projectData.status === "In Progress"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : projectData.status === "Completed"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                    : "bg-gradient-to-r from-red-500 to-rose-600"
                }`}
              ></div>
              <div
                className={`relative backdrop-blur-sm rounded-2xl p-4 border ${
                  projectData.status === "In Progress"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400/30"
                    : projectData.status === "Completed"
                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-blue-400/30"
                    : "bg-gradient-to-r from-red-500/20 to-rose-600/20 border-red-400/30"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-xl ${
                      projectData.status === "In Progress"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : projectData.status === "Completed"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                        : "bg-gradient-to-r from-red-500 to-rose-600"
                    }`}
                  >
                    {projectData.status === "In Progress" ? (
                      <TrendingUp className="text-white" size={24} />
                    ) : projectData.status === "Completed" ? (
                      <CheckCircle className="text-white" size={24} />
                    ) : (
                      <XCircle className="text-white" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Project Status: {projectData.status}
                    </h3>
                    <p className="text-gray-300">
                      {projectData.status === "In Progress" &&
                        "Actively mentoring your apprentice"}
                      {projectData.status === "Completed" &&
                        "Project successfully completed"}
                      {projectData.status === "Cancelled" &&
                        "Project was cancelled"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        projectData.status === "In Progress"
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : projectData.status === "Completed"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                          : "bg-red-500/20 text-red-300 border border-red-400/30"
                      }`}
                    >
                      {projectData.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <ExpectedEndDateSetter
                projectData={projectData}
                onDataRefresh={handleDataRefresh}
              />

              <ProjectProgressSetter
                projectData={projectData}
                onDataRefresh={handleDataRefresh}
              />

              <CompleteCancelBox
                projectData={projectData}
                apprenticeData={apprenticeData}
                onDataRefresh={handleDataRefresh}
                showReviewModal={showReviewModal}
                setShowReviewModal={setShowReviewModal}
              />
            </div>

            <div className="space-y-6">
              <UserProjectCard
                projectData={projectData}
                apprenticeData={apprenticeData}
              />

              {projectData && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Target className="mr-2 text-purple-400" size={24} />
                      Project Progress
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Completion</span>
                        <span className="text-white font-bold">
                          {projectData.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${projectData.progressPercentage}%`,
                          }}
                        ></div>
                      </div>
                      {projectData.lastProgressUpdate && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock size={16} className="mr-2" />
                          Last updated:{" "}
                          {new Date(
                            projectData.lastProgressUpdate
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {projectData && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Calendar className="mr-2 text-orange-400" size={24} />
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      {projectData.startDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Started</span>
                          <span className="text-white">
                            {new Date(
                              projectData.startDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {projectData.expectedEndDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Expected End</span>
                          <span className="text-white">
                            {new Date(
                              projectData.expectedEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {projectData.tempExpectedEndDate &&
                        !projectData.isTempEndDateConfirmed && (
                          <div className="flex justify-between">
                            <span className="text-yellow-300">
                              Pending Confirmation
                            </span>
                            <span className="text-yellow-300">
                              {new Date(
                                projectData.tempExpectedEndDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      {projectData.actualEndDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Actual End</span>
                          <span className="text-white">
                            {new Date(
                              projectData.actualEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApprentice;
