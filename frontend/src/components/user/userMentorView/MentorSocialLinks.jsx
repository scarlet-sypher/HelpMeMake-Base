import React from "react";
import {
  Globe,
  Linkedin,
  Github,
  Twitter,
  MessageSquare,
  Eye,
  ExternalLink,
} from "lucide-react";

const MentorSocialLinks = ({ mentorData }) => {
  const socialLinksData = [
    {
      name: "LinkedIn Profile",
      url: mentorData.socialLinks?.linkedin,
      icon: Linkedin,
      color: "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
    },
    {
      name: "GitHub Profile",
      url: mentorData.socialLinks?.github,
      icon: Github,
      color: "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30",
    },
    {
      name: "Portfolio",
      url: mentorData.socialLinks?.portfolio,
      icon: Globe,
      color: "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30",
    },
    {
      name: "Twitter Profile",
      url: mentorData.socialLinks?.twitter,
      icon: Twitter,
      color: "bg-sky-600/20 text-sky-400 hover:bg-sky-600/30",
    },
    {
      name: "Blog",
      url: mentorData.socialLinks?.blog,
      icon: MessageSquare,
      color: "bg-orange-600/20 text-orange-400 hover:bg-orange-600/30",
    },
  ];

  const validLinks = socialLinksData.filter(
    (link) => link.url && link.url !== "#" && link.url.trim() !== ""
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Globe className="mr-2 text-cyan-400" size={20} />
        Connect
      </h2>

      <div className="space-y-3">
        {validLinks.length > 0 ? (
          validLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-white/20 ${link.color} group`}
            >
              <div className="flex items-center space-x-3">
                <link.icon size={20} />
                <span className="text-sm sm:text-base font-medium">
                  {link.name}
                </span>
              </div>
              <ExternalLink
                size={16}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No social links available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorSocialLinks;
