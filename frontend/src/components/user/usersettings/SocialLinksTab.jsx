import React from 'react';
import { Link, Github, Linkedin, Twitter, Save, Loader } from 'lucide-react';

const SocialLinksTab = ({
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
          ? 'bg-slate-700/30 border-slate-500/50 text-slate-200 shadow-slate-600/20' 
          : 'bg-slate-800/40 border-slate-600/50 text-slate-300 shadow-slate-700/25'
      } shadow-xl`}>
        <div className="absolute inset-0 bg-gradient-to-r opacity-5 animate-pulse"
             style={{
               background: notification.status === 'success' 
                 ? 'linear-gradient(45deg, #64748b, #475569)' 
                 : 'linear-gradient(45deg, #374151, #1f2937)'
             }} />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <NotificationComponent notification={notifications.socialLinks} />
      
      <div className="relative group/social">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl blur opacity-15 group-hover/social:opacity-20 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl">
              <Link className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Social Connections</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-700/50 to-transparent"></div>
          </div>
          
          <form onSubmit={handleSocialLinksUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                <Github className="mr-2 text-gray-400" size={16} />
                GitHub Profile
              </label>
              <div className="relative group">
                <input
                  type="url"
                  value={socialLinksData.github}
                  onChange={(e) => setSocialLinksData({...socialLinksData, github: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  placeholder="https://github.com/yourusername"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                <Linkedin className="mr-2 text-blue-400" size={16} />
                LinkedIn Profile
              </label>
              <div className="relative group">
                <input
                  type="url"
                  value={socialLinksData.linkedin}
                  onChange={(e) => setSocialLinksData({...socialLinksData, linkedin: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  placeholder="https://linkedin.com/in/yourusername"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                <Twitter className="mr-2 text-sky-400" size={16} />
                Twitter Profile
              </label>
              <div className="relative group">
                <input
                  type="url"
                  value={socialLinksData.twitter}
                  onChange={(e) => setSocialLinksData({...socialLinksData, twitter: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                  placeholder="https://twitter.com/yourusername"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingStates.socialLinks}
              className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loadingStates.socialLinks ? (
                <Loader className="animate-spin relative z-10" size={20} />
              ) : (
                <Save className="relative z-10" size={20} />
              )}
              <span className="relative z-10">{loadingStates.socialLinks ? 'Updating Links...' : 'Update Social Links'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksTab;