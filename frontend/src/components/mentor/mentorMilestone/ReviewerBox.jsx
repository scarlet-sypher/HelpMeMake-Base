import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  X,
  Loader,
  Send,
  Edit,
  User,
  CheckCircle,
} from "lucide-react";

const ReviewerBox = ({
  milestone,
  onClose,
  onAddReview,
  saving,
  isMentor = true,
}) => {
  const [reviewText, setReviewText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [localSaving, setLocalSaving] = useState(false);

  useEffect(() => {
    // Initialize with existing review note or empty
    setReviewText(milestone.reviewNote || "");
    // Start in edit mode if there's no existing review
    setIsEditMode(!milestone.reviewNote);
  }, [milestone]);

  const handleSendReview = async () => {
    if (!reviewText.trim()) return;

    try {
      setLocalSaving(true);
      await onAddReview(milestone._id, reviewText.trim());
      setIsEditMode(false);
    } catch (error) {
      console.error("Error sending review:", error);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setReviewText(milestone.reviewNote || "");
    setIsEditMode(!milestone.reviewNote); // Return to edit if no existing review
  };

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const isLoading = saving || localSaving;
  const hasExistingReview =
    milestone.reviewNote && milestone.reviewNote.trim() !== "";
  const canSend =
    reviewText.trim() !== "" && reviewText !== milestone.reviewNote;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl">
                <MessageSquare className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isMentor ? "Add Review Note" : "Mentor Review"}
                </h3>
                <p className="text-sm text-gray-300 truncate max-w-md">
                  {milestone.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            {isEditMode ? (
              // Edit Mode - Text Area
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    {hasExistingReview
                      ? "Edit Your Review"
                      : "Write a Review Note"}
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={handleTextChange}
                    placeholder="Share your thoughts, feedback, or guidance for the student..."
                    rows={6}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      {reviewText.length}/1000 characters
                    </p>
                    {reviewText.length >= 950 && (
                      <p className="text-xs text-yellow-400">
                        Character limit approaching
                      </p>
                    )}
                  </div>
                </div>

                {/* Guidance tip */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-teal-600/10 rounded-xl p-4 border border-cyan-400/20">
                  <div className="flex items-start space-x-2">
                    <div className="p-1 bg-cyan-500 rounded text-white text-sm">
                      💡
                    </div>
                    <div>
                      <p className="text-cyan-300 font-medium text-sm mb-1">
                        Mentor Tip:
                      </p>
                      <p className="text-cyan-200 text-sm">
                        Provide constructive feedback, highlight what they did
                        well, and suggest areas for improvement. Your guidance
                        helps students grow and learn effectively.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Read Mode - Display Review
              <div className="space-y-4">
                {hasExistingReview ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl flex-shrink-0">
                        <User className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-cyan-300 font-medium text-sm">
                            Your Review:
                          </p>
                          {milestone.reviewedAt && (
                            <p className="text-gray-400 text-xs">
                              {new Date(milestone.reviewedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-cyan-500/10 to-teal-600/10 rounded-xl p-3 border border-cyan-400/20">
                          <p className="text-white leading-relaxed whitespace-pre-wrap">
                            {milestone.reviewNote}
                          </p>
                        </div>

                        {/* Review status indicator */}
                        <div className="mt-3 flex items-center space-x-2">
                          {milestone.reviewReadByLearner ? (
                            <div className="flex items-center space-x-1 text-green-400">
                              <CheckCircle size={12} />
                              <span className="text-xs">Read by student</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-orange-400">
                              <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                              <span className="text-xs">
                                Unread - Student will be notified
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare
                      className="text-gray-400 mx-auto mb-3"
                      size={32}
                    />
                    <p className="text-gray-300 mb-2">No review note yet</p>
                    <p className="text-gray-400 text-sm">
                      Click "Add Review" to provide feedback to your student
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/10">
          <div className="flex justify-end space-x-3">
            {isEditMode ? (
              // Edit Mode Buttons
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReview}
                  disabled={!canSend || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  <span>
                    {hasExistingReview ? "Update Review" : "Send Review"}
                  </span>
                </button>
              </>
            ) : (
              // Read Mode Buttons
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Close
                </button>
                {hasExistingReview && (
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <Edit size={18} />
                    <span>Edit Review</span>
                  </button>
                )}
                {!hasExistingReview && (
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <MessageSquare size={18} />
                    <span>Add Review</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerBox;
