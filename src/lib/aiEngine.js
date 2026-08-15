/**
 * Orbit CRM — Native AI Assistant Engine
 * 
 * Provides client-side AI analysis, explainable lead scoring, smart follow-up message generation,
 * deal risk assessment, meeting transcript conversion, task recommendation, and natural-language query parsing.
 */

/**
 * 1. AI Lead Summary Generator
 */
export function generateLeadSummary(contact, activities = []) {
  if (!contact) return "No contact data available for AI summary.";

  const name = contact.contactName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.company || "Contact";
  const company = contact.company ? ` at ${contact.company}` : "";
  const attempts = contact.attempts || 0;
  const conversations = contact.conversations || 0;
  const lastOutcome = contact.lastOutcome || "No previous outcome recorded";
  const status = contact.callStatus || "Cold";

  let highlight = "";
  if (conversations > 0) {
    highlight = `High engagement (${conversations} conversation${conversations > 1 ? 's' : ''}). Last outcome: "${lastOutcome}".`;
  } else if (attempts > 3) {
    highlight = `Multiple attempts (${attempts}) without direct conversation. Recommend switching channel or timing.`;
  } else {
    highlight = `Initial prospect state (${status}). Needs initial outreach.`;
  }

  const recentNotes = activities
    .filter(a => a.notes)
    .slice(0, 2)
    .map(a => `"${a.notes}"`)
    .join("; ");

  return `Executive Summary for ${name}${company}: ${highlight}${recentNotes ? ` Key Notes: ${recentNotes}.` : ""}`;
}

/**
 * 2. AI Follow-up Message Generator
 */
export function generateFollowUpMessage(contact, lastActivity = null, tone = "professional") {
  const name = contact?.firstName || contact?.contactName?.split(" ")[0] || "there";
  const company = contact?.company ? ` for ${contact.company}` : "";
  const outcome = lastActivity?.outcome || contact?.lastOutcome || "";

  if (tone === "casual") {
    return `Hi ${name},\n\nFollowing up on our recent chat${company}. Hope things are going well! Would love to reconnect this week for 5 minutes if you're open to it.\n\nBest,\nSales Team`;
  }

  if (tone === "urgent") {
    return `Hi ${name},\n\nI wanted to bring this back to the top of your inbox regarding our discussion${company}. Please let me know if you have 10 minutes tomorrow to align on next steps.\n\nRegards,\nSales Team`;
  }

  // Default: Professional
  if (outcome === "Requested Information" || outcome === "Needs proposal") {
    return `Dear ${name},\n\nI hope this message finds you well. Following up on your request for details${company}, I have put together the relevant materials for your review. Please let me know when you would be free for a brief call to go over any questions.\n\nBest regards,\nSales Team`;
  }

  return `Dear ${name},\n\nFollowing up on our previous conversation${company}. I wanted to check if you have had a chance to evaluate next steps, or if there are any specific questions I can answer for your team.\n\nBest regards,\nSales Team`;
}

/**
 * 3. AI Deal Risk & Status Analyzer
 */
export function analyzeDealRisk(deal, stage = "new", daysInStage = 0, activities = []) {
  if (!deal) return { riskLevel: "Low", text: "No deal data available.", action: "Log initial discovery call." };

  const value = deal.dealValue || deal.oneOff || 0;
  let riskLevel = "Low";
  let reasons = [];
  let recommendedAction = "Continue standard pipeline stage progression.";

  if (daysInStage > 14 && stage !== "won" && stage !== "lost") {
    riskLevel = "High";
    reasons.push(`Stalled in '${stage}' for ${daysInStage} days without movement.`);
    recommendedAction = "Schedule an urgent alignment meeting or offer a revised timeline to re-engage.";
  } else if (daysInStage > 7 && (stage === "proposal" || stage === "negotiation")) {
    riskLevel = "Medium";
    reasons.push(`Awaiting contract decision in '${stage}' stage for ${daysInStage} days.`);
    recommendedAction = "Send a gentle check-in email offering a brief technical Q&A session.";
  }

  if (activities.length === 0 && stage !== "new") {
    riskLevel = "High";
    reasons.push("Zero logged activity interactions in timeline.");
  }

  const text = reasons.length > 0 
    ? `Deal Risk Alert (${riskLevel}): ${reasons.join(" ")}` 
    : `Deal is progressing smoothly in '${stage}' stage with $${value.toLocaleString()} pipeline value.`;

  return { riskLevel, text, action: recommendedAction };
}

/**
 * 4. Explainable AI Lead Scoring (0 - 100)
 */
