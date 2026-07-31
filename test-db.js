import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://nqismyulqcdqiaqiacel.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXNteXVscWNkcWlhcWlhY2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNTI3NzEsImV4cCI6MjA5OTkyODc3MX0.hGq-qEdhM-xidtqh7SgNCtPqAyezAnYj1cC5RchYWGg');

async function test() {
  console.log('Testing...');
  const { data: contacts, error: e1 } = await supabase.from('contacts').select('id, user_id').limit(1);
  if (e1) { console.error('E1:', e1); return; }
  if (!contacts || contacts.length === 0) { console.log('No contacts found'); return; }
  const contact = contacts[0];
  console.log('Got contact:', contact.id);

  const { data, error } = await supabase.from('contacts').select('*').eq('id', contact.id).eq('user_id', contact.user_id).single();
  console.log('Single fetch error:', error);
  console.log('Single fetch data:', data ? Object.keys(data).length + ' columns' : 'NULL');
  
  const { data: aData, error: aError } = await supabase.from('activity_log').select('*').eq('contact_id', contact.id).eq('user_id', contact.user_id).order('date', { ascending: false });
  console.log('Activity fetch error:', aError);
  console.log('Activity fetch data:', aData ? 'OK' : 'NULL');
}
test();
