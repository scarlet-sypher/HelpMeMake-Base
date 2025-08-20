import React, { useState, useEffect } from "react";
import {
  UserCheck,
  User,
  Target,
  CheckCircle,
  Clock,
  Star,
  Crown,
  Anchor,
  Zap,
  Award,
} from "lucide-react";
import axios from "axios";

const ProgressTracker = ({ userImg }) => {
  const [projectData, setProjectData] = useState(null);
  const [learnerData, setLearnerData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch mentor's active project progress data
  const fetchMentorProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/milestone/mentor/active-project-progress-with-avatars`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API statistics:", response.data.statistics);

      if (response.data.success) {
        setProjectData(response.data.project);
        setLearnerData(response.data.learner);
        setMilestones(response.data.milestones);
        setStatistics({
          total: response.data.statistics?.total ?? 0,
          completed: response.data.statistics?.completed ?? 0,
          inProgress: response.data.statistics?.inProgress ?? 0,
          pending: response.data.statistics?.pending ?? 0,
          progressPercentage: response.data.statistics?.progressPercentage ?? 0,
        });
      } else {
        setError(response.data.message || "Failed to fetch progress data");
      }
    } catch (error) {
      console.error("Error fetching mentor progress:", error);
      setError("Failed to fetch mentor progress data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorProgress();
  }, []);

  // Fallback data structure for when no active project exists
  const getDisplayData = () => {
    if (!projectData || !learnerData) {
      return {
        studentData: {
          name: "No Active Student",
          project: "No Active Project",
          progress: 0,
          image: "/default-avatar.jpg",
        },
        milestones: Array(5)
          .fill(null)
          .map((_, index) => ({
            id: `placeholder-${index}`,
            title: "Not Set",
            userVerified: false,
            mentorVerified: false,
            isPlaceholder: true,
          })),
      };
    }

    // Fill up to 5 milestones with placeholders if needed
    const displayMilestones = [...milestones];
    while (displayMilestones.length < 5) {
      displayMilestones.push({
        id: `placeholder-${displayMilestones.length}`,
        title: "Not Set",
        userVerified: false,
        mentorVerified: false,
        isPlaceholder: true,
      });
    }

    const avatar = learnerData.avatar;
    // 👇 Console the avatar here
    console.log("Student Avatar:", avatar);

    return {
      studentData: {
        name: learnerData.name,
        project: projectData.name,
        progress: statistics.progressPercentage,
        image: avatar,
      },
      milestones: displayMilestones.slice(0, 5),
    };
  };

  const { studentData, milestones: displayMilestones } = getDisplayData();

  const SingleMilestone = ({
    title,
    userVerified,
    mentorVerified,
    index,
    isLast,
    isPlaceholder,
  }) => {
    const isCompleted = userVerified && mentorVerified;
    const isPartiallyCompleted = userVerified || mentorVerified;

    const getStatusColor = () => {
      if (isPlaceholder) return "from-gray-500 to-gray-600";
      if (isCompleted) return "from-emerald-400 to-teal-500";
      if (isPartiallyCompleted) return "from-yellow-400 to-orange-500";
      return "from-slate-400 to-gray-500";
    };

    const getGlowColor = () => {
      if (isPlaceholder) return "shadow-gray-400/20";
      if (isCompleted) return "shadow-emerald-400/50";
      if (isPartiallyCompleted) return "shadow-yellow-400/50";
      return "shadow-slate-400/30";
    };

    const getStatusIcon = () => {
      if (isPlaceholder)
        return <div className="w-3 h-3 bg-white/40 rounded-full" />;
      if (isCompleted)
        return <CheckCircle size={16} className="text-white drop-shadow-lg" />;
      if (isPartiallyCompleted)
        return <Clock size={16} className="text-white drop-shadow-lg" />;
      return <div className="w-3 h-3 bg-white/80 rounded-full" />;
    };

    const getPulseAnimation = () => {
      if (isPlaceholder) return "";
      if (isCompleted) return "animate-pulse";
      if (isPartiallyCompleted) return "animate-pulse";
      return "";
    };

    const getSpecialIcon = () => {
      const icons = [Crown, Anchor, Star, Zap, Award];
      const IconComponent = icons[index % icons.length];
      return (
        <IconComponent
          size={10}
          className={`${isPlaceholder ? "text-white/30" : "text-white/70"}`}
        />
      );
    };

    const truncateTitle = (text, maxLength = 12) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

    return (
      <div className="flex flex-col items-center relative group">
        {/* Connection Line - Hidden on mobile, visible on larger screens */}
        {!isLast && (
          <div
            className={`absolute top-5 left-1/2 w-full h-0.5 bg-gradient-to-r ${getStatusColor()} ${
              isPlaceholder ? "opacity-20" : "opacity-60"
            } transition-all duration-500 z-0 hidden sm:block`}
          ></div>
        )}

        {/* Animated Background Glow */}
        <div
          className={`absolute w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${getStatusColor()} ${
            isPlaceholder ? "opacity-10" : "opacity-20"
          } blur-xl ${getPulseAnimation()} transition-all duration-500`}
        ></div>

        {/* Milestone Point */}
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center relative z-10 shadow-xl ${getGlowColor()} transition-all duration-500 hover:scale-125 hover:shadow-2xl border-2 border-white/20 backdrop-blur-sm group-hover:border-white/40 ${
            isPlaceholder ? "opacity-50" : ""
          }`}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>

          {/* Status Icon */}
          <div className="relative z-10">{getStatusIcon()}</div>

          {/* Floating particles effect for completed milestones */}
          {isCompleted && !isPlaceholder && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce shadow-lg">
              <Star size={8} className="text-white p-0.5" />
            </div>
          )}
        </div>

        {/* Milestone Label - Fixed Size Box */}
        <div className="mt-3 sm:mt-4 text-center relative z-10 w-20 sm:w-24 lg:w-28">
          <div
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300 ${
              isPlaceholder ? "opacity-60" : ""
            } h-16 sm:h-20 lg:h-24 flex flex-col justify-between`}
          >
            <p
              className={`text-[10px] sm:text-xs font-semibold text-white leading-tight ${
                isPlaceholder ? "text-gray-300 italic" : ""
              }`}
              title={title}
            >
              {truncateTitle(title, 15)}
            </p>

            {/* Special Icon */}
            <div className="flex justify-center my-1">{getSpecialIcon()}</div>

            {/* Enhanced Verification Status - Hidden for placeholders */}
            {!isPlaceholder && (
              <div className="flex items-center justify-center space-x-1">
                <div className="flex items-center space-x-0.5">
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                      userVerified
                        ? "bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-400/50"
                        : "bg-gray-500/50 border border-gray-400/30"
                    }`}
                    title="User Verified"
                  />
                  <User
                    size={6}
                    className={`${
                      userVerified ? "text-blue-300" : "text-gray-400"
                    } transition-colors duration-300 hidden sm:block`}
                  />
                </div>

                <div className="w-px h-2 bg-white/20"></div>

                <div className="flex items-center space-x-0.5">
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                      mentorVerified
                        ? "bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50"
                        : "bg-gray-500/50 border border-gray-400/30"
                    }`}
                    title="Mentor Verified"
                  />
                  <User
                    size={6}
                    className={`${
                      mentorVerified ? "text-purple-300" : "text-gray-400"
                    } transition-colors duration-300 hidden sm:block`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Tooltip - Only visible on larger screens and not for placeholders */}
        {!isPlaceholder && (
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 shadow-2xl border border-white/20 backdrop-blur-sm hidden lg:block">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    userVerified ? "bg-blue-400" : "bg-gray-400"
                  }`}
                ></div>
                <User size={12} />
                <span
                  className={`font-medium ${
                    userVerified ? "text-blue-300" : "text-gray-400"
                  }`}
                >
                  Student: {userVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mentorVerified ? "bg-purple-400" : "bg-gray-400"
                  }`}
                ></div>
                <User size={12} />
                <span
                  className={`font-medium ${
                    mentorVerified ? "text-purple-300" : "text-gray-400"
                  }`}
                >
                  Mentor: {mentorVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
          </div>
        )}

        {/* Progress Indicator Ring - Hidden for placeholders */}
        {!isPlaceholder && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-all duration-500">
            <div
              className={`absolute inset-0 rounded-full border-2 border-transparent ${
                isCompleted
                  ? "border-t-emerald-400 border-r-emerald-400"
                  : isPartiallyCompleted
                  ? "border-t-yellow-400"
                  : ""
              } transition-all duration-500`}
            ></div>
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-white/70">Loading mentor progress...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden">
        <div className="text-center py-10">
          <div className="text-red-400 mb-4">
            <UserCheck className="mx-auto mb-2" size={48} />
            <p className="text-lg font-semibold">Failed to Load Progress</p>
          </div>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={fetchMentorProgress}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <UserCheck className="mr-2 text-cyan-400" size={20} />
            Active Students Progress
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-cyan-300 font-medium">
              Live Updates
            </span>
          </div>
        </div>

        {/* Single Student Progress Card */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl p-4 sm:p-6 border border-white/10 relative overflow-hidden">
          {/* Student Info Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={studentData.image || "/default-avatar.jpg"}
                  alt={studentData.name || "Student Avatar"}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 ${
                    projectData ? "bg-emerald-400" : "bg-gray-400"
                  } rounded-full border-2 border-white shadow-lg`}
                ></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {studentData.name}
                </h3>
                <p className="text-cyan-300 font-medium">
                  {studentData.project}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`w-2 h-2 ${
                      projectData ? "bg-emerald-400" : "bg-gray-400"
                    } rounded-full animate-pulse`}
                  ></div>
                  <span
                    className={`text-sm ${
                      projectData ? "text-emerald-300" : "text-gray-300"
                    }`}
                  >
                    {projectData ? "Active Project" : "No Active Project"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-cyan-300">
                {studentData.progress}%
              </div>
              <div className="text-sm text-white/60">Overall Progress</div>
            </div>
          </div>

          {/* Milestone Tracker Section */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-2xl p-4 sm:p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white flex items-center">
                <Target className="mr-2 text-teal-400" size={20} />
                Project Milestone Tracker
              </h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-teal-300 font-medium">
                  Live Updates
                </span>
              </div>
            </div>

            {/* Milestones */}
            <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 space-y-8 sm:space-y-0 px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
              {displayMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex-1 flex justify-center">
                  <SingleMilestone
                    {...milestone}
                    index={index}
                    isLast={index === displayMilestones.length - 1}
                  />
                </div>
              ))}
            </div>

            {/* Progress Summary Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-white">
                  {studentData.project} - Progress
                </span>
                <span className="text-xs sm:text-sm font-bold text-teal-300">
                  {statistics.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 sm:h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{
                    width: `${statistics.progressPercentage}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-blue-200">
                <span>{statistics.completed} Completed</span>
                <span>{statistics.inProgress} In Progress</span>
                <span>{statistics.pending} Pending</span>
              </div>
            </div>
          </div>

          {/* Additional Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-emerald-400">
                {statistics.completed}
              </div>
              <div className="text-sm text-emerald-300">Completed</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">
                {statistics.inProgress}
              </div>
              <div className="text-sm text-yellow-300">In Progress</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-slate-400">
                {statistics.pending}
              </div>
              <div className="text-sm text-slate-300">Pending</div>
            </div>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">
              Mentorship Session Progress
            </span>
            <span className="text-sm font-bold text-cyan-300">
              {statistics.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{
                width: `${statistics.progressPercentage}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-blue-200">
            <span>Student: {studentData.name}</span>
            <span>Project: {projectData ? projectData.status : "None"}</span>
            <span>
              {projectData && projectData.expectedEndDate
                ? `Est. Completion: ${new Date(
                    projectData.expectedEndDate
                  ).toLocaleDateString()}`
                : "No timeline set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
