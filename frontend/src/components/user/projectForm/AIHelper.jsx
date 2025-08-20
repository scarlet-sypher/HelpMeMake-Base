import React, { useState } from "react";
import axios from "axios";
import {
  Image,
  FileText,
  Wand2,
  Copy,
  Download,
  Loader,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";

const AIHelper = ({ formData, setFormData, onToast }) => {
  const [imagePrompt, setImagePrompt] = useState("");
  const [descriptionPrompt, setDescriptionPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [generatedDescriptions, setGeneratedDescriptions] = useState({
    short: "",
    long: "",
  });
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [toast, setToast] = useState(null);

  const handleImageGenerate = async () => {
    if (!imagePrompt.trim()) {
      onToast?.({ message: "Please enter an image prompt", status: "error" });
      return;
    }

    // Clear previous image before generating new one
    setGeneratedImage("");
    if (formData.thumbnail) {
      setFormData((prev) => ({ ...prev, thumbnail: "" }));
    }

    setLoadingImage(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-image`,
        {
          prompt: imagePrompt,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data.success) {
        // Set the generated image URL to both local state and form data
        setGeneratedImage(response.data.imageUrl);
        setFormData((prev) => ({
          ...prev,
          thumbnail: response.data.imageUrl,
        }));

        onToast?.({
          message: "🎉 AI image generated successfully!",
          status: "success",
        });
      }
    } catch (error) {
      console.error("Real image generation error:", error);

      // Handle specific error messages
      if (error.response?.status === 400) {
        onToast?.({
          message: "Invalid prompt. Please try a different description.",
          status: "error",
        });
      } else if (error.response?.status === 429) {
        onToast?.({
          message:
            "Daily AI image generation limit reached. Please try again tomorrow.",
          status: "error",
        });
      } else if (error.response?.status === 503) {
        onToast?.({
          message:
            "AI image service temporarily unavailable. Please try again later.",
          status: "error",
        });
      } else {
        onToast?.({
          message: "Failed to generate image. Please try again.",
          status: "error",
        });
      }
    } finally {
      setLoadingImage(false);
    }
  };

  const handleImageDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-project-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      onToast?.({
        message: "Image downloaded successfully!",
        status: "success",
      });
    } catch (error) {
      onToast?.({ message: "Failed to download image", status: "error" });
    }
  };

  const handleDescriptionGenerate = async () => {
    if (!descriptionPrompt.trim()) {
      onToast?.({
        message: "Please enter a description prompt",
        status: "error",
      });
      return;
    }

    setLoadingDescription(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate-description`,
        {
          prompt: descriptionPrompt,
          type: "both",
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data.success) {
        setGeneratedDescriptions({
          short: response.data.shortDescription,
          long: response.data.longDescription,
        });
        onToast?.({
          message: "Descriptions generated successfully!",
          status: "success",
        });
      }
    } catch (error) {
      console.error("Description generation error:", error);
      onToast?.({
        message:
          error.response?.data?.message || "Failed to generate descriptions",
        status: "error",
      });
    } finally {
      setLoadingDescription(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    onToast?.({ message: "Copied to clipboard!", status: "success" });
  };

  const applyToForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onToast?.({
      message: `Applied to ${
        field === "shortDescription" ? "short" : "full"
      } description!`,
      status: "success",
    });
  };

  const clearGeneratedImage = () => {
    setGeneratedImage("");
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    onToast?.({ message: "Image cleared", status: "info" });
  };

  return (
    <div className="space-y-6">
      {/* Image Generator Block */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-3">
            <Image className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              AI Image Generator
            </h3>
            <p className="text-blue-200 text-sm">
              Generate a custom image for your project using AI
            </p>
          </div>
        </div>

        {/* Image Preview */}
        <div className="mb-4">
          <div className="bg-white/5 rounded-xl p-4 min-h-[200px] flex items-center justify-center border-2 border-dashed border-white/20">
            {loadingImage ? (
              <div className="text-center text-white">
                <Loader className="animate-spin mx-auto mb-3" size={32} />
                <p className="text-sm font-medium">
                  Generating your AI image...
                </p>
                <p className="text-xs text-white/60 mt-1">
                  This may take 10-30 seconds
                </p>
              </div>
            ) : generatedImage || formData.thumbnail ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm flex items-center">
                    <Sparkles size={16} className="mr-1" />
                    AI Generated Image
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(
                          generatedImage || formData.thumbnail,
                          "_blank"
                        )
                      }
                      className="p-1 text-blue-300 hover:text-white transition-colors"
                      title="View full image"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleImageDownload(
                          generatedImage || formData.thumbnail
                        )
                      }
                      className="p-1 text-green-300 hover:text-white transition-colors"
                      title="Download image"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={clearGeneratedImage}
                      className="p-1 text-red-300 hover:text-white transition-colors"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <img
                  src={generatedImage || formData.thumbnail}
                  alt="AI generated project thumbnail"
                  className="w-full h-48 object-cover rounded-lg border border-white/20"
                  onError={(e) => {
                    e.target.src = "/uploads/public/default.jpg";
                  }}
                />
                <div className="mt-2 p-2 bg-green-500/20 rounded-lg border border-green-400/30">
                  <p className="text-green-200 text-xs flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    <strong>AI image generated and applied!</strong> This image
                    will be used as your project thumbnail.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/60">
                <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Generate a custom AI image for your project
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Powered by Google Gemini AI
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="block text-white font-medium text-sm">
            Describe the image you want to generate
          </label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="e.g., Modern e-commerce website dashboard with clean design, shopping cart interface, mobile responsive layout, professional blue and white color scheme..."
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400/50 focus:outline-none resize-none"
            rows={3}
            disabled={loadingImage}
          />
          <button
            onClick={handleImageGenerate}
            disabled={loadingImage || !imagePrompt.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingImage ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin mr-2" size={18} />
                Generating AI Image...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wand2 className="mr-2" size={18} />
                Generate AI Image
              </div>
            )}
          </button>
        </div>

        {/* Developer Warning Note */}
        <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-400/20">
          <div className="flex items-start">
            <AlertTriangle
              size={16}
              className="text-amber-400 mr-2 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-amber-200 text-xs">
                <strong>Message from Scarlet-Sypher (Developer):</strong> This
                feature uses limited AI image generations per day. Please use it
                responsibly and avoid excessive regeneration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Text Description Generator Block - Keep existing code */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Description Generator
            </h3>
            <p className="text-blue-200 text-sm">
              Generate project descriptions using AI
            </p>
          </div>
        </div>

        {/* Response Output Box */}
        <div className="mb-4 space-y-4">
          {/* Short Description */}
          {generatedDescriptions.short && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">
                  Short Description:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedDescriptions.short)}
                    className="p-1 text-blue-300 hover:text-white transition-colors"
                    title="Copy short description"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() =>
                      applyToForm(
                        "shortDescription",
                        generatedDescriptions.short
                      )
                    }
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-200 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {generatedDescriptions.short}
              </p>
            </div>
          )}

          {/* Long Description */}
          {generatedDescriptions.long && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">
                  Long Description:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedDescriptions.long)}
                    className="p-1 text-blue-300 hover:text-white transition-colors"
                    title="Copy long description"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() =>
                      applyToForm("fullDescription", generatedDescriptions.long)
                    }
                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-200 rounded border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                {generatedDescriptions.long}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!generatedDescriptions.short && !generatedDescriptions.long && (
            <div className="bg-white/5 rounded-xl p-4 min-h-[80px] flex items-center justify-center border-2 border-dashed border-white/20">
              <div className="text-center text-white/60">
                <FileText size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Generated descriptions will appear here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="block text-white font-medium text-sm">
            Tell us what you want to describe
          </label>
          <textarea
            value={descriptionPrompt}
            onChange={(e) => setDescriptionPrompt(e.target.value)}
            placeholder="e.g., A full-stack web application for task management with user authentication, real-time updates, and team collaboration features..."
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-blue-400/50 focus:outline-none resize-none"
            rows={3}
          />
          <button
            onClick={handleDescriptionGenerate}
            disabled={loadingDescription || !descriptionPrompt.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loadingDescription ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin mr-2" size={18} />
                Generating...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wand2 className="mr-2" size={18} />
                Generate Descriptions
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
