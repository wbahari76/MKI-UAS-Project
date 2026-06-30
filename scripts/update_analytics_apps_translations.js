const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.analytics = {
  ...en.analytics,
  this_month: "this month"
};

id.analytics = {
  ...id.analytics,
  this_month: "bulan ini"
};

en.applications = {
  ...en.applications,
  pending: "Pending",
  cancel: "Cancel",
  view_subscription: "View Subscription",
  pro_feat1: "Unlimited Volunteers per Project",
  pro_feat2: "Unlimited Active Applications",
  pro_feat3: "AI Volunteer Matching",
  pro_feat4: "Export Volunteer Data",
  limit_volunteers: "You have reached the maximum limit of 20 volunteers per project on the Free plan.",
  limit_active: "You have reached the maximum limit of 50 active applications on the Free plan.",
  applied_for: "Applied for",
  filter_all_projects: "All Projects"
};

id.applications = {
  ...id.applications,
  pending: "Menunggu",
  cancel: "Batal",
  view_subscription: "Lihat Berlangganan",
  pro_feat1: "Relawan Tanpa Batas per Proyek",
  pro_feat2: "Aplikasi Aktif Tanpa Batas",
  pro_feat3: "Pencocokan Relawan AI",
  pro_feat4: "Ekspor Data Relawan",
  limit_volunteers: "Anda telah mencapai batas maksimum 20 relawan per proyek pada paket Gratis.",
  limit_active: "Anda telah mencapai batas maksimum 50 aplikasi aktif pada paket Gratis.",
  applied_for: "Mendaftar untuk",
  filter_all_projects: "Semua Proyek"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Analytics & Apps translations updated successfully.');
