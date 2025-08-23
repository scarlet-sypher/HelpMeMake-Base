import React, { useState } from "react";
import {
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Users,
  Loader,
  Eye,
  EyeOff,
  X,
  Trophy,
  Award,
  Undo2,
  MessageSquare,
  Mail,
  Sparkles,
  Calendar,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import ReviewerBox from "./learnerMilestone/ReviewerBox";

const MilestoneList = ({
  milestones,
  markMilestoneAsDone,
  undoMilestone,
  removeMilestone,
  markReviewAsRead,
  saving,
}) => {
  const [viewingReview, setViewingReview] = useState(null);

  const getMilestoneStatus = (milestone) => {
    if (
      milestone.learnerVerification?.isVerified &&
      milestone.mentorVerification?.isVerified
    ) {
      return {
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-500",
        text: "Completed",
        icon: CheckCircle,
        textColor: "text-emerald-300",
        borderColor: "border-emerald-400/40",
      };
    } else if (milestone.learnerVerification?.isVerified) {
      return {
        color: "from-amber-500 to-orange-600",
        bgColor: "bg-amber-500",
        text: "Pending Review",
        icon: Clock,
        textColor: "text-amber-300",
        borderColor: "border-amber-400/40",
      };
    } else {
      return {
        color: "from-slate-600 to-slate-700",
        bgColor: "bg-slate-600",
        text: "Not Started",
        icon: AlertCircle,
        textColor: "text-slate-300",
        borderColor: "border-slate-400/40",
      };
    }
  };

  const isNextMilestoneVisible = (index) => {
    if (index === 0) return true;
    const previousMilestone = milestones[index - 1];
    return previousMilestone?.learnerVerification?.isVerified || false;
  };

  const getCompletionPercentage = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(
      (m) =>
        m.learnerVerification?.isVerified && m.mentorVerification?.isVerified
    ).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const hasUnreadReview = (milestone) => {
    return milestone.reviewNote && !milestone.reviewReadByLearner;
  };

  if (milestones.length === 0) {
    return null;
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-sm p-3 sm:p-4 lg:p-6 border-b border-white/10">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Target className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-white">
                  Your Milestones
                </h3>
                <p className="text-xs sm:text-sm text-blue-200/80">
                  Track your learning journey
                </p>
              </div>
            </div>
            <div className="flex sm:hidden items-center gap-2 self-start">
              <Sparkles className="text-purple-400" size={14} />
              <span className="text-xs text-purple-300 font-medium">
                {milestones.length} total
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} />
              <span className="text-sm text-purple-300 font-medium">
                {milestones.length} total
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
              <Loader className="text-blue-400 flex-shrink-0" size={14} />
              <div className="flex-1 bg-white/10 rounded-full h-2 sm:h-2.5 lg:h-3 overflow-hidden border border-white/20">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0">
                <span className="font-bold text-white">
                  {completionPercentage}%
                </span>
                <span className="text-blue-300 hidden sm:inline">complete</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-emerald-400">
                {
                  milestones.filter(
                    (m) =>
                      m.learnerVerification?.isVerified &&
                      m.mentorVerification?.isVerified
                  ).length
                }
              </div>
              <div className="text-xs text-emerald-300/80">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-amber-400">
                {
                  milestones.filter(
                    (m) =>
                      m.learnerVerification?.isVerified &&
                      !m.mentorVerification?.isVerified
                  ).length
                }
              </div>
              <div className="text-xs text-amber-300/80">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-slate-400">
                {
                  milestones.filter((m) => !m.learnerVerification?.isVerified)
                    .length
                }
              </div>
              <div className="text-xs text-slate-300/80">Not Started</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="p-2 sm:p-3 lg:p-6 space-y-3 sm:space-y-4">
        {milestones.map((milestone, index) => {
          const status = getMilestoneStatus(milestone);
          const isVisible = isNextMilestoneVisible(index);
          const StatusIcon = status.icon;
          const unreadReview = hasUnreadReview(milestone);

          return (
            <div
              key={milestone._id}
              className={`group relative bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-lg rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                isVisible
                  ? "opacity-100 border-white/20 hover:border-white/30"
                  : "opacity-50 border-white/10"
              } ${
                unreadReview
                  ? "ring-1 sm:ring-2 ring-orange-400/30 shadow-lg shadow-orange-400/10"
                  : ""
              }`}
            >
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                <div className="p-3 space-y-3">
                  {/* Mobile Header with Number Badge */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${status.color} rounded-lg shadow-lg border border-white/20 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110`}
                    >
                      <span className="text-white font-bold text-xs">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {milestone.title}
                      </h4>
                    </div>
                  </div>

                  {/* Mobile Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border bg-gradient-to-r ${status.color}/10 ${status.borderColor} backdrop-blur-sm`}
                    >
                      <StatusIcon size={10} className={status.textColor} />
                      <span
                        className={`text-xs font-semibold ${status.textColor}`}
                      >
                        {status.text}
                      </span>
                    </div>

                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                        isVisible
                          ? "bg-green-500/10 border border-green-400/20"
                          : "bg-gray-500/10 border border-gray-400/20"
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <Eye size={8} className="text-green-400" />
                          <span className="text-xs text-green-300 font-medium">
                            Unlocked
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={8} className="text-gray-400" />
                          <span className="text-xs text-gray-300 font-medium">
                            Locked
                          </span>
                        </>
                      )}
                    </div>

                    {unreadReview && (
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-500/15 to-red-500/15 px-2.5 py-1 rounded-full border border-orange-400/30 animate-pulse">
                        <div className="w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
                        <Mail size={8} className="text-orange-300" />
                        <span className="text-xs text-orange-300 font-semibold">
                          New
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mobile Verification Status */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          milestone.learnerVerification?.isVerified
                            ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                            : "bg-gray-600"
                        }`}
                      ></div>
                      <User
                        size={10}
                        className={
                          milestone.learnerVerification?.isVerified
                            ? "text-blue-300"
                            : "text-gray-500"
                        }
                      />
                      <span className="text-xs font-medium text-gray-300">
                        You
                      </span>
                      {milestone.learnerVerification?.isVerified && (
                        <CheckCircle size={10} className="text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          milestone.mentorVerification?.isVerified
                            ? "bg-purple-400 shadow-lg shadow-purple-400/50"
                            : "bg-gray-600"
                        }`}
                      ></div>
                      <Users
                        size={10}
                        className={
                          milestone.mentorVerification?.isVerified
                            ? "text-purple-300"
                            : "text-gray-500"
                        }
                      />
                      <span className="text-xs font-medium text-gray-300">
                        Mentor
                      </span>
                      {milestone.mentorVerification?.isVerified && (
                        <CheckCircle size={10} className="text-purple-400" />
                      )}
                    </div>
                  </div>

                  {/* Mobile Review Section */}
                  {milestone.reviewNote && (
                    <div
                      className={`relative p-3 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                        unreadReview
                          ? "bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-400/30 shadow-lg shadow-orange-400/10"
                          : "bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-purple-400/20"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div
                          className={`p-1 rounded-lg ${
                            unreadReview
                              ? "bg-orange-500/20"
                              : "bg-purple-500/20"
                          }`}
                        >
                          <MessageSquare
                            className={
                              unreadReview
                                ? "text-orange-400"
                                : "text-purple-400"
                            }
                            size={12}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-xs mb-1 flex items-center space-x-1 ${
                              unreadReview
                                ? "text-orange-300"
                                : "text-purple-300"
                            }`}
                          >
                            <span>Mentor Review</span>
                            {unreadReview && (
                              <>
                                <Zap size={10} className="text-orange-400" />
                                <span className="text-orange-400">(New!)</span>
                              </>
                            )}
                          </p>
                          <p className="text-white/90 text-xs line-clamp-2 mb-2">
                            {milestone.reviewNote.length > 80
                              ? `${milestone.reviewNote.substring(0, 80)}...`
                              : milestone.reviewNote}
                          </p>
                          <button
                            onClick={() => setViewingReview(milestone)}
                            className={`text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 ${
                              unreadReview
                                ? "text-orange-400 hover:text-orange-300"
                                : "text-purple-400 hover:text-purple-300"
                            }`}
                          >
                            <span>Read full message</span>
                            <ChevronRight size={8} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile Action Buttons */}
                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    {isVisible &&
                      !milestone.learnerVerification?.isVerified && (
                        <button
                          onClick={() => markMilestoneAsDone(milestone._id)}
                          disabled={saving}
                          className="px-3 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
             hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
             disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
             text-white rounded-lg font-semibold transition-all duration-300 
             transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 
             flex items-center space-x-1.5 border border-indigo-400/30"
                        >
                          {saving ? (
                            <Loader size={12} className="animate-spin" />
                          ) : (
                            <CheckCircle size={12} />
                          )}
                          <span className="text-xs">Mark Complete</span>
                        </button>
                      )}

                    {milestone.learnerVerification?.isVerified &&
                      !milestone.mentorVerification?.isVerified && (
                        <button
                          onClick={() => undoMilestone(milestone._id)}
                          disabled={saving}
                          className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-1.5 shadow-sm hover:shadow-md border border-amber-500/30"
                        >
                          {saving ? (
                            <Loader size={12} className="animate-spin" />
                          ) : (
                            <Undo2 size={12} />
                          )}
                          <span className="text-xs">Undo</span>
                        </button>
                      )}

                    {!milestone.learnerVerification?.isVerified &&
                      !milestone.mentorVerification?.isVerified && (
                        <button
                          onClick={() => removeMilestone(milestone._id)}
                          disabled={saving}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50 text-red-400 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center backdrop-blur-sm"
                          title="Remove milestone"
                        >
                          <X size={14} />
                        </button>
                      )}

                    {milestone.reviewNote && (
                      <button
                        onClick={() => setViewingReview(milestone)}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-1.5 border ${
                          unreadReview
                            ? "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white border-orange-400/20 shadow-lg shadow-orange-500/20 animate-pulse"
                            : "bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:via-blue-500/25 hover:to-indigo-500/25 border-purple-400/30 text-purple-300 backdrop-blur-sm"
                        }`}
                      >
                        <MessageSquare size={12} />
                        <span className="text-xs">
                          {unreadReview ? "New!" : "Review"}
                        </span>
                        {unreadReview && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                {/* Milestone Number Badge - Fixed positioning for desktop */}
                <div className="absolute -left-2 lg:-left-3 top-4 lg:top-6 z-10">
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${status.color} rounded-xl shadow-lg border-2 border-white/20 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110`}
                  >
                    <span className="text-white font-bold text-xs lg:text-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <div className="pl-6 lg:pl-8 pr-3 lg:pr-4 py-4 lg:py-5">
                  <div className="flex flex-col space-y-3 lg:space-y-4">
                    {/* Desktop Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-2 lg:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {/* Status Badge */}
                          <div
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border bg-gradient-to-r ${status.color}/10 ${status.borderColor} backdrop-blur-sm`}
                          >
                            <StatusIcon
                              size={12}
                              className={status.textColor}
                            />
                            <span
                              className={`text-xs font-semibold ${status.textColor}`}
                            >
                              {status.text}
                            </span>
                          </div>

                          {/* Visibility Badge */}
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                              isVisible
                                ? "bg-green-500/10 border border-green-400/20"
                                : "bg-gray-500/10 border border-gray-400/20"
                            }`}
                          >
                            {isVisible ? (
                              <>
                                <Eye size={10} className="text-green-400" />
                                <span className="text-xs text-green-300 font-medium">
                                  Unlocked
                                </span>
                              </>
                            ) : (
                              <>
                                <EyeOff size={10} className="text-gray-400" />
                                <span className="text-xs text-gray-300 font-medium">
                                  Locked
                                </span>
                              </>
                            )}
                          </div>

                          {/* Unread Review Notification */}
                          {unreadReview && (
                            <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-500/15 to-red-500/15 px-3 py-1.5 rounded-full border border-orange-400/30 animate-pulse">
                              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping"></div>
                              <Mail size={10} className="text-orange-300" />
                              <span className="text-xs text-orange-300 font-semibold">
                                New Message
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Milestone Title */}
                        <h4 className="text-base lg:text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {milestone.title}
                        </h4>

                        {/* Verification Status */}
                        <div className="flex items-center space-x-6 mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                milestone.learnerVerification?.isVerified
                                  ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                                  : "bg-gray-600"
                              }`}
                            ></div>
                            <User
                              size={12}
                              className={
                                milestone.learnerVerification?.isVerified
                                  ? "text-blue-300"
                                  : "text-gray-500"
                              }
                            />
                            <span className="text-xs font-medium text-gray-300">
                              Learner
                            </span>
                            {milestone.learnerVerification?.isVerified && (
                              <CheckCircle
                                size={12}
                                className="text-blue-400"
                              />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                milestone.mentorVerification?.isVerified
                                  ? "bg-purple-400 shadow-lg shadow-purple-400/50"
                                  : "bg-gray-600"
                              }`}
                            ></div>
                            <Users
                              size={12}
                              className={
                                milestone.mentorVerification?.isVerified
                                  ? "text-purple-300"
                                  : "text-gray-500"
                              }
                            />
                            <span className="text-xs font-medium text-gray-300">
                              Mentor
                            </span>
                            {milestone.mentorVerification?.isVerified && (
                              <CheckCircle
                                size={12}
                                className="text-purple-400"
                              />
                            )}
                          </div>
                        </div>

                        {/* Review Message Preview */}
                        {milestone.reviewNote && (
                          <div
                            className={`relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${
                              unreadReview
                                ? "bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-400/30 shadow-lg shadow-orange-400/10"
                                : "bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-purple-400/20"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-1.5 rounded-lg ${
                                  unreadReview
                                    ? "bg-orange-500/20"
                                    : "bg-purple-500/20"
                                }`}
                              >
                                <MessageSquare
                                  className={
                                    unreadReview
                                      ? "text-orange-400"
                                      : "text-purple-400"
                                  }
                                  size={14}
                                />
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`font-semibold text-sm mb-1 flex items-center space-x-1 ${
                                    unreadReview
                                      ? "text-orange-300"
                                      : "text-purple-300"
                                  }`}
                                >
                                  <span>Mentor Review</span>
                                  {unreadReview && (
                                    <>
                                      <Zap
                                        size={12}
                                        className="text-orange-400"
                                      />
                                      <span className="text-orange-400">
                                        (New!)
                                      </span>
                                    </>
                                  )}
                                </p>
                                <p className="text-white/90 text-sm line-clamp-2 mb-2">
                                  {milestone.reviewNote.length > 100
                                    ? `${milestone.reviewNote.substring(
                                        0,
                                        100
                                      )}...`
                                    : milestone.reviewNote}
                                </p>
                                <button
                                  onClick={() => setViewingReview(milestone)}
                                  className={`text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-1 ${
                                    unreadReview
                                      ? "text-orange-400 hover:text-orange-300"
                                      : "text-purple-400 hover:text-purple-300"
                                  }`}
                                >
                                  <span>
                                    {milestone.reviewNote.length > 100
                                      ? "Read full message"
                                      : "View message"}
                                  </span>
                                  <ChevronRight size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="flex items-center flex-wrap gap-2 pt-2">
                      {isVisible &&
                        !milestone.learnerVerification?.isVerified && (
                          <button
                            onClick={() => markMilestoneAsDone(milestone._id)}
                            disabled={saving}
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
             hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
             disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
             text-white rounded-xl font-semibold transition-all duration-300 
             transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 
             flex items-center space-x-2 border border-blue-400/30"
                          >
                            {saving ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            <span className="text-sm">Mark Complete</span>
                          </button>
                        )}

                      {milestone.learnerVerification?.isVerified &&
                        !milestone.mentorVerification?.isVerified && (
                          <button
                            onClick={() => undoMilestone(milestone._id)}
                            disabled={saving}
                            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 flex items-center space-x-2 border border-amber-400/20"
                          >
                            {saving ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Undo2 size={14} />
                            )}
                            <span className="text-sm">Undo</span>
                          </button>
                        )}

                      {!milestone.learnerVerification?.isVerified &&
                        !milestone.mentorVerification?.isVerified && (
                          <button
                            onClick={() => removeMilestone(milestone._id)}
                            disabled={saving}
                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 hover:border-red-400/50 text-red-400 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center min-w-[44px] min-h-[44px] backdrop-blur-sm"
                            title="Remove milestone"
                          >
                            <X size={16} />
                          </button>
                        )}

                      {/* View Review Button */}
                      {milestone.reviewNote && (
                        <button
                          onClick={() => setViewingReview(milestone)}
                          className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border ${
                            unreadReview
                              ? "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white border-orange-400/20 shadow-lg shadow-orange-500/20 animate-pulse"
                              : "bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-indigo-500/15 hover:from-purple-500/25 hover:via-blue-500/25 hover:to-indigo-500/25 border-purple-400/30 text-purple-300 backdrop-blur-sm"
                          }`}
                        >
                          <MessageSquare size={14} />
                          <span className="text-sm">
                            {unreadReview ? "New Message!" : "View Review"}
                          </span>
                          {unreadReview && (
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Celebration */}
      {completionPercentage === 100 && (
        <div className="p-4 sm:p-6 border-t border-white/10">
          <div className="bg-gradient-to-r from-yellow-500/15 via-orange-500/15 to-amber-500/15 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-400/30 shadow-lg shadow-yellow-400/10">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <Trophy className="text-yellow-400" size={24} />
                <Star className="text-amber-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text mb-1">
                  🎉 Outstanding Achievement! 🎉
                </h3>
                <p className="text-yellow-300/90 text-sm sm:text-base">
                  All milestones completed! You've mastered this journey.
                </p>
              </div>
              <Award className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {viewingReview && (
        <ReviewerBox
          milestone={viewingReview}
          onClose={() => setViewingReview(null)}
          onMarkAsRead={markReviewAsRead}
          saving={saving}
          isMentor={false}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default MilestoneList;
