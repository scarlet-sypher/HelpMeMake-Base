import React from "react";
import {
  Globe,
  Linkedin,
  Github,
  Twitter,
  MessageSquare,
  Eye,
  ExternalLink,
  Link as LinkIcon,
  ArrowUpRight,
} from "lucide-react";

const MentorSocialLinks = ({ mentorData }) => {
  const socialLinksData = [
    {
      name: "LinkedIn",
      url: mentorData.socialLinks?.linkedin,
      icon: Linkedin,
      color: "from-blue-600/20 to-blue-500/10",
      hoverColor: "hover:from-blue-600/40 hover:to-blue-500/20",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      hoverBorder: "hover:border-blue-400/60",
      description: "Professional network",
    },
    {
      name: "GitHub",
      url: mentorData.socialLinks?.github,
      icon: Github,
      color: "from-gray-600/20 to-slate-600/10",
      hoverColor: "hover:from-gray-600/40 hover:to-slate-600/20",
      textColor: "text-gray-300",
      borderColor: "border-gray-500/30",
      hoverBorder: "hover:border-gray-400/60",
      description: "Code repositories",
    },
    {
      name: "Portfolio",
      url: mentorData.socialLinks?.portfolio,
      icon: Globe,
      color: "from-purple-600/20 to-violet-500/10",
      hoverColor: "hover:from-purple-600/40 hover:to-violet-500/20",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      hoverBorder: "hover:border-purple-400/60",
      description: "Personal website",
    },
    {
      name: "Twitter",
      url: mentorData.socialLinks?.twitter,
      icon: Twitter,
      color: "from-sky-600/20 to-cyan-500/10",
      hoverColor: "hover:from-sky-600/40 hover:to-cyan-500/20",
      textColor: "text-sky-400",
      borderColor: "border-sky-500/30",
      hoverBorder: "hover:border-sky-400/60",
      description: "Latest thoughts",
    },
    {
      name: "Blog",
      url: mentorData.socialLinks?.blog,
      icon: MessageSquare,
      color: "from-orange-600/20 to-amber-500/10",
      hoverColor: "hover:from-orange-600/40 hover:to-amber-500/20",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/30",
      hoverBorder: "hover:border-orange-400/60",
      description: "Written content",
    },
  ];

  const validLinks = socialLinksData.filter(
    (link) => link.url && link.url !== "#" && link.url.trim() !== ""
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 group">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center">
          <div className="relative mr-3">
            <LinkIcon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
          </div>
          Connect
        </h2>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {validLinks.length > 0 ? (
        <div className="space-y-4">
          {validLinks.map((link, index) => (
            <div key={index} className="group/link">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative block p-4 rounded-2xl transition-all duration-300 border ${link.borderColor} ${link.hoverBorder} overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${link.color} ${link.hoverColor} transition-all duration-300`}
                ></div>

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <link.icon
                        className={`w-6 h-6 ${link.textColor} group-hover/link:scale-110 transition-transform duration-300`}
                      />
                      <div
                        className={`absolute inset-0 rounded-full scale-0 group-hover/link:scale-150 transition-transform duration-300 ${link.color
                          .replace("from-", "bg-")
                          .split(" ")[0]
                          .replace("/20", "/20")}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold text-base ${link.textColor} group-hover/link:text-white transition-colors duration-300`}
                      >
                        {link.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {link.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-60 group-hover/link:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight
                      className={`w-4 h-4 ${link.textColor} transform group-hover/link:scale-110 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300`}
                    />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="relative mb-6">
            <Eye size={56} className="mx-auto text-gray-500/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-2 border-gray-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-300 mb-2">
            No Links Shared
          </h4>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            This mentor hasn't shared their social profiles yet.
          </p>
        </div>
      )}

      {validLinks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Globe className="w-3 h-3" />
            <span>
              {validLinks.length} platform{validLinks.length > 1 ? "s" : ""}{" "}
              connected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorSocialLinks;
