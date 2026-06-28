import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-forest pt-24 pb-20">
      <div className="container-custom max-w-4xl space-y-8">
        <div className="flex items-center gap-4 border-b border-forest-border pb-8">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-forest-beige">Privacy Policy</h1>
            <p className="text-forest-muted">Last updated: June 28, 2026</p>
          </div>
        </div>

        <Card className="bg-forest-card border-forest-border">
          <CardContent className="p-8 prose prose-invert prose-emerald max-w-none">
            <h3>1. Data Collection</h3>
            <p className="text-[#DFD5C2]">
              We collect information you provide directly to us, such as your name, email address, profile information, and project history. We use Supabase to securely store and authenticate your data.
            </p>
            
            <h3>2. How We Use Your Data</h3>
            <p className="text-[#DFD5C2]">
              Your data is used to match you with relevant volunteer opportunities, track your impact hours, and facilitate communication between volunteers and organizations.
            </p>

            <h3>3. Data Sharing</h3>
            <p className="text-[#DFD5C2]">
              We do not sell your personal data. We only share necessary profile information (such as your CV or Portfolio) with organizations when you explicitly apply to their projects.
            </p>

            <h3>4. Your Rights</h3>
            <p className="text-[#DFD5C2]">
              You have the right to access, update, or delete your personal data at any time through your Profile Settings. For complete account deletion, you may submit a request via our Help Center.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
