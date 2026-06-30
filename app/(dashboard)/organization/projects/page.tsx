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
import { useTranslation } from "react-i18next";

export default function OrganizationProjectsPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "paid" | "unpaid">("all");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToCancel, setProjectToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

    // Realtime subscription so org sees changes when admin approves/rejects
    const channel = supabase.channel('org-projects-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const confirmCancelRefund = async () => {
    if (!projectToCancel) return;
    setIsCancelling(true);
    try {
      const { error } = await supabase.rpc('cancel_project_and_refund', { p_project_id: projectToCancel });
      if (error) throw error;
      
      setProjects(projects.map(p => p.id === projectToCancel ? { ...p, status: 'cancelled' } : p));
      toast.success("Project cancelled and volunteers refunded successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to cancel project");
    } finally {
      setIsCancelling(false);
      setProjectToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
      case "recruiting":
      case "active":
        return <Badge className="bg-[#2C3322] text-[#829661] border-[#4A5D23]">{t("projects.active")}</Badge>;
      case "draft":
        return <Badge className="bg-[#1E211A] text-[#DFD5C2] border-forest-border">{t("projects.draft")}</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">{t("projects.pending", "Pending Review")}</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{t("projects.completed")}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">{t("projects.cancelled", "Cancelled")}</Badge>;
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
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("projects.manage_projects")}</h1>
          <p className="text-forest-muted mt-1">{t("projects.manage_desc")}</p>
        </div>
        <Link href="/organization/projects/new">
          <Button className="btn-primary w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            {t("projects.create_new")}
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder={t("projects.search")}
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
                {t("projects.all")}
              </Button>
              <Button 
                variant={filterType === "paid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType("paid")}
                className={filterType === "paid" ? "bg-forest-card text-emerald-400" : ""}
              >
                <Wallet className="w-4 h-4 mr-2 text-emerald-500" />
                {t("projects.paid")}
              </Button>
              <Button 
                variant={filterType === "unpaid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType("unpaid")}
                className={filterType === "unpaid" ? "bg-forest-card text-amber-400" : ""}
              >
                <HeartHandshake className="w-4 h-4 mr-2 text-amber-500" />
                {t("projects.unpaid")}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-forest-muted uppercase bg-[#181A15] border-b border-forest-border">
                <tr>
                  <th className="px-6 py-4 font-medium">{t("projects.name_category")}</th>
                  <th className="px-6 py-4 font-medium">{t("projects.status")}</th>
                  <th className="px-6 py-4 font-medium">{t("projects.type")}</th>
                  <th className="px-6 py-4 font-medium">{t("projects.timeline")}</th>
                  <th className="px-6 py-4 font-medium text-right">{t("projects.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      <div className="flex justify-center items-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        {t("projects.loading")}
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      {t("projects.no_projects")}
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
                              {t("projects.paid_project", "Paid")} ({project.compensation_type})
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 w-fit text-[10px]">
                              {t("projects.unpaid_project", "Volunteer (Unpaid)")}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-forest-muted">
                          <CalendarDays className="w-4 h-4" />
                          {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : t("projects.no_deadline")}
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
                              <ExternalLink className="w-4 h-4 mr-2" /> {t("projects.view_details")}
                            </DropdownMenuItem>
                            <Link href={`/organization/projects/${project.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit className="w-4 h-4 mr-2" /> {t("projects.edit_project")}
                              </DropdownMenuItem>
                            </Link>
                            {(project.status === 'published' || project.status === 'active') && (
                              <DropdownMenuItem 
                                className="cursor-pointer text-amber-500 focus:text-amber-500 focus:bg-amber-500/10"
                                onClick={() => setProjectToCancel(project.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Cancel & Refund
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-500/10"
                              onClick={() => setProjectToDelete(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> {t("projects.delete")}
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
            <DialogTitle className="text-forest-beige">{t("projects.are_you_sure")}</DialogTitle>
            <DialogDescription className="text-forest-muted">
              {t("projects.delete_warning")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setProjectToDelete(null)}
              className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50"
            >
              {t("projects.cancel")}
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 border-0"
              disabled={isDeleting}
            >
              {isDeleting ? t("projects.delete") + "..." : t("projects.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel & Refund Dialog */}
      <Dialog open={!!projectToCancel} onOpenChange={(open) => !open && setProjectToCancel(null)}>
        <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-amber-500">Cancel & Refund Project?</DialogTitle>
            <DialogDescription className="text-forest-muted">
              Are you sure you want to cancel this project? For paid projects, 90% of the registration fee for each approved volunteer will be deducted from your Organization's Pending Balance and the volunteers will be refunded. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setProjectToCancel(null)}
              className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50"
              disabled={isCancelling}
            >
              No, keep project
            </Button>
            <Button 
              onClick={confirmCancelRefund}
              className="bg-amber-600 text-white hover:bg-amber-700 border-0"
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Yes, Cancel & Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
