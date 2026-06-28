"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { Camera, Award, FileText, Upload, Loader2, FileUp, Search, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const STUDY_PROGRAMS = [
  "Computer Science",
  "Information Technology",
  "Information Systems",
  "Business Administration",
  "Management",
  "Accounting",
  "Communications",
  "Psychology",
  "Law",
  "Medicine",
  "Nursing",
  "Engineering",
  "Architecture",
  "Design",
  "Environmental Science",
  "Other"
];

export default function ProfilePage() {
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    birth_date: "",
    gender: "",
    education: "",
    portfolio_url: "",
    cv_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);

  const [studyProgram, setStudyProgram] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [educationStatus, setEducationStatus] = useState("");
  const [otherEducationLevel, setOtherEducationLevel] = useState("");
  const [otherStudyProgram, setOtherStudyProgram] = useState("");
  const [uniSearchQuery, setUniSearchQuery] = useState("");
  const [uniResults, setUniResults] = useState<any[]>([]);
  const [isSearchingUni, setIsSearchingUni] = useState(false);
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [isUniFocused, setIsUniFocused] = useState(false);

  useEffect(() => {
    // Sync to formData
    let combined = "";
    const actualLevel = educationLevel === "Other" ? otherEducationLevel : educationLevel;
    const actualProgram = studyProgram === "Other" ? otherStudyProgram : studyProgram;

    if (actualLevel) {
       combined += educationStatus === "Currently Enrolled" ? `Currently Enrolled in ${actualLevel}` : `Graduated ${actualLevel}`;
    }
    if (actualProgram) {
       combined += ` (${actualProgram})`;
    }
    if (uniSearchQuery) {
       combined += ` at ${uniSearchQuery}`;
    }
    setFormData(prev => ({...prev, education: combined.trim()}));
  }, [educationLevel, educationStatus, studyProgram, uniSearchQuery, otherEducationLevel, otherStudyProgram]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (uniSearchQuery && uniSearchQuery.length > 2) {
        setIsSearchingUni(true);
        try {
          const res = await fetch(`http://universities.hipolabs.com/search?name=${uniSearchQuery}`);
          const data = await res.json();
          // Deduplicate by name and limit to 10
          const uniqueUnis = Array.from(new Set(data.map((a: any) => a.name)))
            .map(name => data.find((a: any) => a.name === name))
            .slice(0, 10);
          setUniResults(uniqueUnis);
          if (isUniFocused) {
            setShowUniDropdown(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearchingUni(false);
        }
      } else {
        setUniResults([]);
        setShowUniDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [uniSearchQuery]);

  useEffect(() => {
    async function loadVolunteerProfile() {
      if (!profile?.id) return;
      
      setFormData(prev => ({
        ...prev,
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || ""
      }));

      try {
        const { data, error } = await supabase
          .from('volunteer_profiles')
          .select('*')
          .eq('profile_id', profile.id)
          .maybeSingle();
          
        if (data) {
          setFormData(prev => ({
            ...prev,
            birth_date: data.birth_date || "",
            gender: data.gender || "",
            education: data.education || "",
            portfolio_url: data.portfolio_url || "",
            cv_url: data.cv_url || "",
          }));

          if (data.education) {
            const statusMatch = data.education.match(/(Currently Enrolled in|Graduated)/);
            let statusPrefix = "";
            if (statusMatch) {
               statusPrefix = statusMatch[0];
               setEducationStatus(statusPrefix === "Currently Enrolled in" ? "Currently Enrolled" : "Graduated");
            }
            
            const levelMatch = data.education.match(/(High School|Associate Degree|Bachelor's Degree|Master's Degree|Doctorate)/);
            if (levelMatch) {
              setEducationLevel(levelMatch[0]);
            } else if (statusPrefix) {
              // Extract Other level
              let rest = data.education.substring(data.education.indexOf(statusPrefix) + statusPrefix.length).trim();
              let customLevel = rest.split("(")[0].split(" at ")[0].trim();
              if (customLevel) {
                setEducationLevel("Other");
                setOtherEducationLevel(customLevel);
              }
            }
            
            const programMatch = data.education.match(/\((.*?)\)/);
            if (programMatch) {
              const p = programMatch[1];
              if (STUDY_PROGRAMS.includes(p)) {
                setStudyProgram(p);
              } else {
                setStudyProgram("Other");
                setOtherStudyProgram(p);
              }
            }
            
            const uniMatch = data.education.split(" at ");
            if (uniMatch.length > 1) {
              setUniSearchQuery(uniMatch[1]);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    loadVolunteerProfile();
  }, [profile]);

  useEffect(() => {
    // Calculate completion score
    let score = 0;
    const mandatoryFields = ['full_name', 'phone', 'location', 'bio', 'birth_date', 'gender', 'education', 'cv_url'];
    
    let mandatoryFilled = 0;
    mandatoryFields.forEach(field => {
      if (formData[field as keyof typeof formData] && formData[field as keyof typeof formData].toString().trim() !== "") {
        mandatoryFilled++;
      }
    });
    
    score += Math.round((mandatoryFilled / mandatoryFields.length) * 80);
    
    if (formData.portfolio_url && formData.portfolio_url.trim() !== "") {
      score += 20;
    }
    
    setCompletionScore(score);
  }, [formData]);

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      setIsUploading(true);
      
      const { error: uploadError } = await supabase.storage.from('resume').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('resume').getPublicUrl(fileName);
      setFormData(prev => ({...prev, cv_url: data.publicUrl}));
      toast.success("CV uploaded successfully!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPortfolio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}-portfolio.${fileExt}`;
      
      setIsUploading(true);
      
      const { error: uploadError } = await supabase.storage.from('portfolio').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
      setFormData(prev => ({...prev, portfolio_url: data.publicUrl}));
      toast.success("Portfolio uploaded successfully!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // 1. Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          profile_completion: completionScore
        })
        .eq('id', profile?.id);
        
      if (profileError) throw profileError;

      // 2. Upsert volunteer_profiles
      const { error: vpError } = await supabase
        .from('volunteer_profiles')
        .upsert({
          profile_id: profile?.id,
          birth_date: formData.birth_date || null,
          gender: formData.gender || null,
          education: formData.education || null,
          portfolio_url: formData.portfolio_url || null,
          cv_url: formData.cv_url || null,
        }, { onConflict: 'profile_id' });

      if (vpError) throw vpError;

      toast.success("Profile updated successfully!");
      refreshProfile(); // Refresh context
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to save profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const userName = profile?.full_name || user?.email?.split("@")[0] || "Volunteer Name";
  const userInitials = userName.substring(0, 2).toUpperCase();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight">Profile Setup</h1>
        <p className="text-forest-muted mt-1">Complete your profile and upload your CV to start applying.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-0 shadow-sm shadow-forest-border/20">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-[#2C3322] flex items-center justify-center border-4 border-forest-border shadow-lg overflow-hidden text-[#829661] font-bold text-3xl tracking-wider">
                  {userInitials}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-forest-beige" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-forest-beige">
                {userName}
              </h2>
              <p className="text-sm text-forest-muted mb-4">{user?.email || "No email"}</p>
              
              <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-forest-muted">Profile Completion</span>
                  <span className="font-semibold text-forest-accent">{completionScore}%</span>
                </div>
                <div className="w-full bg-forest-border/30 rounded-full h-2 mt-2 overflow-hidden">
                  <div 
                    className="bg-forest-accent h-2 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${completionScore}%` }} 
                  />
                </div>
                {completionScore < 80 && (
                   <p className="text-[11px] text-yellow-500 mt-2 text-left">
                     Reach 80% completion to apply for projects.
                   </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="resume">Resume & CV</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card className="border-0 shadow-sm shadow-forest-border/20 bg-forest-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                      <Input 
                        id="name" 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input defaultValue={user?.email || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="+62 8..." 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="e.g. Jakarta, Indonesia" 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Birth Date <span className="text-red-500">*</span></Label>
                      <Input 
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender <span className="text-red-500">*</span></Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white bg-transparent"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="" className="text-black">Select Gender</option>
                        <option value="Male" className="text-black">Male</option>
                        <option value="Female" className="text-black">Female</option>
                        <option value="Other" className="text-black">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label>Bio / About Me <span className="text-red-500">*</span></Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white bg-transparent"
                      placeholder="Tell us a little about yourself..." 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-forest-accent text-white hover:bg-forest-accent/90" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resume">
              <Card className="border-0 shadow-sm shadow-forest-border/20 bg-forest-card">
                <CardHeader>
                  <CardTitle>Professional Experience & CV</CardTitle>
                  <CardDescription>Upload your CV to let organizations know your background.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 relative">
                        <Label>Education Level <span className="text-red-500">*</span></Label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white bg-transparent"
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                        >
                          <option value="" className="text-black">Select Level</option>
                          <option value="High School" className="text-black">High School / SMA / SMK</option>
                          <option value="Associate Degree" className="text-black">Associate Degree (D3)</option>
                          <option value="Bachelor's Degree" className="text-black">Bachelor's Degree (S1)</option>
                          <option value="Master's Degree" className="text-black">Master's Degree (S2)</option>
                          <option value="Doctorate" className="text-black">Doctorate (S3)</option>
                          <option value="Other" className="text-black">Other</option>
                        </select>
                        {educationLevel === "Other" && (
                          <Input 
                            placeholder="Specify your education level..."
                            className="mt-2"
                            value={otherEducationLevel}
                            onChange={(e) => setOtherEducationLevel(e.target.value)}
                          />
                        )}
                      </div>

                      <div className="space-y-2 relative">
                        <Label>Current Status <span className="text-red-500">*</span></Label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white bg-transparent"
                          value={educationStatus}
                          onChange={(e) => setEducationStatus(e.target.value)}
                        >
                          <option value="" className="text-black">Select Status</option>
                          <option value="Currently Enrolled" className="text-black">Currently Enrolled / Masih Sekolah/Kuliah</option>
                          <option value="Graduated" className="text-black">Graduated / Lulus</option>
                        </select>
                      </div>
                    </div>

                    {educationLevel !== "High School" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 relative">
                        <Label>Study Program <span className="text-red-500">*</span></Label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white bg-transparent"
                          value={studyProgram}
                          onChange={(e) => setStudyProgram(e.target.value)}
                        >
                          <option value="" className="text-black">Select Study Program</option>
                          {STUDY_PROGRAMS.map(prog => (
                            <option key={prog} value={prog} className="text-black">{prog}</option>
                          ))}
                        </select>
                        {studyProgram === "Other" && (
                          <Input 
                            placeholder="Specify your study program..."
                            className="mt-2"
                            value={otherStudyProgram}
                            onChange={(e) => setOtherStudyProgram(e.target.value)}
                          />
                        )}
                      </div>

                      <div className="space-y-2 relative">
                        <Label>University <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8072]" />
                          <Input 
                            placeholder="Search your university..."
                            className="pl-9"
                            value={uniSearchQuery}
                            onChange={(e) => setUniSearchQuery(e.target.value)}
                            onFocus={() => { 
                              setIsUniFocused(true);
                              if (uniResults.length > 0) setShowUniDropdown(true);
                            }}
                            onBlur={() => {
                              setIsUniFocused(false);
                              setTimeout(() => setShowUniDropdown(false), 200);
                            }}
                          />
                          {isSearchingUni && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-forest-accent" />}
                        </div>
                        
                        {showUniDropdown && uniResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-forest-card border border-forest-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {uniResults.map((uni, idx) => (
                              <div 
                                key={idx}
                                className="px-4 py-2 hover:bg-[#2A2F22] cursor-pointer text-sm text-forest-beige flex items-start gap-2"
                                onClick={() => {
                                  setUniSearchQuery(uni.name);
                                  setShowUniDropdown(false);
                                }}
                              >
                                <GraduationCap className="w-4 h-4 mt-0.5 text-forest-muted shrink-0" />
                                <div>
                                  <p>{uni.name}</p>
                                  <p className="text-[10px] text-forest-muted">{uni.country}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Upload Portfolio / Work Samples <span className="text-forest-muted font-normal text-xs ml-2">(Optional, +20%)</span></Label>
                      <div className="relative border border-input rounded-md px-3 py-2 flex items-center bg-transparent">
                        <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx,.zip"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleUploadPortfolio}
                          disabled={isUploading}
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          <span className="truncate">{formData.portfolio_url ? "Portfolio Uploaded" : "Select File (PDF, DOCX, ZIP)"}</span>
                        </div>
                      </div>
                      {formData.portfolio_url && (
                        <a href={formData.portfolio_url} target="_blank" rel="noreferrer" className="text-xs text-forest-accent hover:underline block mt-1">
                          View Uploaded Portfolio
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-forest-border rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-[#181A15] rounded-full flex items-center justify-center mb-4">
                      <FileUp className="w-8 h-8 text-forest-accent" />
                    </div>
                    <h3 className="text-lg font-medium text-forest-beige mb-1">Upload your CV / Resume <span className="text-red-500">*</span></h3>
                    <p className="text-sm text-forest-muted mb-6">PDF, DOCX up to 5MB</p>
                    
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleUploadCV}
                        disabled={isUploading}
                      />
                      <Button variant="outline" className="border-forest-accent text-forest-accent hover:bg-forest-accent/10 pointer-events-none">
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        {isUploading ? "Uploading..." : "Select File"}
                      </Button>
                    </div>
                    
                    {formData.cv_url && (
                      <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-100 text-left line-clamp-1 max-w-[200px]">CV Uploaded</span>
                        <a href={formData.cv_url} target="_blank" rel="noreferrer" className="text-xs text-green-400 hover:underline ml-auto">View</a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-forest-accent text-white hover:bg-forest-accent/90" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
      </div>
    </div>
  );
}
