import React from "react";
import {
  DollarSign,
  Clock,
  Gift,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MentorPricingSection = ({ mentorData }) => {
  const formatPrice = (price, currency = "USD") => {
    if (!price || price === 0) return "Free";
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return formattedPrice;
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 group">
      {/* Header with animated gradient */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center">
          <div className="relative mr-3">
            <DollarSign className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
          </div>
          Pricing
        </h2>
        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full animate-pulse"></div>
      </div>

      <div className="space-y-6">
        {/* Main Pricing Card */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-2xl"></div>
          <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatPrice(
                    mentorData.pricing?.hourlyRate,
                    mentorData.pricing?.currency
                  )}
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide">
                  per hour
                </div>
              </div>

              {/* Pricing tier indicator */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
                  {mentorData.pricing?.hourlyRate > 100
                    ? "Premium"
                    : mentorData.pricing?.hourlyRate > 50
                    ? "Professional"
                    : "Standard"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Free Sessions Card */}
        {mentorData.pricing?.freeSessionsOffered > 0 && (
          <div className="relative group/card">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-indigo-500/20 rounded-2xl"></div>
            <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Gift className="w-6 h-6 text-blue-400 group-hover/card:rotate-12 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover/card:scale-150 transition-transform duration-300"></div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">
                      {mentorData.pricing.freeSessionsOffered} Free Session
                      {mentorData.pricing.freeSessionsOffered > 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-gray-400">
                      Trial opportunity
                    </div>
                  </div>
                </div>
                <div className="text-2xl">🎁</div>
              </div>
            </div>
          </div>
        )}

        {/* Availability Status */}
        <div className="relative group/status">
          <div
            className={`absolute inset-0 rounded-2xl ${
              mentorData.isAvailable
                ? "bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-teal-500/20"
                : "bg-gradient-to-br from-red-500/20 via-pink-500/15 to-rose-500/20"
            }`}
          ></div>
          <div
            className={`relative bg-black/20 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 ${
              mentorData.isAvailable
                ? "border-green-500/20 hover:border-green-400/40"
                : "border-red-500/20 hover:border-red-400/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {mentorData.isAvailable ? (
                    <CheckCircle className="w-6 h-6 text-green-400 group-hover/status:scale-110 transition-transform duration-300" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 group-hover/status:scale-110 transition-transform duration-300" />
                  )}
                  <div
                    className={`absolute inset-0 rounded-full scale-0 group-hover/status:scale-150 transition-transform duration-300 ${
                      mentorData.isAvailable
                        ? "bg-green-400/20"
                        : "bg-red-400/20"
                    }`}
                  ></div>
                </div>
                <div>
                  <div
                    className={`font-bold text-base ${
                      mentorData.isAvailable ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {mentorData.isAvailable
                      ? "Available Now"
                      : "Currently Busy"}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{mentorData.availability?.timezone || "UTC"}</span>
                  </div>
                </div>
              </div>

              {/* Status indicator dot */}
              <div className="relative">
                <div
                  className={`w-3 h-3 rounded-full ${
                    mentorData.isAvailable ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <div
                  className={`absolute inset-0 rounded-full animate-ping ${
                    mentorData.isAvailable ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
    </div>
  );
};

export default MentorPricingSection;
