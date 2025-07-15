import React, { useState, useEffect } from 'react';
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
  Zap
} from 'lucide-react';

const LiveCollabPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'mentor',
      name: 'Jiraiya',
      message: 'Great work on that function! Let me show you a more efficient approach.',
      timestamp: '2:34 PM',
      avatar: '/src/assets/MentorImages/jiraiya.jpg'
    },
    {
      id: 2,
      sender: 'user',
      name: 'You',
      message: 'Thanks! I was struggling with the loop logic.',
      timestamp: '2:35 PM',
      avatar: '/src/assets/MentorImages/sindo.jpg'
    },
    {
      id: 3,
      sender: 'mentor',
      name: 'Jiraiya',
      message: 'No problem! The key is to think about it step by step.',
      timestamp: '2:36 PM',
      avatar: '/src/assets/MentorImages/jiraiya.jpg'
    }
  ]);

  const [participants] = useState([
    { id: 1, name: 'Jiraiya', avatar: '/src/assets/MentorImages/jiraiya.jpg', isMuted: false, isVideoOn: true, role: 'mentor' },
    { id: 2, name: 'You', avatar: '/src/assets/MentorImages/sindo.jpg', isMuted: false, isVideoOn: true, role: 'user' },
    { id: 3, name: 'L', avatar: '/src/assets/MentorImages/L.jpg', isMuted: true, isVideoOn: false, role: 'user' },
    { id: 4, name: 'Rangoku', avatar: '/src/assets/MentorImages/rengoku.jpg', isMuted: false, isVideoOn: true, role: 'user' }
  ]);

  const [aiSuggestions] = useState([
    {
      id: 1,
      type: 'code',
      title: 'Optimize this loop',
      suggestion: 'Use Array.map() instead of for loop',
      code: 'const results = data.map(item => processItem(item));'
    },
    {
      id: 2,
      type: 'tip',
      title: 'Better approach',
      suggestion: 'Consider using async/await for better readability',
      code: 'async function fetchData() {\n  const response = await api.get("/data");\n  return response.data;\n}'
    },
    {
      id: 3,
      type: 'debug',
      title: 'Potential issue',
      suggestion: 'Check for null values before accessing properties',
      code: 'if (user?.profile?.email) { ... }'
    }
  ]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'user',
        name: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: '/src/assets/MentorImages/deku.jpg'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Seamless Background */}
      <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-purple-900 to-slate-900">
        {/* Continuous floating background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse animation-delay-1500"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-750"></div>

        {/* Animated particles for continuity */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              <Video className="w-4 h-4 mr-2" />
              Live Collaboration Tools
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
              Work Together Like You're in the Same Room
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Real-time video calls, screen sharing, and AI-powered assistance to make your learning sessions more productive than ever.
          </p>
        </div>

        {/* Main Collaboration Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Video Call Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Grid */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">LIVE SESSION</span>
                  <span className="text-white/70">42:18</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {participants.map((participant) => (
                  <div key={participant.id} className="relative aspect-video bg-slate-800/50 rounded-xl overflow-hidden group hover:scale-105 transition-transform duration-300">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Participant Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium text-sm">{participant.name}</span>
                        {participant.role === 'mentor' && (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">Mentor</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`p-1 rounded-full ${participant.isMuted ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                          {participant.isMuted ? (
                            <MicOff className="w-3 h-3 text-red-400" />
                          ) : (
                            <Mic className="w-3 h-3 text-green-400" />
                          )}
                        </div>
                        <div className={`p-1 rounded-full ${participant.isVideoOn ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {participant.isVideoOn ? (
                            <Video className="w-3 h-3 text-green-400" />
                          ) : (
                            <VideoOff className="w-3 h-3 text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Control Bar */}
              <div className="flex items-center justify-center space-x-4">
                <button className="p-3 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all duration-300 group">
                  <Mic className="w-5 h-5 group-hover:scale-110" />
                </button>
                <button className="p-3 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all duration-300 group">
                  <Video className="w-5 h-5 group-hover:scale-110" />
                </button>
                <button 
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full transition-all duration-300 group ${
                    isScreenSharing 
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Monitor className="w-5 h-5 group-hover:scale-110" />
                </button>
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group">
                  <Share2 className="w-5 h-5 group-hover:scale-110" />
                </button>
                <button className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 group">
                  <Volume2 className="w-5 h-5 group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Screen Share Preview */}
            {isScreenSharing && (
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">You're sharing your screen</span>
                  </div>
                  <button 
                    onClick={() => setIsScreenSharing(false)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-sm transition-all duration-300"
                  >
                    Stop Sharing
                  </button>
                </div>
                
               <div className="p-4 bg-gray-900">
                  <div className="aspect-video bg-slate-800/50 rounded-xl p-3 sm:p-6 border-2 border-blue-500/30 shadow-inner">
                    <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-2 sm:p-4 font-mono text-xs sm:text-sm overflow-auto">
                      <div className="text-emerald-400 mb-2">// React Component</div>
                      <div className="text-blue-400">
                        const <span className="text-yellow-400">TodoApp</span> = () =&gt; {`{`}
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
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assist</h3>
                  <p className="text-white/70 text-sm">Smart suggestions</p>
                </div>
              </div>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {suggestion.type === 'code' && <Code className="w-4 h-4 text-emerald-400" />}
                        {suggestion.type === 'tip' && <Sparkles className="w-4 h-4 text-blue-400" />}
                        {suggestion.type === 'debug' && <Zap className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-white/70 text-xs mb-2">{suggestion.suggestion}</p>
                        <div className="bg-slate-800/50 rounded-lg p-2 text-xs font-mono text-emerald-300 overflow-x-auto">
                          {suggestion.code}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-medium text-sm">Pro Tip</span>
                </div>
                <p className="text-white/80 text-xs">
                  Use keyboard shortcuts to boost your productivity. Press Ctrl+/ to see all available shortcuts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
            <h3 className="text-white font-semibold">Session Chat</h3>
            <span className="text-white/70 text-sm">({participants.length} participants)</span>
          </div>

          <div className="h-64 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img src={message.avatar} alt={message.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' 
                      : 'bg-white/10 text-white'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/80' : 'text-white/60'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-5 h-5 text-white" />
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
      `}</style>
    </section>
  );
};

export default LiveCollabPage;