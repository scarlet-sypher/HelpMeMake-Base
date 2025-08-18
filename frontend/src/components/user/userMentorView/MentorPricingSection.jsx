import React from "react";
import { DollarSign, Clock, Gift } from "lucide-react";

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
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
        <DollarSign className="mr-2 text-green-400" size={20} />
        Pricing & Availability
      </h2>

      <div className="space-y-4">
        {/* Hourly Rate */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-4 sm:p-6 border border-green-500/20">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">
              {formatPrice(
                mentorData.pricing?.hourlyRate,
                mentorData.pricing?.currency
              )}
            </div>
            <div className="text-sm text-gray-300">per hour</div>
          </div>
        </div>

        {/* Free Sessions */}
        {mentorData.pricing?.freeSessionsOffered > 0 && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-500/20">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Gift className="text-blue-400" size={20} />
                <div className="text-lg sm:text-xl font-bold text-blue-400">
                  {mentorData.pricing.freeSessionsOffered}
                </div>
              </div>
              <div className="text-sm text-gray-300">free sessions offered</div>
            </div>
          </div>
        )}

        {/* Availability Status */}
        <div
          className={`p-4 rounded-xl text-center border ${
            mentorData.isAvailable
              ? "bg-green-500/20 border-green-500/30"
              : "bg-red-500/20 border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock
              className={`${
                mentorData.isAvailable ? "text-green-400" : "text-red-400"
              }`}
              size={20}
            />
            <div
              className={`font-semibold text-sm sm:text-base ${
                mentorData.isAvailable ? "text-green-300" : "text-red-300"
              }`}
            >
              {mentorData.isAvailable ? "Available" : "Busy"}
            </div>
          </div>
          <div className="text-xs text-gray-300">
            Timezone: {mentorData.availability?.timezone || "UTC"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPricingSection;
