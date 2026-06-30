const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.landing = {
  impact: {
    title: "Our Collective",
    title_highlight: "Impact",
    desc: "Every connection creates measurable social impact.",
    kpis: {
      volunteers: "Active Volunteers",
      organizations: "Verified Organizations",
      projects: "Platform Projects",
      hours: "Volunteer Hours",
      lives: "Lives Impacted",
      success: "Project Success Rate"
    },
    live: "Live Activity",
    btn: "View Full Impact Report"
  },
  featured: {
    title: "Make an Impact Today",
    desc: "Discover meaningful volunteer opportunities and start your journey to create lasting change.",
    volunteers: "Volunteers",
    btn_details: "View Details",
    btn_all: "View All Projects"
  },
  categories: {
    title: "Explore by Category",
    desc: "Find volunteer opportunities that match your passion and skills.",
    projects: "projects",
    Education: "Education",
    Environment: "Environment",
    Health: "Health",
    Animal: "Animal",
    Technology: "Technology",
    Community: "Community"
  },
  how: {
    title: "Your Journey Starts Here",
    desc: "Get started in minutes and begin making an impact today.",
    step1_title: "Sign Up",
    step1_desc: "Create your free account as a volunteer or organization",
    step2_title: "Discover",
    step2_desc: "Explore projects, events, and communities that match your interests",
    step3_title: "Connect",
    step3_desc: "Apply to projects or recruit volunteers for your causes",
    step4_title: "Impact",
    step4_desc: "Make a difference and earn certificates and achievements"
  },
  testimonials: {
    title: "Stories from Our Community",
    desc: "Hear from volunteers and organizations who are making a difference."
  },
  faq: {
    title: "Frequently Asked Questions",
    desc: "Everything you need to know about JALA VIVE."
  },
  cta: {
    title: "Ready to Make an Impact?",
    desc: "Join thousands of volunteers and organizations creating positive change in communities across Indonesia.",
    btn_start: "Get Started for Free",
    btn_browse: "Browse Projects"
  }
};

id.landing = {
  impact: {
    title: "Dampak Bersama",
    title_highlight: "Kita",
    desc: "Setiap koneksi menciptakan dampak sosial yang terukur.",
    kpis: {
      volunteers: "Relawan Aktif",
      organizations: "Organisasi Terverifikasi",
      projects: "Proyek Platform",
      hours: "Jam Kerelawanan",
      lives: "Nyawa Terdampak",
      success: "Tingkat Keberhasilan"
    },
    live: "Aktivitas Langsung",
    btn: "Lihat Laporan Dampak Lengkap"
  },
  featured: {
    title: "Buat Dampak Hari Ini",
    desc: "Temukan peluang relawan yang bermakna dan mulai perjalanan Anda untuk menciptakan perubahan nyata.",
    volunteers: "Relawan",
    btn_details: "Lihat Detail",
    btn_all: "Lihat Semua Proyek"
  },
  categories: {
    title: "Jelajahi Kategori",
    desc: "Temukan peluang relawan yang sesuai dengan minat dan keterampilan Anda.",
    projects: "proyek",
    Education: "Pendidikan",
    Environment: "Lingkungan",
    Health: "Kesehatan",
    Animal: "Hewan",
    Technology: "Teknologi",
    Community: "Komunitas"
  },
  how: {
    title: "Perjalanan Anda Dimulai Di Sini",
    desc: "Mulai dalam beberapa menit dan buat dampak hari ini.",
    step1_title: "Daftar",
    step1_desc: "Buat akun gratis sebagai relawan atau organisasi",
    step2_title: "Temukan",
    step2_desc: "Jelajahi proyek, acara, dan komunitas yang sesuai minat",
    step3_title: "Hubungkan",
    step3_desc: "Daftar ke proyek atau rekrut relawan untuk tujuan Anda",
    step4_title: "Berdampak",
    step4_desc: "Buat perbedaan dan dapatkan sertifikat serta pencapaian"
  },
  testimonials: {
    title: "Cerita Komunitas Kami",
    desc: "Dengar dari para relawan dan organisasi yang telah membuat perbedaan."
  },
  faq: {
    title: "Pertanyaan yang Sering Diajukan",
    desc: "Semua yang perlu Anda ketahui tentang JALA VIVE."
  },
  cta: {
    title: "Siap Membuat Dampak?",
    desc: "Bergabunglah dengan ribuan relawan dan organisasi yang menciptakan perubahan positif di komunitas seluruh Indonesia.",
    btn_start: "Mulai Secara Gratis",
    btn_browse: "Jelajahi Proyek"
  }
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Dictionaries updated successfully.');
