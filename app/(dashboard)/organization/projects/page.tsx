"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, CalendarDays, ExternalLink, Loader2, Filter, Wallet, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function OrganizationProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "paid" | "unpaid">("all");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;
      
      try {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (orgError) throw orgError;

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('organization_id', org.id)
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [user]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === "all") return matchesSearch;
    if (filterType === "paid") return matchesSearch && p.is_paid;
    if (filterType === "unpaid") return matchesSearch && !p.is_paid;
    return matchesSearch;
  });

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_project', { p_id: projectToDelete });
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== projectToDelete));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };

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

  const formatProjectType = (type: string) => {
    if (!type) return "Project";
    const types: Record<string, string> = {
      "social_volunteer": "Social Volunteer",
      "disaster_relief": "Disaster Relief",
      "capacity_building": "Capacity Building",
      "event_staff": "Event Staff",
      "professional_pro_bono": "Pro Bono"
    };
    return types[type] || type.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Manage Projects</h1>
          <p className="text-forest-muted mt-1">Create, edit, and track your volunteer projects.</p>
        </div>
        <Link href="/organization/projects/new">
          <Button className="btn-primary w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filterType === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-forest-card" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button 
                variant={filterType === "paid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType("paid")}
                className={filterType === "paid" ? "bg-forest-card text-emerald-400" : ""}
              >
                <Wallet className="w-4 h-4 mr-2 text-emerald-500" />
                Paid
              </Button>
              <Button 
                variant={filterType === "unpaid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType("unpaid")}
                className={filterType === "unpaid" ? "bg-forest-card text-amber-400" : ""}
              >
                <HeartHandshake className="w-4 h-4 mr-2 text-amber-500" />
                Unpaid
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-forest-muted uppercase bg-[#181A15] border-b border-forest-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name & Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Timeline</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      <div className="flex justify-center items-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading projects...
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      No projects found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-forest-border hover:bg-[#181A15]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-forest-beige">{project.title}</div>
                        <div className="text-xs text-forest-muted mt-1 capitalize">{project.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-forest-beige capitalize">
                            {formatProjectType(project.project_type)}
                          </span>
                          {project.is_paid ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 w-fit text-[10px]">
                              Paid ({project.compensation_type})
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 w-fit text-[10px]">
                              Volunteer (Unpaid)
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-forest-muted">
                          <CalendarDays className="w-4 h-4" />
                          {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-forest-muted hover:text-forest-beige">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(`Viewing details for ${project.title}`)}>
                              <ExternalLink className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <Link href={`/organization/projects/${project.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" /> Edit Project
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10"
                              onClick={() => setProjectToDelete(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-forest-beige">Are you sure?</DialogTitle>
            <DialogDescription className="text-forest-muted">
              This will permanently delete the project and all of its associated data (applications, events, etc.). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setProjectToDelete(null)}
              className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
