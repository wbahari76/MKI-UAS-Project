"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Crown, CheckCircle2, Zap, LayoutDashboard, Shield, BarChart, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [tier, setTier] = useState("free");
  const [activeApps, setActiveApps] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscriptionData() {
      if (!user) return;
      try {
        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .select("id, subscription_tier")
          .eq("owner_id", user.id)
          .single();

        if (orgError) throw orgError;

        setTier(org.subscription_tier || "free");

        // We need to restrict by org's projects
        const { data: apps } = await supabase
          .from("project_applications")
          .select("id, status, projects!inner(organization_id)")
          .eq("status", "pending")
          .eq("projects.organization_id", org.id);

        setActiveApps(apps?.length || 0);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSubscriptionData();
  }, [user]);

  const isPro = tier === "pro";
  const volunteerLimit = isPro ? "Unlimited" : 20;
  const appsLimit = isPro ? "Unlimited" : 50;

  const appsPercentage = isPro ? 0 : Math.min((activeApps / 50) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight flex items-center gap-2">
          <Crown className="w-8 h-8 text-forest-accent" />
          Subscription Plan
        </h1>
        <p className="text-forest-muted mt-2 text-lg">
          Manage your organization's capacity and premium features.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Plan Overview */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-forest-accent bg-[#181A15]/80 shadow-lg shadow-forest-accent/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Crown className="w-32 h-32 text-forest-accent" />
            </div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-2xl text-forest-beige flex items-center gap-3">
                Current Plan: 
                <Badge className={isPro ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 text-base py-1 px-3" : "bg-forest-accent/20 text-forest-accent hover:bg-forest-accent/30 text-base py-1 px-3 border-0"}>
                  {isPro ? "🚀 Pro Organization" : "🌱 Free Organization"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-forest-muted">
                {isPro 
                  ? "You have access to unlimited capacity and all premium tools."
                  : "You are currently on the basic free tier with limited capacities."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* Usage Metrics */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#829661] uppercase tracking-wider">Current Usage</h3>
                
                <div className="bg-forest-card rounded-xl p-5 border border-forest-border space-y-3">
                  <div className="flex justify-between items-end mb-1">
                    <div>
                      <h4 className="text-forest-beige font-medium">Active Applications</h4>
                      <p className="text-xs text-forest-muted">Pending applications across all projects</p>
                    </div>
                    <span className="text-lg font-bold text-forest-beige">
                      {activeApps} <span className="text-sm font-normal text-forest-muted">/ {appsLimit}</span>
                    </span>
                  </div>
                  
                  {!isPro && (
                    <div className="w-full bg-[#181A15] rounded-full h-2.5 overflow-hidden border border-forest-border/50">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ${appsPercentage > 80 ? 'bg-red-500' : 'bg-forest-accent'}`}
                        style={{ width: `${appsPercentage}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="bg-forest-card rounded-xl p-5 border border-forest-border space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-forest-beige font-medium">Volunteer Capacity</h4>
                      <p className="text-xs text-forest-muted">Max approved volunteers per project</p>
                    </div>
                    <span className="text-lg font-bold text-forest-beige">
                      {volunteerLimit}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade / Plan Info */}
        <div className="lg:col-span-1">
          <Card className="h-full border-forest-border bg-forest-card flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-forest-beige">🚀 Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock the full potential of your organization and scale your impact.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-3">
                {[
                  "Unlimited Volunteers per Project",
                  "Unlimited Active Applications",
                  "AI Volunteer Matching",
                  "Export Volunteer Data (Excel/PDF)",
                  "Priority Organization Badge",
                  "Advanced Analytics Dashboard",
                  "Priority Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-forest-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-[#DFD5C2]">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-primary py-6 text-base font-semibold group shadow-lg shadow-forest-accent/20">
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
