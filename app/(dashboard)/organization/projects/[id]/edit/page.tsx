"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  // Mock initial data fetch
  const [formData, setFormData] = useState({
    title: "Digital Literacy Bootcamp",
    category: "education",
    location: "Jakarta, Indonesia",
    description: "Teaching basic digital literacy skills to the elderly in our community.",
    requirements: "- Patient and empathetic\n- Basic tech skills\n- Available on weekends",
    benefits: "- E-Certificate\n- Lunch and Transport covered\n- Networking opportunities",
    volunteersNeeded: "20",
    deadline: "2026-08-10",
    eventDate: "2026-08-15 to 2026-09-15",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent, asDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsDraft(asDraft);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(asDraft ? t("projects.saved_draft", "Project saved as draft") : t("projects.updated_success", "Project updated successfully!"));
      router.push('/organization/projects');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-forest-muted hover:text-[#829661] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("projects.back_to_projects", "Back to Projects")}
          </button>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            {t("projects.edit_title", "Edit Project")}
          </h1>
          <p className="text-forest-muted mt-1">
            {t("projects.edit_desc", "Update your project details below.")}
          </p>
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
        onSubmit={(e) => handleSubmit(e, false)}
      >
        {/* Basic Information */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-beige">{t("projects.basic_info", "1. Basic Information")}</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("projects.project_title", "Project Title")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  className="focus-ring" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">{t("projects.category", "Category")} <span className="text-red-500">*</span></Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder={t("projects.category_placeholder", "Select a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">{t("projects.category_env", "Environment")}</SelectItem>
                      <SelectItem value="education">{t("projects.category_edu", "Education")}</SelectItem>
                      <SelectItem value="health">{t("projects.category_health", "Health")}</SelectItem>
                      <SelectItem value="animal">Animal Welfare</SelectItem>
                      <SelectItem value="community">{t("projects.category_social", "Community")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t("projects.location", "Location")} <span className="text-red-500">*</span></Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    required 
                    className="focus-ring" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("projects.project_desc", "Project Description")} <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="min-h-[150px] focus-ring"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements & Benefits */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-beige">{t("projects.req_ben", "2. Requirements & Benefits")}</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requirements">{t("projects.requirements", "Requirements (one per line)")}</Label>
                <Textarea 
                  id="requirements" 
                  value={formData.requirements} 
                  onChange={e => setFormData({...formData, requirements: e.target.value})} 
                  className="min-h-[100px] focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">{t("projects.benefits", "Benefits (one per line)")}</Label>
                <Textarea 
                  id="benefits" 
                  value={formData.benefits} 
                  onChange={e => setFormData({...formData, benefits: e.target.value})} 
                  className="min-h-[100px] focus-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline & Capacity */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-beige">{t("projects.timeline_cap", "3. Timeline & Capacity")}</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="volunteersNeeded">{t("projects.volunteers_needed", "Volunteers Needed")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="volunteersNeeded" 
                  type="number" 
                  min="1" 
                  value={formData.volunteersNeeded} 
                  onChange={e => setFormData({...formData, volunteersNeeded: e.target.value})} 
                  required 
                  className="focus-ring" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">{t("projects.app_deadline", "Application Deadline")} <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
                  <Input 
                    id="deadline" 
                    type="date" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                    required 
                    className="pl-10 focus-ring" 
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="eventDate">{t("projects.event_date", "Event Date & Time (Optional)")}</Label>
                <Input 
                  id="eventDate" 
                  value={formData.eventDate} 
                  onChange={e => setFormData({...formData, eventDate: e.target.value})} 
                  className="focus-ring" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-beige">{t("projects.project_banner", "4. Project Banner")}</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="relative border-2 border-dashed border-forest-border rounded-xl p-10 text-center hover:bg-[#181A15] hover:border-emerald-300 transition-colors cursor-pointer group overflow-hidden">
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              {bannerImage ? (
                <div className="absolute inset-0 w-full h-full z-0">
                  <img src={bannerImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-forest-beige font-medium flex items-center gap-2">
                      <Upload className="w-5 h-5" /> {t("projects.click_to_change", "Click to change image")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#21261B] text-forest-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-forest-beige font-medium mb-1">{t("projects.upload_new_cover", "Upload a new cover image")}</h4>
                  <p className="text-forest-muted text-sm mb-4">{t("projects.img_guidelines", "PNG, JPG, WEBP up to 5MB. Recommended size 1200x600px.")}</p>
                  <Button type="button" variant="outline" size="sm">{t("projects.browse_files", "Browse Files")}</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-forest-border">
          <Button 
            type="submit" 
            className="h-12 px-8 btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {t("projects.save_changes", "Save Changes")}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
