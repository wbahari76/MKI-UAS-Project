"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, ArrowRight, AlertCircle, Landmark, Copy, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { TopUpModal } from "./TopUpModal";
import { motion, AnimatePresence } from "framer-motion";

interface VolunteerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  registrationFee: number;
  paymentMethod: string; // 'wallet' | 'qris' | 'va' | 'ewallet'
  onSuccess: () => void;
}

export function VolunteerPaymentModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName, 
  registrationFee,
  paymentMethod,
  onSuccess
}: VolunteerPaymentModalProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isWallet = paymentMethod === 'wallet';
  const isQris = paymentMethod === 'qris' || paymentMethod === 'ewallet';
  const isVA = paymentMethod === 'va';

  // Simulated data
  const dummyVA = "8273 " + Math.floor(10000000 + Math.random() * 90000000).toString();
  const dummyQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VolunteerReg_${projectId}_${registrationFee}_${paymentMethod}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchBalance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isWallet) {
      fetchBalance();
    } else if (isOpen) {
      setIsLoading(false);
    }
  }, [isOpen, user, paymentMethod]);

  const handleTopUpSuccess = async (amount: number, method: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const { error } = await supabase.rpc('top_up_user_wallet', {
        p_user_id: user?.id,
        p_amount: amount,
        p_method: method
      });
      if (error) throw error;
      
      toast.success(`Top Up Rp ${amount.toLocaleString('id-ID')} berhasil`);
      setIsTopUpOpen(false);
      await fetchBalance();
    } catch (err: any) {
      toast.error(err.message || "Gagal Top Up");
    } finally {
      setIsProcessing(false);
    }
  };

  // Wallet payment: deduct from JALA VIVE wallet
  const handleWalletPayment = async () => {
    if (balance < registrationFee) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('process_volunteer_payment', {
        p_project_id: projectId,
        p_user_id: user?.id,
        p_amount: registrationFee
      });

      if (error) throw error;

      toast.success("Pembayaran berhasil! Anda telah terdaftar.");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Pembayaran gagal diproses.");
    } finally {
      setIsProcessing(false);
    }
  };

  // External payment: QRIS, VA, E-Wallet (simulated)
  const handleExternalPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment gateway processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await supabase.rpc('process_volunteer_external_payment', {
        p_project_id: projectId,
        p_user_id: user?.id,
        p_amount: registrationFee,
        p_method: paymentMethod
      });

      if (error) throw error;

      toast.success("Pembayaran berhasil dikonfirmasi! Anda telah terdaftar.");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Pembayaran gagal diproses.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isInsufficient = balance < registrationFee;

  const getMethodLabel = () => {
    switch (paymentMethod) {
      case 'qris': return 'QRIS';
      case 'va': return 'Virtual Account';
      case 'ewallet': return 'E-Wallet';
      default: return 'Dompet JALA VIVE';
    }
  };

  return (
    <>
      <Dialog open={isOpen && !isTopUpOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md bg-forest-card border-forest-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-forest-beige flex items-center gap-2">
              {isWallet ? (
                <><Wallet className="w-5 h-5 text-emerald-400" /> Pembayaran Registrasi</>
              ) : (
                <><Landmark className="w-5 h-5 text-emerald-400" /> Pembayaran via {getMethodLabel()}</>
              )}
            </DialogTitle>
            <DialogDescription className="text-forest-muted">
              Selesaikan pembayaran untuk bergabung dengan {projectName}.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-forest-accent" />
            </div>
          ) : isWallet ? (
            /* === WALLET PAYMENT === */
            <div className="space-y-6 pt-4">
              <div className="bg-[#181A15] p-4 rounded-xl border border-forest-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-muted">Biaya Registrasi</span>
                  <span className="text-forest-beige font-bold">Rp {registrationFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-muted">Saldo Dompet Anda</span>
                  <span className="text-forest-beige font-medium">Rp {balance.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-forest-border/50 pt-3 flex justify-between">
                  <span className="text-forest-muted">Sisa Saldo Setelah Bayar</span>
                  <span className={`font-bold ${isInsufficient ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isInsufficient ? '-' : ''} Rp {Math.abs(balance - registrationFee).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {isInsufficient ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Saldo Anda tidak mencukupi untuk melakukan registrasi. Silakan top up dompet Anda terlebih dahulu.</p>
                  </div>
                  <Button 
                    onClick={() => setIsTopUpOpen(true)} 
                    className="w-full bg-forest-accent hover:bg-forest-accent/90 text-forest-card"
                  >
                    Top Up Dompet <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={handleWalletPayment} 
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Bayar & Daftar Sekarang
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* === EXTERNAL PAYMENT (QRIS / VA / E-Wallet) === */
            <AnimatePresence mode="wait">
              <motion.div
                key="external-payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5 pt-4"
              >
                {/* Amount Summary */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-center">
                  <p className="text-forest-muted text-sm">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">Rp {registrationFee.toLocaleString('id-ID')}</p>
                </div>

                {/* Payment Instructions */}
                {isVA ? (
                  <div className="w-full bg-[#1E211A] border border-forest-border rounded-lg p-6 flex flex-col items-center">
                    <Landmark className="w-12 h-12 text-emerald-400 mb-4" />
                    <p className="text-forest-muted text-sm mb-2">Transfer ke Virtual Account</p>
                    <div className="flex items-center gap-3 bg-[#181A15] px-4 py-3 rounded-md border border-forest-border w-full justify-between">
                      <span className="text-xl font-mono text-forest-beige font-semibold tracking-wider">{dummyVA}</span>
                      <button 
                        onClick={() => copyToClipboard(dummyVA)}
                        className="text-forest-muted hover:text-emerald-400 transition-colors p-2"
                        title="Copy VA"
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-forest-muted mt-4 text-left w-full">
                      * Nomor Virtual Account ini adalah simulasi untuk keperluan demo.
                    </p>
                  </div>
                ) : (
                  <div className="w-full bg-[#1E211A] border border-forest-border rounded-lg p-6 flex flex-col items-center">
                    <p className="text-forest-muted text-sm mb-4">Scan QRIS untuk membayar via {getMethodLabel()}</p>
                    <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-emerald-500/20">
                      <img src={dummyQR} alt="QR Code" className="w-48 h-48" />
                    </div>
                    <p className="text-xs text-forest-muted mt-6 text-center">
                      * Scan menggunakan aplikasi E-Wallet yang didukung dalam simulasi ini.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <DialogFooter className="w-full sm:justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50 flex-1"
                    disabled={isProcessing}
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleExternalPayment}
                    className="bg-emerald-600 text-white hover:bg-emerald-700 border-0 flex-1"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Memproses...</>
                    ) : (
                      "Saya Sudah Bayar"
                    )}
                  </Button>
                </DialogFooter>
              </motion.div>
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>

      <TopUpModal 
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onConfirm={handleTopUpSuccess}
        isProcessing={isProcessing}
      />
    </>
  );
}
