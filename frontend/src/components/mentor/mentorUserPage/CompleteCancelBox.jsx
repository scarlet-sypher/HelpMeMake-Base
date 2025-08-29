//================================================
//======This is mentor Complete cancel box for (my apprentice page)==============
//===============================================

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Send,
  AlertTriangle,
  MessageSquare,
  Award,
} from "lucide-react";

const CompleteCancelBox = ({
  projectData,
  apprenticeData,
  onDataRefresh,
  showReviewModal,
  setShowReviewModal,
}) => {
  const [loading, setLoading] = useState(false);
  // const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    communication: 5,
    commitment: 5,
    learningAttitude: 5,
    responsiveness: 5,
    overallExperience: 5,
    comment: "",
  });

  const handleDataRefresh = async () => {
    console.log(
      "🔄 handleDataRefresh called, showReviewModal:",
      showReviewModal
    );
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${apiUrl}/api/sync/apprentice-project-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("✅ Data refreshed successfully");
        setProjectData(response.data.project);
        setApprenticeData(response.data.apprentice);
        console.log(
          "🔄 After setProjectData, showReviewModal:",
          showReviewModal
        );
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  // Handle sending completion/cancellation request
  const handleSendRequest = async (type) => {
    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/mentor-completion-request`, // ✅ CORRECT ROUTE
        {
          projectId: projectData._id,
          type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onDataRefresh();
      } else {
        toast.error(response.data.message || `Failed to send ${type} request`);
      }
    } catch (error) {
      console.error(`Error sending ${type} request:`, error);
      toast.error(
        error.response?.data?.message || `Failed to send ${type} request`
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Handle learner/apprentice request response
  const handleRequestResponse = async (response, notes = "") => {
    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const apiResponse = await axios.post(
        `${apiUrl}/api/sync/handle-completion-request`,
        {
          requestId: projectData._id,
          response: response,
          notes: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (apiResponse.data.success) {
        toast.success(apiResponse.data.message);
        onDataRefresh();
      } else {
        toast.error(
          apiResponse.data.message || `Failed to ${response} request`
        );
      }
    } catch (error) {
      console.error(`Error ${response}ing request:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${response} request`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle apprentice review submission
  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      console.log("📝 Submitting review...");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/submit-apprentice-review`,
        {
          projectId: projectData._id,
          reviewData: reviewData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setShowReviewModal(false); // This should close the modal
        console.log("📝 Review submitted, modal should be closed");

        // POTENTIAL FIX: Add a delay before refreshing data
        setTimeout(() => {
          onDataRefresh();
        }, 100);
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    const {
      communication,
      commitment,
      learningAttitude,
      responsiveness,
      overallExperience,
    } = reviewData;
    return (
      (communication +
        commitment +
        learningAttitude +
        responsiveness +
        overallExperience) /
      5
    ).toFixed(1);
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating ? "text-yellow-400 fill-current" : "text-gray-400"
        }
      />
    ));
  };

  // ✅ FIXED: Check project status and completion request
  if (!projectData) {
    return null;
  }

  // Show completed state with review option
  if (
    projectData.status === "Completed" ||
    (projectData?.completionRequest?.status === "approved" &&
      projectData.status !== "Completed" &&
      projectData.status !== "Cancelled")
  ) {
    return (
      <>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {projectData.status === "Completed"
                  ? "Project Completed!"
                  : "Review Required"}
              </h3>
              <p className="text-gray-300 mb-4">
                {projectData.status === "Completed"
                  ? "This project has been successfully completed. Great work mentoring your apprentice!"
                  : "Your apprentice has accepted the request. Please submit your review to complete the process."}
              </p>
              {projectData.mentorReview?.rating ? (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
                  <p className="text-green-300 text-sm">✓ Review submitted</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    console.log("🎯 Submit Review button clicked");
                    console.log("📊 Current showReviewModal:", showReviewModal);
                    setShowReviewModal(true);
                    console.log("📊 After setting showReviewModal to true");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Submit Apprentice Review
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Modal - Keep existing review modal code */}
        {showReviewModal && (
          <>
            {console.log(
              "🎭 Rendering modal, showReviewModal:",
              showReviewModal
            )}
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
              onClick={(e) => {
                // Close modal when clicking the backdrop
                if (e.target === e.currentTarget) {
                  setShowReviewModal(false);
                }
              }}
            >
              <div
                className="relative bg-slate-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Star className="mr-3 text-yellow-400" size={28} />
                    Review Your Apprentice
                  </h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    disabled={loading}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                {apprenticeData && (
                  <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-800/50 rounded-xl">
                    <img
                      src={
                        apprenticeData.avatar || "/uploads/public/default.jpg"
                      }
                      alt={apprenticeData.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-white font-medium">
                        {apprenticeData.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {apprenticeData.title}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Rating Categories */}
                  {Object.entries({
                    communication: "Communication Skills",
                    commitment: "Commitment & Dedication",
                    learningAttitude: "Learning Attitude",
                    responsiveness: "Responsiveness",
                    overallExperience: "Overall Experience",
                  }).map(([key, label]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white font-medium">
                          {label}
                        </label>
                        <div className="flex items-center space-x-2">
                          {getRatingStars(reviewData[key])}
                          <span className="text-white ml-2">
                            {reviewData[key]}
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={reviewData[key]}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            [key]: parseInt(e.target.value),
                          })
                        }
                        disabled={loading}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                      />
                    </div>
                  ))}

                  {/* Overall Rating Display */}
                  <div className="text-center p-4 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
                    <div className="text-yellow-300 font-medium mb-2">
                      Average Rating
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex items-center">
                        {getRatingStars(Math.round(calculateAverageRating()))}
                      </div>
                      <span className="text-2xl font-bold text-white">
                        {calculateAverageRating()}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          comment: e.target.value,
                        })
                      }
                      disabled={loading}
                      placeholder="Share your thoughts about working with this apprentice..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmitReview}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowReviewModal(false)}
                      disabled={loading}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Don't show for non-active projects
  if (projectData.status !== "In Progress") {
    return null;
  }

  // Check for pending completion request
  const hasPendingRequest =
    projectData?.completionRequest?.status === "pending";
  const isRequestFromMentor =
    hasPendingRequest && projectData?.completionRequest?.from === "mentor";
  const isRequestFromApprentice =
    hasPendingRequest && projectData?.completionRequest?.from === "learner";

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-gradient-to-r from-slate-900/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Award className="mr-3 text-purple-400" size={28} />
              Project Completion
            </h3>
            <p className="text-gray-300">
              Manage project completion or cancellation
            </p>
          </div>
        </div>

        {/* Pending Request from Mentor */}
        {isRequestFromMentor && (
          <div className="mb-6 p-4 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-300 font-medium mb-1">
                  Request Pending
                </h4>
                <p className="text-yellow-200 text-sm">
                  Your {projectData.completionRequest.type} request is waiting
                  for apprentice confirmation.
                </p>
                <p className="text-yellow-300 text-xs mt-1">
                  Sent on{" "}
                  {new Date(
                    projectData.completionRequest.requestedAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Request from Apprentice - ✅ FIXED */}
        {isRequestFromApprentice && (
          <div className="mb-6 p-4 bg-blue-900/20 rounded-xl border border-blue-600/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <MessageSquare className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-300 font-medium mb-1">
                    Apprentice Request
                  </h4>
                  <p className="text-blue-200 text-sm">
                    Your apprentice has requested to{" "}
                    {projectData.completionRequest.type} the project.
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Requested on{" "}
                    {new Date(
                      projectData.completionRequest.requestedAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleRequestResponse("approve", "")}
                  disabled={loading}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {loading ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      <span>Approve</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRequestResponse("reject", "")}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {loading ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <XCircle size={14} />
                      <span>Reject</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons (only show if no pending request) */}
        {!hasPendingRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSendRequest("complete")}
                disabled={loading}
                className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle size={20} />
                )}
                <span>Mark Complete</span>
              </button>

              <button
                onClick={() => handleSendRequest("cancel")}
                disabled={loading}
                className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <XCircle size={20} />
                )}
                <span>Cancel Project</span>
              </button>
            </div>

            <div className="flex items-start p-4 bg-purple-900/20 rounded-xl border border-purple-600/30">
              <AlertTriangle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-purple-300">
                <p className="font-medium mb-1">Important Note</p>
                <p>
                  Both completion and cancellation require confirmation from
                  your apprentice. Once confirmed, you'll be able to submit a
                  review.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CompleteCancelBox;
