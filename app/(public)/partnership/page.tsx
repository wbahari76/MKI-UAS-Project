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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-accent/5 to-blue-500/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-forest-accent/20 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn}>
              <span className="inline-block py-1 px-3 rounded-full bg-[#2C3322] text-[#829661] text-sm font-semibold tracking-wider uppercase mb-4">
                Partnership
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-forest-beige tracking-tight leading-tight">
                Amplify Your Impact with <span className="text-[#829661]">JALA VIVE</span>
              </h1>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <p className="text-lg md:text-xl text-forest-muted leading-relaxed">
                Join forces with us to build a more sustainable and caring world. Whether you're a corporation, NGO, or university, we have the right tools to scale your initiatives.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex justify-center pt-4">
              <Link href="mailto:partners@jalavive.com">
                  <Button className="h-14 px-8 rounded-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige text-lg font-semibold shadow-lg shadow-forest-accent/20 transition-all gap-2">
                    <Handshake className="w-5 h-5" />
                    Become a Partner
                  </Button>
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
                
                <Button variant="outline" className="w-full border-forest-border hover:bg-[#1E211A] text-forest-beige">
                  Learn More
                </Button>
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
            <Link href="mailto:partners@jalavive.com">
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
