"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/contexts/SocketContext";
import { 
  Users, Building2, CalendarDays, Activity, Send, Megaphone, Server 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StatsCard } from "@/components/ui/stats-card";

export default function AdminDashboardPage() {
  const { socket } = useSocket();
  const [announcement, setAnnouncement] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    setIsSending(true);
    // Emit broadcast event
    socket?.emit("admin-broadcast", announcement);
    
    setTimeout(() => {
      setIsSending(false);
      setAnnouncement("");
      toast.success("Announcement broadcasted successfully to all online users!");
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Platform Overview</h1>
        <p className="text-forest-muted mt-1">Monitor platform activity and manage system-wide settings.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Volunteers" value="1,248" icon={Users} trend={{ value: 12, isPositive: true }} />
        <StatsCard title="Organizations" value="84" icon={Building2} trend={{ value: 3, isPositive: true }} />
        <StatsCard title="Active Projects" value="45" icon={CalendarDays} trend={{ value: 8, isPositive: true }} />
        <StatsCard title="System Health" value="99.9%" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Broadcast System */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm shadow-slate-200">
            <CardHeader className="border-b border-forest-border bg-forest text-forest-beige rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                Broadcast Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleBroadcast} className="space-y-4">
                <p className="text-sm text-forest-muted">
                  Send a realtime notification to all currently connected users across the platform.
                </p>
                <Textarea 
                  placeholder="Type your announcement here..."
                  className="min-h-[120px] bg-[#181A15] border-0 focus-visible:ring-forest-border"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-forest text-forest-beige hover:bg-forest-card px-6"
                    disabled={!announcement.trim() || isSending}
                  >
                    {isSending ? "Broadcasting..." : (
                      <>
                        Broadcast Now
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* System Logs */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm shadow-slate-200 h-full">
            <CardHeader className="border-b border-forest-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-[#7A8072]" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                {[
                  { user: "Ocean Care ID", action: "created a new project", time: "2m ago" },
                  { user: "Budi Santoso", action: "joined Coastal Cleanup", time: "15m ago" },
                  { user: "Tech for All", action: "updated their profile", time: "1h ago" },
                  { user: "System", action: "daily backup completed", time: "3h ago" },
                ].map((log, i) => (
                  <div key={i} className="p-4 flex items-start gap-3 hover:bg-[#181A15] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-forest-accent mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-forest-beige">
                        <span className="font-semibold">{log.user}</span> {log.action}
                      </p>
                      <span className="text-xs text-[#7A8072]">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
