import React, { useState, useEffect } from "react";
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
  AlertCircle,
  Clock,
  MessageSquare,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  Search,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentorSelectionModal = ({
  showMentorSelection,
  setShowMentorSelection,
  mentors,
  setMentors,
  mentorsLoading,
  setMentorsLoading,
  setSelectedMentor,
  project,
  API_URL,
  formatPrice,
  onToast,
}) => {
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const filteredAndSortedMentors = React.useMemo(() => {
    let filtered = mentors.filter((mentor) => {
      const matchesSearch =
        mentor.userId?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        mentor.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise?.some((exp) =>
          exp.skill?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "online" && mentor.isOnline) ||
        (filterBy === "available" && mentor.isAvailable) ||
        (filterBy === "experienced" && mentor.experience?.years >= 5);

      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "experience":
          return (b.experience?.years || 0) - (a.experience?.years || 0);
        case "price":
          return (a.pricing?.hourlyRate || 0) - (b.pricing?.hourlyRate || 0);
        case "students":
          return (b.totalStudents || 0) - (a.totalStudents || 0);
        default:
          return 0;
      }
    });
  }, [mentors, searchQuery, sortBy, filterBy]);

  const fetchMentors = async () => {
    try {
      setMentorsLoading(true);
      const response = await axios.get(`${API_URL}/mentors/all`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMentors(response.data.mentors);
        onToast({ message: "Mentors loaded successfully!", status: "success" });
      } else {
        onToast({ message: "Failed to load mentors", status: "error" });
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      onToast({ message: "Error loading mentors", status: "error" });
    } finally {
      setMentorsLoading(false);
    }
  };

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
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (showMentorSelection) {
      if (mentors.length === 0) {
        fetchMentors();
      }
      fetchProjectRequests();
    }
  }, [showMentorSelection, project?._id]);

  const handleRequestSent = (mentorId) => {
    setRequestedMentorIds((prev) => [...prev, mentorId.toString()]);
    setShowMentorSelection(false);
  };

  const handleViewMentorDetails = (mentorId) => {
    navigate(`/user/mentor-details/${mentorId}`, {
      state: { project: project },
    });
  };

  const isMentorRequested = (mentorId) => {
    return requestedMentorIds.includes(mentorId.toString());
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/40";
      case "rejected":
        return "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/40";
    }
  };

  if (!showMentorSelection) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-gradient-to-r from-slate-900/80 to-blue-900/80
 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/10 max-w-7xl w-full max-h-[95vh] overflow-y-auto hide-scrollbar-general"
      >
        <div className="border-b border-white/10">
          <div className="relative p-4 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  <Users className="text-purple-300" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    Select Your Perfect Mentor
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 mt-1 leading-relaxed">
                    Find the ideal mentor for your project journey
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMentorSelection(false)}
                className="self-end sm:self-center group p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <XCircle
                  size={26}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-4 sm:mx-6 mt-4 sm:mt-6">
          <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-5 sm:p-6 border border-blue-500/30 relative overflow-hidden shadow-xl shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
            <div className="relative">
              <div className="flex items-start space-x-4 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/40 flex-shrink-0">
                  <Sparkles className="text-blue-300" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2 leading-tight">
                    Requesting mentors for:
                  </h3>
                  <p className="text-blue-100 font-bold text-lg sm:text-xl mb-1 leading-tight">
                    {project?.name}
                  </p>
                </div>
              </div>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed line-clamp-2 pl-12">
                {project?.shortDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-5 border-b border-white/5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search mentors by name, title, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-sm sm:text-base"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-3 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 active:scale-95 min-w-fit"
            >
              <Filter size={20} />
              <span className="text-sm sm:text-base font-medium">Filters</span>
              <ChevronDown
                className={`transform transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
                size={18}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                >
                  <option value="rating" className="bg-slate-950 text-white">
                    ⭐ Rating
                  </option>
                  <option
                    value="experience"
                    className="bg-slate-950 text-white"
                  >
                    🏆 Experience
                  </option>
                  <option value="price" className="bg-slate-950 text-white">
                    💰 Price (Low to High)
                  </option>
                  <option value="students" className="bg-slate-950 text-white">
                    👥 Students
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Filter By
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-950 text-white">
                    All Mentors
                  </option>
                  <option value="online" className="bg-slate-950 text-white">
                    🟢 Online Now
                  </option>
                  <option value="available" className="bg-slate-950 text-white">
                    ✅ Available
                  </option>
                  <option
                    value="experienced"
                    className="bg-slate-950 text-white"
                  >
                    🎯 5+ Years Exp
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end">
                <div className="w-full text-center text-sm text-gray-300 bg-white/10 rounded-xl px-4 py-3 border border-white/20">
                  <span className="font-semibold text-white">
                    {filteredAndSortedMentors.length}
                  </span>
                  <span className="text-gray-400"> of </span>
                  <span className="font-semibold text-white">
                    {mentors.length}
                  </span>
                  <span className="text-gray-400"> mentors found</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 pb-8">
          {mentorsLoading || loadingRequests ? (
            <div className="text-center py-16">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-b-purple-500 border-t-transparent mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-t-blue-500 border-b-transparent mx-auto animate-ping"></div>
              </div>
              <div className="text-white font-semibold text-lg mb-2">
                Loading mentors...
              </div>
              <div className="text-gray-400 text-base leading-relaxed">
                Finding the best matches for your project
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
              {filteredAndSortedMentors.map((mentor) => {
                const isRequested = isMentorRequested(mentor._id);
                const requestStatus = requestStatuses[mentor._id];

                return (
                  <div
                    key={mentor._id}
                    className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 ${
                      isRequested
                        ? "border-green-500/40 bg-gradient-to-br from-green-500/10 to-emerald-500/5 shadow-green-500/10"
                        : "border-white/20 hover:border-white/40 hover:bg-white/15"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                    {isRequested && requestStatus && (
                      <div className="mb-6 space-y-4">
                        <div
                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm border backdrop-blur-sm font-medium ${getStatusBadgeStyle(
                            requestStatus.status
                          )}`}
                        >
                          {requestStatus.status === "accepted" && (
                            <CheckCircle size={16} />
                          )}
                          {requestStatus.status === "rejected" && (
                            <XCircle size={16} />
                          )}
                          {requestStatus.status === "pending" && (
                            <Clock size={16} />
                          )}
                          <span>
                            {requestStatus.status === "accepted" &&
                              "Request Accepted"}
                            {requestStatus.status === "rejected" &&
                              "Request Rejected"}
                            {requestStatus.status === "pending" &&
                              "Request Pending"}
                          </span>
                        </div>

                        {requestStatus.mentorResponse &&
                          requestStatus.status !== "pending" && (
                            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                              <div className="flex items-start space-x-3">
                                <MessageSquare
                                  size={18}
                                  className="text-blue-400 mt-1 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                                    Mentor's Response:
                                  </p>
                                  <p className="text-sm text-gray-200 leading-relaxed line-clamp-3">
                                    {requestStatus.mentorResponse}
                                  </p>
                                  {requestStatus.respondedAt && (
                                    <p className="text-xs text-gray-200 mt-3 flex items-center space-x-2">
                                      <Calendar size={12} />
                                      <span>
                                        {new Date(
                                          requestStatus.respondedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    <div className="flex items-start space-x-5 mb-5">
                      <div className="relative flex-shrink-0">
                        <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                          {mentor.userId?.avatar ? (
                            <img
                              src={
                                mentor.userId.avatar.startsWith("/uploads/")
                                  ? `${API_URL}${mentor.userId.avatar}`
                                  : mentor.userId.avatar
                              }
                              alt={mentor.userId.name}
                              className="w-full h-full rounded-2xl object-cover"
                            />
                          ) : (
                            <User className="text-white" size={28} />
                          )}
                        </div>
                        {mentor.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white/20 flex items-center justify-center animate-pulse">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-1">
                          {mentor.userId?.name || "Anonymous Mentor"}
                        </h3>
                        <p className="text-blue-300 text-sm sm:text-base font-medium leading-tight mb-3">
                          {mentor.title}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center space-x-1.5">
                            <Star
                              className="text-yellow-400 fill-yellow-400"
                              size={16}
                            />
                            <span className="font-semibold">
                              {mentor.rating}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Users className="text-green-400" size={16} />
                            <span className="font-medium">
                              {mentor.totalStudents}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Shield className="text-blue-400" size={16} />
                            <span className="font-medium">
                              {mentor.completedSessions}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-5 line-clamp-2">
                      {mentor.description}
                    </p>

                    <div className="mb-5">
                      <div className="flex items-center space-x-2 mb-3">
                        <Award className="text-purple-400" size={16} />
                        <h4 className="text-white font-semibold text-sm">
                          Expertise
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.slice(0, 3).map((exp, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full text-xs border border-green-500/30 font-medium"
                          >
                            {exp.skill}
                          </span>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <span className="px-3 py-1.5 bg-white/20 text-gray-300 rounded-full text-xs font-medium border border-white/30">
                            +{mentor.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-purple-400 mb-2">
                          <TrendingUp size={16} />
                        </div>
                        <div className="text-white font-bold text-base mb-1">
                          {mentor.experience?.years}y
                        </div>
                        <div className="text-gray-400 text-xs font-medium">
                          Experience
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-blue-400 mb-2">
                          <Zap size={16} />
                        </div>
                        <div className="text-white font-bold text-base mb-1">
                          {mentor.responseTime}m
                        </div>
                        <div className="text-gray-400 text-xs font-medium">
                          Response
                        </div>
                      </div>
                    </div>

                    <div className="mb-5 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="text-green-400" size={18} />
                          <span className="text-gray-300 text-sm font-medium">
                            Hourly Rate
                          </span>
                        </div>
                        <span className="text-white font-bold text-lg">
                          {formatPrice(
                            mentor.pricing?.hourlyRate,
                            mentor.pricing?.currency
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-2">
                        {mentor.socialLinks?.linkedin &&
                          mentor.socialLinks.linkedin !== "#" && (
                            <a
                              href={mentor.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <Linkedin size={18} />
                            </a>
                          )}
                        {mentor.socialLinks?.github &&
                          mentor.socialLinks.github !== "#" && (
                            <a
                              href={mentor.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-gray-600/20 text-gray-400 rounded-xl hover:bg-gray-600/30 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <Github size={18} />
                            </a>
                          )}
                        {mentor.socialLinks?.portfolio &&
                          mentor.socialLinks.portfolio !== "#" && (
                            <a
                              href={mentor.socialLinks.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <Globe size={18} />
                            </a>
                          )}
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          mentor.isOnline
                            ? "bg-green-500/20 text-green-300 border-green-500/30 animate-pulse"
                            : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }`}
                      >
                        {mentor.isOnline ? "🟢 Online" : "⚫ Offline"}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {isRequested ? (
                        <>
                          <div
                            className={`w-full px-4 py-3.5 rounded-xl font-medium flex items-center justify-center space-x-2 border backdrop-blur-sm ${getStatusBadgeStyle(
                              requestStatus?.status || "pending"
                            )}`}
                          >
                            {requestStatus?.status === "accepted" && (
                              <CheckCircle size={18} />
                            )}
                            {requestStatus?.status === "rejected" && (
                              <XCircle size={18} />
                            )}
                            {(!requestStatus ||
                              requestStatus?.status === "pending") && (
                              <Clock size={18} />
                            )}
                            <span>
                              {requestStatus?.status === "accepted" &&
                                "Request Accepted"}
                              {requestStatus?.status === "rejected" &&
                                "Request Rejected"}
                              {(!requestStatus ||
                                requestStatus?.status === "pending") &&
                                "Request Pending"}
                            </span>
                          </div>
                          <button
                            onClick={() => handleViewMentorDetails(mentor._id)}
                            className="w-full px-4 py-3.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/30 text-white rounded-xl hover:from-white/20 hover:to-white/10 hover:border-white/40 transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 active:scale-95"
                          >
                            <Eye size={16} />
                            <span>View Full Profile</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedMentor(mentor)}
                            disabled={!mentor.isAvailable}
                            className={`w-full px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                              mentor.isAvailable
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
                                : "bg-gray-500/20 text-gray-400 cursor-not-allowed border border-gray-500/30"
                            }`}
                          >
                            <Send size={18} />
                            <span>
                              {mentor.isAvailable
                                ? "Send Request"
                                : "Not Available"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleViewMentorDetails(mentor._id)}
                            className="w-full px-4 py-3.5 bg-gradient-to-r from-white/10 to-white/5 border border-white/30 text-white rounded-xl hover:from-white/20 hover:to-white/10 hover:border-white/40 transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-2 active:scale-95"
                          >
                            <Eye size={16} />
                            <span>View Full Profile</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!mentorsLoading &&
            !loadingRequests &&
            filteredAndSortedMentors.length === 0 && (
              <div className="text-center py-16">
                <div className="relative mb-8">
                  <div className="w-28 h-28 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full mx-auto flex items-center justify-center border border-purple-500/30 shadow-xl shadow-purple-500/10">
                    <AlertCircle className="text-purple-400" size={40} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {mentors.length === 0
                    ? "No Mentors Available"
                    : "No Results Found"}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg mx-auto">
                  {mentors.length === 0
                    ? "There are currently no mentors available. Please check back later or try refreshing the page."
                    : "We couldn't find any mentors matching your criteria. Try adjusting your search terms or filter settings."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {mentors.length > 0 &&
                    filteredAndSortedMentors.length === 0 && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilterBy("all");
                          setSortBy("rating");
                        }}
                        className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-semibold active:scale-95 shadow-lg shadow-purple-500/25"
                      >
                        Clear All Filters
                      </button>
                    )}
                  <button
                    onClick={() => setShowMentorSelection(false)}
                    className="px-8 py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-semibold active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MentorSelectionModal;
