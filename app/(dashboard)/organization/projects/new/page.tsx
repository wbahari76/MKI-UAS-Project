"use client";

import React, { useState } from "react";
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
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

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
      toast.success(asDraft ? "Project saved as draft" : "Project published successfully!");
      router.push('/organization/dashboard');
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
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight">
            Create New Project
          </h1>
          <p className="text-forest-muted mt-1">
            Fill in the details below to start recruiting volunteers.
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
              <h3 className="text-lg font-bold text-forest-beige">1. Basic Information</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                <Input id="title" placeholder="e.g. Coastal Cleanup Initiative" required className="focus-ring" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select required>
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="animal">Animal Welfare</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Input id="location" placeholder="e.g. Kuta Beach, Bali" required className="focus-ring" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the project, its goals, and why volunteers should join..." 
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
              <h3 className="text-lg font-bold text-forest-beige">2. Requirements & Benefits</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="- Age 17 or above&#10;- Physically fit&#10;- Bring own water bottle" 
                  className="min-h-[100px] focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits (one per line)</Label>
                <Textarea 
                  id="benefits" 
                  placeholder="- E-Certificate&#10;- Lunch provided&#10;- Merchandise" 
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
              <h3 className="text-lg font-bold text-forest-beige">3. Timeline & Capacity</h3>
              <div className="h-px bg-[#1E211A]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="volunteersNeeded">Volunteers Needed <span className="text-red-500">*</span></Label>
                <Input id="volunteersNeeded" type="number" min="1" placeholder="50" required className="focus-ring" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A8072]" />
                  <Input id="deadline" type="date" required className="pl-10 focus-ring" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="eventDate">Event Date & Time (Optional)</Label>
                <Input id="eventDate" placeholder="e.g. July 20-21, 09:00 AM - 15:00 PM" className="focus-ring" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-beige">4. Project Banner</h3>
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
                      <Upload className="w-5 h-5" /> Click to change image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#21261B] text-forest-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="text-forest-beige font-medium mb-1">Upload a cover image</h4>
                  <p className="text-forest-muted text-sm mb-4">PNG, JPG, WEBP up to 5MB. Recommended size 1200x600px.</p>
                  <Button type="button" variant="outline" size="sm">Browse Files</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-forest-border">
          <Button 
            type="button" 
            variant="outline" 
            className="h-12 px-6"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
          >
            {isSubmitting && isDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            className="h-12 px-8 btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && !isDraft ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            Publish Project
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
