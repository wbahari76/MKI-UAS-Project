"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, CalendarDays, 
  Award, FileText, Settings, Camera
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: "",
    location: "",
    bio: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update form data if profile loads late
  React.useEffect(() => {
    if (profile?.full_name && !formData.full_name) {
      setFormData(prev => ({ ...prev, full_name: profile.full_name as string }));
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Only saving full_name for now as per schema we know, 
    // but the others can be saved if the schema supports it.
    const { error } = await updateProfile({ full_name: formData.full_name });
    
    if (error) {
      toast.error(error);
    } else {
      toast.success("Profile updated successfully!");
    }
    
    setIsSaving(false);
  };

  const handleDownload = (certName: string) => {
    toast.success(`Downloading certificate: ${certName}`);
    const element = document.createElement("a");
    const file = new Blob([`Certificate of Completion: ${certName}\nThank you for volunteering with JALA VIVE!`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${certName.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Volunteer Name";
  const userInitials = userName.substring(0, 2).toUpperCase();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm shadow-slate-200">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden text-emerald-600 font-bold text-3xl tracking-wider">
                  {userInitials}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {userName}
              </h2>
              <p className="text-sm text-slate-500 mb-4">{user?.email || "No email"}</p>
              <Badge className="bg-emerald-500 text-white border-0">
                Active Volunteer
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm shadow-slate-200">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg">Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Events Joined</span>
                <span className="font-semibold text-slate-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Hours Contributed</span>
                <span className="font-semibold text-slate-900">48h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Certificates</span>
                <span className="font-semibold text-slate-900">3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card className="border-0 shadow-sm shadow-slate-200">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="+62 8..." 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="e.g. Jakarta, Indonesia" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="bio">About Me</Label>
                    <Input 
                      id="bio" 
                      placeholder="Tell us a little about yourself..." 
                      className="h-20" 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates">
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((item) => (
                  <Card key={item} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Coastal Cleanup 2026</h4>
                        <p className="text-sm text-slate-500">Ocean Care ID • Completed June 2026</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="shrink-0 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => handleDownload("Coastal Cleanup 2026")}
                      >
                        <FileText className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
      </div>
    </div>
  );
}
