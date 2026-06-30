"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CheckCircle, XCircle, Filter, FileText, Mail, Phone, MapPin, Star, Award, Calendar, Crown, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function OrganizationApplicationsPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;
      try {
        setLoading(true);
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (orgError) throw orgError;
        setSubscriptionTier("free");

        const { data: appsData, error: appsError } = await supabase
          .from('project_applications')
          .select(`
            id,
            status,
            created_at,
            user_id,
            project_id,
            projects!inner (
              title,
              organization_id
            )
          `)
          .eq('projects.organization_id', org.id)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;
        
        if (!appsData || appsData.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }

        // Fetch profiles separately because there's no direct foreign key
        const userIds = Array.from(new Set(appsData.map(a => a.user_id)));
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, full_name, bio, phone, location, skills, volunteer_hours')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, any>);

        // Transform data to match the UI format
        const formattedData = appsData.map((app: any) => {
          const profile = profilesMap[app.user_id] || {};
          return {
            id: app.id,
            name: profile.full_name || 'Unknown Volunteer',
            project: app.projects?.title || 'Unknown Project',
            role: "Volunteer",
            status: app.status,
            date: new Date(app.created_at).toLocaleDateString(),
            email: "hidden@example.com", 
            phone: profile.phone || "Not provided",
            location: profile.location || "Not specified",
            rating: 5.0, // Defaulting to 5 for now
            completedProjects: 0,
            volunteerHours: profile.volunteer_hours || 0,
            skills: profile.skills || [],
            bio: profile.bio || "No bio provided.",
            cv_url: profile.cv_url,
            portfolio_url: profile.portfolio_url
          };
        });
        
        setApplications(formattedData);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [user]);

  const handleViewProfile = (app: any) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  const uniqueProjects = [t("applications.filter_all_projects", "All Projects"), ...Array.from(new Set(applications.map(app => app.project)))];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === t("applications.filter_all_projects", "All Projects") || app.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  const handleStatusChange = async (id: number, status: string) => {
    if (status === 'approved' && subscriptionTier === 'free') {
      const appToApprove = applications.find(a => a.id === id);
      if (appToApprove) {
        const approvedForProject = applications.filter(a => a.project === appToApprove.project && a.status === 'approved').length;
        if (approvedForProject >= 20) {
          setUpgradeReason(t("applications.limit_volunteers", "You have reached the maximum limit of 20 volunteers per project on the Free plan."));
          setShowUpgradeDialog(true);
          return;
        }

        const pendingCount = applications.filter(a => a.status === 'pending').length;
        if (pendingCount >= 50) {
          setUpgradeReason(t("applications.limit_active", "You have reached the maximum limit of 50 active applications on the Free plan."));
          setShowUpgradeDialog(true);
          return;
        }
      }
    }

    try {
      const { error } = await supabase
        .from('project_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Application ${status} successfully`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update application status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#2C3322] text-[#829661] hover:bg-[#38402D] border-0">{t("applications.approve")}</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-400 hover:bg-amber-200 border-0">{t("applications.pending", "Pending")}</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-400 hover:bg-red-200 border-0">{t("applications.reject")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
      return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("applications.title")}</h1>
          <p className="text-forest-muted mt-1">{t("applications.desc")}</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder={t("applications.search")}
                className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-[240px]">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-[#181A15] border-forest-border">
                  <SelectValue placeholder={t("applications.filter")} />
                </SelectTrigger>
                <SelectContent>
                  {uniqueProjects.map((project, idx) => (
                    <SelectItem key={idx} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-forest-muted uppercase bg-[#181A15] border-b border-forest-border">
                <tr>
                  <th className="px-6 py-4 font-medium">{t("applications.applicant")}</th>
                  <th className="px-6 py-4 font-medium">{t("applications.project")}</th>
                  <th className="px-6 py-4 font-medium">{t("applications.status")}</th>
                  <th className="px-6 py-4 font-medium">{t("applications.applied_on")}</th>
                  <th className="px-6 py-4 font-medium text-right">{t("applications.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className="border-b border-forest-border hover:bg-[#181A15]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 cursor-pointer group/name" onClick={() => handleViewProfile(app)}>
                        <Avatar className="w-8 h-8 group-hover/name:scale-105 transition-transform">
                          <AvatarFallback className="bg-[#2A2F22] text-forest-muted text-xs">
                            {app.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-forest-beige group-hover/name:text-blue-400 group-hover/name:underline transition-colors">{app.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-forest-beige">{app.project}</div>
                      <div className="text-xs text-forest-muted">{app.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-forest-muted">
                      {app.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.status === 'pending' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-[#829661] border-[#4A5D23] hover:bg-[#21261B] h-8 px-2"
                              onClick={() => handleStatusChange(app.id, 'approved')}
                              title={t("applications.approve")}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-500/20 hover:bg-red-500/10 h-8 px-2"
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              title={t("applications.reject")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 text-forest-muted hover:text-blue-400 hover:bg-blue-500/10"
                            onClick={() => handleViewProfile(app)}
                          >
                            <FileText className="w-4 h-4 mr-2" /> {t("applications.view_profile")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      {t("applications.no_apps")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
          <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            <div className="absolute -bottom-8 left-6">
              <Avatar className="w-20 h-20 border-4 border-forest-border shadow-md">
                <AvatarFallback className="bg-[#2A2F22] text-[#DFD5C2] text-xl font-bold">
                  {selectedApp?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            {selectedApp && (
              <div className="absolute right-6 bottom-3">
                <Badge className={
                  selectedApp.status === 'approved' ? 'bg-forest-accent text-forest-beige border-0' :
                  selectedApp.status === 'rejected' ? 'bg-red-500 text-forest-beige border-0' :
                  'bg-amber-500 text-forest-beige border-0'
                }>
                  {selectedApp.status.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>

          <div className="pt-10 pb-6 px-6 space-y-6">
            {/* Header info */}
            <div>
              <h3 className="text-2xl font-bold text-forest-beige">{selectedApp?.name}</h3>
              <p className="text-sm font-medium text-blue-400 mt-1">{selectedApp?.role} {t("applications.applied_for", "Applied for")} {selectedApp?.project}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#181A15] rounded-xl border border-forest-border text-center">
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("applications.rating")}</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {selectedApp?.rating}
                </p>
              </div>
              <div className="border-x border-forest-border">
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("applications.completed")}</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Award className="w-4 h-4 text-forest-accent" />
                  {selectedApp?.completedProjects}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("applications.total_hours")}</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {selectedApp?.volunteerHours}
                </p>
              </div>
            </div>

            {/* Detailed Contact info */}
            <div className="space-y-3 text-sm text-forest-muted">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#7A8072]" />
                <span className="font-semibold text-forest-beige">Email:</span> {selectedApp?.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#7A8072]" />
                <span className="font-semibold text-forest-beige">Phone:</span> {selectedApp?.phone}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#7A8072]" />
                <span className="font-semibold text-forest-beige">Location:</span> {selectedApp?.location}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">{t("applications.about_me")}</h4>
              <p className="text-sm text-forest-muted bg-[#181A15] p-4 rounded-xl border border-forest-border leading-relaxed italic">
                "{selectedApp?.bio}"
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">{t("applications.skills")}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApp?.skills?.length ? selectedApp.skills.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/10 border-0">
                    {skill}
                  </Badge>
                )) : <span className="text-xs text-forest-muted">{t("applications.no_skills")}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">{t("applications.attachments")}</h4>
              <div className="flex flex-wrap gap-3">
                {selectedApp?.cv_url ? (
                  <a href={selectedApp.cv_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-[#2C3322] border border-[#4A5D23] rounded-lg text-sm text-[#829661] hover:bg-[#38402D] transition-colors">
                    <FileText className="w-4 h-4" />
                    {t("applications.view_cv")}
                  </a>
                ) : (
                  <span className="text-sm text-forest-muted italic">{t("applications.no_cv")}</span>
                )}
                
                {selectedApp?.portfolio_url ? (
                  <a href={selectedApp.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 bg-indigo-900/30 border border-indigo-700/50 rounded-lg text-sm text-indigo-400 hover:bg-indigo-900/50 transition-colors">
                    <FileText className="w-4 h-4" />
                    {t("applications.view_portfolio")}
                  </a>
                ) : (
                  <span className="text-sm text-forest-muted italic">{t("applications.no_portfolio")}</span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-[#181A15] px-6 py-4 flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>
              {t("applications.close")}
            </Button>
            {selectedApp?.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-400 hover:bg-red-500/10 border-red-500/20 rounded-xl"
                  onClick={() => {
                    handleStatusChange(selectedApp.id, 'rejected');
                    setIsDialogOpen(false);
                  }}
                >
                  {t("applications.reject")}
                </Button>
                <Button 
                  className="bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige rounded-xl"
                  onClick={() => {
                    handleStatusChange(selectedApp.id, 'approved');
                    setIsDialogOpen(false);
                  }}
                >
                  {t("applications.approve")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-forest-card border-forest-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-forest-beige flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              {t("applications.upgrade_pro")}
            </DialogTitle>
            <DialogDescription className="text-forest-muted pt-2">
              {upgradeReason}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-medium text-forest-beige mb-3">{t("applications.pro_benefits")}</h4>
            <ul className="space-y-2">
              {[t("applications.pro_feat1", "Unlimited Volunteers per Project"), t("applications.pro_feat2", "Unlimited Active Applications"), t("applications.pro_feat3", "AI Volunteer Matching"), t("applications.pro_feat4", "Export Volunteer Data")].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#DFD5C2]">
                  <CheckCircle className="w-4 h-4 text-forest-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={() => setShowUpgradeDialog(false)} className="text-forest-muted">
              {t("applications.cancel", "Cancel")}
            </Button>
            <Link href="/organization/subscription">
              <Button className="btn-primary group w-full sm:w-auto">
                <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {t("applications.view_subscription", "View Subscription")}
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

