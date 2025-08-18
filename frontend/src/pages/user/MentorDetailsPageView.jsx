import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Award,
  Briefcase,
  Calendar,
  DollarSign,
  Linkedin,
  Github,
  Globe,
  Twitter,
  MessageSquare,
  Send,
  AlertCircle,
  Mail,
  XCircle,
  MessageCircle,
  Activity,
  TrendingUp,
  Target,
  Eye,
  Shield,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectCard from "../../components/user/userProject/ProjectCard";

// Request Modal Component
const RequestModal = ({ mentor, project, onClose, onRequestSent, API_URL }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!message.trim() || message.trim().length < 10) {
      toast.error("Message must be at least 10 characters long");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/requests/send`,
        {
          projectId: project._id,
          mentorId: mentor._id,
          message: message.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(`Request sent to ${mentor.userId?.name} successfully!`);
        onRequestSent(mentor._id);
        onClose();
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Send Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {mentor.userId?.avatar ? (
                  <img
                    src={
                      mentor.userId.avatar.startsWith("/uploads/")
                        ? `${API_URL}${mentor.userId.avatar}`
                        : mentor.userId.avatar
                    }
                    alt={mentor.userId.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {mentor.userId?.name || "Anonymous Mentor"}
                </h3>
                <p className="text-blue-300 text-sm">{mentor.title}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              <strong>Project:</strong> {project.name}
            </p>
          </div>

          <form onSubmit={handleSendRequest}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Your Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like this mentor for your project..."
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                required
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-400">
                  Minimum 10 characters required
                </p>
                <p className="text-xs text-gray-400">{message.length}/2000</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || message.trim().length < 10}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MentorDetailsPageView = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [mentorData, setMentorData] = useState(null);
  const [mentorProjects, setMentorProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(
    location.state?.project || null
  );
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Request handling states
  const [requestStatus, setRequestStatus] = useState(null); // null, 'pending', 'accepted', 'rejected'
  const [mentorResponse, setMentorResponse] = useState("");
  const [respondedAt, setRespondedAt] = useState(null);
  const [checkingRequest, setCheckingRequest] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check if user has already sent a request to this mentor
  const checkExistingRequest = async () => {
    // If no project is selected, try to get it from user's projects
    if (!selectedProject) {
      try {
        // Fetch user's projects to get the current/active project
        const projectsResponse = await axios.get(`${API_URL}/projects`, {
          withCredentials: true,
        });

        if (
          projectsResponse.data.success &&
          projectsResponse.data.projects.length > 0
        ) {
          // Get the most recent open project
          const openProjects = projectsResponse.data.projects.filter(
            (p) => p.status === "Open"
          );
          if (openProjects.length > 0) {
            setSelectedProject(openProjects[0]);
            return; // Will trigger useEffect again with the project
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      return;
    }

    try {
      setCheckingRequest(true);
      const response = await axios.get(
        `${API_URL}/requests/project/${selectedProject._id}`,
        {
          withCredentials: true,
        }
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
          // Reset status if no request found
          setRequestStatus(null);
          setMentorResponse("");
          setRespondedAt(null);
        }
      }
    } catch (error) {
      console.error("Error checking existing request:", error);
    } finally {
      setCheckingRequest(false);
    }
  };

  useEffect(() => {
    if (mentorId) {
      fetchMentorDetails();
      fetchMentorProjects();

      // If no project is selected from navigation, try to fetch user's projects
      if (!selectedProject) {
        fetchUserProjects();
      }
    }
  }, [mentorId]);

  // Check for existing request when project is set
  useEffect(() => {
    if (selectedProject && mentorId) {
      checkExistingRequest();
    }
  }, [selectedProject?._id, mentorId]);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/mentor-details/${mentorId}`, // Keep this URL as is
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMentorData(response.data.mentor);
      } else {
        toast.error("Failed to load mentor details");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
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
        console.log("No projects found for this mentor");
        setMentorProjects([]);
      }
    } catch (error) {
      console.error("Error fetching mentor projects:", error);
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
        // Get open projects only
        const openProjects = response.data.projects.filter(
          (p) => p.status === "Open"
        );

        if (openProjects.length > 0) {
          // If no project is selected from navigation, auto-select the first open project
          if (!selectedProject) {
            setSelectedProject(openProjects[0]);
          }
        } else {
          // No open projects available
          console.log("No open projects found");
        }
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
    }
  };

  const handleSendRequest = () => {
    if (!selectedProject) {
      toast.error("No project selected. Please select a project first.");
      // Navigate back to projects page if no project
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
  useEffect(() => {
    // This will run when selectedProject changes (including from fetchUserProjects)
    if (selectedProject && mentorId && !checkingRequest) {
      checkExistingRequest();
    }
  }, [selectedProject, mentorId]);

  // Handle request sent callback
  const handleRequestSent = (mentorId) => {
    setRequestStatus("pending");
    setMentorResponse("");
    setRespondedAt(null);
    setShowRequestModal(false);
    setSelectedProject(null);
  };

  const formatPrice = (price, currency = "USD") => {
    if (!price || price === 0) return "Free";

    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return formattedPrice;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Loading mentor details...</span>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Mentor Not Found</h2>
          <p className="text-gray-300 mb-6">
            The mentor you're looking for doesn't exist or is no longer
            available.
          </p>
          <button
            onClick={() => navigate("/user/projects")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Return to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 text-white hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Section - Mentor Profile */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Mentor Info */}
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  {mentorData.userId?.avatar ? (
                    <img
                      src={
                        mentorData.userId.avatar.startsWith("/uploads/")
                          ? `${API_URL}${mentorData.userId.avatar}`
                          : mentorData.userId.avatar
                      }
                      alt={mentorData.userId.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white" size={32} />
                  )}
                </div>

                {/* Online Status */}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    mentorData.isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {mentorData.userId?.name || "Anonymous Mentor"}
                </h1>
                <p className="text-blue-300 text-lg mb-3">{mentorData.title}</p>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {mentorData.description}
                </p>

                {/* Key Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentorData.rating}
                    </span>
                    <span className="text-gray-300">
                      ({mentorData.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Users className="text-green-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentorData.totalStudents}
                    </span>
                    <span className="text-gray-300">students</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <CheckCircle className="text-blue-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentorData.completedSessions}
                    </span>
                    <span className="text-gray-300">sessions</span>
                  </div>
                </div>

                {/* Location and Join Date */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{mentorData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(mentorData.joinDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Responds in {mentorData.responseTime} mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 lg:w-64">
              {/* Request Status or Send Request Button */}
              {checkingRequest ? (
                <div className="w-full px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Checking...</span>
                </div>
              ) : requestStatus ? (
                <div className="space-y-3">
                  {/* Status Display */}
                  <div
                    className={`w-full px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 ${
                      requestStatus === "accepted"
                        ? "bg-green-500/20 border border-green-500/30 text-green-300"
                        : requestStatus === "rejected"
                        ? "bg-red-500/20 border border-red-500/30 text-red-300"
                        : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300"
                    }`}
                  >
                    {requestStatus === "accepted" && <CheckCircle size={16} />}
                    {requestStatus === "rejected" && <XCircle size={16} />}
                    {requestStatus === "pending" && <Clock size={16} />}
                    <span>
                      {requestStatus === "accepted" && "Request Accepted"}
                      {requestStatus === "rejected" && "Request Rejected"}
                      {requestStatus === "pending" && "Request Pending"}
                    </span>
                  </div>

                  {/* Mentor Response */}
                  {mentorResponse && requestStatus !== "pending" && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-start space-x-2">
                        <MessageCircle
                          size={16}
                          className="text-blue-400 mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-1">
                            Mentor's Response:
                          </p>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {mentorResponse}
                          </p>
                          {respondedAt && (
                            <p className="text-xs text-gray-400 mt-2">
                              Responded on{" "}
                              {new Date(respondedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSendRequest}
                  disabled={!mentorData.isAvailable || !selectedProject}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
                    mentorData.isAvailable && selectedProject
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-gray-500/20 text-gray-400 cursor-not-allowed transform-none"
                  }`}
                  title={
                    !selectedProject
                      ? "Please select a project first"
                      : !mentorData.isAvailable
                      ? "Mentor is not available"
                      : "Send a request to this mentor"
                  }
                >
                  <Send size={16} />
                  <span>
                    {!selectedProject
                      ? "No Project Selected"
                      : mentorData.isAvailable
                      ? "Send Request"
                      : "Not Available"}
                  </span>
                </button>
              )}

              <button
                onClick={() => {
                  /* Open contact modal or navigate to messages */
                }}
                className="w-full px-6 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
              >
                <MessageCircle size={16} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Mentor Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <User className="mr-2 text-purple-400" size={20} />
                About
              </h2>
              <p className="text-gray-200 leading-relaxed mb-4">
                {mentorData.description}
              </p>
              {mentorData.bio &&
                mentorData.bio !==
                  "Experienced professional ready to share knowledge" && (
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-2">Biography</h4>
                    <p className="text-gray-300 leading-relaxed">
                      {mentorData.bio}
                    </p>
                  </div>
                )}
            </div>

            {/* Expertise & Skills */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Award className="mr-2 text-green-400" size={20} />
                Expertise & Skills
              </h2>

              {mentorData.expertise && mentorData.expertise.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mentorData.expertise.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">
                          {skill.skill}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            skill.level === "expert"
                              ? "bg-purple-500/20 text-purple-300"
                              : skill.level === "advanced"
                              ? "bg-blue-500/20 text-blue-300"
                              : skill.level === "intermediate"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <TrendingUp size={14} />
                        <span>
                          {skill.yearsOfExperience || 0} years experience
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No expertise information provided.
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Activity className="mr-2 text-blue-400" size={20} />
                Professional Experience
              </h2>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="text-blue-400" size={16} />
                    <span className="text-white font-semibold">
                      Total Experience
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">
                    {mentorData.experience?.years || 0} years
                  </p>
                </div>

                {mentorData.experience?.companies &&
                  mentorData.experience.companies.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold">
                        Previous Companies
                      </h3>
                      {mentorData.experience.companies.map((company, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-xl p-3 border border-white/10"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className="text-white font-medium">
                                {company.position}
                              </h4>
                              <p className="text-blue-300 text-sm">
                                {company.name}
                              </p>
                            </div>
                            <div className="text-gray-300 text-sm mt-1 sm:mt-0">
                              {company.duration}
                            </div>
                          </div>
                          {company.description && (
                            <p className="text-gray-200 text-sm mt-2">
                              {company.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Pricing & Availability */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={20} />
                Pricing & Availability
              </h2>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {formatPrice(
                        mentorData.pricing?.hourlyRate,
                        mentorData.pricing?.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-300">per hour</div>
                  </div>
                </div>

                {mentorData.pricing?.freeSessionsOffered > 0 && (
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {mentorData.pricing.freeSessionsOffered}
                      </div>
                      <div className="text-sm text-gray-300">
                        free sessions offered
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl text-center ${
                    mentorData.isAvailable
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      mentorData.isAvailable ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {mentorData.isAvailable ? "Available" : "Busy"}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Timezone: {mentorData.availability?.timezone || "UTC"}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-yellow-400" size={20} />
                Performance Stats
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-white font-semibold">
                    {mentorData.completedSessions > 0
                      ? Math.floor(
                          (mentorData.completedSessions /
                            (mentorData.completedSessions + 2)) *
                            100
                        )
                      : 85}
                    %
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Response Time</span>
                  <span className="text-white font-semibold">
                    {mentorData.responseTime} mins
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Profile Completeness</span>
                  <span className="text-white font-semibold">
                    {mentorData.profileCompleteness || 75}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Achievements</span>
                  <span className="text-white font-semibold">
                    {mentorData.achievements || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Globe className="mr-2 text-cyan-400" size={20} />
                Connect
              </h2>

              <div className="space-y-3">
                {mentorData.socialLinks?.linkedin &&
                  mentorData.socialLinks.linkedin !== "#" && (
                    <a
                      href={mentorData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                {mentorData.socialLinks?.github &&
                  mentorData.socialLinks.github !== "#" && (
                    <a
                      href={mentorData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-colors"
                    >
                      <Github size={20} />
                      <span>GitHub Profile</span>
                    </a>
                  )}

                {mentorData.socialLinks?.portfolio &&
                  mentorData.socialLinks.portfolio !== "#" && (
                    <a
                      href={mentorData.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors"
                    >
                      <Globe size={20} />
                      <span>Portfolio</span>
                    </a>
                  )}

                {mentorData.socialLinks?.twitter &&
                  mentorData.socialLinks.twitter !== "#" && (
                    <a
                      href={mentorData.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-sky-600/20 text-sky-400 rounded-xl hover:bg-sky-600/30 transition-colors"
                    >
                      <Twitter size={20} />
                      <span>Twitter Profile</span>
                    </a>
                  )}

                {mentorData.socialLinks?.blog &&
                  mentorData.socialLinks.blog !== "#" && (
                    <a
                      href={mentorData.socialLinks.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-orange-600/20 text-orange-400 rounded-xl hover:bg-orange-600/30 transition-colors"
                    >
                      <MessageSquare size={20} />
                      <span>Blog</span>
                    </a>
                  )}

                {(!mentorData.socialLinks?.linkedin ||
                  mentorData.socialLinks.linkedin === "#") &&
                  (!mentorData.socialLinks?.github ||
                    mentorData.socialLinks.github === "#") &&
                  (!mentorData.socialLinks?.portfolio ||
                    mentorData.socialLinks.portfolio === "#") &&
                  (!mentorData.socialLinks?.twitter ||
                    mentorData.socialLinks.twitter === "#") &&
                  (!mentorData.socialLinks?.blog ||
                    mentorData.socialLinks.blog === "#") && (
                    <div className="text-center text-gray-400 py-4">
                      <Eye size={20} className="mx-auto mb-2" />
                      <p className="text-sm">No social links available</p>
                    </div>
                  )}
              </div>
            </div>

            {/* Badges & Achievements */}
            {mentorData.badges && mentorData.badges.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="mr-2 text-yellow-400" size={20} />
                  Badges & Achievements
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {mentorData.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl p-3 text-center border border-white/20"
                    >
                      <div className="text-2xl mb-1">{badge.icon || "🏆"}</div>
                      <div className="text-white text-xs font-semibold">
                        {badge.name}
                      </div>
                      {badge.description && (
                        <div className="text-gray-400 text-xs mt-1">
                          {badge.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">
                Verification
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Profile:</span>
                  <span
                    className={`font-medium ${
                      mentorData.verification?.isVerified
                        ? "text-green-300"
                        : "text-yellow-300"
                    }`}
                  >
                    {mentorData.verification?.isVerified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Level:</span>
                  <span className="text-white font-medium capitalize">
                    {mentorData.verification?.verificationLevel || "none"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specializations */}
        {mentorData.specializations &&
          mentorData.specializations.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Target className="mr-2 text-purple-400" size={20} />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentorData.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl border border-purple-500/30"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Projects Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Briefcase className="mr-2 text-green-400" size={24} />
            Completed Projects
            <span className="ml-3 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {mentorProjects.length}
            </span>
          </h3>

          {projectsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-white">Loading projects...</div>
            </div>
          ) : mentorProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  API_URL={API_URL}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <h4 className="text-xl font-bold text-white mb-2">
                No Projects Yet
              </h4>
              <p className="text-gray-300">
                This mentor hasn't completed any projects yet.
              </p>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        {mentorData.reviews && mentorData.reviews.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="mr-2 text-yellow-400" size={24} />
              Recent Reviews
            </h3>
            <div className="space-y-4">
              {mentorData.reviews.slice(0, 3).map((review, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {review.rating}/5
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                  {review.reviewerName && (
                    <p className="text-gray-400 text-xs mt-2">
                      - {review.reviewerName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request Modal */}
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
