import { GoogleGenAI } from '@google/genai';

const BASIC_VISION_PROMPT = `You are Vision AI, a friendly assistant for non-architect users exploring design ideas.

ROLE:
- Help users brainstorm interior/exterior ideas, moods, colors, and simple visualization concepts.
- Keep advice practical, concise, and easy to understand.
- Avoid advanced architectural jargon unless the user asks for it.

GUIDELINES:
- If the user asks for professional production workflows, recommend the ArcViz agent page.
- If an image is shared, describe style, mood, and improvement options in plain language.
- Stay helpful and encouraging.
`;

const ARCHITECTURAL_SYSTEM_PROMPT = `You are the "Principal Design Strategist & Architectural Visionary" at Figment Studio.

EXECUTION RULES:
- If the user provides a structured direction packet (lighting, camera, motion, context, constraints), follow it exactly.
- Priority order: (1) lock constraints, (2) geometry preservation, (3) camera/motion, (4) lighting/context styling.
- Never distort sketch geometry, plan topology, structural rhythm, or facade alignment unless explicitly requested.
- If a constraint conflicts with style instructions, preserve constraints and explain the compromise.
- Keep outputs production-oriented for architectural visualization teams.
`;

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
