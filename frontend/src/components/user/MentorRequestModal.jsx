import React, { useState } from 'react';
import axios from 'axios';
import { 
  Send,
  XCircle,
  Star,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';

const MentorRequestModal = ({ 
  selectedMentor, 
  setSelectedMentor, 
  project, 
  setProject, 
  API_URL, 
  formatPrice 
}) => {
  const [proposedPrice, setProposedPrice] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  // Handle sending mentor request
  const handleSendMentorRequest = async (mentorId) => {
    if (!proposedPrice || !coverLetter || !estimatedDuration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSendingRequest(true);
      const response = await axios.post(`${API_URL}/projects/${project._id}/apply`, {
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
        const updatedProject = await axios.get(`${API_URL}/projects/${project._id}`, {
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

  // Reset form when modal closes
  React.useEffect(() => {
    if (!selectedMentor) {
      setProposedPrice('');
      setCoverLetter('');
      setEstimatedDuration('');
      setSendingRequest(false);
    }
  }, [selectedMentor]);

  if (!selectedMentor) return null;

  return (
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
  );
};

export default MentorRequestModal;