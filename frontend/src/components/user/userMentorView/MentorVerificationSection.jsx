import React from "react";
import { Shield, CheckCircle, Clock } from "lucide-react";

const MentorVerificationSection = ({ mentorData }) => {
  const isVerified = mentorData.verification?.isVerified;
  const verificationLevel =
    mentorData.verification?.verificationLevel || "none";

  const getVerificationIcon = () => {
    if (isVerified) {
      return <CheckCircle className="text-green-400" size={16} />;
    }
    return <Clock className="text-yellow-400" size={16} />;
  };

  const getVerificationColor = () => {
    if (isVerified) {
      return "text-green-300";
    }
    return "text-yellow-300";
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "premium":
        return "text-purple-300";
      case "gold":
        return "text-yellow-300";
      case "silver":
        return "text-gray-300";
      case "basic":
        return "text-blue-300";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
        <Shield className="mr-2 text-cyan-400" size={20} />
        Verification
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              {getVerificationIcon()}
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Profile:</span>
          </div>
          <span
            className={`font-medium text-sm sm:text-base ${getVerificationColor()}`}
          >
            {isVerified ? "Verified" : "Pending"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Shield className="text-blue-400" size={16} />
            </div>
            <span className="text-gray-300 text-sm sm:text-base">Level:</span>
          </div>
          <span
            className={`font-medium text-sm sm:text-base capitalize ${getLevelColor(
              verificationLevel
            )}`}
          >
            {verificationLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MentorVerificationSection;
