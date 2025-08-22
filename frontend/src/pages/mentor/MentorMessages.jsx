import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import {
  MessageCircle,
  Send,
  Image as ImageIcon,
  Settings,
  Clock,
  CheckCircle2,
  Users,
  Search,
  RefreshCw,
  Lock,
  Menu,
  X,
  ArrowLeft,
  MoreVertical,
  Camera,
  Upload,
  Download,
  Paperclip,
  CloudUpload,
} from "lucide-react";

const MentorMessages = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("messages");

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

  // Mobile state
  const [showRoomList, setShowRoomList] = useState(true);

  // Refs
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  const lastMessageTimeRef = useRef(null);

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
    };

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
      alert("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, or WebP image");
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

        alert("Wallpaper uploaded successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to upload wallpaper");
      }
    } catch (error) {
      console.error("Error uploading wallpaper:", error);
      alert("Failed to upload wallpaper");
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
      alert("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
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
        alert(errorData.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
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
      alert("Failed to send image message");
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
      alert("File size must be less than 10MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, or WebP image");
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
        alert("Wallpaper uploaded and applied successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to upload wallpaper");
      }
    } catch (error) {
      console.error("Error uploading wallpaper:", error);
      alert("Failed to upload wallpaper");
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

  const filteredRooms = rooms.filter(
    (room) =>
      room.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-lg font-medium">
            Loading Messages...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userRole="mentor"
      />

      <div className="flex-1 lg:ml-64 flex h-screen">
        {/* Room List Sidebar */}
        <div
          className={`${
            showRoomList ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-80 bg-slate-800/50 backdrop-blur-sm border-r border-white/10`}
        >
          {/* Mobile Header */}
          <div className="md:hidden bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">Messages</h1>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <button
                onClick={loadRooms}
                className={`p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors ${
                  isLoading ? "animate-spin" : ""
                }`}
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto">
            {filteredRooms.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <MessageCircle className="mx-auto mb-3" size={48} />
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => selectRoom(room)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${
                    selectedRoom?._id === room._id
                      ? "bg-cyan-500/20 border-l-4 border-l-cyan-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={room.learner?.avatar || "/default-avatar.png"}
                        alt={room.learner?.name || "Learner"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {room.status === "close" && (
                        <div className="absolute -bottom-1 -right-1 p-1 bg-red-500 rounded-full">
                          <Lock size={10} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {room.learner?.name || "Unknown Learner"}
                        </h3>
                        {room.lastMessage?.timestamp && (
                          <span className="text-xs text-gray-400">
                            {formatTime(room.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-400 truncate">
                        {room.lastMessage?.content ||
                          room.roomName ||
                          "No messages yet"}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            room.status === "open"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {room.status === "open" ? "Active" : "Closed"}
                        </span>

                        {room.unreadCount > 0 && (
                          <div className="bg-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            showRoomList ? "hidden" : "flex"
          } md:flex flex-1 flex-col ${
            !selectedRoom ? "justify-center items-center" : ""
          }`}
        >
          {!selectedRoom ? (
            <div className="text-center text-gray-400 p-8">
              <MessageCircle className="mx-auto mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">
                Select a conversation
              </h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-slate-800/50 backdrop-blur-sm border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setShowRoomList(true)}
                      className="md:hidden text-white hover:text-gray-300 transition-colors mr-2"
                    >
                      <ArrowLeft size={20} />
                    </button>

                    <img
                      src={
                        selectedRoom.learner?.avatar || "/default-avatar.png"
                      }
                      alt={selectedRoom.learner?.name || "Learner"}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-white">
                        {selectedRoom.learner?.name || "Unknown Learner"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {selectedRoom.status === "open"
                          ? "Online"
                          : "Chat closed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={checkNewMessages}
                      disabled={isPolling}
                      className={`p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors ${
                        isPolling ? "animate-pulse" : ""
                      }`}
                    >
                      <RefreshCw
                        size={16}
                        className={isPolling ? "animate-spin" : ""}
                      />
                    </button>

                    <button
                      onClick={() => setShowWallpaperSettings(true)}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 transition-colors"
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 relative overflow-hidden">
                {/* Fixed background wallpaper */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${
                      selectedRoom.mentorWallpaper || wallpaperPresets[0]
                    })`,
                  }}
                />

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[1px]"></div>

                {/* Messages container */}
                <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4 hide-scrollbar-general">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="mx-auto mb-3" size={48} />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      // Fix the message alignment logic for mentor
                      // console.log("🔹 Message index:", index);
                      // console.log("🔹 Message object:", message);
                      // console.log("====================================");
                      // console.log("🔹 Sender ID:", message.senderId._id);
                      // console.log("🔹 Current user ID:", user.userId);
                      // console.log("🔹 Current user Role:", user.role);
                      // console.log("====================================");

                      const isCurrentUserMessage =
                        message.senderId._id === user.userId;
                      // console.log(isCurrentUserMessage);
                      const showAvatar =
                        index === 0 ||
                        messages[index - 1]?.senderId._id !==
                          message.senderId._id;

                      // Create a unique key using message ID + timestamp + index
                      const uniqueKey = `${message._id}-${message.time}-${index}`;

                      return (
                        <div
                          key={uniqueKey}
                          className={`flex ${
                            isCurrentUserMessage
                              ? "justify-end"
                              : "justify-start"
                          } mb-3`}
                        >
                          <div
                            className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                              isCurrentUserMessage
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                            }`}
                          >
                            {/* Avatar - Show avatar for non-current user (learner) */}
                            {!isCurrentUserMessage && showAvatar && (
                              <img
                                src={
                                  message.senderId.avatar ||
                                  "/default-avatar.png"
                                }
                                alt={message.senderId.name}
                                className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
                              />
                            )}
                            {!isCurrentUserMessage && !showAvatar && (
                              <div className="w-8 flex-shrink-0"></div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={`px-4 py-2 rounded-2xl max-w-full ${
                                isCurrentUserMessage
                                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-br-md shadow-lg"
                                  : "bg-slate-700/80 backdrop-blur-sm text-white rounded-bl-md border border-white/10 shadow-lg"
                              }`}
                            >
                              {/* Image Message with Preview and Buttons */}
                              {message.messageType === "image" &&
                                message.imageUrl && (
                                  <div className="mb-2">
                                    <div className="relative group">
                                      <img
                                        src={message.imageUrl}
                                        alt={
                                          message.imageName || "Shared image"
                                        }
                                        className="max-w-full h-auto rounded-lg"
                                        style={{
                                          maxHeight: "200px",
                                          maxWidth: "200px",
                                        }}
                                      />

                                      {/* Image Action Buttons - Always show for both sender and receiver */}
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                                        {/* View Button */}
                                        <button
                                          onClick={() =>
                                            window.open(
                                              message.imageUrl,
                                              "_blank"
                                            )
                                          }
                                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                                          title="View Image"
                                        >
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                          </svg>
                                        </button>

                                        {/* Download Button */}
                                        <button
                                          onClick={() => {
                                            const link =
                                              document.createElement("a");
                                            link.href = message.imageUrl;
                                            link.download =
                                              message.imageName || "image";
                                            link.target = "_blank";
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                          }}
                                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                                          title="Download Image"
                                        >
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Image Info */}
                                    <div className="mt-1 text-xs opacity-70">
                                      {message.imageName && (
                                        <div className="truncate">
                                          {message.imageName}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Text Message Content or Image Caption */}
                              {message.message && message.message.trim() && (
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {message.message}
                                </p>
                              )}

                              {/* Time + Status */}
                              <div
                                className={`flex items-center justify-end mt-1 space-x-1 ${
                                  isCurrentUserMessage
                                    ? "text-cyan-100"
                                    : "text-gray-400"
                                }`}
                              >
                                <span className="text-xs">
                                  {formatTime(message.time)}
                                </span>
                                {isCurrentUserMessage && (
                                  <CheckCircle2
                                    size={12}
                                    className={
                                      message.isRead
                                        ? "text-cyan-200"
                                        : "text-cyan-300"
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
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
                        disabled={
                          sendingRef.current || isSending || uploadingImage
                        }
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
            </>
          )}
        </div>
      </div>

      {/* Wallpaper Settings Modal */}
      {showWallpaperSettings && (
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
              {/* Preset Wallpapers */}
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
                            onChange={handleCustomWallpaperUpload}
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

                          {/* Overlay for better visibility */}
                          <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors"></div>

                          {/* Selected indicator */}
                          {selectedRoom?.mentorWallpaper === wallpaper && (
                            <div className="absolute top-1 right-1 p-1 bg-cyan-500 rounded-full">
                              <CheckCircle2 size={12} className="text-white" />
                            </div>
                          )}

                          {/* Hover overlay */}
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

              {/* Custom URL Input */}
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
      )}
    </div>
  );
};

export default MentorMessages;
