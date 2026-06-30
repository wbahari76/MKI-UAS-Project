"use client";

import React, { useEffect, useState } from "react";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, CheckCircle2, History, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { WithdrawalModal } from "@/components/ui/WithdrawalModal";
import { TopUpModal } from "@/components/ui/TopUpModal";
import { useTranslation } from "react-i18next";

export default function WalletPage() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      if (!user) return;
      try {
        const { data: org } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (org) {
          // Fetch from Supabase
          const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('*')
            .eq('organization_id', org.id)
            .maybeSingle();
            
          if (walletData) {
            setWallet(walletData);
            // Fetch transactions
            const { data: txData } = await supabase
              .from('wallet_transactions')
              .select('*')
              .eq('wallet_id', walletData.id)
              .order('created_at', { ascending: false });
            setTransactions(txData || []);
          } else {
            // No wallet yet, it's fine, show zeros
            setWallet({ pending_balance: 0, available_balance: 0, total_withdrawn: 0 });
            setTransactions([]);
          }
        }
      } catch (err) {
        console.error("Error fetching wallet:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWallet();
  }, [user]);

  const handleWithdraw = async (amount: number, method: string, account: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('withdraw_org_wallet', {
        p_org_id: wallet.organization_id,
        p_amount: amount,
        p_destination: method,
        p_account: account
      });
      if (error) throw error;
      
      toast.success(`Successfully withdrew Rp ${amount.toLocaleString('id-ID')} to ${method}`);
      setIsWithdrawModalOpen(false);
      
      // Update local state for immediate feedback
      setWallet((prev: any) => ({
        ...prev,
        available_balance: prev.available_balance - amount,
        total_withdrawn: (prev.total_withdrawn || 0) + amount
      }));
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'withdrawal',
        status: 'completed',
        description: `Withdrawal to ${method} (${account})`,
        created_at: new Date().toISOString()
      }, ...prev]);
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTopUp = async (amount: number, method: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase.rpc('top_up_org_wallet', {
        p_org_id: wallet.organization_id,
        p_amount: amount,
        p_method: method
      });
      if (error) throw error;
      
      toast.success(`Successfully topped up Rp ${amount.toLocaleString('id-ID')} via ${method}`);
      setIsTopUpModalOpen(false);
      
      // Update local state
      setWallet((prev: any) => ({
        ...prev,
        available_balance: (prev?.available_balance || 0) + amount
      }));
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'credit',
        status: 'completed',
        description: `Top Up via ${method}`,
        created_at: new Date().toISOString()
      }, ...prev]);
    } catch (err: any) {
      console.error(err);
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
          <Wallet className="w-8 h-8 text-emerald-400" /> {t("wallet.org_wallet")}
        </h1>
        <p className="text-forest-muted mt-1">{t("wallet.org_wallet_desc")}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-forest-card border-forest-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-medium text-sm">{t("wallet.available_balance")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-beige">
                Rp {wallet?.available_balance?.toLocaleString('id-ID') || '0'}
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setIsTopUpModalOpen(true)} className="w-full bg-forest-accent hover:bg-forest-accent/90 text-forest-card border-0">
                  {t("wallet.top_up")}
                </Button>
                <Button onClick={() => setIsWithdrawModalOpen(true)} disabled={!wallet || wallet.available_balance <= 0} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  {t("wallet.withdraw")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-[#181A15] border-forest-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium text-sm">{t("wallet.pending_balance")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-beige">
                Rp {wallet?.pending_balance?.toLocaleString('id-ID') || '0'}
              </div>
              <p className="text-xs text-forest-muted mt-4">
                {t("wallet.pending_desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-forest-card border-forest-border opacity-70">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <History className="w-4 h-4" />
                <h3 className="font-medium text-sm">{t("wallet.total_withdrawn")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-muted">
                Rp {wallet?.total_withdrawn?.toLocaleString('id-ID') || '0'}
              </div>
              <p className="text-xs text-forest-muted mt-4">{t("wallet.total_withdrawn_desc")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <WithdrawalModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        maxAmount={wallet?.available_balance || 0}
        onConfirm={handleWithdraw}
        isProcessing={isProcessing}
      />
      <TopUpModal 
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onConfirm={handleTopUp}
        isProcessing={isProcessing}
      />

      {/* Transactions */}
      <Card className="border-0 shadow-sm shadow-forest-border/20 bg-forest-card">
        <CardHeader>
          <CardTitle className="text-forest-beige">{t("wallet.recent_tx")}</CardTitle>
          <CardDescription className="text-forest-muted">{t("wallet.recent_tx_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-forest-muted">
              <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{t("wallet.no_transactions")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-[#181A15] border border-forest-border">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-forest-beige">{tx.description}</p>
                      <div className="flex items-center gap-2 text-xs text-forest-muted">
                        <span>{format(new Date(tx.created_at), "MMM d, yyyy h:mm a")}</span>
                        <span>•</span>
                        <span className={`capitalize ${
                          tx.status === 'completed' ? 'text-emerald-400' : 
                          tx.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-forest-beige'}`}>
                    {tx.type === 'credit' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
