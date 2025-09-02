import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Users,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import ProjectOverview from "../../components/user/userProject/ProjectOverview";
import ProjectActions from "../../components/user/userProject/ProjectActions";
import AssignedMentorSection from "../../components/user/userProject/AssignedMentorSection";
import SetClosingPriceModal from "../../components/user/userProject/SetClosingPriceModal"; //toar error
import ViewPitchesModal from "../../components/user/userProject/ViewPitchesModal";

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

  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorSelection, setShowMentorSelection] = useState(false);
  const [showAIMentorSelection, setShowAIMentorSelection] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = ({ message, status = "info" }) => {
    setToast({ open: true, message, status });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const Toast = () => {
    if (!toast.open) return null;

    const statusStyles = {
      success: "bg-green-500/90 border-green-400/50 text-green-50",
      error: "bg-red-500/90 border-red-400/50 text-red-50",
      info: "bg-blue-500/90 border-blue-400/50 text-blue-50",
    };

    return (
      <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2 duration-300">
        <div
          className={`${
            statusStyles[toast.status]
          } backdrop-blur-sm border rounded-xl p-4 pr-10 shadow-2xl max-w-sm min-w-[280px] transition-all transform hover:scale-105`}
        >
          <div className="font-medium text-sm leading-relaxed pr-2">
            {toast.message}
          </div>
          <button
            onClick={hideToast}
            className="absolute top-2 right-2 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (project && project._id) {
      fetchPitches();
    }
  }, [project?._id]);

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

  const handleViewPitches = async () => {
    setShowPitchesModal(true);
    await fetchPitches();
  };

  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `${currency} ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewMentorProfile = (mentorId) => {
    navigate(`/user/mentor/${mentorId}`);
  };

  const handleAIMentorSelection = () => {
    if (mentors.length === 0) {
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

  const handleRequestSent = (mentorId) => {
    console.log(`Request sent to mentor: ${mentorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="text-white text-base sm:text-lg flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
          <Loader2 className="animate-spin text-blue-400" size={20} />
          <span className="font-medium">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <AlertCircle size={48} className="mx-auto mb-6 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 leading-tight">
              Project Not Found
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              {error ||
                "The project you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => navigate("/user/projects")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/user/projects")}
            className="group flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 mb-6 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10 hover:bg-white/10 hover:border-white/20"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="font-medium">Return to Projects</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight break-words">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Eye size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {project.viewCount} views
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Users size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {project.applicationsCount} applications
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                  <Calendar
                    size={16}
                    className="text-purple-400 flex-shrink-0"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <ProjectOverview
              project={project}
              API_URL={API_URL}
              onToast={showToast}
            />
          </div>

          <div className="space-y-6">
            <AssignedMentorSection project={project} API_URL={API_URL} />

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

        <SetClosingPriceModal
          show={showClosingPriceModal}
          closingPrice={closingPrice}
          setClosingPrice={setClosingPrice}
          averagePitch={averagePitch}
          isSettingPrice={isSettingPrice}
          onClose={() => setShowClosingPriceModal(false)}
          onSetPrice={handleSetClosingPrice}
        />

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
          onToast={showToast}
        />

        <MentorAiSelectionModal
          showAIMentorSelection={showAIMentorSelection}
          setShowAIMentorSelection={setShowAIMentorSelection}
          project={project}
          mentors={mentors}
          setSelectedMentor={setSelectedMentor}
          API_URL={API_URL}
          formatPrice={formatPrice}
          onToast={showToast}
        />

        <RequestMentorModal
          selectedMentor={selectedMentor}
          setSelectedMentor={setSelectedMentor}
          project={project}
          onRequestSent={handleRequestSent}
          API_URL={API_URL}
          formatPrice={formatPrice}
        />

        <Toast />
      </div>
    </div>
  );
};

export default DetailedProjectView;
