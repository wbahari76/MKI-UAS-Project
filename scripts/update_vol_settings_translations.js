const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.settings = {
  ...en.settings,
  vol_desc: "Manage your account preferences and security.",
  email_addr: "Email Address",
  notif_vol_desc: "Choose what updates you want to receive.",
  email_notifs_vol_desc: "Receive emails about new projects and events.",
  event_reminders: "Event Reminders",
  event_reminders_desc: "Get notified 24 hours before your event starts.",
  privacy_vol: "Privacy",
  privacy_vol_desc: "Control who can see your profile and activity.",
  public_profile_vol: "Public Profile",
  public_profile_vol_desc: "Allow organizations to view your volunteer history.",
  show_online: "Show Online Status",
  show_online_desc: "Let others see when you are active on the platform."
};

id.settings = {
  ...id.settings,
  vol_desc: "Kelola preferensi dan keamanan akun Anda.",
  email_addr: "Alamat Email",
  notif_vol_desc: "Pilih pembaruan yang ingin Anda terima.",
  email_notifs_vol_desc: "Terima email tentang proyek dan acara baru.",
  event_reminders: "Pengingat Acara",
  event_reminders_desc: "Dapatkan pemberitahuan 24 jam sebelum acara Anda dimulai.",
  privacy_vol: "Privasi",
  privacy_vol_desc: "Kontrol siapa yang dapat melihat profil dan aktivitas Anda.",
  public_profile_vol: "Profil Publik",
  public_profile_vol_desc: "Izinkan organisasi melihat riwayat relawan Anda.",
  show_online: "Tampilkan Status Online",
  show_online_desc: "Biarkan orang lain melihat saat Anda aktif di platform."
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Volunteer Settings translations updated successfully.');
