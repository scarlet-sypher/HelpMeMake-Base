import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Users,
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Code,
  Play,
  Pause,
  Volume2,
  MoreHorizontal,
  Share2,
  Settings,
  Zap,
} from "lucide-react";

import luffy from "../assets/VideoConf/op.gif";
import levi from "../assets/VideoConf/levi.gif";
import rengoku from "../assets/VideoConf/rengoku.gif";
import itachi from "../assets/VideoConf/itachi.gif";
import rayleigh from "../assets/VideoConf/rayleigh.jpg";
import cluffy from "../assets/VideoConf/cluffy.jpg";

const LiveCollabPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "mentor",
      name: "Rayleigh",
      message:
        "Great work on that function! Let me show you a more efficient approach.",
      timestamp: "2:34 PM",
      avatar: rayleigh,
    },
    {
      id: 2,
      sender: "user",
      name: "You",
      message: "Thanks! I was struggling with the loop logic.",
      timestamp: "2:35 PM",
      avatar: cluffy,
    },
    {
      id: 3,
      sender: "mentor",
      name: "Rayleigh",
      message: "No problem! The key is to think about it step by step.",
      timestamp: "2:36 PM",
      avatar: rayleigh,
    },
  ]);

  const [participants] = useState([
    {
      id: 1,
      name: "Uchiha Itachi",
      avatar: itachi,
      isMuted: true,
      isVideoOn: true,
      role: "mentor",
    },
    {
      id: 3,
      name: "Urahara Kisuke",
      avatar: levi,
      isMuted: false,
      isVideoOn: true,
      role: "user",
    },
    {
      id: 4,
      name: "Kyōjurō Rengoku",
      avatar: rengoku,
      isMuted: false,
      isVideoOn: true,
      role: "user",
    },
    {
      id: 2,
      name: "You",
      avatar: luffy,
      isMuted: false,
      isVideoOn: true,
      role: "user",
    },
  ]);

  const [aiSuggestions] = useState([
    {
      id: 1,
      type: "code",
      title: "Optimize this loop",
      suggestion: "Use Array.map() instead of for loop",
      code: "const results = data.map(item => processItem(item));",
    },
    {
      id: 2,
      type: "tip",
      title: "Better approach",
      suggestion: "Consider using async/await for better readability",
      code: 'async function fetchData() {\n  const response = await api.get("/data");\n  return response.data;\n}',
    },
    {
      id: 3,
      type: "debug",
      title: "Potential issue",
      suggestion: "Check for null values before accessing properties",
      code: "if (user?.profile?.email) { ... }",
    },
  ]);

  // Refs for scroll animations
  const headerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const screenShareRef = useRef(null);
  const aiSidebarRef = useRef(null);
  const chatRef = useRef(null);

  const [animations, setAnimations] = useState({
    header: { visible: false, direction: "down" },
    videoSection: { visible: false, direction: "down" },
    screenShare: { visible: false, direction: "down" },
    aiSidebar: { visible: false, direction: "down" },
    chat: { visible: false, direction: "down" },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementId = entry.target.getAttribute("data-animate");
          if (elementId) {
            const isVisible = entry.isIntersecting;
            const boundingRect = entry.boundingClientRect;
            const direction = boundingRect.y < 0 ? "up" : "down";

            setAnimations((prev) => ({
              ...prev,
              [elementId]: { visible: isVisible, direction },
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    const refs = [
      headerRef,
      videoSectionRef,
      screenShareRef,
      aiSidebarRef,
      chatRef,
    ];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "user",
        name: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: cluffy,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getAnimationClass = (elementId) => {
    const animation = animations[elementId];
    if (!animation.visible) {
      return animation.direction === "up"
        ? "translate-y-10 opacity-0"
        : "translate-y-10 opacity-0";
    }
    return "translate-y-0 opacity-100";
  };

  return (
    <section className="relative min-h-screen py-10 sm:py-16 lg:py-20 overflow-hidden">
      {/* Seamless Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Continuous floating background elements */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-20 sm:w-36 h-20 sm:h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-16 sm:w-28 h-16 sm:h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-5 sm:top-10 left-1/2 w-10 sm:w-20 h-10 sm:h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-750"></div>

        {/* Animated particles for continuity */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          data-animate="header"
          className={`text-center mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-1000 ${getAnimationClass(
            "header"
          )}`}
        >
          <div className="mb-4 sm:mb-6">
            <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Video className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
              Live Collaboration Tools
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Work Together Like You're in the Same Room
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Real-time video calls, screen sharing, and AI-powered assistance to
            make your learning sessions more productive than ever.
          </p>
        </div>

        {/* Main Collaboration Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Video Call Section */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Video Grid */}
            <div
              ref={videoSectionRef}
              data-animate="videoSection"
              className={`bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-2xl transform transition-all duration-1000 ${getAnimationClass(
                "videoSection"
              )}`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold text-sm sm:text-base">
                    LIVE SESSION
                  </span>
                  <span className="text-white/70 text-xs sm:text-sm">
                    42:18
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Settings className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </button>
                  <button className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <MoreHorizontal className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="relative aspect-video bg-slate-800/50 rounded-lg sm:rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Participant Info */}
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-white font-medium text-xs sm:text-sm">
                          {participant.name}
                        </span>
                        {participant.role === "mentor" && (
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                            Mentor
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`p-1 rounded-full ${
                            participant.isMuted
                              ? "bg-red-500/20"
                              : "bg-green-500/20"
                          }`}
                        >
                          {participant.isMuted ? (
                            <MicOff className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-red-400" />
                          ) : (
                            <Mic className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-400" />
                          )}
                        </div>
                        <div
                          className={`p-1 rounded-full ${
                            participant.isVideoOn
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {participant.isVideoOn ? (
                            <Video className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-green-400" />
                          ) : (
                            <VideoOff className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <button className="p-2 sm:p-3 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all duration-300 group">
                  <Mic className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110" />
                </button>
                <button className="p-2 sm:p-3 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all duration-300 group">
                  <Video className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110" />
                </button>
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-2 sm:p-3 rounded-full transition-all duration-300 group ${
                    isScreenSharing
                      ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <Monitor className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110" />
                </button>
                <button className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group">
                  <Share2 className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110" />
                </button>
                <button className="p-2 sm:p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 group">
                  <Volume2 className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Screen Share Preview */}
            {isScreenSharing && (
              <div
                ref={screenShareRef}
                data-animate="screenShare"
                className={`bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-2xl transform transition-all duration-1000 ${getAnimationClass(
                  "screenShare"
                )}`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      You're sharing your screen
                    </span>
                  </div>
                  <button
                    onClick={() => setIsScreenSharing(false)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-xs sm:text-sm transition-all duration-300"
                  >
                    Stop Sharing
                  </button>
                </div>

                <div className="p-2 sm:p-4 bg-gray-900 rounded-lg">
                  <div className="aspect-video bg-slate-800/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-6 border-2 border-blue-500/30 shadow-inner">
                    <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-2 sm:p-4 font-mono text-xs sm:text-sm overflow-auto">
                      <div className="text-emerald-400 mb-2">
                        // React Component
                      </div>
                      <div className="text-blue-400">
                        const <span className="text-yellow-400">TodoApp</span> =
                        () =&gt; {`{`}
                      </div>
                      <div className="text-white ml-2 sm:ml-4 break-all">
                        const [todos, setTodos] = useState([]);
                      </div>
                      <div className="text-white ml-2 sm:ml-4 break-all">
                        const [input, setInput] = useState('');
                      </div>
                      <div className="text-gray-500 mt-2 ml-2 sm:ml-4">
                        // Add todo function
                      </div>
                      <div className="text-blue-400 ml-2 sm:ml-4">
                        const addTodo = () =&gt; {`{`}
                      </div>
                      <div className="text-white ml-4 sm:ml-8 break-all">
                        setTodos([...todos, input]);
                      </div>
                      <div className="text-white ml-4 sm:ml-8 break-all">
                        setInput('');
                      </div>
                      <div className="text-blue-400 ml-2 sm:ml-4">{`}`};</div>
                      <div className="text-blue-400 mt-2">{`}`};</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant Sidebar */}
          <div className="xl:col-span-1">
            <div
              ref={aiSidebarRef}
              data-animate="aiSidebar"
              className={`bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-2xl h-full transform transition-all duration-1000 ${getAnimationClass(
                "aiSidebar"
              )}`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    AI Assist
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Smart suggestions
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="group bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                        {suggestion.type === "code" && (
                          <Code className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-400" />
                        )}
                        {suggestion.type === "tip" && (
                          <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
                        )}
                        {suggestion.type === "debug" && (
                          <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-xs sm:text-sm mb-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-white/70 text-xs mb-2">
                          {suggestion.suggestion}
                        </p>
                        <div className="bg-slate-800/50 rounded-md sm:rounded-lg p-2 text-xs font-mono text-emerald-300 overflow-x-auto">
                          <pre className="whitespace-pre-wrap break-all">
                            {suggestion.code}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg sm:rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-emerald-400" />
                  <span className="text-white font-medium text-xs sm:text-sm">
                    Pro Tip
                  </span>
                </div>
                <p className="text-white/80 text-xs">
                  Use keyboard shortcuts to boost your productivity. Press
                  Ctrl+/ to see all available shortcuts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div
          ref={chatRef}
          data-animate="chat"
          className={`bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/20 shadow-2xl transform transition-all duration-1000 ${getAnimationClass(
            "chat"
          )}`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
            <h3 className="text-white font-semibold text-sm sm:text-base">
              Session Chat
            </h3>
            <span className="text-white/70 text-xs sm:text-sm">
              ({participants.length} participants)
            </span>
          </div>

          <div className="h-48 sm:h-64 overflow-y-auto mb-3 sm:mb-4 space-y-3 sm:space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 sm:space-x-3 max-w-xs sm:max-w-sm ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={message.avatar}
                      alt={message.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <p className="text-xs sm:text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-white/80"
                          : "text-white/60"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-750 { animation-delay: 750ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Responsive breakpoints for better mobile experience */
        @media (max-width: 640px) {
          .aspect-video {
            aspect-ratio: 4/3;
          }
        }
        
        @media (max-width: 480px) {
          .grid-cols-1.sm\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }

        /* Enhanced scroll animations */
        .transform {
          transition-property: transform, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 1000ms;
        }

        /* Smooth entrance animations */
        @keyframes slideInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideInDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Animation classes for scroll effects */
        .animate-slide-in-up {
          animation: slideInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-in-down {
          animation: slideInDown 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default LiveCollabPage;
