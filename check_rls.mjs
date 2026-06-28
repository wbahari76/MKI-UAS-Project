import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Need to query pg_class for RLS status, but we can't do that with JS client anon key.
// Let's use psql directly again. Wait, I don't have supabase CLI. I have postgres!
// Let's check the users logged in using a manual curl?
