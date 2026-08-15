/**
 * Orbit CRM — Portfolio Live Demo Dataset
 * Realistic fictional B2B companies, decision-makers, deal stages, tasks, call logs, and AI scores.
 */

export const DEMO_WORKSPACE = {
  id: "ws_demo_orbit",
  name: "Apex Growth SaaS Workspace",
  slug: "apex-growth-demo",
  plan: "pro",
  settings: {
    theme: "dark",
    primary_color: "#4F6BFF",
    custom_stages: []
  }
};

export const DEMO_ORGANIZATIONS = [
  { id: "org_1", name: "AeroTech Dynamics", domain: "aerotechdynamics.io", industry: "Technology & SaaS", employees: 120, location: "Austin, TX" },
  { id: "org_2", name: "Apex Logistics Ltd", domain: "apexlogistics.com", industry: "Freight & Logistics", employees: 450, location: "Chicago, IL" },
  { id: "org_3", name: "Summit Health Group", domain: "summithealth.org", industry: "Allied Health", employees: 85, location: "Denver, CO" },
  { id: "org_4", name: "Vanguard Built", domain: "vanguardbuilt.com", industry: "Construction", employees: 210, location: "Phoenix, AZ" },
  { id: "org_5", name: "Horizon Legal & Advisory", domain: "horizonadvisory.net", industry: "Professional Services", employees: 40, location: "San Francisco, CA" }
];

export const DEMO_CONTACTS = [
  {
    id: "c_demo_1",
    contactName: "Sarah Jenkins",
    firstName: "Sarah",
    lastName: "Jenkins",
    company: "AeroTech Dynamics",
    organizationId: "org_1",
    email: "s.jenkins@aerotechdynamics.io",
    phone: "+1 (512) 892-4102",
    location: "Austin, TX",
    priority: "High",
    authority: "Decision Maker",
    callStatus: "Qualified",
    attempts: 4,
    conversations: 2,
    lastCallDate: "2026-08-14T15:30:00Z",
    lastOutcome: "Demo Booked",
    nextCallDate: "2026-08-18T10:00:00Z",
    notes: "Very interested in automated call queuing and multi-tenant workspace separation.",
    tags: ["High Intent", "SaaS Prospect", "Demo Scheduled"],
    aiScore: 92,
    aiSummary: "High-intent prospect. Requested customized demo of AI lead summaries and workflow automation."
  },
  {
    id: "c_demo_2",
    contactName: "Marcus Vance",
    firstName: "Marcus",
    lastName: "Vance",
    company: "Apex Logistics Ltd",
    organizationId: "org_2",
    email: "m.vance@apexlogistics.com",
    phone: "+1 (312) 554-9182",
    location: "Chicago, IL",
    priority: "High",
    authority: "Influencer",
    callStatus: "Follow Up Required",
    attempts: 3,
    conversations: 1,
    lastCallDate: "2026-08-12T11:15:00Z",
    lastOutcome: "Requested Information",
    nextCallDate: "2026-08-16T14:30:00Z",
    notes: "Reviewing pricing proposals with executive board. Send contract terms.",
    tags: ["Proposal Stage", "Logistics"],
    aiScore: 78,
    aiSummary: "Moderate decision authority. Needs executive proposal follow-up by Friday."
  },
  {
    id: "c_demo_3",
    contactName: "Dr. Elena Rostova",
    firstName: "Elena",
    lastName: "Rostova",
    company: "Summit Health Group",
    organizationId: "org_3",
    email: "elena.r@summithealth.org",
    phone: "+1 (303) 781-2290",
    location: "Denver, CO",
    priority: "Medium",
    authority: "Decision Maker",
    callStatus: "Cold",
    attempts: 1,
    conversations: 0,
    lastCallDate: "2026-08-10T09:00:00Z",
    lastOutcome: "Voicemail",
    nextCallDate: "2026-08-17T11:00:00Z",
    notes: "Left voicemail introducing Orbit CRM's compliance and patient lead tracking.",
    tags: ["Cold Outreach", "Healthcare"],
    aiScore: 62,
    aiSummary: "Initial touchpoint complete. Recommend follow-up email with case study."
  },
  {
    id: "c_demo_4",
    contactName: "David Miller",
    firstName: "David",
    lastName: "Miller",
    company: "Vanguard Built",
    organizationId: "org_4",
    email: "d.miller@vanguardbuilt.com",
    phone: "+1 (602) 431-8821",
    location: "Phoenix, AZ",
    priority: "High",
    authority: "Decision Maker",
    callStatus: "Qualified",
    attempts: 5,
    conversations: 3,
    lastCallDate: "2026-08-14T16:45:00Z",
    lastOutcome: "Needs proposal",
    nextCallDate: "2026-08-19T13:00:00Z",
    notes: "Contract negotiations in progress for 15 sales seat licenses.",
    tags: ["Closing Soon", "Construction Enterprise"],
    aiScore: 89,
    aiSummary: "High-value enterprise opportunity. Proposal review scheduled."
  }
];

