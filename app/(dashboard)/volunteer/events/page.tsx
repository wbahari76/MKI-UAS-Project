"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, MapPin, Clock, ArrowUpRight, 
  CheckCircle2, Search, Filter, AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function MyEventsPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    async function fetchMyEvents() {
      if (!user) return;
      try {
        setLoading(true);
        // Fetch all applications for the current user
        const { data, error } = await supabase
          .from('project_applications')
          .select(`
            id,
            status,
            projects!inner (
              id,
              title,
              start_date,
              location,
              banner_url,
              category,
              organizations (
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data
        const formattedEvents = (data || []).map((app: any) => {
          const project = app.projects;
          
          // Determine if it's upcoming or completed
          // If the status is completed, or if start_date is in the past, maybe completed. 
          // But for now, we'll map status "completed" to completed tab, and "approved"/"pending" to upcoming.
          let computedStatus = "upcoming";
          if (app.status === 'completed' || app.status === 'certified') {
            computedStatus = "completed";
          } else if (app.status === 'rejected' || app.status === 'cancelled') {
             computedStatus = "cancelled"; // We might hide these or handle differently
          }

          return {
            id: project.id,
            appId: app.id,
            title: project.title,
            org: project.organizations?.name || "Organization",
            status: computedStatus,
            appStatus: app.status,
            date: project.start_date,
            time: "TBA", // Time is not in our standard schema, could fallback to TBA
            location: project.location || "Remote",
            image: project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80",
            category: project.category || "General"
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching my events:", error);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    }

    fetchMyEvents();
  }, [user]);

  const filteredEvents = events.filter(event => 
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.org.toLowerCase().includes(searchQuery.toLowerCase())) && 
    event.status === activeTab
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("events.title", "My Events")}</h1>
          <p className="text-forest-muted mt-1">{t("events.desc", "Manage your upcoming and past volunteer activities.")}</p>
        </div>
        <Link href="/volunteer/explore">
          <Button className="btn-primary">{t("explore.title", "Find New Events")}</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-forest-card p-4 rounded-2xl border border-forest-border shadow-sm">
        <Tabs defaultValue="upcoming" className="w-full sm:w-[400px]" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">{t("events.upcoming", "Upcoming")}</TabsTrigger>
            <TabsTrigger value="completed">{t("events.past", "Completed")}</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
          <Input 
            placeholder="Search events..." 
            className="pl-9 bg-[#181A15] border-0 focus-visible:ring-forest-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-[#181A15] rounded-full flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-[#7A8072]" />
              </div>
              <h3 className="text-xl font-bold text-forest-beige mb-2">{t("events.no_events", "No events found").replace("upcoming events", activeTab + " events")}</h3>
              <p className="text-forest-muted max-w-md mx-auto mb-6">
                {activeTab === 'upcoming' 
                  ? t("explore.no_programs", "You haven't joined any upcoming events yet. Explore opportunities and make an impact today!")
                  : "You don't have any completed events yet."}
              </p>
              {activeTab === 'upcoming' && (
                <Link href="/volunteer/explore">
                  <Button variant="outline" className="border-[#4A5D23] text-[#829661] hover:bg-[#21261B]">
                    {t("explore.title", "Explore Opportunities")}
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.appId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg shadow-forest-border/20 hover:shadow-xl transition-all duration-300 group">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-forest-card/90 text-forest-beige border-0 hover:bg-forest-card backdrop-blur-sm">
                          {event.category}
                        </Badge>
                        <Badge className={
                          event.appStatus === 'approved' ? 'bg-emerald-500/90' : 
                          event.appStatus === 'pending' ? 'bg-amber-500/90' : 'bg-forest-accent/90'
                        }>
                          {event.appStatus.charAt(0).toUpperCase() + event.appStatus.slice(1)}
                        </Badge>
                      </div>
                      {event.status === 'completed' && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-forest-accent text-forest-beige border-0">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {t("events.past", "Completed")}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-forest-beige mb-1 group-hover:text-[#829661] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-forest-muted mb-4">{event.org}</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-forest-muted">
                          <CalendarDays className="w-4 h-4 mr-2 text-forest-accent" />
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          }) : 'TBA'}
                        </div>
                        <div className="flex items-center text-sm text-forest-muted">
                          <Clock className="w-4 h-4 mr-2 text-forest-accent" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-forest-muted">
                          <MapPin className="w-4 h-4 mr-2 text-forest-accent" />
                          {event.location}
                        </div>
                      </div>
                      
                      <Link href={`/volunteer/explore/${event.id}`}>
                        <Button className="w-full bg-[#181A15] text-[#DFD5C2] hover:bg-[#21261B] hover:text-[#829661] transition-colors">
                          {t("explore.view_details", "View Event Details")}
                          <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
