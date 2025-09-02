import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Star,
  MapPin,
  Calendar,
  Users,
  Award,
  Clock,
  Mail,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const MentorCard = ({ mentor, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/mentors/edit/${mentor.mentorProfile?._id || mentor._id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const expectedText = `I want to delete ${mentor.name}`;

    if (confirmationText !== expectedText) {
      toast.error("Confirmation text does not match");
      return;
    }

    setIsDeleting(true);

    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/mentors/${
          mentor.mentorProfile?._id || mentor._id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ confirmationText }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Mentor deleted successfully");
        onDelete(mentor.mentorProfile?._id || mentor._id);
        setShowDeleteModal(false);
      } else {
        toast.error(data.message || "Failed to delete mentor");
      }
    } catch (error) {
      console.error("Delete mentor error:", error);
      toast.error("Failed to delete mentor");
    } finally {
      setIsDeleting(false);
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

  const mentorData = mentor.mentorProfile || {};

  const defaultMentorAvatar = "/default-avatar.jpg";

  const getMentorAvatarUrl = () => {
    if (!mentor?.avatar) return defaultMentorAvatar;
    if (mentor.avatar.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${mentor.avatar}`;
    }
    return mentor.avatar;
  };

  return (
    <>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-all duration-300 border border-slate-700/50 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={getMentorAvatarUrl()}
            alt={mentor?.name || "Mentor Avatar"}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultMentorAvatar;
            }}
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {mentor.name || "No Name"}
            </h3>
            <p className="text-blue-400 text-sm flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {mentor.email}
            </p>
            <p className="text-slate-400 text-xs flex items-center mt-1">
              <User className="w-3 h-3 mr-1" />
              ID: {mentor._id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
            {mentor.role || "mentor"}
          </span>
          {mentorData.isOnline && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-500/30">
              Online
            </span>
          )}
          {mentorData.isAvailable && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-500/30">
              Available
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-white font-semibold">
            {mentorData.title || "Software Engineer"}
          </p>
          <p className="text-slate-300 text-sm flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-slate-400" />
            {mentorData.location || "Remote"}
          </p>
          <p className="text-slate-400 text-sm line-clamp-2">
            {mentorData.description ||
              "Passionate about helping others learn and grow"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center text-yellow-400 mb-1">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <p className="text-white font-bold">
              {mentorData.rating ? mentorData.rating.toFixed(1) : "0.0"}
            </p>
            <p className="text-xs text-slate-400">
              {mentorData.totalReviews || 0} reviews
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center text-green-400 mb-1">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Students</span>
            </div>
            <p className="text-white font-bold">
              {mentorData.totalStudents || 0}
            </p>
            <p className="text-xs text-slate-400">
              {mentorData.completedSessions || 0} sessions
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center text-purple-400 mb-1">
              <Award className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <p className="text-white font-bold">
              {mentorData.achievements || 0}
            </p>
            <p className="text-xs text-slate-400">
              {mentorData.profileCompleteness || 20}% complete
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center text-blue-400 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Response</span>
            </div>
            <p className="text-white font-bold">
              {mentorData.responseTime || 30}m
            </p>
            <p className="text-xs text-slate-400">avg time</p>
          </div>
        </div>

        <div className="flex items-center text-slate-400 text-sm mb-4">
          <Calendar className="w-4 h-4 mr-1" />
          Joined: {formatDate(mentor.createdAt)}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Delete Mentor</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-300 mb-4">
                This action cannot be undone. This will permanently delete the
                mentor account and all associated data.
              </p>
              <p className="text-red-400 font-medium mb-2">
                To confirm, type exactly:
              </p>
              <p className="text-white bg-slate-700 p-2 rounded text-sm font-mono">
                I want to delete {mentor.name}
              </p>
            </div>

            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type confirmation text..."
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 mb-4"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={
                  isDeleting ||
                  confirmationText !== `I want to delete ${mentor.name}`
                }
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorCard;