export const DEMO_LEADS = [
  {
    id: "lead_demo_1",
    title: "AeroTech Dynamics — 10 Seat License",
    contactId: "c_demo_1",
    organizationId: "org_1",
    stage: "proposal",
    dealValue: 4800,
    oneOff: 1200,
    mrr: 300,
    status: "Active",
    priority: "High",
    deal: { contractStatus: "Sent", paymentStatus: "Pending" },
    createdAt: "2026-08-01T10:00:00Z",
    aiRisk: "Low Risk. High engagement with live demo request."
  },
  {
    id: "lead_demo_2",
    title: "Apex Logistics — Enterprise Pipeline Rollout",
    contactId: "c_demo_2",
    organizationId: "org_2",
    stage: "negotiation",
    dealValue: 12500,
    oneOff: 3500,
    mrr: 750,
    status: "Active",
    priority: "High",
    deal: { contractStatus: "Draft", paymentStatus: "None" },
    createdAt: "2026-07-20T14:00:00Z",
    aiRisk: "Medium Risk. Stalled in negotiation for 8 days. Follow-up required."
  },
  {
    id: "lead_demo_3",
    title: "Summit Health — Clinical CRM Integration",
    contactId: "c_demo_3",
    organizationId: "org_3",
    stage: "contacted",
    dealValue: 3200,
    oneOff: 800,
    mrr: 200,
    status: "Active",
    priority: "Medium",
    deal: { contractStatus: "Not sent", paymentStatus: "None" },
    createdAt: "2026-08-08T09:30:00Z",
    aiRisk: "Low Risk. Early stage discovery."
  },
  {
    id: "lead_demo_4",
    title: "Vanguard Built — Field Outreach Automation",
    contactId: "c_demo_4",
    organizationId: "org_4",
    stage: "qualified",
    dealValue: 8400,
    oneOff: 2400,
    mrr: 500,
    status: "Active",
    priority: "High",
    deal: { contractStatus: "Under Review", paymentStatus: "None" },
    createdAt: "2026-08-05T11:20:00Z",
    aiRisk: "Low Risk. Strong commitment from CTO."
  }
];

export const DEMO_TASKS = [
  {
    id: "t_demo_1",
    title: "Conduct custom AI workflow demo with Sarah (AeroTech)",
    contactId: "c_demo_1",
    leadId: "lead_demo_1",
    dueDate: new Date().toISOString().slice(0, 10),
    dueTime: "10:00",
    status: "open",
    priority: "High",
    notes: "Show AI lead scoring and zero-latency contact search."
  },
  {
    id: "t_demo_2",
    title: "Send updated enterprise proposal to Marcus Vance",
    contactId: "c_demo_2",
    leadId: "lead_demo_2",
    dueDate: new Date().toISOString().slice(0, 10),
    dueTime: "14:30",
    status: "open",
    priority: "High",
    notes: "Include multi-tenant RBAC permissions summary sheet."
  },
  {
    id: "t_demo_3",
    title: "Follow up with Dr. Elena regarding clinical trial contacts",
    contactId: "c_demo_3",
    leadId: "lead_demo_3",
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    dueTime: "11:00",
    status: "open",
    priority: "Medium",
    notes: "Send medical logistics case study."
  }
];

export const DEMO_ACTIVITIES = [
  {
    id: "act_demo_1",
    contactId: "c_demo_1",
    type: "call",
    date: "2026-08-14T15:30:00Z",
    outcome: "Demo Booked",
    notes: "Great 15-minute call. Discussed automated outreach and DNC filtering.",
    person: "You"
  },
  {
    id: "act_demo_2",
    contactId: "c_demo_2",
    type: "email",
    date: "2026-08-12T11:15:00Z",
    outcome: "Requested Information",
    notes: "Sent pricing brochure and multi-tenant security architecture documentation.",
    person: "You"
  }
];
