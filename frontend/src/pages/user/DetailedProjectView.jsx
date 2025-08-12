import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Bot,
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  Code,
  Database,
  Smartphone,
  Monitor,
  Cpu,
  Shield,
  Cloud,
  Gamepad2,
  Palette,
  Network,
  AlertCircle,
  Eye,
  BookOpen,
  ExternalLink,
  MessageSquare,
  UserCheck,
  Briefcase,
  MapPin,
  Star,
  Award,
  Send,
  HandHeart,
  Loader2,
  X,
  Plus,
  Save,
} from "lucide-react";

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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (project && project._id) {
      fetchPitches(); // Load pitches when project is loaded
    }
  }, [project?._id]);

  // Category icons mapping
  const getCategoryIcon = (category) => {
    const icons = {
      "Web Development": Monitor,
      "Mobile Development": Smartphone,
      "AI/Machine Learning": Bot,
      "Data Science": Database,
      DevOps: Cloud,
      Blockchain: Network,
      IoT: Cpu,
      "Game Development": Gamepad2,
      "Desktop Applications": Monitor,
      "API Development": Code,
      "Database Design": Database,
      "UI/UX Design": Palette,
      Cybersecurity: Shield,
      "Cloud Computing": Cloud,
      Other: Code,
    };
    return icons[category] || Code;
  };

  // Difficulty level colors
  const getDifficultyColor = (level) => {
    const colors = {
      Beginner: "from-green-500 to-emerald-500",
      Intermediate: "from-yellow-500 to-orange-500",
      Advanced: "from-red-500 to-pink-500",
    };
    return colors[level] || "from-gray-500 to-slate-500";
  };

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      Open: "from-blue-500 to-cyan-500",
      "In Progress": "from-purple-500 to-pink-500",
      Completed: "from-green-500 to-emerald-500",
      Cancelled: "from-gray-500 to-slate-500",
    };
    return colors[status] || "from-gray-500 to-slate-500";
  };

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
  const calculateNegotiatedPrice = (project) => {
    if (!project.pitches || project.pitches.length === 0) {
      return 0;
    }

    const totalPrice = project.pitches.reduce(
      (sum, pitch) => sum + pitch.price,
      0
    );
    return Math.round(totalPrice / project.pitches.length);
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

  // Format price
  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `₹${price.toLocaleString()}`;
  };

  // Handle view mentor profile
  const handleViewMentorProfile = (mentorId) => {
    navigate(`/user/mentor/${mentorId}`);
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

  const CategoryIcon = getCategoryIcon(project.category);

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
          <div className="xl:col-span-2 space-y-6">
            {/* Project Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl self-start">
                    <CategoryIcon className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
                      {project.name}
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base break-words">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                  <div
                    className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${getStatusColor(
                      project.status
                    )} text-white rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap`}
                  >
                    {project.status}
                  </div>
                  <div
                    className={`px-3 sm:px-4 py-2 bg-gradient-to-r ${getDifficultyColor(
                      project.difficultyLevel
                    )} text-white rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap`}
                  >
                    {project.difficultyLevel}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <DollarSign
                    className="mx-auto mb-2 text-green-400"
                    size={20}
                  />
                  <div className="text-base sm:text-lg font-bold text-white break-words">
                    {formatPrice(project.openingPrice, project.currency)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Opening Price
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <Clock className="mx-auto mb-2 text-blue-400" size={20} />
                  <div className="text-base sm:text-lg font-bold text-white break-words">
                    {project.duration}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Duration
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 sm:p-4 text-center border border-white/20">
                  <TrendingUp
                    className="mx-auto mb-2 text-purple-400"
                    size={20}
                  />
                  <div className="text-base sm:text-lg font-bold text-white">
                    {project.progressPercentage}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">
                    Progress
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                  <BookOpen
                    className="mr-2 text-blue-400 flex-shrink-0"
                    size={18}
                  />
                  <span>Project Description</span>
                </h3>
                <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base break-words">
                    {project.fullDescription}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                  <Code
                    className="mr-2 text-green-400 flex-shrink-0"
                    size={18}
                  />
                  <span>Tech Stack</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg text-xs sm:text-sm border border-green-500/30 break-words"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Outcome & Motivation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center">
                    <Target
                      className="mr-2 text-purple-400 flex-shrink-0"
                      size={16}
                    />
                    <span>Expected Outcome</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed break-words">
                      {project.projectOutcome}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 flex items-center">
                    <Zap
                      className="mr-2 text-yellow-400 flex-shrink-0"
                      size={16}
                    />
                    <span>Motivation</span>
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 border border-white/10">
                    <p className="text-gray-200 text-xs sm:text-sm leading-relaxed break-words">
                      {project.motivation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {project.prerequisites && project.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                    <AlertCircle
                      className="mr-2 text-orange-400 flex-shrink-0"
                      size={18}
                    />
                    <span>Prerequisites</span>
                  </h3>
                  <div className="space-y-2">
                    {project.prerequisites.map((prereq, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 text-gray-200"
                      >
                        <CheckCircle
                          className="text-orange-400 flex-shrink-0 mt-0.5"
                          size={14}
                        />
                        <span className="text-xs sm:text-sm break-words">
                          {prereq}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {project.references && project.references.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center">
                    <ExternalLink
                      className="mr-2 text-cyan-400 flex-shrink-0"
                      size={18}
                    />
                    <span>References</span>
                  </h3>
                  <div className="space-y-2">
                    {project.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="text-white font-medium text-sm sm:text-base break-words">
                            {ref.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 break-words">
                            {ref.type}
                          </div>
                        </div>
                        <ExternalLink
                          className="text-cyan-400 group-hover:text-cyan-300 flex-shrink-0"
                          size={16}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={20} />
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-green-400">
                    {formatPrice(project.openingPrice, project.currency)}
                  </div>
                  <div className="text-sm text-gray-300">Opening Price</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-yellow-400">
                    {calculateNegotiatedPrice(project) > 0
                      ? `₹${calculateNegotiatedPrice(project).toLocaleString()}`
                      : "No pitches yet"}
                  </div>
                  <div className="text-sm text-gray-300">Negotiated Price</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {project.closingPrice
                      ? formatPrice(project.closingPrice, project.currency)
                      : "Not set"}
                  </div>
                  <div className="text-sm text-gray-300">Final Price</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="mr-2 text-blue-400" size={20} />
                Project Timeline
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {formatDate(project.startDate)}
                  </div>
                  <div className="text-sm text-gray-300">Start Date</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {formatDate(project.expectedEndDate)}
                  </div>
                  <div className="text-sm text-gray-300">Expected End</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {formatDate(project.actualEndDate)}
                  </div>
                  <div className="text-sm text-gray-300">Actual End</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Assigned Mentor Section */}
            {project.mentorId && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <UserCheck className="mr-2 text-blue-400" size={20} />
                  Assigned Mentor
                </h2>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <img
                    src={
                      project.mentorId.userId?.avatar
                        ? project.mentorId.userId.avatar.startsWith("/uploads/")
                          ? `${API_URL}${project.mentorId.userId.avatar}`
                          : project.mentorId.userId.avatar
                        : `${API_URL}/uploads/public/default.jpg`
                    }
                    alt={project.mentorId.userId?.name || "Mentor"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-400/30"
                    onError={(e) => {
                      e.target.src = `${API_URL}/uploads/public/default.jpg`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {project.mentorId.userId?.name || "Unknown Mentor"}
                    </h3>
                    <p className="text-blue-300 text-sm">
                      {project.mentorId.title || "Mentor"}
                    </p>
                    {project.mentorId.location && (
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{project.mentorId.location}</span>
                      </div>
                    )}
                    {project.mentorId.userId?.email && (
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <span>{project.mentorId.userId.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">
                      {project.closingPrice
                        ? formatPrice(project.closingPrice)
                        : calculateNegotiatedPrice(project) > 0
                        ? formatPrice(calculateNegotiatedPrice(project))
                        : "No pitches yet"}
                    </div>
                    <div className="text-xs text-gray-300">Final Price</div>
                  </div>
                </div>
                {project.mentorId.description && (
                  <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-gray-200 text-sm">
                      {project.mentorId.description}
                    </p>
                  </div>
                )}
              </div>
            )}
            {/* Project Actions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <HandHeart className="mr-2 text-blue-400" size={20} />
                Project Actions
              </h3>

              <div className="space-y-3">
                {/* Set Closing Price Button */}
                <button
                  onClick={() => setShowClosingPriceModal(true)}
                  disabled={
                    !pitches || pitches.length === 0 || project.closingPrice
                  }
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    pitches && pitches.length > 0 && !project.closingPrice
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  title={
                    project.closingPrice
                      ? "Closing price already set"
                      : !pitches || pitches.length === 0
                      ? "No pitches received yet"
                      : "Set closing price for this project"
                  }
                >
                  <Plus size={18} />
                  <span>
                    {project.closingPrice ? "Price Set" : "Add Closing Price"}
                  </span>
                </button>

                {/* See Pitching Button */}
                <button
                  onClick={handleViewPitches}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <MessageSquare size={18} />
                  <span>See Pitching ({pitches.length})</span>
                  {project.hasUnreadPitch && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Set Closing Price Modal */}
        {showClosingPriceModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <DollarSign className="mr-2 text-green-400" size={20} />
                  Set Closing Price
                </h2>
                <button
                  onClick={() => setShowClosingPriceModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Closing Price (₹)
                  </label>
                  <input
                    type="number"
                    value={closingPrice}
                    onChange={(e) => setClosingPrice(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15"
                    placeholder="Enter closing price"
                    min="1"
                  />
                  {averagePitch > 0 && (
                    <p className="text-sm text-blue-300 mt-2">
                      Current average pitch: ₹{averagePitch.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClosingPriceModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetClosingPrice}
                    disabled={isSettingPrice || !closingPrice}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSettingPrice ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Setting...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Set Price</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Pitches Modal */}
        {showPitchesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <MessageSquare className="mr-2 text-blue-400" size={20} />
                  Project Pitches ({pitches.length})
                </h2>
                <button
                  onClick={() => setShowPitchesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {isLoadingPitches ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-blue-400" size={24} />
                    <span className="ml-2 text-white">Loading pitches...</span>
                  </div>
                ) : pitches.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare
                      className="mx-auto mb-4 text-gray-400"
                      size={48}
                    />
                    <p className="text-gray-300 text-lg">No pitches yet</p>
                    <p className="text-gray-400 text-sm">
                      Mentors will appear here when they show interest in your
                      project
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pitches.map((pitch) => (
                      <div
                        key={pitch._id}
                        className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                pitch.mentor?.avatar
                                  ? pitch.mentor.avatar.startsWith("/uploads/")
                                    ? `${API_URL}${pitch.mentor.avatar}`
                                    : pitch.mentor.avatar
                                  : `${API_URL}/uploads/public/default.jpg`
                              }
                              alt={pitch.mentor?.name || "Mentor"}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = `${API_URL}/uploads/public/default.jpg`;
                              }}
                            />
                            <div>
                              <h4 className="font-semibold text-white">
                                {pitch.mentor?.name || "Anonymous"}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {pitch.mentor?.title || "Mentor"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                              ₹{pitch.price?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(pitch.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {pitch.note && (
                          <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-gray-200 text-sm">
                              {pitch.note}
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              project.closingPrice
                                ? showToast(
                                    "Closing price already set — you cannot accept another price",
                                    "error"
                                  )
                                : handleSetClosingPriceFromPitch(
                                    pitch.price,
                                    pitch.mentor?._id
                                  )
                            }
                            disabled={project.closingPrice}
                            className={`flex-1 flex items-center justify-center space-x-2 ${
                              project.closingPrice
                                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            } px-3 py-2 rounded-lg font-medium transition-all text-sm`}
                          >
                            <DollarSign size={14} />
                            <span>
                              {project.closingPrice
                                ? "Price Already Set"
                                : "Accept This Price"}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleViewMentorProfile(
                                pitch.mentor?._id || pitch.mentor?.userId
                              )
                            }
                            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg font-medium transition-all text-sm"
                          >
                            <UserCheck size={14} />
                            <span>View Profile</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedProjectView;
