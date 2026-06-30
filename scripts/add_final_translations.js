const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

// Nav additional
en.nav = {
  ...en.nav,
  search_placeholder: "Search projects, organizations, events...",
  quick_links: "Quick Links",
  edu_projects: "Education Projects",
  this_week: "This Week",
  press: "Press",
  to_close: "to close",
  profile: "Profile",
  signout: "Sign Out"
};

id.nav = {
  ...id.nav,
  search_placeholder: "Cari proyek, organisasi, acara...",
  quick_links: "Tautan Cepat",
  edu_projects: "Proyek Edukasi",
  this_week: "Minggu Ini",
  press: "Tekan",
  to_close: "untuk menutup",
  profile: "Profil",
  signout: "Keluar"
};

// Volunteer additional
en.volunteers = {
  ...en.volunteers,
  search_placeholder: "Search by name or skills...",
  cert_file: "Certificate File (PDF, PNG, JPG)",
  selected: "Selected:"
};

id.volunteers = {
  ...id.volunteers,
  search_placeholder: "Cari berdasarkan nama atau keahlian...",
  cert_file: "File Sertifikat (PDF, PNG, JPG)",
  selected: "Terpilih:"
};

// Communities additional
en.communities = {
  ...en.communities,
  indonesia: "Indonesia",
  no_description: "No description provided."
};

id.communities = {
  ...id.communities,
  indonesia: "Indonesia",
  no_description: "Tidak ada deskripsi yang diberikan."
};

// Volunteer Dash additional
en.vol_dash = {
  ...en.vol_dash,
  explore_projects: "Explore Projects"
};

id.vol_dash = {
  ...id.vol_dash,
  explore_projects: "Jelajahi Proyek"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Final translations updated successfully.');
