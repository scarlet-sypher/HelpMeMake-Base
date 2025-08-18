import React from "react";
import { Activity, Shield, Briefcase } from "lucide-react";

const MentorExperienceSection = ({ mentorData }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Activity className="mr-2 text-blue-400" size={20} />
        Professional Experience
      </h2>

      <div className="space-y-6">
        {/* Total Experience Card */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="text-blue-400" size={20} />
            </div>
            <span className="text-white font-semibold text-sm sm:text-base">
              Total Experience
            </span>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-blue-400">
            {mentorData.experience?.years || 0}
            <span className="text-lg sm:text-xl ml-2 text-gray-300">years</span>
          </p>
        </div>

        {/* Companies Experience */}
        {mentorData.experience?.companies &&
          mentorData.experience.companies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center text-sm sm:text-base">
                <Briefcase className="mr-2 text-green-400" size={18} />
                Previous Companies
              </h3>
              <div className="space-y-3">
                {mentorData.experience.companies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm sm:text-base">
                          {company.position}
                        </h4>
                        <p className="text-blue-300 text-sm">{company.name}</p>
                      </div>
                      <div className="text-gray-300 text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-lg self-start lg:self-auto">
                        {company.duration}
                      </div>
                    </div>
                    {company.description && (
                      <p className="text-gray-200 text-xs sm:text-sm mt-3 leading-relaxed">
                        {company.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Empty State */}
        {(!mentorData.experience?.companies ||
          mentorData.experience.companies.length === 0) &&
          (!mentorData.experience?.years ||
            mentorData.experience.years === 0) && (
            <div className="text-center py-8">
              <Activity className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-400 text-sm sm:text-base">
                No professional experience information provided.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default MentorExperienceSection;
