"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Lock, Shield, Eye, Mail } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifs: true,
    eventReminders: true,
    messages: true,
    publicProfile: true,
    showOnline: true,
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem("jala-vive-settings");
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
      localStorage.setItem("jala-vive-settings", JSON.stringify(next));
      return next;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Explicit save action
    localStorage.setItem("jala-vive-settings", JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card className="border-0 shadow-sm shadow-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Account Security
            </CardTitle>
            <CardDescription>Update your password and secure your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input disabled value={user?.email || ""} className="bg-slate-50" />
              <p className="text-xs text-slate-500">Your email is managed by your authentication provider.</p>
            </div>
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
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive emails about new projects and events.</p>
              </div>
              <Switch 
                checked={settings.emailNotifs} 
                onCheckedChange={() => handleToggle('emailNotifs')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Event Reminders</Label>
                <p className="text-sm text-slate-500">Get notified 24 hours before your event starts.</p>
              </div>
              <Switch 
                checked={settings.eventReminders} 
                onCheckedChange={() => handleToggle('eventReminders')} 
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
              Privacy
            </CardTitle>
            <CardDescription>Control who can see your profile and activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Public Profile</Label>
                <p className="text-sm text-slate-500">Allow organizations to view your volunteer history.</p>
              </div>
              <Switch 
                checked={settings.publicProfile} 
                onCheckedChange={() => handleToggle('publicProfile')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Online Status</Label>
                <p className="text-sm text-slate-500">Let others see when you are active on the platform.</p>
              </div>
              <Switch 
                checked={settings.showOnline} 
                onCheckedChange={() => handleToggle('showOnline')} 
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
