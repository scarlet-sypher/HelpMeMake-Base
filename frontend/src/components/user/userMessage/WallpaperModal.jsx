import React from "react";
import { X, Upload } from "lucide-react";

const WallpaperModal = ({
  showWallpaperModal,
  setShowWallpaperModal,
  wallpaperUrl,
  setWallpaperUrl,
  predefinedWallpapers,
  handleCustomWallpaperUpload,
  customWallpaper,
  uploadingWallpaper,
  updateWallpaperInRoom,
}) => {
  if (!showWallpaperModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Change Wallpaper</h3>
          <button
            onClick={() => setShowWallpaperModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close wallpaper modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter Custom URL
            </label>
            <input
              type="url"
              value={wallpaperUrl}
              onChange={(e) => setWallpaperUrl(e.target.value)}
              placeholder="https://example.com/wallpaper.jpg"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preset Wallpapers
            </label>
            <div className="grid grid-cols-3 gap-3">
              {predefinedWallpapers.map((wallpaper, index) => (
                <div key={index} className="relative">
                  {wallpaper === "upload-slot" ? (
                    <>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleCustomWallpaperUpload}
                        disabled={uploadingWallpaper}
                        className="hidden"
                        id={`wallpaper-upload-${index}`}
                      />
                      <label
                        htmlFor={`wallpaper-upload-${index}`}
                        className={`w-full h-20 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          uploadingWallpaper
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-blue-500/10"
                        }`}
                        title="Upload a wallpaper"
                        aria-label="Upload wallpaper"
                      >
                        {uploadingWallpaper ? (
                          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : customWallpaper ? (
                          <div
                            className="w-full h-full rounded-lg bg-cover bg-center relative overflow-hidden"
                            style={{
                              backgroundImage: `url(${customWallpaper})`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
                                Custom
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload size={18} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400 text-center">
                              Upload
                            </span>
                          </>
                        )}
                      </label>
                    </>
                  ) : (
                    <button
                      onClick={() => setWallpaperUrl(wallpaper)}
                      className={`w-full h-20 rounded-lg border-2 transition-all relative overflow-hidden group ${
                        wallpaperUrl === wallpaper
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      style={{
                        backgroundImage: `url(${wallpaper})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      title={`Wallpaper ${index + 1}`}
                      aria-label={`Select wallpaper ${index + 1}`}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"></div>

                      {wallpaperUrl === wallpaper && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-1 left-1 right-1">
                        <span className="text-xs text-white bg-black/50 px-2 py-0.5 rounded text-center block">
                          {index === 0 ? "Default" : `Style ${index}`}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowWallpaperModal(false)}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => updateWallpaperInRoom(wallpaperUrl)}
              disabled={!wallpaperUrl.trim() || uploadingWallpaper}
              className={`flex-1 px-4 py-2 rounded-xl transition-colors ${
                wallpaperUrl.trim() && !uploadingWallpaper
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-500 text-gray-400 cursor-not-allowed"
              }`}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperModal;
