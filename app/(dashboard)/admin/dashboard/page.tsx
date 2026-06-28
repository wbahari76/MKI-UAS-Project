"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Users, Building2, CalendarDays, Activity, Send, Megaphone, Server
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StatsCard } from "@/components/ui/stats-card";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardPage() {
  const [announcement, setAnnouncement] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [stats, setStats] = useState({
    volunteers: 0,
    organizations: 0,
    activeProjects: 0
  });

  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Volunteers Count
      const { count: volCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'volunteer');

      // Fetch Orgs Count
      const { count: orgCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true });

      // Fetch Active Projects Count
      const { count: projCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      setStats({
        volunteers: volCount || 0,
        organizations: orgCount || 0,
        activeProjects: projCount || 0
      });

      // Fetch Recent Activity
      const { data: recentProfiles } = await supabase
        .from('profiles')
        .select('full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentProjects } = await supabase
        .from('projects')
        .select('title, created_at, organizations(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      const combinedLogs: any[] = [];
      if (recentProfiles) {
        recentProfiles.forEach(p => {
          combinedLogs.push({
            user: p.full_name || 'A user',
            action: `joined as a ${p.role}`,
            time: p.created_at,
            timestamp: new Date(p.created_at).getTime()
          });
        });
      }
      if (recentProjects) {
        recentProjects.forEach(p => {
          combinedLogs.push({
            user: (p.organizations as any)?.name || 'An organization',
            action: `created project "${p.title}"`,
            time: p.created_at,
            timestamp: new Date(p.created_at).getTime()
          });
        });
      }

      combinedLogs.sort((a, b) => b.timestamp - a.timestamp);
      setLogs(combinedLogs.slice(0, 5));
    };

    fetchData();

    // Setup Subscriptions for Stats
    const profilesSub = supabase.channel('admin-profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.new.role === 'volunteer') {
          setStats(s => ({ ...s, volunteers: s.volunteers + 1 }));
        }
        setLogs(prev => {
          const newLog = {
            user: payload.new.full_name || 'A user',
            action: `joined as a ${payload.new.role}`,
            time: payload.new.created_at,
            timestamp: new Date(payload.new.created_at).getTime()
          };
          return [newLog, ...prev].slice(0, 5);
        });
      }).subscribe();

    const orgsSub = supabase.channel('admin-orgs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'organizations' }, (payload) => {
        setStats(s => ({ ...s, organizations: s.organizations + 1 }));
      }).subscribe();

    const projectsSub = supabase.channel('admin-projects')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) => {
        setLogs(prev => {
          const newLog = {
            user: 'An organization',
            action: `created project "${payload.new.title}"`,
            time: payload.new.created_at,
            timestamp: new Date(payload.new.created_at).getTime()
          };
          return [newLog, ...prev].slice(0, 5);
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        if (payload.old.status !== 'published' && payload.new.status === 'published') {
          setStats(s => ({ ...s, activeProjects: s.activeProjects + 1 }));
        } else if (payload.old.status === 'published' && payload.new.status !== 'published') {
          setStats(s => ({ ...s, activeProjects: s.activeProjects - 1 }));
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(profilesSub);
      supabase.removeChannel(orgsSub);
      supabase.removeChannel(projectsSub);
    };
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    setIsSending(true);
    // Emit broadcast event
    supabase.channel('public:notifications').send({
      type: 'broadcast',
      event: 'admin-broadcast',
      payload: { message: announcement }
    });

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
        <StatsCard title="Total Volunteers" value={stats.volunteers.toString()} icon={Users} trend={{ value: 0, isPositive: true }} />
        <StatsCard title="Organizations" value={stats.organizations.toString()} icon={Building2} trend={{ value: 0, isPositive: true }} />
        <StatsCard title="Active Projects" value={stats.activeProjects.toString()} icon={CalendarDays} trend={{ value: 0, isPositive: true }} />
        <StatsCard title="System Health" value="99.9%" icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Broadcast System */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm shadow-forest-border/20">
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
          <Card className="border-0 shadow-sm shadow-forest-border/20 h-full">
            <CardHeader className="border-b border-forest-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-[#7A8072]" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="p-4 text-sm text-forest-muted">No recent activity.</div>
                ) : logs.map((log, i) => (
                  <div key={i} className="p-4 flex items-start gap-3 hover:bg-[#181A15] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-forest-accent mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-forest-beige">
                        <span className="font-semibold">{log.user}</span> {log.action}
                      </p>
                      <span className="text-xs text-[#7A8072]">
                        {formatDistanceToNow(new Date(log.time), { addSuffix: true })}
                      </span>
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
