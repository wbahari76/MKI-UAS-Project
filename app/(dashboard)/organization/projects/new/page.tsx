"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Upload, CalendarIcon, CheckCircle2, 
  Loader2, Wallet, CreditCard, Landmark, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { OrgPaymentModal } from "@/components/ui/OrgPaymentModal";

export default function CreateProjectPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  // Step 1: Detail
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("1");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  // Step 2: Tipe
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  // Step 3A: Tip (Free Program)
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [tipMethod, setTipMethod] = useState("");

  // Step 3B: Registration Fee (Paid Program)
  const [registrationFee, setRegistrationFee] = useState<string>("");
  const [acceptedMethods, setAcceptedMethods] = useState<string[]>(['wallet']);

  // Step 4: Informasi Tambahan
  const [whatsappGroupLink, setWhatsappGroupLink] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const platformFeePercentage = 0.10;
  const regFeeNumber = parseInt(registrationFee.replace(/\D/g, '')) || 0;
  const platformFee = regFeeNumber * platformFeePercentage;
  const orgReceives = regFeeNumber - platformFee;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerImage(url);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title || !category || !location || !deadline || !volunteersNeeded || !description) {
        toast.error(t("projects.err_required", "Mohon lengkapi semua field wajib di langkah ini."));
        return;
      }
    }
    if (step === 2) {
      if (isPaid === null) {
        toast.error(t("projects.err_type", "Mohon pilih tipe program."));
        return;
      }
    }
    if (step === 3) {
      if (isPaid) {
        if (!registrationFee || acceptedMethods.length === 0) {
          toast.error(t("projects.err_fee", "Mohon isi biaya registrasi dan pilih minimal satu metode pembayaran."));
          return;
        }
      } else {
        if (tipAmount > 0 && !tipMethod) {
          toast.error(t("projects.err_tip_method", "Mohon pilih metode pembayaran untuk tip."));
          return;
        }
      }
    }
    setStep(s => Math.min(5, s + 1));
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("projects.err_login", "Anda harus login untuk membuat program."));
      return;
    }

    setIsSubmitting(true);
    
    try {
      let orgId;
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (orgError || !org) {
        const { data: newOrg, error: newOrgError } = await supabase
          .from('organizations')
          .insert({
            owner_id: user.id,
            name: user.user_metadata?.full_name || 'My Organization',
            slug: 'org-' + Date.now(),
          })
          .select('id')
          .single();
          
        if (newOrgError || !newOrg) {
          throw new Error(t("projects.err_create_org", "Gagal membuat profil organisasi."));
        }
        orgId = newOrg.id;
      } else {
        orgId = org.id;
      }

      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert({
          organization_id: orgId,
          title: title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
          category: category,
          project_type: 'social', // default
          is_paid: isPaid,
          registration_fee: isPaid ? regFeeNumber : 0,
          accepted_payment_methods: isPaid ? acceptedMethods : [],
          location: location,
          description: description,
          volunteer_needed: parseInt(volunteersNeeded),
          deadline: new Date(deadline).toISOString(),
          status: 'pending',
          banner_url: bannerImage,
          whatsapp_group_link: whatsappGroupLink,
          contact_person_name: contactName,
          contact_person_phone: contactPhone,
          contact_email: contactEmail
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Handle Tip if Free Program and Tip > 0
      if (!isPaid && tipAmount > 0 && project) {
        setCreatedProjectId(project.id);
        setIsPaymentModalOpen(true);
        return; // Don't redirect yet
      }

      toast.success(t("projects.success_proj", "Program berhasil diajukan untuk verifikasi!"));
      router.push("/organization/projects");
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.message || t("projects.err_create_proj", "Gagal membuat program"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTipPaymentSuccess = async () => {
    try {
      if (createdProjectId) {
        await supabase
          .from('platform_tips')
          .insert({
            project_id: createdProjectId,
            amount: tipAmount,
            payment_method: tipMethod,
            status: 'paid'
          });
      }
      setIsPaymentModalOpen(false);
      toast.success(t("projects.success_proj", "Program berhasil diajukan untuk verifikasi!"));
      router.push("/organization/projects");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data tip.");
      router.push("/organization/projects");
    }
  };

  const handleTipPaymentClose = () => {
    setIsPaymentModalOpen(false);
    toast.info("Program berhasil dibuat, tip dibatalkan.");
    router.push("/organization/projects");
  };

  const paymentMethods = [
    { id: 'wallet', name: t("projects.wallet", 'Dompet JALA VIVE'), icon: Wallet },
    { id: 'qris', name: t("projects.qris", 'QRIS'), icon: CreditCard },
    { id: 'va', name: t("projects.va", 'Virtual Account (VA)'), icon: Landmark },
    { id: 'ewallet', name: t("projects.ewallet", 'E-Wallet (OVO, DANA)'), icon: Banknote },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/organization/projects">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-forest-card">
            <ArrowLeft className="w-5 h-5 text-forest-muted" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-forest-beige">{t("projects.submit_new")}</h1>
          <p className="text-forest-muted text-sm mt-1">{t("projects.submit_desc")}</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#181A15] rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-forest-accent rounded-full z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        ></div>
        {[1, 2, 3, 4, 5].map((idx) => (
          <div 
            key={idx}
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 font-bold ${
              step >= idx ? 'bg-forest-accent text-forest-card' : 'bg-[#181A15] text-forest-muted border-2 border-forest-border'
            }`}
          >
            {step > idx ? <CheckCircle2 className="w-5 h-5" /> : idx}
          </div>
        ))}
      </div>

      <Card className="border-0 shadow-sm shadow-forest-border/20 bg-forest-card">
        <CardContent className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: DETAIL PROGRAM */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-6">{t("projects.step1")}</h2>
                
                <div className="space-y-2">
                  <Label>{t("projects.name")} <span className="text-red-500">*</span></Label>
                  <Input placeholder={t("projects.name_ph")} value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label>{t("projects.desc")} <span className="text-red-500">*</span></Label>
                  <Textarea placeholder={t("projects.desc_ph")} className="min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("projects.category")} <span className="text-red-500">*</span></Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder={t("projects.category_placeholder")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lingkungan">{t("projects.category_env")}</SelectItem>
                        <SelectItem value="Pendidikan">{t("projects.category_edu")}</SelectItem>
                        <SelectItem value="Kesehatan">{t("projects.category_health")}</SelectItem>
                        <SelectItem value="Sosial">{t("projects.category_social")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("projects.location")} <span className="text-red-500">*</span></Label>
                    <Input placeholder={t("projects.location_ph")} value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("projects.datetime")} <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-muted" />
                      <Input type="date" className="pl-9" value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("projects.quota")} <span className="text-red-500">*</span></Label>
                    <Input type="number" min="1" placeholder="100" value={volunteersNeeded} onChange={e => setVolunteersNeeded(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("projects.poster")}</Label>
                  <div className="border-2 border-dashed border-forest-border rounded-xl p-6 text-center hover:bg-[#1E211A] cursor-pointer relative overflow-hidden">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                    {bannerImage ? (
                      <div className="text-forest-accent font-medium"><CheckCircle2 className="w-8 h-8 mx-auto mb-2" /> {t("projects.image_selected")}</div>
                    ) : (
                      <div className="text-forest-muted"><Upload className="w-8 h-8 mx-auto mb-2" /> {t("projects.poster_desc")}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: TIPE PROGRAM */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-6">{t("projects.step2")}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => setIsPaid(false)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${isPaid === false ? 'border-forest-accent bg-forest-accent/5' : 'border-forest-border hover:border-forest-accent/50'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-forest-beige mb-2">{t("projects.type_free")}</h3>
                    <p className="text-sm text-forest-muted">{t("projects.type_free_desc")}</p>
                  </div>

                  <div 
                    onClick={() => setIsPaid(true)}
                    className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${isPaid === true ? 'border-forest-accent bg-forest-accent/5' : 'border-forest-border hover:border-forest-accent/50'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-forest-beige mb-2">{t("projects.type_paid")}</h3>
                    <p className="text-sm text-forest-muted">{t("projects.type_paid_desc")}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3A: TIP UNTUK PLATFORM (GRATIS) */}
            {step === 3 && isPaid === false && (
              <motion.div key="step3a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-2">{t("projects.step3a")}</h2>
                <p className="text-sm text-forest-muted mb-6">{t("projects.tip_desc")}</p>
                
                <div className="space-y-4">
                  <Label>{t("projects.select_tip")}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10000, 25000, 50000, 100000].map(amt => (
                      <div 
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`p-4 rounded-xl text-center cursor-pointer border-2 font-medium ${tipAmount === amt ? 'border-forest-accent text-forest-accent bg-forest-accent/5' : 'border-forest-border text-forest-beige hover:border-forest-muted'}`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <div className="relative flex-1 max-w-[250px]">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-muted font-medium">Rp</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tipAmount || ""}
                        onChange={(e) => setTipAmount(Number(e.target.value) || 0)}
                        className="pl-9 h-11 border-forest-border bg-forest-card focus-visible:ring-forest-accent text-forest-beige"
                      />
                    </div>
                    <Button type="button" variant={tipAmount === 0 ? "default" : "outline"} className={tipAmount === 0 ? "bg-forest-border" : ""} onClick={() => setTipAmount(0)}>
                      {t("projects.skip_tip", "Skip (No Tip)")}
                    </Button>
                  </div>
                </div>

                {tipAmount > 0 && (
                  <div className="space-y-4 pt-6 mt-6 border-t border-forest-border">
                    <Label>{t("projects.tip_method")}</Label>
                    <div className="space-y-3">
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id}
                          onClick={() => setTipMethod(method.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer ${tipMethod === method.id ? 'border-forest-accent bg-forest-accent/5' : 'border-forest-border hover:border-forest-muted'}`}
                        >
                          <div className="flex items-center gap-3">
                            <method.icon className={`w-5 h-5 ${tipMethod === method.id ? 'text-forest-accent' : 'text-forest-muted'}`} />
                            <span className="font-medium text-forest-beige">{method.name}</span>
                          </div>
                          {tipMethod === method.id && <CheckCircle2 className="w-5 h-5 text-forest-accent" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3B: BIAYA REGISTRASI (BERBAYAR) */}
            {step === 3 && isPaid === true && (
              <motion.div key="step3b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-6">{t("projects.step3b")}</h2>
                
                <div className="space-y-2">
                  <Label>{t("projects.fee_per_vol")} <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="Rp 50.000" 
                    value={registrationFee} 
                    onChange={e => setRegistrationFee(e.target.value)}
                    className="text-lg font-bold"
                  />
                  {regFeeNumber > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-[#181A15] space-y-3 border border-forest-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-muted">{t("projects.platform_fee")}</span>
                        <span className="text-red-400">- Rp {platformFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-forest-border/50 pt-3">
                        <span className="text-forest-beige">{t("projects.org_receives")}</span>
                        <span className="text-emerald-400">Rp {orgReceives.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6">
                  <Label>{t("projects.select_payment")} <span className="text-red-500">*</span></Label>
                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <div key={method.id} className="flex items-center space-x-3 p-4 rounded-xl border border-forest-border bg-[#181A15]">
                        <Checkbox 
                          id={`method-${method.id}`} 
                          checked={acceptedMethods.includes(method.id)}
                          onCheckedChange={(checked: boolean | string) => {
                            if (checked) {
                              setAcceptedMethods([...acceptedMethods, method.id]);
                            } else {
                              setAcceptedMethods(acceptedMethods.filter(m => m !== method.id));
                            }
                          }}
                        />
                        <Label htmlFor={`method-${method.id}`} className="flex items-center gap-2 cursor-pointer w-full font-medium text-forest-beige">
                          <method.icon className="w-5 h-5 text-forest-muted" /> {method.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-6">{t("projects.step4")}</h2>
                
                <div className="space-y-2">
                  <Label>{t("projects.wa_link")}</Label>
                  <Input placeholder="https://chat.whatsapp.com/..." value={whatsappGroupLink} onChange={e => setWhatsappGroupLink(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{t("projects.contact_name")}</Label>
                    <Input placeholder={t("projects.contact_name_ph", "Putri Lestari")} value={contactName} onChange={e => setContactName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("projects.contact_phone")}</Label>
                    <Input placeholder="081234567890" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("projects.contact_email")}</Label>
                  <Input type="email" placeholder={t("projects.email_ph", "email@organisasi.com")} value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-bold text-forest-beige mb-6">{t("projects.step5")}</h2>
                
                <div className="bg-[#181A15] p-6 rounded-xl space-y-6 border border-forest-border text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-forest-muted mb-1">{t("projects.name")}</p>
                      <p className="font-medium text-forest-beige">{title}</p>
                    </div>
                    <div>
                      <p className="text-forest-muted mb-1">{t("projects.category")}</p>
                      <p className="font-medium text-forest-beige">{category} • {location}</p>
                    </div>
                    <div>
                      <p className="text-forest-muted mb-1">{t("projects.quota")} & {t("projects.datetime")}</p>
                      <p className="font-medium text-forest-beige">{volunteersNeeded} • {deadline}</p>
                    </div>
                    <div>
                      <p className="text-forest-muted mb-1">{t("projects.type")}</p>
                      <div className="font-medium flex items-center gap-2">
                        {isPaid ? (
                          <><span className="text-amber-400 font-bold">{t("projects.type_paid")}</span> (Rp {regFeeNumber.toLocaleString('id-ID')})</>
                        ) : (
                          <><span className="text-emerald-400 font-bold">{t("projects.type_free")}</span></>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isPaid && (
                    <div className="border-t border-forest-border/50 pt-4">
                      <p className="text-forest-muted mb-1">{t("projects.tip_method")}</p>
                      <p className="font-medium text-forest-beige">
                        {tipAmount > 0 ? `Rp ${tipAmount.toLocaleString('id-ID')} via ${paymentMethods.find(m => m.id === tipMethod)?.name}` : t("projects.skip_tip")}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-forest-border/50 pt-4">
                    <p className="text-forest-muted mb-1">{t("projects.contact_name")}</p>
                    <p className="font-medium text-forest-beige">{contactName} ({contactPhone})</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{t("projects.verification_notice")}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-forest-border">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={step === 1 || isSubmitting}
              className="px-6 bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50 hover:text-white"
            >
              {t("projects.back")}
            </Button>
            
            {step < 5 ? (
              <Button onClick={handleNext} className="bg-forest-accent hover:bg-forest-accent/90 text-forest-card px-8">
                {t("projects.next")}
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-forest-accent hover:bg-forest-accent/90 text-forest-card px-8">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSubmitting ? t("projects.submitting") : t("projects.submit_verification")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <OrgPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleTipPaymentClose}
        amount={tipAmount}
        paymentMethod={tipMethod}
        description={`Pembayaran tip platform untuk program ${title}`}
        onSuccess={handleTipPaymentSuccess}
      />
    </div>
  );
}
