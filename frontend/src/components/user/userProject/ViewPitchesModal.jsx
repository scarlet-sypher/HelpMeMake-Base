import React from "react";
import { MessageSquare, X, Loader2, DollarSign, UserCheck } from "lucide-react";

const ViewPitchesModal = ({
  show,
  pitches,
  isLoadingPitches,
  project,
  API_URL,
  onClose,
  onSetClosingPriceFromPitch,
  onViewMentorProfile,
  showToast,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <MessageSquare className="mr-2 text-blue-400" size={20} />
            Project Pitches ({pitches.length})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {isLoadingPitches ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-400" size={24} />
              <span className="ml-2 text-white">Loading pitches...</span>
            </div>
          ) : pitches.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-300 text-lg">No pitches yet</p>
              <p className="text-gray-400 text-sm">
                Mentors will appear here when they show interest in your project
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pitches.map((pitch) => (
                <div
                  key={pitch._id}
                  className="bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          pitch.mentor?.avatar
                            ? pitch.mentor.avatar.startsWith("/uploads/")
                              ? `${API_URL}${pitch.mentor.avatar}`
                              : pitch.mentor.avatar
                            : `${API_URL}/uploads/public/default.jpg`
                        }
                        alt={pitch.mentor?.name || "Mentor"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `${API_URL}/uploads/public/default.jpg`;
                        }}
                      />
                      <div>
                        <h4 className="font-semibold text-white">
                          {pitch.mentor?.name || "Anonymous"}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {pitch.mentor?.title || "Mentor"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        ₹{pitch.price?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(pitch.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {pitch.note && (
                    <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-200 text-sm">{pitch.note}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        project.closingPrice
                          ? showToast(
                              "Closing price already set — you cannot accept another price",
                              "error"
                            )
                          : onSetClosingPriceFromPitch(
                              pitch.price,
                              pitch.mentor?._id
                            )
                      }
                      disabled={project.closingPrice}
                      className={`flex-1 flex items-center justify-center space-x-2 ${
                        project.closingPrice
                          ? "bg-gray-600 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      } px-3 py-2 rounded-lg font-medium transition-all text-sm`}
                    >
                      <DollarSign size={14} />
                      <span>
                        {project.closingPrice
                          ? "Price Already Set"
                          : "Accept This Price"}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        onViewMentorProfile(
                          pitch.mentor?._id || pitch.mentor?.userId
                        )
                      }
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <UserCheck size={14} />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPitchesModal;
