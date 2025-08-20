import React from "react";
import { Lightbulb } from "lucide-react";

const ProjectDetails = ({ formData, setFormData, errors, onToast }) => {
  const knowledgeLevels = [
    "Complete Beginner",
    "Some Knowledge",
    "Good Understanding",
    "Advanced Knowledge",
  ];

  const handleDescriptionChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Show helpful feedback based on content length
    if (
      field === "fullDescription" &&
      value.length >= 200 &&
      value.length <= 300
    ) {
      onToast?.({
        message: "Great! Your description is detailed enough",
        status: "success",
      });
    } else if (
      field === "projectOutcome" &&
      value.length >= 50 &&
      value.length <= 100
    ) {
      onToast?.({
        message: "Perfect outcome description length",
        status: "success",
      });
    } else if (
      field === "motivation" &&
      value.length >= 50 &&
      value.length <= 100
    ) {
      onToast?.({ message: "Good motivation explanation", status: "success" });
    }
  };

  const handleKnowledgeLevelChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, knowledgeLevel: value });

    if (value) {
      onToast?.({
        message: `Knowledge level set to ${value}`,
        status: "success",
      });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mr-4">
          <Lightbulb className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Project Details</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Full Description *
          </label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) =>
              handleDescriptionChange("fullDescription", e.target.value)
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm resize-none"
            placeholder="Detailed description of your project requirements, features, and expectations"
            rows={6}
            maxLength={5000}
          />
          <div className="text-right text-sm text-white/50 mt-1">
            {formData.fullDescription.length}/5000
          </div>
          {errors.fullDescription && (
            <p className="text-red-400 text-sm mt-1">
              {errors.fullDescription}
            </p>
          )}
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Project Outcome *
          </label>
          <textarea
            value={formData.projectOutcome}
            onChange={(e) =>
              handleDescriptionChange("projectOutcome", e.target.value)
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm resize-none"
            placeholder="What do you expect to achieve from this project?"
            rows={3}
            maxLength={1000}
          />
          <div className="text-right text-sm text-white/50 mt-1">
            {formData.projectOutcome.length}/1000
          </div>
          {errors.projectOutcome && (
            <p className="text-red-400 text-sm mt-1">{errors.projectOutcome}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Motivation *
          </label>
          <textarea
            value={formData.motivation}
            onChange={(e) =>
              handleDescriptionChange("motivation", e.target.value)
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm resize-none"
            placeholder="Why do you want to build this project?"
            rows={3}
            maxLength={1000}
          />
          <div className="text-right text-sm text-white/50 mt-1">
            {formData.motivation.length}/1000
          </div>
          {errors.motivation && (
            <p className="text-red-400 text-sm mt-1">{errors.motivation}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Your Knowledge Level *
          </label>
          <select
            value={formData.knowledgeLevel}
            onChange={handleKnowledgeLevelChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
          >
            <option value="" className="bg-slate-800">
              Select your knowledge level
            </option>
            {knowledgeLevels.map((level) => (
              <option key={level} value={level} className="bg-slate-800">
                {level}
              </option>
            ))}
          </select>
          {errors.knowledgeLevel && (
            <p className="text-red-400 text-sm mt-1">{errors.knowledgeLevel}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
