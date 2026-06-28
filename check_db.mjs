import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: orgs, error: err1 } = await supabase.from('organizations').select('*');
  console.log("Orgs:", orgs?.length, err1);
  const { data: profiles, error: err2 } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles?.length, err2);
}
check();
