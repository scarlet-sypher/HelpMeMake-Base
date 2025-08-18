import React from "react";
import { User } from "lucide-react";

const MentorAboutSection = ({ mentorData }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
        <User className="mr-2 text-purple-400" size={20} />
        About
      </h2>
      <div className="space-y-4">
        <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
          {mentorData.description}
        </p>
        {mentorData.bio &&
          mentorData.bio !==
            "Experienced professional ready to share knowledge" && (
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">
                Biography
              </h4>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {mentorData.bio}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default MentorAboutSection;
