import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import {
  Send,
  Menu,
  X,
  MessageCircle,
  Clock,
  CheckCircle2,
  Settings,
  Palette,
  Search,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  AlertCircle,
  Users,
  Upload,
  Download,
  Camera,
  Paperclip,
  MessageSquare,
} from "lucide-react";

const LearnerMessagesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [uploadingWallpaper, setUploadingWallpaper] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customWallpaper, setCustomWallpaper] = useState("");

  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  const inputRef = useRef(null);
  const sendingRef = useRef(false);
  const lastSentMessageRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user's active rooms on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveRooms();
    }
  }, [isAuthenticated]);

  // Start polling when room is selected
  useEffect(() => {
    if (selectedRoom) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [selectedRoom, lastMessageTime]);

  const fetchActiveRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/messages/rooms/my-active`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Active rooms data:", data);
        setRooms(data.data.rooms || []);
      } else {
        console.error("Failed to fetch rooms:", response.status);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomDetails = async (roomId) => {
    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/rooms/${roomId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Room details:", data);
        setRoomDetails(data.data.room);
        setWallpaperUrl(data.data.room.userWallpaper || "");
        return data.data.room;
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
    return null;
  };

  const fetchMessages = async (roomId, page = 1) => {
    try {
      setMessagesLoading(true);
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/messages/${roomId}?page=${page}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Messages data:", data);
        const fetchedMessages = data.data.messages || [];
        setMessages(fetchedMessages);

        // Set last message time for polling
        if (fetchedMessages.length > 0) {
          const lastMsg = fetchedMessages[fetchedMessages.length - 1];
          setLastMessageTime(lastMsg.time);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleRoomSelect = async (room) => {
    setSelectedRoom(room);
    setShowMobileChat(true);

    // Fetch room details and messages
    const details = await fetchRoomDetails(room._id);
    if (details) {
      await fetchMessages(room._id);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || sendingRef.current) return;

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/messages/${selectedRoom._id}`,
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
        console.log("Message sent:", data);

        // Update last message time to prevent duplicate fetching
        setLastMessageTime(data.data.time);

        // Add message to state with duplicate check
        setMessages((prev) => {
          const messageExists = prev.find((msg) => msg._id === data.data._id);
          if (!messageExists) {
            return [...prev, data.data];
          }
          return prev;
        });

        // Refresh rooms to update unread counts
        fetchActiveRooms();

        // Focus back to input
        inputRef.current?.focus();

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

  const checkNewMessages = async () => {
    if (!selectedRoom || !lastMessageTime) return;

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/messages/${
          selectedRoom._id
        }/check?lastMessageTime=${encodeURIComponent(lastMessageTime)}`,
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
              const lastMsg =
                data.data.newMessages[data.data.newMessages.length - 1];
              setLastMessageTime(lastMsg.time);
              fetchActiveRooms(); // Update room list with new unread counts
              return [...prev, ...newUniqueMessages];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Error checking new messages:", error);
    }
  };

  const startPolling = () => {
    stopPolling(); // Clear any existing interval
    pollingInterval.current = setInterval(checkNewMessages, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const updateWallpaper = async () => {
    if (!selectedRoom || !wallpaperUrl.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/rooms/${selectedRoom._id}/wallpaper`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallpaperUrl: wallpaperUrl.trim(),
          }),
        }
      );

      if (response.ok) {
        setShowWallpaperModal(false);
        // Update room details
        await fetchRoomDetails(selectedRoom._id);
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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const formData = new FormData();
      formData.append("wallpaper", file);

      const response = await fetch(`${apiUrl}/api/messages/wallpaper/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setWallpaperUrl(data.wallpaperUrl);

        // Automatically update the room wallpaper
        await updateWallpaper();

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${apiUrl}/api/messages/images/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/messages/${selectedRoom._id}/image`,
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
        setLastMessageTime(data.data.time);
        setMessages((prev) => {
          const messageExists = prev.find((msg) => msg._id === data.data._id);
          if (!messageExists) {
            return [...prev, data.data];
          }
          return prev;
        });
        fetchActiveRooms();
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

  const downloadImage = (imageUrl, imageName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName || "image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const formData = new FormData();
      formData.append("wallpaper", file);

      const response = await fetch(`${apiUrl}/api/messages/wallpaper/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCustomWallpaper(data.wallpaperUrl);

        // Automatically update the room wallpaper
        await updateWallpaperInRoom(data.wallpaperUrl);

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

  const updateWallpaperInRoom = async (wallpaperUrl) => {
    if (!selectedRoom || !wallpaperUrl.trim()) return;

    try {
      const token = localStorage.getItem("access_token");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/messages/rooms/${selectedRoom._id}/wallpaper`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallpaperUrl: wallpaperUrl.trim(),
          }),
        }
      );

      if (response.ok) {
        setShowWallpaperModal(false);
        // Update room details to reflect new wallpaper
        await fetchRoomDetails(selectedRoom._id);
      }
    } catch (error) {
      console.error("Error updating wallpaper:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const isRoomClosed = (room) => room?.status === "close";

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Predefined wallpapers
  const predefinedWallpapers = [
    "/uploads/wallpapers/default-learner.jpg",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center",
    "upload-slot",
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeItem="messages"
        setActiveItem={() => {}}
        userRole="user"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex h-screen overflow-hidden">
        {/* Rooms List */}
        <div
          className={`w-full lg:w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col ${
            showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-white">Messages</h1>
              <div className="w-6"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-white">Loading conversations...</div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <MessageCircle className="text-gray-400 mb-4" size={48} />
                <h3 className="text-white font-semibold mb-2">
                  No Conversations
                </h3>
                <p className="text-gray-400 text-sm">
                  Start a project to begin chatting with your mentor
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => handleRoomSelect(room)}
                  className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                    selectedRoom?._id === room._id
                      ? "bg-blue-500/20 border-blue-500/30"
                      : ""
                  } ${isRoomClosed(room) ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={room.mentor?.avatar || "/default-avatar.jpg"}
                        alt={room.mentor?.name || "Mentor"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      {!isRoomClosed(room) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold truncate">
                          {room.mentor?.name || "Unknown Mentor"}
                        </h3>
                        {room.lastMessage?.timestamp && (
                          <span className="text-xs text-gray-400">
                            {formatTime(room.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-300 truncate">
                          {room.lastMessage?.content || "No messages yet"}
                        </p>
                        {room.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-400">
                          {room.projectId?.name || room.roomName}
                        </span>
                        {isRoomClosed(room) && (
                          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full">
                            Closed
                          </span>
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
          className={`flex-1 flex flex-col ${
            !showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowMobileChat(false)}
                      className="lg:hidden text-white hover:text-gray-300 transition-colors"
                    >
                      <ArrowLeft size={24} />
                    </button>

                    <img
                      src={roomDetails?.mentor?.avatar || "/default-avatar.jpg"}
                      alt={roomDetails?.mentor?.name || "Mentor"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />

                    <div>
                      <h2 className="text-white font-semibold">
                        {roomDetails?.mentor?.name || "Unknown Mentor"}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">
                          {roomDetails?.projectId?.name ||
                            selectedRoom.roomName}
                        </span>
                        {isRoomClosed(selectedRoom) && (
                          <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full">
                            Read Only
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowWallpaperModal(true)}
                      className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Change Wallpaper"
                    >
                      <Palette size={20} />
                    </button>
                    <button
                      onClick={checkNewMessages}
                      className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Check Messages"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 relative overflow-hidden"
                style={{
                  backgroundImage: roomDetails?.userWallpaper
                    ? `url(${roomDetails.userWallpaper})`
                    : "linear-gradient(to bottom right, rgba(30, 41, 59, 0.3), rgba(30, 58, 138, 0.3))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  // backgroundAttachment: "fixed",
                }}
              >
                {/* Background overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Scrollable messages container */}
                <div className="relative z-10 h-full overflow-y-auto p-4 space-y-4 hide-scrollbar-general">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-white">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <MessageCircle className="text-gray-400 mb-4" size={48} />
                      <h3 className="text-white font-semibold mb-2">
                        No Messages Yet
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Start the conversation with your mentor
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        const isCurrentUserMessage =
                          message.senderId._id === user.userId;
                        const showAvatar =
                          index === 0 ||
                          messages[index - 1]?.senderId._id !==
                            message.senderId._id;

                        return (
                          <div
                            key={`${message._id}-${index}`}
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
                              {/* Avatar for mentor messages (left side) */}
                              {!isCurrentUserMessage && showAvatar && (
                                <img
                                  src={
                                    message.senderId.avatar ||
                                    "/default-avatar.jpg"
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
                                    ? "bg-blue-500 text-white rounded-br-md shadow-lg"
                                    : "bg-white/20 backdrop-blur-sm text-white rounded-bl-md border border-white/10 shadow-lg"
                                }`}
                              >
                                {/* Image Message */}
                                {message.messageType === "image" &&
                                  message.imageUrl && (
                                    <div className="mb-2">
                                      <div className="relative group">
                                        <img
                                          src={message.imageUrl}
                                          alt={
                                            message.imageName || "Shared image"
                                          }
                                          className="max-w-full h-auto rounded-lg cursor-pointer"
                                          style={{
                                            maxHeight: "300px",
                                            maxWidth: "250px",
                                          }}
                                          onClick={() =>
                                            window.open(
                                              message.imageUrl,
                                              "_blank"
                                            )
                                          }
                                        />
                                        {/* Download button for receiver */}
                                        {!isCurrentUserMessage && (
                                          <button
                                            onClick={() =>
                                              downloadImage(
                                                message.imageUrl,
                                                message.imageName
                                              )
                                            }
                                            className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Download Image"
                                          >
                                            <Download
                                              size={16}
                                              className="text-white"
                                            />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Text Message Content */}
                                {(message.messageType === "text" ||
                                  message.message) && (
                                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {message.message}
                                  </p>
                                )}

                                {/* Time and Status */}
                                <div
                                  className={`flex items-center justify-end mt-1 space-x-1 ${
                                    isCurrentUserMessage
                                      ? "text-blue-100"
                                      : "text-gray-300"
                                  }`}
                                >
                                  <span className="text-xs">
                                    {new Date(message.time).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </span>
                                  {/* Show read status only for current user's messages */}
                                  {isCurrentUserMessage && (
                                    <CheckCircle2
                                      size={12}
                                      className={
                                        message.isRead
                                          ? "text-green-300"
                                          : "text-blue-300"
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              {/* Message Input */}
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
                        disabled={
                          sendingRef.current || sending || uploadingImage
                        }
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
                    >
                      <Send size={20} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* No Room Selected */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-blue-900/30">
              <div className="text-center">
                <Users className="text-gray-400 mb-4 mx-auto" size={64} />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to Messages
                </h2>
                <p className="text-gray-400 mb-6">
                  Select a conversation to start chatting with your mentor
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallpaper Modal */}
      {showWallpaperModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Change Wallpaper</h3>
              <button
                onClick={() => setShowWallpaperModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* URL Input Section */}
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

              {/* Preset Wallpapers */}
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
                                <Upload
                                  size={18}
                                  className="text-gray-400 mb-1"
                                />
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
                        >
                          {/* Overlay for better visibility */}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"></div>

                          {/* Selection indicator */}
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

                          {/* Preview label */}
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
      )}
    </div>
  );
};

export default LearnerMessagesPage;
