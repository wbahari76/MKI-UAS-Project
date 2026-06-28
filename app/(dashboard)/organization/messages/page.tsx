"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, Phone, Video, Loader2, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [newMessage, setNewMessage] = useState("");
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, activeContact]);

  useEffect(() => {
    const channel = supabase.channel('chat:global', {
      config: { broadcast: { self: false } }
    });

    channel.on('broadcast', { event: 'new-message' }, (payload) => {
      const message = payload.payload;
      setChats((prev) => ({
        ...prev,
        [message.contactId]: [...(prev[message.contactId] || []), { ...message, isMe: false }]
      }));
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    
    supabase.channel('chat:global').send({
      type: 'broadcast',
      event: 'new-message',
      payload: { ...msg, contactId: activeContact.id }
    });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `chat-${Date.now()}.${fileExt}`;
      
      setIsUploading(true);
      
      const { error: uploadError } = await supabase.storage.from('community').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('community').getPublicUrl(fileName);
      
      const msg = {
        id: Date.now(),
        sender: "Me",
        isMe: true,
        text: `Sent an attachment: ${file.name}`,
        fileUrl: data.publicUrl,
        fileName: file.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats((prev) => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), msg]
      }));
      
      supabase.channel('chat:global').send({
        type: 'broadcast',
        event: 'new-message',
        payload: { ...msg, contactId: activeContact.id }
      });
      
    } catch (error: any) {
      toast.error("Failed to upload file: " + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentMessages = chats[activeContact.id] || [];

  return (
    <div className="h-[calc(100vh-140px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 flex bg-forest-card rounded-xl sm:rounded-none overflow-hidden shadow-sm shadow-forest-border/20 border border-forest-border">
      
      {/* Sidebar Contacts */}
      <div className="w-full sm:w-80 border-r border-forest-border flex flex-col bg-[#181A15]/50 hidden sm:flex">
        <div className="p-4 border-b border-forest-border bg-forest-card">
          <h2 className="text-lg font-bold text-forest-beige mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-9 h-10 bg-[#181A15] border-0 focus-visible:ring-forest-accent"
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
                className={`p-4 border-b border-forest-border cursor-pointer transition-colors flex items-start gap-3 ${
                  activeContact.id === contact.id ? 'bg-forest-card border-l-2 border-l-emerald-500 shadow-sm' : 'hover:bg-[#1E211A] border-l-2 border-l-transparent'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-forest-border">
                    <AvatarFallback className="bg-[#2C3322] text-[#829661]">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-forest-accent border-2 border-forest-border rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-semibold text-forest-beige text-sm truncate">{contact.name}</h4>
                    <span className="text-xs text-[#7A8072] shrink-0">{lastMessage?.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-forest-muted truncate">{lastMessage?.text || "No messages yet."}</p>
                    {contact.unread > 0 && contact.id !== activeContact.id && (
                      <span className="w-5 h-5 flex items-center justify-center bg-forest-accent text-forest-beige text-[10px] font-bold rounded-full shrink-0">
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
      <div className="flex-1 flex flex-col bg-forest-card">
        {/* Chat Header */}
        <div className="h-16 border-b border-forest-border flex items-center justify-between px-6 bg-forest-card shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-forest-border">
              <AvatarFallback className="bg-[#2C3322] text-[#829661]">
                {activeContact.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-forest-beige">{activeContact.name}</h3>
              <p className="text-xs text-forest-accent font-medium">
                {activeContact.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-[#829661] rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-[#829661] rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#181A15]/30">
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
                    <AvatarFallback className="bg-[#2A2F22] text-forest-muted text-xs">
                      {msg.sender.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-3 rounded-2xl ${
                  msg.isMe 
                    ? 'bg-forest-accent text-forest-beige rounded-br-sm' 
                    : 'bg-forest-card border border-forest-border text-forest-beige rounded-bl-sm shadow-sm shadow-forest-border/10'
                }`}>
                  {msg.fileUrl ? (
                    <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded bg-black/20 hover:bg-black/30 transition-colors mb-1">
                      <FileText className="w-5 h-5 shrink-0" />
                      <span className="text-sm truncate max-w-[150px]">{msg.fileName}</span>
                      <Download className="w-4 h-4 ml-1 opacity-70" />
                    </a>
                  ) : null}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
              <span className="text-[10px] text-[#7A8072] mt-1 mx-10">{msg.time}</span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-forest-card border-t border-forest-border">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="text-[#7A8072] hover:text-forest-muted rounded-full shrink-0 relative"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
            </Button>
            <Button type="button" variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted rounded-full shrink-0 hidden sm:flex">
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 h-12 bg-[#181A15] border-0 focus-visible:ring-forest-accent rounded-full px-6"
            />
            <Button 
              type="submit" 
              className="w-12 h-12 rounded-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige shrink-0 shadow-sm"
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
