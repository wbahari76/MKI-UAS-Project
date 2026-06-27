"use client";

import React, { useState } from "react";
import { 
  Search, MoreHorizontal, CheckCircle, XCircle, 
  Flag, CalendarDays, ExternalLink 
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
import Link from "next/link";

const MOCK_PROJECTS = [
  { id: 1, title: "Coastal Cleanup Initiative", org: "Ocean Care ID", status: "Active", date: "2026-07-20", reports: 0 },
  { id: 2, title: "Digital Literacy for Elders", org: "Tech for All", status: "Pending", date: "2026-08-15", reports: 0 },
  { id: 3, title: "Free Health Clinic", org: "MedCare Foundation", status: "Flagged", date: "2026-07-10", reports: 3 },
  { id: 4, title: "Tree Planting Campaign", org: "Green Earth", status: "Completed", date: "2026-05-20", reports: 0 },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (id: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: "Active" } : p));
    toast.success("Project approved and published.");
  };

  const handleReject = (id: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    toast.error("Project rejected.");
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.org.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <Card className="border-0 shadow-sm shadow-slate-200 overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-forest-border p-4">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="flagged" className="text-red-600 data-[state=active]:text-red-700">Reported</TabsTrigger>
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
                  {filteredProjects.map((project) => (
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
                            {project.reports > 0 && (
                              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5">
                                <Flag className="w-3 h-3" /> {project.reports} User Reports
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-forest-muted">
                        {project.org}
                      </td>
                      <td className="px-6 py-4 text-forest-muted">
                        {new Date(project.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${project.status === 'Active' ? 'border-[#4A5D23] text-[#829661] bg-[#21261B]' : ''}
                          ${project.status === 'Pending' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''}
                          ${project.status === 'Flagged' ? 'border-red-200 text-red-700 bg-red-50' : ''}
                          ${project.status === 'Completed' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                          ${project.status === 'Rejected' ? 'border-forest-border text-[#DFD5C2] bg-[#181A15]' : ''}
                        `}>
                          {project.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#7A8072] hover:text-forest-muted">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {project.status === 'Pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(project.id)} className="text-[#829661]">
                                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(project.id)} className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            {project.status === 'Flagged' && (
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" /> Takedown Project
                              </DropdownMenuItem>
                            )}
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
