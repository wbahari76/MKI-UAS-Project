"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Shield, Eye, Building2 } from "lucide-react";

export default function OrganizationSettingsPage() {
  const { user, profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifs: true,
    newApplications: true,
    messages: true,
    publicProfile: true,
    showVolunteers: true,
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("jala-vive-org-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Auto-save to localStorage for immediate persistence
      localStorage.setItem("jala-vive-org-settings", JSON.stringify(next));
      return next;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Explicit save action
    localStorage.setItem("jala-vive-org-settings", JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Organization settings saved successfully");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Settings</h1>
        <p className="text-slate-500 mt-1">Manage your organization's preferences, visibility, and security.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Organization Info */}
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Organization Profile
            </CardTitle>
            <CardDescription>Update your public facing organization details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input disabled value={profile?.full_name || "Organization Name"} className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email Address</Label>
              <Input disabled value={user?.email || ""} className="bg-slate-50" />
              <p className="text-xs text-slate-500">Your email is managed by your authentication provider.</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Account Security
            </CardTitle>
            <CardDescription>Update your password and secure your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what updates your organization receives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive general platform updates and digests.</p>
              </div>
              <Switch 
                checked={settings.emailNotifs} 
                onCheckedChange={() => handleToggle('emailNotifs')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">New Applications</Label>
                <p className="text-sm text-slate-500">Get notified when a volunteer applies to your projects.</p>
              </div>
              <Switch 
                checked={settings.newApplications} 
                onCheckedChange={() => handleToggle('newApplications')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Messages</Label>
                <p className="text-sm text-slate-500">Receive notifications for new direct messages.</p>
              </div>
              <Switch 
                checked={settings.messages} 
                onCheckedChange={() => handleToggle('messages')} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription>Control how your organization appears to others.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Public Directory</Label>
                <p className="text-sm text-slate-500">Allow volunteers to find your organization in the directory.</p>
              </div>
              <Switch 
                checked={settings.publicProfile} 
                onCheckedChange={() => handleToggle('publicProfile')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Volunteer Count</Label>
                <p className="text-sm text-slate-500">Display the total number of volunteers you've worked with publicly.</p>
              </div>
              <Switch 
                checked={settings.showVolunteers} 
                onCheckedChange={() => handleToggle('showVolunteers')} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
