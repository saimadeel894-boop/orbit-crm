/**
 * Orbit CRM — Gemini API Integration Service
 * 
 * Securely handles calls to Google Gemini API for live lead summaries, smart follow-up drafts,
 * deal risk explanations, and transcript processing.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "fg-3fa26b0762be433a92c739fb76e596b7";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Call Gemini API with fallback handling
 */
export async function callGemini(promptText) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing.");
  }

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error("No text content returned from Gemini API.");
    }

    return generatedText.trim();
  } catch (err) {
    console.warn("Gemini API call failed, falling back to local AI engine:", err.message);
    throw err;
  }
}

/**
 * Generate AI Lead Summary using Gemini API
 */
export async function generateGeminiLeadSummary(contactName, company, lastOutcome, notes) {
  const prompt = `You are a senior CRM AI assistant. Summarize this lead in 2 clear sentences with actionable next steps:
Lead Name: ${contactName || "Unknown"}
Company: ${company || "Unspecified"}
Last Outcome: ${lastOutcome || "None"}
Notes: ${notes || "None"}`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    return null;
  }
}

/**
 * Generate Smart Email / Follow-up using Gemini API
 */
export async function generateGeminiFollowUp(contactName, company, tone = "professional") {
  const prompt = `Write a high-converting ${tone} sales follow-up message for ${contactName} at ${company}. Keep it concise (under 80 words) with a single clear call-to-action.`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    return null;
  }
}
