import React from "react";
import { Star, MessageSquare, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MentorCard = ({ mentor, colorScheme = "emerald" }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex-none w-72 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 transition-all duration-500 group hover:scale-105 hover:shadow-2xl mx-3 overflow-hidden ${
        colorScheme === "emerald"
          ? "hover:border-emerald-400/50"
          : colorScheme === "purple"
          ? "hover:border-purple-400/50"
          : colorScheme === "orange"
          ? "hover:border-orange-400/50"
          : colorScheme === "blue"
          ? "hover:border-blue-400/50"
          : colorScheme === "pink"
          ? "hover:border-pink-400/50"
          : colorScheme === "teal"
          ? "hover:border-teal-400/50"
          : colorScheme === "amber"
          ? "hover:border-amber-400/50"
          : "hover:border-red-400/50"
      }`}
    >
      {/* Animated background overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-2xl ${
          colorScheme === "emerald"
            ? "from-emerald-500/0 via-emerald-600/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-emerald-600/10 group-hover:to-emerald-500/10"
            : colorScheme === "purple"
            ? "from-purple-500/0 via-purple-600/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-purple-600/10 group-hover:to-purple-500/10"
            : colorScheme === "orange"
            ? "from-orange-500/0 via-orange-600/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-600/10 group-hover:to-orange-500/10"
            : colorScheme === "blue"
            ? "from-blue-500/0 via-blue-600/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-blue-600/10 group-hover:to-blue-500/10"
            : colorScheme === "pink"
            ? "from-pink-500/0 via-pink-600/0 to-pink-500/0 group-hover:from-pink-500/10 group-hover:via-pink-600/10 group-hover:to-pink-500/10"
            : colorScheme === "teal"
            ? "from-teal-500/0 via-teal-600/0 to-teal-500/0 group-hover:from-teal-500/10 group-hover:via-teal-600/10 group-hover:to-teal-500/10"
            : colorScheme === "amber"
            ? "from-amber-500/0 via-amber-600/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:via-amber-600/10 group-hover:to-amber-500/10"
            : "from-red-500/0 via-red-600/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-red-600/10 group-hover:to-red-500/10"
        }`}
      ></div>

      {/* Profile Image Section */}
      <div className="relative p-5 pb-3">
        <div className="relative w-16 h-16 mx-auto mb-3">
          {mentor.image ? (
            <img
              src={mentor.image}
              alt={mentor.name}
              className={`w-full h-full rounded-full object-cover border-2 border-white/30 transition-all duration-500 group-hover:shadow-lg ${
                colorScheme === "emerald"
                  ? "group-hover:border-emerald-400/70"
                  : colorScheme === "purple"
                  ? "group-hover:border-purple-400/70"
                  : colorScheme === "orange"
                  ? "group-hover:border-orange-400/70"
                  : colorScheme === "blue"
                  ? "group-hover:border-blue-400/70"
                  : colorScheme === "pink"
                  ? "group-hover:border-pink-400/70"
                  : colorScheme === "teal"
                  ? "group-hover:border-teal-400/70"
                  : colorScheme === "amber"
                  ? "group-hover:border-amber-400/70"
                  : "group-hover:border-red-400/70"
              }`}
            />
          ) : (
            <div
              className={`w-full h-full rounded-full border-2 border-white/30 transition-all duration-500 group-hover:shadow-lg flex items-center justify-center text-white font-bold text-lg ${
                colorScheme === "emerald"
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-500 group-hover:border-emerald-400/70"
                  : colorScheme === "purple"
                  ? "bg-gradient-to-br from-purple-400 to-purple-500 group-hover:border-purple-400/70"
                  : colorScheme === "orange"
                  ? "bg-gradient-to-br from-orange-400 to-orange-500 group-hover:border-orange-400/70"
                  : colorScheme === "blue"
                  ? "bg-gradient-to-br from-blue-400 to-blue-500 group-hover:border-blue-400/70"
                  : colorScheme === "pink"
                  ? "bg-gradient-to-br from-pink-400 to-pink-500 group-hover:border-pink-400/70"
                  : colorScheme === "teal"
                  ? "bg-gradient-to-br from-teal-400 to-teal-500 group-hover:border-teal-400/70"
                  : colorScheme === "amber"
                  ? "bg-gradient-to-br from-amber-400 to-amber-500 group-hover:border-amber-400/70"
                  : "bg-gradient-to-br from-red-400 to-red-500 group-hover:border-red-400/70"
              }`}
            >
              {mentor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < mentor.rating
                    ? "text-yellow-400 fill-current"
                    : "text-white/30"
                } transition-all duration-300`}
              />
            ))}
          </div>
          <span className="text-white/80 text-sm ml-2">({mentor.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 relative z-10">
        <h3
          className={`text-lg font-bold text-white mb-1 text-center transition-colors duration-300 ${
            colorScheme === "emerald"
              ? "group-hover:text-emerald-300"
              : colorScheme === "purple"
              ? "group-hover:text-purple-300"
              : colorScheme === "orange"
              ? "group-hover:text-orange-300"
              : colorScheme === "blue"
              ? "group-hover:text-blue-300"
              : colorScheme === "pink"
              ? "group-hover:text-pink-300"
              : colorScheme === "teal"
              ? "group-hover:text-teal-300"
              : colorScheme === "amber"
              ? "group-hover:text-amber-300"
              : "group-hover:text-red-300"
          }`}
        >
          {mentor.name}
        </h3>

        <p
          className={`text-sm font-medium mb-3 text-center ${
            colorScheme === "emerald"
              ? "text-emerald-300"
              : colorScheme === "purple"
              ? "text-purple-300"
              : colorScheme === "orange"
              ? "text-orange-300"
              : colorScheme === "blue"
              ? "text-blue-300"
              : colorScheme === "pink"
              ? "text-pink-300"
              : colorScheme === "teal"
              ? "text-teal-300"
              : colorScheme === "amber"
              ? "text-amber-300"
              : "text-red-300"
          }`}
        >
          {mentor.specialty}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-3 justify-center">
          {mentor.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/90 border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Rate */}
        <div className="text-center mb-3">
          <span
            className={`text-xl font-bold text-white transition-colors duration-300 ${
              colorScheme === "emerald"
                ? "group-hover:text-emerald-300"
                : colorScheme === "purple"
                ? "group-hover:text-purple-300"
                : colorScheme === "orange"
                ? "group-hover:text-orange-300"
                : colorScheme === "blue"
                ? "group-hover:text-blue-300"
                : colorScheme === "pink"
                ? "group-hover:text-pink-300"
                : colorScheme === "teal"
                ? "group-hover:text-teal-300"
                : colorScheme === "amber"
                ? "group-hover:text-amber-300"
                : "group-hover:text-red-300"
            }`}
          >
            ${mentor.rate}
          </span>
          <span className="text-white/70 text-sm">/hour</span>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 rounded-lg p-2.5 mb-4 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
          <p className="text-white/80 text-xs italic text-center leading-relaxed">
            "{mentor.testimonial}"
          </p>
        </div>

        {/* Action Button */}
        <button
          className={`w-full relative text-white py-2.5 px-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center overflow-hidden group-hover:shadow-lg ${
            colorScheme === "emerald"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              : colorScheme === "purple"
              ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              : colorScheme === "orange"
              ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              : colorScheme === "blue"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              : colorScheme === "pink"
              ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              : colorScheme === "teal"
              ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
              : colorScheme === "amber"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          }`}
        >
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              colorScheme === "emerald"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : colorScheme === "purple"
                ? "bg-gradient-to-r from-purple-400 to-purple-500"
                : colorScheme === "orange"
                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                : colorScheme === "blue"
                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                : colorScheme === "pink"
                ? "bg-gradient-to-r from-pink-400 to-pink-500"
                : colorScheme === "teal"
                ? "bg-gradient-to-r from-teal-400 to-teal-500"
                : colorScheme === "amber"
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : "bg-gradient-to-r from-red-400 to-red-500"
            }`}
          ></div>
          <span
            onClick={() => navigate("/signup")}
            className="relative z-10 flex items-center text-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Session
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
