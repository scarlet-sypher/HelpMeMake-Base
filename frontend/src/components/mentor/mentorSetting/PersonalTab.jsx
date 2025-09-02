import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  X,
  Clock,
  Globe,
  Star,
  Award,
  Users,
  BookOpen,
  Languages,
  Target,
  Loader,
  CheckCircle,
} from "lucide-react";

const PersonalTab = ({
  personalData,
  setPersonalData,
  handlePersonalUpdate,
  loadingStates,
  notifications,
}) => {
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddExpertise, setShowAddExpertise] = useState(false);
  const [showAddSpecialization, setShowAddSpecialization] = useState(false);

  const NotificationComponent = ({ notification }) => {
    if (!notification) return null;

    return (
      <div
        className={`relative overflow-hidden p-4 rounded-2xl mb-6 flex items-center space-x-3 backdrop-blur-sm border transition-all duration-500 animate-slide-in ${
          notification.status === "success"
            ? "bg-cyan-700/30 border-cyan-500/50 text-cyan-200 shadow-cyan-600/20"
            : "bg-slate-800/40 border-slate-600/50 text-slate-300 shadow-slate-700/25"
        } shadow-xl`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r opacity-5 animate-pulse"
          style={{
            background:
              notification.status === "success"
                ? "linear-gradient(45deg, #0891b2, #0e7490)"
                : "linear-gradient(45deg, #374151, #1f2937)",
          }}
        />
        <div className="relative z-10 flex items-center space-x-3">
          {notification.status === "success" ? (
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

  const addCompany = () => {
    const newCompany = {
      name: "",
      position: "",
      duration: "",
      description: "",
    };
    setPersonalData({
      ...personalData,
      experience: {
        ...personalData.experience,
        companies: [...personalData.experience.companies, newCompany],
      },
    });
  };

  const removeCompany = (index) => {
    const updatedCompanies = personalData.experience.companies.filter(
      (_, i) => i !== index
    );
    setPersonalData({
      ...personalData,
      experience: {
        ...personalData.experience,
        companies: updatedCompanies,
      },
    });
  };

  const updateCompany = (index, field, value) => {
    const updatedCompanies = personalData.experience.companies.map(
      (company, i) => (i === index ? { ...company, [field]: value } : company)
    );
    setPersonalData({
      ...personalData,
      experience: {
        ...personalData.experience,
        companies: updatedCompanies,
      },
    });
  };

  const addExpertise = () => {
    const newExpertise = {
      skill: "",
      level: "intermediate",
      yearsOfExperience: 0,
    };
    setPersonalData({
      ...personalData,
      expertise: [...personalData.expertise, newExpertise],
    });
    setShowAddExpertise(false);
  };

  const removeExpertise = (index) => {
    const updatedExpertise = personalData.expertise.filter(
      (_, i) => i !== index
    );
    setPersonalData({
      ...personalData,
      expertise: updatedExpertise,
    });
  };

  const updateExpertise = (index, field, value) => {
    const updatedExpertise = personalData.expertise.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setPersonalData({
      ...personalData,
      expertise: updatedExpertise,
    });
  };

  const addSpecialization = (specialization) => {
    if (
      specialization.trim() &&
      !personalData.specializations.includes(specialization.trim())
    ) {
      setPersonalData({
        ...personalData,
        specializations: [
          ...personalData.specializations,
          specialization.trim(),
        ],
      });
    }
    setShowAddSpecialization(false);
  };

  const removeSpecialization = (index) => {
    const updatedSpecializations = personalData.specializations.filter(
      (_, i) => i !== index
    );
    setPersonalData({
      ...personalData,
      specializations: updatedSpecializations,
    });
  };

  const updateTeachingPreference = (field, value) => {
    setPersonalData({
      ...personalData,
      teachingPreferences: {
        ...personalData.teachingPreferences,
        [field]: value,
      },
    });
  };

  const addLanguage = (language) => {
    if (
      language.trim() &&
      !personalData.teachingPreferences.languages.includes(language.trim())
    ) {
      setPersonalData({
        ...personalData,
        teachingPreferences: {
          ...personalData.teachingPreferences,
          languages: [
            ...personalData.teachingPreferences.languages,
            language.trim(),
          ],
        },
      });
    }
  };

  const removeLanguage = (index) => {
    const updatedLanguages = personalData.teachingPreferences.languages.filter(
      (_, i) => i !== index
    );
    setPersonalData({
      ...personalData,
      teachingPreferences: {
        ...personalData.teachingPreferences,
        languages: updatedLanguages,
      },
    });
  };

  const timezones = [
    "UTC",
    "EST",
    "CST",
    "MST",
    "PST",
    "GMT",
    "CET",
    "IST",
    "JST",
    "AEST",
  ];

  const sessionTypes = ["one-on-one", "group", "workshop", "code-review"];
  const skillLevels = ["beginner", "intermediate", "advanced", "expert"];
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <NotificationComponent notification={notifications.personal} />

      <form onSubmit={handlePersonalUpdate} className="space-y-8">
        <div className="relative group/experience">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl blur opacity-15 group-hover/experience:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-700 rounded-xl">
                  <Briefcase className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Professional Experience
                </h3>
              </div>
              <button
                type="button"
                onClick={addCompany}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white rounded-xl font-medium transition-all transform hover:scale-105"
              >
                <Plus size={16} />
                <span>Add Company</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Total Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={personalData.experience?.years || 0}
                  onChange={(e) =>
                    setPersonalData({
                      ...personalData,
                      experience: {
                        ...personalData.experience,
                        years: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/15 transition-all duration-300"
                  placeholder="Years of experience"
                />
              </div>
            </div>

            <div className="space-y-4">
              {personalData.experience?.companies?.map((company, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-cyan-200">
                      Company {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCompany(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        updateCompany(index, "name", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder="Company name"
                    />
                    <input
                      type="text"
                      value={company.position}
                      onChange={(e) =>
                        updateCompany(index, "position", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      value={company.duration}
                      onChange={(e) =>
                        updateCompany(index, "duration", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all"
                      placeholder="Duration (e.g., 2019-2023)"
                    />
                    <textarea
                      value={company.description}
                      onChange={(e) =>
                        updateCompany(index, "description", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                      placeholder="Brief description"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group/expertise">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl blur opacity-15 group-hover/expertise:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-xl">
                  <Star className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Expertise & Skills
                </h3>
              </div>
              <button
                type="button"
                onClick={addExpertise}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl font-medium transition-all transform hover:scale-105"
              >
                <Plus size={16} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-4">
              {personalData.expertise?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-teal-200">
                      Skill {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={skill.skill}
                      onChange={(e) =>
                        updateExpertise(index, "skill", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-all"
                      placeholder="Skill name (e.g., JavaScript)"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) =>
                        updateExpertise(index, "level", e.target.value)
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-teal-400 transition-all appearance-none"
                    >
                      {skillLevels.map((level) => (
                        <option
                          key={level}
                          value={level}
                          className="bg-slate-800 text-white"
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={skill.yearsOfExperience}
                      onChange={(e) =>
                        updateExpertise(
                          index,
                          "yearsOfExperience",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-all"
                      placeholder="Years"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group/specializations">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl blur opacity-15 group-hover/specializations:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl">
                  <Target className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Specializations
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {personalData.specializations?.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-indigo-600/20 border border-indigo-400/30 rounded-xl px-3 py-2"
                  >
                    <span className="text-indigo-200 font-medium">{spec}</span>
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="text-indigo-300 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddSpecialization(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all transform hover:scale-105"
                >
                  <Plus size={16} />
                  <span>Add Specialization</span>
                </button>
              </div>

              {showAddSpecialization && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecialization(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-all"
                    placeholder="Enter specialization (e.g., Full Stack Development)"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddSpecialization(false)}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative group/teaching">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl blur opacity-15 group-hover/teaching:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-700 rounded-xl">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Teaching Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Max Students Per Session
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={
                    personalData.teachingPreferences?.maxStudentsPerSession || 1
                  }
                  onChange={(e) =>
                    updateTeachingPreference(
                      "maxStudentsPerSession",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Session Types
                </label>
                <div className="space-y-2">
                  {sessionTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-3 text-white"
                    >
                      <input
                        type="checkbox"
                        checked={
                          personalData.teachingPreferences?.sessionTypes?.includes(
                            type
                          ) || false
                        }
                        onChange={(e) => {
                          const currentTypes =
                            personalData.teachingPreferences?.sessionTypes ||
                            [];
                          const updatedTypes = e.target.checked
                            ? [...currentTypes, type]
                            : currentTypes.filter((t) => t !== type);
                          updateTeachingPreference(
                            "sessionTypes",
                            updatedTypes
                          );
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="capitalize">
                        {type.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Languages className="inline mr-2" size={16} />
                Languages
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {personalData.teachingPreferences?.languages?.map(
                  (lang, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-purple-600/20 border border-purple-400/30 rounded-xl px-3 py-2"
                    >
                      <span className="text-purple-200 font-medium">
                        {lang}
                      </span>
                      {personalData.teachingPreferences.languages.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="text-purple-300 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLanguage(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all"
                placeholder="Add a language and press Enter"
              />
            </div>
          </div>
        </div>

        <div className="relative group/availability">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl blur opacity-15 group-hover/availability:opacity-20 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 lg:p-8 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl">
                <Clock className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Availability Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  <Globe className="inline mr-2" size={16} />
                  Timezone
                </label>
                <select
                  value={personalData.availability?.timezone || "UTC"}
                  onChange={(e) =>
                    setPersonalData({
                      ...personalData,
                      availability: {
                        ...personalData.availability,
                        timezone: e.target.value,
                      },
                    })
                  }
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 transition-all appearance-none"
                >
                  {timezones.map((tz) => (
                    <option
                      key={tz}
                      value={tz}
                      className="bg-slate-800 text-white"
                    >
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loadingStates.personal}
            className="relative group overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-700 hover:via-teal-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loadingStates.personal ? (
              <Loader className="animate-spin relative z-10" size={20} />
            ) : (
              <CheckCircle className="relative z-10" size={20} />
            )}
            <span className="relative z-10">
              {loadingStates.personal
                ? "Updating..."
                : "Update Professional Details"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalTab;
