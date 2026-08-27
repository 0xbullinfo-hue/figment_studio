import { GoogleGenAI } from '@google/genai';

const BASIC_VISION_PROMPT = `You are the Figment Studio Assistant, an intelligent support and design assistant for the Figment Studio website (figmentstudio.ng).

STUDIO INFORMATION:
- Location: Abuja, Nigeria (serving Lagos, nationwide, and international clients)
- Services:
  • 3D Architectural Visualization (High-fidelity stills: starting around $75 per view / tier-based)
  • Cinematic 3D Walkthrough Animation (starts around $300 per 60 seconds)
  • Physical Scale Models & 3D Printing ($500 per 300m²)
  • Academy Masterclasses (Revit + D5 Render, Advanced Photorealism)
- Process: Brief & Scope → Scene Direction & Camera Lock → Client Review → Final 4K+ Delivery
- Timelines: Standard 7–14 business days, Urgent 3–6 business days (30% expedited surcharge)
- Contact: hello@figmentstudio.ng | WhatsApp / Phone: +234 816 829 9111
- Social: @figment_cs (Instagram, Twitter/X, TikTok)

YOUR ROLE:
- Answer questions about Figment Studio services, pricing estimates, workflow, and timelines.
- Help clients brainstorm and refine interior/exterior design ideas, mood concepts, color palettes, and lighting styles (especially when an image is attached).
- Guide users to the Estimator tool (/estimator) for detailed instant quotes.
- Encourage users to submit proposals or start projects via /contact or /estimator.
- Be warm, confident, professional, and articulate.
- Mention that human consultation and custom scopes are always available via hello@figmentstudio.ng.

GUIDELINES:
- When discussing pricing, reference the standard rates above and mention that the Estimator gives custom line-item totals.
- If an image or sketch is provided, offer thoughtful visual feedback on style, lighting, material harmony, and atmosphere.
- Always provide helpful, structured, easy-to-read responses.`;


function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY (preferred) or API_KEY.');
  }
  return apiKey;
}

function mapHistory(history = []) {
  return history
    .filter((msg) => msg && msg.role !== 'system' && typeof msg.content === 'string')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
}

function buildUserParts(message, image) {
  const parts = [];
  if (image?.data && image?.mimeType) {
    parts.push({
      inlineData: {
        data: String(image.data),
        mimeType: String(image.mimeType),
      },
    });
  }
  parts.push({ text: String(message || '') });
  return parts;
}

async function generateWithPrompt({ message, history, image, systemInstruction, model, temperature }) {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });
  const contents = mapHistory(history);
  contents.push({ role: 'user', parts: buildUserParts(message, image) });

  const result = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction,
      temperature,
      topK: 30,
      topP: 0.9,
    },
  });

  return result.text || '';
}

export async function generateVisionReply({ message, history, image }) {
  return generateWithPrompt({
    message,
    history,
    image,
    systemInstruction: BASIC_VISION_PROMPT,
    model: 'gemini-2.5-flash',
    temperature: 0.55,
  });
}

export async function generateArchitecturalReply({ message, history, image }) {
  return generateWithPrompt({
    message,
    history,
    image,
    systemInstruction: ARCHITECTURAL_SYSTEM_PROMPT,
    model: 'gemini-2.5-pro',
    temperature: 0.35,
  });
}
