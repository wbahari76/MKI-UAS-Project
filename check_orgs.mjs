import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: orgs, error: err1 } = await supabase.from('organizations').select('*');
  console.log("Orgs:", JSON.stringify(orgs, null, 2));
}
check();
