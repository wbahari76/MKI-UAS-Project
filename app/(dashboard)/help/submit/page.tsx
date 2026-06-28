"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { HelpCircle, Upload, MessageSquare, Send, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";

export default function SubmitTicketPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  
  // States for post-submission success view
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    if (!formData.category || !formData.subject || !formData.description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      let attachment_url = null;

      // 1. Upload file if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `tickets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('support-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('support-attachments')
          .getPublicUrl(filePath);
          
        attachment_url = publicUrlData.publicUrl;
      }

      // 2. Insert Support Ticket
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          name: profile.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          role: profile.role || "Volunteer",
          category: formData.category,
          subject: formData.subject,
          description: formData.description,
          status: "Open",
          attachment_url
        })
        .select('id')
        .single();

      if (error) throw error;

      setTicketId(data.id);
      setSubmitted(true);
      toast.success("Support ticket submitted successfully.");

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pb-20 pt-10 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-forest-beige mb-4">Request Submitted!</h1>
          <p className="text-forest-muted text-lg mb-8">
            Your support ticket has been received. Our team will review it and respond within 24 hours.
          </p>
          
          <Card className="bg-forest-card border-forest-border text-left mb-8 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-forest-muted uppercase tracking-wider">Ticket ID</p>
                  <p className="text-forest-beige font-mono">{ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-forest-muted uppercase tracking-wider">Status</p>
                  <p className="text-amber-400 font-medium">Open</p>
                </div>
                <div>
                  <p className="text-xs text-forest-muted uppercase tracking-wider">Estimated Response</p>
                  <p className="text-forest-beige">Within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Link href="/help/tickets">
              <Button className="btn-primary">View My Tickets</Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="border-forest-border text-forest-beige hover:bg-forest-card">
                Back to Help Center
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/help">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-forest-card text-forest-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-forest-accent" />
            Submit a Request
          </h1>
          <p className="text-forest-muted mt-1">
            Need help? Fill out the form below and we'll get back to you shortly.
          </p>
        </div>
      </div>

      <Card className="bg-forest-card border-forest-border">
        <CardHeader>
          <CardTitle className="text-xl text-forest-beige">Ticket Details</CardTitle>
          <CardDescription>Provide as much detail as possible to help us assist you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">Category <span className="text-red-500">*</span></label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                <SelectTrigger className="bg-[#181A15] border-forest-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Account Issue">Account Issue</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                  <SelectItem value="Bug Report">Bug Report</SelectItem>
                  <SelectItem value="Billing/Subscription">Billing / Subscription</SelectItem>
                  <SelectItem value="Report Violation">Report a Violation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">Subject <span className="text-red-500">*</span></label>
              <Input 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of your issue"
                className="bg-[#181A15] border-forest-border focus-visible:ring-forest-accent"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">Description <span className="text-red-500">*</span></label>
              <Textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe your issue in detail..."
                className="bg-[#181A15] border-forest-border focus-visible:ring-forest-accent min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-forest-beige">Attachment (Optional)</label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="bg-[#181A15] border-forest-border hover:bg-forest-border/50 text-forest-muted"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <span className="text-sm text-forest-muted">
                  {file ? file.name : "Max file size: 5MB (JPG, PNG, PDF)"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-forest-border flex justify-end">
              <Button 
                type="submit" 
                className="btn-primary w-full sm:w-auto px-8" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
