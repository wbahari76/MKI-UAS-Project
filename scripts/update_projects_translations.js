const fs = require('fs');
const path = require('path');

const enPath = path.join(process.cwd(), 'locales/en/common.json');
const idPath = path.join(process.cwd(), 'locales/id/common.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const id = JSON.parse(fs.readFileSync(idPath, 'utf8'));

en.projects = {
  ...en.projects,
  paid_project: "Paid",
  unpaid_project: "Volunteer (Unpaid)",
  filter: "Filter"
};

id.projects = {
  ...id.projects,
  paid_project: "Berbayar",
  unpaid_project: "Relawan (Sukarela)",
  filter: "Filter"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(idPath, JSON.stringify(id, null, 2));
console.log('Projects translations updated successfully.');
