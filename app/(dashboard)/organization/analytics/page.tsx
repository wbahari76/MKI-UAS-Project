"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Analytics & Reports</h1>
          <p className="text-forest-muted mt-1">Track your organization's impact and volunteer engagement.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-forest-card border-forest-border">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-forest-card p-2 rounded-xl border border-forest-border shadow-sm inline-block">
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList className="bg-transparent">
            <TabsTrigger value="1m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">1 Month</TabsTrigger>
            <TabsTrigger value="3m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">3 Months</TabsTrigger>
            <TabsTrigger value="6m" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">6 Months</TabsTrigger>
            <TabsTrigger value="1y" className="data-[state=active]:bg-[#21261B] data-[state=active]:text-[#829661]">1 Year</TabsTrigger>
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
          title="Total Volunteers"
          value="128"
          icon={Users}
          iconClassName="bg-blue-100 text-blue-600"
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Total Impact Hours"
          value="1,450"
          icon={Clock}
          iconClassName="bg-[#2C3322] text-[#829661]"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Volunteer Retention"
          value="92%"
          icon={Award}
          iconClassName="bg-purple-100 text-purple-600"
          trend={{ value: 4, isPositive: true }}
        />
        <StatsCard
          title="Avg. Cost per Project"
          value="$120"
          icon={TrendingUp}
          iconClassName="bg-amber-100 text-amber-600"
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
          <Card className="border-0 shadow-sm shadow-slate-200 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Volunteer Growth</CardTitle>
              <CardDescription>Number of active volunteers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_VOLUNTEERS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Card className="border-0 shadow-sm shadow-slate-200 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Hours by Project</CardTitle>
              <CardDescription>Distribution of volunteer hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOURS_BY_PROJECT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
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
          <Card className="border-0 shadow-sm shadow-slate-200 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Retention Rate (%)</CardTitle>
                <CardDescription>Percentage of volunteers who returned for a second project</CardDescription>
              </div>
              <Badge className="bg-[#2C3322] text-[#829661] border-0">+4% this month</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={RETENTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
