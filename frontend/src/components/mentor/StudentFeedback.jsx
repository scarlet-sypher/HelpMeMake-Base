import React, { useState, useEffect } from "react";
import { Star, MessageCircle, ThumbsUp, Calendar } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentFeedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [overallStats, setOverallStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStarPercentage: 0,
  });
  const [totalReviews, setTotalReviews] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        `${apiUrl}/api/goals/mentor/recent-reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const { reviews, overallStats, totalReviews, hasMoreReviews } =
          response.data.data;

        // Format the reviews data to match the expected structure
        const formattedReviews = reviews.map((review, index) => ({
          name: review.name,
          image: review.image?.startsWith("http")
            ? review.image
            : `${apiUrl}${review.image}`,
          rating: review.rating,
          comment: review.comment || "No comment provided",
          date: formatDate(review.date),
          isRecent: index < 2, // Mark first 2 as recent
          helpfulCount: Math.floor(Math.random() * 15) + 1, // Random helpful count for UI
          projectName: review.projectName,
          status: review.status,
        }));

        setFeedbackData(formattedReviews);
        setOverallStats(overallStats);
        setTotalReviews(totalReviews);
        setHasMoreReviews(hasMoreReviews);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      setError("Failed to load reviews");
      setFeedbackData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleViewAllReviews = () => {
    // Navigate to mentor goals page with reviews tab active
    navigate("/mentor/goals?tab=reviews");
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || feedbackData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Star className="mr-2 text-yellow-400" size={20} />
              Student Feedback
            </h2>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No reviews yet</div>
            <div className="text-gray-500 text-sm">
              Complete some projects to see student feedback here
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Star className="mr-2 text-yellow-400" size={20} />
            Student Feedback
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-yellow-300 font-medium">
              Live Reviews
            </span>
          </div>
        </div>

        {/* Overall Rating Summary */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-400/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {overallStats.averageRating}
                </div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(overallStats.averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-500"
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div>
                <div className="text-lg font-semibold text-white">
                  {overallStats.totalReviews}
                </div>
                <div className="text-sm text-yellow-300">Total Reviews</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-300">
                {overallStats.fiveStarPercentage}%
              </div>
              <div className="text-sm text-yellow-400">5-Star Reviews</div>
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="space-y-4">
          {feedbackData.map((feedback, index) => (
            <div
              key={index}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-start space-x-3">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={feedback.image}
                    alt={feedback.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg"
                    onError={(e) => {
                      e.target.src = "/uploads/public/default.jpg";
                    }}
                  />
                  {feedback.isRecent && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-white">
                        {feedback.name}
                      </h4>
                      {feedback.isRecent && (
                        <span className="px-2 py-0.5 bg-green-400/20 text-green-300 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {feedback.date}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < feedback.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-500"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-yellow-300 font-medium">
                      ({feedback.rating}/5)
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">
                    {feedback.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleViewAllReviews}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            View All Reviews {hasMoreReviews && `(${totalReviews - 4} more)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;
