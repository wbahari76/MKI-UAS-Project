const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.subscription = {
  title: "Choose Your Scale of Goodness",
  desc: "Increase your volunteer management capacity and maximize the social impact of every initiative your organization takes.",
  current_plan: "Current Plan",
  most_popular: "Most Popular",
  free: "Free",
  per_month: "/ month",
  upgrade_pro: "Upgrade to Pro",
  upgrade_enterprise: "Upgrade to Enterprise",
  security_title: "Security & Trust",
  security_desc: "Payments are processed securely. You can cancel your subscription at any time without additional charges.",
  starter: {
    name: "Starter Plan",
    desc: "Perfect for communities or small-scale social projects.",
    feat1: "Access to 1 Active Event",
    feat1_desc: "Limit to one project to keep focus.",
    feat2: "Basic Volunteer Management",
    feat2_desc: "Volunteer registration through platform.",
    feat3: "Organization Profile",
    feat3_desc: "Basic profile page to showcase vision."
  },
  pro: {
    name: "Pro Plan",
    desc: "Designed for event managers needing deeper data.",
    feat1: "Access up to 10 Events",
    feat1_desc: "More flexible for campus orgs or foundations.",
    feat2: "Advanced Impact Dashboard",
    feat2_desc: "Detailed performance metric visualization.",
    feat3: "Manage up to 50 Volunteers",
    feat3_desc: "More organized coordination features.",
    feat4: "Priority Support",
    feat4_desc: "Faster assistance for system issues."
  },
  enterprise: {
    name: "Enterprise Plan",
    desc: "Complete solution for large orgs or CSR collabs.",
    feat1: "Unlimited Events",
    feat1_desc: "Supports national scale social campaigns.",
    feat2: "Full Analytics & Reporting",
    feat2_desc: "Exportable impact reports (PDF/Excel).",
    feat3: "Unlimited Volunteers",
    feat3_desc: "Coordination system for large scale.",
    feat4: "Dedicated Account Manager",
    feat4_desc: "Special assistance for every project."
  }
};

id.subscription = {
  title: "Pilih Paket Skala Kebaikan Anda",
  desc: "Tingkatkan kapasitas manajemen relawan dan maksimalkan dampak sosial dari setiap inisiatif organisasi Anda.",
  current_plan: "Paket Saat Ini",
  most_popular: "Paling Populer",
  free: "Gratis",
  per_month: "/ bulan",
  upgrade_pro: "Tingkatkan ke Pro",
  upgrade_enterprise: "Tingkatkan ke Enterprise",
  security_title: "Keamanan & Kepercayaan",
  security_desc: "Pembayaran diproses secara aman. Anda dapat membatalkan langganan kapan saja tanpa biaya tambahan.",
  starter: {
    name: "Starter Plan",
    desc: "Cocok untuk komunitas atau proyek sosial skala kecil.",
    feat1: "Akses ke 1 Event Aktif",
    feat1_desc: "Batasan untuk satu proyek agar fokus.",
    feat2: "Manajemen Relawan Dasar",
    feat2_desc: "Pendaftaran relawan melalui platform.",
    feat3: "Profil Organisasi",
    feat3_desc: "Halaman profil dasar untuk menampilkan visi."
  },
  pro: {
    name: "Pro Plan",
    desc: "Dirancang untuk pengelola acara yang membutuhkan data lebih dalam.",
    feat1: "Akses hingga 10 Event",
    feat1_desc: "Lebih fleksibel untuk organisasi kampus atau yayasan.",
    feat2: "Dashboard Dampak (Advanced)",
    feat2_desc: "Visualisasi metrik kinerja yang detail.",
    feat3: "Manajemen Relawan hingga 50 orang",
    feat3_desc: "Fitur koordinasi yang lebih terorganisir.",
    feat4: "Prioritas Dukungan",
    feat4_desc: "Layanan bantuan lebih cepat jika ada kendala sistem."
  },
  enterprise: {
    name: "Enterprise Plan",
    desc: "Solusi lengkap untuk organisasi besar atau kolaborasi CSR perusahaan.",
    feat1: "Event Tak Terbatas",
    feat1_desc: "Mendukung kampanye sosial berskala nasional.",
    feat2: "Full Analytics & Reporting",
    feat2_desc: "Laporan dampak yang bisa diekspor (PDF/Excel).",
    feat3: "Manajemen Relawan Tak Terbatas",
    feat3_desc: "Sistem koordinasi untuk skala besar.",
    feat4: "Dedicated Account Manager",
    feat4_desc: "Pendampingan khusus untuk setiap proyek."
  }
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Subscription translations updated successfully.');
