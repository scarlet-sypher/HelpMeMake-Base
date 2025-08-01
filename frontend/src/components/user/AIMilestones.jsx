import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, RefreshCw, CheckCircle, Circle } from 'lucide-react';

const AIMilestones = ({ projectData }) => {
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const loadingTexts = [
    "Finding best checkpoints...",
    "Analyzing your project...",
    "Creating milestone roadmap...", 
    "Be patient, AI is thinking...",
    "Crafting perfect milestones..."
  ];

  useEffect(() => {
    if (projectData?._id) {
      fetchExistingMilestones();
    }
  }, [projectData?._id]);

  useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      setLoadingText(loadingTexts[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingTexts.length;
        setLoadingText(loadingTexts[index]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchExistingMilestones = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ai/milestones/${projectData._id}`, {
        withCredentials: true
      });
      
      if (response.data.success && response.data.aiResponse.suggestions.length > 0) {
        setAiSuggestions(response.data.aiResponse.suggestions);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error('Error fetching existing milestones:', error);
    }
  };

  const generateMilestones = async (regenerate = false) => {
    if (!projectData?._id) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/ai/milestones/generate`, {
        projectId: projectData._id,
        regenerate
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const suggestions = response.data.suggestions.map(text => ({ text, isCompleted: false }));
        setAiSuggestions(suggestions);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error('Error generating milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = async (index) => {
    try {
      await axios.patch(`${API_URL}/api/ai/milestones/toggle`, {
        projectId: projectData._id,
        index
      }, {
        withCredentials: true
      });

      setAiSuggestions(prev => 
        prev.map((item, i) => 
          i === index ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
    } catch (error) {
      console.error('Error toggling milestone:', error);
    }
  };

  if (!projectData) return null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="mr-2 text-purple-400" size={24} />
          AI Milestone Suggestions
        </h3>
        {hasGenerated && (
          <button
            onClick={() => generateMilestones(true)}
            disabled={loading}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 rounded-xl font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={16} />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
            <Sparkles className="animate-pulse text-white" size={24} />
          </div>
          <p className="text-purple-200 font-medium animate-pulse">{loadingText}</p>
        </div>
      )}

      {!loading && !hasGenerated && (
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
              <Sparkles className="text-white" size={32} />
            </div>
            <p className="text-gray-300 mb-6">
              Let AI analyze your project and suggest the perfect milestone roadmap
            </p>
          </div>
          <button
            onClick={() => generateMilestones(false)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>👉</span>
            <span>Confused? Let AI decide points for you</span>
          </button>
        </div>
      )}

      {!loading && hasGenerated && aiSuggestions.length > 0 && (
        <div className="space-y-4">
          <p className="text-blue-200 text-sm mb-4">
            AI has analyzed your project and suggests these milestones:
          </p>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => toggleMilestone(index)}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <button className="text-purple-300 hover:text-purple-200 transition-colors flex-shrink-0 mt-1">
                  {suggestion.isCompleted ? 
                    <CheckCircle size={18} className="text-green-400" /> : 
                    <Circle size={18} />
                  }
                </button>
                <p className={`text-white flex-1 leading-relaxed ${
                  suggestion.isCompleted ? 'line-through opacity-60' : ''
                }`}>
                  {suggestion.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
            <p className="text-purple-200 text-sm text-center">
              💡 AI suggestions to help plan your project. Use them anytime or create your own milestones. (To‑do only — not saved to your real milestones.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMilestones;