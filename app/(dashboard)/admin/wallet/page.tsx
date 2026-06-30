"use client";

import React, { useEffect, useState } from "react";
import { Wallet, ArrowDownRight, TrendingUp, History, Activity, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { WithdrawalModal } from "@/components/ui/WithdrawalModal";
import { TopUpModal } from "@/components/ui/TopUpModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function AdminWalletPage() {
  const { t } = useTranslation("common");
  const [platformRevenue, setPlatformRevenue] = useState(0);
  const [totalTips, setTotalTips] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [totalTopup, setTotalTopup] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchAdminWalletData() {
      try {
        const { data, error } = await supabase.rpc('get_admin_wallet_data');
        if (error) throw error;
        
        if (data) {
          const { transactions, platform_tips, total_withdrawn, total_topup } = data as any;
          setTotalTips(Number(platform_tips) || 0);
          setTotalWithdrawn(Number(total_withdrawn) || 0);
          setTotalTopup(Number(total_topup) || 0);
          
          const feesSum = transactions.reduce((acc: number, curr: any) => acc + Math.floor(Number(curr.amount) / 9), 0);
          setPlatformRevenue(feesSum);
          setTransactions(transactions);
        }
      } catch (err) {
        console.error("Error fetching admin wallet data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAdminWalletData();
  }, []);

  const handleWithdraw = async (amount: number, method: string, account: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('withdraw_admin_wallet', {
        p_amount: amount,
        p_destination: method,
        p_account: account
      });
      if (error) throw error;
      
      toast.success(`Successfully withdrew Rp ${amount.toLocaleString('id-ID')} to ${method}`);
      setIsWithdrawModalOpen(false);
      
      // Update local state for immediate feedback
      setTotalWithdrawn(prev => prev + amount);
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'withdrawal',
        status: 'completed',
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase.rpc('top_up_admin_wallet', {
        p_amount: amount,
        p_method: method
      });
      if (error) throw error;
      
      toast.success(`Successfully topped up Rp ${amount.toLocaleString('id-ID')} via ${method}`);
      setIsTopUpModalOpen(false);
      
      // Update local state for immediate feedback
      setTotalTopup(prev => prev + amount);
      setTransactions(prev => [{
        id: Math.random().toString(),
        amount: amount,
        type: 'credit',
        status: 'completed',
        description: `Top Up via ${method}`,
        created_at: new Date().toISOString()
      }, ...prev]);
      
    } catch (err: any) {
      toast.error(err.message || "Failed to process top up");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-accent"></div></div>;
  }

  const totalEarnings = platformRevenue + totalTips + totalTopup;
  const availableBalance = totalEarnings - totalWithdrawn;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-forest-beige tracking-tight flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-400" /> {t("wallet.platform_revenue")}
          </h1>
          <p className="text-forest-muted mt-1">{t("wallet.platform_revenue_desc")}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsTopUpModalOpen(true)} className="bg-forest-accent hover:bg-forest-accent/90 text-forest-card border-0 flex-1 sm:flex-none">
            {t("wallet.top_up")}
          </Button>
          <Button onClick={() => setIsWithdrawModalOpen(true)} disabled={availableBalance <= 0} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 flex-1 sm:flex-none">
            {t("wallet.withdraw")}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-forest-card border-forest-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <h3 className="font-medium text-sm">{t("wallet.total_revenue")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-beige">
                Rp {totalEarnings.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-4 bg-emerald-400/10 w-fit px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12% {t("wallet.from_last_month")}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-[#181A15] border-forest-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-medium text-sm">{t("wallet.reg_fees")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-beige">
                Rp {platformRevenue.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-forest-muted mt-4">
                {t("wallet.reg_fees_desc")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-[#181A15] border-forest-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-forest-muted mb-2">
                <History className="w-4 h-4 text-purple-400" />
                <h3 className="font-medium text-sm">{t("wallet.platform_tips")}</h3>
              </div>
              <div className="text-3xl font-bold text-forest-beige">
                Rp {totalTips.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-forest-muted mt-4">{t("wallet.platform_tips_desc")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Global Transactions Feed */}
      <Card className="border-0 shadow-sm shadow-forest-border/20 bg-forest-card">
        <CardHeader>
          <CardTitle className="text-forest-beige">{t("wallet.global_tx")}</CardTitle>
          <CardDescription className="text-forest-muted">{t("wallet.global_tx_desc")}</CardDescription>
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                      <ArrowDownRight className="w-5 h-5" />
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
                  <div className="text-right">
                    <div className="font-bold text-forest-beige">
                      {t("wallet.fee")}: Rp {Math.floor(tx.amount / 9).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-forest-muted">
                      {t("wallet.org_rev")}: Rp {tx.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <WithdrawalModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        maxAmount={availableBalance}
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
