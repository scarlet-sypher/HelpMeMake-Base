import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  GraduationCap,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
  Activity,
  Star,
  MessageSquare,
  TrendingUp,
  Eye,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectView = ({ onReturn, onEdit, onDelete }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }

      const data = await response.json();
      setProject(data.data);
    } catch (error) {
      console.error("Fetch project error:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const expectedText = `I want to delete ${project.name}`;
    if (deleteConfirmation !== expectedText) {
      toast.error("Please type the exact confirmation text");
      return;
    }

    setIsDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      toast.success("Project deleted successfully");
      setShowDeleteModal(false);

      // Navigate back to dashboard or call onReturn
      if (onReturn) {
        onReturn();
      } else {
        navigate("/admin/projects");
      }
    } catch (error) {
      console.error("Delete project error:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Project not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={onReturn || (() => navigate("/admin/projects"))}
                className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
              >
                <ArrowLeft size={24} />
                <span className="text-lg font-medium">Back to Projects</span>
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onEdit && onEdit(project)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Edit size={20} />
                <span>Edit Project</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Trash2 size={20} />
                <span>Delete Project</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  {/* Project Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Tag className="text-white" size={32} />
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {project.name}
                      </h1>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                      {project.shortDescription}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>ID: {project.projectId}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Created: {formatDate(project.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity size={16} />
                        <span>Views: {project.viewCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="mr-2" />
                  Project Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Category
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {project.category}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Difficulty Level
                      </label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                          project.difficultyLevel
                        )}`}
                      >
                        {project.difficultyLevel}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Duration
                      </label>
                      <p className="text-lg font-semibold text-gray-900 flex items-center">
                        <Clock className="mr-2" size={16} />
                        {project.duration}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Knowledge Level Required
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {project.knowledgeLevel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Opening Price
                      </label>
                      <p className="text-lg font-semibold text-green-600 flex items-center">
                        <IndianRupee className="mr-1" size={16} />
                        {formatCurrency(project.openingPrice)}
                      </p>
                    </div>
                    {project.negotiatedPrice && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Negotiated Price
                        </label>
                        <p className="text-lg font-semibold text-blue-600 flex items-center">
                          <IndianRupee className="mr-1" size={16} />
                          {formatCurrency(project.negotiatedPrice)}
                        </p>
                      </div>
                    )}
                    {project.closingPrice && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Final Price
                        </label>
                        <p className="text-lg font-semibold text-purple-600 flex items-center">
                          <IndianRupee className="mr-1" size={16} />
                          {formatCurrency(project.closingPrice)}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Currency
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {project.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-500 mb-3">
                    Full Description
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {project.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Project Outcome & Motivation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      Expected Outcome
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">
                        {project.projectOutcome}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      Motivation
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">
                        {project.motivation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      Technology Stack
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prerequisites */}
                {project.prerequisites && project.prerequisites.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-3">
                      Prerequisites
                    </label>
                    <ul className="space-y-2">
                      {project.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle
                            className="text-green-500 flex-shrink-0 mt-0.5"
                            size={16}
                          />
                          <span className="text-gray-800">{prerequisite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* References */}
              {project.references && project.references.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ExternalLink className="mr-2" />
                    References & Resources
                  </h2>
                  <div className="space-y-4">
                    {project.references.map((reference, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {reference.title}
                            </h3>
                            <p className="text-sm text-blue-600 hover:text-blue-800 break-all">
                              {reference.url}
                            </p>
                          </div>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium ml-4 flex-shrink-0">
                            {reference.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - People & Timeline */}
            <div className="space-y-8">
              {/* Learner & Mentor */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Project Participants
                </h2>

                {/* Learner */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <GraduationCap className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Learner
                    </h3>
                  </div>
                  {project.learner ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={project.learner.avatar}
                        alt={project.learner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.learner.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {project.learner.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No learner assigned</p>
                  )}
                </div>

                {/* Mentor */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="text-purple-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Mentor
                    </h3>
                  </div>
                  {project.mentor ? (
                    <div className="flex items-center space-x-3">
                      <img
                        src={project.mentor.avatar}
                        alt={project.mentor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {project.mentor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {project.mentor.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">No mentor assigned</p>
                  )}
                </div>
              </div>

              {/* Project Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="mr-2" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Created
                    </label>
                    <p className="text-gray-900">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  {project.startDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Started
                      </label>
                      <p className="text-gray-900">
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                  )}
                  {project.expectedEndDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Expected End
                      </label>
                      <p className="text-gray-900">
                        {formatDate(project.expectedEndDate)}
                      </p>
                    </div>
                  )}
                  {project.actualEndDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Actual End
                      </label>
                      <p className="text-gray-900">
                        {formatDate(project.actualEndDate)}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="mr-2" />
                  Statistics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Milestones</span>
                    <span className="font-semibold">
                      {project.completedMilestones}/{project.totalMilestones}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold">
                      {project.progressPercentage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Applications</span>
                    <span className="font-semibold">
                      {project.applicationsCount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pitches</span>
                    <span className="font-semibold">
                      {project.pitches?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-semibold">
                      {project.messages?.length || 0}
                    </span>
                  </div>
                  {project.learnerReview?.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Learner Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={16} />
                        <span className="font-semibold">
                          {project.learnerReview.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                  {project.mentorReview?.rating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mentor Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400" size={16} />
                        <span className="font-semibold">
                          {project.mentorReview.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Delete Project
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                This action cannot be undone. This will permanently delete the
                project <span className="font-semibold">"{project.name}"</span>{" "}
                and all associated data including milestones, messages, and
                progress history.
              </p>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type the following text to confirm deletion:
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <code className="text-red-600 font-mono text-sm break-all">
                    I want to delete {project.name}
                  </code>
                </div>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Type the confirmation text here..."
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={
                  deleteConfirmation !== `I want to delete ${project.name}` ||
                  isDeleting
                }
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectView;
