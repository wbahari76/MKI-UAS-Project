const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

// Explore
en.explore = {
  ...en.explore,
  title_highlight: "Opportunities",
  search_placeholder: "Search by name or location...",
  filter_type: "Filter Type",
  free_volunteering: "Free Volunteering",
  paid_programs: "Paid Programs",
  all_projects: "All Projects",
  no_projects: "No Projects Found",
  no_projects_desc: "We couldn't find any projects matching your search. Try adjusting your filters.",
  sign_in_apply: "Sign In to Apply",
  project_full: "Project Full"
};
id.explore = {
  ...id.explore,
  title_highlight: "Peluang",
  search_placeholder: "Cari berdasarkan nama atau lokasi...",
  filter_type: "Filter Tipe",
  free_volunteering: "Relawan Gratis",
  paid_programs: "Program Berbayar",
  all_projects: "Semua Proyek",
  no_projects: "Tidak Ada Proyek Ditemukan",
  no_projects_desc: "Kami tidak dapat menemukan proyek yang sesuai dengan pencarian Anda. Coba ubah filter Anda.",
  sign_in_apply: "Masuk untuk Mendaftar",
  project_full: "Kuota Penuh"
};

// Events
en.events = {
  ...en.events,
  title_highlight: "Events",
  search_placeholder: "Search events by name or location...",
  date: "Date",
  location: "Location",
  spots_left: "Spots Left",
  view_event: "View Event"
};
id.events = {
  ...id.events,
  title_highlight: "Acara",
  search_placeholder: "Cari acara berdasarkan nama atau lokasi...",
  date: "Tanggal",
  location: "Lokasi",
  spots_left: "Tempat Tersisa",
  view_event: "Lihat Acara"
};

// Communities
en.communities = {
  ...en.communities,
  search_placeholder: "Search organizations by name or city..."
};
id.communities = {
  ...id.communities,
  search_placeholder: "Cari organisasi berdasarkan nama atau kota..."
};

// About and Partnership seems complete but just in case
en.about = { ...en.about, team_title: "The People Behind" };
id.about = { ...id.about, team_title: "The People Behind" };

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Public page translations updated successfully.');
