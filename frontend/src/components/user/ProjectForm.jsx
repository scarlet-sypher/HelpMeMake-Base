import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
  Target,
  Image,
  Sparkles,
  Info,
} from "lucide-react";

// Import modular components
import BasicInformation from "./projectForm/BasicInformation";
import TechnicalDetails from "./projectForm/TechnicalDetails";
import ProjectDetails from "./projectForm/ProjectDetails";
import Prerequisites from "./projectForm/Prerequisites";
import References from "./projectForm/References";
import Pricing from "./projectForm/Pricing";
import AIHelper from "./projectForm/AIHelper";

const ProjectForm = ({
  mode = "create",
  initialData = null,
  onSubmit,
  onCancel,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    techStack: [],
    category: "",
    difficultyLevel: "",
    duration: "",
    status: "Open",
    thumbnail: "",
    tags: [],
    openingPrice: "",
    currency: "INR",
    projectOutcome: "",
    motivation: "",
    prerequisites: [],
    knowledgeLevel: "",
    references: [],
  });

  // Load project data for edit mode
  useEffect(() => {
    if (mode === "edit" && projectId) {
      loadProject();
    } else if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [mode, projectId, initialData]);

  const loadProject = async () => {
    setLoadingProject(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/projects/${projectId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data.success) {
        const project = response.data.project;
        setFormData({
          name: project.name || "",
          shortDescription: project.shortDescription || "",
          fullDescription: project.fullDescription || "",
          techStack: project.techStack || [],
          category: project.category || "",
          difficultyLevel: project.difficultyLevel || "",
          duration: project.duration || "",
          status: "Open", // Always set to Open
          thumbnail: project.thumbnail || "",
          tags: project.tags || [],
          openingPrice: project.openingPrice || "",
          currency: project.currency || "INR",
          projectOutcome: project.projectOutcome || "",
          motivation: project.motivation || "",
          prerequisites: project.prerequisites || [],
          knowledgeLevel: project.knowledgeLevel || "",
          references: project.references || [],
        });
      }
    } catch (error) {
      showToast({ message: "Failed to load project data", status: "error" });
      console.error("Error loading project:", error);
    } finally {
      setLoadingProject(false);
    }
  };

  const showToast = ({ message, status = "success" }) => {
    setToast({ message, status });
    setTimeout(() => setToast(null), 4000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "Full description is required";
    if (formData.techStack.length === 0)
      newErrors.techStack = "At least one technology is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.difficultyLevel)
      newErrors.difficultyLevel = "Difficulty level is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.openingPrice || formData.openingPrice <= 0)
      newErrors.openingPrice = "Valid price is required";
    if (!formData.projectOutcome.trim())
      newErrors.projectOutcome = "Project outcome is required";
    if (!formData.motivation.trim())
      newErrors.motivation = "Motivation is required";
    if (!formData.knowledgeLevel)
      newErrors.knowledgeLevel = "Knowledge level is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast({
        message: "Please fix the errors in the form",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        learnerId: user._id,
        openingPrice: parseFloat(formData.openingPrice),
        status: "Open", // Ensure status is always Open
      };

      let response;
      if (mode === "edit" && projectId) {
        const token = localStorage.getItem("access_token"); // Use consistent key
        response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/projects/${projectId}`,
          submitData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/projects/create`,
          submitData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
      }

      if (response.data.success) {
        showToast({
          message:
            mode === "edit"
              ? "Project updated successfully!"
              : "Project created successfully!",
          status: "success",
        });

        if (onSubmit) {
          onSubmit(response.data.project);
        } else {
          setTimeout(() => {
            navigate("/user/projects");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      showToast(
        error.response?.data?.message ||
          "Failed to save project. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center">
        <div className="text-white text-lg flex items-center">
          <Loader className="animate-spin mr-2" size={20} />
          Loading project data...
        </div>
      </div>
    );
  }

  const Toast = ({ toast, onClose }) => {
    if (!toast) return null;

    const getToastStyles = (status) => {
      switch (status) {
        case "success":
          return "bg-emerald-500/20 border-emerald-400/30 text-emerald-200";
        case "error":
          return "bg-red-500/20 border-red-400/30 text-red-200";
        case "info":
          return "bg-blue-500/20 border-blue-400/30 text-blue-200";
        default:
          return "bg-gray-500/20 border-gray-400/30 text-gray-200";
      }
    };

    const getIcon = (status) => {
      switch (status) {
        case "success":
          return <CheckCircle size={20} className="mr-2" />;
        case "error":
          return <AlertCircle size={20} className="mr-2" />;
        case "info":
          return <Info size={20} className="mr-2" />;
        default:
          return <AlertCircle size={20} className="mr-2" />;
      }
    };

    return (
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border ${getToastStyles(
          toast.status
        )} max-w-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            {getIcon(toast.status)}
            <span className="text-sm">{toast.message}</span>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-white/60 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Toast Notification */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center relative">
            <button
              onClick={handleCancel}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Target className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              {mode === "edit" ? "Edit Project" : "Create New Project"}
            </h1>
            <p className="text-blue-200 text-sm sm:text-base">
              {mode === "edit"
                ? "Update your project details"
                : "Share your project idea with our mentor community"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setShowPreview(!showPreview);
                setShowAIHelper(false);
              }}
              className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm border border-white/20"
            >
              {showPreview ? (
                <EyeOff size={20} className="mr-2" />
              ) : (
                <Eye size={20} className="mr-2" />
              )}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>

            <button
              onClick={() => {
                setShowAIHelper(!showAIHelper);
                setShowPreview(false);
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 ease-out backdrop-blur-sm border border-purple-400/30 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles size={20} className="mr-2 drop-shadow-sm" />
              {showAIHelper ? "Hide AI Helper" : "AI Helper"}
            </button>
          </div>

          <div
            className={`grid ${
              showAIHelper && !showPreview ? "lg:grid-cols-3" : "lg:grid-cols-1"
            } gap-8`}
          >
            {/* Main Content */}
            <div
              className={
                showAIHelper && !showPreview ? "lg:col-span-2" : "lg:col-span-1"
              }
            >
              {showPreview ? (
                /* Preview Mode */
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Project Preview
                    </h2>
                    <div className="bg-white/5 rounded-2xl p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {formData.name || "Project Name"}
                          </h3>
                          <p className="text-blue-200 mb-4">
                            {formData.shortDescription ||
                              "Short description will appear here..."}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {formData.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400">
                            ₹{formData.openingPrice || "0"}
                          </div>
                          <div className="text-sm text-white/70">
                            {formData.duration || "Duration"}
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail Preview */}
                      {formData.thumbnail && (
                        <div className="mb-4">
                          <img
                            src={formData.thumbnail}
                            alt="Project thumbnail"
                            className="w-full h-48 object-cover rounded-xl"
                            onError={(e) => {
                              e.target.src = `${
                                import.meta.env.VITE_API_URL
                              }/uploads/public/default-project.jpg`;
                            }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-sm text-white/70">Category</div>
                          <div className="text-white font-medium">
                            {formData.category || "Not selected"}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-sm text-white/70">
                            Difficulty
                          </div>
                          <div className="text-white font-medium">
                            {formData.difficultyLevel || "Not selected"}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <div className="text-sm text-white/70">Status</div>
                          <div className="text-emerald-400 font-medium">
                            ● Open
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">
                          Full Description
                        </h4>
                        <p className="text-blue-200 text-sm">
                          {formData.fullDescription ||
                            "Full description will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Form Mode */
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Basic Information */}
                  <BasicInformation
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    onToast={showToast}
                  />

                  {/* Technical Details */}
                  <TechnicalDetails
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    onToast={showToast}
                  />

                  {/* Project Details */}
                  <ProjectDetails
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    onToast={showToast}
                  />

                  {/* Prerequisites */}
                  <Prerequisites
                    formData={formData}
                    setFormData={setFormData}
                    onToast={showToast}
                  />

                  {/* References */}
                  <References
                    formData={formData}
                    setFormData={setFormData}
                    onToast={showToast}
                  />

                  {/* Pricing */}
                  <Pricing
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    onToast={showToast}
                  />

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all backdrop-blur-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <Loader className="animate-spin mr-2" size={20} />
                          {mode === "edit" ? "Updating..." : "Creating..."}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Save className="mr-2" size={20} />
                          {mode === "edit"
                            ? "Update Project"
                            : "Create Project"}
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* AI Helper Sidebar */}
            {showAIHelper && !showPreview && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-4">
                    <div className="flex items-center mb-3">
                      <Sparkles className="text-purple-400 mr-2" size={20} />
                      <h3 className="text-white font-semibold">AI Helper</h3>
                    </div>
                    <p className="text-blue-200 text-sm">
                      Generate images and descriptions using AI to enhance your
                      project
                    </p>
                  </div>
                  <AIHelper
                    formData={formData}
                    setFormData={setFormData}
                    onToast={showToast}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
