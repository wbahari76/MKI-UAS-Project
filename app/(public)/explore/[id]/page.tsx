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
import { supabase } from "@/lib/supabase/client";

export default function PublicProjectDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  React.useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*, organizations(name)')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        if (user) {
          // Check if already applied
          const { data: applicationData } = await supabase
            .from('project_applications')
            .select('id')
            .eq('project_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (applicationData) setHasApplied(true);

          // Check if saved
          const { data: savedData } = await supabase
            .from('saved_projects')
            .select('id')
            .eq('project_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
          if (savedData) setIsSaved(true);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
        toast("Please log in to apply for this project.");
        router.push("/login");
        return;
    }
    
    // We import profile from useAuth at the top, need to get it:
    // Actually, `profile` is not extracted from useAuth in PublicProjectDetailsPage
    // Let's assume it was extracted, I will add it to useAuth destructuring if needed.
    // Wait, let's look at the context: `const { user } = useAuth();` on line 30.
    // Let's modify the replace chunk to just use a fetch if profile isn't available, or I'll just change line 30 in another step.
    
    // For now I'll just fetch it directly to be safe if `profile` isn't in scope.
    const { data: userProfile } = await supabase.from('profiles').select('profile_completion').eq('user_id', user.id).single();

    if (!userProfile || userProfile.profile_completion < 80) {
        toast.error("You must complete your profile (at least 80%) and upload your CV before applying.");
        router.push('/volunteer/profile');
        return;
    }

    setIsApplying(true);
    try {
      const { error } = await supabase
        .from('project_applications')
        .insert({
          project_id: id,
          user_id: user.id,
          status: 'pending'
        });
        
      if (error) throw error;
      
      setHasApplied(true);
      setIsDialogOpen(false);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
      return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-accent"></div></div>;
  }

  if (!project) {
      return <div className="text-center py-20 text-forest-muted">Project not found.</div>;
  }

  const volunteersNeeded = project.volunteer_needed || 1;
  const volunteersApplied = project.volunteer_count || 0;
  const requirements = project.requirements || [];
  const benefits = project.benefits || [];
  const bannerImage = project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=1200&q=80";

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
          src={bannerImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Badge className="mb-4 bg-forest-accent text-forest-beige border-0 hover:bg-[#4A5D23]">
            {project.category || 'General'}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-forest-beige mb-2 leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-emerald-50">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">{project.organizations?.name || 'Organization'}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-accent" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{project.location || 'Remote'}</span>
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
              {project.description || 'No description provided.'}
            </p>
          </section>

          {/* Requirements */}
          {requirements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-forest-beige mb-4">Requirements</h3>
              <ul className="space-y-3">
                {requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-forest-muted">
                    <CheckCircle2 className="w-5 h-5 text-forest-accent shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-forest-beige mb-4">What you will get</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-[#181A15] border border-forest-border">
                    <Award className="w-5 h-5 text-forest-accent shrink-0" />
                    <span className="text-sm font-medium text-[#DFD5C2]">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
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
                    <p className="text-sm text-forest-muted font-medium mb-1">Start Date</p>
                    <p className="font-semibold text-forest-beige">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBA'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-muted font-medium mb-1">Application Deadline</p>
                    <p className="font-semibold text-forest-beige">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#1E211A] my-2" />

                {/* Capacity */}
                <div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">Volunteers Needed</span>
                    <span className="text-forest-beige">{volunteersApplied} / {volunteersNeeded}</span>
                  </div>
                  <div className="h-2 w-full bg-[#1E211A] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-forest-accent rounded-full"
                      style={{ width: `${Math.min((volunteersApplied / volunteersNeeded) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-forest-muted text-right">
                    {Math.max(volunteersNeeded - volunteersApplied, 0)} spots remaining
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
                          Are you sure you want to apply for "{project.title}"? By applying, you commit to attending the event.
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
