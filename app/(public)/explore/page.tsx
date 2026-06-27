"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, Users, Building2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

// This is synced with the Volunteer Explore dashboard data
const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Coastal Cleanup Initiative",
    org: "Ocean Care ID",
    category: "Environment",
    location: "Bali, Indonesia",
    deadline: "2026-07-15",
    volunteersNeeded: 50,
    volunteersApplied: 32,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=600&q=80",
    isSaved: true
  },
  {
    id: 2,
    title: "Digital Literacy for Seniors",
    org: "Tech For All",
    category: "Education",
    location: "Jakarta, Indonesia",
    deadline: "2026-07-01",
    volunteersNeeded: 20,
    volunteersApplied: 15,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
    isSaved: false
  },
  {
    id: 3,
    title: "Stray Animal Rescue Weekend",
    org: "Pawsitive Impact",
    category: "Animal Welfare",
    location: "Bandung, Indonesia",
    deadline: "2026-08-10",
    volunteersNeeded: 30,
    volunteersApplied: 30,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    isSaved: false
  },
  {
    id: 4,
    title: "Community Health Screening",
    org: "Healthy Nation",
    category: "Health",
    location: "Surabaya, Indonesia",
    deadline: "2026-07-20",
    volunteersNeeded: 15,
    volunteersApplied: 8,
    image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?auto=format&fit=crop&w=600&q=80",
    isSaved: true
  }
];

function ExplorePublicContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = MOCK_PROJECTS.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.org.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-forest-beige tracking-tight">
            Explore Open <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Projects</span>
          </h1>
          <p className="text-lg text-forest-muted">
            Find the perfect cause to contribute your skills and time. Discover volunteering opportunities from organizations worldwide.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
            <Input 
              placeholder="Search projects or organizations..." 
              className="pl-12 h-14 rounded-full border-forest-border bg-forest-card focus-visible:ring-emerald-500 shadow-sm text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-full border-forest-border bg-forest-card text-[#DFD5C2] hover:bg-[#181A15] shadow-sm">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </Button>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${
                activeCategory === category 
                  ? "bg-forest text-white" 
                  : "bg-forest-card text-forest-muted border border-forest-border hover:border-slate-300 hover:bg-[#181A15]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full bg-forest-card rounded-3xl border border-forest-border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-forest-card/90 text-forest-beige backdrop-blur-sm border-0 font-medium hover:bg-forest-card px-3 py-1">
                      {project.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#829661] mb-3">
                    <Building2 className="w-4 h-4" />
                    {project.org}
                  </div>
                  
                  <h3 className="font-bold text-xl text-forest-beige mb-4 line-clamp-2 group-hover:text-[#829661] transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-sm text-forest-muted">
                      <MapPin className="w-4 h-4 text-[#7A8072] shrink-0" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-forest-muted">
                      <Clock className="w-4 h-4 text-[#7A8072] shrink-0" />
                      Apply by {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-forest-muted">Volunteers Needed</span>
                      <span className="text-forest-beige">{project.volunteersApplied} / {project.volunteersNeeded}</span>
                    </div>
                    <div className="h-2 w-full bg-[#1E211A] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${project.volunteersApplied >= project.volunteersNeeded ? 'bg-amber-500' : 'bg-forest-accent'}`} 
                        style={{ width: `${Math.min((project.volunteersApplied / project.volunteersNeeded) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>

                  <Link href="/login" className="block w-full">
                    <Button 
                      className="w-full h-12 rounded-xl text-base font-medium"
                      variant={project.volunteersApplied >= project.volunteersNeeded ? "outline" : "default"}
                      disabled={project.volunteersApplied >= project.volunteersNeeded}
                    >
                      {project.volunteersApplied >= project.volunteersNeeded ? 'Project Full' : 'Sign in to Apply'}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1E211A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#7A8072]" />
            </div>
            <h3 className="text-xl font-bold text-forest-beige mb-2">No projects found</h3>
            <p className="text-forest-muted">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ExplorePublicContent />
    </Suspense>
  );
}
