"use client";

// Tambahkan import Suspense dari react
import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, Phone, Video, Loader2, FileText, Download, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

// 1. Ubah nama dari 'export default function VolunteerMessagesPage' menjadi komponen internal biasa
function VolunteerMessagesContent() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [contacts, setContacts] = useState<any[]>([]);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // Fetch Contacts
  useEffect(() => {
    if (!user) return;
    const fetchContacts = async () => {
      try {
        setLoadingContacts(true);

        // Fetch approved applications for this user
        const { data: appsData, error: appsError } = await supabase
          .from('project_applications')
          .select(`projects!inner(organization_id)`)
          .eq('user_id', user.id)
          .eq('status', 'approved');

        if (appsError) throw appsError;

        const orgIds = Array.from(new Set((appsData || []).map(a => (a.projects as any).organization_id)));

        if (orgIds.length === 0) {
          setContacts([]);
          setLoadingContacts(false);
          return;
        }

        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('id, owner_id, name, logo_url')
          .in('id', orgIds);

        if (orgsError) throw orgsError;

        // The actual chat is with the owner_id of the organization
        const formattedContacts = (orgs || []).map(org => ({
          id: org.owner_id,
          name: org.name || 'Unknown Organization',
          avatar_url: org.logo_url,
          role: "Organization",
          unread: 0,
          isOnline: true
        }));

        // Remove duplicates if multiple orgs have same owner
        const uniqueContacts = Array.from(new Map(formattedContacts.map(item => [item.id, item])).values());

        setContacts(uniqueContacts);

        if (uniqueContacts.length > 0) {
          if (initialUserId) {
            const found = uniqueContacts.find(c => c.id === initialUserId);
            if (found) setActiveContact(found);
            else setActiveContact(uniqueContacts[0]);
          } else {
            setActiveContact(uniqueContacts[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [user, initialUserId]);

  // Fetch Chats and Subscribe
  useEffect(() => {
    if (!user || !activeContact) return;

    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeContact.id}),and(sender_id.eq.${activeContact.id},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setChats(data || []);
        if (data && data.length > 0) {
          setConversationId(data[0].conversation_id);
        } else {
          setConversationId(crypto.randomUUID());
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();

    const channel = supabase.channel(`messages-vol-${activeContact.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          if (
            (msg.sender_id === user.id && msg.receiver_id === activeContact.id) ||
            (msg.sender_id === activeContact.id && msg.receiver_id === user.id)
          ) {
            setChats(prev => {
              if (prev.find(p => p.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeContact]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeContact) return;

    const msgText = newMessage.trim();
    setNewMessage("");

    const newMsg = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: activeContact.id,
      content: msgText,
      created_at: new Date().toISOString()
    };

    // Optimistic update
    setChats(prev => [...prev, newMsg]);

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: activeContact.id,
      content: msgText
    });

    if (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !user || !activeContact) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `chat-${Date.now()}.${fileExt}`;

      setIsUploading(true);

      const { error: uploadError } = await supabase.storage.from('community').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('community').getPublicUrl(fileName);

      const newMsg = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: activeContact.id,
        content: `Sent an attachment: ${file.name}`,
        image_url: data.publicUrl,
        created_at: new Date().toISOString()
      };

      setChats(prev => [...prev, newMsg]);

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: activeContact.id,
        content: `Sent an attachment: ${file.name}`,
        image_url: data.publicUrl
      });
      if (error) throw error;

      toast.success("File sent successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loadingContacts) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-forest-card rounded-2xl border border-forest-border overflow-hidden shadow-lg shadow-black/20">
      {/* Sidebar Contacts */}
      <div className={`${activeContact ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-forest-border flex-col bg-[#131511]`}>
        <div className="p-4 border-b border-forest-border bg-[#181A15]">
          <h2 className="text-xl font-bold text-forest-beige mb-4">{t("messages.title", "Messages")}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
            <Input
              placeholder={t("messages.search", "Search contacts...")}
              className="pl-9 bg-[#21261B] border-transparent focus-visible:ring-forest-accent rounded-xl text-forest-beige"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-forest-muted">
              <p>{t("messages.no_contacts_vol", "You haven't been approved for any projects yet.")}</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={`flex items-center p-4 cursor-pointer border-b border-[#21261B] transition-colors ${activeContact?.id === contact.id
                    ? "bg-[#2C3322]/50 border-l-4 border-l-[#829661]"
                    : "hover:bg-[#1E211A] border-l-4 border-l-transparent"
                  }`}
              >
                <div className="relative mr-4">
                  <Avatar className="w-12 h-12 border-2 border-forest-card shadow-sm">
                    {contact.avatar_url ? (
                      <img src={contact.avatar_url} alt={contact.name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-[#21261B] text-[#DFD5C2]">{contact.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#131511] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-forest-beige truncate pr-2">{contact.name}</h3>
                  </div>
                  <p className="text-xs text-forest-muted truncate">{contact.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeContact ? (
        <div className={`${activeContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-[#181A15]`}>
          {/* Chat Header */}
          <div className="h-20 border-b border-forest-border flex items-center justify-between px-4 md:px-6 bg-[#181A15]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden mr-2 -ml-2 text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B] rounded-full"
                onClick={() => setActiveContact(null)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Avatar className="w-10 h-10 mr-4 shadow-sm">
                {activeContact.avatar_url ? (
                  <img src={activeContact.avatar_url} alt={activeContact.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-[#21261B] text-[#DFD5C2]">{activeContact.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-bold text-forest-beige">{activeContact.name}</h3>
                <p className="text-xs text-emerald-500 font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  {t("messages.online", "Online")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B] rounded-full">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B] rounded-full">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B] rounded-full">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('/noise.png')] bg-repeat opacity-95">
            {loadingChats ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : chats.length === 0 ? (
              <div className="flex justify-center items-center h-full text-forest-muted">
                <p>{t("messages.say_hi", "Say hi to")} {activeContact.name}!</p>
              </div>
            ) : (
              chats.map((msg, idx) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <Avatar className="w-8 h-8 mr-3 mt-auto shadow-sm">
                        {activeContact.avatar_url ? (
                          <img src={activeContact.avatar_url} alt={activeContact.name} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-[#21261B] text-[#DFD5C2] text-xs">{activeContact.name.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`p-4 rounded-2xl shadow-sm ${isMe
                            ? 'bg-gradient-to-br from-[#829661] to-[#6A7D4C] text-[#F3F4F0] rounded-br-sm'
                            : 'bg-[#21261B] text-forest-beige rounded-bl-sm border border-[#2C3322]'
                          }`}
                      >
                        {msg.image_url ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-black/20 rounded-xl">
                              <FileText className="w-8 h-8 opacity-80" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{msg.content}</p>
                              </div>
                              <a href={msg.image_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-black/20 rounded-full transition-colors">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <p className="leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                      <span className={`text-[10px] text-forest-muted mt-1.5 font-medium px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-[#181A15] border-t border-forest-border">
            <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                </Button>
              </div>

              <div className="flex-1 relative">
                <Input
                  placeholder={t("messages.write_message", "Write a message...")}
                  className="w-full h-12 bg-[#21261B] border-transparent focus-visible:ring-forest-accent rounded-full pl-6 pr-12 text-forest-beige placeholder:text-forest-muted/70 shadow-inner"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={!newMessage.trim() || isUploading}
                className="h-12 w-12 rounded-full bg-[#829661] hover:bg-[#91A670] text-[#131511] shadow-lg shadow-[#829661]/20 flex-shrink-0 flex items-center justify-center p-0 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5 ml-1" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#181A15] text-forest-muted">
          <div className="w-20 h-20 bg-[#21261B] rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Send className="w-8 h-8 text-[#7A8072]" />
          </div>
          <h2 className="text-xl font-bold text-forest-beige mb-2">{t("messages.no_contact_selected", "No Contact Selected")}</h2>
          <p>{t("messages.choose_contact", "Choose a contact from the list to start messaging.")}</p>
        </div>
      )}
    </div>
  );
}

// 2. Buat default export baru yang membungkus komponen di atas dengan <Suspense>
export default function VolunteerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <VolunteerMessagesContent />
    </Suspense>
  );
}