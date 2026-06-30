"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase/client";

const CATEGORIES = ["All", "Environment", "Education", "Health", "Animal Welfare", "Community"];

export default function PublicEventsPage() {
  const { t } = useTranslation("common");
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*, organizations(name)')
          .eq('status', 'published')
          .eq('project_type', 'event_staff')
          .order('start_date', { ascending: true }); // sort by start date for events

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.organizations?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-forest-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-0 w-1/2 h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-forest-beige tracking-tight">
            {t("events.title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#829661] to-emerald-500">{t("events.title_highlight")}</span>
          </h1>
          <p className="text-lg text-forest-muted">
            {t("events.desc")}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
            <Input 
              placeholder={t("events.search_placeholder")} 
              className="pl-12 h-14 rounded-full border-forest-border bg-forest-card focus-visible:ring-forest-accent shadow-sm text-base"
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
                  ? "bg-forest-accent text-forest-beige" 
                  : "bg-forest-card text-forest-muted border border-forest-border hover:border-[#38402D] hover:bg-[#1E211A]"
              }`}
            >
              {category === "All" ? t("landing.categories.All", { defaultValue: "All" }) : t(`landing.categories.${category}`, { defaultValue: category })}
            </button>
          ))}
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto pt-4">
            {filteredEvents.map((event, index) => {
              const applied = event.volunteer_count || 0;
              const needed = event.volunteer_needed || 1;
              const spotsLeft = Math.max(needed - applied, 0);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-forest-card rounded-3xl border border-forest-border overflow-hidden group hover:shadow-xl hover:shadow-forest-accent/5 transition-all duration-300 flex flex-col md:flex-row"
                >
                  <div className="relative md:w-1/3 h-56 md:h-auto overflow-hidden">
                    <img 
                      src={event.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80"} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-forest-card/90 text-forest-beige backdrop-blur-sm border-0 font-medium hover:bg-forest-card">
                        {event.category || 'General'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[#829661] mb-2 uppercase tracking-wider">
                        {event.organizations?.name || 'Organization'}
                      </div>
                      <Link href={`/explore/${event.id}`}>
                        <h3 className="font-bold text-2xl text-forest-beige mb-4 group-hover:text-forest-accent transition-colors">
                          {event.title}
                        </h3>
                      </Link>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 text-forest-muted">
                          <div className="w-10 h-10 rounded-full bg-[#181A15] border border-forest-border flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#829661]" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider mb-0.5">{t("events.date")}</p>
                            <p className="text-sm text-forest-beige">{event.start_date ? new Date(event.start_date).toLocaleDateString() : t("events.tba", "TBA")}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-forest-muted">
                          <div className="w-10 h-10 rounded-full bg-[#181A15] border border-forest-border flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#829661]" />
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider mb-0.5">{t("events.location")}</p>
                            <p className="text-sm text-forest-beige line-clamp-1">{event.location || t("events.remote", "Remote")}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-forest-border">
                      <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                        {spotsLeft} {t("events.spots_left")}
                      </span>
                      <Link href={`/explore/${event.id}`}>
                        <Button variant="ghost" className="text-[#829661] hover:text-[#829661] hover:bg-[#21261B] rounded-full px-4">
                          {t("events.view_event")} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-20 text-forest-muted">
            {t("events.no_events")}
          </div>
        )}
      </div>
    </div>
  );
}
