"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Globe, Target, ArrowRight, Linkedin, Twitter, Mail } from "lucide-react";
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

const TEAM_MEMBERS = [
  {
    name: "Ardiansyah Putra",
    role: "CEO",
    description: "Memimpin visi dan strategi perusahaan untuk masa depan yang lebih berdampak.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bagas Pratama",
    role: "CTO",
    description: "Bertanggung jawab atas inovasi teknologi dan pengembangan produk digital.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Cindy Amelia",
    role: "CFO",
    description: "Mengelola keuangan perusahaan dan memastikan pertumbuhan yang berkelanjutan.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dimas Wijaya",
    role: "COO",
    description: "Mengoptimalkan operasional harian dan memastikan eksekusi strategi perusahaan.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Nadia Rahma",
    role: "CMO",
    description: "Mengembangkan brand dan strategi marketing untuk menjangkau lebih banyak orang.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rizky Maulana",
    role: "Head of Product",
    description: "Memastikan produk kami memberikan pengalaman terbaik dan solusi yang relevan.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Salsa Putri",
    role: "Head of Community",
    description: "Membangun komunitas yang kuat dan mendorong kolaborasi yang bermakna.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#181A15]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-accent/5 to-blue-500/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-forest-accent/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn}>
              <span className="inline-block py-1 px-3 rounded-full bg-[#2C3322] text-[#829661] text-sm font-semibold tracking-wider uppercase mb-4">
                Our Story
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-forest-beige tracking-tight leading-tight">
                Connecting Passion with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Purpose</span>
              </h1>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <p className="text-lg md:text-xl text-forest-muted leading-relaxed">
                JALA VIVE is a platform dedicated to bridging the gap between passionate volunteers and organizations driving real impact. We believe that everyone has the power to make a difference.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/register">
                <Button className="w-full sm:w-auto px-8 h-12 rounded-full bg-[#4A5D23] hover:bg-[#38402D] text-forest-beige text-base shadow-lg shadow-forest-accent/25 transition-all">
                  Join as Volunteer
                </Button>
              </Link>
              <Link href="/register?type=organization">
                <Button variant="outline" className="w-full sm:w-auto px-8 h-12 rounded-full border-forest-border hover:bg-[#181A15] text-[#DFD5C2] text-base transition-all">
                  Register Organization
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-forest-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-forest-beige">Our Mission</h2>
              <p className="text-forest-muted leading-relaxed text-lg">
                To empower communities by providing an accessible, transparent, and engaging platform for volunteering. We strive to simplify the process of finding meaningful causes, allowing people to focus on what truly matters: making an impact.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  { icon: Target, text: "Simplifying volunteer recruitment and management" },
                  { icon: Globe, text: "Fostering a global network of changemakers" },
                  { icon: Heart, text: "Celebrating every hour of community service" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-[#DFD5C2] font-medium">
                    <div className="w-10 h-10 rounded-full bg-[#21261B] flex items-center justify-center text-[#829661] shrink-0">
                      <item.icon size={20} />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-forest-accent to-teal-400 rounded-3xl transform rotate-3 scale-[1.02] opacity-20" />
              <img 
                src="https://images.unsplash.com/photo-1593113563332-e14b58e7279b?auto=format&fit=crop&w=1200&q=80" 
                alt="Volunteers working together"
                className="relative rounded-3xl shadow-xl object-cover aspect-[4/3] w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#181A15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-forest-beige mb-16">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Community First", 
                desc: "We prioritize the needs of the communities we serve above all else, ensuring our platform is inclusive and accessible.",
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-500/10"
              },
              { 
                title: "Transparency", 
                desc: "We believe in clear communication and honest reporting to build trust between volunteers and organizations.",
                icon: Globe,
                color: "text-[#829661]",
                bg: "bg-[#2C3322]"
              },
              { 
                title: "Impact Driven", 
                desc: "Every feature we build is designed to maximize the positive impact our users can have on the world.",
                icon: Target,
                color: "text-amber-400",
                bg: "bg-amber-500/10"
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-forest-card p-8 rounded-3xl shadow-sm shadow-forest-border/20 border border-forest-border hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mx-auto mb-6`}>
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-forest-beige mb-3">{value.title}</h3>
                <p className="text-forest-muted leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#181A15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-[#2C3322] text-[#829661] text-sm font-semibold tracking-wider uppercase">
              Our Team
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-forest-beige tracking-tight">
              The People Behind <span className="text-[#829661]">JALA VIVE</span>
            </h2>
            <p className="text-forest-muted text-lg leading-relaxed">
              Kami adalah sekelompok individu yang memiliki visi yang sama untuk menciptakan dampak positif melalui teknologi dan kolaborasi.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] bg-forest-card p-5 rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] border border-forest-border hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden mb-5 bg-[#1E211A] shrink-0">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-forest-beige">{member.name}</h3>
                  <p className="text-sm font-semibold text-forest-accent mb-3 tracking-wide">{member.role}</p>
                  <p className="text-sm text-forest-muted mb-6 line-clamp-2 leading-relaxed flex-1">
                    {member.description}
                  </p>
                  <div className="flex justify-center gap-3 mt-auto">
                    <button className="w-8 h-8 rounded-full bg-[#181A15] text-[#7A8072] hover:text-[#829661] hover:bg-[#21261B] flex items-center justify-center transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#181A15] text-[#7A8072] hover:text-[#829661] hover:bg-[#21261B] flex items-center justify-center transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[#181A15] text-[#7A8072] hover:text-[#829661] hover:bg-[#21261B] flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-forest-beige leading-tight">
            Ready to make a difference?
          </h2>
          <p className="text-lg text-[#EAE1D1]">
            Join thousands of volunteers and organizations already working together on JALA VIVE.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href="/register">
              <Button className="h-14 px-8 rounded-full bg-forest-accent hover:bg-forest-accent text-forest-beige text-lg font-semibold shadow-lg shadow-forest-accent/20 transition-all gap-2">
                Get Started Today <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
