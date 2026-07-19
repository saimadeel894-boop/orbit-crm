export const mapContactToLocal = (s) => ({
  id: s.id,
  businessId: s.business_id,
  firstName: s.name?.split(' ')[0] || '',
  lastName: s.name?.split(' ').slice(1).join(' ') || '',
  company: s.company || '',
  email: s.email || '',
  phone: s.phone || '',
  location: s.location || '',
  industryId: s.industry_id,
  sourceId: s.source_id,
  priority: s.priority || 'Medium',
  authority: s.authority || 'Unknown',
  callStatus: s.call_status || 'New',
  attempts: s.attempts || 0,
  conversations: s.conversations || 0,
  lastCallDate: s.last_call_date || '',
  lastOutcome: s.last_outcome || '',
  nextCallDate: s.next_call_date || '',
  notes: s.notes || '',
  tags: s.tags || [],
  createdAt: s.created_at,
  updatedAt: s.updated_at,
  // Local UI expects contactName for some generic rendering
  contactName: s.name,
  // Other defaults
  activity: [],
  listId: s.lead_list_id || null,
  listIds: s.lead_list_id ? [s.lead_list_id] : []
});

export const mapContactToSupabase = (l, userId) => ({
  id: l.id,
  business_id: l.businessId || null,
  name: l.contactName || `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Unknown',
  email: l.email || null,
  phone: l.phone || null,
  company: l.company || null,
  location: l.location || null,
  industry_id: l.industryId || null,
  source_id: l.sourceId || null,
  priority: l.priority || 'Medium',
  authority: l.authority || 'Unknown',
  call_status: l.callStatus || 'New',
  attempts: l.attempts || 0,
  conversations: l.conversations || 0,
  last_call_date: l.lastCallDate || null,
  last_outcome: l.lastOutcome || null,
  next_call_date: l.nextCallDate || null,
  notes: l.notes || null,
  tags: l.tags || [],
  lead_list_id: l.listId || (l.listIds && l.listIds[0]) || null,
  updated_at: new Date().toISOString(),
  ...(userId ? { user_id: userId } : {})
});

export const mapLeadToLocal = (s) => ({
  id: s.id,
  businessId: s.business_id,
  contactId: s.contact_id,
  title: s.title || '',
  contactName: s.title || '', // Fallback for UI
  stage: s.stage || 'new',
  dealValue: s.deal_value || 0,
  wonValue: s.won_value || 0,
  closeResult: s.close_result || '',
  closeReason: s.loss_reason || '',
  wonDate: s.won_date || '',
  status: s.status || 'Active',
  priority: s.priority || 'Medium',
  notes: s.notes || '',
  createdAt: s.created_at,
  updatedAt: s.updated_at,
  deal: { contractStatus: s.contract_status || 'Not sent', paymentStatus: s.payment_status || 'None' },
  qual: {},
  interactions: [],
  tags: [],
  favourite: false,
  archived: false,
});

export const mapLeadToSupabase = (l, userId) => ({
  id: l.id,
  business_id: l.businessId || null,
  contact_id: l.contactId || null,
  title: l.title || l.contactName || 'Unknown',
  stage: l.stage || 'new',
  deal_value: l.dealValue || 0,
  won_value: l.wonValue || 0,
  close_result: l.closeResult || null,
  loss_reason: l.closeReason || null,
  won_date: l.wonDate || null,
  contract_status: l.deal?.contractStatus || 'Not sent',
  payment_status: l.deal?.paymentStatus || 'None',
  status: l.status || 'Active',
  priority: l.priority || 'Medium',
  notes: l.notes || null,
  updated_at: new Date().toISOString(),
  ...(userId ? { user_id: userId } : {})
});

export const mapTaskToLocal = (s) => ({
  id: s.id,
  title: s.title || '',
  leadId: s.lead_id,
  contactId: s.contact_id,
  businessId: s.business_id,
  dueDate: s.due_date ? s.due_date.slice(0, 10) : '',
  dueTime: s.due_date && s.due_date.includes('T') ? s.due_date.slice(11, 16) : '',
  status: s.done ? 'done' : 'open',
  priority: s.priority || 'Medium',
  notes: s.notes || '',
  createdAt: s.created_at
});

export const mapTaskToSupabase = (l, userId) => ({
  id: l.id,
  title: l.title || 'Untitled',
  lead_id: l.leadId || null,
  contact_id: l.contactId || null,
  business_id: l.businessId || null,
  due_date: l.dueDate ? `${l.dueDate}T${l.dueTime || '00:00'}:00Z` : null,
  done: l.status === 'done',
  priority: l.priority || 'Medium',
  notes: l.notes || null,
  ...(userId ? { user_id: userId } : {})
});

export const mapActivityToLocal = (s) => ({
  id: s.id,
  contactId: s.contact_id,
  type: s.type || '',
  date: s.date || '',
  outcome: s.outcome || '',
  notes: s.notes || '',
  person: s.person || '',
  interest: s.interest || '',
  followUpDate: s.follow_up_date || '',
  createdAt: s.created_at
});

export const mapActivityToSupabase = (l, userId) => ({
  id: l.id,
  contact_id: l.contactId || null,
  type: l.type || 'note',
  date: l.date || new Date().toISOString(),
  outcome: l.outcome || null,
  notes: l.notes || null,
  person: l.person || null,
  interest: l.interest || null,
  follow_up_date: l.followUpDate || null,
  ...(userId ? { user_id: userId } : {})
});
