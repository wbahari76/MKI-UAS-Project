const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.vol_dash = {
  total_hours: "Total Hours",
  active_projects: "Active Projects",
  certificates: "Certificates",
  impact_points: "Impact Points",
  your_projects: "Your Projects",
  view_all: "View All",
  unknown_project: "Unknown Project",
  unknown_org: "Unknown Organization",
  status: "Status",
  no_active_projects: "No Active Projects",
  no_active_projects_desc: "You haven't applied to any projects yet. Start exploring to make an impact!",
  explore_projects: "Explore Projects",
  next_event: "Next Event",
  tomorrow: "Tomorrow",
  join_event: "Join Event",
  recent_activity: "Recent Activity",
  applied_for: "Applied for",
  status_updated: "Status updated for",
  welcome_jala: "Welcome to JALA VIVE!",
  journey_starts: "Your journey starts here.",
  today: "Today"
};

id.vol_dash = {
  total_hours: "Total Jam",
  active_projects: "Proyek Aktif",
  certificates: "Sertifikat",
  impact_points: "Poin Dampak",
  your_projects: "Proyek Anda",
  view_all: "Lihat Semua",
  unknown_project: "Proyek Tidak Diketahui",
  unknown_org: "Organisasi Tidak Diketahui",
  status: "Status",
  no_active_projects: "Tidak Ada Proyek Aktif",
  no_active_projects_desc: "Anda belum mendaftar ke proyek apa pun. Mulailah menjelajah untuk membuat dampak!",
  explore_projects: "Jelajahi Proyek",
  next_event: "Acara Berikutnya",
  tomorrow: "Besok",
  join_event: "Ikuti Acara",
  recent_activity: "Aktivitas Terbaru",
  applied_for: "Mendaftar untuk",
  status_updated: "Status diperbarui untuk",
  welcome_jala: "Selamat datang di JALA VIVE!",
  journey_starts: "Perjalanan Anda dimulai di sini.",
  today: "Hari ini"
};

en.org_dash = {
  verified: "Verified",
  create_project: "Create Project",
  total_volunteers: "Total Volunteers",
  active_projects: "Active Projects",
  total_hours_logged: "Total Hours Logged",
  profile_views: "Profile Views",
  recent_projects: "Recent Projects",
  manage_all: "Manage All",
  no_projects: "No projects found. Create one to get started!",
  paid: "Paid",
  view_details: "View Details",
  edit_project: "Edit Project",
  manage_volunteers: "Manage Volunteers",
  new_applications: "New Applications",
  pending: "Pending",
  applied_to: "Applied to",
  review: "Review",
  no_pending: "No pending applications.",
  view_all_apps: "View All Applications",
  recent_activity: "Recent Activity",
  review_application: "Review Application",
  review_desc: "Review volunteer details and application statement.",
  project: "Project",
  email: "Email",
  phone: "Phone",
  applied: "Applied",
  motivation_letter: "Motivation Letter",
  reject: "Reject",
  approve: "Approve",
  status_active: "Active",
  status_draft: "Draft",
  status_completed: "Completed",
  role: "Role"
};

id.org_dash = {
  verified: "Terverifikasi",
  create_project: "Buat Proyek",
  total_volunteers: "Total Relawan",
  active_projects: "Proyek Aktif",
  total_hours_logged: "Total Jam Dicatat",
  profile_views: "Dilihat",
  recent_projects: "Proyek Terbaru",
  manage_all: "Kelola Semua",
  no_projects: "Tidak ada proyek ditemukan. Buat satu untuk memulai!",
  paid: "Berbayar",
  view_details: "Lihat Detail",
  edit_project: "Edit Proyek",
  manage_volunteers: "Kelola Relawan",
  new_applications: "Aplikasi Baru",
  pending: "Tertunda",
  applied_to: "Mendaftar ke",
  review: "Tinjau",
  no_pending: "Tidak ada aplikasi tertunda.",
  view_all_apps: "Lihat Semua Aplikasi",
  recent_activity: "Aktivitas Terbaru",
  review_application: "Tinjau Aplikasi",
  review_desc: "Tinjau detail relawan dan pernyataan pendaftaran.",
  project: "Proyek",
  email: "Email",
  phone: "Telepon",
  applied: "Mendaftar",
  motivation_letter: "Surat Motivasi",
  reject: "Tolak",
  approve: "Setujui",
  status_active: "Aktif",
  status_draft: "Draf",
  status_completed: "Selesai",
  role: "Peran"
};

en.admin_dash = {
  platform_overview: "Platform Overview",
  platform_desc: "Monitor platform activity and manage system-wide settings.",
  total_volunteers: "Total Volunteers",
  organizations: "Organizations",
  active_projects: "Active Projects",
  system_health: "System Health",
  broadcast_announcement: "Broadcast Announcement",
  broadcast_desc: "Send a realtime notification to all currently connected users across the platform.",
  type_announcement: "Type your announcement here...",
  broadcasting: "Broadcasting...",
  broadcast_now: "Broadcast Now",
  live_activity: "Live Activity",
  no_recent: "No recent activity.",
  success_broadcast: "Announcement broadcasted successfully to all online users!"
};

id.admin_dash = {
  platform_overview: "Ringkasan Platform",
  platform_desc: "Pantau aktivitas platform dan kelola pengaturan di seluruh sistem.",
  total_volunteers: "Total Relawan",
  organizations: "Organisasi",
  active_projects: "Proyek Aktif",
  system_health: "Kesehatan Sistem",
  broadcast_announcement: "Siarkan Pengumuman",
  broadcast_desc: "Kirim notifikasi waktu nyata ke semua pengguna yang saat ini terhubung di seluruh platform.",
  type_announcement: "Ketik pengumuman Anda di sini...",
  broadcasting: "Menyiarkan...",
  broadcast_now: "Siarkan Sekarang",
  live_activity: "Aktivitas Langsung",
  no_recent: "Tidak ada aktivitas terbaru.",
  success_broadcast: "Pengumuman berhasil disiarkan ke semua pengguna yang online!"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Batch 1 translations updated successfully.');
