"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/ui/stats-card";
import { Clock, Award, FolderKanban, Star, CalendarDays, Activity, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function VolunteerDashboard() {
  const { user, profile, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

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

  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Volunteer";

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-forest-muted">
            Here's what's happening with your projects today.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/volunteer/explore">
            <Button className="btn-primary">
              Explore Projects
              <ArrowRight className="ml-2 w-4 h-4" />
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
          title="Total Hours"
          value="24"
          icon={Clock}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Active Projects"
          value="2"
          icon={FolderKanban}
          iconClassName="bg-[#2C3322] text-[#829661]"
        />
        <StatsCard
          title="Certificates"
          value="1"
          icon={Award}
          iconClassName="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Impact Points"
          value="1,250"
          icon={Star}
          iconClassName="bg-purple-100 text-purple-600"
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
              <CardTitle className="text-xl">Active Projects</CardTitle>
              <Link href="/volunteer/events">
                <Button variant="ghost" size="sm" className="text-[#829661] font-medium hover:text-[#829661] hover:bg-[#21261B]">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Mock Data for Active Projects */}
              <div className="space-y-4">
                {[
                  { title: "Beach Cleanup & Education", org: "Ocean Care ID", progress: 65, status: "In Progress" },
                  { title: "Digital Literacy for Seniors", org: "Tech For All", progress: 30, status: "Recruiting" }
                ].map((project, i) => (
                  <Link href={`/volunteer/explore`} key={i}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-forest-border hover:border-[#4A5D23] hover:shadow-md transition-all group bg-forest-card">
                      <div className="flex items-start gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-lg bg-[#21261B] flex items-center justify-center text-[#829661] shrink-0">
                          <FolderKanban className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-forest-beige group-hover:text-[#829661] transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-sm text-forest-muted">{project.org}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                        <div className="w-full sm:w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-forest-muted">Progress</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#1E211A] rounded-full overflow-hidden">
                            <div className="h-full bg-forest-accent rounded-full" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                        <Badge variant="outline" className={project.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-[#21261B] text-[#829661] border-[#4A5D23]'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Upcoming Events & Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Upcoming Event */}
          <Card className="border-0 shadow-sm shadow-slate-200 bg-gradient-to-br from-forest-accent to-[#4A5D23] text-forest-beige">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-emerald-100" />
                  Next Event
                </CardTitle>
                <Badge className="bg-forest-card/20 hover:bg-forest-card/30 border-0 text-forest-beige">Tomorrow</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="text-xl font-bold mb-1">Coastal Cleanup Briefing</h4>
              <p className="text-emerald-100 text-sm mb-4">Zoom Meeting • 09:00 AM</p>
              <Link href="/volunteer/events">
                <Button className="w-full bg-forest-card text-[#829661] hover:bg-[#181A15] border-0 mt-2">
                  Join Event
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
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
                  { title: "Application Approved", time: "2 hours ago", desc: "Your application for 'Beach Cleanup' was accepted." },
                  { title: "Earned Badge", time: "Yesterday", desc: "You unlocked the 'Explorer' badge!" },
                  { title: "Joined Platform", time: "3 days ago", desc: "Welcome to JALA VIVE." }
                ].map((item, i) => (
                  <div key={i} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-forest-border bg-forest-accent" />
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
    </div>
  );
}
