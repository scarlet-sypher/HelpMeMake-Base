import React from "react";
import { User, FileText, Sparkles } from "lucide-react";

const MentorAboutSection = ({ mentorData }) => {
  return (
    <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse delay-300"></div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6 text-purple-400" />
            </div>
            <div className="absolute inset-0 bg-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              About
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
          </div>
          <Sparkles className="w-5 h-5 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500/50 to-blue-500/50 rounded-full"></div>
            <div className="pl-4">
              <p className="text-gray-100 leading-relaxed text-base sm:text-lg font-medium">
                {mentorData.description}
              </p>
            </div>
          </div>

          {mentorData.bio &&
            mentorData.bio !==
              "Experienced professional ready to share knowledge" && (
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 group/bio overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                      <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Biography
                    </h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/50 to-transparent"></div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-3 top-0 w-0.5 h-full bg-gradient-to-b from-cyan-500/60 to-blue-500/60 rounded-full"></div>
                    <p className="text-gray-200 leading-relaxed text-sm sm:text-base pl-4">
                      {mentorData.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

          <div className="flex justify-center pt-4">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorAboutSection;
