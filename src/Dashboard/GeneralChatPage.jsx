import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  MessageSquareText,
  User,
  Bot,
  PlusCircle, // For new chat
  Trash2, // For deleting chat
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

// Framer Motion variants for animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function GeneralChatPage() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [conversationId, setConversationId] = useState(null); // Tracks current conversation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationsList, setConversationsList] = useState([]); // List of user's conversations
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // --- Fetch Conversations List on Mount ---
  useEffect(() => {
    const fetchConversations = async () => {
      setListLoading(true);
      setListError(null);
      try {
        const response = await axiosInstance.get('/ai/conversations');
        setConversationsList(response.data);
      } catch (err) {
        console.error("Failed to fetch conversations list:", err);
        setListError(err.response?.data?.message || err.message || "Failed to load conversations.");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setListLoading(false);
      }
    };
    fetchConversations();
  }, [logout]);

  // --- Load Selected Conversation ---
  useEffect(() => {
    const loadConversation = async () => {
      if (conversationId) {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.get(`/ai/conversations/${conversationId}`);
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Failed to load conversation:", err);
          setError(err.response?.data?.message || err.message || "Failed to load conversation history.");
          // If conversation not found or unauthorized, start new chat
          if (err.response && (err.response.status === 404 || err.response.status === 403)) {
            handleNewChat();
          }
        } finally {
          setLoading(false);
        }
      } else {
        setMessages([]); // Clear messages if no conversation selected
      }
    };
    loadConversation();
  }, [conversationId, logout]);

  // --- Auto-scroll to latest message ---
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- Handle Sending Message ---
  const handleSendMessage = async () => {
    if (!currentPrompt.trim()) {
      setError("Please enter a message.");
      return;
    }

    const newMessage = { role: "user", text: currentPrompt, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, newMessage]); // Optimistic update
    setCurrentPrompt(""); // Clear input
    setLoading(true);
    setError(null);

    try {
      const payload = {
        prompt: newMessage.text,
        conversationId: conversationId, // Will be null for new chats
      };

      const response = await axiosInstance.post('/ai/chat', payload);
      const data = response.data;

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.response, timestamp: new Date().toISOString() },
      ]);
      setConversationId(data.conversationId); // Update conversationId if new chat was created

      // Refresh conversations list if a new conversation was created
      if (!conversationId && data.conversationId) {
        const listResponse = await axiosInstance.get('/ai/conversations');
        setConversationsList(listResponse.data);
      }

    } catch (err) {
      console.error("Error sending message to AI chat:", err);
      setError(err.response?.data?.message || err.message || "Failed to get AI response.");
      setMessages((prev) => prev.filter(msg => msg !== newMessage)); // Revert optimistic update
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Start a New Chat ---
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setCurrentPrompt("");
    setError(null);
    setLoading(false);
  };

  // --- Delete a Conversation ---
  const handleDeleteConversation = async (idToDelete) => {
    if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      return;
    }
    setListLoading(true); // Show loading for list
    setListError(null);
    try {
      await axiosInstance.delete(`/ai/conversations/${idToDelete}`);
      // If the currently viewed conversation is deleted, clear it
      if (conversationId === idToDelete) {
        handleNewChat();
      }
      // Refetch the list of conversations
      const response = await axiosInstance.get('/ai/conversations');
      setConversationsList(response.data);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      setListError(err.response?.data?.message || err.message || "Failed to delete conversation.");
    } finally {
      setListLoading(false);
    }
  };


  return (
    <motion.div
      className="flex h-[calc(100vh-64px)] overflow-hidden" // Adjust height based on Navbar height
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      {/* Left Sidebar for Conversations List */}
      <motion.div
        className="hidden md:flex flex-col w-72 bg-slate-800 border-r border-white/10 p-4 space-y-4 overflow-y-auto"
        variants={fadeInUp}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Chats</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            className="text-gray-300 hover:text-white"
            title="Start New Chat"
          >
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
        {listLoading ? (
          <div className="flex items-center text-gray-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading chats...
          </div>
        ) : listError ? (
          <p className="text-red-400 text-sm flex items-center"><XCircle className="w-4 h-4 mr-1" /> {listError}</p>
        ) : conversationsList.length === 0 ? (
          <p className="text-gray-400 text-sm">No conversations yet. Start a new one!</p>
        ) : (
          <div className="space-y-2">
            {conversationsList.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors duration-200
                  ${conversationId === conv.id ? "bg-[#3EB489]/20 text-[#3EB489]" : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"}`}
                onClick={() => setConversationId(conv.id)}
              >
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sm truncate">{conv.title}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {conv.lastMessageSnippet || "No messages yet."}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 text-gray-400 hover:text-red-400 ml-2"
                  onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }}
                  title="Delete Conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Right Main Chat Area */}
      <motion.div
        className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8"
        variants={fadeInUp}
      >
        <Card className="flex flex-col flex-grow bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-white flex items-center">
              <MessageSquareText className="mr-2 h-5 w-5 text-[#3EB489]" />
              {conversationId ? conversationsList.find(c => c.id === conversationId)?.title || "AI Chat" : "New AI Chat"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Have a natural conversation with your AI assistant.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow p-4 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading messages...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-400 text-center">
                <XCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-center">
                <p>Start a conversation by typing a message below!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    variants={fadeInUp}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                        msg.role === "user"
                          ? "bg-[#3EB489] text-white"
                          : "bg-slate-700 text-gray-200"
                      }`}
                    >
                      <div className="flex items-center text-xs font-semibold mb-1">
                        {msg.role === "user" ? (
                          <>
                            <User className="w-3 h-3 mr-1" /> You
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 mr-1" /> AI
                          </>
                        )}
                        <span className="ml-auto text-gray-300">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <Textarea
                placeholder="Type your message..."
                className="flex-grow min-h-[50px] max-h-[150px] bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400 rounded-md resize-y"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent new line
                    handleSendMessage();
                  }
                }}
                disabled={loading}
              />
              <Button
                size="icon"
                className="h-12 w-12 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white rounded-md flex-shrink-0"
                onClick={handleSendMessage}
                disabled={loading || !currentPrompt.trim()}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}