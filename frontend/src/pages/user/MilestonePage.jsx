import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import ProjectInfo from "../../components/user/ProjectInfo";
import MilestoneForm from "../../components/user/MilestoneForm";
import MilestoneList from "../../components/user/MilestoneList";
import AIMilestones from "../../components/user/AIMilestones";
import { Target, AlertCircle, BookOpen, Rocket, Menu } from "lucide-react";

const MilestonePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("milestones");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Project and milestone data
  const [projectData, setProjectData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectData();
    }
  }, [isAuthenticated]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user's active project with mentor
      const response = await fetch(
        `${API_URL}/api/project/active-with-mentor`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success && data.project) {
        setProjectData(data.project);
        await fetchMilestones(data.project._id);
      } else {
        setProjectData(null);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError("Failed to fetch project data: " + error.message);
      setProjectData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (projectId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/milestone/project/${projectId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMilestones(data.milestones || []);
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const addMilestone = async () => {
    if (!newMilestone.trim() || milestones.length >= 5) return;

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectData._id,
          title: newMilestone.trim(),
          description: `Milestone: ${newMilestone.trim()}`,
          dueDate:
            projectData.expectedEndDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          order: milestones.length + 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMilestones([...milestones, data.milestone]);
        setNewMilestone("");
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
      setError("Failed to add milestone");
    } finally {
      setSaving(false);
    }
  };

  const removeMilestone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/${milestoneId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setMilestones(milestones.filter((m) => m._id !== milestoneId));
      }
    } catch (error) {
      console.error("Error removing milestone:", error);
      setError("Failed to remove milestone");
    } finally {
      setSaving(false);
    }
  };

  const markMilestoneAsDone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/learner-verify`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationNotes: "Marked as done by learner",
            submissionUrl: "",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMilestones(
          milestones.map((m) => (m._id === milestoneId ? data.milestone : m))
        );
      }
    } catch (error) {
      console.error("Error marking milestone as done:", error);
      setError("Failed to mark milestone as done");
    } finally {
      setSaving(false);
    }
  };

  const undoMilestone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/learner-unverify`,
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
        setMilestones(
          milestones.map((m) => (m._id === milestoneId ? data.milestone : m))
        );
      }
    } catch (error) {
      console.error("Error undoing milestone:", error);
      setError("Failed to undo milestone");
    } finally {
      setSaving(false);
    }
  };

  // NEW: Mark review as read function
  const markReviewAsRead = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(
        `${API_URL}/api/milestone/${milestoneId}/review-read`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the milestone in state to mark review as read
        setMilestones(
          milestones.map((m) =>
            m._id === milestoneId ? { ...m, reviewReadByLearner: true } : m
          )
        );
      }
    } catch (error) {
      console.error("Error marking review as read:", error);
      setError("Failed to mark review as read");
    } finally {
      setSaving(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Count unread reviews for notification
  const unreadReviewsCount = milestones.filter(
    (m) => m.reviewNote && !m.reviewReadByLearner
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        notifications={
          unreadReviewsCount > 0 ? { milestones: unreadReviewsCount } : null
        }
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen w-full max-w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4 w-full">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors relative"
            >
              <Menu size={24} />
              {/* Notification badge */}
              {unreadReviewsCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {unreadReviewsCount}
                  </span>
                </div>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Milestones</h1>
              {unreadReviewsCount > 0 && (
                <div className="px-2 py-1 bg-orange-500 rounded-full">
                  <span className="text-white text-xs font-bold">
                    {unreadReviewsCount}
                  </span>
                </div>
              )}
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6 w-full max-w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
                  <Target className="mr-3 text-purple-400" size={36} />
                  Milestones
                </h1>
                {/* Desktop notification badge */}
                {unreadReviewsCount > 0 && (
                  <div className="hidden lg:flex px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse">
                    <span className="text-white text-sm font-bold">
                      {unreadReviewsCount} new review
                      {unreadReviewsCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-blue-200 mt-2">
                Track your progress and achieve your goals
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

          {/* New Review Alert */}
          {unreadReviewsCount > 0 && (
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-orange-400/30 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                <span className="text-orange-200 font-medium">
                  💬 You have {unreadReviewsCount} new review
                  {unreadReviewsCount > 1 ? "s" : ""} from your mentor! Check
                  your milestones below.
                </span>
              </div>
            </div>
          )}

          {!projectData ? (
            // No Project Message
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                  <BookOpen className="text-white" size={40} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    No Active Project Found
                  </h3>
                  <p className="text-orange-200 max-w-md">
                    To create milestones, you need to have an active project
                    with a mentor. Let's get you started with finding the
                    perfect project!
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/user/projects")}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Rocket size={20} />
                  <span>Explore Projects</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Project Information Component */}
              <ProjectInfo projectData={projectData} />

              {/* Milestone Creation Form Component */}
              <MilestoneForm
                milestones={milestones}
                newMilestone={newMilestone}
                setNewMilestone={setNewMilestone}
                addMilestone={addMilestone}
                saving={saving}
              />

              {/* Milestones List Component - Updated with review support */}
              <MilestoneList
                milestones={milestones}
                markMilestoneAsDone={markMilestoneAsDone}
                undoMilestone={undoMilestone}
                removeMilestone={removeMilestone}
                markReviewAsRead={markReviewAsRead}
                saving={saving}
              />

              <AIMilestones projectData={projectData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;
