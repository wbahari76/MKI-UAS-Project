"use client";

import React, { useEffect, useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, History, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { WithdrawalModal } from "@/components/ui/WithdrawalModal";
import { TopUpModal } from "@/components/ui/TopUpModal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function VolunteerWalletPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      if (!user) return;
      try {
        const { data: walletData } = await supabase
          .from('user_wallets')
          .select('id, balance')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setBalance(walletData.balance);
          
          const { data: txData } = await supabase
            .from('user_wallet_transactions')
            .select('*')
            .eq('wallet_id', walletData.id)
            .order('created_at', { ascending: false });
            
          if (txData) setTransactions(txData);
        }
      } catch (err) {
        console.error("Error fetching user wallet:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchWallet();
  }, [user]);

  const handleWithdraw = async (amount: number, method: string, account: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('withdraw_user_wallet', {
        p_user_id: user?.id,
        p_amount: amount,
        p_destination: method,
        p_account: account
      });
      if (error) throw error;
      
      toast.success(`Successfully withdrew Rp ${amount.toLocaleString('id-ID')} to ${method}`);
      setIsWithdrawModalOpen(false);
      setBalance(prev => prev - amount);
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'withdrawal',
        description: `Withdrawal to ${method} (${account})`,
        created_at: new Date().toISOString()
      }, ...prev]);
    } catch (err: any) {
      toast.error(err.message || "Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopUp = async (amount: number, method: string) => {
    setIsProcessing(true);
    try {
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase.rpc('top_up_user_wallet', {
        p_user_id: user?.id,
        p_amount: amount,
        p_method: method
      });
      if (error) throw error;
      
      toast.success(`Successfully topped up Rp ${amount.toLocaleString('id-ID')} via ${method}`);
      setIsTopUpModalOpen(false);
      setBalance(prev => prev + amount);
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'credit',
        description: `Top Up via ${method}`,
        created_at: new Date().toISOString()
      }, ...prev]);
    } catch (err: any) {
      toast.error(err.message || "Failed to top up wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-accent"></div></div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-forest-beige tracking-tight flex items-center gap-2">
          <Wallet className="w-8 h-8 text-emerald-400" /> {t("wallet.my_wallet")}
        </h1>
        <p className="text-forest-muted mt-1">{t("wallet.wallet_desc")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-forest-card border-forest-border h-full">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-forest-muted mb-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-medium text-sm">{t("wallet.available_balance")}</h3>
                </div>
                <div className="text-4xl font-bold text-forest-beige">
                  Rp {balance.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-forest-muted mt-2">
                  {t("wallet.funds_available")}
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={() => setIsTopUpModalOpen(true)} className="w-full bg-forest-accent hover:bg-forest-accent/90 text-forest-card border-0">
                  {t("wallet.top_up")}
                </Button>
                <Button onClick={() => setIsWithdrawModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0" disabled={balance <= 0}>
                  {t("wallet.withdraw")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-[#181A15] border-forest-border">
          <CardHeader>
            <CardTitle className="text-forest-beige flex items-center gap-2">
              <History className="w-5 h-5 text-forest-muted" /> {t("wallet.transaction_history")}
            </CardTitle>
            <CardDescription className="text-forest-muted">
              {t("wallet.history_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-forest-card/50 border border-forest-border/50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-forest-beige">{tx.description || (tx.type === 'credit' ? t("wallet.refund_received") : t("wallet.withdrawal"))}</p>
                        <p className="text-xs text-forest-muted">
                          {format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className={`font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tx.type === 'credit' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-forest-muted/50 mx-auto mb-4" />
                <p className="text-forest-muted">{t("wallet.no_transactions")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <WithdrawalModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        maxAmount={balance}
        onConfirm={handleWithdraw}
        isProcessing={isProcessing}
      />

      <TopUpModal 
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onConfirm={handleTopUp}
        isProcessing={isProcessing}
      />
    </div>
  );
}
