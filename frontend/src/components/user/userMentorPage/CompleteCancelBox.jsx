//===================================================================
//=====================This is learner complete cancel box (for my mentor page)============
//===================================================================

import React, { useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  X,
  Send,
} from "lucide-react";

const CompleteCancelBox = ({ projectData, onUpdate, showToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    technicalSkills: 5,
    communication: 5,
    helpfulness: 5,
    professionalism: 5,
    overallExperience: 5,
    comment: "",
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isCompleteDisabled =
    projectData?.completionRequest?.type === "cancel" &&
    projectData?.completionRequest?.status === "pending";
  const isCancelDisabled =
    projectData?.completionRequest?.type === "complete" &&
    projectData?.completionRequest?.status === "pending";
  const completeRequested =
    projectData?.completionRequest?.type === "complete" &&
    projectData?.completionRequest?.status === "pending";
  const cancelRequested =
    projectData?.completionRequest?.type === "cancel" &&
    projectData?.completionRequest?.status === "pending";

  const handleActionClick = (type) => {
    setModalType(type);
    setConfirmText("");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    const expectedText =
      modalType === "complete" ? "I want to complete" : "I want to cancel";

    if (confirmText !== expectedText) {
      showToast({
        message: `Please type exactly: "${expectedText}"`,
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/completion-request`,
        {
          projectId: projectData._id,
          type: modalType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowModal(false);
        onUpdate();
        showToast({
          message: `${
            modalType === "complete" ? "Completion" : "Cancellation"
          } request sent successfully`,
          status: "success",
        });
      } else {
        showToast({
          message: response.data.message,
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error sending completion request:", error);
      showToast({
        message: "Failed to send request",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${apiUrl}/api/sync/submit-review`,
        {
          projectId: projectData._id,
          reviewData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowReviewModal(false);
        setReviewSubmitted(true);
        showToast({
          message: "Review submitted successfully!",
          status: "success",
        });
      } else {
        showToast({
          message: response.data.message,
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast({
        message: "Failed to submit review",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, onChange) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-colors ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            } hover:text-yellow-400`}
          >
            <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    const {
      technicalSkills,
      communication,
      helpfulness,
      professionalism,
      overallExperience,
    } = reviewData;
    return (
      (technicalSkills +
        communication +
        helpfulness +
        professionalism +
        overallExperience) /
      5
    ).toFixed(1);
  };

  const handleMentorRequestResponse = async (response) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const apiResponse = await axios.post(
        `${apiUrl}/api/sync/handle-completion-request`,
        {
          requestId: projectData._id,
          response: response,
          notes: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiResponse.data.success) {
        showToast({
          message: `Request ${response}d successfully`,
          status: "success",
        });
        onUpdate();
      } else {
        showToast({
          message: apiResponse.data.message || `Failed to ${response} request`,
          status: "error",
        });
      }
    } catch (error) {
      console.error(`Error ${response}ing request:`, error);
      showToast({
        message: `Failed to ${response} request`,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show review modal if project was completed
  if (
    (projectData?.status === "Completed" ||
      projectData?.completionRequest?.status === "approved") &&
    !projectData?.learnerReview?.rating
  ) {
    return (
      <>
        <div className="bg-gradient-to-r from-green-500/30 to-emerald-600/30 backdrop-blur-sm rounded-3xl p-6 text-white border border-green-400/30 shadow-2xl">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Project Completed!</h2>
            <p className="text-green-200 mb-6">
              Please rate your mentor to help future learners
            </p>
            {projectData?.learnerReview?.rating || reviewSubmitted ? (
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30 text-center">
                <p className="text-green-300 font-medium">✓ Review Submitted</p>
                <p className="text-green-200 text-sm mt-1">
                  Review submitted successfully. Waiting for mentor to review.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Rate Mentor
              </button>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Rate Your Mentor
                  </h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Rating Categories */}
                  <div className="grid gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Technical Skills
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {reviewData.technicalSkills}/5
                        </span>
                      </div>
                      {renderStars(reviewData.technicalSkills, (rating) =>
                        setReviewData((prev) => ({
                          ...prev,
                          technicalSkills: rating,
                        }))
                      )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Communication
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {reviewData.communication}/5
                        </span>
                      </div>
                      {renderStars(reviewData.communication, (rating) =>
                        setReviewData((prev) => ({
                          ...prev,
                          communication: rating,
                        }))
                      )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Helpfulness
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {reviewData.helpfulness}/5
                        </span>
                      </div>
                      {renderStars(reviewData.helpfulness, (rating) =>
                        setReviewData((prev) => ({
                          ...prev,
                          helpfulness: rating,
                        }))
                      )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Professionalism
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {reviewData.professionalism}/5
                        </span>
                      </div>
                      {renderStars(reviewData.professionalism, (rating) =>
                        setReviewData((prev) => ({
                          ...prev,
                          professionalism: rating,
                        }))
                      )}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Overall Experience
                        </span>
                        <span className="text-yellow-400 font-bold">
                          {reviewData.overallExperience}/5
                        </span>
                      </div>
                      {renderStars(reviewData.overallExperience, (rating) =>
                        setReviewData((prev) => ({
                          ...prev,
                          overallExperience: rating,
                        }))
                      )}
                    </div>
                  </div>

                  {/* Average Rating Display */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-400/30">
                    <div className="text-center">
                      <span className="text-yellow-400 text-sm">
                        Average Rating
                      </span>
                      <div className="text-3xl font-bold text-white">
                        {calculateAverageRating()}/5
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <label className="text-white font-medium block mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Share your experience with this mentor..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Skip Review
                    </button>
                    <button
                      onClick={handleReviewSubmit}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Star size={16} />
                          <span>Submit Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <AlertTriangle className="mr-2 text-orange-400" size={24} />
            Project Actions
          </h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                projectData?.status === "In Progress"
                  ? "bg-blue-400"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm text-gray-300 font-medium">
              {projectData?.status || "Active"}
            </span>
          </div>
        </div>

        {/* Handle Mentor Request */}
        {projectData?.completionRequest?.status === "pending" &&
          projectData?.completionRequest?.from === "mentor" && (
            <div className="mb-6 bg-yellow-500/20 backdrop-blur-sm rounded-3xl p-6 border border-yellow-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Mentor Request Received
                  </h3>
                  <p className="text-yellow-200">
                    Your mentor wants to {projectData.completionRequest.type}{" "}
                    the project.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleMentorRequestResponse("approve")}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleMentorRequestResponse("reject")}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complete Button */}
          <button
            onClick={() => handleActionClick("complete")}
            disabled={
              isCompleteDisabled ||
              (projectData?.completionRequest?.status === "pending" &&
                projectData?.completionRequest?.from === "mentor")
            }
            className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
              completeRequested
                ? "bg-gradient-to-r from-green-500/30 to-emerald-600/30 border-green-400/50 cursor-default"
                : isCompleteDisabled
                ? "bg-gray-600/30 border-gray-500/50 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-400/30 hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400/50 hover:shadow-2xl transform hover:scale-105 cursor-pointer"
            }`}
          >
            {/* Shine effect */}
            {!isCompleteDisabled && !completeRequested && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}

            <div className="relative z-10 text-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto ${
                  completeRequested
                    ? "bg-green-400/30"
                    : "bg-green-400/20 group-hover:bg-green-400/30"
                } transition-colors`}
              >
                <CheckCircle size={24} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {completeRequested ? "Request Sent" : "Mark Complete"}
              </h3>
              <p className="text-sm text-gray-300">
                {completeRequested
                  ? "Waiting for mentor approval"
                  : "Request project completion"}
              </p>
              {completeRequested && (
                <div className="mt-3 px-3 py-1 bg-green-400/20 rounded-full">
                  <span className="text-xs text-green-300 font-medium">
                    Pending Approval
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => handleActionClick("cancel")}
            disabled={
              isCancelDisabled ||
              (projectData?.completionRequest?.status === "pending" &&
                projectData?.completionRequest?.from === "mentor")
            }
            className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
              cancelRequested
                ? "bg-gradient-to-r from-red-500/30 to-pink-600/30 border-red-400/50 cursor-default"
                : isCancelDisabled
                ? "bg-gray-600/30 border-gray-500/50 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-red-500/20 to-pink-600/20 border-red-400/30 hover:from-red-500/30 hover:to-pink-600/30 hover:border-red-400/50 hover:shadow-2xl transform hover:scale-105 cursor-pointer"
            }`}
          >
            {/* Shine effect */}
            {!isCancelDisabled && !cancelRequested && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}

            <div className="relative z-10 text-center">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto ${
                  cancelRequested
                    ? "bg-red-400/30"
                    : "bg-red-400/20 group-hover:bg-red-400/30"
                } transition-colors`}
              >
                <XCircle size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {cancelRequested ? "Request Sent" : "Cancel Project"}
              </h3>
              <p className="text-sm text-gray-300">
                {cancelRequested
                  ? "Waiting for mentor approval"
                  : "Request project cancellation"}
              </p>
              {cancelRequested && (
                <div className="mt-3 px-3 py-1 bg-red-400/20 rounded-full">
                  <span className="text-xs text-red-300 font-medium">
                    Pending Approval
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-500/10 rounded-2xl p-4 border border-blue-400/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-blue-400 mt-0.5" size={20} />
            <div>
              <h4 className="text-white font-medium mb-1">Important Notes</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>
                  • Both actions require mentor approval before taking effect
                </li>
                <li>• Completing the project will trigger a review process</li>
                <li>• Canceling may affect your completion rate</li>
                <li>• Once a request is sent, the other action is disabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  Confirm{" "}
                  {modalType === "complete" ? "Completion" : "Cancellation"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    modalType === "complete"
                      ? "bg-green-500/10 border-green-400/30"
                      : "bg-red-500/10 border-red-400/30"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {modalType === "complete" ? (
                      <CheckCircle className="text-green-400" size={24} />
                    ) : (
                      <XCircle className="text-red-400" size={24} />
                    )}
                    <div>
                      <h4 className="text-white font-medium">
                        {modalType === "complete"
                          ? "Mark Project Complete"
                          : "Cancel Project"}
                      </h4>
                      <p
                        className={`text-sm ${
                          modalType === "complete"
                            ? "text-green-200"
                            : "text-red-200"
                        }`}
                      >
                        {modalType === "complete"
                          ? "This will send a completion request to your mentor"
                          : "This will send a cancellation request to your mentor"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <label className="text-white font-medium block mb-2">
                    Type to confirm:{" "}
                    <span className="text-yellow-400">
                      "
                      {modalType === "complete"
                        ? "I want to complete"
                        : "I want to cancel"}
                      "
                    </span>
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={
                      modalType === "complete"
                        ? "I want to complete"
                        : "I want to cancel"
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div className="bg-yellow-500/10 rounded-2xl p-4 border border-yellow-400/20">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle
                      className="text-yellow-400 mt-0.5"
                      size={16}
                    />
                    <div>
                      <p className="text-yellow-200 text-sm">
                        {modalType === "complete"
                          ? "Your mentor will review and approve this completion request. You'll be asked to rate your mentor after approval."
                          : "Your mentor will review this cancellation request. This action may affect your completion statistics."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={
                      loading ||
                      confirmText !==
                        (modalType === "complete"
                          ? "I want to complete"
                          : "I want to cancel")
                    }
                    className={`flex-1 px-4 py-3 bg-gradient-to-r ${
                      modalType === "complete"
                        ? "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        : "from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2`}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompleteCancelBox;
