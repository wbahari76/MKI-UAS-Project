"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, MoreHorizontal, CheckCircle2, XCircle,
  ExternalLink, CalendarDays, Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, organizations(name, logo_url)');
        
      if (!error && data) {
        setProjects(data);
      }
    };

    fetchProjects();

    const channel = supabase.channel('admin-projects-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'published' })
      .eq('id', id);

    if (error) {
      toast.error("Failed to approve project.");
    } else {
      toast.success("Project approved and published.");
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      toast.error("Failed to reject project.");
    } else {
      toast.error("Project rejected (archived).");
    }
  };

  const filteredProjects = projects.filter(p => {
    const orgName = (p.organizations as any)?.name || '';
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          orgName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'pending' && p.status === 'draft') ||
                       (activeTab === 'flagged' && false); // no flag logic yet
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Manage Projects</h1>
          <p className="text-forest-muted mt-1">Review new projects, manage events, and handle reported content.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-forest-card border-forest-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20 overflow-hidden">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-forest-border p-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="pending">Pending Review (Drafts)</TabsTrigger>
              <TabsTrigger value="flagged" className="text-red-600 data-[state=active]:text-red-400">Reported</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-forest-muted bg-[#181A15] uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project Details</th>
                    <th className="px-6 py-4 font-semibold">Organization</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-forest-muted">
                        No projects found.
                      </td>
                    </tr>
                  ) : filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-[#181A15]/50 transition-colors bg-forest-card">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#21261B] flex items-center justify-center text-[#829661] shrink-0">
                            <CalendarDays className="w-5 h-5" />
                          </div>
                          <div>
                            <Link href={`/volunteer/explore/${project.id}`} className="font-medium text-forest-beige hover:text-[#829661] flex items-center gap-1">
                              {project.title}
                              <ExternalLink className="w-3 h-3 text-[#7A8072]" />
                            </Link>
                            <p className="text-xs text-forest-muted mt-1 truncate max-w-xs">
                              {project.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-forest-beige font-medium">
                        {(project.organizations as any)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-forest-muted">
                        {new Date(project.created_at).toISOString().split('T')[0]}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          project.status === 'published' 
                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                            : project.status === 'draft'
                            ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5'
                            : 'border-slate-500/30 text-slate-400 bg-slate-500/5'
                        }>
                          {project.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-[#7A8072] hover:text-forest-beige hover:bg-[#21261B]">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#181A15] border-forest-border">
                            {project.status === 'draft' && (
                              <>
                                <DropdownMenuItem 
                                  className="text-emerald-500 hover:text-emerald-400 focus:text-emerald-400 focus:bg-[#21261B] cursor-pointer"
                                  onSelect={() => handleApprove(project.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Approve & Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-[#21261B] cursor-pointer"
                                  onSelect={() => handleReject(project.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Project
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem 
                              className="text-forest-beige focus:bg-[#21261B] focus:text-forest-beige cursor-pointer"
                              onSelect={() => toast.info("Project details view coming soon.")}
                            >
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
