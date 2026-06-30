"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Clock, Users, Building2, CalendarDays,
  CheckCircle2, XCircle, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useTranslation } from "react-i18next";

export default function AdminProjectDetailsPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*, organizations(name, email, phone)')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    const { error } = await supabase
      .from('projects')
      .update({ status: 'published' })
      .eq('id', id);

    if (error) {
      toast.error(t("admin.projects.approve_fail", "Failed to approve project."));
    } else {
      toast.success(t("admin.projects.approve_success", "Project approved and published."));
      setProject({ ...project, status: 'published' });
    }
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    const { error } = await supabase
      .from('projects')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) {
      toast.error(t("admin.projects.reject_fail", "Failed to reject project."));
    } else {
      toast.success(t("admin.projects.reject_success", "Project rejected."));
      setProject({ ...project, status: 'cancelled' });
    }
    setIsProcessing(false);
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
    <div className="space-y-6 pb-20">
      <button
        onClick={() => router.push('/admin/projects')}
        className="flex items-center text-sm font-medium text-forest-muted hover:text-[#829661] transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("admin.projects.back", "Back to Manage Projects")}
      </button>

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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          <section>
            <h3 className="text-xl font-bold text-forest-beige mb-4">{t("admin.projects.about", "About the Project")}</h3>
            <p className="text-forest-muted leading-relaxed">
              {project.description || t("admin.projects.no_desc", "No description provided.")}
            </p>
          </section>

          {requirements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-forest-beige mb-4">{t("admin.projects.requirements", "Requirements")}</h3>
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

          {benefits.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-forest-beige mb-4">{t("admin.projects.benefits", "Benefits")}</h3>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg shadow-forest-border/10 sticky top-24">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-muted font-medium mb-1">{t("admin.projects.start_date", "Start Date")}</p>
                    <p className="font-semibold text-forest-beige">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : t("admin.projects.tba", "TBA")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-muted font-medium mb-1">{t("admin.projects.deadline", "Application Deadline")}</p>
                    <p className="font-semibold text-forest-beige">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : t("admin.projects.no_deadline", "No Deadline")}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#1E211A] my-2" />
                
                <div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">Project Type</span>
                    <span className="text-forest-beige capitalize">{project.project_type?.replace(/_/g, ' ') || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">Is Paid</span>
                    <span className="text-forest-beige">{project.is_paid ? 'Yes' : 'No'}</span>
                  </div>
                  {project.is_paid && (
                    <div className="flex items-center justify-between text-sm font-medium mb-2">
                      <span className="text-forest-muted">Registration Fee</span>
                      <span className="text-forest-beige">Rp {project.registration_fee?.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">Contact Email</span>
                    <span className="text-forest-beige">{project.contact_email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-forest-muted">WhatsApp</span>
                    <span className="text-forest-beige">{project.whatsapp_link || 'N/A'}</span>
                  </div>
                </div>

                <div className="h-px bg-[#1E211A] my-2" />

                {(project.status === 'draft' || project.status === 'pending' || project.status === 'reported') ? (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" 
                      onClick={handleApprove}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {t("admin.projects.approve")}
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white" 
                      onClick={handleReject}
                      disabled={isProcessing}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {t("admin.projects.reject")}
                    </Button>
                  </div>
                ) : (
                  <Button disabled className="w-full h-12 bg-[#1E211A] text-forest-muted border-0 capitalize">
                    {t("admin.projects.status_label", "Status")}: {project.status}
                  </Button>
                )}

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
