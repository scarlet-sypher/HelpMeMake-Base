import React from "react";
import { DollarSign, X, Loader2, Save } from "lucide-react";

const SetClosingPriceModal = ({
  show,
  closingPrice,
  setClosingPrice,
  averagePitch,
  isSettingPrice,
  onClose,
  onSetPrice,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <DollarSign className="mr-2 text-green-400" size={20} />
            Set Closing Price
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Closing Price (₹)
            </label>
            <input
              type="number"
              value={closingPrice}
              onChange={(e) => setClosingPrice(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15"
              placeholder="Enter closing price"
              min="1"
            />
            {averagePitch > 0 && (
              <p className="text-sm text-blue-300 mt-2">
                Current average pitch: ₹{averagePitch.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
            >
              Cancel
            </button>
            <button
              onClick={onSetPrice}
              disabled={isSettingPrice || !closingPrice}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSettingPrice ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Setting...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Set Price</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetClosingPriceModal;
