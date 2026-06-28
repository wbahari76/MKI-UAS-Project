"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowLeft, MessageSquare, Clock, Paperclip, Send, 
  CheckCircle, Loader2, User as UserIcon, ShieldAlert 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [ticket, setTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTicketDetails = async () => {
    if (!user || !id) return;
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (ticketError) throw ticketError;
      setTicket(ticketData);

      const { data: repliesData, error: repliesError } = await supabase
        .from('ticket_replies')
        .select('*, users:user_id(email)') // Simplified join
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (repliesError) throw repliesError;
      setReplies(repliesData || []);

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    
    // Subscribe to realtime updates for this ticket's replies
    const channel = supabase
      .channel(`ticket_replies_${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ticket_replies',
        filter: `ticket_id=eq.${id}` 
      }, payload => {
        setReplies(current => [...current, payload.new]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'support_tickets',
        filter: `id=eq.${id}`
      }, payload => {
        setTicket(current => ({ ...current, ...payload.new }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, id]);

  const handleReply = async () => {
    if (!replyMessage.trim() || !user) return;
    try {
      setSending(true);
      const { error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: id,
          user_id: user.id,
          message: replyMessage,
          is_admin: false
        });

      if (error) throw error;
      setReplyMessage("");
      toast.success("Reply sent!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'Closed', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success("Ticket closed.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to close ticket.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-accent" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-forest-beige">Ticket Not Found</h2>
        <Button className="mt-4 btn-primary" onClick={() => router.push('/help/tickets')}>Back to My Tickets</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/help/tickets">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-forest-card text-forest-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-forest-beige tracking-tight truncate max-w-lg">
              {ticket.subject}
            </h1>
            <Badge className={
              ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0' :
              ticket.status === 'Pending' ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0' :
              ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0' :
              'bg-[#2C3322] text-forest-muted border-0'
            }>
              {ticket.status}
            </Badge>
          </div>
          <p className="text-forest-muted mt-1 text-sm flex items-center gap-2">
            <span className="font-mono text-xs uppercase bg-[#181A15] px-2 py-1 rounded">#{ticket.id.split('-')[0]}</span>
            • {ticket.category} • Created {format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")}
          </p>
        </div>
        {ticket.status !== 'Closed' && (
          <Button variant="outline" className="border-forest-border hover:bg-forest-card text-forest-muted" onClick={handleCloseTicket}>
            <CheckCircle className="w-4 h-4 mr-2" /> Mark as Closed
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Main Description */}
          <Card className="bg-forest-card border-forest-border">
            <CardHeader className="pb-3 border-b border-forest-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-forest-border">
                  <AvatarFallback className="bg-[#2A2F22] text-[#829661]">{ticket.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-forest-beige">{ticket.name}</p>
                  <p className="text-xs text-forest-muted">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-[#DFD5C2] whitespace-pre-wrap leading-relaxed">
              {ticket.description}
              
              {ticket.attachment_url && (
                <div className="mt-6 pt-4 border-t border-forest-border/50">
                  <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181A15] border border-forest-border hover:border-forest-accent/50 text-sm text-forest-beige transition-colors">
                    <Paperclip className="w-4 h-4 text-forest-muted" />
                    View Attachment
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Replies */}
          {replies.map((reply) => (
            <Card key={reply.id} className={`border-forest-border ${reply.is_admin ? 'bg-forest-accent/5 border-forest-accent/20' : 'bg-forest-card'}`}>
              <CardHeader className="pb-3 border-b border-forest-border/50">
                <div className="flex items-center gap-3">
                  {reply.is_admin ? (
                    <div className="w-10 h-10 rounded-full bg-forest-accent/20 flex items-center justify-center border border-forest-accent/30">
                      <ShieldAlert className="w-5 h-5 text-forest-accent" />
                    </div>
                  ) : (
                    <Avatar className="w-10 h-10 border border-forest-border">
                      <AvatarFallback className="bg-[#2A2F22] text-[#829661]">{ticket.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-sm font-medium text-forest-beige flex items-center gap-2">
                      {reply.is_admin ? 'JALA VIVE Support' : ticket.name}
                      {reply.is_admin && <Badge variant="secondary" className="bg-forest-accent/10 text-forest-accent hover:bg-forest-accent/20 border-0 text-[10px] uppercase h-5">Admin</Badge>}
                    </p>
                    <p className="text-xs text-forest-muted">{formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-[#DFD5C2] whitespace-pre-wrap leading-relaxed">
                {reply.message}
              </CardContent>
            </Card>
          ))}

          {/* Reply Form */}
          {ticket.status !== 'Closed' ? (
            <div className="pt-4">
              <div className="bg-[#181A15] border border-forest-border rounded-xl p-2 focus-within:border-forest-accent focus-within:ring-1 focus-within:ring-forest-accent transition-all">
                <Textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..." 
                  className="bg-transparent border-0 focus-visible:ring-0 min-h-[100px] resize-none text-forest-beige"
                />
                <div className="flex justify-end p-2 border-t border-forest-border mt-2">
                  <Button onClick={handleReply} disabled={sending || !replyMessage.trim()} className="btn-primary">
                    {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-[#181A15] rounded-xl border border-dashed border-forest-border">
              <p className="text-forest-muted">This ticket has been closed. If you need further assistance, please open a new ticket.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="bg-forest-card border-forest-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-forest-muted uppercase tracking-wider">Ticket Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Status</p>
                <p className="text-sm text-forest-beige font-medium">{ticket.status}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Category</p>
                <p className="text-sm text-forest-beige">{ticket.category}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Requester</p>
                <p className="text-sm text-forest-beige">{ticket.name}</p>
                <p className="text-xs text-forest-muted">{ticket.email}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Last Updated</p>
                <p className="text-sm text-forest-beige">{format(new Date(ticket.updated_at), "MMM d, yyyy h:mm a")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
