import React from "react";
import {
  MessageSquare,
  X,
  Loader,
  CheckCircle,
  User,
  Clock,
  Mail,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  Star,
  Heart,
  Zap,
} from "lucide-react";

const ReviewerBox = ({ milestone, onClose, onMarkAsRead, saving }) => {
  const handleMarkAsRead = async () => {
    if (onMarkAsRead && !milestone.reviewReadByLearner) {
      await onMarkAsRead(milestone._id);

      setTimeout(() => onClose(), 500);
    }
  };

  const isUnread = milestone.reviewNote && !milestone.reviewReadByLearner;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-950/95 via-blue-950/95 to-indigo-950/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl sm:max-w-3xl max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Simplified Header */}
        <div className="relative bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 border-b border-white/10">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl shadow-lg border border-white/20">
                  <MessageSquare className="text-white" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <span>Mentor Review</span>
                    {isUnread && (
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-blue-200/80 mt-1 truncate">
                    {milestone.title}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-gray-400 hover:text-white flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(95vh - 180px)" }}
        >
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {milestone.reviewNote ? (
              <>
                {/* Unread notification - moved inside content */}
                {isUnread && (
                  <div className="bg-gradient-to-r from-orange-500/15 via-red-500/15 to-pink-500/15 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-orange-400/30">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <Mail className="text-orange-400" size={18} />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-orange-200 font-semibold text-sm">
                          💬 Fresh message from your mentor!
                        </p>
                        <p className="text-orange-300/80 text-xs mt-1">
                          Take a moment to read through their valuable feedback
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Review Message */}
                <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-lg">
                  {/* Message header */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-3 sm:p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-md flex-shrink-0">
                        <User className="text-white" size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-purple-300 font-semibold text-sm">
                            Your Mentor says:
                          </p>
                          {isUnread && (
                            <span className="px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                              Unread
                            </span>
                          )}
                        </div>
                        {milestone.reviewedAt && (
                          <div className="flex items-center space-x-1 text-gray-400 text-xs">
                            <Calendar size={10} />
                            <span className="truncate">
                              {new Date(
                                milestone.reviewedAt
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(
                                milestone.reviewedAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="p-4 sm:p-6">
                    <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-lg p-3 sm:p-4 border border-purple-400/20">
                      <p className="text-white/95 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
                        {milestone.reviewNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Learning Tip Section */}
                <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 border border-blue-400/20">
                  <div className="flex items-start space-x-3">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex-shrink-0">
                      <BookOpen className="text-white" size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-blue-300 font-semibold text-sm">
                          Learning Tip
                        </h4>
                        <Star className="text-blue-400" size={12} />
                      </div>
                      <p className="text-blue-200/90 text-xs sm:text-sm leading-relaxed">
                        Use your mentor's feedback to enhance your skills. Don't
                        hesitate to ask questions during your next session!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* No Review Message */
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gradient-to-br from-gray-500/10 to-slate-600/10 rounded-2xl p-6 sm:p-8 border border-gray-500/20">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl">
                      <MessageSquare className="text-gray-300" size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-300">
                        No Review Yet
                      </h3>
                      <p className="text-gray-400 text-sm max-w-md px-4">
                        Your mentor hasn't provided feedback for this milestone
                        yet. Once they review your work, their message will
                        appear here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer - Fixed and Always Visible */}
        {milestone.reviewNote && (
          <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-t border-white/10 p-4 sm:p-6">
            {isUnread ? (
              <div className="space-y-3">
                <button
                  onClick={handleMarkAsRead}
                  disabled={saving}
                  className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center space-x-2 border border-emerald-400/20 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span className="hidden sm:inline">
                        Mark as Read & Understood
                      </span>
                      <span className="sm:hidden">Mark as Read</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  💡 Marking as read helps track your learning progress
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-300 text-sm">
                  <CheckCircle size={16} />
                  <span>Message read and understood</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white rounded-xl font-medium transition-all duration-200 border border-white/20 hover:border-white/30 text-sm"
                >
                  Close Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerBox;
