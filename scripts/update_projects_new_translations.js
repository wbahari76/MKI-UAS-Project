const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.projects = {
  ...en.projects,
  category_env: "Environment",
  category_edu: "Education",
  category_health: "Health",
  category_social: "Social",
  category_placeholder: "Select category",
  wallet: "JALA VIVE Wallet",
  ewallet: "E-Wallet (OVO, DANA)",
  qris: "QRIS",
  va: "Virtual Account (VA)",
  err_required: "Please complete all required fields.",
  err_type: "Please select a program type.",
  err_fee: "Please enter a registration fee and select at least one payment method.",
  err_tip_method: "Please select a payment method for the tip.",
  err_login: "You must be logged in to create a program.",
  err_create_org: "Failed to create organization profile.",
  err_create_proj: "Failed to create program",
  success_proj: "Program successfully submitted for verification!",
  location_ph: "Kuta Beach, Bali",
  contact_name_ph: "John Doe",
  email_ph: "email@organization.com"
};

id.projects = {
  ...id.projects,
  category_env: "Lingkungan",
  category_edu: "Pendidikan",
  category_health: "Kesehatan",
  category_social: "Sosial",
  category_placeholder: "Pilih kategori",
  wallet: "Dompet JALA VIVE",
  ewallet: "E-Wallet (OVO, DANA)",
  qris: "QRIS",
  va: "Virtual Account (VA)",
  err_required: "Mohon lengkapi semua field wajib di langkah ini.",
  err_type: "Mohon pilih tipe program.",
  err_fee: "Mohon isi biaya registrasi dan pilih minimal satu metode pembayaran.",
  err_tip_method: "Mohon pilih metode pembayaran untuk tip.",
  err_login: "Anda harus login untuk membuat program.",
  err_create_org: "Gagal membuat profil organisasi.",
  err_create_proj: "Gagal membuat program",
  success_proj: "Program berhasil diajukan untuk verifikasi!",
  location_ph: "Pantai Kuta, Bali",
  contact_name_ph: "Putri Lestari",
  email_ph: "email@organisasi.com"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Projects new page translations updated successfully.');
