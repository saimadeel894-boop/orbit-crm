import { supabase } from './supabase';
import { mapContactToSupabase } from './mappers';

// Helper to get current user ID
export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const getUid = async () => {
  const { data: { session } } = await getSession();
  if (!session?.user?.id) throw new Error('Not authenticated');
  return session.user.id;
};

const handleResponse = (res) => ({
  data: res.data,
  error: res.error,
  count: res.count
});

const isUuid = (id) => typeof id === 'string' && id.length === 36 && id.includes('-');

// --- CONTACTS ---

const VALID_CONTACT_COLUMNS = new Set([
  'id', 'business_id', 'name', 'email', 'phone', 'company', 'location', 
  'industry_id', 'source_id', 'priority', 'authority', 'call_status', 
  'attempts', 'conversations', 'last_call_date', 'last_outcome', 
  'next_call_date', 'notes', 'tags', 'lead_list_id', 'user_id', 'updated_at'
]);

const CAMEL_TO_SNAKE_CONTACT = {
  businessId: 'business_id',
  industryId: 'industry_id',
  sourceId: 'source_id',
  callStatus: 'call_status',
  lastCallDate: 'last_call_date',
  lastOutcome: 'last_outcome',
  nextCallDate: 'next_call_date',
  leadListId: 'lead_list_id',
  listId: 'lead_list_id',
  contactName: 'name',
  updatedAt: 'updated_at',
  userId: 'user_id'
};

const cleanContactPatch = (patch) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(patch || {})) {
    const dbKey = CAMEL_TO_SNAKE_CONTACT[key] || key;
    if (VALID_CONTACT_COLUMNS.has(dbKey) && value !== undefined) {
      cleaned[dbKey] = value;
    }
  }
  return cleaned;
};

export const getContacts = async ({ businessId, listId, page = 1, pageSize = 50, search = '', callStatus = '', orderBy = 'created_at' }) => {
  console.log("getContacts called with:", { businessId, page, pageSize, search });
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
  if (search) {
    const term = String(search).trim().replace(/[%_,]/g, '');
    if (term) {
      query = query.or(`name.ilike.%${term}%,company.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
    }
  }

  query = query.order(orderBy, { ascending: false }).range(from, to);

  console.log("Before getContacts query", { businessId, listId });
  const timeout = setTimeout(() => console.error("getContacts timed out after 10s"), 10000);
  const res = await query;
  clearTimeout(timeout);
  console.log("getContacts result:", res.data?.length, "rows, error:", res.error);

  return handleResponse(res);
};

export const getContactById = async (id) => {
  if (!isUuid(id)) return { data: null, error: null };
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').select('*').eq('id', id).eq('user_id', uid).maybeSingle());
};

export const createContact = async (data) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').insert({ ...data, user_id: uid }).select().single());
};

export const updateContact = async (id, patch) => {
  if (!isUuid(id)) return { data: null, error: null };
  const uid = await getUid();
  console.log("updateContact patch object before cleaning:", patch);
  const cleanedPatch = cleanContactPatch(patch);
  console.log("updateContact cleaned patch sent to Supabase:", cleanedPatch);
  return handleResponse(await supabase.from('contacts').update(cleanedPatch).eq('id', id).eq('user_id', uid).select().maybeSingle());
};

export const deleteContact = async (id) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').delete().eq('id', id).eq('user_id', uid));
};

export const bulkUpdateContacts = async (ids, patch) => {
  const uid = await getUid();
  console.log("bulkUpdateContacts patch object before cleaning:", patch);
  const cleanedPatch = cleanContactPatch(patch);
  console.log("bulkUpdateContacts cleaned patch sent to Supabase:", cleanedPatch);
  return handleResponse(await supabase.from('contacts').update(cleanedPatch).in('id', ids).eq('user_id', uid));
};

export const bulkDeleteContacts = async (ids) => {
  const uid = await getUid();
  return handleResponse(await supabase.from('contacts').delete().in('id', ids).eq('user_id', uid));
};

export const batchImportContacts = async (rows) => {
  const uid = await getUid();
  const chunkSize = 500;
  let allData = [];
  let allError = null;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize).map(r => mapContactToSupabase(r, uid));
    const { data, error } = await supabase.from('contacts').insert(chunk).select(); // Supabase ignores duplicates if unique constraints are set, or we can use upsert
    console.log("Supabase insert response:", data, error);
    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error));
      allError = error;
      break;
    }
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
  let contact_id = data.contact_id;
  
  if (!contact_id) {
    const contactData = {
      name: data.title,
      company: data.title,
      user_id: uid,
      business_id: data.business_id,
      call_status: 'Lead',
      priority: data.priority || 'Medium'
    };
    const { data: newContact, error } = await supabase.from('contacts').insert(contactData).select('id').single();
    if (!error && newContact) {
      contact_id = newContact.id;
    }
  }

  return handleResponse(await supabase.from('leads').insert({ ...data, contact_id, user_id: uid }).select().single());
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

export const getActivities = async (contactId) => {
  if (!isUuid(contactId)) return { data: [], error: null };
  const uid = await getUid();
  return handleResponse(await supabase.from('activity_log').select('*').eq('contact_id', contactId).eq('user_id', uid).order('date', { ascending: false }));
};

export const getActivity = getActivities;

export const addActivity = async (contactId, data) => {
  if (!isUuid(contactId)) return { data: null, error: null };
  const uid = await getUid();
  return handleResponse(await supabase.from('activity_log').insert({ ...data, contact_id: contactId, user_id: uid }).select().maybeSingle());
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
    .from('contacts')
    .select('*', { count: 'exact' })
    .eq('user_id', uid)
    .eq('call_status', 'Cold');

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

export const getLeadLists = async () => {
  const uid = await getUid();
  const res = await supabase.from('lead_lists').select('*').eq('user_id', uid);
  console.log('getLeadLists raw Supabase response:', res.data, res.error);
  return handleResponse(res);
};

export const createLeadList = async (data) => {
  const uid = await getUid();
  const payload = {
    name: data.name,
    business_id: data.businessId || null,
    industry: data.industry || null,
    source: data.source || null,
    status: data.status || 'Active',
    user_id: uid
  };
  return handleResponse(await supabase.from('lead_lists').insert(payload).select().single());
};

export const getAllQueueContacts = async () => {
  const uid = await getUid();
  let allData = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, business_id, industry_id, lead_list_id, call_status, priority, attempts, conversations, next_call_date, last_outcome, created_at')
      .eq('user_id', uid)
      .range(from, from + pageSize - 1);
      
    if (error) return { data: null, error };
    if (!data || data.length === 0) break;
    
    allData = allData.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { data: allData, error: null };
};
