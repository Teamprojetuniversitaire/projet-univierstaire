require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be defined in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};

module.exports = { supabase, testConnection };
