const fs = require('fs');

const enPath = './locales/en/common.json';
const idPath = './locales/id/common.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));

// English translations
enData.about = {
  ...enData.about,
  problem_tag: "The Problem",
  problem_title1: "Why JALA VIVE",
  problem_title2: "is Needed",
  problem_desc: "Our research confirms that the current volunteer ecosystem is fragmented, creating unnecessary friction for both organizers and volunteers.",
  stat1_title: "Organizer Struggle",
  stat1_desc: "of event organizers report that managing volunteer recruitment through manual forms is inefficient and time-consuming.",
  stat2_title: "Volunteer Hesitation",
  stat2_desc: "of potential volunteers abandon registration due to scattered information and unclear application processes.",
  stat3_title: "Fragmentation",
  stat3_desc: "of social impact tracking is lost due to disorganized data and lack of a centralized platform."
};

// Indonesian translations
idData.about = {
  ...idData.about,
  problem_tag: "Masalah Utama",
  problem_title1: "Mengapa JALA VIVE",
  problem_title2: "Dibutuhkan",
  problem_desc: "Riset kami mengonfirmasi bahwa ekosistem relawan saat ini terpecah, menciptakan hambatan yang tidak perlu bagi penyelenggara maupun relawan.",
  stat1_title: "Kesulitan Penyelenggara",
  stat1_desc: "dari penyelenggara acara melaporkan bahwa mengelola rekrutmen relawan melalui formulir manual sangat tidak efisien dan memakan waktu.",
  stat2_title: "Keraguan Relawan",
  stat2_desc: "dari calon relawan membatalkan pendaftaran akibat informasi yang tersebar dan proses aplikasi yang tidak jelas.",
  stat3_title: "Fragmentasi",
  stat3_desc: "pelacakan dampak sosial hilang akibat data yang tidak teratur dan ketiadaan platform terpusat."
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(idPath, JSON.stringify(idData, null, 2));

console.log("Translations added.");
