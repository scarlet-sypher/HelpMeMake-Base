import React, { useState } from "react";
import {
  Send,
  Loader2,
  AlertCircle,
  DollarSign,
  MessageSquare,
} from "lucide-react";

const PitchModal = ({ project, onClose, API_URL, onPitchSubmitted }) => {
  const [formData, setFormData] = useState({
    price: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/projects/${project._id}/pitch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: parseFloat(formData.price),
          note: formData.note.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Pitch submitted successfully!");
        if (onPitchSubmitted) {
          onPitchSubmitted(data.pitch);
        }
        onClose();
      } else {
        setError(data.message || "Failed to submit pitch");
      }
    } catch (error) {
      console.error("Error submitting pitch:", error);
      setError("Failed to submit pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Send className="mr-2 text-cyan-400" size={24} />
            Submit Your Pitch
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <AlertCircle size={24} />
          </button>
        </div>

        {/* Project Info */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {project.name}
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            {project.shortDescription}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Opening Price:</span>
            <span className="text-green-400 font-semibold">
              ₹{project.openingPrice?.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <DollarSign className="inline mr-1" size={16} />
              Your Proposed Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15"
              placeholder="Enter your proposed price"
              min="1"
              step="1"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Project opening price: ₹{project.openingPrice?.toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <MessageSquare className="inline mr-1" size={16} />
              Pitch Message (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              rows={6}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 resize-none"
              placeholder="Explain why you're the perfect mentor for this project and any additional details about your approach..."
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Tell the user why they should choose you for this project
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                loading || !formData.price || parseFloat(formData.price) <= 0
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Pitch</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="text-sm font-semibold text-white mb-2">
            💡 Pitch Tips:
          </h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Be competitive but fair with your pricing</li>
            <li>• Highlight your relevant experience and skills</li>
            <li>• Explain your approach to the project</li>
            <li>• Mention any questions or clarifications you have</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PitchModal;
