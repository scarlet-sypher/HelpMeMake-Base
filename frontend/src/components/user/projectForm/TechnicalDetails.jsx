import React, { useState } from 'react';
import { Code, Plus, X, Tag, Upload, Image } from 'lucide-react';
import axios from 'axios';

const TechnicalDetails = ({ formData, setFormData, errors }) => {
  const [newTech, setNewTech] = useState('');
  const [newTag, setNewTag] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(formData.thumbnail || '');

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

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setThumbnailUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('thumbnail', file);

      // Get token from multiple possible sources
      const token = localStorage.getItem('access_token') || 
             localStorage.getItem('token') || 
             sessionStorage.getItem('access_token') ||
             sessionStorage.getItem('token');

        console.log('Token being used:', token ? 'Token found' : 'No token found');

        if (!token) {
        alert('Authentication required. Please log in again.');
        return;
        }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects/upload-thumbnail`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        const thumbnailUrl = response.data.thumbnailUrl;
        setFormData({ ...formData, thumbnail: thumbnailUrl });
        setThumbnailPreview(thumbnailUrl);
        alert('Thumbnail uploaded successfully!');
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        alert(error.response?.data?.message || 'Failed to upload thumbnail. Please try again.');
      }
    } finally {
      setThumbnailUploading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
          <Code className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Technical Details</h2>
      </div>

      <div className="space-y-6">
        {/* Tech Stack */}
        <div>
          <label className="block text-white font-medium mb-2">Tech Stack *</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.techStack.map((tech, index) => (
              <span key={index} className="flex items-center px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm border border-purple-400/30">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(index)}
                  className="ml-2 text-purple-300 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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
        <div>
          <label className="block text-white font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <span key={index} className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30">
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-blue-300 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
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

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-white font-medium mb-2">Project Thumbnail</label>
          
          {/* Image Preview */}
          {thumbnailPreview && (
            <div className="mb-4">
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-xl border border-white/20"
                  onError={(e) => {
                    e.target.src = `${import.meta.env.VITE_API_URL}/uploads/public/default-project.jpg`;

                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailPreview('');
                    setFormData({ ...formData, thumbnail: '' });
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Upload Input */}
          <div className="relative">
            <input
              type="file"
              id="thumbnail-upload"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleThumbnailUpload}
              className="hidden"
              disabled={thumbnailUploading}
            />
            <label
              htmlFor="thumbnail-upload"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-white/50 transition-all ${
                thumbnailUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-2">
                  {thumbnailUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Upload className="text-white" size={24} />
                  )}
                </div>
                <p className="text-white/70 text-sm text-center px-4">
                  {thumbnailUploading ? 'Uploading...' : 'Click to upload project thumbnail'}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </label>
          </div>

          {/* Fallback URL Input */}
          <div className="mt-4">
            <label className="block text-white/70 font-medium mb-2 text-sm">Or enter image URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => {
                setFormData({ ...formData, thumbnail: e.target.value });
                setThumbnailPreview(e.target.value);
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDetails;