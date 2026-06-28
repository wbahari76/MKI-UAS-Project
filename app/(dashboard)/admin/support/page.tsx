"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Headset, Search, Filter, Clock, ChevronRight, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-0">Open</Badge>;
      case "Pending":
        return <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0">Pending</Badge>;
      case "Resolved":
        return <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0">Resolved</Badge>;
      case "Closed":
        return <Badge className="bg-[#2C3322] text-forest-muted border-0">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight flex items-center gap-2">
            <Headset className="w-8 h-8 text-forest-accent" />
            Support Helpdesk
          </h1>
          <p className="text-forest-muted mt-1">Manage and resolve user support tickets.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Open", "Pending", "Resolved", "Closed"].map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={`border-forest-border ${statusFilter === status ? 'bg-forest-card text-forest-accent' : 'bg-transparent text-forest-muted'}`}
          >
            {status}
          </Button>
        ))}
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder="Search by ticket ID, subject, or user name..." 
                className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto border-forest-border bg-[#181A15] text-forest-muted">
              <Filter className="w-4 h-4 mr-2" /> Advanced Filter
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-accent"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-20 bg-[#181A15] rounded-xl border border-dashed border-forest-border">
              <Inbox className="w-12 h-12 text-[#2A2F22] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-forest-beige mb-1">No tickets found</h3>
              <p className="text-forest-muted">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-forest-muted uppercase bg-[#181A15] border-b border-forest-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Ticket ID</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Requester</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Last Updated</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-forest-border hover:bg-[#181A15]/50 transition-colors group cursor-pointer" onClick={() => window.location.href = `/admin/support/${ticket.id}`}>
                      <td className="px-6 py-4 font-mono text-xs text-[#7A8072]">
                        #{ticket.id.split('-')[0]}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-forest-beige group-hover:text-forest-accent transition-colors">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-forest-muted mt-1">{ticket.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-forest-beige">
                          {ticket.name}
                        </div>
                        <div className="text-xs text-forest-muted mt-1">{ticket.role}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 text-forest-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="text-forest-muted group-hover:text-forest-accent rounded-full">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
