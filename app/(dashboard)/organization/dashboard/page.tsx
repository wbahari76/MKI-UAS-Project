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

export default function OrganizationDashboard() {
  const { user, profile, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Verified</Badge>
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
          value="128"
          icon={Users}
          iconClassName="bg-blue-100 text-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Projects"
          value="3"
          icon={FolderKanban}
          iconClassName="bg-[#2C3322] text-[#829661]"
        />
        <StatsCard
          title="Total Hours Logged"
          value="1,450"
          icon={Clock}
          iconClassName="bg-amber-100 text-amber-600"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Profile Views"
          value="452"
          icon={TrendingUp}
          iconClassName="bg-purple-100 text-purple-600"
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
          <Card className="h-full border-0 shadow-sm shadow-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-forest-border pb-4">
              <CardTitle className="text-xl">Recent Projects</CardTitle>
              <Link href="/organization/projects">
                <Button variant="ghost" size="sm" className="text-blue-600 font-medium hover:text-blue-700 hover:bg-blue-50">
                  Manage All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Mock Data for Org Projects */}
              <div className="space-y-4">
                {[
                  { title: "Coastal Cleanup Initiative", status: "Recruiting", volunteers: 32, max: 50, date: "Jul 15, 2026" },
                  { title: "Tree Planting Day", status: "In Progress", volunteers: 20, max: 20, date: "Jun 30, 2026" },
                  { title: "Food Bank Distribution", status: "Draft", volunteers: 0, max: 15, date: "Aug 10, 2026" }
                ].map((project, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-forest-border hover:border-blue-200 hover:shadow-md transition-all group bg-forest-card">
                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 rounded-lg bg-[#181A15] flex items-center justify-center text-[#7A8072] shrink-0 border border-forest-border">
                        <FolderKanban className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-forest-beige group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-forest-muted flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {project.volunteers} / {project.max} Vol.
                          </span>
                          <span className="text-xs text-forest-muted flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {project.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <Badge 
                        variant="outline" 
                        className={
                          project.status === 'Recruiting' ? 'bg-[#21261B] text-[#829661] border-[#4A5D23]' : 
                          project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-[#181A15] text-[#DFD5C2] border-forest-border'
                        }
                      >
                        {project.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7A8072] hover:text-forest-muted">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Opening project details...")}>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Editing project...")}>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("Managing volunteers...")}>Manage Volunteers</DropdownMenuItem>
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
          <Card className="border-0 shadow-sm shadow-slate-200">
            <CardHeader className="border-b border-forest-border pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">New Applications</CardTitle>
              {pendingApps.length > 0 ? (
                <Badge className="bg-amber-500 hover:bg-amber-600">{pendingApps.length} Pending</Badge>
              ) : (
                <Badge className="bg-slate-200 text-forest-muted hover:bg-slate-300">0 Pending</Badge>
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
                  <Button variant="ghost" className="w-full text-sm text-blue-600">View All Applications</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-0 shadow-sm shadow-slate-200">
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
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white bg-blue-500" />
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
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
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
                  <span className="font-medium text-slate-950">Project:</span> {selectedApp.project}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Mail className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-slate-950">Email:</span> {selectedApp.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Phone className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-slate-950">Phone:</span> {selectedApp.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-forest-muted">
                  <Clock className="w-4 h-4 text-[#7A8072]" />
                  <span className="font-medium text-slate-950">Applied:</span> {selectedApp.time} ({selectedApp.date})
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              Reject
            </Button>
            <Button
              onClick={() => handleApprove(selectedApp?.id)}
              className="bg-[#4A5D23] hover:bg-emerald-700 text-white"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
