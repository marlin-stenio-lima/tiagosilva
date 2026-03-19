import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://erfjpkqdnvitqohmvjks.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZmpwa3FkbnZpdHFvaG12amtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MDA0MjAsImV4cCI6MjA4OTQ3NjQyMH0.GORuF_Tzk-pkNjCpzjlEBEzP3NDsNMULD-gYm9zqLO4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
