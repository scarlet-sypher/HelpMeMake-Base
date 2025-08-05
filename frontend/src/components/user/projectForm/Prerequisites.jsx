import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const Prerequisites = ({ formData, setFormData }) => {
  const [newPrereq, setNewPrereq] = useState('');

  const addPrereq = () => {
    if (newPrereq.trim() && !formData.prerequisites.includes(newPrereq.trim())) {
      setFormData({ ...formData, prerequisites: [...formData.prerequisites, newPrereq.trim()] });
      setNewPrereq('');
    }
  };

  const removePrereq = (index) => {
    setFormData({ ...formData, prerequisites: formData.prerequisites.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-4">
          <GraduationCap className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Prerequisites & Requirements</h2>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Prerequisites</label>
        <div className="space-y-2 mb-4">
          {formData.prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white flex-1 mr-3">{prereq}</span>
              <button
                type="button"
                onClick={() => removePrereq(index)}
                className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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
    </div>
  );
};

export default Prerequisites;