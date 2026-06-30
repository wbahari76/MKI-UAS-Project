"use client";

import React, { useState } from "react";
import { Crown, CheckCircle2, Zap, Shield, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function SubscriptionPage() {
  const { t } = useTranslation("common");
  // Hardcoded for now since DB column doesn't exist
  const [currentPlan] = useState("Starter"); 

  const PLANS = [
    {
      id: "Starter",
      name: t("subscription.starter.name", "Starter Plan"),
      price: t("subscription.free", "Gratis"),
      period: "",
      description: t("subscription.starter.desc", "Cocok untuk komunitas atau proyek sosial skala kecil."),
      icon: <CheckCircle2 className="w-8 h-8 text-[#829661]" />,
      badge: t("subscription.current_plan", "Current Plan"),
      features: [
        { name: t("subscription.starter.feat1", "Akses ke 1 Event Aktif"), desc: t("subscription.starter.feat1_desc", "Batasan untuk satu proyek agar fokus.") },
        { name: t("subscription.starter.feat2", "Manajemen Relawan Dasar"), desc: t("subscription.starter.feat2_desc", "Pendaftaran relawan melalui platform.") },
        { name: t("subscription.starter.feat3", "Profil Organisasi"), desc: t("subscription.starter.feat3_desc", "Halaman profil dasar untuk menampilkan visi.") }
      ],
      buttonText: t("subscription.current_plan", "Your Current Plan"),
      buttonVariant: "outline",
      popular: false
    },
    {
      id: "Pro",
      name: t("subscription.pro.name", "Pro Plan"),
      price: "Rp20.000",
      period: t("subscription.per_month", "/ bulan"),
      description: t("subscription.pro.desc", "Dirancang untuk pengelola acara yang membutuhkan data lebih dalam."),
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      badge: t("subscription.most_popular", "Most Popular"),
      features: [
        { name: t("subscription.pro.feat1", "Akses hingga 10 Event"), desc: t("subscription.pro.feat1_desc", "Lebih fleksibel untuk organisasi kampus atau yayasan.") },
        { name: t("subscription.pro.feat2", "Dashboard Dampak (Advanced)"), desc: t("subscription.pro.feat2_desc", "Visualisasi metrik kinerja yang detail.") },
        { name: t("subscription.pro.feat3", "Manajemen Relawan hingga 50 orang"), desc: t("subscription.pro.feat3_desc", "Fitur koordinasi yang lebih terorganisir.") },
        { name: t("subscription.pro.feat4", "Prioritas Dukungan"), desc: t("subscription.pro.feat4_desc", "Layanan bantuan lebih cepat jika ada kendala sistem.") }
      ],
      buttonText: t("subscription.upgrade_pro", "Upgrade to Pro"),
      buttonVariant: "primary",
      popular: true
    },
    {
      id: "Enterprise",
      name: t("subscription.enterprise.name", "Enterprise Plan"),
      price: "Rp40.000",
      period: t("subscription.per_month", "/ bulan"),
      description: t("subscription.enterprise.desc", "Solusi lengkap untuk organisasi besar atau kolaborasi CSR perusahaan."),
      icon: <Building2 className="w-8 h-8 text-blue-500" />,
      badge: "",
      features: [
        { name: t("subscription.enterprise.feat1", "Event Tak Terbatas"), desc: t("subscription.enterprise.feat1_desc", "Mendukung kampanye sosial berskala nasional.") },
        { name: t("subscription.enterprise.feat2", "Full Analytics & Reporting"), desc: t("subscription.enterprise.feat2_desc", "Laporan dampak yang bisa diekspor (PDF/Excel).") },
        { name: t("subscription.enterprise.feat3", "Manajemen Relawan Tak Terbatas"), desc: t("subscription.enterprise.feat3_desc", "Sistem koordinasi untuk skala besar.") },
        { name: t("subscription.enterprise.feat4", "Dedicated Account Manager"), desc: t("subscription.enterprise.feat4_desc", "Pendampingan khusus untuk setiap proyek.") }
      ],
      buttonText: t("subscription.upgrade_enterprise", "Upgrade to Enterprise"),
      buttonVariant: "outline",
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-forest-accent/10 rounded-2xl mb-2">
          <Crown className="w-8 h-8 text-forest-accent" />
        </div>
        <h1 className="text-4xl font-extrabold text-forest-beige tracking-tight">
          {t("subscription.title", "Pilih Paket Skala Kebaikan Anda")}
        </h1>
        <p className="text-forest-muted text-lg">
          {t("subscription.desc", "Tingkatkan kapasitas manajemen relawan dan maksimalkan dampak sosial dari setiap inisiatif organisasi Anda.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col border-2 overflow-hidden bg-forest-card transition-all duration-300 hover:shadow-2xl ${
              plan.popular 
                ? "border-amber-500/50 shadow-amber-900/20 scale-105 z-10" 
                : "border-forest-border shadow-black/40 hover:border-[#38402D]"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-amber-500 to-orange-400 py-1.5 text-center">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-widest">{plan.badge}</span>
              </div>
            )}
            
            {plan.id === currentPlan && !plan.popular && (
              <div className="absolute top-0 left-0 w-full bg-[#2C3322] py-1.5 text-center">
                <span className="text-xs font-bold text-[#829661] uppercase tracking-widest">{plan.badge}</span>
              </div>
            )}

            <CardHeader className={`pb-6 ${plan.badge ? 'pt-10' : 'pt-8'}`}>
              <div className="mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl text-forest-beige font-bold mb-2">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-forest-muted h-10">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-forest-beige">{plan.price}</span>
                <span className="text-forest-muted font-medium">{plan.period}</span>
              </div>

              <div className="space-y-4 pt-4 border-t border-forest-border/50">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-amber-500' : 'text-forest-accent'}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#DFD5C2]">{feature.name}</p>
                      <p className="text-xs text-forest-muted mt-0.5 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-6 pb-8">
              <Button 
                className={`w-full py-6 text-base font-bold ${
                  plan.buttonVariant === 'primary' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-lg shadow-amber-500/20' 
                    : plan.id === currentPlan
                      ? 'bg-[#181A15] text-[#829661] border border-[#2C3322] hover:bg-[#181A15] cursor-default'
                      : 'bg-forest-beige text-forest-card hover:bg-white'
                }`}
                disabled={plan.id === currentPlan}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center p-8 bg-[#181A15] border border-forest-border rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left flex items-center gap-4">
          <Shield className="w-12 h-12 text-blue-500 shrink-0" />
          <div>
            <h4 className="text-forest-beige font-bold text-lg">{t("subscription.security_title", "Keamanan & Kepercayaan")}</h4>
            <p className="text-forest-muted text-sm mt-1">{t("subscription.security_desc", "Pembayaran diproses secara aman. Anda dapat membatalkan langganan kapan saja tanpa biaya tambahan.")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
