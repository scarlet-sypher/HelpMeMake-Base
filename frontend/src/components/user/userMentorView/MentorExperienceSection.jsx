import React from "react";
import {
  Activity,
  Shield,
  Briefcase,
  Calendar,
  MapPin,
  TrendingUp,
  Building,
  Clock,
  Award,
  Star,
} from "lucide-react";

const MentorExperienceSection = ({ mentorData }) => {
  const totalExperience = mentorData.experience?.years || 0;
  const companies = mentorData.experience?.companies || [];

  const getCompanyIcon = (companyName) => {
    const name = companyName?.toLowerCase() || "";
    if (
      name.includes("tech") ||
      name.includes("software") ||
      name.includes("digital")
    ) {
      return <TrendingUp className="text-cyan-400" size={18} />;
    } else if (name.includes("startup") || name.includes("innovation")) {
      return <Star className="text-yellow-400" size={18} />;
    }
    return <Building className="text-blue-400" size={18} />;
  };

  const getDurationInMonths = (duration) => {
    if (!duration) return 0;
    const durationStr = duration.toLowerCase();

    if (durationStr.includes("year")) {
      const years = parseFloat(durationStr.match(/[\d.]+/)?.[0] || 0);
      return years * 12;
    } else if (durationStr.includes("month")) {
      return parseFloat(durationStr.match(/[\d.]+/)?.[0] || 0);
    }
    return 6; // default 6 months
  };

  return (
    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 overflow-hidden group">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: "25px 25px",
        }}
      ></div>

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Professional Journey
              </h2>
              <p className="text-gray-400 text-sm">
                Career experience and background
              </p>
            </div>
          </div>
          <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
        </div>

        {/* Experience Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total Experience Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/30 text-center group/card hover:scale-105 transition-all duration-300">
            <div className="p-3 bg-blue-500/20 rounded-xl inline-flex mb-3 group-hover/card:scale-110 transition-transform duration-300">
              <Shield className="text-blue-400" size={24} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
              {totalExperience}
            </div>
            <div className="text-blue-200 text-sm font-medium">
              Years Experience
            </div>
          </div>

          {/* Companies Count */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30 text-center group/card hover:scale-105 transition-all duration-300">
            <div className="p-3 bg-emerald-500/20 rounded-xl inline-flex mb-3 group-hover/card:scale-110 transition-transform duration-300">
              <Briefcase className="text-emerald-400" size={24} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-1">
              {companies.length}
            </div>
            <div className="text-emerald-200 text-sm font-medium">
              Companies
            </div>
          </div>

          {/* Average Duration */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-400/30 text-center group/card hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-amber-500/20 rounded-xl inline-flex mb-3 group-hover/card:scale-110 transition-transform duration-300">
              <Clock className="text-amber-400" size={24} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1">
              {companies.length > 0
                ? Math.round(
                    companies.reduce(
                      (acc, comp) => acc + getDurationInMonths(comp.duration),
                      0
                    ) / companies.length
                  )
                : 0}
            </div>
            <div className="text-amber-200 text-sm font-medium">
              Avg. Months
            </div>
          </div>
        </div>

        {/* Companies Experience */}
        {companies && companies.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                <Building className="text-purple-400" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-white">Work History</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
            </div>

            <div className="space-y-4">
              {companies.map((company, index) => {
                const durationMonths = getDurationInMonths(company.duration);
                const maxMonths = Math.max(
                  ...companies.map((c) => getDurationInMonths(c.duration))
                );
                const widthPercentage =
                  maxMonths > 0 ? (durationMonths / maxMonths) * 100 : 0;

                return (
                  <div
                    key={index}
                    className="group/company relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
                  >
                    {/* Company header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 bg-white/10 rounded-xl group-hover/company:scale-110 transition-transform duration-300">
                          {getCompanyIcon(company.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-semibold text-lg mb-1 leading-tight">
                            {company.position}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-blue-300 font-medium">
                              {company.name}
                            </p>
                            {company.location && (
                              <>
                                <span className="text-gray-500">•</span>
                                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                                  <MapPin size={12} />
                                  <span>{company.location}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-lg border border-cyan-400/30 flex items-center space-x-2">
                          <Calendar size={14} className="text-cyan-400" />
                          <span className="text-cyan-200 text-sm font-medium">
                            {company.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Duration visualization */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Duration</span>
                        <span>{durationMonths} months</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${widthPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Description */}
                    {company.description && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {company.description}
                        </p>
                      </div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-2xl opacity-0 group-hover/company:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Activity className="text-gray-400" size={40} />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Award size={16} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No Work Experience Listed
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              This mentor hasn't added their professional experience information
              yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorExperienceSection;
