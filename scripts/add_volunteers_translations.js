const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.volunteers = {
  title: "Volunteer Directory",
  desc: "Manage your community of approved volunteers and their records.",
  no_volunteers: "No Volunteers Found",
  no_volunteers_desc: "You don't have any approved volunteers yet.",
  joined: "Joined",
  hours: "Hours",
  rating: "Rating",
  message: "Message",
  view_profile: "View Full Profile",
  assign_project: "Assign to Project",
  issue_cert: "Issue E-Certificate",
  download_resume: "Download Resume",
  mark_inactive: "Mark as Inactive",
  mark_active: "Mark as Active",
  completed: "Completed",
  total_hours: "Total Hours",
  email: "Email",
  phone: "Phone",
  location: "Location",
  about: "About",
  skills: "Skills",
  close: "Close",
  send_cert: "Send Certificate",
  upload_cert: "Upload a certificate document for"
};

id.volunteers = {
  title: "Direktori Relawan",
  desc: "Kelola komunitas relawan yang disetujui dan catatan mereka.",
  no_volunteers: "Tidak Ada Relawan Ditemukan",
  no_volunteers_desc: "Anda belum memiliki relawan yang disetujui.",
  joined: "Bergabung",
  hours: "Jam",
  rating: "Peringkat",
  message: "Pesan",
  view_profile: "Lihat Profil Penuh",
  assign_project: "Tugaskan ke Proyek",
  issue_cert: "Terbitkan E-Sertifikat",
  download_resume: "Unduh Resume",
  mark_inactive: "Tandai Tidak Aktif",
  mark_active: "Tandai Aktif",
  completed: "Selesai",
  total_hours: "Total Jam",
  email: "Email",
  phone: "Telepon",
  location: "Lokasi",
  about: "Tentang",
  skills: "Keterampilan",
  close: "Tutup",
  send_cert: "Kirim Sertifikat",
  upload_cert: "Unggah dokumen sertifikat untuk"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Volunteers translations updated successfully.');
