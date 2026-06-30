"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Check, X, User, MapPin, Mail, MessageCircle, MoreHorizontal, Phone, Star, Award, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ManageVolunteersPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const router = useRouter();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        // Get org id
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (orgError) throw orgError;

        // Fetch applications where status = 'approved' for projects owned by this org
        const { data: appsData, error: appsError } = await supabase
          .from('project_applications')
          .select(`
            user_id,
            status,
            created_at,
            projects!inner (
              organization_id
            )
          `)
          .eq('projects.organization_id', org.id)
          .eq('status', 'approved');

        if (appsError) throw appsError;

        if (!appsData || appsData.length === 0) {
          setVolunteers([]);
          setLoading(false);
          return;
        }

        const userIds = Array.from(new Set(appsData.map(a => a.user_id)));
        
        // Fetch profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, full_name, bio, phone, location, skills, volunteer_hours')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        const profileIds = Array.from(new Set((profilesData || []).map(p => p.id)));
        
        // Fetch volunteer_profiles
        const { data: volProfilesData, error: volProfilesError } = await supabase
          .from('volunteer_profiles')
          .select('profile_id, cv_url, portfolio_url')
          .in('profile_id', profileIds);

        if (volProfilesError) throw volProfilesError;

        const volProfilesMap = (volProfilesData || []).reduce((acc, vp) => {
          acc[vp.profile_id] = vp;
          return acc;
        }, {} as Record<string, any>);

        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.user_id] = { ...profile, ...volProfilesMap[profile.id] };
          return acc;
        }, {} as Record<string, any>);

        // Create volunteer list
        const formattedVols = userIds.map(uid => {
          const profile = profilesMap[uid as string] || {};
          const app = appsData.find(a => a.user_id === uid); // just get one to get joined date

          return {
            id: uid,
            name: profile.full_name || 'Unknown Volunteer',
            email: "hidden@example.com", // Hidden for privacy or we could fetch from auth admin if we had it
            role: "Volunteer",
            location: profile.location || "Not specified",
            status: "Active",
            joinedAt: new Date(app?.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
            rating: 5.0, // Default for now
            completedProjects: 0,
            phone: profile.phone || "Not provided",
            volunteerHours: profile.volunteer_hours || 0,
            skills: profile.skills || [],
            bio: profile.bio || "No bio provided.",
            cv_url: profile.cv_url,
            portfolio_url: profile.portfolio_url
          };
        });

        setVolunteers(formattedVols);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        toast.error("Failed to load volunteers");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [user]);

  const handleIssueClick = (vol: any) => {
    setSelectedApp(vol);
    setUploadFile(null);
    setIsDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleViewProfile = (vol: any) => {
    setSelectedApp(vol);
    setIsDialogOpen(true);
  };

  const filteredVols = volunteers.filter(vol => {
    return vol.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           vol.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            {t("volunteers.title", "Volunteer Directory")}
          </h1>
          <p className="text-forest-muted mt-1">
            {t("volunteers.desc", "Manage your community of approved volunteers and their records.")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input 
            placeholder={t("volunteers.search_placeholder", "Search by name or skills...")} 
            className="pl-9 bg-forest-card border-forest-border focus-visible:ring-forest-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-forest-card">
          <Filter className="w-4 h-4 mr-2" /> {t("analytics.filter", "Filter")}
        </Button>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : filteredVols.length === 0 ? (
        <div className="text-center py-20 bg-forest-card rounded-xl border border-forest-border">
          <User className="w-12 h-12 text-forest-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-forest-beige">{t("volunteers.no_volunteers", "No Volunteers Found")}</h3>
          <p className="text-forest-muted mt-2">{t("volunteers.no_volunteers_desc", "You don't have any approved volunteers yet.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVols.map((vol, index) => (
          <motion.div
            key={vol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm shadow-forest-border/20 hover:shadow-md transition-all group overflow-hidden h-full flex flex-col">
              <div className="h-16 bg-[#21261B] relative border-b border-[#2C3322]">
                <div className="absolute -bottom-8 left-6">
                  <Avatar className="w-16 h-16 border-4 border-forest-border shadow-sm group-hover:scale-105 transition-transform cursor-pointer" onClick={() => handleViewProfile(vol)}>
                    <AvatarFallback className="bg-[#2A2F22] text-[#DFD5C2] text-lg font-bold">
                      {vol.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute right-4 top-4">
                  <Badge className={vol.status === 'Active' ? 'bg-[#2C3322] text-[#829661] border-0 hover:bg-[#38402D]' : 'bg-[#1E211A] text-forest-muted border-0 hover:bg-[#2A2F22]'}>
                    {vol.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="pt-10 p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 
                    className="font-bold text-forest-beige text-lg group-hover:text-[#829661] cursor-pointer transition-colors"
                    onClick={() => handleViewProfile(vol)}
                  >
                    {vol.name}
                  </h3>
                  <p className="text-sm text-forest-muted">{vol.role}</p>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center text-sm text-forest-muted">
                    <MapPin className="w-4 h-4 mr-2 text-[#7A8072]" />
                    {vol.location}
                  </div>
                  <div className="flex items-center text-sm text-forest-muted">
                    <Calendar className="w-4 h-4 mr-2 text-[#7A8072]" />
                    {t("volunteers.joined", "Joined")} {vol.joinedAt}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 p-3 bg-[#181A15] rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-forest-muted mb-1">{t("volunteers.hours", "Hours")}</p>
                      <p className="font-semibold text-forest-beige">{vol.volunteerHours}</p>
                    </div>
                    <div className="flex-1 border-l border-forest-border pl-4">
                      <p className="text-xs text-forest-muted mb-1">{t("volunteers.rating", "Rating")}</p>
                      <p className="font-semibold text-amber-500 flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" /> {vol.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-forest-border">
                  <Button 
                    className="flex-1 bg-[#2C3322] hover:bg-[#38402D] text-[#829661]" 
                    onClick={() => router.push(`/organization/messages?user=${vol.id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> {t("volunteers.message", "Message")}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem onClick={() => handleViewProfile(vol)}>{t("volunteers.view_profile", "View Full Profile")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("volunteers.assign_project", "Assign to Project")}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleIssueClick(vol)}>{t("volunteers.issue_cert", "Issue E-Certificate")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("volunteers.download_resume", "Download Resume")}</DropdownMenuItem>
                      {vol.status === 'Active' ? (
                        <DropdownMenuItem className="text-amber-400 focus:text-amber-400 focus:bg-amber-500/10">{t("volunteers.mark_inactive", "Mark as Inactive")}</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-[#829661] focus:text-[#829661] focus:bg-[#21261B]">{t("volunteers.mark_active", "Mark as Active")}</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      )}

      {/* Volunteer Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <div className="h-24 bg-gradient-to-r from-forest-accent to-teal-600 relative">
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
                  selectedApp.status === 'Active' ? 'bg-forest-accent text-forest-beige border-0' :
                  'bg-[#181A15]0 text-forest-beige border-0'
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
              <p className="text-sm font-medium text-[#829661] mt-1">{selectedApp?.role}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#181A15] rounded-xl border border-forest-border text-center">
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("volunteers.rating", "Rating")}</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {selectedApp?.rating}
                </p>
              </div>
              <div className="border-x border-forest-border">
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("volunteers.completed", "Completed")}</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Award className="w-4 h-4 text-forest-accent" />
                  {selectedApp?.completedProjects}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">{t("volunteers.total_hours", "Total Hours")}</p>
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
                <span className="font-semibold text-forest-beige">{t("volunteers.email", "Email")}:</span> {selectedApp?.email}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#7A8072]" />
                <span className="font-semibold text-forest-beige">{t("volunteers.phone", "Phone")}:</span> {selectedApp?.phone}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#7A8072]" />
                <span className="font-semibold text-forest-beige">{t("volunteers.location", "Location")}:</span> {selectedApp?.location}
              </div>
            </div>

            {/* Bio / About */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">{t("volunteers.about", "About")}</h4>
              <p className="text-sm text-forest-muted bg-[#181A15] p-4 rounded-xl border border-forest-border leading-relaxed italic">
                "{selectedApp?.bio}"
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">{t("volunteers.skills", "Skills")}</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApp?.skills?.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-[#21261B] text-[#829661] hover:bg-[#2C3322] border-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-[#181A15] px-6 py-4 flex gap-2 justify-end">
            <Button variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => setIsDialogOpen(false)}>
              {t("volunteers.close", "Close")}
            </Button>
            <Button className="rounded-xl w-full sm:w-auto bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige" onClick={() => handleIssueClick(selectedApp)}>
              {t("volunteers.issue_cert", "Issue E-Certificate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Certificate Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("volunteers.issue_cert", "Issue E-Certificate")}</DialogTitle>
            <DialogDescription>
              {t("volunteers.upload_cert", "Upload a certificate document for")} {selectedApp?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">{t("volunteers.cert_file", "Certificate File (PDF, PNG, JPG)")}</label>
              <Input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="cursor-pointer file:text-[#829661] file:bg-[#21261B] file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:hover:bg-[#2C3322] transition-colors"
              />
            </div>
            {uploadFile && (
              <p className="text-sm text-[#829661] bg-[#21261B] p-3 rounded-lg border border-[#2C3322] flex items-center">
                <Check className="w-4 h-4 mr-2" />
                {t("volunteers.selected", "Selected:")} {uploadFile.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              {t("applications.cancel", "Cancel")}
            </Button>
            <Button 
              className="bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige" 
              disabled={!uploadFile}
              onClick={() => {
                toast.success(`Certificate "${uploadFile?.name}" sent to ${selectedApp?.name}!`);
                setIsUploadDialogOpen(false);
              }}
            >
              {t("volunteers.send_cert", "Send Certificate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
