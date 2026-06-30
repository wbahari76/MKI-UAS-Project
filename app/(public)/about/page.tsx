"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Globe, Target, Shield, HeartHandshake, TrendingUp, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { TeamDealingAnimation } from "@/components/ui/team-dealing-animation";

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const TEAM_MEMBERS = [
  {
    name: "Jakat Roma",
    role: "CMO",
    image: "/cmo.jpg",
  },
  {
    name: "Dela Syakirah Janeeta",
    role: "CFO",
    image: "/cfo.jpg",
  },
  {
    name: "Rafifah Yasmin",
    role: "COO",
    image: "/coo.jpg",
  },
  {
    name: "Rayhan",
    role: "CEO",
    image: "/ceo.jpg",
  },
  {
    name: "Ahmad Hafizuddin",
    role: "CTO",
    image: "/cto.jpg",
  },
  {
    name: "Salsa Putri",
    role: "CCO",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dinda Candraviani",
    role: "CPO",
    image: "/cpo.jpg",
  }
];

export default function AboutPage() {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen bg-[#181A15] pt-24 pb-16">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-forest-accent/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-0 w-1/3 h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 mt-4 mb-8 text-center space-y-6">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-3xl mx-auto space-y-5"
        >
          
          <motion.h1 variants={fadeIn} className="text-3xl md:text-5xl font-extrabold text-forest-beige tracking-tight leading-tight">
            {t("about.hero_title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#829661] to-emerald-500">{t("about.hero_title_highlight")}</span> {t("about.hero_title_end")}
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-base md:text-lg text-forest-muted leading-relaxed max-w-xl mx-auto font-light">
            {t("about.hero_desc")}
          </motion.p>
        </motion.div>
      </section>

      {/* Editorial Statistics Section */}
      <section className="relative z-10 py-20 my-8 overflow-hidden bg-[#181A15]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#829661]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            {/* LEFT COLUMN */}
            <div className="md:w-[35%] w-full max-w-[420px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[#829661] text-sm font-semibold tracking-wider uppercase mb-3 block">
                  The Problem
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-forest-beige tracking-tight mb-6 leading-tight">
                  Why JALA VIVE<br/>is Needed
                </h2>
                <p className="text-forest-muted text-base leading-relaxed">
                  Our research confirms that the current volunteer ecosystem is fragmented, creating unnecessary friction for both organizers and volunteers.
                </p>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:w-[65%] w-full relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                
                {/* Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-[#1E211A]/60 backdrop-blur-xl border border-[#829661]/20 rounded-[24px] p-7 h-[180px] shadow-2xl shadow-black/50 hover:-translate-y-1.5 hover:shadow-[#829661]/10 hover:border-[#829661]/40 transition-all duration-300 flex flex-col justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#829661]/0 via-transparent to-[#829661]/0 group-hover:from-[#829661]/5 group-hover:to-transparent transition-all duration-500" />
                  <h3 className="text-[72px] font-bold text-forest-beige leading-none tracking-tighter group-hover:scale-[1.03] origin-left transition-transform duration-500 ease-out">
                    85<span className="text-4xl">%</span>
                  </h3>
                  <h4 className="text-lg font-semibold text-[#DFD5C2] mt-2">Organizer Struggle</h4>
                  <p className="text-sm text-forest-muted mt-1 line-clamp-3">of event organizers report that managing volunteer recruitment through manual forms is inefficient and time-consuming.</p>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-[#1E211A]/60 backdrop-blur-xl border border-[#829661]/20 rounded-[24px] p-7 h-[180px] shadow-2xl shadow-black/50 hover:-translate-y-1.5 hover:shadow-[#829661]/10 hover:border-[#829661]/40 transition-all duration-300 flex flex-col justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#829661]/0 via-transparent to-[#829661]/0 group-hover:from-[#829661]/5 group-hover:to-transparent transition-all duration-500" />
                  <h3 className="text-[72px] font-bold text-forest-beige leading-none tracking-tighter group-hover:scale-[1.03] origin-left transition-transform duration-500 ease-out">
                    78<span className="text-4xl">%</span>
                  </h3>
                  <h4 className="text-lg font-semibold text-[#DFD5C2] mt-2">Volunteer Hesitation</h4>
                  <p className="text-sm text-forest-muted mt-1 line-clamp-3">of potential volunteers abandon registration due to scattered information and unclear application processes.</p>
                </motion.div>

                {/* Card 3 - Centered Bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="sm:col-span-2 mx-auto w-full max-w-[360px] group bg-[#1E211A]/60 backdrop-blur-xl border border-[#829661]/20 rounded-[24px] p-7 h-[180px] shadow-2xl shadow-black/50 hover:-translate-y-1.5 hover:shadow-[#829661]/10 hover:border-[#829661]/40 transition-all duration-300 flex flex-col justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#829661]/0 via-transparent to-[#829661]/0 group-hover:from-[#829661]/5 group-hover:to-transparent transition-all duration-500" />
                  <h3 className="text-[72px] font-bold text-forest-beige leading-none tracking-tighter group-hover:scale-[1.03] origin-left transition-transform duration-500 ease-out">
                    60<span className="text-4xl">%</span>
                  </h3>
                  <h4 className="text-lg font-semibold text-[#DFD5C2] mt-2">Fragmentation</h4>
                  <p className="text-sm text-forest-muted mt-1 line-clamp-3">of social impact tracking is lost due to disorganized data and lack of a centralized platform.</p>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Section */}
      <section className="relative z-10 py-20 my-8 bg-forest-card/30 border-y border-forest-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-8 items-start md:items-center"
          >
            <div className="md:w-1/4 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#21261B] rounded-xl border border-[#38402D] flex items-center justify-center text-[#829661] shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-forest-beige tracking-tight">
                {t("about.vision_title")}
              </h2>
            </div>
            <div className="md:w-3/4">
              <p className="text-lg text-[#DFD5C2] leading-relaxed font-light border-l-2 border-forest-accent pl-5">
                {t("about.vision_desc")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Misi Section */}
      <section className="relative z-10 py-20 my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-forest-beige tracking-tight">{t("about.mission_title")}</h2>
            <p className="text-forest-muted text-base">{t("about.mission_desc")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: t("about.m1_title"),
                desc: t("about.m1_desc"),
                icon: <Globe className="w-5 h-5 text-blue-400" />,
                bg: "bg-blue-500/10",
                border: "hover:border-blue-500/30"
              },
              {
                title: t("about.m2_title"),
                desc: t("about.m2_desc"),
                icon: <Target className="w-5 h-5 text-emerald-400" />,
                bg: "bg-emerald-500/10",
                border: "hover:border-emerald-500/30"
              },
              {
                title: t("about.m3_title"),
                desc: t("about.m3_desc"),
                icon: <Users className="w-5 h-5 text-amber-400" />,
                bg: "bg-amber-500/10",
                border: "hover:border-amber-500/30"
              },
              {
                title: t("about.m4_title"),
                desc: t("about.m4_desc"),
                icon: <Shield className="w-5 h-5 text-rose-400" />,
                bg: "bg-rose-500/10",
                border: "hover:border-rose-500/30"
              }
            ].map((misi, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className={`bg-forest-card rounded-2xl p-6 border border-forest-border hover:shadow-lg transition-all duration-300 flex gap-4 items-start ${misi.border}`}
              >
                <div className={`w-10 h-10 rounded-xl ${misi.bg} flex items-center justify-center shrink-0`}>
                  {misi.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-forest-beige mb-1.5 flex items-center gap-2">
                    {misi.title}
                  </h3>
                  <p className="text-sm text-forest-muted leading-relaxed">
                    {misi.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section (J-A-L-A) */}
      <section className="relative z-10 py-20 my-8 bg-forest-card/50 border-y border-forest-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-forest-beige tracking-tight">
              {t("about.values_title")} <span className="text-[#829661] font-medium tracking-widest text-lg ml-2 border border-[#829661]/30 bg-[#829661]/10 px-3 py-1 rounded-full">J A L A</span>
            </h2>
            <p className="text-forest-muted text-base">
              {t("about.values_desc")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                letter: "J",
                title: t("about.v1_title"),
                desc: t("about.v1_desc"),
                icon: <Globe className="w-5 h-5 text-blue-400" />
              },
              {
                letter: "A",
                title: t("about.v2_title"),
                desc: t("about.v2_desc"),
                icon: <TrendingUp className="w-5 h-5 text-emerald-400" />
              },
              {
                letter: "L",
                title: t("about.v3_title"),
                desc: t("about.v3_desc"),
                icon: <HeartHandshake className="w-5 h-5 text-rose-400" />
              },
              {
                letter: "A",
                title: t("about.v4_title"),
                desc: t("about.v4_desc"),
                icon: <Shield className="w-5 h-5 text-amber-500" />
              }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="bg-[#181A15] p-6 rounded-2xl border border-forest-border hover:border-[#38402D] transition-colors flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4 border-b border-forest-border pb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#21261B] flex items-center justify-center border border-[#38402D] shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#829661] uppercase tracking-widest">{t("about.value_badge")}</div>
                    <h3 className="text-base font-bold text-forest-beige">{value.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-forest-muted leading-relaxed font-light flex-1">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 overflow-hidden">
        <div className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3 px-4">
            <h2 className="text-3xl font-extrabold text-forest-beige tracking-tight">
              {t("about.team_title")} <span className="text-[#829661]">JALA VIVE</span>
            </h2>
            <p className="text-forest-muted text-base">
              {t("about.team_desc")}
            </p>
          </div>

          <TeamDealingAnimation members={TEAM_MEMBERS} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="relative max-w-3xl mx-auto text-center space-y-6 bg-forest-card border border-forest-border p-10 rounded-[2.5rem] shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-accent/5 to-transparent rounded-[2.5rem] pointer-events-none" />
          
          <h2 className="text-2xl md:text-4xl font-extrabold text-forest-beige leading-tight tracking-tight">
            {t("about.cta_title")}
          </h2>
          <p className="text-base text-forest-muted max-w-xl mx-auto">
            {t("about.cta_desc")}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/register">
              <Button className="w-full sm:w-auto h-11 px-6 rounded-full bg-forest-accent hover:bg-[#38402D] text-forest-beige text-sm font-medium shadow-sm transition-all gap-2">
                {t("about.btn_volunteer")} <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/register?type=organization">
              <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-full border-[#38402D] hover:bg-[#1E211A] text-[#DFD5C2] text-sm font-medium transition-all">
                {t("about.btn_org")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
