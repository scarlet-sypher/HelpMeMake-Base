import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import RoomListSidebar from "../../components/mentor/mentorMessage/RoomListSidebar";
import ChatHeader from "../../components/mentor/mentorMessage/ChatHeader";
import ChatMessages from "../../components/mentor/mentorMessage/ChatMessages";
import ChatInput from "../../components/mentor/mentorMessage/ChatInput";
import WallpaperSettingsModal from "../../components/mentor/mentorMessage/WallpaperSettingsModal";
import { MessageCircle, AlignJustify, X } from "lucide-react";

// Toast Component
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [toast.open, onClose]);

  if (!toast.open) return null;

  const bgColor =
    {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    }[toast.status] || "bg-gray-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm flex items-center justify-between backdrop-blur-sm border border-white/10 transition-all duration-300 transform`}
      role="alert"
    >
      <span className="text-sm font-medium leading-relaxed">
        {toast.message}
      </span>
      <button
        onClick={onClose}
        className="ml-3 text-white/80 hover:text-white transition-colors duration-200 p-1 rounded-md hover:bg-white/10"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const MentorMessages = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("messages");

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info",
  });

  // Message state
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const [showWallpaperSettings, setShowWallpaperSettings] = useState(false);
  const [customWallpaper, setCustomWallpaper] = useState("");
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);
  const sendingRef = useRef(false);
  const lastSentMessageRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Mobile and responsive state
  const [showRoomList, setShowRoomList] = useState(true);
  const [roomListCollapsed, setRoomListCollapsed] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  const lastMessageTimeRef = useRef(null);

  // Toast function
  const showToast = ({ message, status = "info" }) => {
    setToast({ open: true, message, status });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", status: "info" });
  };

  // Redirect non-mentors
  useEffect(() => {
    if (!loading && (!isAuthenticated || (user && user.role !== "mentor"))) {
      window.location.href = "/login";
    }
  }, [loading, isAuthenticated, user]);

  // Load rooms on mount
  useEffect(() => {
    if (isAuthenticated && user && user.role === "mentor") {
      loadRooms();
    }
  }, [isAuthenticated, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages
  useEffect(() => {
    if (selectedRoom && selectedRoom.status === "open") {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [selectedRoom]);

  // Mobile responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowRoomList(true);
      }
      // Auto-collapse room list on large screens if screen gets too narrow
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setRoomListCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setRoomListCollapsed(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startPolling = () => {
    stopPolling();

    pollingInterval.current = setInterval(async () => {
      if (selectedRoom && lastMessageTimeRef.current) {
        await checkNewMessages();
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/rooms/my-active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRooms(data.data.rooms || []);
      } else {
        console.error("Failed to load rooms");
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoomDetails = async (roomId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/rooms/${roomId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedRoom(data.data.room);
        await loadMessages(roomId);
      }
    } catch (error) {
      console.error("Error loading room details:", error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/messages/messages/${roomId}?page=1&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages || []);

        // Set last message time for polling
        const lastMessage = data.data.messages[data.data.messages.length - 1];
        if (lastMessage) {
          lastMessageTimeRef.current = lastMessage.time;
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const checkNewMessages = async () => {
    if (!selectedRoom || !lastMessageTimeRef.current) return;

    try {
      setIsPolling(true);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/messages/${
          selectedRoom._id
        }/check?lastMessageTime=${lastMessageTimeRef.current}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data.hasNewMessages && data.data.newMessages.length > 0) {
          // Only add messages that don't already exist in our state
          setMessages((prev) => {
            const newUniqueMessages = data.data.newMessages.filter(
              (newMsg) =>
                !prev.find((existingMsg) => existingMsg._id === newMsg._id)
            );

            if (newUniqueMessages.length > 0) {
              const lastNewMessage =
                data.data.newMessages[data.data.newMessages.length - 1];
              lastMessageTimeRef.current = lastNewMessage.time;
              return [...prev, ...newUniqueMessages];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Error checking new messages:", error);
    } finally {
      setIsPolling(false);
    }
  };

  const sendMessage = async () => {
    if (
      !newMessage.trim() ||
      !selectedRoom ||
      sendingRef.current ||
      selectedRoom.status === "close"
    )
      return;

    // Prevent duplicate sends of the same message content
    if (lastSentMessageRef.current === newMessage.trim()) {
      return;
    }

    try {
      sendingRef.current = true;
      setSending(true);

      const messageToSend = newMessage.trim();
      lastSentMessageRef.current = messageToSend;

      // Clear input immediately to prevent re-sends
      setNewMessage("");

      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/messages/${
          selectedRoom._id
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageToSend,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update last message time reference
        lastMessageTimeRef.current = data.data.time;

        // Add message to state with duplicate check
        setMessages((prev) => {
          const messageExists = prev.find((msg) => msg._id === data.data._id);
          if (!messageExists) {
            return [...prev, data.data];
          }
          return prev;
        });

        // Update room's unread count and last message
        setRooms((prev) =>
          prev.map((room) =>
            room._id === selectedRoom._id
              ? {
                  ...room,
                  lastMessage: {
                    content: data.data.message,
                    timestamp: data.data.time,
                  },
                }
              : room
          )
        );

        // Clear the last sent message reference after a delay
        setTimeout(() => {
          lastSentMessageRef.current = null;
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Reset the input if there was an error
      setNewMessage(messageToSend);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const updateWallpaper = async (wallpaperUrl) => {
    if (!selectedRoom) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/rooms/${
          selectedRoom._id
        }/wallpaper`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallpaperUrl,
          }),
        }
      );

      if (response.ok) {
        setSelectedRoom((prev) => ({ ...prev, mentorWallpaper: wallpaperUrl }));
        setShowWallpaperSettings(false);
        setCustomWallpaper("");
      }
    } catch (error) {
      console.error("Error updating wallpaper:", error);
    }
  };

  const handleWallpaperUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        message: "File size must be less than 10MB",
        status: "error",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast({
        message: "Please select a JPEG, PNG, or WebP image",
        status: "error",
      });
      return;
    }

    try {
      setUploadingWallpaper(true);
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("wallpaper", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/wallpaper/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Automatically update the room wallpaper with the uploaded URL
        await updateWallpaper(data.wallpaperUrl);

        showToast({
          message: "Wallpaper uploaded successfully!",
          status: "success",
        });
      } else {
        const errorData = await response.json();
        showToast({
          message: errorData.message || "Failed to upload wallpaper",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading wallpaper:", error);
      showToast({ message: "Failed to upload wallpaper", status: "error" });
    } finally {
      setUploadingWallpaper(false);
      // Reset the input
      event.target.value = "";
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showToast({
        message: "File size must be less than 10MB",
        status: "error",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({ message: "Please select an image file", status: "error" });
      return;
    }

    try {
      setUploadingImage(true);
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/images/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        await sendImageMessage(data.data);
      } else {
        const errorData = await response.json();
        showToast({
          message: errorData.message || "Failed to upload image",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast({ message: "Failed to upload image", status: "error" });
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const sendImageMessage = async (imageData) => {
    if (!selectedRoom) return;

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/messages/${
          selectedRoom._id
        }/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imageData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        lastMessageTimeRef.current = data.data.time;
        setMessages((prev) => {
          const messageExists = prev.find((msg) => msg._id === data.data._id);
          if (!messageExists) {
            return [...prev, data.data];
          }
          return prev;
        });
        // Update rooms to reflect new message
        loadRooms();
      }
    } catch (error) {
      console.error("Error sending image message:", error);
      showToast({ message: "Failed to send image message", status: "error" });
    }
  };

  const handlePasteImage = async (e) => {
    const items = e.clipboardData.items;

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();

        if (file) {
          // Create a fake event to reuse handleImageUpload
          const fakeEvent = {
            target: { files: [file], value: "" },
          };
          await handleImageUpload(fakeEvent);
        }
        break;
      }
    }
  };

  const handleCustomWallpaperUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast({
        message: "File size must be less than 10MB",
        status: "error",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast({
        message: "Please select a JPEG, PNG, or WebP image",
        status: "error",
      });
      return;
    }

    try {
      setUploadingWallpaper(true);
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("wallpaper", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/wallpaper/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Automatically update the room wallpaper with the uploaded URL
        await updateWallpaper(data.wallpaperUrl);
        showToast({
          message: "Wallpaper uploaded and applied successfully!",
          status: "success",
        });
        return { success: true };
      } else {
        const errorData = await response.json();
        showToast({
          message: errorData.message || "Failed to upload wallpaper",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading wallpaper:", error);
      showToast({ message: "Failed to upload wallpaper", status: "error" });
    } finally {
      setUploadingWallpaper(false);
      event.target.value = "";
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(null);
    setMessages([]);
    loadRoomDetails(room._id);

    // On mobile, hide room list when room is selected
    if (window.innerWidth < 768) {
      setShowRoomList(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  const wallpaperPresets = [
    `${import.meta.env.VITE_API_URL}/uploads/wallpapers/default-mentor.jpg`,
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center",
    "upload-slot",
  ];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-white text-lg font-medium tracking-wide">
            Loading Messages...
          </div>
          <div className="text-gray-400 text-sm">
            Please wait while we prepare your conversations
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex overflow-hidden">
      {/* Toast */}
      <Toast toast={toast} onClose={closeToast} />

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />

      <div
        className={`flex-1 flex h-screen transition-all duration-300 lg:ml-64`}
      >
        {/* Room List Sidebar */}
        <RoomListSidebar
          showRoomList={showRoomList}
          rooms={rooms}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoom={selectedRoom}
          selectRoom={selectRoom}
          loadRooms={loadRooms}
          isLoading={isLoading}
          setSidebarOpen={setSidebarOpen}
          formatTime={formatTime}
          roomListCollapsed={roomListCollapsed}
          setRoomListCollapsed={setRoomListCollapsed}
        />

        {/* Chat Area */}
        <div
          className={`${
            showRoomList ? "hidden" : "flex"
          } md:flex flex-1 min-w-0 flex-col ${
            !selectedRoom ? "justify-center items-center" : ""
          } transition-all duration-300`}
        >
          {!selectedRoom ? (
            <div className="text-center text-gray-400 p-8 max-w-md mx-auto">
              <div className="relative mb-6">
                <MessageCircle className="mx-auto text-gray-600" size={80} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                Select a conversation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Choose a conversation from the sidebar to start messaging with
                your learners
              </p>
              <div className="mt-6 text-sm text-gray-500">
                💬 All your active conversations are listed in the sidebar
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <ChatHeader
                selectedRoom={selectedRoom}
                setShowRoomList={setShowRoomList}
                checkNewMessages={checkNewMessages}
                isPolling={isPolling}
                setShowWallpaperSettings={setShowWallpaperSettings}
              />

              {/* Chat Messages */}
              <ChatMessages
                messages={messages}
                selectedRoom={selectedRoom}
                wallpaperPresets={wallpaperPresets}
                user={user}
                formatTime={formatTime}
                messagesEndRef={messagesEndRef}
                isLoading={false}
              />

              {/* Chat Input */}
              <ChatInput
                selectedRoom={selectedRoom}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                handleImageUpload={handleImageUpload}
                handlePasteImage={handlePasteImage}
                sendingRef={sendingRef}
                isSending={isSending}
                uploadingImage={uploadingImage}
              />
            </>
          )}
        </div>
      </div>

      {/* Wallpaper Settings Modal */}
      <WallpaperSettingsModal
        showWallpaperSettings={showWallpaperSettings}
        setShowWallpaperSettings={setShowWallpaperSettings}
        wallpaperPresets={wallpaperPresets}
        selectedRoom={selectedRoom}
        updateWallpaper={updateWallpaper}
        handleCustomWallpaperUpload={handleCustomWallpaperUpload}
        customWallpaper={customWallpaper}
        setCustomWallpaper={setCustomWallpaper}
        uploadingWallpaper={uploadingWallpaper}
        onToast={showToast}
      />
    </div>
  );
};

export default MentorMessages;
