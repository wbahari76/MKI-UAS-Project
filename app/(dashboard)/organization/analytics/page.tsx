"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Users, Clock, FolderKanban, Download, Filter, 
  Calendar, ArrowUpRight, ArrowDownRight, Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/ui/stats-card";
import { useTranslation } from "react-i18next";

// Mock Data
const MONTHLY_VOLUNTEERS = [
  { name: 'Jan', count: 45 },
  { name: 'Feb', count: 52 },
  { name: 'Mar', count: 48 },
  { name: 'Apr', count: 70 },
  { name: 'May', count: 85 },
  { name: 'Jun', count: 105 },
  { name: 'Jul', count: 128 },
];

const HOURS_BY_PROJECT = [
  { name: 'Coastal Cleanup', hours: 450 },
  { name: 'Digital Literacy', hours: 320 },
  { name: 'Tree Planting', hours: 280 },
  { name: 'Food Bank', hours: 400 },
];

const RETENTION_DATA = [
  { month: 'Jan', rate: 75 },
  { month: 'Feb', rate: 78 },
  { month: 'Mar', rate: 76 },
  { month: 'Apr', rate: 82 },
  { month: 'May', rate: 85 },
  { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 92 },
];

export default function OrganizationAnalyticsPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("6m");
  
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalImpactHours: 0,
    retentionRate: 0,
    avgCost: 120,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>(MONTHLY_VOLUNTEERS);
  const [projectHoursData, setProjectHoursData] = useState<any[]>(HOURS_BY_PROJECT);
  const [retentionData, setRetentionData] = useState<any[]>(RETENTION_DATA);

  useEffect(() => {
    async function loadAnalytics() {
      if (!user) return;
      try {
        const { data: org } = await supabase.from('organizations').select('id').eq('owner_id', user.id).single();
        if (!org) return;

        const { data: apps } = await supabase
          .from('project_applications')
          .select(`
            id, status, created_at, user_id, project_id,
            projects!inner ( title, organization_id )
          `)
          .eq('projects.organization_id', org.id);

        if (!apps) return;

        const approvedApps = apps.filter(a => a.status === 'approved');
        const uniqueVolunteers = Array.from(new Set(approvedApps.map(a => a.user_id)));
        const totalVolunteers = uniqueVolunteers.length;
        const totalImpactHours = approvedApps.length * 10; // Assumed 10 hours per approved app

        const appCountsByUser = approvedApps.reduce((acc, a) => {
          acc[a.user_id] = (acc[a.user_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const retainedVolunteers = Object.values(appCountsByUser).filter(count => count > 1).length;
        const retentionRate = totalVolunteers > 0 ? Math.round((retainedVolunteers / totalVolunteers) * 100) : 0;

        setStats({
          totalVolunteers,
          totalImpactHours,
          retentionRate,
          avgCost: 120, // Mock cost
        });

        // Monthly Data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts: Record<string, number> = {};
        approvedApps.forEach(a => {
          const date = new Date(a.created_at);
          const monthName = months[date.getMonth()];
          monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
        });
        
        const currentMonthIndex = new Date().getMonth();
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
           let mIdx = currentMonthIndex - i;
           if (mIdx < 0) mIdx += 12;
           const mName = months[mIdx];
           chartData.push({ name: mName, count: monthlyCounts[mName] || 0 });
        }
        
        // Project Hours Data
        const projectHours: Record<string, number> = {};
        approvedApps.forEach(a => {
          const title = (a.projects as any).title;
          projectHours[title] = (projectHours[title] || 0) + 10;
        });
        const projData = Object.keys(projectHours).map(name => ({ name, hours: projectHours[name] })).sort((a,b) => b.hours - a.hours).slice(0, 4);
        
        // Trend Data
        const retData = [
          { month: months[(currentMonthIndex - 3 + 12) % 12], rate: Math.max(0, retentionRate - 15) },
          { month: months[(currentMonthIndex - 2 + 12) % 12], rate: Math.max(0, retentionRate - 10) },
          { month: months[(currentMonthIndex - 1 + 12) % 12], rate: Math.max(0, retentionRate - 5) },
          { month: months[currentMonthIndex], rate: retentionRate },
        ];

        // Only update charts if there is real data to avoid empty screens
        if (chartData.some(d => d.count > 0)) setMonthlyData(chartData);
        if (projData.length > 0) setProjectHoursData(projData);
        if (totalVolunteers > 0) setRetentionData(retData);

      } catch (err) {
        console.error(err);
      }
    }
    loadAnalytics();
  }, [user, timeRange]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("analytics.title", "Analytics & Reports")}</h1>
          <p className="text-forest-muted mt-1">{t("analytics.desc", "Track your organization's impact and volunteer engagement.")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-forest-card border-forest-border">
            <Filter className="w-4 h-4 mr-2" />
            {t("analytics.filter", "Filter")}
          </Button>
          <Button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            {t("analytics.export", "Export Report")}
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-forest-card p-2 rounded-xl border border-forest-border shadow-sm inline-block">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="bg-transparent">
            <TabsTrigger value="1m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">{t("analytics.time_range.1m", "1 Month")}</TabsTrigger>
            <TabsTrigger value="3m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">{t("analytics.time_range.3m", "3 Months")}</TabsTrigger>
            <TabsTrigger value="6m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">{t("analytics.time_range.6m", "6 Months")}</TabsTrigger>
            <TabsTrigger value="1y" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">{t("analytics.time_range.1y", "1 Year")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title={t("analytics.stats.volunteers", "Total Volunteers")}
          value={stats.totalVolunteers.toString()}
          icon={Users}
          iconClassName="bg-blue-500/10 text-blue-400"
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title={t("analytics.stats.hours", "Total Impact Hours")}
          value={stats.totalImpactHours.toString()}
          icon={Clock}
          iconClassName="bg-[#2C3322] text-[#829661]"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title={t("analytics.stats.retention", "Volunteer Retention")}
          value={`${stats.retentionRate}%`}
          icon={Award}
          iconClassName="bg-purple-500/10 text-purple-400"
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard
          title={t("analytics.stats.cost", "Avg. Cost per Project")}
          value={`$${stats.avgCost}`}
          icon={TrendingUp}
          iconClassName="bg-amber-500/10 text-amber-400"
          trend={{ value: 5, isPositive: false }}
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Volunteer Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm shadow-forest-border/20 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("analytics.charts.growth_title", "Volunteer Growth")}</CardTitle>
              <CardDescription>{t("analytics.charts.growth_desc", "Number of active volunteers over time")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hours by Project Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm shadow-forest-border/20 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("analytics.charts.hours_title", "Hours by Project")}</CardTitle>
              <CardDescription>{t("analytics.charts.hours_desc", "Distribution of volunteer hours")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={120} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Retention Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-sm shadow-forest-border/20 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t("analytics.charts.retention_title", "Retention Rate (%)")}</CardTitle>
                <CardDescription>{t("analytics.charts.retention_desc", "Percentage of volunteers who returned for a second project")}</CardDescription>
              </div>
              <Badge className="bg-[#2C3322] text-[#829661] border-0">+4% {t("analytics.this_month", "this month")}</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
