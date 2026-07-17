const { createClient } = require('@supabase/supabase-js');
process.loadEnvFile('.env.local');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('news').select('id, title, slug, status');
  console.log("All news:", data);
  if (error) console.error("Error:", error);
}
test();
