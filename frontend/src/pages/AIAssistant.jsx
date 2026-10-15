import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { speak, stopSpeaking } from '../voice/ttsService';
import { speechRecognitionService, getSpeechLocale } from '../voice/speechRecognition';
import GeminiLiveVoiceModal from '../components/voice/GeminiLiveVoiceModal';
import ChatHistorySidebar from '../components/assistant/ChatHistorySidebar';
import MemoryManagerModal from '../components/assistant/MemoryManagerModal';
import api from '../services/api';
import {
  Cpu,
  Send,
  Mic,
  MicOff,
  Headphones,
  Volume2,
  VolumeX,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Square,
  X,
  Radio,
  Bot,
  User,
  Copy,
  Check,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  History,
  Brain,
} from 'lucide-react';

export default function AIAssistant() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentLocale = getSpeechLocale(i18n.language || 'en');
  const userId = user?._id || user?.id || 'default_farmer';

  // Conversation & History State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

  // Messages state
  const defaultWelcomeMessage = {
    id: 'welcome',
    sender: 'assistant',
    content: `Hello ${user?.name || 'Farmer'}! I am AgriQura AI, powered by real-time crop intelligence and Groq Llama-3 inference.\n\nAsk me anything about pest management, weather advisories, fertilizer schedules, or mandi market rates!`,
    feedbackSubmitted: false,
  };

  const [messages, setMessages] = useState([defaultWelcomeMessage]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [voiceOrbState, setVoiceOrbState] = useState('idle'); // 'listening' | 'thinking' | 'speaking' | 'idle'
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [liveVoiceTranscript, setLiveVoiceTranscript] = useState('');
  const [speakingCharIndex, setSpeakingCharIndex] = useState(0);
  const [activeAiResponse, setActiveAiResponse] = useState('');
  const [lastUserQuestion, setLastUserQuestion] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const liveVoiceTranscriptRef = useRef('');
  const hasAutoExecutedRef = useRef(false);
  const isStreamingRef = useRef(false);
  isStreamingRef.current = isStreaming;

  const suggestedQuestions = [
    'My cotton leaves are turning yellow with brown spots. What should I do?',
    'Can I spray pesticide today given current wind and rainfall forecast?',
    'What is the current Warangal Mandi price for Cotton?',
    'How do I apply for PM-KISAN ₹6,000 scheme benefits?',
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveVoiceTranscript]);

  // Load conversations from MongoDB & Local Cache for this user
  const loadConversations = useCallback(async () => {
    const cacheKey = `agriqura_conversations_${userId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setConversations(JSON.parse(cached));
      } catch (e) {}
    }

    try {
      const res = await api.get('/assistant/conversations');
      if (res.data && res.data.conversations) {
        setConversations(res.data.conversations);
        localStorage.setItem(cacheKey, JSON.stringify(res.data.conversations));
      }
    } catch (err) {
      console.warn('⚠️ [Conversations Fetch Notice]:', err.message);
    }
  }, [userId]);

  // Reset on user change
  useEffect(() => {
    setActiveConversationId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        content: `Hello ${user?.name || 'Farmer'}! I am AgriQura AI, powered by real-time crop intelligence and Groq Llama-3 inference.\n\nAsk me anything about pest management, weather advisories, fertilizer schedules, or mandi market rates!`,
        feedbackSubmitted: false,
      },
    ]);
    loadConversations();
  }, [userId, loadConversations]);

  // Load specific conversation messages
  const handleSelectConversation = async (convId) => {
    stopSpeaking();
    setActiveSpeakingMsgId(null);
    setActiveConversationId(convId);

    // Check local messages cache first
    const msgCacheKey = `agriqura_msgs_${userId}_${convId}`;
    const cachedMsgs = localStorage.getItem(msgCacheKey);
    if (cachedMsgs) {
      try {
        setMessages(JSON.parse(cachedMsgs));
      } catch (e) {}
    }

    try {
      const res = await api.get(`/assistant/conversations/${convId}/messages`);
      if (res.data && res.data.messages && res.data.messages.length > 0) {
        const formatted = res.data.messages.map((m) => ({
          id: m._id || m.id || Date.now().toString(),
          sender: m.sender || 'assistant',
          content: m.content || '',
          feedbackSubmitted: false,
        }));
        setMessages(formatted);
        localStorage.setItem(msgCacheKey, JSON.stringify(formatted));
      }
    } catch (err) {
      console.warn('⚠️ [Conversation Messages Fetch Notice]:', err.message);
    }
  };

  // Start New Conversation
  const handleNewConversation = () => {
    stopSpeaking();
    setActiveSpeakingMsgId(null);
    setActiveConversationId(null);
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        content: `Hello ${user?.name || 'Farmer'}! I am AgriQura AI, powered by real-time crop intelligence and Groq Llama-3 inference.\n\nAsk me anything about pest management, weather advisories, fertilizer schedules, or mandi market rates!`,
        feedbackSubmitted: false,
      },
    ]);
    setInputMessage('');
    inputRef.current?.focus();
  };

  // Delete Conversation
  const handleDeleteConversation = (convId) => {
    const updated = conversations.filter((c) => (c._id || c.id) !== convId);
    setConversations(updated);
    localStorage.setItem(`agriqura_conversations_${userId}`, JSON.stringify(updated));
    localStorage.removeItem(`agriqura_msgs_${userId}_${convId}`);

    if (activeConversationId === convId) {
      handleNewConversation();
    }
  };

  // Voice Chat Handoff from URL query params (?q=...&auto=true)
  useEffect(() => {
    const q = searchParams.get('q');
    const auto = searchParams.get('auto');
    if (q && !hasAutoExecutedRef.current) {
      hasAutoExecutedRef.current = true;
      if (auto === 'true') {
        handleSendMessage(q, true);
      } else {
        setInputMessage(q);
      }
    }
  }, [searchParams]);

  // Listen for global in-page voice chat submission events
  useEffect(() => {
    const handleVoiceSubmit = (e) => {
      if (e.detail?.message) {
        handleSendMessage(e.detail.message, true);
      }
    };
    window.addEventListener('agriqura-voice-chat-submit', handleVoiceSubmit);
    return () => window.removeEventListener('agriqura-voice-chat-submit', handleVoiceSubmit);
  }, []);

  // Stop any active TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      speechRecognitionService.abort();
    };
  }, []);

  /**
   * Main Send Message Pipeline (SSE Streaming with text-to-speech synchronization)
   */
  const handleSendMessage = async (textToSend, autoSpeak = false) => {
    const queryText = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!queryText || isStreamingRef.current) return;

    stopSpeaking();
    setActiveSpeakingMsgId(null);

    const userMsgId = Date.now().toString();
    const newUserMessage = { id: userMsgId, sender: 'user', content: queryText };
    setLastUserQuestion(queryText);
    setActiveAiResponse('');
    setSpeakingCharIndex(0);

    const effectiveConvId = activeConversationId || `conv_${userId}_${userMsgId}`;
    if (!activeConversationId) {
      setActiveConversationId(effectiveConvId);
      const newConvObj = {
        _id: effectiveConvId,
        id: effectiveConvId,
        user: userId,
        title: queryText.length > 38 ? queryText.slice(0, 38) + '...' : queryText,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
      };
      setConversations((prev) => {
        const nextList = [newConvObj, ...prev.filter((c) => (c._id || c.id) !== effectiveConvId)];
        localStorage.setItem(`agriqura_conversations_${userId}`, JSON.stringify(nextList));
        return nextList;
      });
    }

    const assistantMsgId = (Date.now() + 1).toString();
    const newAssistantMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      isStreaming: true,
    };

    const currentChatMessages = [...messages, newUserMessage, newAssistantMessage];
    setMessages(currentChatMessages);
    setInputMessage('');
    setIsStreaming(true);
    if (isVoiceModeOpen) setVoiceOrbState('thinking');

    try {
      const token = localStorage.getItem('agriqura_token');
      const response = await fetch('http://localhost:5000/api/assistant/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          conversationId: activeConversationId || undefined,
          userMessage: queryText,
          language: i18n.language || 'en',
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.chunk) {
                const delta =
                  typeof parsed.chunk === 'string'
                    ? parsed.chunk
                    : parsed.chunk.choices?.[0]?.delta?.content || '';
                accumulatedContent += delta;
                setActiveAiResponse(accumulatedContent);

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              }
            } catch {
              // Ignore non-JSON stream ping
            }
          }
        }
      }

      // Finalize message display
      const finalizedMessages = currentChatMessages.map((msg) =>
        msg.id === assistantMsgId
          ? { ...msg, content: accumulatedContent, isStreaming: false }
          : msg
      );
      setMessages(finalizedMessages);
      setActiveAiResponse(accumulatedContent);

      // Save strictly per-user and per-conversation
      localStorage.setItem(`agriqura_msgs_${userId}_${effectiveConvId}`, JSON.stringify(finalizedMessages));

      // Refresh conversation sidebar list
      loadConversations();

      // Trigger synchronized voice output if requested or in ChatGPT/Gemini Live Voice Mode
      if ((autoSpeak || isVoiceModeOpen) && accumulatedContent) {
        const cleanSpeakText = accumulatedContent
          .replace(/[*#_`]/g, '')
          .replace(/💡 Direct Answer:/i, '')
          .replace(/📖 Explanation:/i, '')
          .replace(/✅ Recommended Actions:/i, '')
          .trim();

        if (cleanSpeakText) {
          setActiveSpeakingMsgId(assistantMsgId);
          if (isVoiceModeOpen) setVoiceOrbState('speaking');

          await speak(cleanSpeakText, currentLocale, {
            onStart: () => {
              setActiveSpeakingMsgId(assistantMsgId);
              setSpeakingCharIndex(0);
              if (isVoiceModeOpen) setVoiceOrbState('speaking');
            },
            onBoundary: ({ charIndex }) => {
              if (charIndex !== undefined) {
                setSpeakingCharIndex(charIndex);
              }
            },
            onEnd: () => {
              setActiveSpeakingMsgId(null);
              setSpeakingCharIndex(999999);
              if (isVoiceModeOpen) {
                setVoiceOrbState('idle');
                setTimeout(() => startVoiceModeListening(), 350);
              }
            },
          });
        }
      }
    } catch (error) {
      console.error('❌ [Chat Stream Error]:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  '⚠️ AgriQura assistant is temporarily offline. Please check your network or try asking your question again.',
                isStreaming: false,
              }
            : msg
        )
      );
      if (isVoiceModeOpen) setVoiceOrbState('idle');
    } finally {
      setIsStreaming(false);
      if (!isVoiceModeOpen) setVoiceOrbState('idle');
    }
  };

  /**
   * Inline Dictation (Mic inside Input Bar)
   */
  const handleToggleDictation = () => {
    if (isDictating) {
      speechRecognitionService.stop();
      setIsDictating(false);
      return;
    }

    stopSpeaking();
    setActiveSpeakingMsgId(null);
    setIsDictating(true);
    liveVoiceTranscriptRef.current = '';

    speechRecognitionService.start({
      language: currentLocale,
      onStart: () => setIsDictating(true),
      onResult: ({ transcript: activeText }) => {
        liveVoiceTranscriptRef.current = activeText;
        setInputMessage(activeText);
      },
      onEnd: (finalText) => {
        setIsDictating(false);
        const resolvedText = (finalText || liveVoiceTranscriptRef.current || '').trim();
        if (resolvedText) {
          setInputMessage(resolvedText);
        }
      },
      onError: (err) => {
        console.warn('⚠️ Dictation error:', err);
        setIsDictating(false);
      },
    });
  };

  /**
   * ChatGPT-Style Full Voice Mode Orchestration
   */
  const handleInterruptSpeaking = () => {
    stopSpeaking();
    setActiveSpeakingMsgId(null);
    setSpeakingCharIndex(999999);
    if (isVoiceModeOpen) setVoiceOrbState('idle');
  };

  const handleOpenVoiceMode = () => {
    stopSpeaking();
    setActiveSpeakingMsgId(null);
    handleNewConversation(); // Clear chat on enter
    setIsVoiceModeOpen(true);
    setLiveVoiceTranscript('');
    setActiveAiResponse('');
    setLastUserQuestion('');
    liveVoiceTranscriptRef.current = '';
    startVoiceModeListening();
  };

  const handleClearVoiceText = () => {
    stopSpeaking();
    setActiveSpeakingMsgId(null);
    setVoiceOrbState('idle');
    setLiveVoiceTranscript('');
    setActiveAiResponse('');
    setLastUserQuestion('');
    liveVoiceTranscriptRef.current = '';
  };

  const handleCloseVoiceMode = () => {
    stopSpeaking();
    speechRecognitionService.abort();
    setIsVoiceModeOpen(false);
    setVoiceOrbState('idle');
    setLiveVoiceTranscript('');
    liveVoiceTranscriptRef.current = '';
  };

  const startVoiceModeListening = useCallback(() => {
    stopSpeaking();
    setVoiceOrbState('listening');
    setLiveVoiceTranscript('');
    liveVoiceTranscriptRef.current = '';

    speechRecognitionService.start({
      language: currentLocale,
      onStart: () => setVoiceOrbState('listening'),
      onResult: ({ transcript: activeText }) => {
        liveVoiceTranscriptRef.current = activeText;
        setLiveVoiceTranscript(activeText);
      },
      onEnd: (finalText) => {
        const queryText = (finalText || liveVoiceTranscriptRef.current || '').trim();
        if (queryText.length > 0) {
          setLiveVoiceTranscript(queryText);
          handleSendMessage(queryText, true);
        } else {
          setVoiceOrbState('idle');
        }
      },
      onError: () => {
        setVoiceOrbState('idle');
      },
    });
  }, [currentLocale]);

  /**
   * Speak / Stop Message Audio Toggle
   */
  const handleToggleSpeak = (msgId, text) => {
    if (activeSpeakingMsgId === msgId) {
      stopSpeaking();
      setActiveSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setActiveSpeakingMsgId(msgId);
      const cleanText = text.replace(/[*#_`]/g, '').trim();
      speak(cleanText, currentLocale, {
        onStart: () => setActiveSpeakingMsgId(msgId),
        onEnd: () => setActiveSpeakingMsgId(null),
      });
    }
  };

  /**
   * Copy message text to clipboard
   */
  const handleCopyMessage = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  /**
   * Thumbs up/down feedback
   */
  const handleFeedback = async (msgId, type) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, feedback: type, feedbackSubmitted: true } : m
      )
    );
  };

  /**
   * Clear Chat
   */
  const handleClearChat = () => {
    handleNewConversation();
  };

  /**
   * Click Suggested Query Chip
   */
  const handleSelectSuggested = (questionText) => {
    setInputMessage(questionText);
    handleSendMessage(questionText);
  };

  /**
   * Handle Enter Key
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Simple markdown text renderer
   */
  const formatMarkdownText = (rawContent) => {
    if (!rawContent) return null;
    return rawContent.split('\n').map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className={line.startsWith('#') ? 'font-bold text-emerald-400 mt-1' : ''}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="text-emerald-300 font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const activeConvTitle =
    conversations.find((c) => (c._id || c.id) === activeConversationId)?.title ||
    'New Farm Inquiry';

  return (
    <div className="flex h-[calc(100vh-4.5rem)] w-full overflow-hidden bg-slate-950">
      
      {/* ───── Left Conversation History Sidebar ───── */}
      <ChatHistorySidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenMemoryModal={() => setIsMemoryModalOpen(true)}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        user={user}
      />

      {/* ───── Main Chat & Conference Window ───── */}
      <div className="flex-1 flex flex-col h-full min-w-0 px-2 sm:px-4 py-2 relative">
        
        {/* ───── Top Header Bar ───── */}
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg mb-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Desktop Sidebar Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Sidebar Drawer Button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1"
              title="View History"
            >
              <History className="w-4 h-4 text-emerald-400" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-agri-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-agri-500/20 shrink-0">
              <Cpu className="w-4 h-4 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-xs">
                  {activeConvTitle}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold bg-agri-500/20 text-agri-300 border border-agri-500/30">
                  Groq Llama-3
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.farms?.[0]?.crop ? `${user.farms[0].crop} Advisory` : 'Multilingual Agronomy AI'}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* AI Long-term Memory Trigger */}
            <button
              type="button"
              onClick={() => setIsMemoryModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-800/50 text-xs font-semibold shadow-md shadow-purple-950/50 transition-all active:scale-95"
              title="Manage Saved Farm Memories (ChatGPT / Gemini style)"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Memory</span>
            </button>

            {/* New Chat Quick Button */}
            <button
              type="button"
              onClick={handleNewConversation}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Start New Chat"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>New</span>
            </button>

            {/* Siri / Gemini Live Voice Mode Trigger */}
            <button
              type="button"
              onClick={handleOpenVoiceMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 hover:brightness-110 active:scale-95 transition-all"
              title="Launch Siri / Gemini Live Voice Mode"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Call</span>
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              onClick={handleClearChat}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all border border-slate-800"
              title="Clear Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ───── Chat Messages Scroll Area ───── */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-2 space-y-4 pb-3 scroll-smooth custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isMsgSpeaking = activeSpeakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3.5 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md ${
                    isUser
                      ? 'bg-gradient-to-tr from-slate-700 to-slate-600 text-white border border-slate-500'
                      : 'bg-gradient-to-tr from-agri-600 to-emerald-500 text-white shadow-agri-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`group relative rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-agri-600 to-emerald-600 text-white rounded-tr-sm shadow-agri-950/40'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-sm shadow-slate-950/60'
                  }`}
                >
                  {/* Streaming Pulse Indicator */}
                  {msg.isStreaming && !msg.content && (
                    <div className="flex items-center gap-1.5 py-1 text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-agri-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-agri-400 animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-agri-400 animate-pulse delay-150" />
                      <span className="text-xs text-agri-400 font-medium ml-1">
                        Thinking...
                      </span>
                    </div>
                  )}

                  {/* Message Content with Markdown Formatting */}
                  <div className="space-y-2 whitespace-pre-wrap break-words font-sans">
                    {formatMarkdownText(msg.content)}
                  </div>

                  {/* Assistant Message Actions Toolbar */}
                  {!isUser && !msg.isStreaming && msg.content && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 text-slate-400 text-xs">
                      {/* Speak / Stop Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                          isMsgSpeaking
                            ? 'bg-emerald-500/20 text-emerald-400 font-bold animate-pulse border border-emerald-500/30'
                            : 'hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        title={isMsgSpeaking ? 'Stop Speaking' : 'Listen Spoken Audio'}
                      >
                        {isMsgSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {/* Copy Text Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition-all"
                        title="Copy response"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Helpful Feedback */}
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, 'positive')}
                          disabled={msg.feedbackSubmitted}
                          className={`p-1 rounded hover:bg-slate-800 transition-all ${
                            msg.feedback === 'positive'
                              ? 'text-emerald-400 font-bold'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg.id, 'negative')}
                          disabled={msg.feedbackSubmitted}
                          className={`p-1 rounded hover:bg-slate-800 transition-all ${
                            msg.feedback === 'negative'
                              ? 'text-red-400 font-bold'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ───── Suggested Question Chips (Only if few messages) ───── */}
        {messages.length <= 2 && (
          <div className="mb-2 shrink-0">
            <p className="text-[11px] font-semibold text-slate-400 mb-1.5 px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{t('assistant.suggested', 'Suggested Queries')}:</span>
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggested(q)}
                  className="text-xs text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ───── Unified Input Field (ChatGPT-Style with Inline Mic & Send) ───── */}
        <div className="relative shrink-0 pt-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-agri-500/80 focus-within:ring-2 focus-within:ring-agri-500/20 shadow-xl transition-all"
          >
            {/* Input Text Area */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isDictating
                  ? t('assistant.listeningInput', 'Listening to your voice...')
                  : t('assistant.inputPlaceholder', 'Ask about crops, pests, market prices, weather...')
              }
              disabled={isStreaming}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 pl-4 pr-24 py-3.5 focus:outline-none disabled:opacity-50"
            />

            {/* Right Action Icons (Dictate Mic + Send / Voice Launcher) */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {/* Inline Dictation Mic Button */}
              <button
                type="button"
                onClick={handleToggleDictation}
                className={`p-2 rounded-xl transition-all ${
                  isDictating
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={isDictating ? 'Stop Voice Dictation' : 'Speak Message (Speech to Text)'}
              >
                {isDictating ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-slate-300 hover:text-emerald-400 transition-colors" />
                )}
              </button>

              {/* Send Button or Stop Streaming */}
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Stop generation"
                >
                  <Square className="w-4 h-4 fill-current text-slate-300" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isStreaming}
                  className={`p-2 rounded-xl font-bold transition-all shadow-md ${
                    inputMessage.trim()
                      ? 'bg-gradient-to-tr from-agri-600 to-emerald-500 text-white shadow-agri-600/30 hover:brightness-110 active:scale-95'
                      : 'text-slate-600 bg-slate-800/60 cursor-not-allowed'
                  }`}
                  title="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}

            </div>
          </form>

          <p className="text-[10px] text-slate-500 text-center mt-1.5">
            AgriQura AI integrates local agronomy with real-time weather & mandi telemetry.
          </p>
        </div>

      </div>

      {/* ───── Gemini Live / Siri 3D Voice Conference Modal ───── */}
      <GeminiLiveVoiceModal
        isOpen={isVoiceModeOpen}
        onClose={handleCloseVoiceMode}
        voiceOrbState={voiceOrbState}
        liveVoiceTranscript={liveVoiceTranscript}
        activeAiResponse={activeAiResponse}
        speakingCharIndex={speakingCharIndex}
        onStartListening={startVoiceModeListening}
        onStopListening={() => speechRecognitionService.stop()}
        onInterruptSpeaking={handleInterruptSpeaking}
        currentLanguage={currentLocale}
        userQuestion={lastUserQuestion}
        onClearText={handleClearVoiceText}
      />

      {/* ───── ChatGPT / Gemini Style Long-Term Memory Modal ───── */}
      <MemoryManagerModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onMemoryUpdated={loadConversations}
      />

    </div>
  );
}
