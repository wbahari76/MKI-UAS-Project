"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Smartphone, CreditCard } from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
  onConfirm: (amount: number, method: string, account: string) => Promise<void>;
  isProcessing: boolean;
}

export function WithdrawalModal({ isOpen, onClose, maxAmount, onConfirm, isProcessing }: WithdrawalModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [account, setAccount] = useState<string>("");

  const handleSubmit = async () => {
    if (!amount || !method || !account) return;
    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''));
    if (numAmount > 0 && numAmount <= maxAmount) {
      await onConfirm(numAmount, method, account);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmount(val);
  };

  const isInvalidAmount = amount ? parseInt(amount) > maxAmount : false;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#181A15] border-forest-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-forest-beige">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-forest-muted">
            Transfer your available balance (Rp {maxAmount.toLocaleString('id-ID')}) to your bank or e-wallet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="method" className="text-forest-muted">Transfer Destination</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="bg-[#1E211A] border-forest-border text-forest-beige">
                <SelectValue placeholder="Select destination..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1E211A] border-forest-border text-forest-beige">
                <SelectItem value="Bank Transfer">
                  <div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-400" /> Bank Transfer (BCA, Mandiri, dll)</div>
                </SelectItem>
                <SelectItem value="GoPay">
                  <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-400" /> GoPay</div>
                </SelectItem>
                <SelectItem value="ShopeePay">
                  <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-orange-400" /> ShopeePay</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="account" className="text-forest-muted">Account / Phone Number</Label>
            <Input 
              id="account" 
              placeholder="e.g. 081234567890 or 12345678" 
              className="bg-[#1E211A] border-forest-border text-forest-beige"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-forest-muted">Amount (Rp)</Label>
            <Input 
              id="amount" 
              placeholder="Enter amount" 
              className={`bg-[#1E211A] text-forest-beige ${isInvalidAmount ? 'border-red-500' : 'border-forest-border'}`}
              value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
              onChange={handleAmountChange}
            />
            {isInvalidAmount && (
              <span className="text-xs text-red-400">Amount exceeds available balance.</span>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-forest-border text-forest-beige hover:bg-forest-border/50"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-emerald-600 text-white hover:bg-emerald-700 border-0"
            disabled={!amount || !method || !account || isInvalidAmount || isProcessing}
          >
            {isProcessing ? "Processing..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
