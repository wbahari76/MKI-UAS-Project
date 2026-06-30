const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.messages = {
  title: "Messages",
  search: "Search contacts...",
  no_contacts: "No approved volunteers yet.",
  no_contacts_vol: "No organizations connected yet.",
  online: "Online",
  say_hi: "Say hi to",
  write_message: "Write a message...",
  no_contact_selected: "No Contact Selected",
  choose_contact: "Choose a contact from the list to start messaging."
};

id.messages = {
  title: "Pesan",
  search: "Cari kontak...",
  no_contacts: "Belum ada relawan yang disetujui.",
  no_contacts_vol: "Belum ada organisasi yang terhubung.",
  online: "Aktif",
  say_hi: "Katakan hai kepada",
  write_message: "Tulis pesan...",
  no_contact_selected: "Tidak Ada Kontak Terpilih",
  choose_contact: "Pilih kontak dari daftar untuk mulai mengirim pesan."
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Messages translations updated successfully.');
