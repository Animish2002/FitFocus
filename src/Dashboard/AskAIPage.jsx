// components/dashboard/AskAIPage.jsx
"use client";

import React, { useState } from "react";
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
import { Mic, Send, Loader2, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";

// Framer Motion variants for animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function AskAIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle sending the prompt to the AI model
  const handleAskAI = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setResponse(""); // Clear previous response
    setError(null); // Clear previous error

    try {
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = ""; // This will be automatically provided by the Canvas environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || `API error: ${res.status}`);
      }

      const result = await res.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        setResponse(result.candidates[0].content.parts[0].text);
      } else {
        setResponse("No response from AI. Please try again.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError(`Failed to get response: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for voice input functionality
  const handleVoiceInput = () => {
    setError("Voice input is not yet implemented in this demo.");
    // In a real application, you would integrate Web Speech API or a third-party service here.
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-bold text-white">Ask AI Assistant</h1>
        <p className="text-gray-400 mt-2">
          Get instant insights and help with your fitness and study plans.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Your Query</CardTitle>
            <CardDescription className="text-gray-400">
              Type your question or use voice input.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'Suggest a 30-minute high-intensity workout for beginners' or 'Summarize key concepts from quantum physics.'"
              className="min-h-[120px] bg-white/5 border-white/20 focus:border-[#3EB489] text-white placeholder-gray-400 rounded-md"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-[#3EB489] to-[#2ea374] hover:from-[#2ea374] hover:to-[#3EB489] text-white rounded-md"
                onClick={handleAskAI}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asking AI...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask AI
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white rounded-md"
                onClick={handleVoiceInput}
                disabled={loading}
              >
                <Mic className="mr-2 h-4 w-4" />
                Voice Input (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Response Display */}
      {(response || error) && (
        <motion.div variants={fadeInUp}>
          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquareText className="mr-2 h-5 w-5 text-[#3EB489]" />
                AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center text-gray-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating response...
                </div>
              )}
              {error && <p className="text-red-400">{error}</p>}
              {response && (
                <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
