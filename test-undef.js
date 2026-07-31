import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://nqismyulqcdqiaqiacel.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXNteXVscWNkcWlhcWlhY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNTI3NzEsImV4cCI6MjA5OTkyODc3MX0.hGq-qEdhM-xidtqh7SgNCtPqAyezAnYj1cC5RchYWGg');

async function test() {
  console.log('Testing undefined eq...');
  try {
    const res = await supabase.from('contacts').select('*').eq('id', undefined).single();
    console.log('Result:', res);
  } catch (e) {
    console.log('Caught error:', e.message);
  }
}
test();
