"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Award, Globe, Users, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-20 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wider uppercase mb-4">
              Our Impact
            </span>
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
            { label: "Total Volunteers", value: "24,500+", icon: Users, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-100" },
            { label: "Projects Completed", value: "1,240", icon: Award, color: "text-[#829661]", bg: "bg-[#2C3322]", border: "border-emerald-100" },
            { label: "Communities Served", value: "350+", icon: Globe, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-100" },
            { label: "Total Impact Hours", value: "1.2M", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-100" }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className={`border ${stat.border} shadow-sm shadow-slate-200 hover:shadow-md transition-all`}>
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
        <div className="bg-forest-card rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-forest-border mb-24 relative overflow-hidden">
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
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-[#DFD5C2]">
                      <span>{item.title}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-[#1E211A] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${item.color} rounded-full`} 
                      />
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
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80" 
                  alt="Environmental impact" 
                  className="rounded-3xl shadow-lg object-cover aspect-square w-full"
                />
                <img 
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80" 
                  alt="Community impact" 
                  className="rounded-3xl shadow-lg object-cover aspect-square w-full mt-8"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl font-bold text-forest-beige">Be Part of the Next Million Hours</h2>
          <p className="text-forest-muted text-lg">
            Whether you have 2 hours a week or 2 hours a month, your contribution adds up to a massive global impact.
          </p>
          <div className="pt-4">
            <Link href="/register">
              <Button className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg shadow-blue-500/20 transition-all">
                Start Volunteering Today
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
