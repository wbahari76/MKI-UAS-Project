const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.admin = en.admin || {};
en.admin.projects = {
  title: "Manage Projects",
  desc: "Review new projects, manage events, and handle reported content.",
  search: "Search projects...",
  tab_all: "All Projects",
  tab_pending: "Pending Review (Drafts)",
  tab_reported: "Reported",
  col_details: "Project Details",
  col_org: "Organization",
  col_date: "Date",
  col_status: "Status",
  col_actions: "Actions",
  no_projects: "No projects found.",
  approve: "Approve & Publish",
  reject: "Reject Project",
  view_details: "View Details"
};

id.admin = id.admin || {};
id.admin.projects = {
  title: "Kelola Proyek",
  desc: "Tinjau proyek baru, kelola acara, dan tangani konten yang dilaporkan.",
  search: "Cari proyek...",
  tab_all: "Semua Proyek",
  tab_pending: "Menunggu Tinjauan (Draf)",
  tab_reported: "Dilaporkan",
  col_details: "Detail Proyek",
  col_org: "Organisasi",
  col_date: "Tanggal",
  col_status: "Status",
  col_actions: "Aksi",
  no_projects: "Tidak ada proyek ditemukan.",
  approve: "Setujui & Publikasikan",
  reject: "Tolak Proyek",
  view_details: "Lihat Detail"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Admin projects translations added successfully.');
