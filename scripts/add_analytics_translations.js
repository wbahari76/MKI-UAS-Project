const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.analytics = {
  title: "Analytics & Reports",
  desc: "Track your organization's impact and volunteer engagement.",
  filter: "Filter",
  export: "Export Report",
  time_range: {
    "1m": "1 Month",
    "3m": "3 Months",
    "6m": "6 Months",
    "1y": "1 Year"
  },
  stats: {
    volunteers: "Total Volunteers",
    hours: "Total Impact Hours",
    retention: "Volunteer Retention",
    cost: "Avg. Cost per Project"
  },
  charts: {
    growth_title: "Volunteer Growth",
    growth_desc: "Number of active volunteers over time",
    hours_title: "Hours by Project",
    hours_desc: "Distribution of volunteer hours",
    retention_title: "Retention Rate (%)",
    retention_desc: "Percentage of volunteers who returned for a second project"
  }
};

id.analytics = {
  title: "Analitik & Laporan",
  desc: "Lacak dampak organisasi dan keterlibatan relawan Anda.",
  filter: "Saring",
  export: "Ekspor Laporan",
  time_range: {
    "1m": "1 Bulan",
    "3m": "3 Bulan",
    "6m": "6 Bulan",
    "1y": "1 Tahun"
  },
  stats: {
    volunteers: "Total Relawan",
    hours: "Total Jam Dampak",
    retention: "Retensi Relawan",
    cost: "Rata-rata Biaya Proyek"
  },
  charts: {
    growth_title: "Pertumbuhan Relawan",
    growth_desc: "Jumlah relawan aktif dari waktu ke waktu",
    hours_title: "Jam Berdasarkan Proyek",
    hours_desc: "Distribusi jam relawan",
    retention_title: "Tingkat Retensi (%)",
    retention_desc: "Persentase relawan yang kembali untuk proyek kedua"
  }
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Analytics translations updated successfully.');
