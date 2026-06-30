"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarDays, MapPin, Clock, ArrowUpRight, 
  CheckCircle2, Search, Filter, Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useTranslation } from "react-i18next";

// Mock data for organization's events
const EVENTS = [
  {
    id: 1,
    title: "Coastal Cleanup Initiative",
    status: "upcoming",
    date: "2026-07-20",
    time: "07:00 AM - 12:00 PM",
    location: "Kuta Beach, Bali",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80",
    category: "Environment",
    registeredVolunteers: 45
  },
  {
    id: 2,
    title: "Digital Literacy for Elders",
    status: "upcoming",
    date: "2026-08-15",
    time: "09:00 AM - 02:00 PM",
    location: "Community Center, Jakarta",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    category: "Education",
    registeredVolunteers: 12
  },
  {
    id: 3,
    title: "Tree Planting Day",
    status: "completed",
    date: "2026-06-15",
    time: "08:00 AM - 03:00 PM",
    location: "City Park, Bandung",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    category: "Environment",
    registeredVolunteers: 120
  }
];

export default function OrganizationEventsPage() {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredEvents = EVENTS.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    event.status === activeTab
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("events.title", "Manage Events")}</h1>
          <p className="text-forest-muted mt-1">{t("events.desc", "Organize and track your upcoming and past events.")}</p>
        </div>
        <Link href="/organization/projects/new">
          <Button className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            {t("projects.create_new", "Create New Event")}
          </Button>
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
                ? "You don't have any upcoming events scheduled. Create one to start engaging volunteers!"
                : "You don't have any completed events yet."}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/organization/projects/new">
                <Button variant="outline" className="border-[#4A5D23] text-[#829661] hover:bg-[#21261B]">
                  Create Event
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
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
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-forest-card/90 text-forest-beige border-0 hover:bg-forest-card backdrop-blur-sm">
                        {event.category}
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
                    <h3 className="text-xl font-bold text-forest-beige mb-4 group-hover:text-[#829661] transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-forest-muted">
                        <CalendarDays className="w-4 h-4 mr-2 text-forest-accent" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
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
                    
                    <div className="flex items-center justify-between border-t border-forest-border pt-4 mb-4">
                      <div className="text-sm">
                        <span className="font-semibold text-forest-beige">{event.registeredVolunteers}</span>
                        <span className="text-forest-muted ml-1">Volunteers</span>
                      </div>
                    </div>

                    <Link href={`/organization/projects`}>
                      <Button className="w-full bg-[#181A15] text-[#DFD5C2] hover:bg-[#21261B] hover:text-[#829661] transition-colors">
                        {t("projects.manage_projects", "Manage Event")}
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
    </div>
  );
}
