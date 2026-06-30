const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

// Explore Page
en.explore = {
  title: "Explore Open",
  title_highlight: "Projects",
  desc: "Find the perfect cause to contribute your skills and time. Discover volunteering opportunities from organizations worldwide.",
  search_placeholder: "Search projects or organizations...",
  filter_type: "Filter Type",
  all_projects: "All Projects",
  free_volunteering: "Free Volunteering",
  paid_programs: "Paid Programs",
  no_projects: "No projects found",
  no_projects_desc: "Try adjusting your search or filters to find what you're looking for.",
  apply_now: "Apply Now",
  project_full: "Project Full",
  sign_in_apply: "Sign in to Apply",
  volunteers_needed: "Volunteers Needed"
};

id.explore = {
  title: "Jelajahi",
  title_highlight: "Proyek Terbuka",
  desc: "Temukan penyebab yang tepat untuk menyumbangkan keterampilan dan waktu Anda. Temukan peluang kerelawanan dari organisasi di seluruh dunia.",
  search_placeholder: "Cari proyek atau organisasi...",
  filter_type: "Filter Tipe",
  all_projects: "Semua Proyek",
  free_volunteering: "Relawan Gratis",
  paid_programs: "Program Berbayar",
  no_projects: "Tidak ada proyek ditemukan",
  no_projects_desc: "Coba sesuaikan pencarian atau filter Anda untuk menemukan apa yang Anda cari.",
  apply_now: "Daftar Sekarang",
  project_full: "Proyek Penuh",
  sign_in_apply: "Masuk untuk Daftar",
  volunteers_needed: "Relawan Dibutuhkan"
};

// Communities Page
en.communities = {
  title: "Verified",
  title_highlight: "Communities",
  desc: "Discover and connect with trusted organizations making a real impact across Indonesia.",
  search_placeholder: "Search organizations by name or city...",
  projects: "Projects",
  volunteers: "Volunteers",
  view_projects: "View Projects",
  no_communities: "No communities found matching your criteria."
};

id.communities = {
  title: "Komunitas",
  title_highlight: "Terverifikasi",
  desc: "Temukan dan terhubung dengan organisasi terpercaya yang membuat dampak nyata di seluruh Indonesia.",
  search_placeholder: "Cari organisasi berdasarkan nama atau kota...",
  projects: "Proyek",
  volunteers: "Relawan",
  view_projects: "Lihat Proyek",
  no_communities: "Tidak ada komunitas yang cocok dengan kriteria Anda."
};

// Events Page
en.events = {
  title: "Upcoming",
  title_highlight: "Events",
  desc: "Join one-off volunteering events and make a direct impact in your community today.",
  search_placeholder: "Search events or organizations...",
  date: "Date",
  location: "Location",
  spots_left: "spots left",
  view_event: "View Event",
  no_events: "No events found matching your criteria."
};

id.events = {
  title: "Acara",
  title_highlight: "Mendatang",
  desc: "Bergabunglah dengan acara kerelawanan satu kali dan buat dampak langsung di komunitas Anda hari ini.",
  search_placeholder: "Cari acara atau organisasi...",
  date: "Tanggal",
  location: "Lokasi",
  spots_left: "kuota tersisa",
  view_event: "Lihat Acara",
  no_events: "Tidak ada acara yang cocok dengan kriteria Anda."
};

// Partnership Page
en.partnership = {
  hero_title: "Amplify Your Impact",
  hero_title_2: "Together with",
  hero_desc: "Join forces with us to build a more sustainable and caring world. Whether you're a corporation, NGO, or university, we have the right tools to scale your initiatives.",
  btn_partner: "Become a Partner",
  btn_explore: "Explore Projects",
  tier_title: "Partnership Opportunities",
  tier_desc: "Choose the tier that best fits your organization's goals.",
  benefits: "Benefits:",
  learn_more: "Learn More",
  cta_title: "Ready to collaborate?",
  cta_desc: "Let's discuss how we can work together to maximize your social impact.",
  btn_contact: "Contact Our Team",
  corporate_title: "Corporate Partner",
  corporate_desc: "Align your brand with impactful social and environmental projects. Engage your employees in corporate volunteering programs.",
  c_b1: "Custom CSR campaign creation",
  c_b2: "Employee volunteering tracking",
  c_b3: "Impact reports and analytics",
  c_b4: "Brand visibility across JALA VIVE",
  ngo_title: "NGO / Non-Profit",
  ngo_desc: "Amplify your reach and connect with dedicated volunteers ready to support your noble causes.",
  n_b1: "Priority volunteer matching",
  n_b2: "Advanced project management tools",
  n_b3: "Community broadcast features",
  n_b4: "Donation integration (Coming Soon)",
  com_title: "Community Partner",
  com_desc: "For local communities and universities looking to organize and manage their own impact initiatives.",
  co_b1: "Private community groups",
  co_b2: "Event scheduling tools",
  co_b3: "Digital certificates for members",
  co_b4: "Dedicated support channel"
};

id.partnership = {
  hero_title: "Tingkatkan Dampak Anda",
  hero_title_2: "Bersama dengan",
  hero_desc: "Bergabunglah dengan kami untuk membangun dunia yang lebih berkelanjutan dan peduli. Baik Anda perusahaan, LSM, atau universitas, kami memiliki alat yang tepat untuk mengukur inisiatif Anda.",
  btn_partner: "Menjadi Mitra",
  btn_explore: "Jelajahi Proyek",
  tier_title: "Peluang Kemitraan",
  tier_desc: "Pilih tingkat yang paling sesuai dengan tujuan organisasi Anda.",
  benefits: "Manfaat:",
  learn_more: "Pelajari Lebih Lanjut",
  cta_title: "Siap berkolaborasi?",
  cta_desc: "Mari diskusikan bagaimana kita dapat bekerja sama untuk memaksimalkan dampak sosial Anda.",
  btn_contact: "Hubungi Tim Kami",
  corporate_title: "Mitra Perusahaan",
  corporate_desc: "Sejajarkan merek Anda dengan proyek sosial dan lingkungan yang berdampak. Libatkan karyawan Anda dalam program kerelawanan perusahaan.",
  c_b1: "Pembuatan kampanye CSR khusus",
  c_b2: "Pelacakan kerelawanan karyawan",
  c_b3: "Laporan dampak dan analitik",
  c_b4: "Visibilitas merek di JALA VIVE",
  ngo_title: "LSM / Non-Profit",
  ngo_desc: "Tingkatkan jangkauan Anda dan terhubung dengan relawan berdedikasi yang siap mendukung tujuan mulia Anda.",
  n_b1: "Pencocokan relawan prioritas",
  n_b2: "Alat manajemen proyek lanjutan",
  n_b3: "Fitur siaran komunitas",
  n_b4: "Integrasi donasi (Segera Hadir)",
  com_title: "Mitra Komunitas",
  com_desc: "Untuk komunitas lokal dan universitas yang ingin mengatur dan mengelola inisiatif dampak mereka sendiri.",
  co_b1: "Grup komunitas pribadi",
  co_b2: "Alat penjadwalan acara",
  co_b3: "Sertifikat digital untuk anggota",
  co_b4: "Saluran dukungan khusus"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Public pages dictionaries updated successfully.');
