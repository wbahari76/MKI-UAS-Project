const { createClient } = require('@supabase/supabase-js');

const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, organizations(name)')
    .neq('status', 'draft');
    
  console.log("Error:", error);
  console.log("Data:", data);
}

run();
