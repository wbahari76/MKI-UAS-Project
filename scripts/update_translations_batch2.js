const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.wallet = {
  my_wallet: "My Wallet",
  wallet_desc: "Manage your funds and view refund history from cancelled projects.",
  available_balance: "Available Balance",
  funds_available: "Funds available for withdrawal to your bank account.",
  top_up: "Top Up",
  withdraw: "Withdraw",
  transaction_history: "Transaction History",
  history_desc: "History of your refunds and withdrawals.",
  refund_received: "Refund Received",
  withdrawal: "Withdrawal",
  no_transactions: "No transactions found.",
  org_wallet: "Organization Wallet",
  org_wallet_desc: "Manage your funds, view pending balances, and withdraw to your bank account.",
  pending_balance: "Pending Balance (Escrow)",
  pending_desc: "Funds are held in escrow and will be available 24 hours after the volunteer program concludes.",
  total_withdrawn: "Total Withdrawn",
  total_withdrawn_desc: "Lifetime earnings successfully withdrawn.",
  recent_tx: "Recent Transactions",
  recent_tx_desc: "History of payments and withdrawals.",
  platform_revenue: "Platform Revenue",
  platform_revenue_desc: "Overview of platform fees collected, tips, and top ups.",
  total_revenue: "Total Revenue",
  reg_fees: "Registration Fees (10%)",
  reg_fees_desc: "Generated from paid volunteer programs.",
  platform_tips: "Platform Tips",
  platform_tips_desc: "Generous tips from volunteers.",
  global_tx: "Global Platform Transactions",
  global_tx_desc: "Recent organization credits which generated platform fees.",
  fee: "Fee",
  org_rev: "Org Rev",
  from_last_month: "from last month"
};

id.wallet = {
  my_wallet: "Dompet Saya",
  wallet_desc: "Kelola dana Anda dan lihat riwayat pengembalian dana dari proyek yang dibatalkan.",
  available_balance: "Saldo Tersedia",
  funds_available: "Dana tersedia untuk penarikan ke rekening bank Anda.",
  top_up: "Isi Saldo",
  withdraw: "Tarik Dana",
  transaction_history: "Riwayat Transaksi",
  history_desc: "Riwayat pengembalian dana dan penarikan Anda.",
  refund_received: "Pengembalian Dana Diterima",
  withdrawal: "Penarikan",
  no_transactions: "Tidak ada transaksi ditemukan.",
  org_wallet: "Dompet Organisasi",
  org_wallet_desc: "Kelola dana Anda, lihat saldo tertunda, dan tarik dana ke rekening bank Anda.",
  pending_balance: "Saldo Tertunda (Escrow)",
  pending_desc: "Dana ditahan dalam escrow dan akan tersedia 24 jam setelah program relawan selesai.",
  total_withdrawn: "Total Ditarik",
  total_withdrawn_desc: "Total pendapatan yang berhasil ditarik selama ini.",
  recent_tx: "Transaksi Terbaru",
  recent_tx_desc: "Riwayat pembayaran dan penarikan.",
  platform_revenue: "Pendapatan Platform",
  platform_revenue_desc: "Ringkasan biaya platform yang terkumpul, tip, dan isi saldo.",
  total_revenue: "Total Pendapatan",
  reg_fees: "Biaya Pendaftaran (10%)",
  reg_fees_desc: "Dihasilkan dari program relawan berbayar.",
  platform_tips: "Tip Platform",
  platform_tips_desc: "Tip dermawan dari relawan.",
  global_tx: "Transaksi Platform Global",
  global_tx_desc: "Kredit organisasi terbaru yang menghasilkan biaya platform.",
  fee: "Biaya",
  org_rev: "Pendapatan Org",
  from_last_month: "dari bulan lalu"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Batch 2 (Wallet) translations updated successfully.');
