"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Users, Building2, CalendarDays,
  CheckCircle2, Share2, Heart, AlertCircle, Award, Wallet, CreditCard, Globe, Landmark, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { VolunteerPaymentModal } from "@/components/ui/VolunteerPaymentModal";

export default function ProjectDetailsPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showBioForm, setShowBioForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [step, setStep] = useState<'form' | 'payment_method'>('form');

  const paymentMethodsList = [
    { id: 'wallet', name: 'Dompet JALA VIVE', icon: Wallet },
    { id: 'qris', name: 'QRIS', icon: CreditCard },
    { id: 'va', name: 'Virtual Account (VA)', icon: Landmark },
    { id: 'ewallet', name: 'E-Wallet (OVO, DANA)', icon: Banknote },
  ];

  React.useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*, organizations(*)')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        if (user) {
          const { data: applicationData } = await supabase
            .from('project_applications')
            .select('id')
            .eq('project_id', id)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (applicationData) setHasApplied(true);

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
      toast.error("Please login to apply");
      return;
    }
    
    setIsApplying(true);
    try {
      const { error } = await supabase
        .from('project_applications')
        .upsert({
          project_id: id,
          user_id: user.id,
          status: 'pending',
          payment_status: 'unpaid',
          message: coverLetter
        }, { onConflict: 'project_id, user_id' });
        
      if (error) throw error;
      
      if (project?.is_paid) {
        setStep('payment_method');
      } else {
        setHasApplied(true);
        setIsDialogOpen(false);
        toast.success(t("explore.success_message"));
      }
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

  const appliedCount = project.volunteer_count || 0;
  const isFull = appliedCount >= (project.volunteer_needed || 0);

  return (
    <div className="space-y-6 pb-20">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-medium text-forest-muted hover:text-[#829661] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("explore.back")}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden"
      >
        <img
          src={project.banner_url || "https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&w=1200&q=80"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <Badge className="mb-4 bg-forest-accent text-forest-beige border-0">{project.category || 'General'}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-forest-beige mb-2">{project.title}</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-forest-beige mb-4">{t("explore.about_org")}</h3>
            <p className="text-forest-muted leading-relaxed">{project.description}</p>
          </section>

          <div className="bg-[#181A15] border border-forest-border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-forest-card rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                {project?.organizations?.logo_url ? (
                  <img src={project.organizations.logo_url} alt="Org Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-forest-muted" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg font-bold text-forest-beige">{project?.organizations?.name}</h4>
                <p className="text-sm mt-1">{project?.organizations?.description}</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-xs font-medium">
                  {project?.organizations?.website && (
                    <a href={project.organizations.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-forest-accent hover:underline">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                  {project?.organizations?.created_at && (
                    <span className="flex items-center gap-1 text-[#7A8072]">
                      <CalendarDays className="w-4 h-4" /> {t("explore.org_since")} {format(new Date(project.organizations.created_at), 'yyyy')}
                    </span>
                  )}
                </div>
              </div>
            </div>
        </div>

        <motion.div className="space-y-6">
          <Card className="bg-[#181A15] border-forest-border sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-forest-muted">{t("explore.volunteers_needed")}</span>
                  <span className="text-forest-beige font-medium">{appliedCount} / {project?.volunteers_needed}</span>
                </div>
                <div className="h-2 w-full bg-[#1E211A] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isFull ? 'bg-amber-500' : 'bg-forest-accent'}`} 
                    style={{ width: `${Math.min((appliedCount / (project?.volunteers_needed || 1)) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-forest-border/50">
                {project?.deadline && (
                  <div className="flex justify-between text-sm">
                    <span className="text-forest-muted">{t("explore.deadline")}</span>
                    <span className="text-forest-beige font-medium">{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {hasApplied ? (
                  <Button disabled className="w-full h-12 bg-[#1E211A] text-forest-muted border-0">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {t("explore.applied")}
                  </Button>
                ) : project?.is_paid && false ? (
                  <Button 
                    className="w-full h-12 bg-forest-accent text-forest-card hover:bg-forest-accent/90"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    {t("explore.apply_now")}
                  </Button>
                ) : (
                  <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setTimeout(() => setStep('form'), 200);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-12 bg-forest-accent text-forest-card hover:bg-forest-accent/90">
                        {t("explore.apply_now")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-forest-beige">
                          {step === 'form' ? t("explore.fill_application") : t("explore.choose_payment")}
                        </DialogTitle>
                      </DialogHeader>

                      {step === 'form' ? (
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>{t("explore.cover_letter")}</Label>
                            <Textarea 
                              placeholder={t("explore.cover_letter_ph")} 
                              value={coverLetter} 
                              onChange={(e) => setCoverLetter(e.target.value)} 
                              className="min-h-[150px] bg-[#1E211A] border-forest-border focus-visible:ring-forest-accent"
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleApply} 
                            disabled={isApplying || !coverLetter.trim()}
                          >
                            {isApplying ? t("explore.processing") : (project?.is_paid ? t("explore.proceed_payment") : t("explore.submit_application"))}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4">
                          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center mb-6">
                            <p className="text-forest-muted text-sm">{t("explore.reg_fee")}</p>
                            <p className="text-2xl font-bold text-amber-400 mt-1">Rp {project?.registration_fee?.toLocaleString('id-ID')}</p>
                          </div>
                          <Label>{t("explore.pay_with")}</Label>
                          <div className="space-y-2">
                            {paymentMethodsList.map(method => (
                              <div 
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${paymentMethod === method.id ? 'border-forest-accent bg-forest-accent/10' : 'border-forest-border hover:border-forest-muted bg-[#1E211A]'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-forest-accent' : 'text-forest-muted'}`} />
                                  <span className={paymentMethod === method.id ? 'text-forest-beige font-medium' : 'text-forest-muted'}>{method.name}</span>
                                </div>
                                <div className={`w-4 h-4 rounded-full border ${paymentMethod === method.id ? 'border-[4px] border-forest-accent bg-forest-card' : 'border-forest-muted'}`} />
                              </div>
                            ))}
                          </div>
                          <Button 
                            className="w-full mt-4 bg-forest-accent hover:bg-forest-accent/90 text-forest-card" 
                            disabled={!paymentMethod}
                            onClick={() => {
                              setIsDialogOpen(false);
                              setTimeout(() => setIsPaymentModalOpen(true), 300);
                            }}
                          >
                            Bayar Sekarang
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {project.is_paid && (
        <VolunteerPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          projectId={project.id}
          projectName={project.title}
          registrationFee={project.registration_fee || 0}
          paymentMethod={paymentMethod}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            setHasApplied(true);
          }}
        />
      )}
    </div>
  );
}
