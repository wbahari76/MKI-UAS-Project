"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CONTACTS = [
  { id: 1, name: "Budi Santoso", role: "Volunteer", unread: 2, isOnline: true },
  { id: 2, name: "Andi Saputra", role: "Volunteer", unread: 0, isOnline: false },
  { id: 3, name: "Admin JALA", role: "Support", unread: 0, isOnline: true },
];

const INITIAL_CHATS: Record<number, any[]> = {
  1: [
    { id: 1, sender: "Me", isMe: true, text: "Hi Budi, your application for the Coastal Cleanup was approved!", time: "09:00 AM" },
    { id: 2, sender: "Budi Santoso", isMe: false, text: "Thank you so much! I'm really looking forward to it.", time: "09:05 AM" },
    { id: 3, sender: "Budi Santoso", isMe: false, text: "Do I need to bring any specific equipment?", time: "09:06 AM" },
  ],
  2: [
    { id: 1, sender: "Andi Saputra", isMe: false, text: "Hello, I sent my application for the Tree Planting project yesterday.", time: "Yesterday" },
  ],
  3: [
    { id: 1, sender: "Admin JALA", isMe: false, text: "Your organization profile is fully verified. You can now post more projects.", time: "Mon" },
  ]
};

export default function OrganizationMessagesPage() {
  const { socket } = useSocket();
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [newMessage, setNewMessage] = useState("");
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeContact]);

  useEffect(() => {
    if (!socket) return;
    
    socket.on("new-message", (message: any) => {
      // In a real app we'd determine which contact sent this. 
      // For the mock, we just append to the active contact.
      setChats((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), { ...message, isMe: false }]
      }));
    });
    
    return () => {
      socket.off("new-message");
    };
  }, [socket, activeContact.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "Me",
      isMe: true,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), msg]
    }));
    
    socket?.emit("send-message", { ...msg, sender: "Organization" });
    setNewMessage("");

    // Auto-reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        sender: activeContact.name,
        isMe: false,
        text: `Automated reply from ${activeContact.name}. I'll get back to you soon!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), reply]
      }));
    }, 1500);
  };

  const currentMessages = chats[activeContact.id] || [];

  return (
    <div className="h-[calc(100vh-140px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 flex bg-white rounded-xl sm:rounded-none overflow-hidden shadow-sm shadow-slate-200 border border-slate-100">
      
      {/* Sidebar Contacts */}
      <div className="w-full sm:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 hidden sm:flex">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 h-10 bg-slate-50 border-0 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {CONTACTS.map((contact) => {
            const contactMessages = chats[contact.id] || [];
            const lastMessage = contactMessages[contactMessages.length - 1];

            return (
              <div 
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                  activeContact.id === contact.id ? 'bg-white border-l-2 border-l-emerald-500 shadow-sm' : 'hover:bg-slate-100 border-l-2 border-l-transparent'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-slate-200">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-semibold text-slate-900 text-sm truncate">{contact.name}</h4>
                    <span className="text-xs text-slate-400 shrink-0">{lastMessage?.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500 truncate">{lastMessage?.text || "No messages yet."}</p>
                    {contact.unread > 0 && contact.id !== activeContact.id && (
                      <span className="w-5 h-5 flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold rounded-full shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-slate-200">
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {activeContact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900">{activeContact.name}</h3>
              <p className="text-xs text-emerald-500 font-medium">
                {activeContact.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600 rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600 rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {currentMessages.map((msg, idx) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {!msg.isMe && (
                  <Avatar className="w-8 h-8 shrink-0 mb-1">
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                      {msg.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.isMe 
                    ? 'bg-emerald-500 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm shadow-slate-100'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 mx-10">{msg.time}</span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-full shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-full shrink-0 hidden sm:flex">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 h-12 bg-slate-50 border-0 focus-visible:ring-emerald-500 rounded-full px-6"
            />
            <Button 
              type="submit" 
              className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 shadow-sm"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
