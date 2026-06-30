"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Award, Globe, Users, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ImpactPage() {
  const [stats, setStats] = useState({
    volunteers: "0",
    projects: "0",
    communities: "0",
    hours: "1.2M", // Hardcoded mock since there is no time-tracking table yet
  });

  useEffect(() => {
    async function fetchImpactStats() {
      try {
        // Fetch Total Volunteers
        const { count: volunteersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'volunteer');

        // Fetch Projects Completed
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed');

        // Fetch Communities Served (number of distinct organizations)
        const { count: orgsCount } = await supabase
          .from('organizations')
          .select('*', { count: 'exact', head: true });

        setStats({
          volunteers: (volunteersCount || 0).toLocaleString() + "+",
          projects: (projectsCount || 0).toLocaleString(),
          communities: (orgsCount || 0).toLocaleString() + "+",
          hours: "1.2M", // To be implemented in the future
        });
      } catch (error) {
        console.error("Error fetching impact stats:", error);
      }
    }

    fetchImpactStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-forest-accent/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>

            <h1 className="text-4xl md:text-6xl font-extrabold text-forest-beige tracking-tight leading-tight">
              Measuring What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Matters</span>
            </h1>
            <p className="text-lg md:text-xl text-forest-muted leading-relaxed mt-6">
              At JALA VIVE, we track our collective impact to ensure that every hour volunteered translates into real, measurable change for communities worldwide.
            </p>
          </motion.div>
        </div>

        {/* Big Numbers Grid */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {[
            { label: "Total Volunteers", value: stats.volunteers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-100" },
            { label: "Projects Completed", value: stats.projects, icon: Award, color: "text-[#829661]", bg: "bg-[#2C3322]", border: "border-[#2C3322]" },
            { label: "Communities Served", value: stats.communities, icon: Globe, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-100" },
            { label: "Total Impact Hours", value: stats.hours, icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-100" }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className={`border ${stat.border} shadow-sm shadow-forest-border/20 hover:shadow-md transition-all h-full`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon size={24} />
                  </div>
                  <h3 className="text-4xl font-extrabold text-forest-beige mb-2">{stat.value}</h3>
                  <p className="text-forest-muted font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Impact Report */}
        <div className="bg-forest-card rounded-3xl p-8 md:p-12 shadow-xl shadow-forest-border/20/50 border border-forest-border mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full -z-10" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-forest-beige mb-4">Real Time Transparency</h2>
                <p className="text-forest-muted text-lg leading-relaxed">
                  We believe in radical transparency. Every project listed on our platform requires organizations to report on the outcomes, ensuring that volunteer efforts are always accounted for.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Environmental Preservation", percentage: 45, color: "bg-forest-accent" },
                  { title: "Education & Mentorship", percentage: 30, color: "bg-blue-500" },
                  { title: "Community Development", percentage: 25, color: "bg-amber-500" }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-forest-beige">{item.title}</span>
                      <span className="text-forest-muted">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#1E211A] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Decorative Earth/Globe visualization placeholder */}
                <div className="absolute inset-0 rounded-full border-4 border-[#1E211A] animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#2A2F22] animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="w-32 h-32 text-forest-accent/50" strokeWidth={1} />
                </div>
                
                {/* Floating stat chips */}
                <div className="absolute top-1/4 -left-4 bg-[#181A15] border border-forest-border p-3 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Heart size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-forest-beige">1M+ Lives</div>
                    <div className="text-xs text-forest-muted">Positively Impacted</div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 -right-4 bg-[#181A15] border border-forest-border p-3 rounded-2xl shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-forest-beige">40% Growth</div>
                    <div className="text-xs text-forest-muted">Year over Year</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-forest-beige mb-4">Be Part of the Impact</h3>
          <p className="text-forest-muted mb-8">
            Every volunteer matters. Join thousands of others who are already making a difference in their communities.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button className="h-12 px-8 rounded-full bg-forest-accent hover:bg-forest-accent/90 text-white font-semibold">
                Start Volunteering
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="h-12 px-8 rounded-full border-forest-border hover:bg-[#1E211A] text-forest-beige">
                Explore Projects
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
