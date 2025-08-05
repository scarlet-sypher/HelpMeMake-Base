import React, { useState } from 'react';
import { Link, Plus, Trash2 } from 'lucide-react';

const References = ({ formData, setFormData }) => {
  const [newReference, setNewReference] = useState({ title: '', url: '', type: 'Documentation' });

  const referenceTypes = ['Documentation', 'Tutorial', 'GitHub Repo', 'Article', 'Video', 'Book', 'Other'];

  const addReference = () => {
    if (newReference.title.trim() && newReference.url.trim()) {
      setFormData({ ...formData, references: [...formData.references, { ...newReference }] });
      setNewReference({ title: '', url: '', type: 'Documentation' });
    }
  };

  const removeReference = (index) => {
    setFormData({ ...formData, references: formData.references.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
          <Link className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">References & Resources</h2>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">References & Resources</label>
        <div className="space-y-3 mb-4">
          {formData.references.map((ref, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <Link size={16} className="text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-white font-medium truncate">{ref.title}</span>
                    <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-xs flex-shrink-0">
                      {ref.type}
                    </span>
                  </div>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-300 text-sm hover:underline break-all block"
                  >
                    {ref.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="ml-3 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={newReference.title}
              onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm"
              placeholder="Reference title"
            />
            <select
              value={newReference.type}
              onChange={(e) => setNewReference({ ...newReference, type: e.target.value })}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm"
            >
              {referenceTypes.map(type => (
                <option key={type} value={type} className="bg-slate-800">{type}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={newReference.url}
              onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 backdrop-blur-sm"
              placeholder="Reference URL"
            />
            <button
              type="button"
              onClick={addReference}
              className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default References;