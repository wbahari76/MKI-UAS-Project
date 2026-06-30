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
import { supabase } from "@/lib/supabase/client";
import { useTranslation } from "react-i18next";

export default function VolunteerDashboard() {
  const { t } = useTranslation("common");
  const { user, profile, loading: authLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        // Fetch volunteer's project applications
        const { data: apps, error: appsError } = await supabase
          .from('project_applications')
          .select(`
            *,
            projects (
              *,
              organizations (name)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;
        setApplications(apps || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    }

    if (user && !authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  if (!isMounted || authLoading || dataLoading) {
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

  // Calculate real stats based on applications
  const activeApps = applications.filter(a => a.status === 'approved' || a.status === 'in_progress');
  const completedApps = applications.filter(a => a.status === 'completed' || a.status === 'certified');

  // Note: Total hours and Impact Points can be calculated if we add them to the schema later.
  // For now, we will use mock logic for points based on completed projects.
  const totalHours = completedApps.length * 10;
  const impactPoints = completedApps.length * 150 + activeApps.length * 50;

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
            {t("dashboard.welcome_back", { name: firstName, defaultValue: `Welcome back, ${firstName}! 👋` })}
          </h1>
          <p className="text-forest-muted">
            {t("dashboard.subtitle", { defaultValue: "Here's what's happening with your projects today." })}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/volunteer/explore">
            <Button className="btn-primary">
              {t("vol_dash.explore_projects", "Explore Projects")}
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
          title={t("vol_dash.total_hours")}
          value={totalHours.toString()}
          icon={Clock}
          iconClassName="bg-blue-500/10 text-blue-400"
        />
        <StatsCard
          title={t("vol_dash.active_projects")}
          value={activeApps.length.toString()}
          icon={FolderKanban}
          iconClassName="bg-[#2C3322] text-[#829661]"
        />
        <StatsCard
          title={t("vol_dash.certificates")}
          value={completedApps.filter(a => a.status === 'certified').length.toString()}
          icon={Award}
          iconClassName="bg-amber-500/10 text-amber-400"
        />
        <StatsCard
          title={t("vol_dash.impact_points")}
          value={impactPoints.toString()}
          icon={Star}
          iconClassName="bg-purple-500/10 text-purple-400"
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
              <CardTitle className="text-xl">{t("vol_dash.your_projects")}</CardTitle>
              <Link href="/volunteer/events">
                <Button variant="ghost" size="sm" className="text-[#829661] font-medium hover:text-[#829661] hover:bg-[#21261B]">
                  {t("vol_dash.view_all")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 4).map((app, i) => (
                    <Link href={`/volunteer/explore`} key={i}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-forest-border hover:border-[#4A5D23] hover:shadow-md transition-all group bg-forest-card mb-4">
                        <div className="flex items-start gap-4 mb-4 sm:mb-0">
                          <div className="w-12 h-12 rounded-lg bg-[#21261B] flex items-center justify-center text-[#829661] shrink-0">
                            <FolderKanban className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-forest-beige group-hover:text-[#829661] transition-colors">
                              {app.projects?.title || t("vol_dash.unknown_project")}
                            </h4>
                            <p className="text-sm text-forest-muted">{app.projects?.organizations?.name || t("vol_dash.unknown_org")}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                          <div className="w-full sm:w-24">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-forest-muted">{t("vol_dash.status")}</span>
                              <span className="font-medium capitalize">{app.status}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#1E211A] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#829661] rounded-full"
                                style={{ width: app.status === 'approved' ? '50%' : app.status === 'completed' ? '100%' : '10%' }}
                              />
                            </div>
                          </div>
                          <Badge variant="outline" className="shrink-0 bg-[#21261B] text-[#829661] border-none capitalize">
                            {app.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FolderKanban}
                  title={t("vol_dash.no_active_projects")}
                  description={t("vol_dash.no_active_projects_desc")}
                  primaryAction={{
                    label: t("vol_dash.explore_projects"),
                    onClick: () => window.location.href = '/volunteer/explore'
                  }}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Upcoming Event (Mock for now until events are built) */}
          <Card className="bg-[#2C3322] border-[#4A5D23] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <CalendarDays className="w-24 h-24 text-[#829661]" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-amber-400">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span className="font-medium">{t("vol_dash.next_event")}</span>
                </div>
                <Badge variant="outline" className="bg-amber-400/20 text-amber-200 border-none text-xs">
                  {t("vol_dash.tomorrow")}
                </Badge>
              </div>
              <CardTitle className="text-xl text-forest-beige">Coastal Cleanup Briefing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-forest-muted mb-4">Zoom Meeting • 09:00 AM</p>
              <Button className="w-full bg-[#829661] hover:bg-[#6A7B4F] text-[#11140D] font-semibold border-none">
                {t("vol_dash.join_event")}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm shadow-forest-border/20">
            <CardHeader className="border-b border-forest-border pb-4">
              <CardTitle className="text-xl">{t("vol_dash.recent_activity")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map((app, i) => (
                    <div className="flex gap-4 relative" key={i}>
                      <div className="w-2 h-2 rounded-full bg-[#829661] mt-2 shrink-0 relative z-10" />
                      <div className="absolute top-4 left-1 w-0.5 h-12 bg-forest-border -z-0" />
                      <div>
                        <p className="font-medium text-forest-beige">
                          {app.status === 'pending' ? t("vol_dash.applied_for") : t("vol_dash.status_updated")}
                        </p>
                        <p className="text-sm text-forest-muted">{app.projects?.title}</p>
                        <p className="text-xs text-forest-muted mt-1">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4 relative">
                    <div className="w-2 h-2 rounded-full bg-forest-border mt-2 shrink-0 relative z-10" />
                    <div>
                      <p className="font-medium text-forest-beige">{t("vol_dash.welcome_jala")}</p>
                      <p className="text-sm text-forest-muted">{t("vol_dash.journey_starts")}</p>
                      <p className="text-xs text-forest-muted mt-1">{t("vol_dash.today")}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
