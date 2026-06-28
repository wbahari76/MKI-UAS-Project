import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-forest pt-24 pb-20">
      <div className="container-custom max-w-4xl space-y-8">
        <div className="flex items-center gap-4 border-b border-forest-border pb-8">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-forest-beige">Community Guidelines</h1>
            <p className="text-forest-muted">Fostering a safe and positive environment for everyone.</p>
          </div>
        </div>

        <Card className="bg-forest-card border-forest-border">
          <CardContent className="p-8 prose prose-invert prose-emerald max-w-none">
            <h3>1. Be Respectful</h3>
            <p className="text-[#DFD5C2]">
              Treat all members of the JALA VIVE community with respect. Harassment, hate speech, or discriminatory language will not be tolerated and will result in immediate account suspension.
            </p>
            
            <h3>2. Commitment and Reliability</h3>
            <p className="text-[#DFD5C2]">
              When you apply for a volunteer project and are accepted, the organization depends on you. If you cannot attend, please communicate promptly. Repeated no-shows may affect your standing on the platform.
            </p>

            <h3>3. Honest Profiles</h3>
            <p className="text-[#DFD5C2]">
              Ensure your profile, skills, and portfolio accurately reflect your abilities. Organizations rely on this information to assign you to the most suitable roles.
            </p>

            <h3>4. Safety First</h3>
            <p className="text-[#DFD5C2]">
              Prioritize safety during all on-site and remote volunteer activities. If you feel unsafe or encounter inappropriate behavior, report it immediately using our Help Center.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
