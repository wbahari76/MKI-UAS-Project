const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.community = {
  title: "Community",
  desc: "Connect, share, and discuss with fellow volunteers.",
  join_discussion: "Join Discussion",
  start_post: "Start a Post",
  recent_discussions: "Recent Discussions",
  no_discussions: "No discussions yet. Be the first to start one!"
};

id.community = {
  title: "Komunitas",
  desc: "Terhubung, berbagi, dan berdiskusi dengan sesama relawan.",
  join_discussion: "Ikut Diskusi",
  start_post: "Mulai Postingan",
  recent_discussions: "Diskusi Terbaru",
  no_discussions: "Belum ada diskusi. Jadilah yang pertama memulai!"
};

en.events = {
  title: "Events",
  desc: "Discover and participate in upcoming volunteer events.",
  upcoming: "Upcoming Events",
  past: "Past Events",
  register: "Register",
  no_events: "No upcoming events found."
};

id.events = {
  title: "Acara",
  desc: "Temukan dan ikuti acara kerelawanan yang akan datang.",
  upcoming: "Acara Mendatang",
  past: "Acara Berlalu",
  register: "Daftar",
  no_events: "Tidak ada acara mendatang yang ditemukan."
};

en.settings = {
  title: "Settings",
  desc: "Manage your account settings and preferences.",
  profile: "Profile Settings",
  notifications: "Notifications",
  security: "Security",
  save: "Save Changes"
};

id.settings = {
  title: "Pengaturan",
  desc: "Kelola pengaturan dan preferensi akun Anda.",
  profile: "Pengaturan Profil",
  notifications: "Notifikasi",
  security: "Keamanan",
  save: "Simpan Perubahan"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Batch 4 translations updated successfully.');
