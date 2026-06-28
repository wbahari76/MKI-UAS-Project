"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User, FileText, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  isSimulated?: boolean;
}

const INITIAL_SUGGESTIONS = [
  "Help me draft a project description for Coastal Cleanup",
  "Summarize the latest volunteer applications",
  "How can I improve my organization's profile?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your JALA VIVE Organization Assistant. I can help you draft project descriptions, analyze your volunteer applicants, or give tips to increase engagement. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAiResponse = (userText: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let aiReply = "I understand. As an AI assistant, I can help you organize and manage your volunteering efforts on JALA VIVE.";
      
      const lowerText = userText.toLowerCase();
      if (lowerText.includes("draft") || lowerText.includes("description") || lowerText.includes("coastal")) {
        aiReply = "Here is a draft for your Coastal Cleanup project:\n\n**Title:** Coastal Cleanup 2026\n**Description:** Join us in our mission to preserve marine life! We will be cleaning up the northern coastline to prevent plastic waste from entering the ocean.\n**Requirements:** Bring your own water bottle, wear comfortable clothes, and be ready to make an impact!";
      } else if (lowerText.includes("summarize") || lowerText.includes("application")) {
        aiReply = "You currently have 3 pending applications across all active projects. The average profile completion of your applicants is 85%. Most of them have listed 'Environmental Activism' in their skills!";
      } else if (lowerText.includes("improve") || lowerText.includes("profile")) {
        aiReply = "To improve your organization's profile, I recommend uploading high-quality images to your gallery and ensuring that your 'Mission Statement' is clear and action-oriented.";
      }
      
      setMessages((prev) => [...prev, { id: Date.now(), sender: "ai", text: aiReply, isSimulated: true }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text }]);
    setInput("");
    simulateAiResponse(text);
  };

  return (
    <div className="h-[calc(100vh-140px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 flex bg-forest-card rounded-xl sm:rounded-none overflow-hidden shadow-sm shadow-forest-border/20 border border-forest-border">
      
      {/* Sidebar - Assistant features */}
      <div className="w-full sm:w-80 border-r border-forest-border bg-[#181A15]/50 hidden sm:flex flex-col">
        <div className="p-6 border-b border-forest-border bg-forest-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-forest-accent/20 flex items-center justify-center text-forest-accent border border-forest-accent/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-forest-beige tracking-tight">AI Assistant</h2>
          </div>
          <p className="text-sm text-forest-muted">Your intelligent copilot for managing volunteer projects.</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-forest-beige mb-3 uppercase tracking-wider text-[#7A8072]">Capabilities</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-forest-muted">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Draft project descriptions automatically</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-forest-muted">
                <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Summarize and filter applicants</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-forest-muted">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Get recommendations for engagement</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-forest-beige mb-3 uppercase tracking-wider text-[#7A8072]">Suggested Queries</h3>
            <div className="space-y-2">
              {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="w-full text-left p-3 rounded-xl bg-[#21261B] hover:bg-[#2A2F22] border border-forest-border transition-colors text-sm text-forest-beige flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{suggestion}</span>
                  <ChevronRight className="w-4 h-4 text-forest-muted group-hover:text-forest-accent shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#181A15]/30 relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <Avatar className={`w-8 h-8 shrink-0 ${msg.sender === "ai" ? "bg-forest-accent/20 border border-forest-accent/30" : "bg-[#2C3322] border border-forest-border"}`}>
                {msg.sender === "ai" ? (
                  <Bot className="w-4 h-4 text-forest-accent mx-auto my-auto" />
                ) : (
                  <User className="w-4 h-4 text-forest-muted mx-auto my-auto" />
                )}
              </Avatar>
              
              <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-5 py-4 rounded-2xl ${
                  msg.sender === "user" 
                    ? "bg-forest-accent text-forest-beige rounded-tr-sm" 
                    : "bg-forest-card border border-forest-border text-forest-beige rounded-tl-sm shadow-sm"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.isSimulated && (
                  <span className="text-[10px] text-amber-500/70 mt-2 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Simulated AI Response
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-[85%]"
            >
              <Avatar className="w-8 h-8 shrink-0 bg-forest-accent/20 border border-forest-accent/30">
                <Bot className="w-4 h-4 text-forest-accent mx-auto my-auto" />
              </Avatar>
              <div className="px-5 py-4 rounded-2xl bg-forest-card border border-forest-border rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-forest-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-forest-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-forest-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-forest-card border-t border-forest-border">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Assistant..." 
              className="w-full h-14 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent rounded-full pl-6 pr-16 text-forest-beige placeholder:text-[#7A8072]"
            />
            <Button 
              type="submit" 
              className="absolute right-2 w-10 h-10 rounded-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige shrink-0 shadow-sm"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-forest-muted mt-3">
            AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