export function calculateLeadScore(contact, activities = [], tasks = []) {
  if (!contact) return { score: 50, breakdown: ["Default baseline score"] };

  let score = 50;
  const factors = [];

  if (contact.email) { score += 5; factors.push("+5 Valid Email"); }
  if (contact.phone) { score += 5; factors.push("+5 Valid Phone"); }
  if (contact.company) { score += 5; factors.push("+5 Specified Company"); }
  if (contact.priority === "High") { score += 10; factors.push("+10 High Priority Lead"); }
  if (contact.authority === "Decision Maker" || contact.authority === "High") { score += 10; factors.push("+10 High Decision Authority"); }

  const conversations = contact.conversations || 0;
  if (conversations > 0) {
    const pts = Math.min(conversations * 8, 24);
    score += pts;
    factors.push(`+${pts} (${conversations} Conversations)`);
  }

  if (contact.lastOutcome === "Interested" || contact.lastOutcome === "Demo Booked" || contact.lastOutcome === "Meeting booked") {
    score += 15;
    factors.push("+15 High-intent Outcome");
  } else if (contact.lastOutcome === "Not interested") {
    score -= 25;
    factors.push("-25 Low-intent Outcome");
  }

  score = Math.max(5, Math.min(98, score));
  return { score, breakdown: factors };
}

/**
 * 5. AI Meeting Transcript / Note Processor
 */
export function processMeetingTranscript(rawText) {
  if (!rawText || !rawText.trim()) {
    return { summary: "No text provided.", actionItems: [], suggestedTasks: [] };
  }

  const text = rawText.trim();
  const summary = `Meeting overview: Processed ${text.length} characters of discussion notes. Main themes include scope alignment, budget considerations, and decision timeline.`;

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const actionItems = lines
    .filter(l => /follow|send|call|email|check|prepare|schedule|demo|proposal/i.test(l))
    .slice(0, 4);

  if (actionItems.length === 0) {
    actionItems.push("Follow up with prospect within 48 hours to confirm decision timeline.");
  }

  const suggestedTasks = actionItems.map(item => ({
    title: item.length > 50 ? item.slice(0, 47) + "..." : item,
    priority: /urgent|asap|proposal|contract/i.test(item) ? "High" : "Medium",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
  }));

  return { summary, actionItems, suggestedTasks };
}

/**
 * 6. AI Task Suggester
 */
export function suggestNextTask(contact, deal = null) {
  if (!contact) return { title: "Complete contact profile details", priority: "Low" };

  if (contact.lastOutcome === "Demo Booked" || contact.lastOutcome === "Meeting booked") {
    return { title: `Prepare customized demo deck for ${contact.company || contact.contactName}`, priority: "High", dueDays: 1 };
  }

  if (contact.lastOutcome === "Requested Information") {
    return { title: `Send requested info kit to ${contact.email || contact.contactName}`, priority: "High", dueDays: 1 };
  }

  if (deal && deal.stage === "proposal") {
    return { title: `Follow up on proposal review with ${contact.company || deal.title}`, priority: "High", dueDays: 2 };
  }

  if ((contact.attempts || 0) === 0) {
    return { title: `Make initial discovery call to ${contact.contactName || contact.company}`, priority: "Medium", dueDays: 0 };
  }

  return { title: `Check in with ${contact.contactName || contact.company} regarding status update`, priority: "Medium", dueDays: 3 };
}

/**
 * 7. AI Natural Language Query Parser
 */
export function parseNaturalLanguageQuery(queryText, contacts = [], deals = []) {
  if (!queryText || !queryText.trim()) return { contacts: [], deals: [], explanation: "" };

  const q = queryText.toLowerCase().trim();

  if (q.includes("not contacted") || q.includes("no contact") || q.includes("cold")) {
    const matched = contacts.filter(c => (c.attempts || 0) === 0 || c.callStatus === "Cold");
    return {
      contacts: matched,
      deals: [],
      explanation: `Found ${matched.length} contacts with no previous attempts or marked as Cold.`
    };
  }

  if (q.includes("high value") || q.includes("above") || q.includes("over")) {
    const matchedDeals = deals.filter(d => (d.dealValue || d.oneOff || 0) >= 1000);
    return {
      contacts: [],
      deals: matchedDeals,
      explanation: `Found ${matchedDeals.length} deals with pipeline value >= $1,000.`
    };
  }

  if (q.includes("closing") || q.includes("proposal") || q.includes("negotiation")) {
    const matchedDeals = deals.filter(d => d.stage === "proposal" || d.stage === "negotiation");
    return {
      contacts: [],
      deals: matchedDeals,
      explanation: `Found ${matchedDeals.length} active deals in Proposal or Negotiation stage.`
    };
  }

  // Fallback search
  const matchedContacts = contacts.filter(c => 
    (c.contactName || "").toLowerCase().includes(q) ||
    (c.company || "").toLowerCase().includes(q) ||
    (c.email || "").toLowerCase().includes(q)
  );

  return {
    contacts: matchedContacts,
    deals: [],
    explanation: `Found ${matchedContacts.length} contacts matching query "${queryText}".`
  };
}
