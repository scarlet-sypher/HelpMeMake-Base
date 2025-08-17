import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Import the new components
import ProjectOverview from "../../components/user/userProject/ProjectOverview";
import ProjectActions from "../../components/user/userProject/ProjectActions";
import AssignedMentorSection from "../../components/user/userProject/AssignedMentorSection";
import SetClosingPriceModal from "../../components/user/userProject/SetClosingPriceModal";
import ViewPitchesModal from "../../components/user/userProject/ViewPitchesModal";

// Request system components
import RequestMentorModal from "../../components/user/userProject/RequestModal";
import MentorSelectionModal from "../../components/user/userProject/MentorSelectionModal";
import ProjectActionsButtons from "../../components/user/userProject/ProjectActionsButtons";
import MentorAiSelectionModal from "../../components/user/userProject/MentorAiSelectionModal";

const DetailedProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClosingPriceModal, setShowClosingPriceModal] = useState(false);
  const [showPitchesModal, setShowPitchesModal] = useState(false);
  const [closingPrice, setClosingPrice] = useState("");
  const [isSettingPrice, setIsSettingPrice] = useState(false);
  const [isLoadingPitches, setIsLoadingPitches] = useState(false);
  const [averagePitch, setAveragePitch] = useState(0);

  // mentor request model states
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorSelection, setShowMentorSelection] = useState(false);
  const [showAIMentorSelection, setShowAIMentorSelection] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (project && project._id) {
      fetchPitches(); // Load pitches when project is loaded
    }
  }, [project?._id]);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/projects/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProject(data.project);
          fetchAveragePitch();
        } else {
          setError("Failed to load project details");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Error loading project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, API_URL]);

  const fetchAveragePitch = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/projects/${id}/avg-pitch`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAveragePitch(data.averagePrice);
      }
    } catch (error) {
      console.error("Error fetching average pitch:", error);
    }
  };

  // Fetch pitches
  const fetchPitches = async () => {
    try {
      setIsLoadingPitches(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/projects/${id}/pitches`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPitches(data.pitches);
        console.log("Pitches loaded:", data.pitches); // Debug log
      } else {
        console.error("Failed to load pitches:", data.message);
        alert(data.message || "Failed to load pitches");
      }
    } catch (error) {
      console.error("Error fetching pitches:", error);
      alert("Failed to load pitches. Please try again.");
    } finally {
      setIsLoadingPitches(false);
    }
  };

  // Handle setting closing price manually
  const handleSetClosingPrice = async () => {
    if (!closingPrice || closingPrice <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    setIsSettingPrice(true);
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/projects/${id}/set-closing-price`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ price: parseFloat(closingPrice) }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProject((prev) => ({
          ...prev,
          closingPrice: parseFloat(closingPrice),
        }));
        setShowClosingPriceModal(false);
        setClosingPrice("");
        showToast("Closing price set successfully!", "success");
      } else {
        showToast(data.message || "Failed to set closing price", "error");
      }
    } catch (error) {
      console.error("Error setting closing price:", error);
      showToast("Failed to set closing price", "error");
    } finally {
      setIsSettingPrice(false);
    }
  };

  // Handle setting closing price from pitch
  const handleSetClosingPriceFromPitch = async (pitchPrice, mentorId) => {
    if (project.closingPrice) {
      showToast(
        "Closing price already set — you cannot accept another price",
        "error"
      );
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_URL}/projects/${id}/set-closing-price`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price: pitchPrice,
            mentorId: mentorId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProject((prev) => ({
          ...prev,
          closingPrice: pitchPrice,
        }));
        showToast("Closing price set successfully!", "success");
        setShowPitchesModal(false);
      } else {
        showToast(data.message || "Failed to set closing price", "error");
      }
    } catch (error) {
      console.error("Error setting closing price:", error);
      showToast("Failed to set closing price", "error");
    }
  };

  // Handle viewing pitches
  const handleViewPitches = async () => {
    setShowPitchesModal(true);
    await fetchPitches();
  };

  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `${currency} ${price.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle view mentor profile
  const handleViewMentorProfile = (mentorId) => {
    navigate(`/user/mentor/${mentorId}`);
  };

  const handleAIMentorSelection = () => {
    if (mentors.length === 0) {
      // Fetch mentors first if not already loaded
      fetchMentors().then(() => {
        setShowAIMentorSelection(true);
      });
    } else {
      setShowAIMentorSelection(true);
    }
  };

  const fetchMentors = async () => {
    try {
      setMentorsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_URL}/mentors/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMentors(data.mentors);
        return Promise.resolve();
      } else {
        showToast("Failed to load mentors", "error");
        return Promise.reject();
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      showToast("Error loading mentors", "error");
      return Promise.reject();
    } finally {
      setMentorsLoading(false);
    }
  };

  // Handle request sent callback - this will be called when a request is successfully sent
  const handleRequestSent = (mentorId) => {
    // You can add any additional logic here if needed
    // The modal components will handle their own state updates
    console.log(`Request sent to mentor: ${mentorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error ||
              "The project you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/user/projects")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/user/projects")}
            className="group flex items-center space-x-2 text-white hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Return to Projects</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-300 text-sm sm:text-base">
                <div className="flex items-center space-x-1">
                  <Eye size={14} className="sm:w-4 sm:h-4" />
                  <span>{project.viewCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} className="sm:w-4 sm:h-4" />
                  <span>{project.applicationsCount} applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span className="whitespace-nowrap">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <ProjectOverview project={project} API_URL={API_URL} />

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Assigned Mentor Section */}
            <AssignedMentorSection project={project} API_URL={API_URL} />

            {/* Project Actions */}
            <ProjectActions
              project={project}
              pitches={pitches}
              onSetClosingPrice={() => setShowClosingPriceModal(true)}
              onViewPitches={handleViewPitches}
            />

            <ProjectActionsButtons
              project={project}
              setProject={setProject}
              setShowMentorSelection={setShowMentorSelection}
              handleAIMentorSelection={handleAIMentorSelection}
              API_URL={API_URL}
              formatPrice={formatPrice}
              formatDate={formatDate}
            />
          </div>
        </div>

        {/* Set Closing Price Modal */}
        <SetClosingPriceModal
          show={showClosingPriceModal}
          closingPrice={closingPrice}
          setClosingPrice={setClosingPrice}
          averagePitch={averagePitch}
          isSettingPrice={isSettingPrice}
          onClose={() => setShowClosingPriceModal(false)}
          onSetPrice={handleSetClosingPrice}
        />

        {/* View Pitches Modal */}
        <ViewPitchesModal
          show={showPitchesModal}
          pitches={pitches}
          isLoadingPitches={isLoadingPitches}
          project={project}
          API_URL={API_URL}
          onClose={() => setShowPitchesModal(false)}
          onSetClosingPriceFromPitch={handleSetClosingPriceFromPitch}
          onViewMentorProfile={handleViewMentorProfile}
          showToast={showToast}
        />

        {/* Mentor Selection Modal */}
        <MentorSelectionModal
          showMentorSelection={showMentorSelection}
          setShowMentorSelection={setShowMentorSelection}
          mentors={mentors}
          setMentors={setMentors}
          mentorsLoading={mentorsLoading}
          setMentorsLoading={setMentorsLoading}
          setSelectedMentor={setSelectedMentor}
          project={project}
          API_URL={API_URL}
          formatPrice={formatPrice}
        />

        {/* Mentor Selection Modal By AI */}
        <MentorAiSelectionModal
          showAIMentorSelection={showAIMentorSelection}
          setShowAIMentorSelection={setShowAIMentorSelection}
          project={project}
          mentors={mentors}
          setSelectedMentor={setSelectedMentor}
          API_URL={API_URL}
          formatPrice={formatPrice}
        />

        {/* Mentor Request Modal */}
        <RequestMentorModal
          selectedMentor={selectedMentor}
          setSelectedMentor={setSelectedMentor}
          project={project}
          onRequestSent={handleRequestSent}
          API_URL={API_URL}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default DetailedProjectView;
