import React from "react";
import { MessageSquare, X, Loader, CheckCircle, User } from "lucide-react";

const ReviewerBox = ({ milestone, onClose, onMarkAsRead, saving }) => {
  const handleMarkAsRead = async () => {
    if (onMarkAsRead && !milestone.reviewReadByLearner) {
      await onMarkAsRead(milestone._id);
      // Close modal after marking as read
      setTimeout(() => onClose(), 500);
    }
  };

  const isUnread = milestone.reviewNote && !milestone.reviewReadByLearner;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
                <MessageSquare className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Mentor Review</h3>
                <p className="text-sm text-gray-300">{milestone.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Unread notification */}
          {isUnread && (
            <div className="mt-3 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30 flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
              <span className="text-orange-200 font-medium text-sm">
                💬 New message from your mentor!
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            {milestone.reviewNote ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex-shrink-0">
                    <User className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="text-purple-300 font-medium text-sm">
                        Your Mentor says:
                      </p>
                      {isUnread && (
                        <span className="px-2 py-1 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-xs font-medium animate-pulse">
                          New!
                        </span>
                      )}
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-3 border border-purple-400/20">
                      <p className="text-white leading-relaxed whitespace-pre-wrap">
                        {milestone.reviewNote}
                      </p>
                    </div>
                    {milestone.reviewedAt && (
                      <p className="text-gray-400 text-xs mt-3">
                        Sent on{" "}
                        {new Date(milestone.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare
                  className="text-gray-400 mx-auto mb-3"
                  size={32}
                />
                <p className="text-gray-300">
                  No review message from your mentor yet.
                </p>
              </div>
            )}

            {/* Mentor guidance tip */}
            {milestone.reviewNote && (
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                <div className="flex items-start space-x-2">
                  <div className="p-1 bg-blue-500 rounded text-white">💡</div>
                  <div>
                    <p className="text-blue-300 font-medium text-sm mb-1">
                      Tip:
                    </p>
                    <p className="text-blue-200 text-sm">
                      Use your mentor's feedback to improve your work and learn
                      new skills. Don't hesitate to ask questions during your
                      next session!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        {milestone.reviewNote && (
          <div className="p-6 border-t border-white/10">
            <div className="flex justify-center">
              {isUnread ? (
                <button
                  onClick={handleMarkAsRead}
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  {saving ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  <span>Mark as Read & Understood</span>
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-green-300 text-sm mb-2 flex items-center justify-center space-x-1">
                    <CheckCircle size={16} />
                    <span>Message read and understood</span>
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerBox;
