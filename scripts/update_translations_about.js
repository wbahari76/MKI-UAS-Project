const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.about = {
  hero_tag: "ABOUT US",
  hero_title: "Connecting",
  hero_title_highlight: "Good Intentions",
  hero_title_end: "With Real Action.",
  hero_desc: "JALA VIVE serves as a digital bridge that unites the spirit of volunteerism with social initiatives requiring tangible action.",
  vision_title: "Our Vision",
  vision_desc: "\"To become the most trusted digital volunteer ecosystem in Indonesia, ensuring equal access to self-development opportunities while nurturing a generation of active contributors who drive community progress through real and consistent engagement.\"",
  mission_title: "Strategic Mission",
  mission_desc: "Our steps to manifest a trusted ecosystem.",
  m1_title: "Centralized Platform",
  m1_desc: "Connecting individuals with volunteer opportunities across categories seamlessly without social network barriers.",
  m2_title: "Track Record of Participation",
  m2_desc: "A tracking system to document engagement as a valuable long-term capacity portfolio.",
  m3_title: "Smart Matching",
  m3_desc: "Facilitating organizers to find volunteers through matching mechanisms based on interest profiles and history.",
  m4_title: "Self-Sustaining Business Model",
  m4_desc: "Maintaining operations through a financially independent business model without sacrificing accessibility for the community.",
  values_title: "Core Values",
  values_desc: "Four core values that serve as the foundation of every step of our movement.",
  v1_title: "Just Access",
  v1_desc: "The right to volunteer opportunities should not be determined by the breadth of one's network.",
  v2_title: "Authentic Growth",
  v2_desc: "Authentic self-development is born from real experience and engagement.",
  v3_title: "Living Community",
  v3_desc: "An active ecosystem where every member strengthens each other through collaboration.",
  v4_title: "Accountable Impact",
  v4_desc: "Every claim of social impact must be supported by verifiable evidence.",
  team_title: "The People Behind",
  team_desc: "The team of innovators building the future of volunteering.",
  cta_title: "Start Your Journey.",
  cta_desc: "Join thousands of volunteers and social organizations that have made a real impact on JALA VIVE.",
  btn_volunteer: "Join as Volunteer",
  btn_org: "Register Organization",
  value_badge: "OUR VALUE"
};

id.about = {
  hero_tag: "TENTANG KAMI",
  hero_title: "Menghubungkan",
  hero_title_highlight: "Niat Baik",
  hero_title_end: "Dengan Aksi Nyata.",
  hero_desc: "JALA VIVE hadir sebagai jembatan digital yang mempertemukan semangat kerelawanan dengan inisiatif sosial yang membutuhkan aksi nyata.",
  vision_title: "Visi Kami",
  vision_desc: "\"Menjadi ekosistem volunteer digital paling terpercaya di Indonesia yang menjamin pemerataan akses terhadap peluang pengembangan diri, sekaligus melahirkan generasi kontributor aktif yang mendorong kemajuan komunitas melalui keterlibatan nyata dan konsisten.\"",
  mission_title: "Misi Strategis",
  mission_desc: "Langkah-langkah kami untuk mewujudkan ekosistem yang terpercaya.",
  m1_title: "Platform Terpusat",
  m1_desc: "Menghubungkan individu dengan peluang volunteer lintas kategori secara terpercaya tanpa hambatan jaringan sosial.",
  m2_title: "Rekam Jejak Partisipasi",
  m2_desc: "Sistem rekam jejak untuk mendokumentasikan keterlibatan sebagai portofolio kapasitas yang bernilai jangka panjang.",
  m3_title: "Pencocokan Cerdas",
  m3_desc: "Memfasilitasi penyelenggara menemukan volunteer melalui mekanisme pencocokan berbasis profil minat dan riwayat.",
  m4_title: "Model Bisnis Mandiri",
  m4_desc: "Menjaga operasional melalui model bisnis mandiri finansial tanpa mengorbankan aksesibilitas bagi komunitas.",
  values_title: "Core Values",
  values_desc: "Empat nilai inti yang menjadi fondasi setiap langkah pergerakan kami.",
  v1_title: "Just Access",
  v1_desc: "Hak atas peluang volunteer tidak boleh ditentukan oleh luasnya jaringan koneksi.",
  v2_title: "Authentic Growth",
  v2_desc: "Pengembangan diri yang autentik lahir dari pengalaman dan keterlibatan nyata.",
  v3_title: "Living Community",
  v3_desc: "Ekosistem aktif tempat setiap anggota saling memperkuat melalui kolaborasi.",
  v4_title: "Accountable Impact",
  v4_desc: "Setiap klaim dampak sosial wajib didukung oleh bukti yang dapat diverifikasi.",
  team_title: "The People Behind",
  team_desc: "Tim inovator yang membangun masa depan kerelawanan.",
  cta_title: "Mulai Perjalanan Anda.",
  cta_desc: "Bergabung dengan ribuan relawan dan organisasi sosial yang telah membuat dampak nyata di JALA VIVE.",
  btn_volunteer: "Bergabung Relawan",
  btn_org: "Daftar Organisasi",
  value_badge: "NILAI KAMI"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('About dictionaries updated successfully.');
