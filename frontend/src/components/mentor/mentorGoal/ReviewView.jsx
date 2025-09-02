import React from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const ReviewView = ({ reviews, totals = {} }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < rating ? "text-yellow-400 fill-current" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyling = (status) => {
    switch (status) {
      case "Completed":
        return {
          bgColor: "bg-green-500/10 border-green-500/30",
          textColor: "text-green-400",
          icon: CheckCircle,
          label: "Completed",
        };
      case "Cancelled":
        return {
          bgColor: "bg-red-500/10 border-red-500/30",
          textColor: "text-red-400",
          icon: XCircle,
          label: "Cancelled",
        };
      default:
        return {
          bgColor: "bg-gray-500/10 border-gray-500/30",
          textColor: "text-gray-400",
          icon: AlertCircle,
          label: "Unknown",
        };
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-gray-600 rounded-2xl blur opacity-20"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <MessageSquare className="text-gray-400" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-400">
                Complete some projects with learners to see their reviews here
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Learner Reviews
                </h3>
                <p className="text-gray-300">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""} from
                  completed projects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-white/10">
            <h4 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Project Earnings Overview
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="text-green-400 font-medium text-sm">
                    Completed Projects
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  ₹{(totals.completed || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={18} className="text-red-400" />
                  <span className="text-red-400 font-medium text-sm">
                    Cancelled Projects
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  ₹{(totals.cancelled || 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    Total Earnings
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  ₹{(totals.all || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="bg-slate-700/30 rounded-xl p-4 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {renderStars(
                    Math.round(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                        reviews.length
                    )
                  )}
                  <span className="text-lg font-bold text-white">
                    {(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ₹
                    {reviews
                      .reduce(
                        (sum, review) => sum + (review.closingPrice || 0),
                        0
                      )
                      .toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    Total from All Reviews
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => {
          const statusStyling = getStatusStyling(review.status);
          const StatusIcon = statusStyling.icon;

          return (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-gray-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-300"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyling.bgColor} ${statusStyling.textColor}`}
                  >
                    <div className="flex items-center gap-1">
                      <StatusIcon size={12} />
                      {statusStyling.label}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-4 pr-24">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <img
                      src={
                        review.learner.avatar?.startsWith("http")
                          ? review.learner.avatar
                          : `${import.meta.env.VITE_API_URL}${
                              review.learner.avatar
                            }`
                      }
                      alt={review.learner.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-400/50 object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "/uploads/public/default.jpg";
                      }}
                    />
                    <div className="space-y-2 flex-1 min-w-0">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Learner
                        </div>
                        <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                          {review.learner.name}
                        </h4>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">
                          Project
                        </div>
                        <p className="text-sm text-gray-300 break-words">
                          {review.projectName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-white">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {review.requestInfo && (
                  <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-white/10">
                    <div className="text-xs text-gray-400 mb-1">
                      Project Status
                    </div>
                    <p className="text-sm text-gray-300 italic">
                      {review.requestInfo.message}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2">Review</div>
                  <p className="text-gray-200 leading-relaxed italic break-words text-sm">
                    {review.comment && review.comment.trim() !== ""
                      ? `"${review.comment}"`
                      : "📝 The learner chose not to leave a comment."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span className="text-xs">
                      {formatDate(review.reviewDate)}
                    </span>
                  </div>

                  {review.closingPrice > 0 && (
                    <div className="flex items-center space-x-1">
                      <DollarSign size={14} />
                      <span className="text-green-400 font-medium text-xs">
                        ₹{review.closingPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reviews.length > 1 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-50"></div>
          <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h4 className="font-bold text-blue-300 mb-3 text-sm sm:text-base">
              📊 Review Statistics
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {reviews.filter((r) => r.rating === 5).length}
                </div>
                <div className="text-xs text-gray-400">5-Star Reviews</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {reviews.filter((r) => r.rating >= 4).length}
                </div>
                <div className="text-xs text-gray-400">4+ Stars</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white">
                  ₹
                  {Math.round(
                    reviews.reduce((sum, r) => sum + (r.closingPrice || 0), 0) /
                      reviews.length
                  ).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Avg Project Value</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {Math.round(
                    (reviews.filter((r) => r.rating >= 4).length /
                      reviews.length) *
                      100
                  )}
                  %
                </div>
                <div className="text-xs text-gray-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewView;
