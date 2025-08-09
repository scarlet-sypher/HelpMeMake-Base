import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Award,
  Calendar,
  User,
  Briefcase,
  Link,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Shield,
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import ShortProjectView from "./ShortProjectView";

const UserProfileView = () => {
  const { userId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [mentorStatus, setMentorStatus] = useState({
    hasActiveProject: false,
    isRestricted: false,
    activeProjectId: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get current user data first to determine their role
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/auth/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setCurrentUserData(data.user);

          // Only check mentor status if current user is a mentor
          if (data.user?.role === "mentor") {
            await checkMentorStatus();
          }
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    getCurrentUser();
  }, [API_URL]);

  // Check if current user is a mentor and get their status
  const checkMentorStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const mentorStatusResponse = await fetch(
        `${API_URL}/mentor/active-project-status`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statusData = await mentorStatusResponse.json();
      if (statusData.success) {
        setMentorStatus({
          hasActiveProject: statusData.hasActiveProject,
          isRestricted: statusData.hasActiveProject,
          activeProjectId: statusData.activeProjectId,
        });
      }
    } catch (error) {
      console.error("Error checking mentor status:", error);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    // Check if user data was passed via navigation state
    if (location.state?.userData && location.state?.fromProject) {
      setUser(location.state.userData);
      setLoading(false);
      return;
    }

    // Otherwise, fetch user profile data from API
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          setError(data.message || "Failed to load user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, API_URL, location.state]);

  // Fetch user projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setProjectsLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(`${API_URL}/projects/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProjects(data.projects || []);
        } else {
          console.error("Failed to load user projects:", data.message);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    if (userId) {
      fetchUserProjects();
    }
  }, [userId, API_URL]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApplyCallback = (projectId) => {
    // Refresh projects or update UI after successful application
    console.log(`Applied to project: ${projectId}`);
    // You can add additional logic here if needed
  };

  const handleMessageUser = () => {
    // Placeholder for messaging functionality
    alert("Messaging feature coming soon!");
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Twitter;
      default:
        return Link;
    }
  };

  const formatSocialUrl = (platform, url) => {
    if (!url || url === "#") return null;

    // If URL already includes domain, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Add appropriate domain based on platform
    switch (platform) {
      case "github":
        return url.startsWith("/")
          ? `https://github.com${url}`
          : `https://github.com/${url}`;
      case "linkedin":
        return url.startsWith("/")
          ? `https://linkedin.com${url}`
          : `https://linkedin.com/in/${url}`;
      case "twitter":
        return url.startsWith("/")
          ? `https://twitter.com${url}`
          : `https://twitter.com/${url}`;
      default:
        return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error ||
              "The user you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="group flex items-center space-x-2 text-white hover:text-cyan-300 transition-colors mb-4"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Previous Page</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 mb-6 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* User Avatar and Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <img
                      src={
                        user.avatar
                          ? user.avatar.startsWith("/uploads/")
                            ? `${API_URL}${user.avatar}`
                            : user.avatar
                          : `${API_URL}/uploads/public/default.jpg`
                      }
                      alt={user.name}
                      className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-cyan-500/50 mx-auto lg:mx-0"
                      onError={(e) => {
                        e.target.src = `${API_URL}/uploads/public/default.jpg`;
                      }}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {user.name || "Anonymous User"}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                    <div className="flex items-center space-x-1 text-cyan-300">
                      <Briefcase size={16} />
                      <span className="text-sm">{user.title || "Student"}</span>
                    </div>
                    {user.location && (
                      <>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center space-x-1 text-gray-300">
                          <MapPin size={16} />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {user.level || 0}
                      </div>
                      <div className="text-xs text-gray-300">Level</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                      <div className="text-lg font-bold text-purple-400 flex items-center justify-center">
                        <Star size={16} className="mr-1" />
                        {user.rating || "0.0"}
                      </div>
                      <div className="text-xs text-gray-300">Rating</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/20 text-center">
                      <div className="text-lg font-bold text-green-400">
                        {user.completedSessions || 0}
                      </div>
                      <div className="text-xs text-gray-300">Sessions</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleMessageUser}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <MessageSquare size={18} />
                      <span>Message User</span>
                    </button>

                    {user.email && (
                      <a
                        href={`mailto:${user.email}`}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        <Mail size={18} />
                        <span>Send Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details and Stats */}
              <div className="lg:col-span-2">
                {/* About Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <User className="mr-2 text-cyan-400" size={20} />
                    About
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-200 leading-relaxed">
                      {user.description ||
                        "This user hasn't added a description yet."}
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                {user.socialLinks && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                      <Link className="mr-2 text-green-400" size={20} />
                      Social Links
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(user.socialLinks).map(
                        ([platform, url]) => {
                          const SocialIcon = getSocialIcon(platform);
                          const socialUrl = formatSocialUrl(platform, url);

                          if (!socialUrl) return null;

                          return (
                            <a
                              key={platform}
                              href={socialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 text-white transition-all duration-200 transform hover:scale-105 group"
                            >
                              <SocialIcon size={16} />
                              <span className="capitalize">{platform}</span>
                              <ExternalLink
                                size={14}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* User Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                    <BookOpen
                      className="mx-auto mb-2 text-blue-400"
                      size={24}
                    />
                    <div className="text-lg font-bold text-white">
                      {user.userActiveProjects || 0}
                    </div>
                    <div className="text-sm text-gray-300">Active Projects</div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                    <Target className="mx-auto mb-2 text-green-400" size={24} />
                    <div className="text-lg font-bold text-white">
                      {user.userTotalProjects || 0}
                    </div>
                    <div className="text-sm text-gray-300">Total Projects</div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                    <Clock className="mx-auto mb-2 text-purple-400" size={24} />
                    <div className="text-lg font-bold text-white">
                      {user.userSessionsScheduled || 0}
                    </div>
                    <div className="text-sm text-gray-300">
                      Scheduled Sessions
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                    <TrendingUp
                      className="mx-auto mb-2 text-orange-400"
                      size={24}
                    />
                    <div className="text-lg font-bold text-white">
                      {user.userCompletionRate || 0}%
                    </div>
                    <div className="text-sm text-gray-300">Completion Rate</div>
                  </div>
                </div>

                {/* Join Date */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="text-indigo-400 mr-2" />
                    <span className="text-indigo-300">
                      Joined on{" "}
                      {new Date(
                        user.joinDate || user.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Projects Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Briefcase className="mr-3 text-cyan-400" size={24} />
              User's Projects
            </h2>
            <div className="flex items-center space-x-2 text-gray-300">
              <Users size={16} />
              <span className="text-sm">
                {projectsLoading ? "Loading..." : `${projects.length} projects`}
              </span>
            </div>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white flex items-center space-x-3">
                <Loader2 className="animate-spin" size={20} />
                <span>Loading projects...</span>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">
                No Projects Found
              </h3>
              <p className="text-gray-300">
                This user hasn't created any projects yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ShortProjectView
                  key={project._id}
                  project={project}
                  onApply={
                    currentUserData?.role === "mentor" &&
                    !mentorStatus.isRestricted
                      ? handleApplyCallback
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
