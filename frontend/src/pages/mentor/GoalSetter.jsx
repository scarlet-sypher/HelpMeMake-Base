import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import GoalView from "../../components/mentor/mentorGoal/GoalView";
import GoalForm from "../../components/mentor/mentorGoal/GoalForm";
import ReviewView from "../../components/mentor/mentorGoal/ReviewView";
// Using fetch instead of axios for API calls
import { Menu, Target, Star, User, TrendingUp } from "lucide-react";

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Don't be afraid to give up the good to go for the great.",
  "Innovation distinguishes between a leader and a follower.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
];

// Custom toaster function
const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

const GoalSetter = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");
  const [activeItem, setActiveItem] = useState("goals");
  const [mentorData, setMentorData] = useState(null);
  const [goalData, setGoalData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totals, setTotals] = useState({}); // Add this state for totals
  const [dataLoading, setDataLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Redirect non-mentors
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "mentor"))) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated, user]);

  // Rotate motivational quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch mentor goal and reviews data
  useEffect(() => {
    const fetchMentorData = async () => {
      if (isAuthenticated && user?.role === "mentor") {
        try {
          setDataLoading(true);
          const apiUrl =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const token = localStorage.getItem("access_token");

          const response = await fetch(
            `${apiUrl}/api/goals/mentor/goal-reviews`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (data.success) {
            const { mentor, goal, reviews, totals } = data.data; // Extract totals from response
            setMentorData(mentor);
            setGoalData(goal);
            setReviews(reviews);
            setTotals(totals || {}); // Set totals state with fallback

            // Debug log to see if totals are received
            console.log("Received totals:", totals);
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
          if (error.response?.status === 401 || error.status === 401) {
            window.location.href = "/login";
          }
          showToast("Failed to load mentor data", "error");
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchMentorData();
  }, [isAuthenticated, user]);

  const handleGoalUpdate = async (monthlyGoal) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${apiUrl}/api/goals/mentor/goal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthlyGoal: Number(monthlyGoal) }),
      });

      const data = await response.json();

      if (data.success) {
        setGoalData(data.data);
        showToast("Goal updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      showToast("Failed to update goal", "error");
    }
  };

  // Show loading
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !mentorData) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Goal Setting</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6">
          {/* Header Section */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-gradient-to-r from-slate-800/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        mentorData.avatar?.startsWith("http")
                          ? mentorData.avatar
                          : `${import.meta.env.VITE_API_URL}${
                              mentorData.avatar
                            }`
                      }
                      alt="Mentor Avatar"
                      className="w-16 h-16 rounded-full border-2 border-cyan-400/50 object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Welcome back, {mentorData.name}!
                    </h1>
                    <p className="text-cyan-200 mt-1">
                      Total Earnings: ₹
                      {mentorData.totalEarnings?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-cyan-300">
                  <TrendingUp size={20} />
                  <span className="text-sm italic font-medium min-h-[40px] flex items-center">
                    "{motivationalQuotes[currentQuote]}"
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-teal-600/20 rounded-xl blur opacity-50"></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-white/10">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "goals"
                      ? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Target size={18} />
                  <span>Goals</span>
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "reviews"
                      ? "bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Star size={18} />
                  <span>Reviews</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "goals" && (
            <div className="space-y-6">
              <GoalView goal={goalData} />
              <GoalForm goal={goalData} onGoalUpdate={handleGoalUpdate} />
            </div>
          )}

          {activeTab === "reviews" && (
            <ReviewView
              reviews={reviews}
              totals={totals} // Pass the totals to ReviewView
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalSetter;
