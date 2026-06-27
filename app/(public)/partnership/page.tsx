"use client";

import React from "react";
import { motion } from "framer-motion";
import { Handshake, Globe, Target, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const PARTNERSHIP_TIERS = [
  {
    title: "Corporate Partner",
    description: "Align your brand with impactful social and environmental projects. Engage your employees in corporate volunteering programs.",
    icon: Building2,
    benefits: [
      "Custom CSR campaign creation",
      "Employee volunteering tracking",
      "Impact reports and analytics",
      "Brand visibility across JALA VIVE"
    ]
  },
  {
    title: "NGO / Non-Profit",
    description: "Amplify your reach and connect with dedicated volunteers ready to support your noble causes.",
    icon: Globe,
    benefits: [
      "Priority volunteer matching",
      "Advanced project management tools",
      "Community broadcast features",
      "Donation integration (Coming Soon)"
    ]
  },
  {
    title: "Community Partner",
    description: "For local communities and universities looking to organize and manage their own impact initiatives.",
    icon: Target,
    benefits: [
      "Private community groups",
      "Event scheduling tools",
      "Digital certificates for members",
      "Dedicated support channel"
    ]
  }
];

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-[#131511]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Background Base */}
        <div className="absolute inset-0 bg-[#0B0C0A] -z-20" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        {/* Radial Gradients & Blurred Shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(130,150,97,0.15),transparent_50%)] -z-10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] md:w-[800px] md:h-[400px] bg-emerald-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-[800px] w-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mt-[-60px]">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="flex flex-col items-center gap-6"
          >
            <motion.div variants={fadeIn}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                PARTNERSHIP
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <h1 className="text-[44px] sm:text-[56px] md:text-[72px] font-bold text-white tracking-tight leading-[100%]">
                Amplify Your Impact <br className="hidden sm:block" />
                with <span className="text-forest-accent drop-shadow-sm">JALA VIVE</span>
              </h1>
            </motion.div>
            
            <motion.div variants={fadeIn} className="max-w-[650px] mx-auto">
              <p className="text-[18px] md:text-[20px] text-gray-400 leading-[170%]">
                Join forces with us to build a more sustainable and caring world. Whether you're a corporation, NGO, or university, we have the right tools to scale your initiatives.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
              <Link href="/register?role=organization" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.03 }} className="w-full">
                    <Button className="w-full sm:w-auto h-[52px] px-8 rounded-[16px] bg-forest-accent hover:bg-[#4A5D23] text-white text-[16px] font-semibold shadow-lg shadow-forest-accent/20 transition-colors">
                      Become a Partner
                    </Button>
                  </motion.div>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.03 }} className="w-full">
                    <Button variant="ghost" className="w-full sm:w-auto h-[52px] px-8 rounded-[16px] border border-white/10 hover:bg-white/5 text-white text-[16px] font-semibold transition-colors">
                      Explore Projects
                    </Button>
                  </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-24 bg-[#181A15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-forest-beige tracking-tight">
              Partnership Opportunities
            </h2>
            <p className="text-forest-muted text-lg">
              Choose the tier that best fits your organization's goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-forest-card p-8 rounded-3xl shadow-sm shadow-forest-border/20 border border-forest-border hover:-translate-y-2 transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#2A2F22] text-[#829661] flex items-center justify-center mb-6">
                  <tier.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-forest-beige mb-3">{tier.title}</h3>
                <p className="text-forest-muted leading-relaxed mb-8 flex-1">{tier.description}</p>
                
                <div className="space-y-3 mb-8">
                  <p className="text-sm font-semibold text-forest-beige uppercase tracking-wider">Benefits:</p>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#DFD5C2]">
                        <span className="text-[#829661] mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/register?role=organization" className="w-full">
                  <Button variant="outline" className="w-full border-forest-border hover:bg-[#1E211A] text-forest-beige">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-forest-card">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-accent/10 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-forest-beige leading-tight">
            Ready to collaborate?
          </h2>
          <p className="text-lg text-forest-muted">
            Let's discuss how we can work together to maximize your social impact.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/register?role=organization">
              <Button className="h-14 px-8 rounded-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige text-lg font-semibold shadow-lg shadow-forest-accent/20 transition-all gap-2">
                Contact Our Team <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
