"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, Users, Building2, Heart, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase/client";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        // Fetch projects that are not draft
        const { data, error } = await supabase
          .from('projects')
          .select('*, organizations(name)')
          .neq('status', 'draft')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.organizations?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            Explore Projects
          </h1>
          <p className="text-forest-muted mt-1">
            Find the perfect cause to contribute your skills and time.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
          <Input 
            placeholder="Search projects or organizations..." 
            className="pl-10 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-forest-border bg-[#181A15] text-[#DFD5C2] hover:bg-[#21261B]">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              activeCategory === category 
                ? "bg-forest-accent text-forest-beige" 
                : "bg-[#181A15] text-forest-muted border border-forest-border hover:border-[#38402D]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const applied = project.volunteer_count || 0;
            const needed = project.volunteer_needed || 1;
            const isFull = applied >= needed;
            const image = project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=600&q=80";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-forest-border bg-forest-card overflow-hidden group hover:border-[#4A5D23] transition-colors flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-forest-card/90 text-forest-beige backdrop-blur-sm border-0 font-medium">
                        {project.category || 'General'}
                      </Badge>
                      {project.is_paid && (
                        <Badge className="bg-amber-500/90 text-amber-950 backdrop-blur-sm border-0 font-bold hover:bg-amber-500">
                          Paid
                        </Badge>
                      )}
                    </div>
                    {project.status === 'completed' && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-500 text-white border-0 font-medium">
                          Completed
                        </Badge>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-2 bg-forest-card/90 backdrop-blur-sm rounded-full text-forest-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#829661] mb-2">
                      <Building2 className="w-3.5 h-3.5" />
                      {project.organizations?.name || 'Organization'}
                    </div>
                    
                    <h3 className="font-semibold text-lg text-forest-beige mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="space-y-2.5 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-forest-muted">
                        <MapPin className="w-4 h-4 text-[#7A8072]" />
                        <span className="line-clamp-1">{project.location || 'Remote'}</span>
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-2 text-sm text-forest-muted">
                          <Clock className="w-4 h-4 text-[#7A8072]" />
                          Apply by {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-forest-muted">Volunteers</span>
                          <span className="text-forest-beige font-medium">{applied} / {needed}</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#1E211A] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-forest-accent'}`} 
                            style={{ width: `${Math.min((applied / needed) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 text-sm font-medium h-9" 
                          variant={isFull ? "outline" : "default"}
                          disabled={isFull}
                        >
                          {isFull ? 'Project Full' : 'Apply Now'}
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-forest-border hover:bg-[#181A15]">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-forest-card rounded-2xl border border-forest-border">
          <FolderKanban className="w-12 h-12 text-[#7A8072] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-forest-beige mb-2">No projects found</h3>
          <p className="text-forest-muted">
            Try adjusting your search criteria or explore other categories.
          </p>
        </div>
      )}
    </div>
  );
}

export default function VolunteerExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-forest-muted">Loading projects...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
