"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, Users, Building2, Heart, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase/client";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

import { useAuth } from "@/contexts/AuthContext";

function ExplorePublicContent() {
  const { user, profile } = useAuth();
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

    const channel = supabase
      .channel('projects_changes_public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.organizations?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-forest-accent/10 to-transparent -z-10" />

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
              className="pl-12 h-14 rounded-full border-forest-border bg-forest-card focus-visible:ring-forest-accent shadow-sm text-base"
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
                  ? "bg-forest text-forest-beige" 
                  : "bg-forest-card text-forest-muted border border-forest-border hover:border-[#38402D] hover:bg-[#181A15]"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredProjects.map((project, index) => {
              const applied = project.volunteer_count || 0;
              const needed = project.volunteer_needed || 1;
              const isFull = applied >= needed;
              const image = project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=600&q=80";

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="h-full bg-forest-card rounded-3xl border border-forest-border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Link href={`/explore/${project.id}`}>
                        <img 
                          src={image} 
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                        <Badge className="bg-forest-card/90 text-forest-beige backdrop-blur-sm border-0 font-medium hover:bg-forest-card px-3 py-1">
                          {project.category || 'General'}
                        </Badge>
                        {project.is_paid && (
                          <Badge className="bg-amber-500/90 text-amber-950 backdrop-blur-sm border-0 font-bold hover:bg-amber-500 px-3 py-1">
                            Paid
                          </Badge>
                        )}
                      </div>
                      
                      {project.status === 'completed' && (
                        <div className="absolute top-4 right-4 pointer-events-none">
                          <Badge className="bg-blue-500 text-white border-0 font-medium px-3 py-1">
                            Completed
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#829661] mb-3">
                        <Building2 className="w-4 h-4" />
                        {project.organizations?.name || 'Organization'}
                      </div>
                      
                      <Link href={`/explore/${project.id}`}>
                        <h3 className="font-bold text-xl text-forest-beige mb-4 line-clamp-2 hover:text-forest-accent transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center gap-3 text-sm text-forest-muted">
                          <MapPin className="w-4 h-4 text-[#7A8072] shrink-0" />
                          <span className="line-clamp-1">{project.location || 'Remote'}</span>
                        </div>
                        {project.deadline && (
                          <div className="flex items-center gap-3 text-sm text-forest-muted">
                            <Clock className="w-4 h-4 text-[#7A8072] shrink-0" />
                            Apply by {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span className="text-forest-muted">Volunteers Needed</span>
                          <span className="text-forest-beige">{applied} / {needed}</span>
                        </div>
                        <div className="h-2 w-full bg-[#1E211A] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-forest-accent'}`} 
                            style={{ width: `${Math.min((applied / needed) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>

                      {user ? (
                        <Link href={`/${profile?.role || 'volunteer'}/explore/${project.id}`} className="block w-full">
                          <Button 
                            className="w-full h-12 rounded-xl text-base font-medium"
                            variant={isFull ? "outline" : "default"}
                            disabled={isFull}
                          >
                            {isFull ? 'Project Full' : 'Apply Now'}
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/login" className="block w-full">
                          <Button 
                            className="w-full h-12 rounded-xl text-base font-medium"
                            variant={isFull ? "outline" : "default"}
                            disabled={isFull}
                          >
                            {isFull ? 'Project Full' : 'Sign in to Apply'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#1E211A] rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-10 h-10 text-[#7A8072]" />
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
