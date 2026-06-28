"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowLeft, Paperclip, Send, Loader2, ShieldAlert, AlertTriangle, Save 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminTicketDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [ticket, setTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [ticketStatus, setTicketStatus] = useState("");

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
      setTicketStatus(ticketData.status);

      const { data: repliesData, error: repliesError } = await supabase
        .from('ticket_replies')
        .select('*, users:user_id(email)')
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
    
    const channel = supabase
      .channel(`admin_ticket_replies_${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ticket_replies',
        filter: `ticket_id=eq.${id}` 
      }, payload => {
        setReplies(current => [...current, payload.new]);
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
          is_admin: true
        });

      if (error) throw error;
      setReplyMessage("");
      toast.success("Admin reply sent!");
      
      // Auto update status to Pending if it's Open
      if (ticket.status === 'Open') {
          await handleStatusUpdate('Pending');
      }

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setTicket((prev: any) => ({ ...prev, status: newStatus }));
      setTicketStatus(newStatus);
      if (newStatus !== ticket.status) {
        toast.success(`Ticket status updated to ${newStatus}.`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update status.");
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
        <Button className="mt-4 btn-primary" onClick={() => router.push('/admin/support')}>Back to Helpdesk</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/support">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-forest-card text-forest-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-forest-beige tracking-tight truncate max-w-lg">
                {ticket.subject}
              </h1>
            </div>
            <p className="text-forest-muted mt-1 text-sm flex items-center gap-2">
              <span className="font-mono text-xs uppercase bg-[#181A15] px-2 py-1 rounded">#{ticket.id.split('-')[0]}</span>
              • {ticket.category}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Select value={ticketStatus} onValueChange={handleStatusUpdate}>
              <SelectTrigger className="w-[140px] bg-[#181A15] border-forest-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Description */}
          <Card className="bg-forest-card border-forest-border">
            <CardHeader className="pb-3 border-b border-forest-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-forest-border">
                    <AvatarFallback className="bg-[#2A2F22] text-[#829661]">{ticket.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-forest-beige">{ticket.name}</p>
                    <p className="text-xs text-forest-muted">{ticket.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-forest-muted border-forest-border mb-1">{ticket.role}</Badge>
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
                    View Attachment (User Upload)
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Replies */}
          {replies.map((reply) => (
            <Card key={reply.id} className={`border-forest-border ${reply.is_admin ? 'bg-[#181A15]' : 'bg-forest-card'}`}>
              <CardHeader className="pb-3 border-b border-forest-border/50">
                <div className="flex items-center gap-3">
                  {reply.is_admin ? (
                    <div className="w-10 h-10 rounded-full bg-forest-accent/10 flex items-center justify-center border border-forest-accent/20">
                      <ShieldAlert className="w-5 h-5 text-forest-accent" />
                    </div>
                  ) : (
                    <Avatar className="w-10 h-10 border border-forest-border">
                      <AvatarFallback className="bg-[#2A2F22] text-[#829661]">{ticket.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-sm font-medium text-forest-beige flex items-center gap-2">
                      {reply.is_admin ? 'Admin Response' : ticket.name}
                      {reply.is_admin && <Badge variant="secondary" className="bg-forest-accent/10 text-forest-accent hover:bg-forest-accent/20 border-0 text-[10px] uppercase h-5">Support Team</Badge>}
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

          {/* Admin Reply Form */}
          <div className="pt-4">
            <h3 className="text-sm font-medium text-forest-beige mb-3">Admin Reply</h3>
            <div className="bg-[#181A15] border border-forest-border rounded-xl p-2 focus-within:border-forest-accent focus-within:ring-1 focus-within:ring-forest-accent transition-all">
              <Textarea 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response to the user here..." 
                className="bg-transparent border-0 focus-visible:ring-0 min-h-[120px] resize-none text-forest-beige"
              />
              <div className="flex items-center justify-between p-2 border-t border-forest-border mt-2">
                <p className="text-xs text-forest-muted flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                  Replies are visible to the user immediately.
                </p>
                <Button onClick={handleReply} disabled={sending || !replyMessage.trim()} className="bg-forest-accent hover:bg-forest-accent/90 text-forest-card font-medium">
                  {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send Response
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="bg-forest-card border-forest-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-forest-muted uppercase tracking-wider">User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Name</p>
                <p className="text-sm text-forest-beige font-medium">{ticket.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Email</p>
                <a href={`mailto:${ticket.email}`} className="text-sm text-blue-400 hover:underline">{ticket.email}</a>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Role</p>
                <Badge variant="outline" className="border-forest-border text-forest-beige">{ticket.role}</Badge>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Account ID</p>
                <p className="text-xs text-forest-muted font-mono break-all">{ticket.user_id}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-forest-card border-forest-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-forest-muted uppercase tracking-wider">Ticket Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Created At</p>
                <p className="text-sm text-forest-beige">{format(new Date(ticket.created_at), "MMM d, yyyy h:mm a")}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Last Activity</p>
                <p className="text-sm text-forest-beige">{formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}</p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] mb-1">Total Replies</p>
                <p className="text-sm text-forest-beige font-medium">{replies.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
