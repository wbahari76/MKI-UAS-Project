"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Smartphone, CreditCard, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, method: string) => Promise<void>;
  isProcessing: boolean;
}

export function TopUpModal({ isOpen, onClose, onConfirm, isProcessing }: TopUpModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Generate dummy VA or QR payload based on amount
  const dummyVA = "8273 " + Math.floor(10000000 + Math.random() * 90000000).toString();
  const dummyQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TopUp_${amount}_${method}`;

  const handleNext = () => {
    if (!amount || !method) return;
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    if (numAmount > 0) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    await onConfirm(numAmount, method);
    
    // Reset state after success (assuming onConfirm handles closing or we close it here)
    // onClose will be called by parent on success, but just in case:
    setTimeout(() => {
      setStep(1);
      setAmount("");
      setMethod("");
    }, 500);
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setMethod("");
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmount(val);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-forest-beige">
            {step === 1 ? "Top Up Wallet" : "Complete Payment"}
          </DialogTitle>
          <DialogDescription className="text-forest-muted">
            {step === 1 
              ? "Add funds to your wallet balance." 
              : `Follow the instructions below to pay Rp ${parseInt(amount).toLocaleString('id-ID')}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="topup-amount" className="text-forest-muted">Top Up Amount (Rp)</Label>
                <Input 
                  id="topup-amount" 
                  placeholder="e.g. 50000" 
                  className="bg-[#1E211A] border-forest-border text-forest-beige text-lg"
                  value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                  onChange={handleAmountChange}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2 mt-2">
                <Label htmlFor="topup-method" className="text-forest-muted">Payment Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="bg-[#1E211A] border-forest-border text-forest-beige">
                    <SelectValue placeholder="Select payment method..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E211A] border-forest-border text-forest-beige">
                    <SelectItem value="Bank Transfer">
                      <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-400" /> Virtual Account (BCA, Mandiri)</div>
                    </SelectItem>
                    <SelectItem value="GoPay">
                      <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-400" /> GoPay (QRIS)</div>
                    </SelectItem>
                    <SelectItem value="ShopeePay">
                      <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-orange-400" /> ShopeePay (QRIS)</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 border-0"
                  disabled={!amount || !method || isProcessing}
                >
                  Continue
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="py-6 flex flex-col items-center justify-center text-center space-y-6"
            >
              {method === "Bank Transfer" ? (
                <div className="w-full bg-[#1E211A] border border-forest-border rounded-lg p-6 flex flex-col items-center">
                  <Landmark className="w-12 h-12 text-emerald-400 mb-4" />
                  <p className="text-forest-muted text-sm mb-2">Transfer to Virtual Account</p>
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
                    * This is a simulated Virtual Account for testing purposes.
                  </p>
                </div>
              ) : (
                <div className="w-full bg-[#1E211A] border border-forest-border rounded-lg p-6 flex flex-col items-center">
                  <p className="text-forest-muted text-sm mb-4">Scan QRIS to Pay using {method}</p>
                  <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-emerald-500/20">
                    <img src={dummyQR} alt="QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-xs text-forest-muted mt-6 text-center">
                    * Scan using any supported E-Wallet app in this simulation.
                  </p>
                </div>
              )}

              <DialogFooter className="w-full sm:justify-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50 flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 border-0 flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "I Have Paid"}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
