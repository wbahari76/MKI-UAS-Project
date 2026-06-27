"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Users, Building2, CalendarDays,
  CheckCircle2, Share2, Heart, AlertCircle, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock data to match what we had in Explore
const PROJECT = {
  id: 1,
  title: "Coastal Cleanup Initiative",
  org: "Ocean Care ID",
  category: "Environment",
  location: "Kuta Beach, Bali, Indonesia",
  deadline: "2026-07-15",
  date: "2026-07-20 to 2026-07-21",
  volunteersNeeded: 50,
  volunteersApplied: 32,
  image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=1200&q=80",
  isSaved: true,
  description: "Join us in our mission to keep our oceans clean and protect marine life. We will be organizing a massive coastal cleanup along Kuta Beach. This initiative aims to remove plastic waste and debris from the shoreline before it enters the ocean ecosystem.",
  requirements: [
    "Age 17 or above",
    "Physically fit for outdoor activities",
    "Commitment to attend the full 2-day event",
    "Bring your own reusable water bottle"
  ],
  benefits: [
    "E-Certificate of Participation",
    "Lunch and snacks provided",
    "Cleanup tools (gloves, trash bags) provided",
    "Networking with fellow environmental enthusiasts"
  ]
};

export default function PublicProjectDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(PROJECT.isSaved);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApply = () => {
    if (!user) {
        toast("Please log in to apply for this project.");
        router.push("/login");
        return;
    }

    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
      setIsDialogOpen(false);
      toast.success("Application submitted successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-forest-muted hover:text-[#829661] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Explore
      </button>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg shadow-forest-border/20"
      >
        <img
          src={PROJECT.image}
          alt={PROJECT.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Badge className="mb-4 bg-forest-accent text-forest-beige border-0 hover:bg-[#4A5D23]">
            {PROJECT.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-forest-beige mb-2 leading-tight">
            {PROJECT.title}
          </h1>
          <div className="flex items-center gap-4 text-emerald-50">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">{PROJECT.org}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-accent" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{PROJECT.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-forest-card/20 backdrop-blur-md text-forest-beige hover:bg-forest-card/30 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-forest-card/20 backdrop-blur-md text-forest-beige hover:bg-forest-card/30 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Details) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* About */}
          <section>
            <h3 className="text-xl font-bold text-forest-beige mb-4">About the Project</h3>
            <p className="text-forest-muted leading-relaxed">
              {PROJECT.description}
            </p>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="text-xl font-bold text-forest-beige mb-4">Requirements</h3>
            <ul className="space-y-3">
              {PROJECT.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-forest-muted">
                  <CheckCircle2 className="w-5 h-5 text-forest-accent shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}
          <section>
            <h3 className="text-xl font-bold text-forest-beige mb-4">What you will get</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROJECT.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-[#181A15] border border-forest-border">
                  <Award className="w-5 h-5 text-forest-accent shrink-0" />
                  <span className="text-sm font-medium text-[#DFD5C2]">{benefit}</span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>

        {/* Right Column (Sidebar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg shadow-forest-border/10 sticky top-24">
            <CardContent className="p-6">

              <div className="space-y-6">
                {/* Timeline info */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-muted font-medium mb-1">Event Date</p>
                    <p className="font-semibold text-forest-beige">{PROJECT.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-muted font-medium mb-1">Application Deadline</p>
                    <p className="font-semibold text-forest-beige">{new Date(PROJECT.deadline).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="h-px bg-[#1E211A] my-2" />

                {/* Capacity */}
                <div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">Volunteers Needed</span>
                    <span className="text-forest-beige">{PROJECT.volunteersApplied} / {PROJECT.volunteersNeeded}</span>
                  </div>
                  <div className="h-2 w-full bg-[#1E211A] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-forest-accent rounded-full"
                      style={{ width: `${(PROJECT.volunteersApplied / PROJECT.volunteersNeeded) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-forest-muted text-right">
                    {PROJECT.volunteersNeeded - PROJECT.volunteersApplied} spots remaining
                  </p>
                </div>

                {/* CTA */}
                {hasApplied ? (
                  <Button disabled className="w-full h-12 bg-[#1E211A] text-forest-muted border-0">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-forest-accent" />
                    Application Submitted
                  </Button>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-forest-accent hover:bg-[#4A5D23] text-forest-beige h-12 text-base shadow-lg shadow-forest-accent/20">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Confirm Application</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to apply for "{PROJECT.title}"? By applying, you commit to attending the event.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-200 text-amber-800">
                          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Make sure you have read all the requirements and are available on the specified dates before proceeding.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-forest-accent hover:bg-[#4A5D23] text-forest-beige" onClick={handleApply} disabled={isApplying}>
                          {isApplying ? "Submitting..." : "Confirm Application"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
