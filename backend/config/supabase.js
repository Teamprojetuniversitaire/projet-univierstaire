import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Les variables SUPABASE_URL et SUPABASE_KEY doivent être définies dans le fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
