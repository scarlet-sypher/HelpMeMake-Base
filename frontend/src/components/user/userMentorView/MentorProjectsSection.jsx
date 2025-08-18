import React from "react";
import { Briefcase } from "lucide-react";
import ProjectCard from "../../user/userProject/ProjectCard";

const MentorProjectsSection = ({
  mentorProjects,
  projectsLoading,
  API_URL,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20 mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Briefcase className="mr-2 text-green-400" size={24} />
        Completed Projects
        <span className="ml-3 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          {mentorProjects.length}
        </span>
      </h3>

      {projectsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-sm sm:text-base">
            Loading projects...
          </div>
        </div>
      ) : mentorProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mentorProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              API_URL={API_URL}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
          <h4 className="text-xl font-bold text-white mb-2">No Projects Yet</h4>
          <p className="text-gray-300 text-sm sm:text-base">
            This mentor hasn't completed any projects yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorProjectsSection;
