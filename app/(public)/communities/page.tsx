"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Users, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase/client";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

export default function PublicCommunitiesPage() {
  const { t } = useTranslation("common");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('is_verified', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrganizations(data || []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, []);

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          org.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || org.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20">
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-blue-500/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-forest-beige tracking-tight">
            {t("communities.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">{t("communities.title_highlight")}</span>
          </h1>
          <p className="text-lg text-forest-muted">
            {t("communities.desc")}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
            <Input 
              placeholder={t("communities.search_placeholder")} 
              className="pl-12 h-14 rounded-full border-forest-border bg-forest-card focus-visible:ring-blue-500 shadow-sm text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${
                activeCategory === category 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "bg-forest-card text-forest-muted border border-forest-border hover:border-[#38402D] hover:bg-[#181A15]"
              }`}
            >
              {category === "All" ? t("landing.categories.All", { defaultValue: "All" }) : t(`landing.categories.${category}`, { defaultValue: category })}
            </button>
          ))}
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {filteredOrgs.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-forest-card rounded-3xl border border-forest-border overflow-hidden group hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="relative h-48 w-full overflow-hidden bg-[#1E211A]">
                  <img 
                    src={org.cover_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80"} 
                    alt={org.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181A15] via-[#181A15]/40 to-transparent" />
                  
                  {/* Logo overlay */}
                  <div className="absolute -bottom-6 left-6 w-20 h-20 rounded-2xl bg-[#181A15] border-4 border-[#181A15] overflow-hidden flex items-center justify-center shadow-lg">
                    {org.logo_url ? (
                      <img src={org.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-blue-400">{org.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-2xl text-forest-beige mb-1 group-hover:text-blue-400 transition-colors">
                        {org.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-forest-muted">
                        <MapPin className="w-4 h-4 text-[#7A8072]" />
                        {org.city || t("communities.indonesia", "Indonesia")}
                      </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-0">{org.category || 'General'}</Badge>
                  </div>
                  
                  <p className="text-forest-muted mb-6 line-clamp-3">
                    {org.description || t("communities.no_description", "No description provided.")}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#181A15] rounded-xl p-4 border border-forest-border flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-forest-muted font-medium mb-0.5">{t("communities.projects")}</p>
                        <p className="text-sm font-bold text-forest-beige">{org.total_projects || 0}</p>
                      </div>
                    </div>
                    <div className="bg-[#181A15] rounded-xl p-4 border border-forest-border flex items-center gap-3">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-xs text-forest-muted font-medium mb-0.5">{t("communities.volunteers")}</p>
                        <p className="text-sm font-bold text-forest-beige">{org.total_volunteers || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/explore?q=${org.name}`}>
                    <Button className="w-full h-12 rounded-xl bg-forest-beige text-forest-card hover:bg-white font-semibold">
                      {t("communities.view_projects")} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredOrgs.length === 0 && (
          <div className="text-center py-20 text-forest-muted">
            {t("communities.no_communities")}
          </div>
        )}
      </div>
    </div>
  );
}
