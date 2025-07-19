import { useRef } from "react";

const ImageUploader = ({ onImageChange, preview, error }) => {
  const handleImageClick = () => {
    document.getElementById('imageUpload').click();
  };

  return (
    <div className="group text-center">
      <label className="block mb-4 font-medium text-emerald-200 group-hover:text-cyan-400 transition-colors duration-300">
        Profile Picture
      </label>
      <div
        onClick={handleImageClick}
        className="relative w-28 h-28 mx-auto mb-4 cursor-pointer group-hover:scale-110 transition-all duration-300 hover:rotate-3"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Profile preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-r from-emerald-400 to-cyan-400 shadow-xl animate-float"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-sm font-medium">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-4 border-dashed border-cyan-400 flex items-center justify-center hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 animate-pulse">
            <span className="text-cyan-300 text-3xl animate-bounce">📸</span>
          </div>
        )}
      </div>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
        aria-label="Upload profile picture"
      />
      <p className="text-emerald-300 text-sm hover:text-cyan-400 transition-colors">Click to upload your avatar</p>
      {error && <p className="text-red-400 text-sm mt-1 animate-slideInLeft">{error}</p>}
    </div>
  );
};
export default ImageUploader ;