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
    <div className="min-h-screen bg-canvas pb-20 pt-12">
      <div className="container-custom space-y-10">
        {/* Header Section */}
        <div className="max-w-2xl">
          <span className="mews-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-bubblegum" />
            Open projects
          </span>
          <h1 className="mews-display mt-4 text-4xl text-ink md:text-5xl text-balance">
            Explore open projects
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-charcoal">
            Find the perfect cause to contribute your skills and time. Discover volunteering
            opportunities from organizations worldwide.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fog" />
            <Input
              placeholder="Search projects or organizations..."
              className="h-14 rounded-full border-lilac bg-cream pl-12 text-base text-ink placeholder:text-fog focus-visible:ring-bubblegum"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-14 rounded-full border-ink bg-transparent px-8 text-ink hover:bg-ink hover:text-canvas">
            <Filter className="mr-2 h-5 w-5" />
            Filter
          </Button>
        </div>

        {/* Categories */}
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all ${
                activeCategory === category
                  ? "bg-bubblegum text-ink"
                  : "border border-lilac bg-cream text-charcoal hover:bg-blush hover:text-ink"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-bubblegum"></div>
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const applied = project.volunteer_count || 0;
              const needed = project.volunteer_needed || 1;
              const isFull = applied >= needed;
              const image = project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=600&q=80";

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.06, 0.3) }}
                  whileHover={{ y: -4 }}
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded border border-lilac bg-cream">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Link href={`/explore/${project.id}`}>
                        <img
                          src={image}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>
                      <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-canvas px-3 py-1 text-[12px] font-semibold text-ink">
                          {project.category || 'General'}
                        </span>
                        {project.is_paid && (
                          <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[12px] font-bold text-ink">
                            Paid
                          </span>
                        )}
                      </div>

                      {project.status === 'completed' && (
                        <div className="pointer-events-none absolute right-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-ice px-3 py-1 text-[12px] font-semibold text-ink">
                            Completed
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-bubblegum">
                        <Building2 className="h-4 w-4" />
                        {project.organizations?.name || 'Organization'}
                      </div>

                      <Link href={`/explore/${project.id}`}>
                        <h3 className="mb-4 line-clamp-2 text-[20px] font-bold leading-snug text-ink transition-colors hover:text-bubblegum">
                          {project.title}
                        </h3>
                      </Link>

                      <div className="mb-6 flex-1 space-y-3">
                        <div className="flex items-center gap-3 text-[14px] text-charcoal">
                          <MapPin className="h-4 w-4 shrink-0 text-fog" />
                          <span className="line-clamp-1">{project.location || 'Remote'}</span>
                        </div>
                        {project.deadline && (
                          <div className="flex items-center gap-3 text-[14px] text-charcoal">
                            <Clock className="h-4 w-4 shrink-0 text-fog" />
                            Apply by {new Date(project.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="mb-6 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[13px] font-medium">
                          <span className="text-charcoal">Volunteers needed</span>
                          <span className="font-semibold text-ink">{applied} / {needed}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-blush/60">
                          <div
                            className={`h-full rounded-full ${isFull ? 'bg-lime' : 'bg-bubblegum'}`}
                            style={{ width: `${Math.min((applied / needed) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {user ? (
                        <Link href={`/${profile?.role || 'volunteer'}/explore/${project.id}`} className="block w-full">
                          <button
                            className={`h-12 w-full rounded-full text-[14px] font-bold transition-all ${isFull ? 'cursor-not-allowed border border-mist text-fog' : 'bg-bubblegum text-ink hover:-translate-y-0.5'}`}
                            disabled={isFull}
                          >
                            {isFull ? 'Project Full' : 'Apply Now'}
                          </button>
                        </Link>
                      ) : (
                        <Link href="/login" className="block w-full">
                          <button
                            className={`h-12 w-full rounded-full text-[14px] font-bold transition-all ${isFull ? 'cursor-not-allowed border border-mist text-fog' : 'bg-bubblegum text-ink hover:-translate-y-0.5'}`}
                            disabled={isFull}
                          >
                            {isFull ? 'Project Full' : 'Sign in to Apply'}
                          </button>
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
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blush">
              <FolderKanban className="h-10 w-10 text-ink" />
            </div>
            <h3 className="mb-2 text-[20px] font-bold text-ink">No projects found</h3>
            <p className="text-charcoal">
              Try adjusting your search or filters to find what you&apos;re looking for.
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
