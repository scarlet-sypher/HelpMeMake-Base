import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  User,
  XCircle,
  Star,
  CheckCircle,
  Send,
  Linkedin,
  Github,
  Globe,
  Bot,
  Sparkles,
  Brain,
  Target,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';

const MentorAiSelectionModal = ({ 
  showAIMentorSelection, 
  setShowAIMentorSelection, 
  project,
  mentors,
  setSelectedMentor, 
  API_URL, 
  formatPrice 
}) => {
  const [aiMentors, setAiMentors] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const navigate = useNavigate();

  const loadingSteps = [
    "🤖 Analyzing your project requirements...",
    "🎯 Matching skills with available mentors...",
    "⚡ AI is evaluating mentor compatibility...",
    "🌟 Preparing personalized recommendations..."
  ];

  // AI Analysis function
  const performAIAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setLoadingStep(0);
      setAnalysisComplete(false);

      // Simulate loading steps with intervals
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepInterval);
          return prev;
        });
      }, 1500);

      // Prepare project metadata
      const projectMetaData = {
        id: project._id,
        name: project.name,
        category: project.category,
        techStack: project.techStack,
        difficultyLevel: project.difficultyLevel,
        shortDescription: project.shortDescription,
        duration: project.duration,
        openingPrice: project.openingPrice,
        prerequisites: project.prerequisites || []
      };

      // Prepare mentors metadata
      const mentorMetaDataList = mentors.map(mentor => ({
        _id: mentor._id,
        name: mentor.userId?.name || 'Anonymous Mentor',
        title: mentor.title,
        expertise: mentor.expertise,
        rating: mentor.rating,
        totalStudents: mentor.totalStudents,
        completedSessions: mentor.completedSessions,
        experience: mentor.experience,
        responseTime: mentor.responseTime,
        pricing: mentor.pricing,
        isOnline: mentor.isOnline,
        description: mentor.description,
        socialLinks: mentor.socialLinks,
        userId: mentor.userId
      }));

      const response = await axios.post(`${API_URL}/api/ai/select-mentors`, {
        projectMetaData,
        mentorMetaDataList
      }, {
        withCredentials: true,
        timeout: 30000 // 30 seconds timeout
      });

      if (response.data.success) {
        setAiMentors(response.data.mentors);
        setAnalysisComplete(true);
        toast.success('🤖 AI has found the perfect mentors for you!');
      } else {
        toast.error('AI analysis failed. Please try again.');
        setShowAIMentorSelection(false);
      }
    } catch (error) {
      console.error('Error in AI mentor selection:', error);
      toast.error('AI analysis failed. Please try manual selection.');
      setShowAIMentorSelection(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start AI analysis when modal opens
  useEffect(() => {
    if (showAIMentorSelection && !analysisComplete && !isAnalyzing) {
      performAIAnalysis();
    }
  }, [showAIMentorSelection]);

  // Handle see why mentor is best
  const handleSeeWhy = (mentorId, whyReason, aiScore, mentorData) => {
  // Navigate to the new mentor details page with all necessary data
    navigate(`/user/mentors/${mentorId}/ai-reason`, {
        state: {
        mentor: mentorData,
        whyReason: whyReason,
        aiScore: aiScore,
        project: project, // Pass the current project for context
        fromAI: true
        }
    });
};

  if (!showAIMentorSelection) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Bot className="mr-2 text-purple-400" size={24} />
              AI Mentor Recommendations
              <Sparkles className="ml-2 text-yellow-400 animate-pulse" size={20} />
            </h2>
            <button
              onClick={() => setShowAIMentorSelection(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Loading Animation */}
          {isAnalyzing && (
            <div className="text-center py-12">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto relative">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                  {/* First spinning ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                  {/* Second spinning ring with delay */}
                  <div 
                    className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"
                    style={{ animationDelay: '0.15s' }}
                  ></div>
                  {/* Third spinning ring with delay */}
                  <div 
                    className="absolute inset-4 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin"
                    style={{ animationDelay: '0.3s' }}
                  ></div>
                  {/* Brain icon in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="text-purple-400 animate-pulse" size={24} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xl font-bold text-white mb-2">
                  {loadingSteps[loadingStep]}
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-gray-300 text-sm">
                  Step {loadingStep + 1} of {loadingSteps.length}
                </div>
              </div>
            </div>
          )}

          {/* AI Results */}
          {analysisComplete && aiMentors.length > 0 && (
            <>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-4 mb-6 border border-purple-500/30">
                <div className="flex items-center space-x-3">
                  <Target className="text-purple-400" size={20} />
                  <div>
                    <h3 className="text-white font-semibold">AI Analysis Complete!</h3>
                    <p className="text-purple-200 text-sm">Found {aiMentors.length} perfectly matched mentors for your project</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiMentors.map((aiMentor, index) => {
                  const mentor = aiMentor.mentorData;
                  return (
                    <div key={mentor._id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden">
                      {/* AI Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                        <Award size={12} />
                        <span>AI Pick #{index + 1}</span>
                      </div>

                      {/* Mentor Info */}
                      <div className="flex items-start space-x-4 mb-4 mt-2">
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
                          {mentor.expertise.slice(0, 4).map((exp, expIndex) => (
                            <span key={expIndex} className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded text-xs border border-green-500/30">
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

                      {/* Experience & Pricing */}
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

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedMentor(mentor)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                        >
                          <Send size={16} />
                          <span>Send Request</span>
                        </button>
                        
                        <button
                            onClick={() => handleSeeWhy(mentor._id, aiMentor.whyReason, aiMentor.aiScore, mentor)}
                            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl font-medium hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 transition-all flex items-center justify-center space-x-2"
                            >
                            <Sparkles size={14} />
                            <span>See why AI picked this mentor</span>
                        </button>
                      </div>

                      {/* AI Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty State */}
          {analysisComplete && aiMentors.length === 0 && (
            <div className="text-center py-12">
              <Bot className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No AI Recommendations Available</h3>
              <p className="text-gray-300 mb-6">AI couldn't find suitable mentors. Try manual selection instead.</p>
              <button
                onClick={() => setShowAIMentorSelection(false)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Try Manual Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorAiSelectionModal;