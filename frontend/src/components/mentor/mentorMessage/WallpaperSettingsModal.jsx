import React from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";

const WallpaperSettingsModal = ({
  showWallpaperSettings,
  setShowWallpaperSettings,
  wallpaperPresets,
  selectedRoom,
  updateWallpaper,
  handleCustomWallpaperUpload,
  customWallpaper,
  setCustomWallpaper,
  uploadingWallpaper,
  onToast,
}) => {
  if (!showWallpaperSettings) return null;

  const handleWallpaperUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onToast({ message: "File size must be less than 10MB", status: "error" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onToast({
        message: "Please select a JPEG, PNG, or WebP image",
        status: "error",
      });
      return;
    }

    try {
      const result = await handleCustomWallpaperUpload(event);
      if (result?.success) {
        onToast({
          message: "Wallpaper uploaded and applied successfully!",
          status: "success",
        });
      }
    } catch (error) {
      onToast({ message: "Failed to upload wallpaper", status: "error" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Chat Wallpaper</h3>
          <button
            onClick={() => setShowWallpaperSettings(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Preset Wallpapers
            </label>
            <div className="grid grid-cols-2 gap-3 pr-2">
              {wallpaperPresets.map((wallpaper, index) => (
                <div key={index} className="relative">
                  {wallpaper === "upload-slot" ? (
                    <>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleWallpaperUpload}
                        disabled={uploadingWallpaper}
                        className="hidden"
                        id={`wallpaper-upload-${index}`}
                      />
                      <label
                        htmlFor={`wallpaper-upload-${index}`}
                        className={`relative h-20 rounded-lg border-2 border-dashed border-white/30 hover:border-cyan-500 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer group ${
                          uploadingWallpaper
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-cyan-500/10 hover:scale-105"
                        }`}
                        title="Upload custom wallpaper"
                      >
                        {uploadingWallpaper ? (
                          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Upload
                              size={18}
                              className="text-gray-400 group-hover:text-cyan-400 mb-1 transition-colors"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-cyan-400 text-center transition-colors">
                              Upload
                            </span>
                          </>
                        )}
                      </label>
                    </>
                  ) : (
                    <button
                      onClick={() => updateWallpaper(wallpaper)}
                      className={`relative h-20 w-full rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 group ${
                        selectedRoom?.mentorWallpaper === wallpaper
                          ? "border-cyan-500 ring-2 ring-cyan-500/50"
                          : "border-white/20 hover:border-cyan-400"
                      }`}
                      title={`Wallpaper ${index + 1}`}
                    >
                      <img
                        src={wallpaper}
                        alt={`Wallpaper ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "/uploads/wallpapers/default-mentor.jpg";
                        }}
                      />

                      <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors"></div>

                      {selectedRoom?.mentorWallpaper === wallpaper && (
                        <div className="absolute top-1 right-1 p-1 bg-cyan-500 rounded-full">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 px-2 py-1 rounded text-xs text-white">
                          Select
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Custom Wallpaper URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customWallpaper}
                onChange={(e) => setCustomWallpaper(e.target.value)}
                placeholder="https://example.com/wallpaper.jpg"
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => updateWallpaper(customWallpaper)}
                disabled={!customWallpaper.trim() || uploadingWallpaper}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperSettingsModal;
