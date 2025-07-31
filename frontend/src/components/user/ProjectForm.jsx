import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Save,
  X,
  Upload,
  Plus,
  Minus,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  ArrowLeft,
  Code,
  Target,
  DollarSign,
  Calendar,
  BookOpen,
  Tag,
  Image,
  FileText,
  Lightbulb,
  GraduationCap,
  Link,
  Trash2
} from 'lucide-react';

const ProjectForm = ({ mode = 'create', initialData = null, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    techStack: [],
    category: '',
    difficultyLevel: '',
    duration: '',
    status: 'Open',
    thumbnail: '',
    tags: [],
    openingPrice: '',
    currency: 'INR',
    projectOutcome: '',
    motivation: '',
    prerequisites: [],
    knowledgeLevel: '',
    references: []
  });

  // Additional form fields
  const [newTech, setNewTech] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPrereq, setNewPrereq] = useState('');
  const [newReference, setNewReference] = useState({ title: '', url: '', type: 'Documentation' });

  // Categories and options
  const categories = [
    'Web Development',
    'Mobile Development',
    'AI/Machine Learning',
    'Data Science',
    'DevOps',
    'Blockchain',
    'IoT',
    'Game Development',
    'Desktop Applications',
    'API Development',
    'Database Design',
    'UI/UX Design',
    'Cybersecurity',
    'Cloud Computing',
    'Other'
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const knowledgeLevels = ['Complete Beginner', 'Some Knowledge', 'Good Understanding', 'Advanced Knowledge'];
  const referenceTypes = ['Documentation', 'Tutorial', 'GitHub Repo', 'Article', 'Video', 'Book', 'Other'];
  const statusOptions = ['Open', 'In Progress', 'Completed', 'Cancelled'];

  // Load project data for edit mode
  useEffect(() => {
    if (mode === 'edit' && projectId) {
      loadProject();
    } else if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [mode, projectId, initialData]);

  const loadProject = async () => {
    setLoadingProject(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
  withCredentials: true,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add this line
  }
});
      
      if (response.data.success) {
        const project = response.data.project;
        setFormData({
          name: project.name || '',
          shortDescription: project.shortDescription || '',
          fullDescription: project.fullDescription || '',
          techStack: project.techStack || [],
          category: project.category || '',
          difficultyLevel: project.difficultyLevel || '',
          duration: project.duration || '',
          status: project.status || 'Open',
          thumbnail: project.thumbnail || '',
          tags: project.tags || [],
          openingPrice: project.openingPrice || '',
          currency: project.currency || 'INR',
          projectOutcome: project.projectOutcome || '',
          motivation: project.motivation || '',
          prerequisites: project.prerequisites || [],
          knowledgeLevel: project.knowledgeLevel || '',
          references: project.references || []
        });
      }
    } catch (error) {
      showToast('Failed to load project data', 'error');
      console.error('Error loading project:', error);
    } finally {
      setLoadingProject(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (formData.techStack.length === 0) newErrors.techStack = 'At least one technology is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.difficultyLevel) newErrors.difficultyLevel = 'Difficulty level is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.openingPrice || formData.openingPrice <= 0) newErrors.openingPrice = 'Valid price is required';
    if (!formData.projectOutcome.trim()) newErrors.projectOutcome = 'Project outcome is required';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required';
    if (!formData.knowledgeLevel) newErrors.knowledgeLevel = 'Knowledge level is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        learnerId: user._id, // Send user ID silently
        openingPrice: parseFloat(formData.openingPrice)
      };

      let response;
      if (mode === 'edit' && projectId) {
        response = await axios.patch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, submitData, {
          withCredentials: true
        });
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/create`, submitData, {
          withCredentials: true
        });
      }

      if (response.data.success) {
        showToast(
          mode === 'edit' ? 'Project updated successfully!' : 'Project created successfully!',
          'success'
        );
        
        if (onSubmit) {
          onSubmit(response.data.project);
        } else {
          // Redirect to projects dashboard after a short delay
          setTimeout(() => {
            navigate('/user/projects');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      showToast(
        error.response?.data?.message || 'Failed to save project. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for dynamic fields
  const addTech = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData({ ...formData, techStack: [...formData.techStack, newTech.trim()] });
      setNewTech('');
    }
  };

  const removeTech = (index) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim().toLowerCase()] });
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addPrereq = () => {
    if (newPrereq.trim() && !formData.prerequisites.includes(newPrereq.trim())) {
      setFormData({ ...formData, prerequisites: [...formData.prerequisites, newPrereq.trim()] });
      setNewPrereq('');
    }
  };

  const removePrereq = (index) => {
    setFormData({ ...formData, prerequisites: formData.prerequisites.filter((_, i) => i !== index) });
  };

  const addReference = () => {
    if (newReference.title.trim() && newReference.url.trim()) {
      setFormData({ ...formData, references: [...formData.references, { ...newReference }] });
      setNewReference({ title: '', url: '', type: 'Documentation' });
    }
  };

  const removeReference = (index) => {
    setFormData({ ...formData, references: formData.references.filter((_, i) => i !== index) });
  };

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg flex items-center">
          <Loader className="animate-spin mr-2" size={20} />
          Loading project data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border ${
          toast.type === 'success' 
            ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200' 
            : 'bg-red-500/20 border-red-400/30 text-red-200'
        }`}>
          <div className="flex items-center">
            {toast.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertCircle size={20} className="mr-2" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <button 
                onClick={() => onCancel ? onCancel() : navigate(-1)}
                className="absolute left-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <Target className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {mode === 'edit' ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-blue-200">
              {mode === 'edit' ? 'Update your project details' : 'Share your project idea with our mentor community'}
            </p>
          </div>

          {/* Toggle Preview */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm border border-white/20"
            >
              {showPreview ? <EyeOff size={20} className="mr-2" /> : <Eye size={20} className="mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {showPreview ? (
            /* Preview Mode */
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Project Preview</h2>
                <div className="bg-white/5 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{formData.name || 'Project Name'}</h3>
                      <p className="text-blue-200 mb-4">{formData.shortDescription || 'Short description will appear here...'}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.techStack.map((tech, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400">₹{formData.openingPrice || '0'}</div>
                      <div className="text-sm text-white/70">{formData.duration || 'Duration'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-white/70">Category</div>
                      <div className="text-white font-medium">{formData.category || 'Not selected'}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-white/70">Difficulty</div>
                      <div className="text-white font-medium">{formData.difficultyLevel || 'Not selected'}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-sm text-white/70">Status</div>
                      <div className="text-white font-medium">{formData.status}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Full Description</h4>
                    <p className="text-blue-200 text-sm">{formData.fullDescription || 'Full description will appear here...'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Mode */
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-white font-medium mb-2">Project Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                      placeholder="Enter your project name"
                      maxLength={200}
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-white font-medium mb-2">Short Description *</label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                      placeholder="Brief description of your project (300 characters max)"
                      rows={3}
                      maxLength={300}
                    />
                    <div className="text-right text-sm text-white/50 mt-1">
                      {formData.shortDescription.length}/300
                    </div>
                    {errors.shortDescription && <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                    >
                      <option value="" className="bg-slate-800">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty Level *</label>
                    <select
                      value={formData.difficultyLevel}
                      onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                    >
                      <option value="" className="bg-slate-800">Select Difficulty</option>
                      {difficultyLevels.map(level => (
                        <option key={level} value={level} className="bg-slate-800">{level}</option>
                      ))}
                    </select>
                    {errors.difficultyLevel && <p className="text-red-400 text-sm mt-1">{errors.difficultyLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Duration *</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                    {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-slate-800">{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                    <Code className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Technical Details</h2>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Tech Stack *</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.techStack.map((tech, index) => (
                      <span key={index} className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(index)}
                          className="ml-2 text-purple-300 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                      placeholder="Add technology"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {errors.techStack && <p className="text-red-400 text-sm mt-1">{errors.techStack}</p>}
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-2 text-blue-300 hover:text-red-400"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                      placeholder="Add tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Tag size={20} />
                    </button>
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-white font-medium mb-2">Project Thumbnail</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-4">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Project Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Description *</label>
                    <textarea
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                      placeholder="Detailed description of your project requirements, features, and expectations"
                      rows={6}
                      maxLength={5000}
                    />
                    <div className="text-right text-sm text-white/50 mt-1">
                      {formData.fullDescription.length}/5000
                    </div>
                    {errors.fullDescription && <p className="text-red-400 text-sm mt-1">{errors.fullDescription}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Project Outcome *</label>
                    <textarea
                      value={formData.projectOutcome}
                      onChange={(e) => setFormData({ ...formData, projectOutcome: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                      placeholder="What do you expect to achieve from this project?"
                      rows={3}
                      maxLength={1000}
                    />
                    {errors.projectOutcome && <p className="text-red-400 text-sm mt-1">{errors.projectOutcome}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Motivation *</label>
                    <textarea
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                      placeholder="Why do you want to build this project?"
                      rows={3}
                      maxLength={1000}
                    />
                    {errors.motivation && <p className="text-red-400 text-sm mt-1">{errors.motivation}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Your Knowledge Level *</label>
                    <select
                      value={formData.knowledgeLevel}
                      onChange={(e) => setFormData({ ...formData, knowledgeLevel: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    >
                      <option value="" className="bg-slate-800">Select your knowledge level</option>
                      {knowledgeLevels.map(level => (
                        <option key={level} value={level} className="bg-slate-800">{level}</option>
                      ))}
                    </select>
                    {errors.knowledgeLevel && <p className="text-red-400 text-sm mt-1">{errors.knowledgeLevel}</p>}
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
                    <GraduationCap className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Prerequisites & Requirements</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Prerequisites</label>
                  <div className="space-y-2 mb-4">
                    {formData.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-white">{prereq}</span>
                        <button
                          type="button"
                          onClick={() => removePrereq(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPrereq}
                      onChange={(e) => setNewPrereq(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrereq())}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                      placeholder="Add prerequisite (e.g., Basic JavaScript knowledge)"
                    />
                    <button
                      type="button"
                      onClick={addPrereq}
                      className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* References */}
                <div>
                  <label className="block text-white font-medium mb-2">References & Resources</label>
                  <div className="space-y-3 mb-4">
                    {formData.references.map((ref, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Link size={16} className="text-blue-400 mr-2" />
                              <span className="text-white font-medium">{ref.title}</span>
                              <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs">
                                {ref.type}
                              </span>
                            </div>
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-300 text-sm hover:underline break-all"
                            >
                              {ref.url}
                            </a>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeReference(index)}
                            className="ml-3 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newReference.title}
                      onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                      placeholder="Reference title"
                    />
                    <select
                      value={newReference.type}
                      onChange={(e) => setNewReference({ ...newReference, type: e.target.value })}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                    >
                      {referenceTypes.map(type => (
                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newReference.url}
                      onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                      placeholder="Reference URL"
                    />
                    <button
                      type="button"
                      onClick={addReference}
                      className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4">
                    <DollarSign className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Pricing Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Opening Price *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">₹</span>
                      <input
                        type="number"
                        value={formData.openingPrice}
                        onChange={(e) => setFormData({ ...formData, openingPrice: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                        placeholder="0"
                        min="0"
                        step="100"
                      />
                    </div>
                    {errors.openingPrice && <p className="text-red-400 text-sm mt-1">{errors.openingPrice}</p>}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                    >
                      <option value="INR" className="bg-slate-800">INR (₹)</option>
                      <option value="USD" className="bg-slate-800">USD ($)</option>
                      <option value="EUR" className="bg-slate-800">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
                  <div className="flex items-start">
                    <AlertCircle className="text-yellow-400 mr-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="text-yellow-200 font-medium mb-1">Pricing Guidelines</h4>
                      <p className="text-yellow-200/80 text-sm">
                        This is your starting price. Mentors can propose different amounts, and you can negotiate the final price before starting the project.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => onCancel ? onCancel() : navigate(-1)}
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
                      {mode === 'edit' ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="mr-2" size={20} />
                      {mode === 'edit' ? 'Update Project' : 'Create Project'}
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;