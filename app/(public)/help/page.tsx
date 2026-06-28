"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, HelpCircle, FileText, MessageSquare, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    title: "FAQ",
    description: "Find answers to frequently asked questions.",
    icon: HelpCircle,
    href: "/help#faq",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Contact Support",
    description: "Submit a ticket for technical issues or inquiries.",
    icon: MessageSquare,
    href: "/help/submit", // Requires auth, we can redirect or protect it
    color: "text-forest-accent",
    bg: "bg-forest-accent/10",
  },
  {
    title: "Report Bug",
    description: "Found something broken? Let us know.",
    icon: AlertTriangle,
    href: "/help/submit?category=Bug",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    title: "Report User/Organization",
    description: "Report inappropriate behavior securely.",
    icon: ShieldCheck,
    href: "/help/submit?category=Report",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    title: "Terms & Conditions",
    description: "Read our platform's terms of service.",
    icon: FileText,
    href: "/terms",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Privacy Policy",
    description: "Learn how we protect your data.",
    icon: ShieldCheck,
    href: "/privacy",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  }
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-forest pt-24 pb-20">
      <div className="container-custom space-y-12">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-forest-beige tracking-tight"
          >
            How can we help you?
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-muted" />
            <Input 
              placeholder="Search for articles, questions, or guides..." 
              className="pl-12 h-14 bg-forest-card border-forest-border text-lg rounded-2xl focus-visible:ring-forest-accent focus-visible:border-forest-accent"
            />
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {CATEGORIES.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
            >
              <Link href={category.href}>
                <Card className="h-full bg-forest-card border-forest-border hover:border-forest-accent/50 transition-colors group cursor-pointer shadow-none hover:shadow-lg hover:shadow-forest-accent/5">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${category.bg}`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <CardTitle className="text-xl text-forest-beige group-hover:text-forest-accent transition-colors flex items-center justify-between">
                      {category.title}
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-forest-muted">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Popular FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto pt-16">
          <h2 className="text-3xl font-bold text-forest-beige mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I create an organization account?", a: "You can create an organization account by clicking 'Sign Up' and selecting the 'Organization' role. You will need to verify your organization's legal documents." },
              { q: "Are volunteer applications free?", a: "Yes, volunteering is always 100% free. Organizations can also use the platform for free up to certain limits." },
              { q: "How do I track my volunteer hours?", a: "Once a project is marked as 'completed' by the organization, your volunteer hours will automatically be credited to your profile." },
              { q: "What happens if I need to cancel my attendance?", a: "Please notify the organization at least 24 hours in advance by withdrawing your application in the 'My Events' dashboard." },
            ].map((faq, idx) => (
              <Card key={idx} className="bg-forest-card border-forest-border">
                <CardHeader>
                  <CardTitle className="text-lg text-forest-beige">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#DFD5C2]">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
