"use client";

import React, { useState } from "react";
import { Search, CheckCircle, XCircle, Filter, FileText, Mail, Phone, MapPin, Star, Award, Calendar } from "lucide-react";
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

const MOCK_APPLICATIONS = [
  { 
    id: 1, 
    name: "Andi Saputra", 
    project: "Coastal Cleanup Initiative", 
    role: "Field Volunteer", 
    status: "pending", 
    date: "Jul 10, 2026",
    email: "andi.s@example.com",
    phone: "+62 812-3456-7890",
    location: "Bali, Indonesia",
    rating: 4.8,
    completedProjects: 12,
    volunteerHours: 48,
    skills: ["Beach Cleanup", "Teamwork", "First Aid"],
    bio: "Saya sangat menyukai kegiatan lingkungan dan aktif melakukan aksi bersih-bersih pantai secara sukarela sejak 2 tahun lalu."
  },
  { 
    id: 2, 
    name: "Budi Santoso", 
    project: "Coastal Cleanup Initiative", 
    role: "Logistics", 
    status: "pending", 
    date: "Jul 10, 2026",
    email: "budi.santoso@example.com",
    phone: "+62 812-9876-5432",
    location: "Surabaya, Indonesia",
    rating: 5.0,
    completedProjects: 5,
    volunteerHours: 20,
    skills: ["Logistics", "Event Operations", "Inventory Control"],
    bio: "Berpengalaman dalam koordinasi logistik lapangan untuk acara komunitas berskala menengah."
  },
  { 
    id: 3, 
    name: "Citra Kirana", 
    project: "Food Bank Distribution", 
    role: "Coordinator", 
    status: "pending", 
    date: "Jul 09, 2026",
    email: "citra.k@example.com",
    phone: "+62 813-1111-2222",
    location: "Jakarta, Indonesia",
    rating: 4.5,
    completedProjects: 2,
    volunteerHours: 8,
    skills: ["Project Management", "Food Handling", "Communication"],
    bio: "Senang merencanakan dan mengatur alur distribusi makanan sehat untuk masyarakat yang membutuhkan."
  },
  { 
    id: 4, 
    name: "Dewi Lestari", 
    project: "Tree Planting Day", 
    role: "Field Volunteer", 
    status: "approved", 
    date: "Jul 05, 2026",
    email: "dewi.l@example.com",
    phone: "+62 813-4444-5555",
    location: "Bandung, Indonesia",
    rating: 4.2,
    completedProjects: 7,
    volunteerHours: 28,
    skills: ["Gardening", "Species Identification", "Physical Labor"],
    bio: "Pecinta alam yang aktif menanam pohon dan merawat tanaman hias di waktu luang."
  },
  { 
    id: 5, 
    name: "Eko Prasetyo", 
    project: "Digital Literacy", 
    role: "Mentor", 
    status: "rejected", 
    date: "Jul 02, 2026",
    email: "eko.p@example.com",
    phone: "+62 812-8888-9999",
    location: "Jakarta, Indonesia",
    rating: 4.9,
    completedProjects: 15,
    volunteerHours: 60,
    skills: ["Web Development", "Teaching", "Public Speaking"],
    bio: "Pengajar IT dengan passion membagi pengetahuan literasi digital dasar kepada anak-anak di daerah pelosok."
  }
];

export default function OrganizationApplicationsPage() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewProfile = (app: any) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  const uniqueProjects = ["All Projects", ...Array.from(new Set(applications.map(app => app.project)))];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === "All Projects" || app.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  const handleStatusChange = (id: number, status: string) => {
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    toast.success(`Application ${status} successfully`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[#2C3322] text-[#829661] hover:bg-[#38402D] border-0">Approved</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-400 hover:bg-amber-200 border-0">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-400 hover:bg-red-200 border-0">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Applications</h1>
          <p className="text-forest-muted mt-1">Review and manage volunteer applications for your projects.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder="Search applicants or projects..." 
                className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-[240px]">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-[#181A15] border-forest-border">
                  <SelectValue placeholder="Filter by Project" />
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
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 border-red-500/20 hover:bg-red-500/10 h-8 px-2"
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              title="Reject"
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
                            <FileText className="w-4 h-4 mr-2" /> View Profile
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      No applications found.
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
              <p className="text-sm font-medium text-blue-400 mt-1">{selectedApp?.role} Applied for {selectedApp?.project}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#181A15] rounded-xl border border-forest-border text-center">
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">Rating</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {selectedApp?.rating}
                </p>
              </div>
              <div className="border-x border-forest-border">
                <p className="text-xs text-[#7A8072] uppercase font-semibold">Completed</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Award className="w-4 h-4 text-forest-accent" />
                  {selectedApp?.completedProjects} Projects
                </p>
              </div>
              <div>
                <p className="text-xs text-[#7A8072] uppercase font-semibold">Total Hours</p>
                <p className="text-base font-bold text-forest-beige flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {selectedApp?.volunteerHours} Hours
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

            {/* Bio / About */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">About Me</h4>
              <p className="text-sm text-forest-muted bg-[#181A15] p-4 rounded-xl border border-forest-border leading-relaxed italic">
                "{selectedApp?.bio}"
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApp?.skills?.map((skill: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/10 border-0">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="bg-[#181A15] px-6 py-4 flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>
              Close
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
                  Reject
                </Button>
                <Button 
                  className="bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige rounded-xl"
                  onClick={() => {
                    handleStatusChange(selectedApp.id, 'approved');
                    setIsDialogOpen(false);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
