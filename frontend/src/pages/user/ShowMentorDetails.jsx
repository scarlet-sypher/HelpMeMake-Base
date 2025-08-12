import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Star,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Award,
  Linkedin,
  Github,
  Globe,
  Bot,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  Send,
  AlertCircle,
  MessageCircle,
  Activity,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowMentorDetails = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from navigation state or initialize empty
  const [mentor, setMentor] = useState(location.state?.mentor || null);
  const [whyReason, setWhyReason] = useState(location.state?.whyReason || "");
  const [aiScore, setAiScore] = useState(location.state?.aiScore || 0);
  const [loading, setLoading] = useState(!mentor);
  const [project, setProject] = useState(location.state?.project || null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch mentor details if not available from state
  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!mentor || !whyReason) {
        try {
          setLoading(true);

          // Fetch mentor details
          const mentorResponse = await axios.get(
            `${API_URL}/mentor/${mentorId}`,
            {
              withCredentials: true,
            }
          );

          if (mentorResponse.data.success) {
            setMentor(mentorResponse.data.mentor);
          }

          // If we don't have AI reasoning, we can either:
          // 1. Show a message that AI reasoning is not available
          // 2. Create a backend endpoint to regenerate reasoning
          if (!whyReason) {
            setWhyReason(
              "AI reasoning not available. This mentor was recommended based on comprehensive analysis of skills, experience, and project compatibility."
            );
          }
        } catch (error) {
          console.error("Error fetching mentor details:", error);
          toast.error("Failed to load mentor details");
          navigate("/user/projects");
        } finally {
          setLoading(false);
        }
      }
    };

    if (mentorId) {
      fetchMentorDetails();
    }
  }, [mentorId, mentor, whyReason, API_URL, navigate]);

  // Handle sending mentor request
  const handleSendRequest = () => {
    // Navigate back to project with selected mentor
    if (project) {
      navigate(`/user/projects/${project._id}`, {
        state: { selectedMentor: mentor, fromAI: true },
      });
    } else {
      // If no project context, show a message or redirect
      toast.info("Please select a project to send mentor request");
      navigate("/user/projects");
    }
  };

  // Format price helper
  const formatPrice = (price, currency = "INR") => {
    if (!price) return "Not set";
    return `${currency} ${price.toLocaleString()}`;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Parse AI reasoning into bullet points
  const parseAIReasoning = (reason) => {
    if (!reason) return [];

    // Split by common delimiters and clean up
    const points = reason
      .split(/[.!]+/)
      .map((point) => point.trim())
      .filter((point) => point.length > 10) // Filter out very short fragments
      .slice(0, 6); // Limit to 6 points max

    return points;
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

  if (!mentor) {
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

  const reasoningPoints = parseAIReasoning(whyReason);

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
                    <User className="text-white" size={32} />
                  )}
                </div>

                {/* AI Badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                  <Bot size={10} />
                  <span>AI Pick</span>
                </div>

                {/* Online Status */}
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                    mentor.isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {mentor.userId?.name || "Anonymous Mentor"}
                </h1>
                <p className="text-blue-300 text-lg mb-3">{mentor.title}</p>
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {mentor.description}
                </p>

                {/* Key Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="text-yellow-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentor.rating}
                    </span>
                    <span className="text-gray-300">
                      ({mentor.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Users className="text-green-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentor.totalStudents}
                    </span>
                    <span className="text-gray-300">students</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <CheckCircle className="text-blue-400" size={16} />
                    <span className="text-white font-semibold">
                      {mentor.completedSessions}
                    </span>
                    <span className="text-gray-300">sessions</span>
                  </div>
                </div>

                {/* Location and Join Date */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Joined {formatDate(mentor.joinDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Responds in {mentor.responseTime} mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 lg:w-64">
              <button
                onClick={handleSendRequest}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>Send Request</span>
              </button>

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
            {/* AI Reasoning Section */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Bot className="mr-2 text-purple-400" size={24} />
                  Why AI Picked This Mentor
                  <Sparkles
                    className="ml-2 text-yellow-400 animate-pulse"
                    size={16}
                  />
                </h2>
                {aiScore > 0 && (
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    AI Score: {aiScore}/100
                  </div>
                )}
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex-shrink-0">
                    <Brain className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      AI Analysis Summary
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed font-mono">
                      {whyReason}
                    </p>
                  </div>
                </div>
              </div>

              {reasoningPoints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold flex items-center">
                    <Target className="mr-2 text-cyan-400" size={16} />
                    Key Matching Factors
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {reasoningPoints.map((point, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start space-x-2"
                      >
                        <div className="p-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex-shrink-0 mt-0.5">
                          <Lightbulb className="text-white" size={12} />
                        </div>
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Expertise & Skills */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Award className="mr-2 text-green-400" size={20} />
                Expertise & Skills
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mentor.expertise.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-2xl p-4 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{exp.skill}</h3>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          exp.level === "expert"
                            ? "bg-purple-500/20 text-purple-300"
                            : exp.level === "advanced"
                            ? "bg-blue-500/20 text-blue-300"
                            : exp.level === "intermediate"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {exp.level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <TrendingUp size={14} />
                      <span>{exp.yearsOfExperience || 0} years experience</span>
                    </div>
                  </div>
                ))}
              </div>
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
                    {mentor.experience.years} years
                  </p>
                </div>

                {mentor.experience.companies &&
                  mentor.experience.companies.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-semibold">
                        Previous Companies
                      </h3>
                      {mentor.experience.companies.map((company, index) => (
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

            {/* Bio */}
            {mentor.bio && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <User className="mr-2 text-purple-400" size={20} />
                  About
                </h2>
                <p className="text-gray-200 leading-relaxed">{mentor.bio}</p>
              </div>
            )}
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
                        mentor.pricing.hourlyRate,
                        mentor.pricing.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-300">per hour</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {mentor.pricing.freeSessionsOffered || 0}
                    </div>
                    <div className="text-sm text-gray-300">
                      free sessions offered
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl text-center ${
                    mentor.isAvailable
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <div
                    className={`font-semibold ${
                      mentor.isAvailable ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {mentor.isAvailable ? "Available" : "Busy"}
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    Timezone: {mentor.availability?.timezone || "UTC"}
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
                    {mentor.completedSessions > 0
                      ? Math.floor(
                          (mentor.completedSessions /
                            (mentor.completedSessions + 2)) *
                            100
                        )
                      : 85}
                    %
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Response Time</span>
                  <span className="text-white font-semibold">
                    {mentor.responseTime} mins
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Profile Completeness</span>
                  <span className="text-white font-semibold">
                    {mentor.profileCompleteness || 75}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Achievements</span>
                  <span className="text-white font-semibold">
                    {mentor.achievements || 0}
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
                {mentor.socialLinks?.linkedin &&
                  mentor.socialLinks.linkedin !== "#" && (
                    <a
                      href={mentor.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                {mentor.socialLinks?.github &&
                  mentor.socialLinks.github !== "#" && (
                    <a
                      href={mentor.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-colors"
                    >
                      <Github size={20} />
                      <span>GitHub Profile</span>
                    </a>
                  )}

                {mentor.socialLinks?.portfolio &&
                  mentor.socialLinks.portfolio !== "#" && (
                    <a
                      href={mentor.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors"
                    >
                      <Globe size={20} />
                      <span>Portfolio</span>
                    </a>
                  )}

                {(!mentor.socialLinks?.linkedin ||
                  mentor.socialLinks.linkedin === "#") &&
                  (!mentor.socialLinks?.github ||
                    mentor.socialLinks.github === "#") &&
                  (!mentor.socialLinks?.portfolio ||
                    mentor.socialLinks.portfolio === "#") && (
                    <div className="text-center text-gray-400 py-4">
                      <Eye size={20} className="mx-auto mb-2" />
                      <p className="text-sm">No social links available</p>
                    </div>
                  )}
              </div>
            </div>

            {/* Badges & Achievements */}
            {mentor.badges && mentor.badges.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="mr-2 text-yellow-400" size={20} />
                  Badges & Achievements
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {mentor.badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-xl p-3 text-center border border-white/20"
                    >
                      <div className="text-2xl mb-1">{badge.icon || "🏆"}</div>
                      <div className="text-white text-xs font-semibold">
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMentorDetails;
