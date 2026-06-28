"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/ui/stats-card";
import { Users, FolderKanban, Plus, Clock, TrendingUp, MoreVertical, Activity, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";

export default function OrganizationDashboard() {
  const { user, profile, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalVolunteers: 0,
    totalHours: 1450, // Still mock for now
    profileViews: 452, // Still mock for now
  });
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [pendingApps, setPendingApps] = useState([
    {
      id: 1,
      name: "Andi Saputra",
      project: "Coastal Cleanup Initiative",
      role: "Field Volunteer",
      time: "10 min ago",
      date: "Jul 10, 2026",
      email: "andi.saputra@email.com",
      phone: "+62 812-3456-7890",
      coverLetter: "Saya sangat tertarik untuk berkontribusi dalam kegiatan membersihkan pantai ini. Saya memiliki pengalaman dalam kegiatan sosial serupa dan siap bekerja sama dengan tim."
    },
    {
      id: 2,
      name: "Budi Santoso",
      project: "Coastal Cleanup Initiative",
      role: "Logistics",
      time: "1 hour ago",
      date: "Jul 10, 2026",
      email: "budi.santoso@email.com",
      phone: "+62 812-9876-5432",
      coverLetter: "Saya ingin membantu mengelola logistik acara agar kegiatan ini berjalan dengan lancar. Saya terbiasa mengorganisir perlengkapan untuk event skala menengah."
    },
    {
      id: 3,
      name: "Citra Kirana",
      project: "Food Bank Distribution",
      role: "Coordinator",
      time: "2 hours ago",
      date: "Jul 09, 2026",
      email: "citra.kirana@email.com",
      phone: "+62 813-1111-2222",
      coverLetter: "Sebagai mahasiswa gizi, saya sangat mendukung program food bank ini. Saya berharap bisa membantu koordinasi distribusi makanan secara higienis dan teratur."
    },
  ]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setProjectsLoading(true);
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (orgError) {
          console.error("No org profile found yet");
          setProjectsLoading(false);
          return;
        }

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('organization_id', org.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (projectsError) throw projectsError;

        setProjects(projectsData || []);

        // Calculate basic stats from the projects
        const activeCount = projectsData?.filter(p => p.status !== 'draft' && p.status !== 'completed').length || 0;
        const volCount = projectsData?.reduce((acc, p) => acc + (p.volunteer_count || 0), 0) || 0;

        setStats(prev => ({
          ...prev,
          activeProjects: activeCount,
          totalVolunteers: volCount
        }));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setProjectsLoading(false);
      }
    }

    if (user && !loading) {
      fetchDashboardData();
    }
  }, [user, loading]);

  const handleReviewClick = (app: any) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  const handleApprove = (appId: number) => {
    setPendingApps((prev) => prev.filter((app) => app.id !== appId));
    setIsDialogOpen(false);
    toast.success(`Application for ${selectedApp?.name} approved successfully!`);
  };

  const handleReject = (appId: number) => {
    setPendingApps((prev) => prev.filter((app) => app.id !== appId));
    setIsDialogOpen(false);
    toast.error(`Application for ${selectedApp?.name} rejected.`);
  };

  if (!isMounted || loading || projectsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full lg:col-span-2" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const orgName = profile?.full_name || user?.email?.split("@")[0] || "Organization";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
      case "recruiting":
      case "active":
        return <Badge className="bg-[#2C3322] text-[#829661] border-[#4A5D23]">Active</Badge>;
      case "draft":
        return <Badge className="bg-[#1E211A] text-[#DFD5C2] border-forest-border">Draft</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Completed</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
              {orgName} Dashboard
            </h1>
            <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0">Verified</Badge>
          </div>
          <p className="text-forest-muted">
            Manage your projects and volunteers efficiently.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/organization/projects/new">
            <Button className="btn-primary">
              <Plus className="mr-2 w-4 h-4" />
              Create Project
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Volunteers"
          value={stats.totalVolunteers.toString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-400"
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          icon={FolderKanban}
          iconClassName="bg-[#2C3322] text-[#829661]"
        />
        <StatsCard
          title="Total Hours Logged"
          value={stats.totalHours.toString()}
          icon={Clock}
          iconClassName="bg-amber-500/10 text-amber-400"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Profile Views"
          value={stats.profileViews.toString()}
          icon={TrendingUp}
          iconClassName="bg-purple-500/10 text-purple-400"
          trend={{ value: 24, isPositive: true }}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="h-full border-0 shadow-sm shadow-forest-border/20">
            <CardHeader className="flex flex-row items-center justify-between border-b border-forest-border pb-4">
              <CardTitle className="text-xl">Recent Projects</CardTitle>
              <Link href="/organization/projects">
                <Button variant="ghost" size="sm" className="text-blue-400 font-medium hover:text-blue-400 hover:bg-blue-500/10">
                  Manage All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-forest-muted">
                    <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No projects found. Create one to get started!</p>
                  </div>
                ) : projects.map((project, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-forest-border hover:border-blue-500/20 hover:shadow-md transition-all group bg-forest-card">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-[#181A15] flex items-center justify-center text-[#7A8072] shrink-0 border border-forest-border">
                        <FolderKanban className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-forest-beige group-hover:text-blue-400 transition-colors flex items-center gap-2">
                          {project.title}
                          {project.is_paid && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-1.5 py-0">Paid</Badge>
                          )}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-forest-muted flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {project.volunteer_count || 0} / {project.volunteer_needed || 0} Vol.
                          </span>
                          <span className="text-xs text-forest-muted flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(project.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      {getStatusBadge(project.status || "draft")}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7A8072] hover:text-forest-muted">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Edit Project</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Manage Volunteers</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Recent Applications & Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* New Applications */}
          <Card className="border-0 shadow-sm shadow-forest-border/20">
            <CardHeader className="border-b border-forest-border pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">New Applications</CardTitle>
              {pendingApps.length > 0 ? (
                <Badge className="bg-amber-500 hover:bg-amber-600">{pendingApps.length} Pending</Badge>
              ) : (
                <Badge className="bg-[#2A2F22] text-forest-muted hover:bg-[#38402D]">0 Pending</Badge>
              )}
            </CardHeader>
            <CardContent className="pt-4 px-0">
              <div className="divide-y divide-slate-100">
                {pendingApps.map((app) => (
                  <div key={app.id} className="p-4 hover:bg-[#181A15] transition-colors flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-forest-beige text-sm">{app.name}</h5>
                      <p className="text-forest-muted text-xs mt-0.5">Applied to {app.project}</p>
                      <p className="text-[#7A8072] text-xs mt-1">{app.time}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-8 px-3" onClick={() => handleReviewClick(app)}>Review</Button>
                  </div>
                ))}
                {pendingApps.length === 0 && (
                  <div className="p-6 text-center text-sm text-forest-muted">
                    No pending applications.
                  </div>
                )}
              </div>
              <div className="px-4 pt-2">
                <Link href="/organization/applications">
                  <Button variant="ghost" className="w-full text-sm text-blue-400">View All Applications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-sm shadow-forest-border/20">
            <CardHeader className="border-b border-forest-border pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#7A8072]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-forest-border ml-3 space-y-6">
                {[
                  { title: "Project Published", time: "Yesterday", desc: "'Tree Planting Day' is now live." },
                  { title: "Milestone Reached", time: "2 days ago", desc: "100 total volunteers joined!" }
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-forest-border bg-blue-500" />
                    <h5 className="font-semibold text-forest-beige text-sm">{item.title}</h5>
                    <p className="text-forest-muted text-xs mb-1">{item.time}</p>
                    <p className="text-forest-muted text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-forest-beige">Review Application</DialogTitle>
            <DialogDescription className="text-forest-muted">
              Review volunteer details and application statement.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 py-4">
              {/* Profile Overview */}
              <div className="flex items-center gap-4 p-4 bg-[#181A15] rounded-xl border border-forest-border">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-forest-beige">{selectedApp.name}</h4>
                  <p className="text-sm text-forest-muted">{selectedApp.role} Role</p>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <FolderKanban className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-forest-beige">Project:</span> {selectedApp.project}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Mail className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-forest-beige">Email:</span> {selectedApp.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Phone className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-forest-beige">Phone:</span> {selectedApp.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Clock className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-forest-beige">Applied:</span> {selectedApp.time} ({selectedApp.date})
                </div>
              </div>

              {/* Cover Letter / Motivation */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-forest-beige">Motivation Letter</h5>
                <p className="text-sm text-forest-muted bg-[#181A15] p-4 rounded-xl border border-forest-border leading-relaxed italic">
                  "{selectedApp.coverLetter}"
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleReject(selectedApp?.id)}
              className="text-red-600 hover:text-red-400 hover:bg-red-500/10 border-red-500/20"
            >
              Reject
            </Button>
            <Button
              onClick={() => handleApprove(selectedApp?.id)}
              className="bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
