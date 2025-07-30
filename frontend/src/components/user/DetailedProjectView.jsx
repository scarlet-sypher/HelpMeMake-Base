import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Users, 
  Briefcase,
  Award,
  CheckCircle,
  XCircle,
  Send,
  Bot,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MessageCircle,
  TrendingUp,
  Zap,
  Target,
  Code,
  Database,
  Smartphone,
  Monitor,
  Cpu,
  Shield,
  Cloud,
  Gamepad2,
  Palette,
  Network,
  AlertCircle,
  Eye,
  ThumbsUp,
  User,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailedProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMentorSelection, setShowMentorSelection] = useState(false);
  const [proposedPrice, setProposedPrice] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Category icons mapping
  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': Monitor,
      'Mobile Development': Smartphone,
      'AI/Machine Learning': Bot,
      'Data Science': Database,
      'DevOps': Cloud,
      'Blockchain': Network,
      'IoT': Cpu,
      'Game Development': Gamepad2,
      'Desktop Applications': Monitor,
      'API Development': Code,
      'Database Design': Database,
      'UI/UX Design': Palette,
      'Cybersecurity': Shield,
      'Cloud Computing': Cloud,
      'Other': Code
    };
    return icons[category] || Code;
  };

  // Difficulty level colors
  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'from-green-500 to-emerald-500',
      'Intermediate': 'from-yellow-500 to-orange-500',
      'Advanced': 'from-red-500 to-pink-500'
    };
    return colors[level] || 'from-gray-500 to-slate-500';
  };

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      'Open': 'from-blue-500 to-cyan-500',
      'In Progress': 'from-purple-500 to-pink-500',
      'Completed': 'from-green-500 to-emerald-500',
      'Cancelled': 'from-gray-500 to-slate-500'
    };
    return colors[status] || 'from-gray-500 to-slate-500';
  };

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/projects/${id}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setProject(response.data.project);
        } else {
          toast.error('Failed to load project details');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Error loading project details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, API_URL]);

  // Fetch available mentors
  const fetchMentors = async () => {
    try {
      setMentorsLoading(true);
      const response = await axios.get(`${API_URL}/mentors/all`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setMentors(response.data.mentors);
      } else {
        toast.error('Failed to load mentors');
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Error loading mentors');
    } finally {
      setMentorsLoading(false);
    }
  };

  // Handle mentor selection view
  const handleShowMentorSelection = () => {
    setShowMentorSelection(true);
    if (mentors.length === 0) {
      fetchMentors();
    }
  };

  // Handle sending mentor request
  const handleSendMentorRequest = async (mentorId) => {
    if (!proposedPrice || !coverLetter || !estimatedDuration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSendingRequest(true);
      const response = await axios.post(`${API_URL}/projects/${id}/apply`, {
        mentorId,
        proposedPrice: parseFloat(proposedPrice),
        coverLetter,
        estimatedDuration
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Mentor request sent successfully!');
        setSelectedMentor(null);
        setProposedPrice('');
        setCoverLetter('');
        setEstimatedDuration('');
        // Refresh project data to show new application
        const updatedProject = await axios.get(`${API_URL}/projects/${id}`, {
          withCredentials: true
        });
        if (updatedProject.data.success) {
          setProject(updatedProject.data.project);
        }
      } else {
        toast.error(response.data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending mentor request:', error);
      toast.error('Error sending mentor request');
    } finally {
      setSendingRequest(false);
    }
  };

  // Handle AI mentor selection
  const handleAIMentorSelection = () => {
    toast.info('AI mentor selection coming soon!', {
      icon: <Bot className="text-blue-400" size={20} />
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format price
  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Not set';
    return `${currency} ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span>Loading project details...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-gray-300 mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(project.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="group flex items-center space-x-2 text-white hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Projects</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Eye size={16} />
                  <span>{project.viewCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{project.applicationsCount} applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column - Project Details */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Project Overview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                    <CategoryIcon className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    <p className="text-gray-300">{project.shortDescription}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className={`px-4 py-2 bg-gradient-to-r ${getStatusColor(project.status)} text-white rounded-xl text-sm font-semibold text-center`}>
                    {project.status}
                  </div>
                  <div className={`px-4 py-2 bg-gradient-to-r ${getDifficultyColor(project.difficultyLevel)} text-white rounded-xl text-sm font-semibold text-center`}>
                    {project.difficultyLevel}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                  <DollarSign className="mx-auto mb-2 text-green-400" size={24} />
                  <div className="text-lg font-bold text-white">{formatPrice(project.openingPrice, project.currency)}</div>
                  <div className="text-sm text-gray-300">Opening Price</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                  <Clock className="mx-auto mb-2 text-blue-400" size={24} />
                  <div className="text-lg font-bold text-white">{project.duration}</div>
                  <div className="text-sm text-gray-300">Duration</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
                  <TrendingUp className="mx-auto mb-2 text-purple-400" size={24} />
                  <div className="text-lg font-bold text-white">{project.progressPercentage}%</div>
                  <div className="text-sm text-gray-300">Progress</div>
                </div>
              </div>

              {/* Project Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <BookOpen className="mr-2 text-blue-400" size={20} />
                  Project Description
                </h3>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="text-gray-200 leading-relaxed">{project.fullDescription}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                  <Code className="mr-2 text-green-400" size={20} />
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-lg text-sm border border-green-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Outcome & Motivation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <Target className="mr-2 text-purple-400" size={18} />
                    Expected Outcome
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-200 text-sm leading-relaxed">{project.projectOutcome}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <Zap className="mr-2 text-yellow-400" size={18} />
                    Motivation
                  </h3>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-gray-200 text-sm leading-relaxed">{project.motivation}</p>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {project.prerequisites && project.prerequisites.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <AlertCircle className="mr-2 text-orange-400" size={20} />
                    Prerequisites
                  </h3>
                  <div className="space-y-2">
                    {project.prerequisites.map((prereq, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-200">
                        <CheckCircle className="text-orange-400 flex-shrink-0" size={16} />
                        <span className="text-sm">{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {project.references && project.references.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <ExternalLink className="mr-2 text-cyan-400" size={20} />
                    References
                  </h3>
                  <div className="space-y-2">
                    {project.references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div>
                          <div className="text-white font-medium">{ref.title}</div>
                          <div className="text-sm text-gray-400">{ref.type}</div>
                        </div>
                        <ExternalLink className="text-cyan-400 group-hover:text-cyan-300" size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={20} />
                Pricing Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-green-400">{formatPrice(project.openingPrice, project.currency)}</div>
                  <div className="text-sm text-gray-300">Opening Price</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-yellow-400">
                    {project.negotiatedPrice ? formatPrice(project.negotiatedPrice, project.currency) : 'Not set'}
                  </div>
                  <div className="text-sm text-gray-300">Negotiated Price</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {project.closedPrice ? formatPrice(project.closedPrice, project.currency) : 'Not set'}
                  </div>
                  <div className="text-sm text-gray-300">Final Price</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="mr-2 text-blue-400" size={20} />
                Project Timeline
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{formatDate(project.startDate)}</div>
                  <div className="text-sm text-gray-300">Start Date</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{formatDate(project.expectedEndDate)}</div>
                  <div className="text-sm text-gray-300">Expected End</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{formatDate(project.actualEndDate)}</div>
                  <div className="text-sm text-gray-300">Actual End</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Applications */}
          <div className="space-y-6">
            
            {/* Action Buttons */}
            {project.status === 'Open' && !project.mentorId && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Users className="mr-2 text-purple-400" size={20} />
                  Find a Mentor
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={handleShowMentorSelection}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <User size={20} />
                    <span>Choose Mentor Manually</span>
                  </button>
                  <button
                    onClick={handleAIMentorSelection}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Bot size={20} />
                    <span>Let AI Pick Best Mentor</span>
                  </button>
                </div>
              </div>
            )}

            {/* Current Mentor (if assigned) */}
            {project.mentorId && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Award className="mr-2 text-yellow-400" size={20} />
                  Assigned Mentor
                </h2>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div className="text-white font-semibold">Mentor Assigned</div>
                  <div className="text-gray-300 text-sm">Project in progress</div>
                </div>
              </div>
            )}

            {/* Applications */}
            {project.applications && project.applications.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MessageCircle className="mr-2 text-green-400" size={20} />
                  Applications ({project.applications.length})
                </h2>
                <div className="space-y-3">
                  {project.applications.map((application, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">Mentor Application</div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          application.applicationStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          application.applicationStatus === 'Accepted' ? 'bg-green-500/20 text-green-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {application.applicationStatus}
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Proposed Price: {formatPrice(application.proposedPrice, project.currency)}</div>
                        <div>Duration: {application.estimatedDuration}</div>
                        <div>Applied: {formatDate(application.appliedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="mr-2 text-blue-400" size={20} />
                Project Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Views</span>
                  <span className="text-white font-semibold">{project.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Applications</span>
                  <span className="text-white font-semibold">{project.applicationsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-semibold">{project.progressPercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Category</span>
                  <span className="text-white font-semibold">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Knowledge Level</span>
                  <span className="text-white font-semibold">{project.knowledgeLevel}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mentor Selection Modal */}
        {showMentorSelection && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Users className="mr-2 text-purple-400" size={24} />
                    Select a Mentor
                  </h2>
                  <button
                    onClick={() => setShowMentorSelection(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                {mentorsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <div className="text-white">Loading mentors...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentors.map((mentor) => (
                      <div key={mentor._id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-colors">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            {mentor.userId?.avatar ? (
                              <img 
                                src={mentor.userId.avatar.startsWith('/uploads/') ? 
                                  `${API_URL}${mentor.userId.avatar}` : mentor.userId.avatar} 
                                alt={mentor.userId.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="text-white" size={24} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">{mentor.userId?.name || 'Anonymous Mentor'}</h3>
                            <p className="text-blue-300 text-sm">{mentor.title}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                              <div className="flex items-center space-x-1">
                                <Star className="text-yellow-400" size={14} />
                                <span>{mentor.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="text-green-400" size={14} />
                                <span>{mentor.totalStudents} students</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="text-blue-400" size={14} />
                                <span>{mentor.completedSessions} sessions</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-200 text-sm mb-4 leading-relaxed">{mentor.description}</p>

                        {/* Expertise */}
                        <div className="mb-4">
                          <h4 className="text-white font-semibold mb-2 text-sm">Expertise</h4>
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.slice(0, 4).map((exp, index) => (
                              <span key={index} className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded text-xs border border-green-500/30">
                                {exp.skill} ({exp.level})
                              </span>
                            ))}
                            {mentor.expertise.length > 4 && (
                              <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                                +{mentor.expertise.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Experience:</span>
                            <span className="text-white font-semibold">{mentor.experience.years} years</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Response Time:</span>
                            <span className="text-white font-semibold">{mentor.responseTime} mins</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Hourly Rate:</span>
                            <span className="text-white font-semibold">
                              {formatPrice(mentor.pricing.hourlyRate, mentor.pricing.currency)}
                            </span>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex space-x-2">
                            {mentor.socialLinks?.linkedin && mentor.socialLinks.linkedin !== '#' && (
                              <a href={mentor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                                 className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                                <Linkedin size={16} />
                              </a>
                            )}
                            {mentor.socialLinks?.github && mentor.socialLinks.github !== '#' && (
                              <a href={mentor.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                 className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors">
                                <Github size={16} />
                              </a>
                            )}
                            {mentor.socialLinks?.portfolio && mentor.socialLinks.portfolio !== '#' && (
                              <a href={mentor.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                                 className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors">
                                <Globe size={16} />
                              </a>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            mentor.isOnline ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {mentor.isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMentor(mentor)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                        >
                          <Send size={16} />
                          <span>Send Request</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mentor Request Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Send className="mr-2 text-green-400" size={24} />
                    Send Request to {selectedMentor.userId?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                {/* Mentor Summary */}
                <div className="bg-white/10 rounded-2xl p-4 mb-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      {selectedMentor.userId?.avatar ? (
                        <img 
                          src={selectedMentor.userId.avatar.startsWith('/uploads/') ? 
                            `${API_URL}${selectedMentor.userId.avatar}` : selectedMentor.userId.avatar} 
                          alt={selectedMentor.userId.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="text-white" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{selectedMentor.userId?.name}</h3>
                      <p className="text-blue-300 text-sm">{selectedMentor.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <Star className="text-yellow-400" size={12} />
                        <span>{selectedMentor.rating}</span>
                        <span>•</span>
                        <span>{formatPrice(selectedMentor.pricing.hourlyRate, selectedMentor.pricing.currency)}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Proposed Price ({project.currency}) *
                    </label>
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Enter your proposed price"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Estimated Duration *
                    </label>
                    <input
                      type="text"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Cover Letter *
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="Tell the mentor why you're interested in working with them and any specific requirements..."
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setSelectedMentor(null)}
                      className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendMentorRequest(selectedMentor._id)}
                      disabled={sendingRequest || !proposedPrice || !coverLetter || !estimatedDuration}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {sendingRequest ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedProjectView;