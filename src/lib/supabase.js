import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://nqismyulqcdqiaqiacel.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXNteXVscWNkcWlhcWlhY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNTI3NzEsImV4cCI6MjA5OTkyODc3MX0.hGq-qEdhM-xidtqh7SgNCtPqAyezAnYj1cC5RchYWGg';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
