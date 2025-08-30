import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  AlertCircle,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import axios from "axios";

const ShowRequestsModal = ({ project, onClose, API_URL, showToast }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [respondingId, setRespondingId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [responseAction, setResponseAction] = useState(null);

  useEffect(() => {
    fetchProjectRequests();
  }, [project._id]);

  const fetchProjectRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      // Get all requests for this mentor
      const response = await axios.get(`${API_URL}/requests/mentor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Filter requests for this specific project
        const projectRequests = response.data.requests.filter(
          (request) => request.projectId === project._id
        );
        setRequests(projectRequests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseClick = (request, action) => {
    setCurrentRequest(request);
    setResponseAction(action);
    setResponseText("");
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!currentRequest || !responseAction) return;

    try {
      setRespondingId(currentRequest._id);
      const token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `${API_URL}/requests/${currentRequest._id}/respond`,
        {
          status: responseAction,
          response: responseText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((req) =>
            req._id === currentRequest._id
              ? {
                  ...req,
                  status: responseAction,
                  mentorResponse: responseText,
                  respondedAt: new Date(),
                }
              : req
          )
        );

        setShowResponseModal(false);
        setCurrentRequest(null);
        setResponseAction(null);
        setResponseText("");

        showToast({
          message: `Request ${responseAction} successfully!`,
          status: "success",
        });
      }
    } catch (error) {
      console.error("Error responding to request:", error);

      showToast({
        message: `Failed to respond to request`,
        status: "error",
      });
    } finally {
      setRespondingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-300 bg-green-500/20 border-green-400/30";
      case "rejected":
        return "text-red-300 bg-red-500/20 border-red-400/30";
      case "pending":
      default:
        return "text-yellow-300 bg-yellow-500/20 border-yellow-400/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      case "pending":
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <>
      {/* Main Modal  */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950






 rounded-3xl shadow-2xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl mr-4">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Project Requests
                  </h3>
                  <p className="text-cyan-300 text-sm">{project.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-white text-center">
                    <Clock className="animate-spin mx-auto mb-2" size={24} />
                    <p>Loading requests...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle
                    className="text-red-400 mx-auto mb-2"
                    size={32}
                  />
                  <p className="text-red-300">{error}</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare
                    className="text-gray-400 mx-auto mb-4"
                    size={48}
                  />
                  <h4 className="text-white text-lg font-semibold mb-2">
                    No Requests Yet
                  </h4>
                  <p className="text-gray-300">
                    No learners have sent requests for this project.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    >
                      {/* Request Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          {/* Learner Avatar */}
                          <div className="relative">
                            <img
                              src={
                                request.learnerUser?.userId?.avatar
                                  ? request.learnerUser.userId.avatar.startsWith(
                                      "/uploads/"
                                    )
                                    ? `${API_URL}${request.learnerUser.userId.avatar}`
                                    : request.learnerUser.userId.avatar
                                  : `${API_URL}/uploads/public/default.jpg`
                              }
                              alt={
                                request.learnerUser?.userId?.name || "Learner"
                              }
                              className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500/50"
                              onError={(e) => {
                                e.target.src = `${API_URL}/uploads/public/default.jpg`;
                              }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>

                          {/* Learner Info */}
                          <div>
                            <h5 className="text-white font-semibold text-lg">
                              {request.learnerUser?.userId?.name ||
                                "Anonymous Learner"}
                            </h5>
                            <div className="flex items-center text-sm text-gray-300 space-x-3">
                              <span className="flex items-center">
                                <User size={12} className="mr-1" />
                                {request.learnerUser?.title || "Student"}
                              </span>
                              {request.learnerUser?.location && (
                                <span className="flex items-center">
                                  <MapPin size={12} className="mr-1" />
                                  {request.learnerUser.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <Calendar size={14} className="mr-2" />
                          <span>Sent on {formatDate(request.createdAt)}</span>
                          {request.respondedAt && (
                            <>
                              <span className="mx-2">•</span>
                              <span>
                                Responded on {formatDate(request.respondedAt)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Request Message */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-gray-200 leading-relaxed">
                            {request.message}
                          </p>
                        </div>
                      </div>

                      {/* Mentor Response (if exists) */}
                      {request.mentorResponse && (
                        <div className="mb-4">
                          <h6 className="text-sm font-medium text-cyan-300 mb-2">
                            Your Response:
                          </h6>
                          <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-400/30">
                            <p className="text-gray-200 text-sm">
                              {request.mentorResponse}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {request.status === "pending" && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleResponseClick(request, "accepted")
                            }
                            disabled={respondingId === request._id}
                            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
                          >
                            <CheckCircle size={16} />
                            <span>
                              {respondingId === request._id
                                ? "Processing..."
                                : "Accept"}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              handleResponseClick(request, "rejected")
                            }
                            disabled={respondingId === request._id}
                            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
                          >
                            <XCircle size={16} />
                            <span>
                              {respondingId === request._id
                                ? "Processing..."
                                : "Reject"}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Already Responded */}
                      {request.status !== "pending" && (
                        <div className="text-center py-2">
                          <p className="text-gray-400 text-sm">
                            Request {request.status} on{" "}
                            {formatDate(request.respondedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
            <div className="relative z-10">
              {/* Response Header */}
              <div className="flex items-center mb-6">
                <div
                  className={`p-3 rounded-xl mr-4 ${
                    responseAction === "accepted"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                  }`}
                >
                  {responseAction === "accepted" ? (
                    <CheckCircle className="text-white" size={24} />
                  ) : (
                    <XCircle className="text-white" size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {responseAction === "accepted" ? "Accept" : "Reject"}{" "}
                    Request
                  </h3>
                  <p className="text-gray-300 text-sm">
                    From: {currentRequest?.learnerUser?.userId?.name}
                  </p>
                </div>
              </div>

              {/* Response Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Response Message (Optional)
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder={`Add a ${
                      responseAction === "accepted" ? "welcome" : "polite"
                    } message...`}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setCurrentRequest(null);
                    setResponseAction(null);
                    setResponseText("");
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                  disabled={respondingId}
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  disabled={respondingId}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg ${
                    responseAction === "accepted"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  } disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed`}
                >
                  {respondingId
                    ? "Processing..."
                    : `${
                        responseAction === "accepted" ? "Accept" : "Reject"
                      } Request`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowRequestsModal;
