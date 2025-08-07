import React from 'react';
import { Link, Github, Linkedin, Twitter, Globe, Save, Loader, ExternalLink } from 'lucide-react';

const SocialTab = ({
  socialLinksData,
  setSocialLinksData,
  handleSocialLinksUpdate,
  loadingStates,
  notifications
}) => {
  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;
    
    return (
      <div className={`relative overflow-hidden p-4 rounded-2xl mb-6 flex items-center space-x-3 backdrop-blur-sm border transition-all duration-500 animate-slide-in ${
        notification.status === 'success' 
          ? 'bg-teal-500/10 border-teal-500/30 text-teal-100 shadow-teal-500/20' 
          : 'bg-red-500/10 border-red-500/30 text-red-100 shadow-red-500/20'
      } shadow-xl`}>
        <div className="absolute inset-0 bg-gradient-to-r opacity-10 animate-pulse"
             style={{
               background: notification.status === 'success' 
                 ? 'linear-gradient(45deg, #14b8a6, #0d9488)' 
                 : 'linear-gradient(45deg, #ef4444, #dc2626)'
             }} />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <span className="font-medium text-sm sm:text-base">{notification.message}</span>
        </div>
      </div>
    );
  };

  const socialPlatforms = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      placeholder: 'https://github.com/yourusername',
      color: 'from-gray-700 to-gray-800',
      hoverColor: 'hover:from-gray-800 hover:to-gray-900',
      description: 'Showcase your code repositories and contributions'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      placeholder: 'https://linkedin.com/in/yourusername',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      description: 'Professional profile and networking'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      placeholder: 'https://twitter.com/yourusername',
      color: 'from-sky-500 to-blue-600',
      hoverColor: 'hover:from-sky-600 hover:to-blue-700',
      description: 'Share thoughts and engage with the tech community'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      icon: Globe,
      placeholder: 'https://yourportfolio.com',
      color: 'from-purple-600 to-indigo-600',
      hoverColor: 'hover:from-purple-700 hover:to-indigo-700',
      description: 'Personal website or portfolio showcase'
    },
    {
      id: 'blog',
      name: 'Blog',
      icon: Globe,
      placeholder: 'https://yourblog.com',
      color: 'from-green-600 to-teal-600',
      hoverColor: 'hover:from-green-700 hover:to-teal-700',
      description: 'Technical blog or writing platform'
    }
  ];

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleInputChange = (platform, value) => {
    setSocialLinksData(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleInputBlur = (platform, value) => {
    if (value && !validateUrl(value)) {
      const formattedUrl = formatUrl(value);
      setSocialLinksData(prev => ({
        ...prev,
        [platform]: formattedUrl
      }));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <NotificationComponent notification={notifications.socialLinks} />
      
      {/* Header Section */}
      <div className="relative group/header">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl blur opacity-15 group-hover/header:opacity-20 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border border-teal-400/40 rounded-2xl p-6 flex items-start space-x-4 backdrop-blur-sm">
          <div className="p-3 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-xl flex-shrink-0">
            <Link className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Social Links</h3>
            <p className="text-teal-100 mb-3">
              Connect your professional social profiles to build trust and showcase your expertise
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-teal-200">
              <span className="px-3 py-1 bg-teal-600/30 rounded-full">Optional</span>
              <span className="px-3 py-1 bg-cyan-600/30 rounded-full">Public Profile</span>
              <span className="px-3 py-1 bg-teal-700/30 rounded-full">No Verification Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Form */}
      <form onSubmit={handleSocialLinksUpdate} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const isValidUrl = validateUrl(socialLinksData[platform.id]);
            const hasValue = socialLinksData[platform.id] && socialLinksData[platform.id] !== '' && socialLinksData[platform.id] !== '#';
            
            return (
              <div key={platform.id} className="relative group/platform">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${platform.color} rounded-2xl blur opacity-15 group-hover/platform:opacity-20 transition duration-500`}></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20">
                  
                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-r ${platform.color} rounded-xl`}>
                        <Icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{platform.name}</h4>
                        <p className="text-gray-400 text-sm">{platform.description}</p>
                      </div>
                    </div>
                    
                    {hasValue && isValidUrl && (
                      <a
                        href={socialLinksData[platform.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <input
                        type="url"
                        value={socialLinksData[platform.id] || ''}
                        onChange={(e) => handleInputChange(platform.id, e.target.value)}
                        onBlur={(e) => handleInputBlur(platform.id, e.target.value)}
                        className={`w-full p-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15 ${
                          !isValidUrl && socialLinksData[platform.id] 
                            ? 'border-red-400/50 focus:border-red-400' 
                            : 'border-white/20 focus:border-white/40'
                        }`}
                        placeholder={platform.placeholder}
                      />
                      {/* <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${platform.color.replace('from-', 'from-').replace('to-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div> */}
                    </div>
                    
                    {/* Validation Message */}
                    {!isValidUrl && socialLinksData[platform.id] && (
                      <p className="text-red-400 text-sm flex items-center space-x-2">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        <span>Please enter a valid URL</span>
                      </p>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2 text-sm">
                      {hasValue && isValidUrl ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-400 font-medium">Connected</span>
                        </>
                      ) : hasValue && !isValidUrl ? (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-400 font-medium">Invalid URL</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-gray-400 font-medium">Not connected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="relative group/tips">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl blur opacity-15 group-hover/tips:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-cyan-500/20 to-teal-600/20 border border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              Pro Tips for Social Links
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-cyan-100 text-sm">
              <div className="space-y-2">
                <p><strong>GitHub:</strong> Showcase your best repositories and pin important projects</p>
                <p><strong>LinkedIn:</strong> Keep your profile updated with recent experience and skills</p>
              </div>
              <div className="space-y-2">
                <p><strong>Portfolio:</strong> Include live demos and case studies of your work</p>
                <p><strong>Blog:</strong> Share your knowledge through technical articles and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loadingStates.socialLinks}
            className="relative group overflow-hidden flex items-center justify-center space-x-3 px-6 sm:px-8 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loadingStates.socialLinks ? (
              <Loader className="animate-spin relative z-10" size={20} />
            ) : (
              <Save className="relative z-10" size={20} />
            )}
            <span className="relative z-10 text-sm sm:text-base">
              {loadingStates.socialLinks ? 'Updating...' : 'Update Social Links'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialTab;