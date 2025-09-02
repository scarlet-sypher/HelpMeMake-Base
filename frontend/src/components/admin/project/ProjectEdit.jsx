import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectEdit = ({ onReturn }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    techStack: [],
    category: "",
    difficultyLevel: "",
    duration: "",
    status: "",
    tags: [],
    projectOutcome: "",
    motivation: "",
    prerequisites: [],
    knowledgeLevel: "",
    openingPrice: "",
    negotiatedPrice: "",
    closingPrice: "",
    currency: "INR",
    references: [],
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI/Machine Learning",
    "Data Science",
    "DevOps",
    "Blockchain",
    "IoT",
    "Game Development",
    "Desktop Applications",
    "API Development",
    "Database Design",
    "UI/UX Design",
    "Cybersecurity",
    "Cloud Computing",
    "Other",
  ];

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
  const statusOptions = ["Open", "In Progress", "Completed", "Cancelled"];
  const knowledgeLevels = [
    "Complete Beginner",
    "Some Knowledge",
    "Good Understanding",
    "Advanced Knowledge",
  ];
  const referenceTypes = [
    "Documentation",
    "Tutorial",
    "GitHub Repo",
    "Article",
    "Video",
    "Book",
    "Other",
  ];

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
      const projectData = data.data;

      setFormData({
        name: projectData.name || "",
        shortDescription: projectData.shortDescription || "",
        fullDescription: projectData.fullDescription || "",
        techStack: projectData.techStack || [],
        category: projectData.category || "",
        difficultyLevel: projectData.difficultyLevel || "",
        duration: projectData.duration || "",
        status: projectData.status || "",
        tags: projectData.tags || [],
        projectOutcome: projectData.projectOutcome || "",
        motivation: projectData.motivation || "",
        prerequisites: projectData.prerequisites || [],
        knowledgeLevel: projectData.knowledgeLevel || "",
        openingPrice: projectData.openingPrice || "",
        negotiatedPrice: projectData.negotiatedPrice || "",
        closingPrice: projectData.closingPrice || "",
        currency: projectData.currency || "INR",
        references: projectData.references || [],
      });

      setProject(projectData);
      setThumbnailPreview(projectData.thumbnail);
    } catch (error) {
      console.error("Fetch project error:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.fullDescription.trim())
      newErrors.fullDescription = "Full description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.difficultyLevel)
      newErrors.difficultyLevel = "Difficulty level is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.projectOutcome.trim())
      newErrors.projectOutcome = "Project outcome is required";
    if (!formData.motivation.trim())
      newErrors.motivation = "Motivation is required";
    if (!formData.knowledgeLevel)
      newErrors.knowledgeLevel = "Knowledge level is required";
    if (!formData.openingPrice || formData.openingPrice < 0)
      newErrors.openingPrice = "Valid opening price is required";

    if (formData.name.length > 200)
      newErrors.name = "Project name must be less than 200 characters";
    if (formData.shortDescription.length > 300)
      newErrors.shortDescription =
        "Short description must be less than 300 characters";
    if (formData.fullDescription.length > 5000)
      newErrors.fullDescription =
        "Full description must be less than 5000 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayInput = (name, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [name]: array }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setThumbnailFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { title: "", url: "", type: "Other" }],
    }));
  };

  const updateReference = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      ),
    }));
  };

  const removeReference = (index) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          if (key === "references") {
            submitData.append(key, JSON.stringify(formData[key]));
          } else {
            submitData.append(key, formData[key].join(","));
          }
        } else {
          submitData.append(key, formData[key]);
        }
      });

      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      toast.success("Project updated successfully!");

      if (onReturn) {
        onReturn();
      } else {
        navigate("/admin/projects");
      }
    } catch (error) {
      console.error("Update project error:", error);
      toast.error(error.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-white">Edit Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Participants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
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
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.shortDescription
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Brief description of the project (max 300 characters)"
                />
                <div className="flex justify-between mt-1">
                  {errors.shortDescription ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.shortDescription}
                    </p>
                  ) : (
                    <div />
                  )}
                  <span className="text-sm text-gray-500">
                    {formData.shortDescription.length}/300
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  rows={8}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fullDescription
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Detailed description of the project (max 5000 characters)"
                />
                <div className="flex justify-between mt-1">
                  {errors.fullDescription ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.fullDescription}
                    </p>
                  ) : (
                    <div />
                  )}
                  <span className="text-sm text-gray-500">
                    {formData.fullDescription.length}/5000
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  {thumbnailPreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg cursor-pointer transition-colors"
                    >
                      <Upload size={20} className="mr-2" />
                      Choose New Thumbnail
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: JPEG, PNG, WebP. Max size: 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.difficultyLevel
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select difficulty level</option>
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.difficultyLevel && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.difficultyLevel}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.duration ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., 2 weeks, 1 month"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.duration}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Knowledge Level *
                </label>
                <select
                  name="knowledgeLevel"
                  value={formData.knowledgeLevel}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.knowledgeLevel ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select knowledge level</option>
                  {knowledgeLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.knowledgeLevel && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.knowledgeLevel}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technology Stack
              </label>
              <input
                type="text"
                value={formData.techStack.join(", ")}
                onChange={(e) => handleArrayInput("techStack", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter technologies separated by commas (e.g., React, Node.js, MongoDB)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple technologies with commas
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayInput("tags", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tags separated by commas (e.g., frontend, backend, database)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <input
                type="text"
                value={formData.prerequisites.join(", ")}
                onChange={(e) =>
                  handleArrayInput("prerequisites", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter prerequisites separated by commas"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple prerequisites with commas
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pricing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Price *
                </label>
                <input
                  type="number"
                  name="openingPrice"
                  value={formData.openingPrice}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.openingPrice ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter opening price"
                />
                {errors.openingPrice && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.openingPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negotiated Price
                </label>
                <input
                  type="number"
                  name="negotiatedPrice"
                  value={formData.negotiatedPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter negotiated price (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final/Closing Price
                </label>
                <input
                  type="number"
                  name="closingPrice"
                  value={formData.closingPrice}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter final price (optional)"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Project Goals & Context
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Project Outcome *
                </label>
                <textarea
                  name="projectOutcome"
                  value={formData.projectOutcome}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.projectOutcome ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe what the learner will achieve by completing this project"
                />
                {errors.projectOutcome && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.projectOutcome}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Motivation *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.motivation ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Explain why this project is important and what motivated its creation"
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.motivation}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                References & Resources
              </h2>
              <button
                type="button"
                onClick={addReference}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Reference</span>
              </button>
            </div>

            {formData.references.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No references added yet. Click "Add Reference" to add resources.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.references.map((reference, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-gray-900">
                        Reference {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeReference(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={reference.title}
                          onChange={(e) =>
                            updateReference(index, "title", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Reference title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={reference.url}
                          onChange={(e) =>
                            updateReference(index, "url", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={reference.type}
                          onChange={(e) =>
                            updateReference(index, "type", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {referenceTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onReturn || (() => navigate("/admin/projects"))}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;
