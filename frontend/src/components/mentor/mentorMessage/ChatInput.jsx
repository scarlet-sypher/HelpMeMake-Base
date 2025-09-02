import React from "react";
import { Send, Image as ImageIcon, Lock } from "lucide-react";

const ChatInput = ({
  selectedRoom,
  newMessage,
  setNewMessage,
  sendMessage,
  handleImageUpload,
  handlePasteImage,
  sendingRef,
  isSending,
  uploadingImage,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border-t border-white/10 p-4">
      {selectedRoom.status === "close" ? (
        <div className="text-center p-4">
          <div className="inline-flex items-center space-x-2 text-red-300 bg-red-500/20 px-4 py-2 rounded-lg">
            <Lock size={16} />
            <span>This chat is readonly - Project has ended</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
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
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              uploadingImage
                ? "bg-slate-700/50 cursor-not-allowed"
                : "bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-cyan-300"
            }`}
            title="Upload Image"
          >
            {uploadingImage ? (
              <div className="w-[18px] h-[18px] border-2 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ImageIcon size={18} />
            )}
          </label>

          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onPaste={handlePasteImage}
              placeholder="Type a message or paste an image..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              disabled={sendingRef.current || isSending || uploadingImage}
            />
          </div>

          <button
            onClick={sendMessage}
            disabled={
              !newMessage.trim() ||
              sendingRef.current ||
              isSending ||
              uploadingImage
            }
            className="p-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
