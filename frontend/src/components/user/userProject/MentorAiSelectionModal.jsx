import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  User,
  XCircle,
  Star,
  CheckCircle,
  Send,
  Linkedin,
  Github,
  Globe,
  Bot,
  Sparkles,
  Brain,
  Target,
  Award,
  Clock,
  MessageCircle,
  Zap,
  TrendingUp,
  Shield,
  Cpu,
  Activity,
  Eye,
} from "lucide-react";

const MentorAiSelectionModal = ({
  showAIMentorSelection,
  setShowAIMentorSelection,
  project,
  mentors,
  setSelectedMentor,
  API_URL,
  formatPrice,
  onToast,
}) => {
  const [aiMentors, setAiMentors] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState({});
  const navigate = useNavigate();

  const loadingSteps = [
    {
      text: "Analyzing your project requirements...",
      icon: <Brain className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      text: "Matching skills with available mentors...",
      icon: <Target className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      text: "AI is evaluating mentor compatibility...",
      icon: <Cpu className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
    },
    {
      text: "Preparing personalized recommendations...",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const fetchProjectRequests = async () => {
    if (!project?._id) return;

    try {
      setLoadingRequests(true);
      const response = await axios.get(
        `${API_URL}/requests/project/${project._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setRequestedMentorIds(response.data.requestedMentorIds || []);

        const statusMap = {};
        response.data.requests.forEach((request) => {
          statusMap[request.mentorId.toString()] = {
            status: request.status,
            mentorResponse: request.mentorResponse,
            createdAt: request.createdAt,
            respondedAt: request.respondedAt,
          };
        });
        setRequestStatuses(statusMap);
      }
    } catch (error) {
      console.error("Error fetching project requests:", error);
      onToast({
        message: "Failed to load request status",
        status: "error",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  const performAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setLoadingStep(0);
      setAnalysisComplete(false);

      const stepInterval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepInterval);
          return prev;
        });
      }, 1800);

      const projectMetaData = {
        id: project._id,
        name: project.name,
        category: project.category,
        techStack: project.techStack,
        difficultyLevel: project.difficultyLevel,
        shortDescription: project.shortDescription,
        duration: project.duration,
        openingPrice: project.openingPrice,
        prerequisites: project.prerequisites || [],
      };

      const mentorMetaDataList = mentors.map((mentor) => ({
        _id: mentor._id,
        name: mentor.userId?.name || "Anonymous Mentor",
        title: mentor.title,
        expertise: mentor.expertise,
        rating: mentor.rating,
        totalStudents: mentor.totalStudents,
        completedSessions: mentor.completedSessions,
        experience: mentor.experience,
        responseTime: mentor.responseTime,
        pricing: mentor.pricing,
        isOnline: mentor.isOnline,
        isAvailable: mentor.isAvailable,
        description: mentor.description,
        socialLinks: mentor.socialLinks,
        userId: mentor.userId,
      }));

      const response = await axios.post(
        `${API_URL}/api/ai/select-mentors`,
        {
          projectMetaData,
          mentorMetaDataList,
        },
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setAiMentors(response.data.mentors);
        setAnalysisComplete(true);
        onToast({
          message: "🤖 AI has found the perfect mentors for you!",
          status: "success",
        });
      } else {
        onToast({
          message: "AI analysis failed. Please try again.",
          status: "error",
        });
        setShowAIMentorSelection(false);
      }
    } catch (error) {
      console.error("Error in AI mentor selection:", error);
      onToast({
        message: "AI analysis failed. Please try manual selection.",
        status: "error",
      });
      setShowAIMentorSelection(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (showAIMentorSelection) {
      if (!analysisComplete && !isAnalyzing) {
        performAIAnalysis();
      }
      fetchProjectRequests();
    }
  }, [showAIMentorSelection]);

  const handleSeeWhy = (mentorId, whyReason, aiScore, mentorData) => {
    navigate(`/user/mentors/${mentorId}/ai-reason`, {
      state: {
        mentor: mentorData,
        whyReason: whyReason,
        aiScore: aiScore,
        project: project,
        fromAI: true,
      },
    });
  };

  const isMentorRequested = (mentorId) => {
    return requestedMentorIds.includes(mentorId.toString());
  };

  const handleRequestSent = (mentorId) => {
    setRequestedMentorIds((prev) => [...prev, mentorId.toString()]);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/40";
      case "rejected":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Request Accepted";
      case "rejected":
        return "Request Rejected";
      default:
        return "Request Pending";
    }
  };

  if (!showAIMentorSelection) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className=" bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto hide-scrollbar-general">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    AI Mentor Recommendations
                  </h2>
                  <p className="text-sm text-purple-300 mt-1">
                    Powered by advanced AI matching algorithms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIMentorSelection(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
              >
                <XCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Project Info Banner */}
            <div
              className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 
                rounded-3xl p-5 sm:p-7 lg:p-8 mb-6 
                border border-purple-400/30 backdrop-blur-md shadow-lg"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Icon */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 
                    bg-gradient-to-r from-blue-500 to-purple-500 
                    rounded-2xl flex items-center justify-center 
                    shadow-md mb-3 sm:mb-0"
                >
                  <Target className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  {/* Title */}
                  <h3
                    className="text-lg sm:text-xl font-bold text-white mb-2 
                     flex justify-center sm:justify-start items-center gap-2"
                  >
                    Analyzing Project
                    <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                  </h3>

                  {/* Project Name */}
                  <h4 className="text-purple-200 font-semibold text-sm sm:text-base lg:text-lg mb-1 truncate">
                    {project?.name}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2">
                    {project?.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                    <span
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg 
                         text-xs sm:text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition"
                    >
                      {project?.category}
                    </span>
                    <span
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg 
                         text-xs sm:text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition"
                    >
                      {project?.difficultyLevel}
                    </span>
                    {project?.techStack?.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg 
                       text-xs sm:text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Animation */}
            {isAnalyzing && (
              <div className="text-center py-8 sm:py-16">
                <div className="relative mb-8 sm:mb-12">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto relative">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                    {/* Multiple spinning rings with different colors and speeds */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                    <div
                      className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"
                      style={{
                        animationDelay: "0.15s",
                        animationDuration: "1.2s",
                      }}
                    ></div>
                    <div
                      className="absolute inset-4 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"
                      style={{
                        animationDelay: "0.3s",
                        animationDuration: "1.5s",
                      }}
                    ></div>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        {loadingSteps[loadingStep].icon}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div
                    className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${loadingSteps[loadingStep].color} rounded-2xl text-white font-semibold shadow-lg`}
                  >
                    {loadingSteps[loadingStep].icon}
                    <span className="text-sm sm:text-base">
                      {loadingSteps[loadingStep].text}
                    </span>
                  </div>

                  <div className="w-64 sm:w-80 mx-auto bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                      className={`bg-gradient-to-r ${loadingSteps[loadingStep].color} h-3 rounded-full transition-all duration-700 ease-out shadow-lg`}
                      style={{
                        width: `${
                          ((loadingStep + 1) / loadingSteps.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-gray-300 text-sm">
                    <span className="font-semibold">
                      Step {loadingStep + 1}
                    </span>{" "}
                    of {loadingSteps.length}
                  </div>
                </div>
              </div>
            )}

            {/* AI Results */}
            {analysisComplete && aiMentors.length > 0 && (
              <>
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl p-4 sm:p-6 mb-6 border border-emerald-500/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center">
                        AI Analysis Complete!
                        <TrendingUp className="w-5 h-5 text-emerald-400 ml-2" />
                      </h3>
                      <p className="text-emerald-200 text-sm">
                        Found{" "}
                        <span className="font-bold text-emerald-100">
                          {aiMentors.length}
                        </span>{" "}
                        perfectly matched mentors for your project
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentor Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {aiMentors.map((aiMentor, index) => {
                    const mentor = aiMentor.mentorData;
                    const isRequested = isMentorRequested(mentor._id);
                    const mentorStatus = requestStatuses[mentor._id];

                    return (
                      <div
                        key={mentor._id}
                        className={`bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 ${
                          isRequested
                            ? "border-emerald-500/40 bg-emerald-500/5"
                            : "border-white/20 hover:border-purple-400/60"
                        }`}
                      >
                        {/* AI Ranking Badge */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
                            <Award className="w-3 h-3" />
                            <span>AI Pick #{index + 1}</span>
                          </div>
                          {mentor.isOnline && (
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                          )}
                        </div>

                        {/* Request Status */}
                        {isRequested && mentorStatus && (
                          <div className="mb-4 space-y-3">
                            <div
                              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${getStatusBadgeStyle(
                                mentorStatus.status
                              )}`}
                            >
                              {getStatusIcon(mentorStatus.status)}
                              <span>{getStatusText(mentorStatus.status)}</span>
                            </div>

                            {mentorStatus.mentorResponse &&
                              mentorStatus.status !== "pending" && (
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                  <div className="flex items-start space-x-3">
                                    <MessageCircle className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-gray-400 mb-2 font-medium">
                                        Mentor's Response:
                                      </p>
                                      <p className="text-sm text-gray-200 leading-relaxed mb-2">
                                        {mentorStatus.mentorResponse}
                                      </p>
                                      {mentorStatus.respondedAt && (
                                        <p className="text-xs text-gray-400">
                                          Responded on{" "}
                                          {new Date(
                                            mentorStatus.respondedAt
                                          ).toLocaleDateString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Mentor Profile */}
                        <div className="flex items-start space-x-4 mb-4 mt-8">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
                              {mentor.userId?.avatar ? (
                                <img
                                  src={
                                    mentor.userId.avatar.startsWith("/uploads/")
                                      ? `${API_URL}${mentor.userId.avatar}`
                                      : mentor.userId.avatar
                                  }
                                  alt={mentor.userId.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-white" />
                              )}
                            </div>
                            {mentor.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full shadow-lg"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                              {mentor.userId?.name || "Anonymous Mentor"}
                            </h3>
                            <p className="text-blue-300 text-sm font-medium mb-3 truncate">
                              {mentor.title}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="flex items-center space-x-1.5 bg-white/5 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                                <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                                <span className="text-white font-semibold">
                                  {mentor.rating}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1.5 bg-white/5 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                                <Users className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                <span className="text-green-300 font-medium truncate">
                                  {mentor.totalStudents}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1.5 bg-white/5 rounded-lg px-2 py-1.5 backdrop-blur-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                <span className="text-blue-300 font-medium truncate">
                                  {mentor.completedSessions}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-200 text-sm leading-relaxed mb-4 line-clamp-3">
                          {mentor.description}
                        </p>

                        {/* Expertise Tags */}
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2 text-sm flex items-center">
                            <Shield className="w-4 h-4 mr-1.5" />
                            Expertise
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {mentor.expertise
                              .slice(0, 3)
                              .map((exp, expIndex) => (
                                <span
                                  key={expIndex}
                                  className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/30 backdrop-blur-sm"
                                >
                                  {exp.skill} ({exp.level})
                                </span>
                              ))}
                            {mentor.expertise.length > 3 && (
                              <span className="px-2.5 py-1 bg-white/10 text-gray-300 rounded-lg text-xs font-medium backdrop-blur-sm">
                                +{mentor.expertise.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-xs">
                                Experience
                              </span>
                              <span className="text-white font-bold text-sm">
                                {mentor.experience.years}y
                              </span>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-xs">
                                Response
                              </span>
                              <span className="text-white font-bold text-sm">
                                {mentor.responseTime}m
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 mb-4 border border-blue-500/20 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-200 text-sm font-medium">
                              Hourly Rate
                            </span>
                            <span className="text-white font-bold text-lg">
                              {formatPrice(
                                mentor.pricing.hourlyRate,
                                mentor.pricing.currency
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex space-x-2">
                            {mentor.socialLinks?.linkedin &&
                              mentor.socialLinks.linkedin !== "#" && (
                                <a
                                  href={mentor.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-blue-500/20"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                            {mentor.socialLinks?.github &&
                              mentor.socialLinks.github !== "#" && (
                                <a
                                  href={mentor.socialLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 bg-gray-600/20 text-gray-300 rounded-xl hover:bg-gray-600/30 transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-gray-500/20"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                            {mentor.socialLinks?.portfolio &&
                              mentor.socialLinks.portfolio !== "#" && (
                                <a
                                  href={mentor.socialLinks.portfolio}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all duration-200 hover:scale-110 backdrop-blur-sm border border-purple-500/20"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                          </div>

                          <div
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${
                              mentor.isOnline
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            }`}
                          >
                            {mentor.isOnline ? "Online" : "Offline"}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          {isRequested ? (
                            <div
                              className={`w-full px-4 py-3 rounded-2xl font-semibold flex items-center justify-center space-x-2 backdrop-blur-sm border ${getStatusBadgeStyle(
                                mentorStatus?.status || "pending"
                              )}`}
                            >
                              {getStatusIcon(mentorStatus?.status || "pending")}
                              <span>
                                {getStatusText(
                                  mentorStatus?.status || "pending"
                                )}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedMentor(mentor);
                                onToast({
                                  message: `Selected ${
                                    mentor.userId?.name || "mentor"
                                  } for request`,
                                  status: "info",
                                });
                              }}
                              disabled={!mentor.isAvailable}
                              className={`w-full px-4 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                                mentor.isAvailable
                                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 hover:shadow-purple-500/30"
                                  : "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/20"
                              }`}
                            >
                              <Send className="w-4 h-4" />
                              <span>
                                {mentor.isAvailable
                                  ? "Send Request"
                                  : "Not Available"}
                              </span>
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleSeeWhy(
                                mentor._id,
                                aiMentor.whyReason,
                                aiMentor.aiScore,
                                mentor
                              )
                            }
                            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-2xl font-semibold hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm hover:scale-105 group"
                          >
                            <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                            <span>See AI Analysis</span>
                            <Eye className="w-4 h-4 opacity-70" />
                          </button>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Empty State */}
            {analysisComplete && aiMentors.length === 0 && (
              <div className="text-center py-12 sm:py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-gray-500/20">
                  <Bot className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  No AI Recommendations Available
                </h3>
                <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                  Our AI couldn't find suitable mentors matching your project
                  requirements. Try manual selection to explore all available
                  mentors.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowAIMentorSelection(false)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
                  >
                    Try Manual Selection
                  </button>
                  <button
                    onClick={() => {
                      setAnalysisComplete(false);
                      performAIAnalysis();
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-2xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-semibold border border-purple-500/30 backdrop-blur-sm"
                  >
                    Retry AI Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAiSelectionModal;
