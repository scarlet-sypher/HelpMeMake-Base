import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/user/Sidebar';
// Using fetch API instead of axios
import { 
  Calendar, 
  Target, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Users,
  Zap,
  Trophy,
  BookOpen,
  Loader,
  Eye,
  EyeOff,
  Star,
  Rocket,
  Award,
  Menu,
  Undo2
} from 'lucide-react';

const MilestonePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('milestones');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Project and milestone data
  const [projectData, setProjectData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState('');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjectData();
    }
  }, [isAuthenticated]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user's active project with mentor
      const response = await fetch(`${API_URL}/api/project/active-with-mentor`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success && data.project) {
        setProjectData(data.project);
        await fetchMilestones(data.project._id);
      } else {
        setProjectData(null);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError('Failed to fetch project data: ' + error.message);
      setProjectData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (projectId) => {
    try {
      const response = await fetch(`${API_URL}/api/milestone/project/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setMilestones(data.milestones || []);
      }
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const addMilestone = async () => {
    if (!newMilestone.trim() || milestones.length >= 5) return;
    
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectData._id,
          title: newMilestone.trim(),
          description: `Milestone: ${newMilestone.trim()}`,
          dueDate: projectData.expectedEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          order: milestones.length + 1
        })
      });

      const data = await response.json();

      if (data.success) {
        setMilestones([...milestones, data.milestone]);
        setNewMilestone('');
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      setError('Failed to add milestone');
    } finally {
      setSaving(false);
    }
  };

  const removeMilestone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/${milestoneId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setMilestones(milestones.filter(m => m._id !== milestoneId));
      }
    } catch (error) {
      console.error('Error removing milestone:', error);
      setError('Failed to remove milestone');
    } finally {
      setSaving(false);
    }
  };

  const markMilestoneAsDone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/${milestoneId}/learner-verify`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationNotes: 'Marked as done by learner',
          submissionUrl: ''
        })
      });

      const data = await response.json();

      if (data.success) {
        setMilestones(milestones.map(m => 
          m._id === milestoneId ? data.milestone : m
        ));
      }
    } catch (error) {
      console.error('Error marking milestone as done:', error);
      setError('Failed to mark milestone as done');
    } finally {
      setSaving(false);
    }
  };

  const undoMilestone = async (milestoneId) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/milestone/${milestoneId}/learner-unverify`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setMilestones(milestones.map(m => 
          m._id === milestoneId ? data.milestone : m
        ));
      }
    } catch (error) {
      console.error('Error undoing milestone:', error);
      setError('Failed to undo milestone');
    } finally {
      setSaving(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getMilestoneStatus = (milestone) => {
    if (milestone.learnerVerification?.isVerified && milestone.mentorVerification?.isVerified) {
      return { color: 'bg-emerald-500', text: 'Completed', icon: CheckCircle };
    } else if (milestone.learnerVerification?.isVerified) {
      return { color: 'bg-yellow-500', text: 'Pending Review', icon: Clock };
    } else {
      return { color: 'bg-slate-500', text: 'Not Started', icon: AlertCircle };
    }
  };

  const isNextMilestoneVisible = (index) => {
    if (index === 0) return true;
    const previousMilestone = milestones[index - 1];
    return previousMilestone?.learnerVerification?.isVerified || false;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = () => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter(m => 
      m.learnerVerification?.isVerified && m.mentorVerification?.isVerified
    ).length;
    return Math.round((completed / milestones.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen w-full max-w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4 w-full">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Milestones</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="relative z-10 p-4 lg:p-6 space-y-6 w-full max-w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white flex items-center">
                <Target className="mr-3 text-purple-400" size={36} />
                Milestones
              </h1>
              <p className="text-blue-200 mt-2">Track your progress and achieve your goals</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30 flex items-center space-x-3">
              <AlertCircle className="text-red-400" size={24} />
              <span className="text-red-200 font-medium">{error}</span>
            </div>
          )}

          {!projectData ? (
  // No Project Message
  <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
    <div className="flex flex-col items-center space-y-6">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
        <BookOpen className="text-white" size={40} />
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">No Active Project Found</h3>
        <p className="text-orange-200 max-w-md">
          To create milestones, you need to have an active project with a mentor. 
          Let's get you started with finding the perfect project!
        </p>
      </div>
      <button
        onClick={() => window.location.href = '/user/projects'}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
      >
        <Rocket size={20} />
        <span>Explore Projects</span>
      </button>
    </div>
  </div>
) : (
  <div className="space-y-6">
    {/* Project Information */}
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
            <Trophy className="text-yellow-400 mr-0 sm:mr-3" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-white break-words">{projectData.name}</h2>
          </div>
          <p className="text-blue-200 mb-6 text-sm sm:text-base">{projectData.shortDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                  <Users className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-blue-200 font-medium">Mentor</span>
              </div>
              <p className="text-white font-bold text-sm sm:text-base break-words">
                {projectData.mentorId?.name || 'Assigned Mentor'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                  <Calendar className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-green-200 font-medium">End Date</span>
              </div>
              <p className="text-white font-bold text-sm sm:text-base">
                {projectData.expectedEndDate ? formatDate(projectData.expectedEndDate) : 'Not Set'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 sm:p-2 bg-purple-500 rounded-lg">
                  <Zap className="text-white" size={14} />
                </div>
                <span className="text-xs sm:text-sm text-purple-200 font-medium">Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-white font-bold text-sm sm:text-base">{projectData.progressPercentage || 0}%</p>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${projectData.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Milestone Creation Form */}
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plus className="text-green-400 mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">Create Milestones</h3>
        </div>
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
          <Star className="text-green-400" size={16} />
          <span className="text-sm text-green-300 font-medium">
            {milestones.length}/5 Created
          </span>
        </div>
      </div>
      {milestones.length < 5 && (
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Describe your next milestone..."
            className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
            maxLength={200}
            disabled={saving}
          />
          <button
            onClick={addMilestone}
            disabled={!newMilestone.trim() || saving}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            {saving ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            <span>Add Milestone</span>
          </button>
        </div>
      )}
      {milestones.length >= 5 && (
        <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-400/30 flex items-center space-x-3">
          <AlertCircle className="text-yellow-400" size={20} />
          <span className="text-yellow-200 font-medium">Maximum 5 milestones reached! You're all set!</span>
        </div>
      )}
    </div>
    {/* Milestones List */}
    {milestones.length > 0 && (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 lg:p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Target className="text-blue-400 mr-3" size={24} />
            <h3 className="text-xl font-bold text-white">Your Milestones</h3>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-sm text-blue-200">Progress:</div>
            <div className="flex-1 sm:flex-none sm:w-24 bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
            <span className="text-blue-300 font-medium text-sm">{getCompletionPercentage()}%</span>
          </div>
        </div>
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone);
            const isVisible = isNextMilestoneVisible(index);
            const StatusIcon = status.icon;
            return (
              <div
                key={milestone._id}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all ${
                  isVisible ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${status.color} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <span className="text-white font-bold text-sm sm:text-base">{index + 1}</span>
                      </div>
                      <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full border flex-shrink-0 ${
                        status.color === 'bg-emerald-500'
                          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                          : status.color === 'bg-yellow-500'
                          ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
                          : 'bg-slate-500/20 border-slate-400/30 text-slate-300'
                      }`}>
                        <StatusIcon size={12} />
                        <span className="text-xs font-medium">{status.text}</span>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {isVisible ? (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Eye size={12} />
                            <span className="text-xs hidden sm:inline">Unlocked</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <EyeOff size={12} />
                            <span className="text-xs hidden sm:inline">Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-3 break-words">{milestone.title}</h4>
                    <div className="flex items-center space-x-4 sm:space-x-6 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          milestone.learnerVerification?.isVerified ? 'bg-blue-400' : 'bg-gray-500'
                        }`}></div>
                        <User size={12} className={`${
                          milestone.learnerVerification?.isVerified ? 'text-blue-300' : 'text-gray-400'
                        }`} />
                        <span className="text-xs text-gray-300">Learner</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          milestone.mentorVerification?.isVerified ? 'bg-purple-400' : 'bg-gray-500'
                        }`}></div>
                        <Users size={12} className={`${
                          milestone.mentorVerification?.isVerified ? 'text-purple-300' : 'text-gray-400'
                        }`} />
                        <span className="text-xs text-gray-300">Mentor</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    {isVisible && !milestone.learnerVerification?.isVerified && (
                      <button
                        onClick={() => markMilestoneAsDone(milestone._id)}
                        disabled={saving}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                      >
                        {saving ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        <span className="text-xs sm:text-sm">Mark Done</span>
                      </button>
                    )}
                    {milestone.learnerVerification?.isVerified && !milestone.mentorVerification?.isVerified && (
                      <button
                        onClick={() => undoMilestone(milestone._id)}
                        disabled={saving}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                      >
                        {saving ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Undo2 size={14} />
                        )}
                        <span className="text-xs sm:text-sm">Undo</span>
                      </button>
                    )}
                    {!milestone.learnerVerification?.isVerified && !milestone.mentorVerification?.isVerified && (
                      <button
                        onClick={() => removeMilestone(milestone._id)}
                        disabled={saving}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 rounded-lg transition-all hover:scale-105 flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]"
                        title="Remove milestone"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {getCompletionPercentage() === 100 && (
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-400/30">
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Trophy className="text-yellow-400" size={24} />
                <span className="text-lg sm:text-xl font-bold text-yellow-300 text-center">
                  🎉 All Milestones Completed! 🎉
                </span>
                <Award className="text-orange-400" size={24} />
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default MilestonePage;