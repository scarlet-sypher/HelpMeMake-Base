import { useRef } from "react";

const ImageUploader = ({ onImageChange, preview, error }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="group text-center">
      <label className="block mb-4 font-medium text-purple-200">
        Profile Picture
      </label>
      <div
        onClick={handleImageClick}
        className="relative w-24 h-24 mx-auto mb-4 cursor-pointer group-hover:scale-105 transition-transform duration-300"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-purple-400 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-dashed border-purple-400 flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
            <span className="text-purple-300 text-2xl">📸</span>
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs">Change</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
        aria-label="Upload profile picture"
      />
      <p className="text-purple-300 text-sm">Click to upload photo</p>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader ;