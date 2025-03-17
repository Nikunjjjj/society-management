const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Ensure it's the service role key

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
