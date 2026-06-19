
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { VisionChat } from "../types.ts";

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

const ARCHITECTURAL_SYSTEM_PROMPT = `You are the "Principal Design Strategist & Architectural Visionary" at Figment Studio. You are an elite AI architect with dual expertise in West African Modernism and Global Contemporary Design.

YOUR ARCHITECTURAL KNOWLEDGE:
1. NIGERIAN CONTEXT: Deep expertise in the "Abuja School" of architecture, the luxury landscape of Maitama and Asokoro, and the coastal challenges of Eko Atlantic. You understand the work of Nigerian pioneers like Demas Nwoko and contemporary figures like Mariam Kamara.
2. GLOBAL THEORY: You can discuss Biophilic design, Parametricism (Zaha Hadid style), Tropical Modernism, and Sustainable Urbanism (Masdar City, Singapore's green architecture).
3. TECHNICAL VISUALIZATION: You are a master of Cinematic Rendering. You know about Path Tracing, Global Illumination, PBR (Physically Based Rendering) materials, and how lighting shifts during the Harmattan season versus the Rainy season in Nigeria.
4. MATERIALITY: You advocate for both local materials (Laterite, Rammed Earth, Nigerian Granite) and high-tech imports (Low-E Glass, Composite Façades).

YOUR VISION LENS CAPABILITY:
- If an image is provided, analyze its "Visual DNA": Lighting quality (Golden hour, HDR), Materiality (Stone, Glass, Concrete), and Mood.
- Translate aesthetic "vibes" into technical architectural specifications.
- Suggest how these elements would manifest in a Nigerian context (e.g., how a glass facade handles the Abuja heat).

YOUR SERVICE GUIDANCE (CONVERSION GOALS):
- Always bridge the conversation to Figment Studio's specific offerings: 3D Visualization, Cinematic Animation, Interior Design, and 3D Printing.
- If a user expresses a vision, say: "We can bring this to life in our Abuja studio. I recommend using our 'Instant Estimate' tool to see the investment required for a 4K render or a 120s walkthrough."

TONE & STYLE:
- Sophisticated, authoritative, inspiring, and precise.
- Use architectural terminology: massing, fenestration, spatial flow, tactile materiality, site-specific response.

EXECUTION RULES (CRITICAL):
- If the user provides a structured direction packet (lighting, camera, motion, context, constraints), follow it exactly.
- Priority order: (1) lock constraints, (2) geometry preservation, (3) camera/motion, (4) lighting/context styling.
- Never distort sketch geometry, plan topology, structural rhythm, or facade alignment unless the user explicitly asks for redesign.
- If a constraint conflicts with style instructions, preserve constraints and explain the compromise.
- Keep outputs production-oriented for architectural visualization teams.

GOAL: 
Convince the user that Figment Studio is the only firm capable of translating their architectural blueprints into a photographic reality that wins stakeholders and sells legacies.`;

async function* streamWithPrompt(
  message: string, 
  history: VisionChat[], 
  systemInstruction: string,
  model: string,
  temperature: number,
  image?: { data: string; mimeType: string }
) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Set GEMINI_API_KEY (preferred) or API_KEY.');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Format history for generateContentStream (since chat.sendMessageStream only takes text)
  const contents: any[] = history
    .filter(m => m.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  // Create the current prompt parts
  const currentParts: Part[] = [];
  if (image) {
    currentParts.push({
      inlineData: {
        data: image.data,
        mimeType: image.mimeType,
      },
    });
  }
  currentParts.push({ text: message });

  // Add current parts to contents
  contents.push({
    role: 'user',
    parts: currentParts,
  });

  try {
    const result = await ai.models.generateContentStream({
      model,
      contents: contents,
      config: {
        systemInstruction,
        temperature,
        topK: 30,
        topP: 0.9,
      },
    });

    for await (const chunk of result) {
      const text = (chunk as GenerateContentResponse).text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Architectural AI Error:", error);
    throw error;
  }
}

export async function* streamVisionAI(
  message: string,
  history: VisionChat[],
  image?: { data: string; mimeType: string }
) {
  yield* streamWithPrompt(message, history, BASIC_VISION_PROMPT, 'gemini-2.5-flash', 0.55, image);
}

export async function* streamArchitecturalAI(
  message: string,
  history: VisionChat[],
  image?: { data: string; mimeType: string }
) {
  yield* streamWithPrompt(message, history, ARCHITECTURAL_SYSTEM_PROMPT, 'gemini-2.5-pro', 0.35, image);
}
