const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function buildSchemeContext({ profile, recommendations }) {
  const schemeSummary = recommendations
    .slice(0, 5)
    .map((scheme, index) => {
      return `${index + 1}. ${scheme.title}
Category: ${scheme.category}
Match score: ${scheme.score}%
Benefit: ${scheme.benefit}
Documents: ${scheme.documents.join(', ')}
Why matched: ${scheme.reasons.join(', ')}`;
    })
    .join('\n\n');

  return `User profile:
- Age: ${profile.age}
- Annual income: Rs. ${Number(profile.income).toLocaleString('en-IN')}
- State: ${profile.state}
- Gender: ${profile.gender}
- Occupation: ${profile.occupation}
- Education: ${profile.education}

Recommended schemes:
${schemeSummary || 'No local recommendations found.'}`;
}

function buildConversation(messages) {
  return messages
    .slice(-8)
    .map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text}`)
    .join('\n');
}

function extractGeminiText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((part) => part.text).filter(Boolean).join('\n').trim();

  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return text;
}

export async function askGemini({ userMessage, messages, profile, recommendations, responseLanguage = 'English' }) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.');
  }

  const prompt = `You are SchemeWise AI, a helpful assistant for an Indian Government Scheme Finder app.
Explain schemes in simple, citizen-friendly ${responseLanguage}. Be concise and practical.
Use the user's profile and recommended schemes below. Do not invent official rules.
If the user asks for legal certainty, tell them to verify on the official portal.

${buildSchemeContext({ profile, recommendations })}

Recent conversation:
${buildConversation(messages)}

User's latest question:
${userMessage}

Answer in simple ${responseLanguage} with clear next steps.`;

  const response = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.35,
        topP: 0.9,
        maxOutputTokens: 450
      }
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return extractGeminiText(data);
}
