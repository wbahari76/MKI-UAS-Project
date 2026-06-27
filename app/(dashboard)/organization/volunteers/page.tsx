"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Check, X, User, MapPin, Mail, MessageCircle, MoreHorizontal, Phone, Star, Award, Calendar } from "lucide-react";
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

// Mock Data for Member Directory
const MOCK_VOLUNTEERS = [
  { 
    id: 1, 
    name: "Andi Saputra", 
    email: "andi.s@example.com", 
    role: "Field Volunteer",
    location: "Bali, Indonesia", 
    status: "Active", 
    joinedAt: "Jan 2026", 
    rating: 4.8, 
    completedProjects: 12,
    phone: "+62 812-3456-7890",
    volunteerHours: 48,
    skills: ["Beach Cleanup", "Teamwork", "First Aid"],
    bio: "Saya sangat menyukai kegiatan lingkungan dan aktif melakukan aksi bersih-bersih pantai secara sukarela sejak 2 tahun lalu."
  },
  { 
    id: 2, 
    name: "Budi Santoso", 
    email: "budi.santoso@example.com", 
    role: "Logistics Coordinator",
    location: "Surabaya, Indonesia", 
    status: "Active", 
    joinedAt: "Mar 2026", 
    rating: 5.0, 
    completedProjects: 5,
    phone: "+62 812-9876-5432",
    volunteerHours: 20,
    skills: ["Logistics", "Event Operations", "Inventory Control"],
    bio: "Berpengalaman dalam koordinasi logistik lapangan untuk acara komunitas berskala menengah."
  },
  { 
    id: 3, 
    name: "Dewi Lestari", 
    email: "dewi.l@example.com", 
    role: "Environmental Expert",
    location: "Bandung, Indonesia", 
    status: "Inactive", 
    joinedAt: "Dec 2025", 
    rating: 4.2, 
    completedProjects: 7,
    phone: "+62 813-4444-5555",
    volunteerHours: 28,
    skills: ["Gardening", "Species Identification", "Physical Labor"],
    bio: "Pecinta alam yang aktif menanam pohon dan merawat tanaman hias di waktu luang."
  },
  { 
    id: 4, 
    name: "Eko Prasetyo", 
    email: "eko.p@example.com", 
    role: "IT Mentor",
    location: "Jakarta, Indonesia", 
    status: "Active", 
    joinedAt: "Feb 2026", 
    rating: 4.9, 
    completedProjects: 8,
    phone: "+62 812-8888-9999",
    volunteerHours: 60,
    skills: ["Web Development", "Teaching", "Public Speaking"],
    bio: "Pengajar IT dengan passion membagi pengetahuan literasi digital dasar kepada anak-anak di daerah pelosok."
  },
];

export default function ManageVolunteersPage() {
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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
           vol.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            Volunteer Directory
          </h1>
          <p className="text-forest-muted mt-1">
            Manage your community of approved volunteers and their records.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input 
            placeholder="Search by name or skills..." 
            className="pl-9 bg-forest-card border-forest-border focus-visible:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-forest-card">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVols.map((vol, index) => (
          <motion.div
            key={vol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-sm shadow-slate-200 hover:shadow-md transition-all group overflow-hidden h-full flex flex-col">
              <div className="h-16 bg-[#21261B] relative border-b border-emerald-100">
                <div className="absolute -bottom-8 left-6">
                  <Avatar className="w-16 h-16 border-4 border-white shadow-sm group-hover:scale-105 transition-transform cursor-pointer" onClick={() => handleViewProfile(vol)}>
                    <AvatarFallback className="bg-slate-200 text-[#DFD5C2] text-lg font-bold">
                      {vol.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute right-4 top-4">
                  <Badge className={vol.status === 'Active' ? 'bg-[#2C3322] text-[#829661] border-0 hover:bg-emerald-200' : 'bg-[#1E211A] text-forest-muted border-0 hover:bg-slate-200'}>
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
                    Joined {vol.joinedAt}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 p-3 bg-[#181A15] rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-forest-muted mb-1">Hours</p>
                      <p className="font-semibold text-forest-beige">{vol.volunteerHours}</p>
                    </div>
                    <div className="flex-1 border-l border-forest-border pl-4">
                      <p className="text-xs text-forest-muted mb-1">Rating</p>
                      <p className="font-semibold text-amber-500 flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" /> {vol.rating}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-forest-border">
                  <Button variant="outline" className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
                    <MessageCircle className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem onClick={() => handleViewProfile(vol)}>View Full Profile</DropdownMenuItem>
                      <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleIssueClick(vol)}>Issue E-Certificate</DropdownMenuItem>
                      <DropdownMenuItem>Download Resume</DropdownMenuItem>
                      {vol.status === 'Active' ? (
                        <DropdownMenuItem className="text-amber-600 focus:text-amber-600 focus:bg-amber-50">Mark as Inactive</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-[#829661] focus:text-[#829661] focus:bg-[#21261B]">Mark as Active</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredVols.length === 0 && (
          <div className="col-span-full text-center py-20 bg-forest-card rounded-2xl border border-forest-border border-dashed">
            <div className="w-16 h-16 bg-[#181A15] text-[#7A8072] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-forest-beige mb-1">No volunteers found</h3>
            <p className="text-forest-muted text-sm">
              Try adjusting your search or filters to see results.
            </p>
          </div>
        )}
      </div>

      {/* Volunteer Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 border-0 shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
            <div className="absolute -bottom-8 left-6">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarFallback className="bg-slate-200 text-[#DFD5C2] text-xl font-bold">
                  {selectedApp?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            {selectedApp && (
              <div className="absolute right-6 bottom-3">
                <Badge className={
                  selectedApp.status === 'Active' ? 'bg-forest-accent text-white border-0' :
                  'bg-slate-500 text-white border-0'
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
              <h4 className="text-sm font-semibold text-forest-beige">About</h4>
              <p className="text-sm text-forest-muted bg-[#181A15] p-4 rounded-xl border border-forest-border leading-relaxed italic">
                "{selectedApp?.bio}"
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-forest-beige">Skills</h4>
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
              Close
            </Button>
            <Button className="rounded-xl w-full sm:w-auto bg-[#4A5D23] hover:bg-emerald-700 text-white" onClick={() => handleIssueClick(selectedApp)}>
              Issue E-Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Certificate Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Issue E-Certificate</DialogTitle>
            <DialogDescription>
              Upload a certificate document for {selectedApp?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">Certificate File (PDF, PNG, JPG)</label>
              <Input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="cursor-pointer file:text-[#829661] file:bg-[#21261B] file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:hover:bg-[#2C3322] transition-colors"
              />
            </div>
            {uploadFile && (
              <p className="text-sm text-[#829661] bg-[#21261B] p-3 rounded-lg border border-emerald-100 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Selected: {uploadFile.name}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#4A5D23] hover:bg-emerald-700 text-white" 
              disabled={!uploadFile}
              onClick={() => {
                toast.success(`Certificate "${uploadFile?.name}" sent to ${selectedApp?.name}!`);
                setIsUploadDialogOpen(false);
              }}
            >
              Send Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
