"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Users, Target, ArrowRight } from "lucide-react";
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

const PUBLIC_COMMUNITIES = [
  {
    id: 1,
    name: "OceanSavers Network",
    focus: "Marine Conservation",
    location: "Global / Coastal Regions",
    members: "1,200+",
    activeProjects: 8,
    description: "Dedicated to preserving marine life and keeping our oceans clean through community-driven cleanup initiatives and educational programs.",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=800&q=80",
    logo: "O"
  },
  {
    id: 2,
    name: "Future Coders Foundation",
    focus: "Tech Education",
    location: "Remote / Virtual",
    members: "850+",
    activeProjects: 4,
    description: "Empowering the next generation of developers from underprivileged backgrounds by providing free mentorship and coding bootcamps.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    logo: "F"
  },
  {
    id: 3,
    name: "Urban Relief",
    focus: "Poverty Alleviation",
    location: "Metropolitan Areas",
    members: "3,400+",
    activeProjects: 12,
    description: "Providing essential supplies, food drives, and temporary shelter assistance to homeless and vulnerable populations in urban centers.",
    image: "https://images.unsplash.com/photo-1593113563332-e14b58e7279b?auto=format&fit=crop&w=800&q=80",
    logo: "U"
  },
  {
    id: 4,
    name: "Earth Guardians",
    focus: "Reforestation",
    location: "Southeast Asia",
    members: "2,100+",
    activeProjects: 6,
    description: "Working hands-on to combat deforestation by planting native tree species and rehabilitating damaged forest ecosystems.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    logo: "E"
  },
];

export default function PublicCommunitiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wider uppercase mb-4">
              Community Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discover Organizations <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Making an Impact</span>
            </h1>
            <p className="text-lg text-slate-600 mt-4">
              Connect with verified non-profits, NGOs, and community groups that align with your passions and values.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search organizations by name, focus area, or location..." 
              className="pl-12 h-12 bg-slate-50 border-0 focus-visible:ring-blue-500 rounded-xl text-base"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </Button>
            <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Communities Grid */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {PUBLIC_COMMUNITIES.map((community) => (
            <motion.div 
              key={community.id} 
              variants={fadeInUp}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Community Banner Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={community.image} 
                  alt={community.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
                    {community.logo}
                  </div>
                  <div>
                    <Badge className="bg-blue-500/80 hover:bg-blue-500 backdrop-blur-sm text-white border-0 font-medium mb-1">
                      {community.focus}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white line-clamp-1">
                      {community.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Community Details */}
              <div className="p-6">
                <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                  {community.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{community.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{community.members} Volunteers</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 col-span-2">
                    <Target className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{community.activeProjects} Active Projects</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Link href="/register">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4">
                      View Profile
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                      Join Community <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-full h-12 px-8 border-slate-200 text-slate-600 hover:bg-slate-50">
            View All Organizations
          </Button>
        </div>

        {/* Call to Action for Organizations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are you an organization?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join JALA VIVE to recruit passionate volunteers, manage your projects efficiently, and measure your impact in real-time.
          </p>
          <Link href="/register?type=organization">
            <Button className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-slate-50 text-lg font-semibold shadow-xl shadow-blue-900/20 transition-all">
              Register Your Organization
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
