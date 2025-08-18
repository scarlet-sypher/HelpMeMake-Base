import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, AlertCircle, Sparkles, Star } from "lucide-react";

// Import components
import RequestModal from "../../components/user/userMentorView/RequestModal";
import MentorHeroSection from "../../components/user/userMentorView/MentorHeroSection";
import MentorAboutSection from "../../components/user/userMentorView/MentorAboutSection";
import MentorExpertiseSection from "../../components/user/userMentorView/MentorExpertiseSection";
import MentorExperienceSection from "../../components/user/userMentorView/MentorExperienceSection";
import MentorPricingSection from "../../components/user/userMentorView/MentorPricingSection";
import MentorStatsSection from "../../components/user/userMentorView/MentorStatsSection";
import MentorSocialLinks from "../../components/user/userMentorView/MentorSocialLinks";
import MentorBadgesSection from "../../components/user/userMentorView/MentorBadgesSection";
import MentorSpecializationsSection from "../../components/user/userMentorView/MentorSpecializationsSection";
import MentorProjectsSection from "../../components/user/userMentorView/MentorProjectsSection";

const MentorDetailsPageView = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mentorData, setMentorData] = useState(null);
  const [mentorProjects, setMentorProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  const [selectedProject, setSelectedProject] = useState(
    location.state?.project || null
  );
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Request handling states
  const [requestStatus, setRequestStatus] = useState(null);
  const [mentorResponse, setMentorResponse] = useState("");
  const [respondedAt, setRespondedAt] = useState(null);
  const [checkingRequest, setCheckingRequest] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Custom toast function
  const toast = {
    show: (message, type = "info") => {
      const colors = {
        error: "bg-red-500",
        info: "bg-blue-500",
        success: "bg-green-500",
      };

      // Create wrapper container for stacking
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
        document.body.appendChild(container);
      }

      // Create toast element
      const toastEl = document.createElement("div");
      toastEl.className = `
      ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg 
      transform translate-x-[120%] transition-transform duration-300
      max-w-xs w-full
    `;
      toastEl.textContent = message;
      container.appendChild(toastEl);

      // Animate in
      setTimeout(() => {
        toastEl.style.transform = "translateX(0)";
      }, 10);

      // Animate out and remove
      setTimeout(() => {
        toastEl.style.transform = "translateX(120%)";
        setTimeout(() => {
          if (toastEl.parentNode) {
            container.removeChild(toastEl);
          }
        }, 300);
      }, 3000);
    },

    error: (message) => toast.show(message, "error"),
    info: (message) => toast.show(message, "info"),
    success: (message) => toast.show(message, "success"),
  };

  /** ---------- DATA FETCHING ---------- **/
  const checkExistingRequest = async () => {
    if (!selectedProject) {
      try {
        const projectsResponse = await axios.get(`${API_URL}/projects`, {
          withCredentials: true,
        });

        if (projectsResponse.data.success) {
          const openProjects = projectsResponse.data.projects.filter(
            (p) => p.status === "Open"
          );
          if (openProjects.length > 0) {
            setSelectedProject(openProjects[0]);
          }
        }
      } catch (error) {}
      return;
    }

    try {
      setCheckingRequest(true);
      const response = await axios.get(
        `${API_URL}/requests/project/${selectedProject._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const existingRequest = response.data.requests.find(
          (req) => req.mentorId.toString() === mentorId.toString()
        );

        if (existingRequest) {
          setRequestStatus(existingRequest.status);
          setMentorResponse(existingRequest.mentorResponse || "");
          setRespondedAt(existingRequest.respondedAt);
        } else {
          setRequestStatus(null);
          setMentorResponse("");
          setRespondedAt(null);
        }
      }
    } catch (error) {
    } finally {
      setCheckingRequest(false);
    }
  };

  useEffect(() => {
    if (mentorId) {
      fetchMentorDetails();
      fetchMentorProjects();

      if (!selectedProject) {
        fetchUserProjects();
      }
    }
  }, [mentorId]);

  useEffect(() => {
    if (selectedProject && mentorId) {
      checkExistingRequest();
    }
  }, [selectedProject?._id, mentorId]);

  useEffect(() => {
    // Trigger page load animation
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/mentor-details/${mentorId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMentorData(response.data.mentor);
      } else {
        toast.error("Failed to load mentor details");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Error loading mentor details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await axios.get(
        `${API_URL}/api/mentor-details/${mentorId}/projects`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMentorProjects(response.data.projects);
      } else {
        setMentorProjects([]);
      }
    } catch (error) {
      setMentorProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.projects.length > 0) {
        const openProjects = response.data.projects.filter(
          (p) => p.status === "Open"
        );
        if (openProjects.length > 0 && !selectedProject) {
          setSelectedProject(openProjects[0]);
        }
      }
    } catch (error) {}
  };

  /** ---------- REQUEST HANDLING ---------- **/
  const handleSendRequest = () => {
    if (!selectedProject) {
      toast.error("No project selected. Please select a project first.");
      navigate("/user/projects");
      return;
    }

    if (requestStatus) {
      toast.info(
        "You have already sent a request to this mentor for this project."
      );
      return;
    }

    if (!mentorData.isAvailable) {
      toast.error("This mentor is currently not available.");
      return;
    }

    setShowRequestModal(true);
  };

  const handleRequestSent = () => {
    setRequestStatus("pending");
    setMentorResponse("");
    setRespondedAt(null);
    setShowRequestModal(false);
    setSelectedProject(null);
  };

  /** ---------- LOADING STATES ---------- **/
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 relative overflow-hidden">
        {/* Enhanced background animation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-white text-lg flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 border-r-purple-400"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400/20"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Loading mentor details...
              </span>
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse delay-300" />
            </div>
            <p className="text-gray-400 text-sm animate-pulse">
              Preparing your mentorship experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-md">
          <div className="mb-6 relative">
            <AlertCircle
              size={64}
              className="mx-auto text-red-400 animate-pulse"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-red-400/20 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Mentor Not Found
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            The mentor you're looking for doesn't exist or is no longer
            available. Let's get you back on track.
          </p>
          <button
            onClick={() => navigate("/user/projects")}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Return to Projects</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  /** ---------- MAIN VIEW ---------- **/
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Enhanced background animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-1200"></div>
        <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping delay-300"></div>

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform origin-left scale-x-0 transition-transform duration-300 z-50"></div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-700 ${
          pageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center space-x-3 text-white hover:text-blue-300 transition-all duration-300 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
            >
              <div className="relative">
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>
              <span className="text-sm sm:text-base font-medium">
                Back to Discovery
              </span>
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-gray-400 text-sm">
              <span>Mentors</span>
              <span>/</span>
              <span className="text-white font-medium">Profile Details</span>
            </div>
          </div>
        </div>

        {/* Hero Section with enhanced container */}
        <div className="transform transition-all duration-700 delay-100">
          <MentorHeroSection
            mentorData={mentorData}
            selectedProject={selectedProject}
            requestStatus={requestStatus}
            mentorResponse={mentorResponse}
            respondedAt={respondedAt}
            checkingRequest={checkingRequest}
            onSendRequest={handleSendRequest}
            API_URL={API_URL}
          />
        </div>

        {/* Enhanced Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column with staggered animation */}
          <div className="lg:col-span-2 space-y-8">
            <div className="transform transition-all duration-700 delay-200">
              <MentorAboutSection mentorData={mentorData} />
            </div>
            <div className="transform transition-all duration-700 delay-300">
              <MentorExpertiseSection mentorData={mentorData} />
            </div>
            <div className="transform transition-all duration-700 delay-400">
              <MentorExperienceSection mentorData={mentorData} />
            </div>
          </div>

          {/* Right Column with staggered animation */}
          <div className="space-y-8">
            <div className="transform transition-all duration-700 delay-500">
              <MentorPricingSection mentorData={mentorData} />
            </div>
            <div className="transform transition-all duration-700 delay-600">
              <MentorStatsSection mentorData={mentorData} />
            </div>
            <div className="transform transition-all duration-700 delay-700">
              <MentorSocialLinks mentorData={mentorData} />
            </div>
            <div className="transform transition-all duration-700 delay-800">
              <MentorBadgesSection mentorData={mentorData} />
            </div>
          </div>
        </div>

        {/* Enhanced Specializations Section */}
        <div className="mt-12 transform transition-all duration-700 delay-900">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Specializations</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
            </div>
          </div>
          <MentorSpecializationsSection mentorData={mentorData} />
        </div>

        {/* Enhanced Projects Section */}
        <div className="mt-12 transform transition-all duration-700 delay-1000">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Featured Projects
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
            </div>
          </div>
          <MentorProjectsSection
            mentorProjects={mentorProjects}
            projectsLoading={projectsLoading}
            API_URL={API_URL}
          />
        </div>

        {/* Bottom spacer for better scrolling */}
        <div className="h-20"></div>
      </div>

      {/* Enhanced Request Modal */}
      {showRequestModal && selectedProject && (
        <RequestModal
          mentor={mentorData}
          project={selectedProject}
          onClose={() => setShowRequestModal(false)}
          onRequestSent={handleRequestSent}
          API_URL={API_URL}
        />
      )}
    </div>
  );
};

export default MentorDetailsPageView;
