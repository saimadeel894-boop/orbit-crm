import { supabase } from './supabase';
import { mapContactToSupabase } from './mappers';

// Helper to get current user ID
const getUid = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id;
};

const handleResponse = (res) => ({
  data: res.data,
  error: res.error,
  count: res.count
});

// --- CONTACTS ---

export const getContacts = async ({ businessId, listId, page = 1, pageSize = 50, search = '', callStatus = '', orderBy = 'created_at' }) => {
  const uid = await getUid();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .eq('user_id', uid);

  if (businessId && businessId !== 'all') query = query.eq('business_id', businessId);
  if (listId && listId !== 'all') query = query.eq('lead_list_id', listId);
  if (callStatus && callStatus !== 'all') query = query.eq('call_status', callStatus);
  if (search) query = query.ilike('name', `%${search}%`);

  query = query.order(orderBy, { ascending: false }).range(from, to);

  return handleResponse(await query);
};

export const createContact = async (data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').insert({ ...data, user_id: uid }).select().single());
};

export const updateContact = async (id, patch) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').update(patch).eq('id', id).eq('user_id', uid).select().single());
};

export const deleteContact = async (id) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').delete().eq('id', id).eq('user_id', uid));
};

export const batchImportContacts = async (rows) => {
  const uid = await getUid();
  const chunkSize = 500;
  let allData = [];
  let allError = null;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize).map(r => mapContactToSupabase(r, uid));
    const { data, error } = await supabase.from('contacts').insert(chunk).select(); // Supabase ignores duplicates if unique constraints are set, or we can use upsert
    if (error) { allError = error; break; }
    if (data) allData = [...allData, ...data];
  }
  return { data: allData, error: allError, count: allData.length };
};

// --- LEADS ---

export const getLeads = async ({ businessId, stage, page = 1, pageSize = 50 }) => {
  const uid = await getUid();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('user_id', uid);

  if (businessId && businessId !== 'all') query = query.eq('business_id', businessId);
  if (stage && stage !== 'all') query = query.eq('stage', stage);

  query = query.order('created_at', { ascending: false }).range(from, to);

  return handleResponse(await query);
};

export const createLead = async (data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('leads').insert({ ...data, user_id: uid }).select().single());
};

export const updateLead = async (id, patch) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('leads').update(patch).eq('id', id).eq('user_id', uid).select().single());
};

export const deleteLead = async (id) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('leads').delete().eq('id', id).eq('user_id', uid));
};

// --- ACTIVITY ---

export const getActivity = async (contactId) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('activity_log').select('*').eq('contact_id', contactId).eq('user_id', uid).order('date', { ascending: false }));
};

export const addActivity = async (contactId, data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('activity_log').insert({ ...data, contact_id: contactId, user_id: uid }).select().single());
};

// --- TASKS ---

export const getTasks = async ({ done, businessId, page = 1, pageSize = 50 }) => {
  const uid = await getUid();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('tasks')
    .select('*, leads(title), contacts(name)', { count: 'exact' })
    .eq('user_id', uid);

  if (businessId && businessId !== 'all') query = query.eq('business_id', businessId);
  if (done !== undefined && done !== 'all') query = query.eq('done', done);

  query = query.order('due_date', { ascending: true }).range(from, to);

  return handleResponse(await query);
};

export const createTask = async (data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('tasks').insert({ ...data, user_id: uid }).select().single());
};

export const updateTask = async (id, patch) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('tasks').update(patch).eq('id', id).eq('user_id', uid).select().single());
};

export const deleteTask = async (id) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('tasks').delete().eq('id', id).eq('user_id', uid));
};

// --- FOLLOW UPS ---

export const getFollowUps = async ({ done, page = 1, pageSize = 50 }) => {
  const uid = await getUid();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('follow_ups')
    .select('*', { count: 'exact' })
    .eq('user_id', uid);

  if (done !== undefined && done !== 'all') query = query.eq('done', done);

  query = query.order('due_date', { ascending: true }).range(from, to);

  return handleResponse(await query);
};

export const createFollowUp = async (data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('follow_ups').insert({ ...data, user_id: uid }).select().single());
};

export const updateFollowUp = async (id, patch) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('follow_ups').update(patch).eq('id', id).eq('user_id', uid).select().single());
};

// --- COLD WORKFLOW ---

export const getColdContacts = async ({ businessId, page = 1, pageSize = 50, search = '' }) => {
  const uid = await getUid();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // The user prompt specifically asked for cold_contacts to have same structure, is_cold boolean
  // Assuming table `cold_contacts` is used here:
  let query = supabase
    .from('cold_contacts')
    .select('*', { count: 'exact' })
    .eq('user_id', uid)
    .eq('is_cold', true);

  if (businessId && businessId !== 'all') query = query.eq('business_id', businessId);
  if (search) query = query.ilike('name', `%${search}%`);

  query = query.order('created_at', { ascending: false }).range(from, to);

  return handleResponse(await query);
};

export const moveOutOfCold = async (contactId, activityData) => {
  const uid = await getUid();
  
  // 1. Log activity
  const { error: actError } = await supabase.from('activity_log').insert({
    ...activityData,
    contact_id: contactId,
    user_id: uid
  });
  if (actError) return { error: actError };

  // 2. Set is_cold = false + update call_status
  const { data, error } = await supabase.from('cold_contacts')
    .update({ 
      is_cold: false, 
      call_status: activityData.call_status || 'Contacted' 
    })
    .eq('id', contactId)
    .eq('user_id', uid)
    .select()
    .single();

  return { data, error };
};

// --- EXPORTS ---

export const exportContacts = async (businessId) => {
  const uid = await getUid();
  
  let query = supabase
    .from('contacts')
    .select('*')
    .eq('user_id', uid);

  if (businessId && businessId !== 'all') query = query.eq('business_id', businessId);

  // No pagination, full export
  return handleResponse(await query);
};
