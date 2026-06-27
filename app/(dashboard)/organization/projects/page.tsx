"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, CalendarDays, ExternalLink } from "lucide-react";
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

// Mock data for organization's projects
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Coastal Cleanup Initiative",
    status: "active",
    volunteers: 45,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
  },
  {
    id: 2,
    title: "Digital Literacy Bootcamp",
    status: "draft",
    volunteers: 0,
    startDate: "2026-08-15",
    endDate: "2026-09-15",
  },
  {
    id: 3,
    title: "Community Garden Maintenance",
    status: "completed",
    volunteers: 120,
    startDate: "2026-05-01",
    endDate: "2026-06-01",
  }
];

export default function OrganizationProjectsPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    toast.success("Project deleted successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#2C3322] text-[#829661] border-[#4A5D23]">Active</Badge>;
      case "draft":
        return <Badge className="bg-[#1E211A] text-[#DFD5C2] border-forest-border">Draft</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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

      <Card className="border-0 shadow-sm shadow-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-forest-muted uppercase bg-[#181A15] border-b border-forest-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Project Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Volunteers</th>
                  <th className="px-6 py-4 font-medium">Timeline</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-forest-border hover:bg-[#181A15]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-forest-beige">{project.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-forest-muted">
                        <Users className="w-4 h-4" />
                        {project.volunteers} registered
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-forest-muted">
                        <CalendarDays className="w-4 h-4" />
                        {project.startDate} to {project.endDate}
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
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-forest-muted">
                      No projects found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
