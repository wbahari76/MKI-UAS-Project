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
import { useTranslation } from "react-i18next";

export default function OrganizationSettingsPage() {
  const { t } = useTranslation("common");
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
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight">{t("settings.title", "Organization Settings")}</h1>
        <p className="text-forest-muted mt-1">{t("settings.desc", "Manage your organization's preferences, visibility, and security.")}</p>
      </div>

      <div className="grid gap-6">
        
        {/* Organization Info */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#829661]" />
              {t("settings.profile", "Organization Profile")}
            </CardTitle>
            <CardDescription>{t("settings.org_profile_desc", "Update your public facing organization details.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.org_name", "Organization Name")}</Label>
              <Input disabled value={profile?.full_name || t("settings.org_name", "Organization Name")} className="bg-[#181A15]" />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.contact_email", "Contact Email Address")}</Label>
              <Input disabled value={user?.email || ""} className="bg-[#181A15]" />
              <p className="text-xs text-forest-muted">{t("settings.email_managed", "Your email is managed by your authentication provider.")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#829661]" />
              {t("settings.security", "Account Security")}
            </CardTitle>
            <CardDescription>{t("settings.security_desc", "Update your password and secure your account.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>{t("settings.new_password", "New Password")}</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.confirm_password", "Confirm Password")}</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#829661]" />
              {t("settings.notifications", "Notifications")}
            </CardTitle>
            <CardDescription>{t("settings.notif_desc", "Choose what updates your organization receives.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("settings.email_notifs", "Email Notifications")}</Label>
                <p className="text-sm text-forest-muted">{t("settings.email_notifs_desc", "Receive general platform updates and digests.")}</p>
              </div>
              <Switch 
                checked={settings.emailNotifs} 
                onCheckedChange={() => handleToggle('emailNotifs')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("settings.new_apps", "New Applications")}</Label>
                <p className="text-sm text-forest-muted">{t("settings.new_apps_desc", "Get notified when a volunteer applies to your projects.")}</p>
              </div>
              <Switch 
                checked={settings.newApplications} 
                onCheckedChange={() => handleToggle('newApplications')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("nav.messages", "Messages")}</Label>
                <p className="text-sm text-forest-muted">{t("settings.messages_notif_desc", "Receive notifications for new direct messages.")}</p>
              </div>
              <Switch 
                checked={settings.messages} 
                onCheckedChange={() => handleToggle('messages')} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-0 shadow-sm shadow-forest-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#829661]" />
              {t("settings.privacy_visibility", "Privacy & Visibility")}
            </CardTitle>
            <CardDescription>{t("settings.privacy_desc", "Control how your organization appears to others.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("settings.public_dir", "Public Directory")}</Label>
                <p className="text-sm text-forest-muted">{t("settings.public_dir_desc", "Allow volunteers to find your organization in the directory.")}</p>
              </div>
              <Switch 
                checked={settings.publicProfile} 
                onCheckedChange={() => handleToggle('publicProfile')} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">{t("settings.show_volunteers", "Show Volunteer Count")}</Label>
                <p className="text-sm text-forest-muted">{t("settings.show_volunteers_desc", "Display the total number of volunteers you've worked with publicly.")}</p>
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
            {isSaving ? t("explore.processing", "Saving...") : t("settings.save", "Save Preferences")}
          </Button>
        </div>
      </div>
    </div>
  );
}
