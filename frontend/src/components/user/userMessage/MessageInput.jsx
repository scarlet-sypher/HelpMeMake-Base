import React from "react";
import { Send, Camera, AlertCircle } from "lucide-react";

const MessageInput = ({
  selectedRoom,
  isRoomClosed,
  newMessage,
  setNewMessage,
  sendMessage,
  handleKeyPress,
  handleImageUpload,
  handlePasteImage,
  inputRef,
  sendingRef,
  sending,
  uploadingImage,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border-t border-white/10 p-4">
      {isRoomClosed(selectedRoom) ? (
        <div className="flex items-center justify-center space-x-2 py-3 bg-red-500/20 rounded-xl border border-red-500/30">
          <AlertCircle className="text-red-300" size={20} />
          <span className="text-red-300 font-medium">
            This chat is read-only. The project has been closed.
          </span>
        </div>
      ) : (
        <div className="flex items-end space-x-2">
          {/* Image Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={uploadingImage}
          />
          <label
            htmlFor="image-upload"
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              uploadingImage
                ? "bg-gray-500/50 cursor-not-allowed"
                : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
            }`}
            title="Upload Image"
            aria-label="Upload image"
          >
            {uploadingImage ? (
              <div className="w-5 h-5 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera size={20} />
            )}
          </label>

          <div className="flex-1 bg-white/10 rounded-2xl border border-white/20 p-3">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onPaste={handlePasteImage}
              placeholder="Type a message or paste an image..."
              rows="1"
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none max-h-32 overflow-y-auto"
              style={{ minHeight: "24px" }}
              disabled={sendingRef.current || sending || uploadingImage}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={
              !newMessage.trim() ||
              sendingRef.current ||
              sending ||
              uploadingImage
            }
            className={`p-3 rounded-xl transition-all ${
              newMessage.trim() &&
              !sendingRef.current &&
              !sending &&
              !uploadingImage
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
