"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Clock, Users, Building2, Heart, FolderKanban, Wallet, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

function ExploreContent() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
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
      .channel('projects_changes')
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            {t("explore.title", "Explore Programs")}
          </h1>
          <p className="text-forest-muted mt-1">
            {t("explore.desc", "Find and join volunteer opportunities that match your interests.")}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input 
            placeholder={t("explore.search", "Search by name or location...")}
            className="pl-9 bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="bg-[#181A15] border-forest-border">
              <SelectValue placeholder={t("explore.all_categories", "All Categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("explore.all_categories", "All Categories")}</SelectItem>
              {CATEGORIES.filter(c => c !== "All").map((cat, idx) => (
                <SelectItem key={idx} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                    <Link href={`/volunteer/explore/${project.id}`}>
                      <img 
                        src={image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
                      <Badge className="bg-forest-card/90 text-forest-beige backdrop-blur-sm border-0 font-medium">
                        {project.category || 'General'}
                      </Badge>
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-forest-card/90 backdrop-blur-sm rounded-full text-forest-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 z-10">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#829661] mb-2">
                      <Building2 className="w-3.5 h-3.5" />
                      {project.organizations?.name || 'Organization'}
                    </div>
                    
                    <Link href={`/volunteer/explore/${project.id}`}>
                      <h3 className="font-semibold text-lg text-forest-beige mb-3 line-clamp-2 hover:text-forest-accent transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    
                    <div className="space-y-2.5 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-forest-muted">
                        <Users className="w-4 h-4" />
                        <span>{applied} / {needed} {t("explore.joined", "Joined")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-forest-muted">
                        {project.is_paid ? (
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                            <Wallet className="w-4 h-4" />
                            Rp {project.registration_fee?.toLocaleString('id-ID')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <HeartHandshake className="w-4 h-4" />
                            {t("projects.type_free", "Gratis")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-forest-border/50">
                      <Link href={`/volunteer/explore/${project.id}`}>
                        <Button className="w-full bg-forest-accent hover:bg-forest-accent/90 text-forest-card font-medium transition-all group-hover:shadow-[0_0_20px_rgba(223,213,194,0.3)]">
                          {t("explore.view_details", "View Details")}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {!loading && filteredProjects.length === 0 && (
        <div className="col-span-full py-12 text-center text-forest-muted bg-[#181A15] rounded-2xl border border-forest-border">
          {t("explore.no_programs", "No programs found matching your search.")}
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
