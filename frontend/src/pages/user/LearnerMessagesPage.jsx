import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/user/Sidebar";
import RoomsList from "../../components/user/userMessage/RoomsList";
import ChatHeader from "../../components/user/userMessage/ChatHeader";
import MessagesArea from "../../components/user/userMessage/MessagesArea";
import MessageInput from "../../components/user/userMessage/MessageInput";
import WallpaperModal from "../../components/user/userMessage/WallpaperModal";
import { Users, X } from "lucide-react";

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
  const [showRoomList, setShowRoomList] = useState(true);
  const [roomListCollapsed, setRoomListCollapsed] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    status: "info",
  });

  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  const inputRef = useRef(null);
  const sendingRef = useRef(false);
  const lastSentMessageRef = useRef(null);

  // Toast function
  const showToast = ({ message, status = "info" }) => {
    setToast({ open: true, message, status });
  };

  const closeToast = () => {
    setToast({ open: false, message: "", status: "info" });
  };

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

    // On mobile, hide room list when room is selected
    if (window.innerWidth < 768) {
      setShowRoomList(false);
    }

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

        showToast({
          message: "Wallpaper uploaded and applied successfully!",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex overflow-hidden">
      {/* Toast */}
      <Toast toast={toast} onClose={closeToast} />

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activeItem="messages"
        setActiveItem={() => {}}
        userRole="user"
      />

      <div
        className={`flex-1 flex h-screen transition-all duration-300 lg:ml-64`}
      >
        {/* Rooms List */}
        <RoomsList
          showRoomList={showRoomList}
          setSidebarOpen={setSidebarOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredRooms={filteredRooms}
          loading={loading}
          handleRoomSelect={handleRoomSelect}
          selectedRoom={selectedRoom}
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
          ) : (
            <>
              {/* Chat Header */}
              <ChatHeader
                setShowMobileChat={setShowMobileChat}
                roomDetails={roomDetails}
                selectedRoom={selectedRoom}
                isRoomClosed={isRoomClosed}
                setShowWallpaperModal={setShowWallpaperModal}
                checkNewMessages={checkNewMessages}
              />

              {/* Messages Area */}
              <MessagesArea
                roomDetails={roomDetails}
                messagesLoading={messagesLoading}
                messages={messages}
                user={user}
                messagesEndRef={messagesEndRef}
                downloadImage={downloadImage}
              />

              {/* Message Input */}
              <MessageInput
                selectedRoom={selectedRoom}
                isRoomClosed={isRoomClosed}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
                handleKeyPress={handleKeyPress}
                handleImageUpload={handleImageUpload}
                handlePasteImage={handlePasteImage}
                inputRef={inputRef}
                sendingRef={sendingRef}
                sending={sending}
                uploadingImage={uploadingImage}
              />
            </>
          )}
        </div>
      </div>

      {/* Wallpaper Modal */}
      <WallpaperModal
        showWallpaperModal={showWallpaperModal}
        setShowWallpaperModal={setShowWallpaperModal}
        wallpaperUrl={wallpaperUrl}
        setWallpaperUrl={setWallpaperUrl}
        predefinedWallpapers={predefinedWallpapers}
        handleCustomWallpaperUpload={handleCustomWallpaperUpload}
        customWallpaper={customWallpaper}
        uploadingWallpaper={uploadingWallpaper}
        updateWallpaperInRoom={updateWallpaperInRoom}
      />
    </div>
  );
};

export default LearnerMessagesPage;
