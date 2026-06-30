const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.settings = {
  ...en.settings,
  org_profile_desc: "Update your public facing organization details.",
  org_name: "Organization Name",
  contact_email: "Contact Email Address",
  email_managed: "Your email is managed by your authentication provider.",
  security_desc: "Update your password and secure your account.",
  new_password: "New Password",
  confirm_password: "Confirm Password",
  notif_desc: "Choose what updates your organization receives.",
  email_notifs: "Email Notifications",
  email_notifs_desc: "Receive general platform updates and digests.",
  new_apps: "New Applications",
  new_apps_desc: "Get notified when a volunteer applies to your projects.",
  messages_notif_desc: "Receive notifications for new direct messages.",
  privacy_visibility: "Privacy & Visibility",
  privacy_desc: "Control how your organization appears to others.",
  public_dir: "Public Directory",
  public_dir_desc: "Allow volunteers to find your organization in the directory.",
  show_volunteers: "Show Volunteer Count",
  show_volunteers_desc: "Display the total number of volunteers you've worked with publicly."
};

id.settings = {
  ...id.settings,
  org_profile_desc: "Perbarui detail organisasi publik Anda.",
  org_name: "Nama Organisasi",
  contact_email: "Alamat Email Kontak",
  email_managed: "Email Anda dikelola oleh penyedia autentikasi Anda.",
  security_desc: "Perbarui kata sandi dan amankan akun Anda.",
  new_password: "Kata Sandi Baru",
  confirm_password: "Konfirmasi Kata Sandi",
  notif_desc: "Pilih pembaruan apa yang diterima organisasi Anda.",
  email_notifs: "Notifikasi Email",
  email_notifs_desc: "Terima pembaruan platform umum dan ringkasan.",
  new_apps: "Aplikasi Baru",
  new_apps_desc: "Dapatkan pemberitahuan saat relawan mendaftar ke proyek Anda.",
  messages_notif_desc: "Terima pemberitahuan untuk pesan langsung baru.",
  privacy_visibility: "Privasi & Visibilitas",
  privacy_desc: "Kontrol bagaimana organisasi Anda tampil untuk orang lain.",
  public_dir: "Direktori Publik",
  public_dir_desc: "Izinkan relawan menemukan organisasi Anda di direktori.",
  show_volunteers: "Tampilkan Jumlah Relawan",
  show_volunteers_desc: "Tampilkan total jumlah relawan yang telah bekerja sama dengan Anda secara publik."
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Settings translations updated successfully.');
