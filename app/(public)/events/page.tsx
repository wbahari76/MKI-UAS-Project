"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PUBLIC_EVENTS = [
  {
    id: 1,
    title: "Global Coastal Cleanup 2026",
    organization: "OceanSavers Network",
    date: "Aug 15, 2026",
    time: "07:00 AM - 12:00 PM",
    location: "Multiple Coastal Cities",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80",
    spotsLeft: 45
  },
  {
    id: 2,
    title: "Tech Mentorship Bootcamp",
    organization: "Future Coders Foundation",
    date: "Sep 01, 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Virtual Event",
    category: "Education",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    spotsLeft: 12
  },
  {
    id: 3,
    title: "Community Food Drive & Distribution",
    organization: "Urban Relief",
    date: "Sep 10, 2026",
    time: "08:00 AM - 02:00 PM",
    location: "Downtown Community Center",
    category: "Social Relief",
    image: "https://images.unsplash.com/photo-1593113563332-e14b58e7279b?auto=format&fit=crop&w=800&q=80",
    spotsLeft: 5
  },
  {
    id: 4,
    title: "Reforestation Project: Green Canopy",
    organization: "Earth Guardians",
    date: "Oct 05, 2026",
    time: "06:30 AM - 03:00 PM",
    location: "National Park Reserve",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    spotsLeft: 28
  },
];

export default function PublicEventsPage() {
  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-forest-accent/10 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block py-1 px-3 rounded-full bg-[#2C3322] text-[#829661] text-sm font-semibold tracking-wider uppercase mb-4">
              Upcoming Events
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-forest-beige tracking-tight leading-tight">
              Find Meaningful <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Opportunities</span>
            </h1>
            <p className="text-lg text-forest-muted mt-4">
              Discover and join community events, workshops, and volunteering activities happening around you or online.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-forest-card p-4 rounded-2xl shadow-sm border border-forest-border mb-12 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
            <Input 
              placeholder="Search for events, organizations, or causes..." 
              className="pl-12 h-12 bg-[#181A15] border-0 focus-visible:ring-forest-accent rounded-xl text-base"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-12 px-6 rounded-xl border-forest-border text-forest-muted hover:bg-[#181A15]">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
            <Button className="h-12 px-8 rounded-xl bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige font-medium">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {PUBLIC_EVENTS.map((event) => (
            <motion.div 
              key={event.id} 
              variants={fadeInUp}
              className="group bg-forest-card rounded-3xl overflow-hidden border border-forest-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Event Image */}
              <div className="sm:w-2/5 relative overflow-hidden h-64 sm:h-auto">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-forest-card/90 backdrop-blur-sm text-forest-beige border-0 font-medium">
                    {event.category}
                  </Badge>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#829661] mb-2">
                    {event.organization}
                  </div>
                  <h3 className="text-xl font-bold text-forest-beige mb-4 line-clamp-2 group-hover:text-[#829661] transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-forest-muted">
                      <Calendar className="w-4 h-4 mr-3 text-[#7A8072]" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-forest-muted">
                      <Clock className="w-4 h-4 mr-3 text-[#7A8072]" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-forest-muted">
                      <MapPin className="w-4 h-4 mr-3 text-[#7A8072]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-forest-border">
                  <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                    {event.spotsLeft} spots left
                  </span>
                  <Link href="/register">
                    <Button variant="ghost" className="text-[#829661] hover:text-[#829661] hover:bg-[#21261B] rounded-full px-4">
                      Join Event <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-full h-12 px-8 border-forest-border text-forest-muted hover:bg-[#181A15]">
            Load More Events
          </Button>
        </div>

      </div>
    </div>
  );
}
