import React from "react";
import { DollarSign, AlertCircle } from "lucide-react";

const Pricing = ({ formData, setFormData, errors, onToast }) => {
  const handlePriceChange = (e) => {
    const value = e.target.value;

    // Allow empty value for user to clear field
    if (value === "") {
      setFormData({ ...formData, openingPrice: value });
      return;
    }

    const numericValue = parseFloat(value);

    // Validate price range
    if (numericValue < 0) {
      onToast?.({ message: "Price cannot be negative", status: "error" });
      return;
    }

    if (numericValue > 1000000) {
      onToast?.({ message: "Price cannot exceed ₹10,00,000", status: "error" });
      return;
    }

    setFormData({ ...formData, openingPrice: value });

    // Show success message for valid price
    if (numericValue >= 500) {
      onToast?.({ message: "Price updated successfully", status: "success" });
    }
  };
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4">
          <DollarSign className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">Pricing Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-white font-medium mb-2">
            Opening Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
              ₹
            </span>
            <input
              type="number"
              value={formData.openingPrice}
              onChange={handlePriceChange}
              className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
              placeholder="0"
              min="0"
              step="100"
            />
          </div>
          {errors.openingPrice && (
            <p className="text-red-400 text-sm mt-1">{errors.openingPrice}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
          >
            <option value="INR" className="bg-slate-800">
              INR (₹)
            </option>
            <option value="USD" className="bg-slate-800">
              USD ($)
            </option>
            <option value="EUR" className="bg-slate-800">
              EUR (€)
            </option>
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
        <div className="flex items-start">
          <AlertCircle
            className="text-yellow-400 mr-3 mt-1 flex-shrink-0"
            size={20}
          />
          <div>
            <h4 className="text-yellow-200 font-medium mb-1">
              Pricing Guidelines
            </h4>
            <p className="text-yellow-200/80 text-sm">
              This is your starting price. Mentors can propose different
              amounts, and you can negotiate the final price before starting the
              project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
