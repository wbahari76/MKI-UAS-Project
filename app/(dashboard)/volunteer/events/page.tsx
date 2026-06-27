"use client";

import React, { useState } from "react";
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

// Mock data
const EVENTS = [
  {
    id: 1,
    title: "Coastal Cleanup Initiative",
    org: "Ocean Care ID",
    status: "upcoming",
    date: "2026-07-20",
    time: "07:00 AM - 12:00 PM",
    location: "Kuta Beach, Bali",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80",
    category: "Environment"
  },
  {
    id: 2,
    title: "Digital Literacy for Elders",
    org: "Tech for All",
    status: "completed",
    date: "2026-06-15",
    time: "09:00 AM - 02:00 PM",
    location: "Community Center, Jakarta",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    category: "Education"
  }
];

export default function MyEventsPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Events</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming and past volunteer activities.</p>
        </div>
        <Link href="/volunteer/explore">
          <Button className="btn-primary">Find New Events</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <Tabs defaultValue="upcoming" className="w-full sm:w-[400px]" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search events..." 
            className="pl-9 bg-slate-50 border-0 focus-visible:ring-emerald-500"
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
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} events found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {activeTab === 'upcoming' 
                ? "You haven't joined any upcoming events yet. Explore opportunities and make an impact today!"
                : "You don't have any completed events yet."}
            </p>
            {activeTab === 'upcoming' && (
              <Link href="/volunteer/explore">
                <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                  Explore Opportunities
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-slate-900 border-0 hover:bg-white backdrop-blur-sm">
                        {event.category}
                      </Badge>
                    </div>
                    {event.status === 'completed' && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-emerald-500 text-white border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">{event.org}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-slate-600">
                        <CalendarDays className="w-4 h-4 mr-2 text-emerald-500" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                        {event.location}
                      </div>
                    </div>
                    
                    <Link href={`/volunteer/explore/${event.id}`}>
                      <Button className="w-full bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                        View Details
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
