const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.projects = {
  ...en.projects,
  edit_title: "Edit Project",
  edit_desc: "Update your project details below.",
  back_to_projects: "Back to Projects",
  basic_info: "1. Basic Information",
  project_title: "Project Title",
  project_desc: "Project Description",
  req_ben: "2. Requirements & Benefits",
  requirements: "Requirements (one per line)",
  benefits: "Benefits (one per line)",
  timeline_cap: "3. Timeline & Capacity",
  volunteers_needed: "Volunteers Needed",
  app_deadline: "Application Deadline",
  event_date: "Event Date & Time (Optional)",
  project_banner: "4. Project Banner",
  click_to_change: "Click to change image",
  upload_new_cover: "Upload a new cover image",
  img_guidelines: "PNG, JPG, WEBP up to 5MB. Recommended size 1200x600px.",
  browse_files: "Browse Files",
  save_changes: "Save Changes",
  saved_draft: "Project saved as draft",
  updated_success: "Project updated successfully!"
};

id.projects = {
  ...id.projects,
  edit_title: "Edit Program",
  edit_desc: "Perbarui detail program Anda di bawah ini.",
  back_to_projects: "Kembali ke Program",
  basic_info: "1. Informasi Dasar",
  project_title: "Judul Program",
  project_desc: "Deskripsi Program",
  req_ben: "2. Persyaratan & Manfaat",
  requirements: "Persyaratan (satu per baris)",
  benefits: "Manfaat (satu per baris)",
  timeline_cap: "3. Garis Waktu & Kapasitas",
  volunteers_needed: "Relawan Dibutuhkan",
  app_deadline: "Batas Waktu Pendaftaran",
  event_date: "Tanggal & Waktu Acara (Opsional)",
  project_banner: "4. Spanduk Program",
  click_to_change: "Klik untuk mengubah gambar",
  upload_new_cover: "Unggah gambar sampul baru",
  img_guidelines: "PNG, JPG, WEBP hingga 5MB. Ukuran yang disarankan 1200x600px.",
  browse_files: "Pilih File",
  save_changes: "Simpan Perubahan",
  saved_draft: "Program disimpan sebagai draf",
  updated_success: "Program berhasil diperbarui!"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Projects edit page translations updated successfully.');
