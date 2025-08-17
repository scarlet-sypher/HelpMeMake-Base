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
} from "lucide-react";
import { toast } from "react-toastify";

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
}) => {
  const [requestedMentorIds, setRequestedMentorIds] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Fetch available mentors
  const fetchMentors = async () => {
    try {
      setMentorsLoading(true);
      const response = await axios.get(`${API_URL}/mentors/all`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMentors(response.data.mentors);
      } else {
        toast.error("Failed to load mentors");
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast.error("Error loading mentors");
    } finally {
      setMentorsLoading(false);
    }
  };

  // Fetch existing requests for this project
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
      }
    } catch (error) {
      console.error("Error fetching project requests:", error);
      // Don't show error toast for this as it's not critical for UX
    } finally {
      setLoadingRequests(false);
    }
  };

  // Handle showing mentor selection
  useEffect(() => {
    if (showMentorSelection) {
      if (mentors.length === 0) {
        fetchMentors();
      }
      fetchProjectRequests();
    }
  }, [showMentorSelection, project?._id]);

  // Handle request sent callback
  const handleRequestSent = (mentorId) => {
    setRequestedMentorIds((prev) => [...prev, mentorId.toString()]);
    setShowMentorSelection(false);
  };

  // Check if mentor has been requested
  const isMentorRequested = (mentorId) => {
    return requestedMentorIds.includes(mentorId.toString());
  };

  if (!showMentorSelection) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Users className="mr-2 text-purple-400" size={24} />
              Select a Mentor
            </h2>
            <button
              onClick={() => setShowMentorSelection(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Project Info Banner */}
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-4 mb-6 border border-blue-500/30">
            <h3 className="text-white font-semibold mb-1">
              Requesting mentors for:
            </h3>
            <p className="text-blue-200 font-medium">{project?.name}</p>
            <p className="text-gray-300 text-sm">{project?.shortDescription}</p>
          </div>

          {mentorsLoading || loadingRequests ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <div className="text-white">Loading mentors...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentors.map((mentor) => {
                const isRequested = isMentorRequested(mentor._id);

                return (
                  <div
                    key={mentor._id}
                    className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border transition-colors ${
                      isRequested
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-white/20 hover:border-white/30"
                    }`}
                  >
                    {/* Request Status Badge */}
                    {isRequested && (
                      <div className="mb-3">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                          <CheckCircle size={14} />
                          <span>Request Sent</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                          <User className="text-white" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">
                          {mentor.userId?.name || "Anonymous Mentor"}
                        </h3>
                        <p className="text-blue-300 text-sm">{mentor.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-1">
                            <Star className="text-yellow-400" size={14} />
                            <span>{mentor.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="text-green-400" size={14} />
                            <span>{mentor.totalStudents} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="text-blue-400" size={14} />
                            <span>{mentor.completedSessions} sessions</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                      {mentor.description}
                    </p>

                    {/* Expertise */}
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2 text-sm">
                        Expertise
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 4).map((exp, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded text-xs border border-green-500/30"
                          >
                            {exp.skill} ({exp.level})
                          </span>
                        ))}
                        {mentor.expertise.length > 4 && (
                          <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                            +{mentor.expertise.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Experience:</span>
                        <span className="text-white font-semibold">
                          {mentor.experience.years} years
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Response Time:</span>
                        <span className="text-white font-semibold">
                          {mentor.responseTime} mins
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Hourly Rate:</span>
                        <span className="text-white font-semibold">
                          {formatPrice(
                            mentor.pricing.hourlyRate,
                            mentor.pricing.currency
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        {mentor.socialLinks?.linkedin &&
                          mentor.socialLinks.linkedin !== "#" && (
                            <a
                              href={mentor.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                            >
                              <Linkedin size={16} />
                            </a>
                          )}
                        {mentor.socialLinks?.github &&
                          mentor.socialLinks.github !== "#" && (
                            <a
                              href={mentor.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors"
                            >
                              <Github size={16} />
                            </a>
                          )}
                        {mentor.socialLinks?.portfolio &&
                          mentor.socialLinks.portfolio !== "#" && (
                            <a
                              href={mentor.socialLinks.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                            >
                              <Globe size={16} />
                            </a>
                          )}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          mentor.isOnline
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {mentor.isOnline ? "Online" : "Offline"}
                      </div>
                    </div>

                    {/* Action Button */}
                    {isRequested ? (
                      <div className="w-full px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl font-medium flex items-center justify-center space-x-2">
                        <Clock size={16} />
                        <span>Request Pending</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        disabled={!mentor.isAvailable}
                        className={`w-full px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${
                          mentor.isAvailable
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            : "bg-gray-500/20 text-gray-400 cursor-not-allowed transform-none"
                        }`}
                      >
                        <Send size={16} />
                        <span>
                          {mentor.isAvailable
                            ? "Send Request"
                            : "Not Available"}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!mentorsLoading && !loadingRequests && mentors.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">
                No Mentors Available
              </h3>
              <p className="text-gray-300 mb-6">
                There are currently no mentors available. Please try again
                later.
              </p>
              <button
                onClick={() => setShowMentorSelection(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSelectionModal;
