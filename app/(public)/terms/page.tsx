import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-forest pt-24 pb-20">
      <div className="container-custom max-w-4xl space-y-8">
        <div className="flex items-center gap-4 border-b border-forest-border pb-8">
          <div className="w-12 h-12 bg-forest-accent/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-forest-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-forest-beige">Terms of Service</h1>
            <p className="text-forest-muted">Last updated: June 28, 2026</p>
          </div>
        </div>

        <Card className="bg-forest-card border-forest-border">
          <CardContent className="p-8 prose prose-invert prose-emerald max-w-none">
            <h3>1. Introduction</h3>
            <p className="text-[#DFD5C2]">
              Welcome to JALA VIVE. By accessing our platform, you agree to these Terms of Service. Our platform connects volunteers with organizations for social impact projects.
            </p>
            
            <h3>2. User Responsibilities</h3>
            <p className="text-[#DFD5C2]">
              You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when registering as a volunteer or an organization.
            </p>

            <h3>3. Project & Event Guidelines</h3>
            <p className="text-[#DFD5C2]">
              Organizations must ensure that all projects comply with local laws and regulations. JALA VIVE reserves the right to remove any project that violates our community guidelines.
            </p>

            <h3>4. Liability</h3>
            <p className="text-[#DFD5C2]">
              JALA VIVE acts solely as a platform to connect parties. We are not liable for any incidents, injuries, or disputes that occur during volunteering events.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
