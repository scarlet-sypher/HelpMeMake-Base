import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import MentorProjectCard from "../../components/mentor/mentorMilestone/MentorProjectCard";
import {
  Target,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Menu,
} from "lucide-react";

const MentorMilestonePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("milestones");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [projects, setProjects] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isAuthenticated && user?.role === "mentor") {
      fetchMentorProjects();
    }
  }, [isAuthenticated, user]);

  const fetchMentorProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/milestone/mentor/projects`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setProjects(data.projects || []);
      } else {
        setError(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching mentor projects:", error);
      setError("Failed to fetch project data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyMilestone = async (milestoneId, verificationData = {}) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/mentor-verify`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationNotes: verificationData.notes || "Approved by mentor",
            rating: verificationData.rating || 5,
            feedback: verificationData.feedback || "",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone._id === milestoneId ? data.milestone : milestone
            ),
          }))
        );
      } else {
        setError(data.message || "Failed to verify milestone");
      }
    } catch (error) {
      console.error("Error verifying milestone:", error);
      setError("Failed to verify milestone");
    } finally {
      setSaving(false);
    }
  };

  const unverifyMilestone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/mentor-unverify`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone._id === milestoneId ? data.milestone : milestone
            ),
          }))
        );
      } else {
        setError(data.message || "Failed to unverify milestone");
      }
    } catch (error) {
      console.error("Error unverifying milestone:", error);
      setError("Failed to unverify milestone");
    } finally {
      setSaving(false);
    }
  };

  const updateMilestone = async (milestoneId, updateData) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/${milestoneId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone._id === milestoneId ? data.milestone : milestone
            ),
          }))
        );
      } else {
        setError(data.message || "Failed to update milestone");
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      setError("Failed to update milestone");
    } finally {
      setSaving(false);
    }
  };

  const addReviewNote = async (milestoneId, note) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/review`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            milestones: project.milestones.map((milestone) =>
              milestone._id === milestoneId ? data.milestone : milestone
            ),
          }))
        );
      } else {
        setError(data.message || "Failed to add review note");
      }
    } catch (error) {
      console.error("Error adding review note:", error);
      setError("Failed to add review note");
    } finally {
      setSaving(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen w-full max-w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4 w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Milestones</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6 w-full max-w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
                <Target className="mr-3 text-cyan-400" size={36} />
                Mentor Milestones
              </h1>
              <p className="text-cyan-200 mt-2">
                Review and guide your students' progress
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30 flex items-center space-x-3">
              <AlertCircle className="text-red-400" size={24} />
              <span className="text-red-200 font-medium">{error}</span>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full">
                  <BookOpen className="text-white" size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    No Active Projects Found
                  </h3>
                  <p className="text-cyan-200 max-w-md">
                    You currently don't have any active projects with milestones
                    to review. Once students create milestones for your
                    projects, they'll appear here.
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/mentor/projects")}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <GraduationCap size={20} />
                  <span>View Projects</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Projects List */}
              {projects.map((project) => (
                <MentorProjectCard
                  key={project._id}
                  project={project}
                  verifyMilestone={verifyMilestone}
                  unverifyMilestone={unverifyMilestone}
                  updateMilestone={updateMilestone}
                  addReviewNote={addReviewNote}
                  saving={saving}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMilestonePage;
