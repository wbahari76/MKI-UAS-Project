"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, Users, Building2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

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

function ExploreContent() {
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Explore Projects
          </h1>
          <p className="text-slate-500 mt-1">
            Find the perfect cause to contribute your skills and time.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Search projects or organizations..." 
            className="pl-10 h-12 rounded-xl focus-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200">
          <Filter className="w-5 h-5 mr-2 text-slate-500" />
          Advanced Filter
        </Button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === category 
                ? "bg-slate-900 text-white" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-sm shadow-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm hover:bg-white">
                    {project.category}
                  </Badge>
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-600 hover:text-red-500 transition-colors">
                  <Heart className={`w-4 h-4 ${project.isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
              
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                  <Building2 className="w-4 h-4" />
                  {project.org}
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {project.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Apply by {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-1 mb-6">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-500">Volunteers</span>
                    <span className="text-slate-900">{project.volunteersApplied} / {project.volunteersNeeded}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.volunteersApplied >= project.volunteersNeeded ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((project.volunteersApplied / project.volunteersNeeded) * 100, 100)}%` }} 
                    />
                  </div>
                </div>

                <Link href={`/volunteer/explore/${project.id}`} className="block w-full">
                  <Button 
                    className="w-full btn-outline"
                    disabled={project.volunteersApplied >= project.volunteersNeeded}
                  >
                    {project.volunteersApplied >= project.volunteersNeeded ? 'Project Full' : 'View Details'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ExploreProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading explore...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
