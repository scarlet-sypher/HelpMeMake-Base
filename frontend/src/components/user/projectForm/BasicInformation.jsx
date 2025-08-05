import React from 'react';
import { FileText } from 'lucide-react';

const BasicInformation = ({ formData, setFormData, errors }) => {
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

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-4">
          <FileText className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Basic Information</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm resize-none"
            placeholder="Brief description of your project (300 characters max)"
            rows={3}
            maxLength={300}
          />
          <div className="text-right text-sm text-white/50 mt-1">
            {formData.shortDescription.length}/300
          </div>
          {errors.shortDescription && <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>}
        </div>

        <div className="w-full">
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

        <div className="w-full">
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

        <div className="w-full">
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

        <div className="w-full">
          <label className="block text-white font-medium mb-2">Status</label>
          <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-sm flex items-center">
            <span className="text-emerald-400 font-medium">● Open</span>
          </div>
          <p className="text-white/60 text-xs mt-1">Projects are automatically set to Open status</p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;