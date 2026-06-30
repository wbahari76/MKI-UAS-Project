const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.explore = {
  title: "Explore Programs",
  desc: "Find and join volunteer opportunities that match your interests.",
  search: "Search by name or location...",
  all_categories: "All Categories",
  no_programs: "No programs found matching your search.",
  joined: "Joined",
  view_details: "View Details",
  about_org: "About Organization",
  org_since: "Member since",
  requirements: "Requirements",
  perks: "Perks & Benefits",
  program_info: "Program Information",
  apply_now: "Apply Now",
  project_full: "Project Full",
  application_submitted: "Application Submitted",
  already_applied: "You have already applied for this program.",
  fill_application: "Fill Application Form",
  cover_letter: "Cover Letter / Why do you want to join?",
  cover_letter_ph: "Tell us about your motivation...",
  submit_application: "Submit Application",
  processing: "Processing...",
  reg_fee: "Registration Fee",
  choose_payment: "Choose Payment Method",
  pay_with: "Pay with",
  proceed_payment: "Proceed to Payment",
  volunteers_needed: "Volunteers Needed",
  deadline: "Registration Deadline"
};

id.explore = {
  title: "Eksplorasi Program",
  desc: "Temukan dan ikuti kesempatan relawan yang sesuai dengan minat Anda.",
  search: "Cari berdasarkan nama atau lokasi...",
  all_categories: "Semua Kategori",
  no_programs: "Tidak ada program yang sesuai dengan pencarian Anda.",
  joined: "Tergabung",
  view_details: "Lihat Detail",
  about_org: "Tentang Organisasi",
  org_since: "Bergabung sejak",
  requirements: "Persyaratan",
  perks: "Keuntungan & Manfaat",
  program_info: "Informasi Program",
  apply_now: "Daftar Sekarang",
  project_full: "Kuota Penuh",
  application_submitted: "Pendaftaran Terkirim",
  already_applied: "Anda sudah mendaftar untuk program ini.",
  fill_application: "Isi Formulir Pendaftaran",
  cover_letter: "Surat Motivasi / Mengapa Anda ingin bergabung?",
  cover_letter_ph: "Ceritakan tentang motivasi Anda...",
  submit_application: "Kirim Pendaftaran",
  processing: "Memproses...",
  reg_fee: "Biaya Registrasi",
  choose_payment: "Pilih Metode Pembayaran",
  pay_with: "Bayar dengan",
  proceed_payment: "Lanjut ke Pembayaran",
  volunteers_needed: "Relawan Dibutuhkan",
  deadline: "Batas Pendaftaran"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Explore translations added successfully.');
